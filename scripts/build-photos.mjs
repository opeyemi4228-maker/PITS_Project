/**
 * Derives the web-ready photographs from the campaign's own images.
 *
 * What the campaign supplied is in assets/_src: three 720px portraits of
 * Prince Adewole Adebayo from one sitting, and fourteen 2000px photographs of
 * Nigeria — the places and the people the eight pillars are about. The
 * originals are larger than any slot on the site, so this script writes
 * WebP derivatives into assets/photos/.
 *
 * Run it with `npm run photos:build` (or pass another folder as the first
 * argument). It is idempotent, and the outputs are committed, so a normal
 * build never needs it — it exists so the selection and the sizing are a
 * recorded derivation.
 */

import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "assets", "photos");

/* The largest any slot renders is a full-bleed page header on a 2x screen,
   and that sits under a 75% scrim. 2000px on the long edge is honest there. */
const LONG_EDGE = 2000;

const PHOTOS = [
  // The candidate, one sitting, all in white agbada and fila
  ["prince-adebayo-portrait.jpg", "adebayo-pointing.webp"],
  ["prince-adebayo-speaking.jpg", "adebayo-speaking.webp"],
  ["prince-adebayo-resolve.jpg", "adebayo-resolve.webp"],
  // The country
  ["nigeria-aso-rock.jpg", "ng-aso-rock.webp"],
  ["nigeria-assembly.jpg", "ng-assembly.webp"],
  ["nigeria-beach.jpg", "ng-beach.webp"],
  ["nigeria-bridge-night.jpg", "ng-bridge-night.webp"],
  ["nigeria-farmer.jpg", "ng-farmer.webp"],
  ["nigeria-lagos.jpg", "ng-lagos.webp"],
  ["nigeria-lekki.jpg", "ng-lekki.webp"],
  ["nigeria-market.jpg", "ng-market.webp"],
  ["nigeria-nurse.jpg", "ng-nurse.webp"],
  ["nigeria-police.jpg", "ng-police.webp"],
  ["nigeria-pupils.jpg", "ng-pupils.webp"],
  ["nigeria-rail.jpg", "ng-rail.webp"],
  ["nigeria-rice.jpg", "ng-rice.webp"],
  ["nigeria-unilag.jpg", "ng-unilag.webp"],
];

const source = process.argv[2] ?? path.join(root, "assets", "_src");

await mkdir(outDir, { recursive: true });

console.log("Photographs");
for (const [file, out] of PHOTOS) {
  const target = path.join(outDir, out);
  const info = await sharp(path.join(source, file))
    .rotate()
    .resize(LONG_EDGE, LONG_EDGE, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(target);
  const { size } = await stat(target);
  console.log(`  assets/photos/${out}  ${info.width}x${info.height}  ${(size / 1024).toFixed(0)}kB`);
}
console.log("Done.");
