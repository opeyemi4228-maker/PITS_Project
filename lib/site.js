import { candidate } from "@/lib/adebayo";

/**
 * Single source of truth for site chrome.
 *
 * Nav links used to be written inline in both Navbar and Footer as relative
 * hrefs (`href="governance"`), which resolve against the *current* path and so
 * broke on any nested route. Everything is rooted here instead.
 */

/**
 * The site belongs to the movement, not to the candidate.
 *
 * `name` is PITS's. It is what the masthead, the page titles and the
 * structured data identify. The man the movement exists to support is carried
 * separately as `aspirant`, so the copy never has to guess whether a sentence
 * is about PITS or about Prince Adebayo — and so that the candidate's own
 * campaign, which has its own site, is never spoken for by this one.
 *
 * Power In The Streets (PITS) is the grassroots movement operated by Amvora
 * (pits.amvora.com.ng). This platform is its mobilisation arm for the 2027
 * presidential election: the register, the structure, and the coordinators.
 * Amvora is named only where the organisation itself is meant — its mark, its
 * accounts, the parent of the movement.
 */
export const site = {
  name: "Power In The Streets",
  shortName: "PITS",
  acronym: "PITS",
  tagline: "Hope in action.",
  movement: "Power In The Streets (PITS)",
  parent: "Amvora",
  parentUrl: "https://pits.amvora.com.ng",

  /** The candidate. */
  aspirant: candidate.name,
  aspirantShort: candidate.short,
  aspirantHonorific: candidate.descriptor,
  aspirantOffice: "President",
  aspirantUrl: "https://princeadebayo.vercel.app",

  party: "Social Democratic Party",
  partyShort: "SDP",
  partyUrl: "https://princeadebayo.vercel.app",

  /* Where THIS platform is deployed. Referral links, the QR on the membership
     card and every canonical URL are built from it, so it must be the
     register's own address and not PITS's homepage. Set NEXT_PUBLIC_SITE_URL
     per environment; the fallback is only for local development. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),

  /** Published by Amvora and by the candidate's campaign respectively. */
  contact: {
    phones: ["0816 885 0257", "0809 602 5500"],
    email: "pitsbyamvora@gmail.com",
    campaignEmail: "info@princeadebayo.ng",
    pressEmail: "press@princeadebayo.ng",
    headquarters: "Abuja, FCT, Nigeria",
  },
};

/**
 * Primary navigation, plus the Join action carried separately as
 * `primaryCta`.
 *
 * Five links on the desktop bar and nothing nested under them: a visitor
 * should take in the whole masthead at a glance. `drawerOnly` items are the
 * pages a phone visitor cannot otherwise reach without scrolling to the
 * footer, so the drawer lists them while the desktop bar leaves them to the
 * footer and to the pages that link to them.
 */
export const navigation = [
  { label: "About", href: "/about" },
  { label: "Prince Adebayo", href: "/about/adebayo" },
  { label: "Manifesto", href: "/manifesto" },
  { label: "Structure", href: "/structure" },
  { label: "Media", href: "/media" },
  { label: "News", href: "/news", drawerOnly: true },
  { label: "Contact", href: "/contact", drawerOnly: true },
];

export const primaryCta = {
  label: "Join PITS",
  href: "/join",
};

/** The candidate's own campaign site: the place for his speeches and press. */
export const secondaryCta = {
  label: "Campaign site",
  href: "https://princeadebayo.vercel.app",
  external: true,
};

export const volunteerCta = {
  label: "Volunteer",
  href: "/volunteer",
};

/** The PITS WhatsApp community, linked from the contact page and footer. */
export const community = {
  label: "PITS WhatsApp community",
  href: "https://chat.whatsapp.com/KxYhHNrnC5ZF0MHj0lhErN",
};

/** Four columns: the movement, taking part, media and reaching us. */
export const footerColumns = [
  {
    title: "The Movement",
    links: [
      { label: "About PITS", href: "/about" },
      { label: "Who is Prince Adebayo?", href: "/about/adebayo" },
      { label: "The Manifesto", href: "/manifesto" },
      { label: "Structure", href: "/structure" },
      { label: "PITS community services", href: "https://pits.amvora.com.ng", external: true },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Join PITS", href: "/join" },
      { label: "Find Your Coordinator", href: "/structure#find" },
      { label: "Activities", href: "/media#activities" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "WhatsApp Community", href: community.href, external: true },
    ],
  },
  {
    title: "Media",
    links: [
      { label: "Newsroom", href: "/news" },
      { label: "Photographs", href: "/media#photographs" },
      { label: "Videos", href: "/media#video" },
      { label: "The Campaign Site", href: "https://princeadebayo.vercel.app", external: true },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact the Secretariat", href: "/contact" },
      { label: "Find Your Chapter", href: "/connect" },
      { label: "Zonal Offices", href: "/contact#zonal" },
    ],
  },
];

/** PITS's own accounts, as published on pits.amvora.com.ng. */
export const socials = [
  { label: "X", href: "https://x.com/PITSbyAmvora", icon: "x" },
  { label: "TikTok", href: "https://www.tiktok.com/@amvoralight", icon: "tiktok" },
  { label: "Facebook", href: "https://www.facebook.com/share/1DNUYejFPF/", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/pitsbyamvora", icon: "instagram" },
];
