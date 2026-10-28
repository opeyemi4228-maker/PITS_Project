/**
 * The candidate's record.
 *
 * One place for the figures, so the hero, the profile and the about page
 * cannot drift apart. Taken from the campaign's own site
 * (princeadebayo.vercel.app), and from nothing else.
 *
 * Everything in `record` and `timeline` is the campaign's own account of what
 * has happened. Where a line belongs to the campaign's intentions rather than
 * to the record, it lives in lib/agenda.js and is worded as an intention.
 * Nothing in this file is a projection.
 *
 * ── HOUSE STYLE: SHORT SENTENCES, SHORT BLOCKS ──────────────────────────────
 * This copy is read on a phone, often on a slow connection, by people deciding
 * in under a minute whether this movement is serious. Keep sentences under
 * about twenty words, one idea each. If you are adding copy: write it, then
 * delete a third of it. The facts survive that. The padding does not.
 *
 * ── WHAT IS NOT HERE, AND WHY ──────────────────────────────────────────────
 * The campaign's timeline gives no dates for his call to the Bar, his practice
 * or his businesses, so none are given here. A guessed year on a candidate's
 * profile is the kind of error the other side screenshots.
 * ───────────────────────────────────────────────────────────────────────────
 */

import { assets } from "@/assets/assets";

export const candidate = {
  name: "Prince Adewole Adebayo",
  short: "Prince Adebayo",
  surname: "Adebayo",
  office: "Presidential Candidate",
  party: "Social Democratic Party",
  partyShort: "SDP",
  descriptor: "Lawyer · Builder · Reformer",
  born: "1972, Ondo State",
  portrait: assets.adebayoPointing,
};

/** His own line, as the campaign quotes it. */
export const quote = {
  text: "Nigeria is not a poor country. It is a poorly managed one. And management can be fixed.",
  by: "Prince Adewole Adebayo",
};

/** The three-paragraph answer to the page's own question. */
export const bio = [
  "Born in 1972 in Ondo State, in the South West. A lawyer, entrepreneur and statesman, he has spent three decades in law, enterprise and public advocacy.",
  "He chose law as a tool. His aim was to protect ordinary people from the abuse of power. His practice has centred on commercial and constitutional matters, in litigation and in advice.",
  "He founded KAFTAN TV and other ventures. In 2022 he won the presidential primary of the Social Democratic Party. In 2023 he campaigned nationwide on security, production, justice and education. He now leads the SDP's bid again.",
];

/**
 * The four figures the campaign leads with. Three are the size of the country
 * the plan is for, not claims about him; the first is his working life.
 */
export const record = [
  { value: 30, suffix: "+", unit: "YRS", label: "In law, enterprise and public advocacy" },
  { value: 37, suffix: "", unit: "", label: "States and the FCT the plan is built for" },
  { value: 774, suffix: "", unit: "", label: "Local governments, every one of them" },
  { value: 8, suffix: "", unit: "", label: "Pillars in one costed plan" },
];

/** The campaign's own timeline, oldest first. */
export const timeline = [
  {
    id: 1,
    period: "1972",
    title: "Born in Ondo State",
    location: "South West Nigeria",
    description: "Born into the South West, the region he still calls home.",
  },
  {
    id: 2,
    period: "Early career",
    title: "Called to the Nigerian Bar",
    location: "Nigeria",
    description:
      "His practice focused on commercial and constitutional matters. Law was the tool he chose to protect ordinary people from abuse of power.",
  },
  {
    id: 3,
    period: "Practice",
    title: "Built a law practice",
    location: "Nigeria",
    description: "A practice handling litigation and advisory work.",
  },
  {
    id: 4,
    period: "Enterprise",
    title: "Founded KAFTAN TV and other ventures",
    location: "Nigeria",
    description: "Enterprise outside the courtroom: a broadcaster and other businesses.",
  },
  {
    id: 5,
    period: "2022",
    title: "Won the SDP presidential primary",
    location: "Social Democratic Party",
    description: "Chosen by the party as its candidate for President.",
  },
  {
    id: 6,
    period: "2023",
    title: "Campaigned nationwide",
    location: "All six zones",
    description: "A national campaign on security, production, justice and education.",
  },
  {
    id: 7,
    period: "2027",
    title: "Leads the SDP's bid",
    location: "Federal Republic of Nigeria",
    description: "The party's candidate for the next presidential election, on an eight pillar plan.",
  },
];

/** The campaign's own six-zone framing, in its words. */
export const zoneFocus = [
  { code: "NC", name: "North Central", focus: "Agro industrial corridors and security" },
  { code: "NE", name: "North East", focus: "Rebuilding, resettlement and education" },
  { code: "NW", name: "North West", focus: "Farm security, irrigation and livestock reform" },
  { code: "SE", name: "South East", focus: "Manufacturing, trade and infrastructure" },
  { code: "SS", name: "South South", focus: "Environmental justice and the energy value chain" },
  { code: "SW", name: "South West", focus: "Innovation, industry and urban renewal" },
];

/** Photographs of the candidate, with what is in the frame. */
export const photos = [
  { src: assets.adebayoPointing, alt: "Prince Adewole Adebayo in a white agbada and embroidered fila, pointing as he speaks" },
  { src: assets.adebayoSpeaking, alt: "Prince Adewole Adebayo speaking, one hand raised" },
  { src: assets.adebayoResolve, alt: "Prince Adewole Adebayo with a clenched fist, speaking" },
];
