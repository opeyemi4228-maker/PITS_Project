/**
 * Newsroom content.
 *
 * One source, two consumers: /news and the homepage preview read the same
 * list, so a headline cannot drift between them.
 *
 * ── WHAT GOES IN HERE ───────────────────────────────────────────────────────
 * Only items that exist somewhere a reader can check. Each one carries the
 * `url` of where it was published and an `excerpt` that says what it is — not
 * a rewritten article. The candidate's speeches and interviews are his
 * campaign's to publish; this list points at them rather than retelling them.
 *
 * PITS' own statements go here too, as the Secretariat issues them, with
 * `source: "PITS"` and the link to wherever the statement was first posted.
 *
 * Newest first.
 * ───────────────────────────────────────────────────────────────────────────
 */

const CAMPAIGN_MEDIA = "https://princeadebayo.vercel.app/media";

export const news = [
  {
    id: "production-economy-speech",
    title: "A Nigeria That Works: The Case for a Production Economy",
    excerpt:
      "A speech by Prince Adewole Adebayo on moving Nigeria from importing to making: the second of the eight pillars.",
    category: "Speech",
    date: "October 2026",
    source: "Prince Adebayo campaign",
    url: CAMPAIGN_MEDIA,
  },
  {
    id: "security-justice-interview",
    title: "On Security, Justice and the Rule of Law",
    excerpt:
      "An interview with the candidate on the first pillar: safe communities, functioning courts and a justice system people trust.",
    category: "Interview",
    date: "October 2026",
    source: "Prince Adebayo campaign",
    url: CAMPAIGN_MEDIA,
  },
  {
    id: "eight-pillar-agenda",
    title: "SDP Presidential Campaign Unveils Eight Pillar Agenda",
    excerpt:
      "The campaign's press release setting out the eight pillars, from security and the rule of law to youth, women and inclusion.",
    category: "Press release",
    date: "September 2026",
    source: "Prince Adebayo campaign",
    url: CAMPAIGN_MEDIA,
  },
];

/** What the homepage preview reads from. */
export const latestNews = news;
