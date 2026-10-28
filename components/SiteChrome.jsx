"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VolunteerRail from "@/components/VolunteerRail";

/**
 * The public site's masthead, footer and support rail — everywhere except the
 * secretariat.
 *
 * /admin is an application, not a page of the website. It has its own rail
 * carrying its own navigation, and the two sets of navigation stacked on top of
 * each other left a coordinator with a campaign masthead, a dashboard rail, a
 * footer of marketing links and a floating support button, all competing for a
 * screen they are trying to read a coverage table on.
 *
 * The exclusion is by path rather than by route group so that the public routes
 * did not all have to move into a `(site)` directory to get one screen out of
 * the chrome. The trade is that this component is a client component and reads
 * the path — cheap, and it renders nothing at all on the routes it excludes.
 *
 * /portal is excluded for the same reason as /admin: it is the member's own
 * dashboard, not a page of the website. A campaign masthead inviting them to
 * "Join PITS" above their own membership card, and four columns of marketing
 * links below it, are chrome for a stranger. The portal carries its own way
 * back to the site instead — see app/portal/layout.js.
 *
 * The four AUTH routes are excluded as well. They are one task on one screen:
 * type these two things and get in. A masthead there offers eight ways to
 * abandon it — including a Portal button that lands right back on the page
 * they are already looking at, which is how somebody signed out ends up
 * thinking the sign-in page IS the portal. Their way back is one arrow, in
 * components/auth/AuthShell.jsx.
 */

/* Signing in, joining, resetting a password, enrolling a second factor. */
const AUTH = ["/login", "/join", "/reset", "/secure"];
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const bare =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/portal") ||
    AUTH.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (bare) return <main id="main">{children}</main>;

  return (
    <>
      <Navbar />
      {/* No padding offset needed: the nav is sticky, not fixed, so it
          occupies real space in the document flow. */}
      <main id="main">{children}</main>
      <Footer />
      <VolunteerRail />
    </>
  );
}
