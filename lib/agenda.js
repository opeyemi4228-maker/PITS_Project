/**
 * The manifesto: what the candidate says he will do, in one place.
 *
 * ── THE RULE FOR THIS FILE ──────────────────────────────────────────────────
 * Every commitment here is one Prince Adewole Adebayo's campaign has published,
 * and every pillar carries the page it was taken from. Nothing is
 * extrapolated, costed or improved on. If a figure is not in the source, it is
 * not in this file. The campaign calls its plan "costed"; the costings are the
 * campaign's to publish, and until they are, this file quotes none.
 *
 * That is not caution for its own sake. A campaign site that overstates its
 * own candidate hands the other side the correction, and the correction is
 * what gets shared. When the SDP publishes its full manifesto document, it
 * supersedes this summary. Update the pillar and its `source` together.
 *
 * `forYou` is the one field written by the movement rather than taken from the
 * source. It says, in a sentence a trader would use, who the commitment is
 * aimed at. It must never add a promise the commitments do not already make.
 *
 * House style is that of lib/adebayo.js: short sentences, one idea each.
 * ───────────────────────────────────────────────────────────────────────────
 */

/* ── Sources ────────────────────────────────────────────────────────────── */

const CAMPAIGN = "https://princeadebayo.vercel.app";

const pillarSource = (anchor) => ({
  label: "The eight pillars, on the campaign's manifesto page",
  url: `${CAMPAIGN}/manifesto#${anchor}`,
  date: "2026",
});

const src = {
  manifesto: {
    label: "Manifesto: eight pillars, one Nigeria (Prince Adebayo campaign)",
    url: `${CAMPAIGN}/manifesto`,
    date: "2026",
  },
  unveiled: {
    label: "SDP Presidential Campaign Unveils Eight Pillar Agenda (press release)",
    url: `${CAMPAIGN}/media`,
    date: "September 2026",
  },
  campaign: {
    label: "Six zones, one mission (Prince Adebayo campaign)",
    url: `${CAMPAIGN}/campaign`,
    date: "2026",
  },
  inec: {
    label: "INEC moves 2027 presidential election to January 16 (The Guardian)",
    url: "https://guardian.ng/politics/inec-moves-2027-presidential-election-to-january-16/",
    date: "February 2026",
  },
};

/* ── The election ───────────────────────────────────────────────────────── */

/**
 * INEC's revised timetable. The countdown reads `date`, so if INEC moves the
 * poll again, this is the only line that changes.
 */
export const election = {
  date: "2027-01-16T08:00:00+01:00",
  label: "Presidential and National Assembly elections",
  day: "Saturday 16 January 2027",
  governorship: "Saturday 6 February 2027",
  source: src.inec,
};

/* ── The argument ───────────────────────────────────────────────────────── */

/** The candidate's own framing of the election, as his campaign quotes it. */
export const framing = {
  quote:
    "Nigeria is not a poor country. It is a poorly managed one. And management can be fixed.",
  by: "Prince Adewole Adebayo",
  role: "SDP Presidential Candidate",
  source: src.manifesto,
};

/* ── The headline ───────────────────────────────────────────────────────── */

/**
 * The campaign's one-line description of its plan is "a costed plan for
 * security, production and justice". Those three words are what a voter will
 * have heard, so they are the feature, and each one opens the pillar that
 * carries it.
 */
export const headline = {
  slug: "three-words",
  kicker: "The plan in three words",
  title: "Security. Production. Justice.",
  lead: "A practical plan for a Nigeria that works for all. Safe communities first, then an economy that makes what it uses, under courts people trust.",
  words: [
    {
      label: "Security",
      pillar: "security",
      detail: "Safe communities, and a justice system that protects them.",
    },
    {
      label: "Production",
      pillar: "economy",
      detail: "Stop importing what Nigeria can make. Make it here, and hire here.",
    },
    {
      label: "Justice",
      pillar: "governance",
      detail: "Functioning courts, and a lean, transparent government that answers for itself.",
    },
  ],
  sources: [src.manifesto, src.unveiled],
};

/* ── The eight pillars ──────────────────────────────────────────────────── */

/**
 * Grouped into three themes for reading. The grouping and the order of the
 * themes are the movement's, not the campaign's; within them the pillars keep
 * the campaign's own numbering, so "pillar 4" means the same thing here as on
 * the candidate's site.
 *
 * `icon` is a lucide-react export name, resolved in components/AgendaIcon.jsx,
 * so this file stays plain data that a server component can import.
 */
export const themes = [
  {
    slug: "safe-and-just",
    title: "Safe and just",
    line: "Safe streets, working courts, a government that answers for itself.",
    pillars: [
      {
        slug: "security",
        number: 1,
        icon: "ShieldCheck",
        title: "Security and the rule of law",
        pledge: "Safe communities, functioning courts and a justice system Nigerians can trust.",
        forYou: "For every community that has learned to plan its day around the road being unsafe.",
        commitments: [
          "Safe communities",
          "Courts that function",
          "A justice system people trust",
        ],
        source: pillarSource("security"),
      },
      {
        slug: "governance",
        number: 7,
        icon: "Landmark",
        title: "Accountable governance",
        pledge: "A lean, transparent government.",
        forYou: "For taxpayers who want to see what their government spends, and on what.",
        commitments: ["A leaner government", "Transparency in how it works and what it spends"],
        source: pillarSource("governance"),
      },
    ],
  },
  {
    slug: "production",
    title: "A production economy",
    line: "Make it here, grow it here, power it here.",
    pillars: [
      {
        slug: "economy",
        number: 2,
        icon: "Factory",
        title: "Production economy and jobs",
        pledge: "Shift Nigeria from importing to manufacturing.",
        forYou: "For the young person looking for work, and the business that would hire them if it could make things here.",
        commitments: ["Move from an import economy to a manufacturing one", "Jobs from what Nigeria makes"],
        source: pillarSource("economy"),
      },
      {
        slug: "agriculture",
        number: 6,
        icon: "Wheat",
        title: "Agriculture and food security",
        pledge: "Feed the nation, then export.",
        forYou: "For farmers, and for families paying more for food every market day.",
        commitments: ["Food security at home first", "Then agricultural exports"],
        source: pillarSource("agriculture"),
      },
      {
        slug: "infrastructure",
        number: 5,
        icon: "Zap",
        title: "Power and infrastructure",
        pledge: "Reliable electricity, roads, rail and modern cities.",
        forYou: "For the shop that runs on a generator, and the trader whose goods spoil on a bad road.",
        commitments: ["Reliable electricity", "Roads and rail", "Modern cities"],
        source: pillarSource("infrastructure"),
      },
    ],
  },
  {
    slug: "people",
    title: "People first",
    line: "Every child in school, every ward with a clinic, every voice in the room.",
    pillars: [
      {
        slug: "education",
        number: 3,
        icon: "GraduationCap",
        title: "Education and human capital",
        pledge: "Schooling for every child, and graduates who can be employed.",
        forYou: "For parents with a child out of school, and graduates with a certificate and no job.",
        commitments: ["Schooling for every child", "Graduates with skills employers need"],
        source: pillarSource("education"),
      },
      {
        slug: "health",
        number: 4,
        icon: "HeartPulse",
        title: "Healthcare for all",
        pledge: "A primary healthcare centre in every ward.",
        forYou: "For the family that travels for hours, or pays out of pocket, for basic care.",
        commitments: ["A primary healthcare centre in every ward"],
        source: pillarSource("health"),
      },
      {
        slug: "youth",
        number: 8,
        icon: "Users",
        title: "Youth, women and inclusion",
        pledge: "Representation and opportunity for all.",
        forYou: "For young people and women who want a seat at the table, not a seat in the audience.",
        commitments: ["Representation for young people and women", "Opportunity for all"],
        source: pillarSource("youth"),
      },
    ],
  },
];

/** Flat, in the campaign's own order (1 to 8), for anything that needs all eight. */
export const pillars = themes
  .flatMap((theme) => theme.pillars.map((pillar) => ({ ...pillar, theme: theme.title })))
  .sort((a, b) => a.number - b.number);

/** Every distinct source, for the "read it yourself" list. */
export const sources = [src.manifesto, src.unveiled, src.campaign];
