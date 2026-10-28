import { prisma } from "./db";

/**
 * Electoral constituencies: the geography an election is actually contested in.
 *
 * ── WHY THIS IS NOT JUST THE STATE COLUMN ──────────────────────────────────
 * Only a presidential election has one ballot nationwide. Everything else is
 * contested somewhere smaller, and "somewhere smaller" is not a level of the
 * administrative hierarchy:
 *
 *   Governorship   one state           — 37 of them, exactly the states
 *   Senate         a senatorial district — 109, always whole LGAs
 *   House of Reps  a federal constituency — 360, mostly whole LGAs, some of
 *                  which split an LGA between two constituencies
 *
 * That last case is the whole reason this file exists. A federal constituency
 * that takes half of an LGA cannot be described by any column on a result row,
 * so membership is a pair of join tables — whole LGAs in one, individual wards
 * in the other — and a constituency resolves to a set of ids that the results
 * queries filter on.
 *
 * ── WHAT AGGREGATING BY STATE INSTEAD WOULD DO ─────────────────────────────
 * It would report the whole of Kano as the result of each of its three
 * senatorial districts, which is not a rounding error — it is three wrong
 * answers where there should be three different right ones.
 *
 * Server only.
 */

/**
 * A constituency as the results queries want it: two lists of ids.
 *
 * `lgaIds` are whole local governments inside it. `wardIds` are the individual
 * wards that belong to it without their whole LGA doing so — populated only for
 * the federal constituencies that split one. Everywhere else it is empty and
 * the LGA list is the complete answer.
 */
export async function constituencyFilter(constituencyId) {
  if (!constituencyId) return null;

  const row = await prisma.constituency.findUnique({
    where: { id: constituencyId },
    select: {
      id: true,
      type: true,
      code: true,
      name: true,
      state: { select: { id: true, name: true, slug: true } },
      lgas: { select: { lgaId: true } },
      wards: { select: { wardId: true } },
    },
  });
  if (!row) return null;

  return {
    id: row.id,
    type: row.type,
    code: row.code,
    name: row.name,
    state: row.state,
    lgaIds: row.lgas.map((entry) => entry.lgaId),
    wardIds: row.wards.map((entry) => entry.wardId),
  };
}

/**
 * Every constituency a given ward votes in.
 *
 * A ward is in exactly one state constituency, one senatorial district and one
 * federal constituency — three ballots, plus the presidential one that has no
 * constituency at all. This is what decides which candidates an agent at that
 * booth is asked to enter figures for.
 *
 * Both memberships are checked: the ward's own row where a federal constituency
 * splits its LGA, and its LGA's row everywhere else.
 */
export async function constituenciesForWard(wardId) {
  if (!wardId) return [];

  const ward = await prisma.ward.findUnique({
    where: { id: wardId },
    select: { id: true, lgaId: true },
  });
  if (!ward) return [];

  return prisma.constituency.findMany({
    where: {
      OR: [
        { wards: { some: { wardId: ward.id } } },
        { lgas: { some: { lgaId: ward.lgaId } } },
      ],
    },
    select: { id: true, type: true, code: true, name: true },
    orderBy: { type: "asc" },
  });
}

/**
 * The candidates on the ballot at one booth, for one election.
 *
 * A candidate with no constituency is nationwide — the presidential ballot.
 * Everything else has to be contested somewhere this ward actually votes.
 */
export async function candidatesForWard(electionId, wardId) {
  const constituencies = await constituenciesForWard(wardId);

  return prisma.candidate.findMany({
    where: {
      electionId,
      OR: [
        { constituencyId: null },
        { constituencyId: { in: constituencies.map((row) => row.id) } },
      ],
    },
    select: {
      id: true,
      name: true,
      party: { select: { id: true, code: true, name: true, colour: true, sortOrder: true } },
      constituency: { select: { id: true, type: true, name: true } },
    },
  });
}

/** The constituencies of one state, for a picker. */
export async function constituenciesInState(stateId, type) {
  return prisma.constituency.findMany({
    where: { stateId, ...(type ? { type } : {}) },
    select: { id: true, type: true, code: true, name: true },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
}

/** Which constituency type a given election is contested in. */
export const CONSTITUENCY_FOR_ELECTION = {
  PRESIDENTIAL: null, // the federation; no constituency
  GOVERNORSHIP: "STATE",
  SENATE: "SENATORIAL",
  HOUSE_OF_REPS: "FEDERAL",
};
