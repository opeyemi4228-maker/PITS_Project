import { Montserrat } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import ToasterWrapper from "@/components/ToasterWrapper";
import { site, socials } from "@/lib/site";

/* One family for the whole site. Montserrat carries headlines at 600 and
   700 and body copy at 400 and 500: geometric, open and confident, and still
   legible at 15px on an inexpensive Android screen.

   Self-hosted by next/font, so there is no render-blocking request to
   fonts.googleapis.com and no layout shift when the face lands. */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.movement} | Hope In Action`,
    template: `%s | ${site.shortName}`,
  },
  description:
    "Power In The Streets (PITS) is a grassroots mobilisation movement organising in all 36 states, the Federal Capital Territory, 774 Local Government Areas and over 8,000 wards behind Prince Adewole Adebayo, presidential candidate of the Social Democratic Party (SDP).",
  applicationName: site.movement,
  authors: [{ name: site.movement }],
  keywords: [
    "Power In The Streets",
    "PITS Nigeria",
    "PITS by Amvora",
    "Prince Adebayo",
    "Prince Adewole Adebayo",
    "Adebayo 2027",
    "SDP presidential candidate",
    "Social Democratic Party",
    "Nigeria political movement",
    "ward mobilisation Nigeria",
  ],
  openGraph: {
    title: site.movement,
    description:
      "A disciplined, verifiable national structure, built ward by ward, behind Prince Adewole Adebayo, SDP presidential candidate. Register in under a minute.",
    type: "website",
    locale: "en_NG",
    url: site.url,
    siteName: site.movement,
  },
  twitter: {
    card: "summary_large_image",
    site: "@PITSbyAmvora",
    title: site.movement,
    description:
      "Organising in all 36 states, the FCT, 774 LGAs and over 8,000 wards. Power is in the streets. Join PITS.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ce2515" },
    { media: "(prefers-color-scheme: dark)", color: "#2e0503" },
  ],
  colorScheme: "light",
};

/* Structured data. The site's primary entity is the movement, so the graph
   leads with the Organization and carries the candidate as the person it
   supports. A Person as the subject of the whole site would tell search
   engines this was a personal homepage rather than PITS's — and the
   candidate's personal homepage is a different site, which `sameAs` points
   to. */
const organisationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}#organization`,
      name: site.movement,
      alternateName: site.shortName,
      description:
        "A grassroots mobilisation movement organising in all 36 states, the Federal Capital Territory, 774 Local Government Areas and over 8,000 wards.",
      url: site.url,
      areaServed: { "@type": "Country", name: "Nigeria" },
      parentOrganization: { "@type": "Organization", name: "Amvora", url: site.parentUrl },
      sameAs: socials.map((social) => social.href),
    },
    {
      "@type": "Person",
      "@id": `${site.url}#aspirant`,
      name: site.aspirant,
      honorificPrefix: "Prince",
      jobTitle: "Presidential Candidate, Social Democratic Party",
      nationality: "Nigerian",
      birthPlace: "Ondo State, Nigeria",
      affiliation: { "@type": "PoliticalParty", name: site.party },
      sameAs: [site.aspirantUrl],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}#website`,
      url: site.url,
      name: site.movement,
      publisher: { "@id": `${site.url}#organization` },
      about: { "@id": `${site.url}#aspirant` },
      inLanguage: "en-NG",
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-NG" className={montserrat.variable}>
      <body suppressHydrationWarning className="antialiased">
        {/* First tab stop: lets keyboard users jump past the whole nav. */}
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        <ToasterWrapper />
        {/* Masthead and footer on the website; nothing but the app on /admin,
            which carries its own navigation. See components/SiteChrome.jsx. */}
        <SiteChrome>{children}</SiteChrome>

        <script
          type="application/ld+json"
          // Static object authored in this repo. No user input reaches this.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organisationSchema),
          }}
        />
      </body>
    </html>
  );
}
