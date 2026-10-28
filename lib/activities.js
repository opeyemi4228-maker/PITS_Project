/**
 * The activity record.
 *
 * ── HOW TO ADD ONE ─────────────────────────────────────────────────────────
 *   {
 *     slug: "kano-ward-congress",
 *     title: "Ward congress, Kano Municipal",
 *     type: "Ward Congress",        // one of activityTypes below
 *     tense: "upcoming",            // "upcoming" | "past"
 *     date: "14 March 2026",
 *     venue: "Sani Abacha Stadium",
 *     state: "Kano",
 *     zone: "North West",           // must match a zone name in lib/map.js
 *   }
 * ───────────────────────────────────────────────────────────────────────────
 *
 * This lives in lib/ rather than in the page because two different consumers
 * need it and only one of them is a client component: the calendar itself is
 * interactive and ships to the browser, while /media's section rail needs only
 * the count and stays on the server. A module means the count does not drag the
 * whole filtering UI into the server render to get at `activities.length`.
 */

/* §4.4: the activity taxonomy. These are the movement's own categories, so they
   are fixed here; the events themselves come from the Secretariat. */
export const activityTypes = [
  "Rally",
  "Ward Congress",
  "Town Hall",
  "Mobilization Drive",
  "Voter Registration Drive",
  "Empowerment Programme",
  "Stakeholder Meeting",
  "Media Engagement",
];

/* No events are listed. The Secretariat has not supplied an activity record,
   and inventing rallies, with dates, venues and attendance figures, on a
   political movement's public site would be fabricating the very thing this
   page exists to evidence. The filters and empty states are real and wired;
   the moment activities are added to this array the page fills in. */
export const activities = [];

/** How many of a given tense there are, for the section rail's count badge. */
export function countActivities(tense) {
  return tense
    ? activities.filter((activity) => activity.tense === tense).length
    : activities.length;
}
