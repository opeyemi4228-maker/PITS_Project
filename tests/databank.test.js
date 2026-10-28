import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { canonicalUnitCode } from "../lib/databank.js";

/**
 * The polling unit code, translated for Data Bank.
 *
 * ══════════════════════════════════════════════════════════════════════════
 *  WHY THIS ONE FUNCTION HAS A SUITE TO ITSELF
 *
 *  Everything else in lib/databank.js is a fetch that either works or is
 *  logged and forgotten. This is the part that can be wrong *quietly*.
 *
 *  This application writes a polling unit as `ABI-001-09-003`; Data Bank
 *  validates `NN/NN/NN/NNN` and files evidence under it. A conversion that is
 *  merely absent is fine — the hub renders a missing code as a finding and
 *  somebody follows it up. A conversion that is off by one in the state number
 *  files a photograph of a booth in Abia under a booth in Adamawa, and nothing
 *  anywhere can detect it, because a well-formed code belonging to somewhere
 *  else is indistinguishable from a correct one.
 *
 *  So the five states that can be checked against independent evidence are
 *  pinned explicitly, and everything unrecognised is asserted to fail closed.
 * ══════════════════════════════════════════════════════════════════════════
 */

describe("the canonical polling unit code", () => {
  test("the states Data Bank's own fixture data can vouch for", () => {
    /*
     * ── THE ONLY INDEPENDENT EVIDENCE EITHER CODEBASE HOLDS ────────────────
     * Data Bank's lib/fixture.js carries real polling units for five states,
     * written in its own format. Those five numbers were not chosen here and
     * cannot be made to agree by editing this file — which is exactly what
     * makes them worth asserting. If the table in lib/databank.js is ever
     * regenerated or "corrected", these fail.
     */
    assert.equal(canonicalUnitCode("ANA-001-01-001").slice(0, 2), "04", "Anambra");
    assert.equal(canonicalUnitCode("KAD-001-01-001").slice(0, 2), "19", "Kaduna");
    assert.equal(canonicalUnitCode("KAN-001-01-001").slice(0, 2), "20", "Kano");
    assert.equal(canonicalUnitCode("LAG-010-03-001").slice(0, 2), "25", "Lagos");
    assert.equal(canonicalUnitCode("RIV-022-17-001").slice(0, 2), "33", "Rivers");
  });

  test("the Federal Capital Territory sorts under F, not under A", () => {
    /* Filed as "Federal Capital Territory", so it sits between Enugu and
       Gombe. Treating it as "Abuja" would shift twenty-two states by one and
       every one of those codes would still look perfectly well formed. */
    assert.equal(canonicalUnitCode("FCT-001-01-001").slice(0, 2), "15");
    assert.equal(canonicalUnitCode("ENU-001-01-001").slice(0, 2), "14");
    assert.equal(canonicalUnitCode("GOM-001-01-001").slice(0, 2), "16");
  });

  test("a whole code converts, not just its state", () => {
    assert.equal(canonicalUnitCode("RIV-022-17-001"), "33/22/17/001");
    assert.equal(canonicalUnitCode("OND-006-07-003"), "29/06/07/003");
  });

  test("the shape Data Bank validates is the shape produced", () => {
    /* The regex in Data Bank's lib/figures-facts.js, restated. A code that
       does not match it is discarded there, silently, after the sheet has
       already been banked. */
    const UNIT = /^\d{2}\/\d{2}\/\d{2}\/\d{3}$/;
    for (const code of ["ABI-001-09-003", "LAG-010-03-001", "ZAM-014-11-099"]) {
      assert.match(canonicalUnitCode(code), UNIT, code);
    }
  });

  test("short segments are padded, because a booth is three digits", () => {
    assert.equal(canonicalUnitCode("ABI-1-9-3"), "01/01/09/003");
  });

  test("anything unrecognised fails closed rather than guessing", () => {
    /* Each of these would be a plausible thing to "handle gracefully" by
       inventing a code. None of them is. */
    assert.equal(canonicalUnitCode("XXX-001-01-001"), null, "an unknown state");
    assert.equal(canonicalUnitCode("01/08/04/017"), null, "already canonical, not this format");
    assert.equal(canonicalUnitCode("ABI-001-01"), null, "a ward, not a unit");
    assert.equal(canonicalUnitCode("ABI-100-01-001"), null, "no state has a 100th local government");
    assert.equal(canonicalUnitCode("ABI-000-01-001"), null, "there is no local government zero");
    assert.equal(canonicalUnitCode(""), null);
    assert.equal(canonicalUnitCode(null), null);
    assert.equal(canonicalUnitCode(undefined), null);
    assert.equal(canonicalUnitCode({ code: "ABI-001-01-001" }), null, "an object is not a code");
  });

  test("case and surrounding space do not decide whether evidence is filed", () => {
    assert.equal(canonicalUnitCode("  abi-001-09-003  "), "01/01/09/003");
  });
});
