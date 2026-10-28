/**
 * Fills the constituency tables — the geography an election is contested in.
 *
 *   node scripts/seed-constituencies.mjs
 *   node scripts/seed-constituencies.mjs --file delimitation.json
 *   node scripts/seed-constituencies.mjs --clear
 *
 * ── WHAT THIS CAN WORK OUT ON ITS OWN, AND WHAT IT CANNOT ──────────────────
 * The 37 STATE constituencies are derivable from the register and nothing else:
 * a governorship is contested in one state, and the LGAs of that constituency
 * are exactly the LGAs of that state. Those are seeded here, completely and
 * correctly, with no external data.
 *
 * The 109 senatorial districts and 360 federal constituencies are NOT
 * derivable. Which LGAs make up Rivers South East, or which wards of Ikeja fall
 * into which federal constituency, is INEC delimitation data. It is published,
 * it is not in this repository, and it is not something a seed script may
 * guess: inventing a constituency boundary would silently produce a wrong
 * result for a real race, which is worse than producing none.
 *
 * So this script seeds what it knows and reports what it does not. Supply the
 * rest with `--file`, in this shape:
 *
 *   [
 *     {
 *       "type": "SENATORIAL",
 *       "code": "RIV-SE",
 *       "name": "Rivers South East",
 *       "state": "Rivers",
 *       "lgas": ["Khana", "Gokana", "Oyigbo", "Tai", "Eleme", "Opobo/Nkoro", "Andoni"],
 *       "wards": []
 *     }
 *   ]
 *
 * `lgas` are whole local governments in the constituency. `wards` is only for
 * the federal constituencies that split an LGA between two — everywhere else
 * leave it empty and the LGA list is the complete answer. Names are matched
 * against the register on a normalised form, so "Opobo/Nkoro" and "Opobo Nkoro"
 * both resolve; anything that does not match is reported rather than skipped
 * quietly.
 * ───────────────────────────────────────────────────────────────────────────
 */

import { readFile } from "node:fs/promises";

import { PrismaPg } from "@prisma/adapter-pg";
import { config as loadEnv } from "dotenv";

import { PrismaClient } from "../lib/generated/prisma/index.js";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

const args = process.argv.slice(2);
const CLEAR = args.includes("--clear");
const fileAt = args.indexOf("--file");
const FILE = fileAt !== -1 ? args[fileAt + 1] : null;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. See .env.example.");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

/* The register spells places one way and delimitation documents another
   ("Obio/Akpor" against "Obio Akpor", "Ile-Oluji/Okeigbo" against
   "Ile Oluji Okeigbo"). Everything is matched on this. */
const key = (name) => String(name).toLowerCase().replace(/[^a-z0-9]/g, "");

async function main() {
  if (CLEAR) {
    /* Membership rows cascade from the constituency, so one delete is enough.
       Candidates point at constituencies and would block it, which is correct:
       clearing the map out from under a seeded ballot should have to be
       deliberate. */
    const candidates = await prisma.candidate.count({ where: { constituencyId: { not: null } } });
    if (candidates > 0) {
      console.error(
        `\n${candidates} candidates are attached to constituencies. Remove them first — refusing to orphan a ballot.`
      );
      process.exit(1);
    }
    const { count } = await prisma.constituency.deleteMany({});
    console.log(`Cleared ${count} constituencies.`);
    return;
  }

  const states = await prisma.state.findMany({
    select: { id: true, code: true, name: true, lgas: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  });

  if (!states.length) {
    console.error("No states in the register. Run `node prisma/seed.mjs` first.");
    process.exit(1);
  }

  /* ── The 37 governorship constituencies ─────────────────────────────────
     One per state, containing every LGA of that state. Upserted on the code so
     re-running is safe and so a state whose LGA list has been corrected picks
     the correction up. */
  let created = 0;
  let refreshed = 0;

  for (const state of states) {
    const code = `${state.code}-GOV`;
    const existing = await prisma.constituency.findUnique({
      where: { code },
      select: { id: true },
    });

    const constituency = existing
      ? await prisma.constituency.update({
          where: { id: existing.id },
          data: { name: `${state.name} State`, type: "STATE", stateId: state.id },
        })
      : await prisma.constituency.create({
          data: { code, name: `${state.name} State`, type: "STATE", stateId: state.id },
        });

    existing ? (refreshed += 1) : (created += 1);

    /* Replace the membership rather than merge it: an LGA that has left a state
       in the register has to leave the constituency too. */
    await prisma.constituencyLga.deleteMany({ where: { constituencyId: constituency.id } });
    await prisma.constituencyLga.createMany({
      data: state.lgas.map((lga) => ({ constituencyId: constituency.id, lgaId: lga.id })),
      skipDuplicates: true,
    });
  }

  console.log(
    `\nGovernorship (STATE): ${created} created, ${refreshed} refreshed — ${states.length} constituencies, one per state.`
  );

  /* ── Everything else, from a supplied delimitation file ─────────────────── */
  if (!FILE) {
    const [senatorial, federal] = await Promise.all([
      prisma.constituency.count({ where: { type: "SENATORIAL" } }),
      prisma.constituency.count({ where: { type: "FEDERAL" } }),
    ]);

    console.log(`
Senatorial districts:      ${senatorial} of 109 seeded
Federal constituencies:    ${federal} of 360 seeded

Those two cannot be derived from the register — they are INEC delimitation
data. Supply them with:

    node scripts/seed-constituencies.mjs --file <delimitation.json>

Until then, senatorial and House of Representatives results aggregate by
geography rather than by constituency, which is wrong for those races. The
presidential and governorship contests are unaffected.`);
    return;
  }

  const raw = JSON.parse(await readFile(FILE, "utf8"));
  if (!Array.isArray(raw)) {
    console.error(`${FILE} must contain a JSON array.`);
    process.exit(1);
  }

  const byState = new Map(states.map((state) => [key(state.name), state]));
  const wardsOf = new Map();
  const problems = [];
  let done = 0;

  for (const entry of raw) {
    const type = String(entry.type ?? "").toUpperCase();
    if (type !== "SENATORIAL" && type !== "FEDERAL") {
      problems.push(`${entry.code ?? entry.name}: type must be SENATORIAL or FEDERAL`);
      continue;
    }

    const state = byState.get(key(entry.state));
    if (!state) {
      problems.push(`${entry.code ?? entry.name}: no state called "${entry.state}"`);
      continue;
    }

    const lgaByName = new Map(state.lgas.map((lga) => [key(lga.name), lga]));
    const lgaIds = [];
    for (const name of entry.lgas ?? []) {
      const lga = lgaByName.get(key(name));
      if (lga) lgaIds.push(lga.id);
      else problems.push(`${entry.code}: no LGA "${name}" in ${state.name}`);
    }

    /* Ward membership is loaded lazily and only for the states that need it —
       most constituencies do not split an LGA and never touch this. */
    const wardIds = [];
    if (entry.wards?.length) {
      if (!wardsOf.has(state.id)) {
        const rows = await prisma.ward.findMany({
          where: { lga: { stateId: state.id } },
          select: { id: true, name: true, code: true },
        });
        wardsOf.set(state.id, rows);
      }
      const rows = wardsOf.get(state.id);
      for (const name of entry.wards) {
        /* Matched on the INEC code first, because ward names repeat across
           LGAs within a state and a code never does. */
        const ward =
          rows.find((row) => row.code === name) ?? rows.find((row) => key(row.name) === key(name));
        if (ward) wardIds.push(ward.id);
        else problems.push(`${entry.code}: no ward "${name}" in ${state.name}`);
      }
    }

    const existing = await prisma.constituency.findUnique({
      where: { code: entry.code },
      select: { id: true },
    });

    const constituency = existing
      ? await prisma.constituency.update({
          where: { id: existing.id },
          data: { name: entry.name, type, stateId: state.id },
        })
      : await prisma.constituency.create({
          data: { code: entry.code, name: entry.name, type, stateId: state.id },
        });

    await prisma.constituencyLga.deleteMany({ where: { constituencyId: constituency.id } });
    await prisma.constituencyWard.deleteMany({ where: { constituencyId: constituency.id } });
    if (lgaIds.length) {
      await prisma.constituencyLga.createMany({
        data: lgaIds.map((lgaId) => ({ constituencyId: constituency.id, lgaId })),
        skipDuplicates: true,
      });
    }
    if (wardIds.length) {
      await prisma.constituencyWard.createMany({
        data: wardIds.map((wardId) => ({ constituencyId: constituency.id, wardId })),
        skipDuplicates: true,
      });
    }
    done += 1;
  }

  console.log(`\nFrom ${FILE}: ${done} constituencies seeded.`);

  if (problems.length) {
    console.log(`\n${problems.length} entries could not be matched:\n`);
    for (const problem of problems.slice(0, 40)) console.log(`  - ${problem}`);
    if (problems.length > 40) console.log(`  … and ${problems.length - 40} more`);
    console.log(
      "\nThese are reported rather than skipped silently: a constituency missing\nan LGA reports a wrong total for a real race."
    );
  }
}

main()
  .catch((error) => {
    console.error("\nFailed:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
