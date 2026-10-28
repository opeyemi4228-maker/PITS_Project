import { createHash } from "node:crypto";

import { prisma } from "./db.js";

/**
 * Forwarding a filed return to Data Bank.
 *
 * ══════════════════════════════════════════════════════════════════════════
 *  THE HOLE THIS CLOSES
 *
 *  An agent photographs an EC8A in the result portal, the return saves, and
 *  the sheet lands in this application's own `result_sheets` table. Data Bank
 *  — the hub whose entire job is "what arrived, from whom, when, and what
 *  happened to it" — never hears about it. Its Sheets board stays empty while
 *  agents are filing all evening, and the obvious reading of an empty board is
 *  that nobody has filed anything.
 *
 *  The two products are not on one database. Poll360 is one Neon project and
 *  Data Bank is another, so there is no view to publish and no table to share:
 *  the sheet has to travel over the network, through Data Bank's intake door,
 *  the same way a WhatsApp photograph does. That door exists for exactly this
 *  and is what the `intake:write` scope is for.
 *
 *  ── WHAT THIS MUST NEVER DO ──────────────────────────────────────────────
 *  Fail an agent's submission. The return is saved and committed before this
 *  is called, and every path here swallows its own errors. A hub that is down,
 *  misconfigured, slow or simply not deployed yet must cost the agent nothing:
 *  they are standing outside a polling unit at nine in the evening and the
 *  number in this database is the one that matters. Forwarding is a copy, and
 *  a copy that fails is a copy to retry, never a return to reject.
 * ══════════════════════════════════════════════════════════════════════════
 */

const TIMEOUT_MS = 15_000;

/**
 * INEC's state numbers, against this application's state abbreviations.
 *
 * ── WHY THIS TABLE IS WRITTEN OUT AND NOT COMPUTED ─────────────────────────
 * The numbering is alphabetical by state name with the Federal Capital
 * Territory filed under F, so it *could* be derived by sorting
 * `public/geo/*.json`. Deriving it would make the codes on evidence depend on
 * a locale-sensitive sort and on nobody ever renaming a file — and a code that
 * silently shifts by one attaches a photograph to the wrong polling unit,
 * which is worse in every way than having no code at all.
 *
 * Checked against the five states in Data Bank's own fixture data, which is
 * the only independent evidence either codebase contains: Anambra 04,
 * Kaduna 19, Kano 20, Lagos 25, Rivers 33. All five agree.
 */
const STATE_NUMBERS = {
  ABI: "01", ADA: "02", AKW: "03", ANA: "04", BAU: "05", BAY: "06",
  BEN: "07", BOR: "08", CRO: "09", DEL: "10", EBO: "11", EDO: "12",
  EKI: "13", ENU: "14", FCT: "15", GOM: "16", IMO: "17", JIG: "18",
  KAD: "19", KAN: "20", KAT: "21", KEB: "22", KOG: "23", KWA: "24",
  LAG: "25", NAS: "26", NIG: "27", OGU: "28", OND: "29", OSU: "30",
  OYO: "31", PLA: "32", RIV: "33", SOK: "34", TAR: "35", YOB: "36",
  ZAM: "37",
};

/**
 * `ABI-001-09-003` → `01/01/09/003`, or null.
 *
 * ── FAIL CLOSED, ALWAYS ────────────────────────────────────────────────────
 * Data Bank validates a unit code against `NN/NN/NN/NNN` and renders a missing
 * one as a finding somebody follows up. That is a good outcome. A *wrong* one
 * is not: it files a photograph of one booth's result under another booth's
 * code, and nothing downstream can detect it, because a well-formed code that
 * belongs to somewhere else looks exactly like a correct one.
 *
 * So anything this does not recognise returns null, and the sheet travels
 * identified by its place names instead — which are sent on every forward for
 * precisely this reason.
 */
export function canonicalUnitCode(code) {
  const match = /^([A-Z]{3})-(\d{1,3})-(\d{1,2})-(\d{1,3})$/.exec(String(code ?? "").trim().toUpperCase());
  if (!match) return null;

  const [, state, lga, ward, unit] = match;
  const stateNumber = STATE_NUMBERS[state];
  if (!stateNumber) return null;

  /* The local government is three digits here and two there. Nigeria's largest
     state has 44 local governments, so a number that does not fit in two
     digits is not a local government and is refused rather than truncated. */
  if (Number(lga) > 99 || Number(lga) < 1) return null;

  return `${stateNumber}/${String(lga).padStart(2, "0").slice(-2)}/${String(ward).padStart(2, "0")}/${String(unit).padStart(3, "0")}`;
}

/** Where the hub is, and the key that opens its intake door. */
function configured() {
  const url = process.env.DATABANK_INTAKE_URL;
  const key = process.env.DATABANK_API_KEY;
  return url && key ? { url, key } : null;
}

/**
 * Send one filed return's sheet to Data Bank.
 *
 * Returns a short outcome for the log. Never throws.
 *
 * ── CALLED AFTER THE RESPONSE, NOT BEFORE IT ───────────────────────────────
 * The caller wraps this in `after()` from next/server, so the agent's phone
 * has the confirmation before this opens a socket. Fifteen seconds of a slow
 * hub is then fifteen seconds of nobody waiting, rather than fifteen seconds
 * of an agent wondering whether to press submit again.
 */
export async function forwardReturn(resultId) {
  const target = configured();
  if (!target) return { ok: false, reason: "not-configured" };

  try {
    const result = await prisma.pollingUnitResult.findUnique({
      where: { id: BigInt(resultId) },
      select: {
        id: true,
        submittedAt: true,
        election: { select: { type: true, name: true } },
        pollingUnit: { select: { code: true, name: true } },
        ward: { select: { name: true } },
        lga: { select: { name: true } },
        state: { select: { name: true } },
        submittedBy: { select: { firstName: true, surname: true } },
        sheet: { select: { bytes: true, mimeType: true, byteSize: true, version: true } },
      },
    });

    /* No photograph, nothing to bank. An amendment that reuses the sheet
       already on file has one; a return filed without one never did, and the
       figures travel to Data Bank by their own route or not at all. */
    if (!result?.sheet) return { ok: false, reason: "no-sheet" };

    const bytes = Buffer.from(result.sheet.bytes);
    const imageHash = createHash("sha256").update(bytes).digest("hex");

    const payload = {
      /* Base64, because the intake door takes JSON. Data Bank seals this whole
         object and serves the photograph back out of it — see sheetImage() in
         its lib/store/queries.js, which reads exactly this field. */
      image: bytes.toString("base64"),
      bytes: result.sheet.byteSize ?? bytes.length,
      formType: "EC8A",

      /* Null when this application's code is not one the hub can validate.
         The names below are then the only way to place the sheet, which is
         why they are never omitted. */
      unitCode: canonicalUnitCode(result.pollingUnit?.code),
      race: result.election?.type ?? null,
      electionId: result.election?.name ?? null,
      unitName: result.pollingUnit?.name ?? null,
      place: {
        stateName: result.state?.name ?? null,
        lgaName: result.lga?.name ?? null,
        wardName: result.ward?.name ?? null,
        unitName: result.pollingUnit?.name ?? null,
      },
      capturedBy: {
        name: [result.submittedBy?.firstName, result.submittedBy?.surname].filter(Boolean).join(" ") || null,
      },
      capturedAt: result.submittedAt?.toISOString() ?? null,

      /* This application's own spelling of the unit, carried whether or not it
         converted. When a code does not match on the other side, this is what
         makes the mismatch diagnosable instead of merely visible. */
      sourceUnitCode: result.pollingUnit?.code ?? null,
      sourceResultId: String(result.id),
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(new URL("/api/intake", target.url), {
        method: "POST",
        signal: controller.signal,
        headers: {
          "content-type": "application/json",
          "x-databank-key": target.key,
        },
        body: JSON.stringify({
          kind: "RESULT_SHEET",
          source: "API",
          /* ── IDEMPOTENCY, AND WHY THE VERSION IS IN IT ──────────────────
             Data Bank returns the existing row untouched for an externalId it
             has seen (`redelivered: true`), so a retry cannot double-bank a
             sheet. The sheet's content hash is in the key because an amended
             return replaces the photograph: same result, genuinely different
             evidence, and it has to be banked as its own arrival rather than
             silently swallowed as a redelivery of the first one. */
          externalId: `poll360:result:${result.id}:${result.sheet.version}`,
          mime: result.sheet.mimeType,
          mediaHashes: [imageHash],
          payload,
        }),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error(`[databank] intake refused ${response.status}: ${detail.slice(0, 200)}`);
        return { ok: false, reason: `http-${response.status}` };
      }

      const banked = await response.json().catch(() => null);
      return {
        ok: true,
        id: banked?.id ?? null,
        redelivered: Boolean(banked?.redelivered),
        unitCode: payload.unitCode,
      };
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    /* Swallowed on purpose. See the header: the return is already saved, and
       nothing about forwarding it is allowed to reach the agent. */
    console.error(`[databank] could not forward result ${resultId}: ${error.message}`);
    return { ok: false, reason: "unreachable" };
  }
}
