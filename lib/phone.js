/**
 * Nigerian mobile numbers to a single canonical form (+234XXXXXXXXXX).
 * "0803 123 4567", "803 123 4567", "+2348031234567" and "2348031234567" are
 * the same person, and the plan makes phone the unique login credential, so
 * they must not be able to create four accounts.
 *
 * Its own module, free of node:crypto, so the join form can run the exact
 * rule the server runs and tick the field as it is typed. lib/auth.js
 * re-exports it.
 */
export function normalisePhone(input) {
  if (!input) return null;
  const digits = String(input).replace(/[^\d+]/g, "").replace(/^\+/, "");
  let local = null;

  if (/^234\d{10}$/.test(digits)) local = digits.slice(3);
  else if (/^0\d{10}$/.test(digits)) local = digits.slice(1);
  else if (/^\d{10}$/.test(digits)) local = digits;

  // Nigerian mobile prefixes start 70, 80, 81, 90 or 91.
  if (!local || !/^[789][01]\d{8}$/.test(local)) return null;
  return `+234${local}`;
}
