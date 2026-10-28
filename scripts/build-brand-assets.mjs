/**
 * Derives the web-ready brand assets from the supplied master artwork.
 *
 * The Amvora master is a 2532x2532 PNG: the torch-and-figures symbol and the
 * "AMVORALIGHT / POWER IS IN THE STREETS" lockup, set on a white disc with a
 * grey satin sheen, on a transparent square. Dropped in unchanged, the disc
 * paints a white plate behind the mark on any surface that is not white —
 * most visibly the ink-950 footer.
 *
 * The sheen is why this is not a plain "near-white is background" pass: it
 * runs down to a grey of about 200, darker than the antialiased edges of the
 * artwork. What separates the two is colour, not lightness — the sheen is
 * neutral and the flame and figures are saturated orange, red and black. So a
 * pixel is background when it is both light and neutral.
 *
 * Run it with `npm run brand:build`. It is idempotent, and the outputs are
 * committed, so a normal build never needs it — it exists so the crop is a
 * recorded derivation rather than a thing somebody once did in Preview.
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/* Where the masters live. Kept in assets/ alongside the outputs so the
   derivation can be re-run from a clean checkout. */
const AMVORA_MASTER = path.join(root, "assets", "amvora-master.png");

/* A pixel is artwork if it is saturated (the flame, the shirts) or darker than
   the darkest of the sheen (the figures, the type). Measured on the master:
   the sheen sits between 200 and 255 with almost no chroma. */
const CHROMA_INK = 36;
const INK_THRESHOLD = 180;

/* The alpha ramp, for neutral pixels only. Above SOLID_BACKGROUND a pixel is
   disc; below FULLY_OPAQUE it is artwork; between the two it is an
   antialiased edge and gets proportional alpha. Without the ramp every curve
   in the mark gets a hard, jagged edge at masthead size. */
const SOLID_BACKGROUND = 198;
const FULLY_OPAQUE = 150;

/* What an edge pixel was blended against: the sheen's mid grey, not white. */
const PAPER = 228;

async function readRaw(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

const isInk = ({ data, channels }, x, y, width) => {
  const i = (y * width + x) * channels;
  if (data[i + 3] < 24) return false;
  const lo = Math.min(data[i], data[i + 1], data[i + 2]);
  const hi = Math.max(data[i], data[i + 1], data[i + 2]);
  return hi - lo > CHROMA_INK || lo < INK_THRESHOLD;
};

/** Tight bounding box of the artwork inside `rows`, or null if there is none. */
function contentBox(raw, y0, y1) {
  const { width } = raw;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (let y = y0; y <= y1; y++) {
    for (let x = 0; x < width; x++) {
      if (!isInk(raw, x, y, width)) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return maxX < 0 ? null : { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/**
 * Rows of artwork separated by at least `minGap` blank rows.
 *
 * The Amvora master is three of these: the symbol, then "AMVORALIGHT", then
 * "POWER IS IN THE STREETS". Finding them by measurement rather than by
 * hard-coded pixel numbers means a re-supplied master with the lockup nudged
 * half a centimetre still cuts correctly.
 */
function horizontalBands(raw, minGap = 8) {
  const { width, height } = raw;
  const bands = [];
  let start = null;
  let gap = 0;

  for (let y = 0; y < height; y++) {
    let inked = false;
    for (let x = 0; x < width; x++) {
      if (isInk(raw, x, y, width)) {
        inked = true;
        break;
      }
    }

    if (inked) {
      if (start === null) start = y;
      gap = 0;
    } else if (start !== null) {
      gap++;
      if (gap >= minGap) {
        bands.push([start, y - gap]);
        start = null;
        gap = 0;
      }
    }
  }
  if (start !== null) bands.push([start, height - 1]);
  return bands;
}

/**
 * Replaces the disc with alpha.
 *
 * Edge pixels are un-premultiplied against the disc as well as made
 * translucent: a 50%-alpha pixel that was blended against the disc is half
 * artwork and half paper, so leaving its colour alone would keep the paper in
 * it and fringe every edge of the mark with grey — which is exactly what it
 * must not do on the dark footer. Saturated pixels are artwork outright.
 */
function whiteToAlpha(raw) {
  const { data, width, height, channels } = raw;
  const out = Buffer.alloc(width * height * 4);

  for (let p = 0; p < width * height; p++) {
    const i = p * channels;
    const o = p * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const srcAlpha = data[i + 3];
    const level = Math.min(r, g, b);
    const chroma = Math.max(r, g, b) - level;

    let alpha;
    if (chroma > CHROMA_INK || level <= FULLY_OPAQUE) alpha = 255;
    else if (level >= SOLID_BACKGROUND) alpha = 0;
    else alpha = Math.round((255 * (SOLID_BACKGROUND - level)) / (SOLID_BACKGROUND - FULLY_OPAQUE));

    alpha = Math.min(alpha, srcAlpha);

    if (alpha === 0) {
      out[o] = out[o + 1] = out[o + 2] = out[o + 3] = 0;
      continue;
    }

    const a = alpha / 255;
    const unmix = (c) => Math.max(0, Math.min(255, Math.round((c - PAPER * (1 - a)) / a)));
    out[o] = unmix(r);
    out[o + 1] = unmix(g);
    out[o + 2] = unmix(b);
    out[o + 3] = alpha;
  }

  return sharp(out, { raw: { width, height, channels: 4 } });
}

/** Crop, de-white and write, padding so the artwork never touches the edge. */
async function emit(raw, box, targetWidth, destinations, { pad = 0 } = {}) {
  const { width, height } = raw;
  const left = Math.max(0, box.left - pad);
  const top = Math.max(0, box.top - pad);
  const region = {
    left,
    top,
    width: Math.min(width - left, box.width + pad * 2),
    height: Math.min(height - top, box.height + pad * 2),
  };

  const png = await whiteToAlpha(raw)
    .extract(region)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();

  for (const dest of destinations) {
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(dest, png);
  }

  const meta = await sharp(png).metadata();
  console.log(
    `  ${path.relative(root, destinations[0])}  ${meta.width}x${meta.height}  ${(png.length / 1024).toFixed(1)}kB` +
      (destinations[1] ? `  (+${destinations.length - 1} copy)` : "")
  );
}

async function buildAmvora() {
  console.log("Amvora master");
  const raw = await readRaw(AMVORA_MASTER);
  /* 20, not the default 8: the flame floats ten pixels clear of the torch, and
     at 8 it is cut away as a band of its own. The gaps above the two lines of
     type are 38 and 31. */
  const bands = horizontalBands(raw, 20);

  if (bands.length < 2) {
    throw new Error(
      `Expected the Amvora master to hold a symbol above at least one line of type, found ${bands.length} band(s).`
    );
  }

  /* Band 0 is the symbol. Everything after it is the lockup type, which is
     set in black and so is unusable on a dark surface — the masthead and footer
     take the symbol alone and set the movement's name in live type beside it. */
  const [symbolStart, symbolEnd] = bands[0];
  const symbol = contentBox(raw, symbolStart, symbolEnd);
  const full = contentBox(raw, bands[0][0], bands.at(-1)[1]);

  await emit(raw, symbol, 1200, [
    path.join(root, "assets", "amvora-mark.png"),
    path.join(root, "public", "amvora-mark.png"),
  ]);

  await emit(raw, full, 1400, [path.join(root, "assets", "amvora-logo.png")], { pad: 8 });
}

/**
 * The mark reversed, for dark surfaces.
 *
 * The figures and the torch are black, so on the ink-950 footer the symbol is
 * a flame and three shirts floating over nothing. Here every neutral pixel is
 * turned white at its own alpha, and the orange and red are left alone, so the
 * reversed mark keeps the same colour and loses only the black.
 */
async function buildAmvoraLight() {
  const src = path.join(root, "assets", "amvora-mark.png");
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const lo = Math.min(data[i], data[i + 1], data[i + 2]);
    const hi = Math.max(data[i], data[i + 1], data[i + 2]);
    if (hi - lo > CHROMA_INK) continue;
    data[i] = data[i + 1] = data[i + 2] = 255;
  }

  const png = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
  for (const dest of [
    path.join(root, "assets", "amvora-mark-light.png"),
    path.join(root, "public", "amvora-mark-light.png"),
  ]) {
    await writeFile(dest, png);
  }
  console.log(`  assets/amvora-mark-light.png  ${info.width}x${info.height}  ${(png.length / 1024).toFixed(1)}kB  (+1 copy)`);
}

await buildAmvora();
await buildAmvoraLight();
console.log("Done.");
