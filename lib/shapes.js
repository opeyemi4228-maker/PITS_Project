import { readFile } from "node:fs/promises";
import path from "node:path";

import { prisma } from "./db";

/**
 * The map outlines, read from the files `scripts/build-map.mjs` wrote.
 *
 * This was the same eighty lines in two pages and about to become three, which
 * is one page too many for a copy: the national map, a zone's states and a
 * state's local governments are the same operation with a different filter and
 * a different crop. They live here so that the projection, the name matching
 * and the bounding-box maths are decided once.
 *
 * Everything is a plain object by the time it leaves — `ResultsMap` is a client
 * component, so nothing here may hand it a function.
 *
 * Server only.
 */

const MAP_DIR = path.join(process.cwd(), "public", "geo", "map");

/* The projection's own canvas, and the fallback when a file is missing. Both
   come from the build script: Nigeria is wider than it is tall, the width is
   fixed at 1000 units and the height falls out of the aspect ratio. */
const CANVAS = { width: 1000, height: 812 };

async function readMap(file) {
  try {
    return JSON.parse(await readFile(path.join(MAP_DIR, file), "utf8"));
  } catch {
    /* A missing shape file is a map that cannot be drawn, not a page that
       cannot be served. Every caller checks `units.length` and falls back to
       the table, which carries the same figures with no geography in them. */
    return null;
  }
}

/**
 * Crop the viewBox to what is actually being drawn.
 *
 * A zone or a single state keeps the national projection — the shapes are not
 * re-projected, only the window onto them moves — so Rivers fills its frame
 * instead of sitting as a speck inside the bounding box of the whole country.
 */
function crop(units) {
  const box = units.reduce(
    (acc, unit) => {
      for (const match of unit.d.matchAll(/([ML])(-?[\d.]+) (-?[\d.]+)/g)) {
        const x = Number(match[2]);
        const y = Number(match[3]);
        acc.minX = Math.min(acc.minX, x);
        acc.maxX = Math.max(acc.maxX, x);
        acc.minY = Math.min(acc.minY, y);
        acc.maxY = Math.max(acc.maxY, y);
      }
      return acc;
    },
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  );

  if (!Number.isFinite(box.minX)) return { ...CANVAS, units };

  const pad = 12;
  const width = box.maxX - box.minX + pad * 2;
  const height = box.maxY - box.minY + pad * 2;

  return {
    viewBox: `${box.minX - pad} ${box.minY - pad} ${width} ${height}`,
    width,
    height,
    offsetX: box.minX - pad,
    offsetY: box.minY - pad,
    /* Scaled to the crop. A fixed 13px label is right on the national map and
       illegibly large on one local government. */
    labelSize: Math.max(6, width / 40),
    units,
  };
}

/**
 * State outlines.
 *
 * `only` is a list of state ids. Given one, the map is filtered to those states
 * and cropped to them — which is the whole of what a zone map is. Given
 * nothing, it is the federation, uncropped.
 */
export async function stateShapes({ hrefFor, only = null } = {}) {
  const data = await readMap("states.json");
  if (!data) return { ...CANVAS, units: [] };

  const states = await prisma.state.findMany({
    select: { id: true, code: true, name: true, slug: true },
  });
  const byCode = new Map(states.map((state) => [state.code, state]));
  const wanted = only ? new Set(only) : null;

  const units = data.states
    .map((shape) => {
      const state = byCode.get(shape.code);
      if (!state) return null;
      if (wanted && !wanted.has(state.id)) return null;
      return {
        id: state.id,
        name: state.name,
        d: shape.d,
        at: shape.at,
        href: hrefFor ? hrefFor(state) : null,
      };
    })
    .filter(Boolean);

  return only ? crop(units) : { width: data.width, height: data.height, labelSize: 13, units };
}

/**
 * One state's local government outlines.
 *
 * The build script assigned each ADM2 polygon to a state by point-in-polygon
 * rather than by name, so these are matched back to the register on a
 * normalised name — the two spelling conventions disagree often enough
 * ("Obio/Akpor" against "Obio Akpor") that an exact match would silently lose
 * local governments off the map.
 */
export async function lgaShapes(state, hrefFor) {
  const data = await readMap(`${state.code}.json`);
  if (!data) return { ...CANVAS, units: [] };

  const lgas = await prisma.lga.findMany({
    where: { stateId: state.id },
    select: { id: true, name: true },
  });

  const key = (name) => String(name).toLowerCase().replace(/[^a-z0-9]/g, "");
  const byName = new Map(lgas.map((lga) => [key(lga.name), lga]));

  const units = data.lgas
    .map((shape) => {
      const lga = byName.get(key(shape.name));
      return (
        lga && {
          id: lga.id,
          name: lga.name,
          d: shape.d,
          at: shape.at,
          href: hrefFor ? hrefFor(lga) : null,
        }
      );
    })
    .filter(Boolean);

  return crop(units);
}
