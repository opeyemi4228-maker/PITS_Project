import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

import { assets } from "@/assets/assets";
import Avatar from "@/components/ui/Avatar";
import { SESSION_COOKIE } from "@/lib/auth";
import { currentSession } from "@/lib/session";

/**
 * The portal's front door, and the reason it is a layout rather than a check
 * inside the page.
 *
 * `loading.js` puts the page inside a Suspense boundary, which is what lets
 * the skeleton stream while the register is read. But a `redirect()` *below*
 * that boundary can no longer be a 307: the shell has already gone out with a
 * 200, so a signed-out visitor got a flash of somebody else's dashboard
 * skeleton before being sent to sign in. The masthead's main button points
 * here, so that is the common path, not the rare one.
 *
 * A layout runs above the boundary, so the refusal is a real redirect again.
 * The cookie is checked first and costs nothing; only once there is one does
 * this read the session, and `currentSession` is request-cached, so the page
 * underneath reuses the same answer rather than asking again.
 *
 * It also carries the portal's only chrome. The site masthead and footer are
 * off here (see components/SiteChrome.jsx), so this bar is the whole way back
 * to the website, plus the one door out of it that matters: a member who holds
 * a seat is two people on this platform, and the switch between them belongs
 * where they can always see it rather than in a card halfway down a page.
 */
export default async function PortalLayout({ children }) {
  const store = await cookies();
  if (!store.get(SESSION_COOKIE)?.value) redirect("/login?next=/portal");

  const { member, scope } = await currentSession();

  return (
    <div className="min-h-screen bg-ink-100 p-3 sm:p-4">
      <header className="sticky top-3 z-40 mx-auto max-w-352 sm:top-4">
        <div className="flex h-16 items-center gap-3 rounded-full bg-white/90 px-3 shadow-[0_8px_30px_-18px_rgb(0_0_0/0.25)] backdrop-blur sm:px-4">
          <Link
            href="/"
            aria-label="Back to the website"
            className="grid size-10 shrink-0 place-items-center rounded-full text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-950"
          >
            <ArrowLeft size={18} strokeWidth={2.25} aria-hidden="true" />
          </Link>

          <span className="flex min-w-0 items-center gap-2.5">
            <Image src={assets.amvoraMark} alt="" sizes="64px" className="h-8 w-auto object-contain" />
            <span className="truncate font-display text-lg font-bold tracking-[-0.03em] text-ink-950">
              PITS
            </span>
          </span>

          <div className="ml-auto flex items-center gap-2">
            {/* ── The switch ───────────────────────────────────────────────
                Only for a member who holds a seat. Ordinary members never
                see it and are never told it exists. */}
            {scope && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2.5 text-[0.875rem] font-semibold text-white transition-colors hover:bg-brand-800"
              >
                <LayoutDashboard size={16} strokeWidth={2.25} aria-hidden="true" className="shrink-0" />
                <span className="max-sm:sr-only">Secretariat</span>
              </Link>
            )}
            {member && (
              <span className="hidden items-center gap-3 rounded-full py-1 pr-3 pl-1 md:flex">
                <Avatar name={member.name} src={member.photoUrl} size="sm" ring={false} className="rounded-full" />
                <span className="max-w-44 truncate text-[0.875rem] font-semibold text-ink-950">
                  {member.name}
                </span>
              </span>
            )}
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
