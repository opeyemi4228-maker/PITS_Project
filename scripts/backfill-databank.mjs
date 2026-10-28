#!/usr/bin/env node
import { config as loadEnv } from "dotenv";

/* Loaded before the two imports below, because lib/db.js builds its Prisma
   client at module load and reads DATABASE_URL while doing it. The app gets
   this from Next; a plain script has to ask for it. */
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });

const { prisma } = await import("../lib/db.js");
const { forwardReturn } = await import("../lib/databank.js");

/**
 * Send returns already on file to Data Bank.
 *
 * ══════════════════════════════════════════════════════════════════════════
 *  WHY A BACKFILL IS NEEDED AT ALL
 *
 *  Forwarding runs when a return is filed (app/api/results/route.js). Every
 *  return filed *before* that existed has a photograph sitting in this
 *  database that the hub has never been told about — and from the hub's side
 *  that is indistinguishable from nobody having filed anything. This walks
 *  those and posts each one through the same path a live submission takes.
 *
 *  ── SAFE TO RUN TWICE, BY CONSTRUCTION ───────────────────────────────────
 *  Each forward carries an externalId of `poll360:result:<id>:<sheet hash>`.
 *  Data Bank returns the existing row untouched for an externalId it has seen
 *  and says so (`redelivered: true`), so a second run banks nothing and
 *  double-counts nothing. That is a property of the hub's intake, not of this
 *  script being careful, which is the right place for it to live.
 *
 *  ── AND IT GOES SLOWLY ON PURPOSE ────────────────────────────────────────
 *  One at a time, with a pause. A backfill is never urgent, and the hub is
 *  sized for an election night rather than for one script emptying a table at
 *  it as fast as a loop can go. The photographs are up to a megabyte each.
 * ══════════════════════════════════════════════════════════════════════════
 *
 *   node scripts/backfill-databank.mjs            # count only
 *   node scripts/backfill-databank.mjs --confirm
 *   node scripts/backfill-databank.mjs --confirm --limit 50
 */

const argv = process.argv.slice(2);
const confirm = argv.includes("--confirm");
const limitAt = argv.indexOf("--limit");
const limit = limitAt === -1 ? undefined : Number(argv[limitAt + 1]) || undefined;
const PAUSE_MS = 250;

if (!process.env.DATABANK_INTAKE_URL || !process.env.DATABANK_API_KEY) {
  console.error(
    "\n  DATABANK_INTAKE_URL and DATABANK_API_KEY are not both set, so there is\n" +
      "  nowhere to forward to. See .env.example.\n"
  );
  process.exit(1);
}

/* Only returns that actually have a photograph. A return filed without one has
   nothing for the Sheets board to show. */
const pending = await prisma.pollingUnitResult.findMany({
  where: { sheet: { isNot: null } },
  select: { id: true, pollingUnit: { select: { code: true } } },
  orderBy: { submittedAt: "asc" },
  take: limit,
});

console.log(
  `\n  ${pending.length.toLocaleString()} return(s) with a sheet on file.` +
    `${confirm ? "" : "   (dry run — nothing will be sent)"}\n`
);

if (!confirm) {
  console.log("  Re-run with --confirm to send them.\n");
  await prisma.$disconnect();
  process.exit(0);
}

const tally = { banked: 0, redelivered: 0, failed: 0, unplaced: 0 };

for (const [index, row] of pending.entries()) {
  const outcome = await forwardReturn(row.id);

  if (outcome.ok) {
    tally[outcome.redelivered ? "redelivered" : "banked"] += 1;
    /* A sheet the hub could not place by code is still banked and still
       readable — it is identified by its place names instead — but it is worth
       counting, because a large number here means the code translation in
       lib/databank.js is not recognising this deployment's units. */
    if (!outcome.unitCode) tally.unplaced += 1;
  } else {
    tally.failed += 1;
    console.error(`  result ${row.id} (${row.pollingUnit?.code ?? "?"}): ${outcome.reason}`);
  }

  if ((index + 1) % 25 === 0) {
    console.log(`  ${index + 1}/${pending.length}…`);
  }
  await new Promise((resolve) => setTimeout(resolve, PAUSE_MS));
}

console.log(
  `\n  Done. ${tally.banked} banked, ${tally.redelivered} already there, ${tally.failed} failed.` +
    (tally.unplaced
      ? `\n  ${tally.unplaced} had no polling unit code the hub could validate — they are banked\n` +
        `  and placed by name. Check canonicalUnitCode() in lib/databank.js if that is most of them.\n`
      : "\n") +
    "\n"
);

await prisma.$disconnect();
process.exit(tally.failed > 0 ? 1 : 0);
