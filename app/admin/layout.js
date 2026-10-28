import Link from "next/link";
import { redirect } from "next/navigation";
import { Bell, Mail } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import { currentSession } from "@/lib/session";
import { mfaRequired, mfaState } from "@/lib/mfa";
import { can } from "@/lib/permissions";
import AdminNav from "./AdminNav";
import SearchBox from "./SearchBox";
import Sidebar from "./Sidebar";

export const metadata = {
  title: "Secretariat | PITS",
  robots: { index: false, follow: false },
};

/* The admin area reads live figures on every request; caching it would show a
   coordinator yesterday's coverage and today's date. */
export const dynamic = "force-dynamic";

/**
 * The guard for the entire admin area, and its frame.
 *
 * Two separate refusals, deliberately distinguished:
 *   - not signed in            -> /login
 *   - signed in, but no seat   -> a plain explanation, not a 404
 *
 * A member with no office is not doing anything wrong by arriving here; they
 * are just an ordinary member, and telling them so is better than pretending
 * the page does not exist.
 *
 * ── ON THE SHAPE ───────────────────────────────────────────────────────────
 * A fixed rail on the left, one scrolling column of work in the middle. The
 * rail keeps the two facts that decide whether an action is legitimate — which
 * office you hold and which territory it governs — in view for the whole
 * session, rather than in a banner the reader scrolled past an hour ago.
 *
 * Below `lg` the rail becomes a scrolling row of pills above the content: the
 * same destinations in the same order, because a coordinator who learns them on a
 * laptop should find them unchanged on a phone at a ward meeting.
 * ───────────────────────────────────────────────────────────────────────────
 */
export default async function AdminLayout({ children }) {
  const { member, scope } = await currentSession();

  if (!member) redirect("/login?next=/admin");

  if (!scope) {
    return (
      <section className="min-h-screen bg-ink-100 px-4 py-24">
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 sm:p-10">
          <h1 className="font-display text-2xl font-bold tracking-[-0.02em] text-ink-950">
            You do not hold an office
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-content-muted">
            The secretariat dashboard is for members holding a seat in the
            movement&rsquo;s structure. Your membership is active
            {member.membershipNo ? ` as ${member.membershipNo}` : ""}, and you sit
            in the register for {member.ward} Ward. Seats are filled by
            appointment from the authority above them, so this page opens by
            itself if you are appointed to one.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/portal"
              className="rounded-full bg-brand-700 px-6 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-800"
            >
              Your membership
            </Link>
            <Link
              href="/structure"
              className="rounded-full border border-ink-300 px-6 py-3 text-[0.9375rem] font-semibold text-ink-950 transition-colors hover:border-brand-700 hover:text-brand-700"
            >
              See the structure
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /* Decided here, from the seat, on every request — the rail renders what this
     says and never works it out for itself. The polling unit tracker is only
     a working list at the two tiers that can walk it: 176,623 rows is not a
     tool a National Coordinator has been given. */
  /* §13.2: state level and above must have a second factor.

     A redirect, not a panel. Returning a different tree from a layout does NOT
     stop the page underneath rendering — React executes it and Next serialises
     it into the flight payload, so the wall appears on screen with the entire
     unscoped console sitting in the HTML behind it. `redirect()` throws, the
     render aborts, and the response is a 307 with no body: nothing to leak.

     The target is outside /admin for the obvious reason that anything inside it
     would redirect to itself for ever. */
  if (mfaRequired(scope)) {
    const mfa = await mfaState(member.userId);
    if (!mfa.enabled) redirect("/secure");
  }

  const local = scope.scopeType === "LGA" || scope.scopeType === "WARD";
  const regional = !local; // NATION, ZONE and STATE have LGA coordinators beneath them
  /* The console reads the whole platform, so only a scope entitled to the whole
     platform is told it exists. The page checks this again for itself — this
     boolean decides what is drawn, never what is permitted. */
  const nationwide = Boolean(scope.isSuperAdmin || scope.readsNationwide);
  /* §6.11's broadcast capability, resolved here so the rail and the page agree
     about who may text a territory. The page checks it again for itself. */
  const broadcaster = can(scope, "broadcast");
  /* Only the booth holds the form. Everybody above it reads the results and
     enters none of them — see the note on ITEMS in AdminNav. */
  const agent = scope.scopeType === "POLLING_UNIT";

  const firstName = member.name.split(" ")[0];

  return (
    /* A soft grey canvas with white panels floating on it: the frame does the
       separating, so nothing inside needs a heavy border to say where it ends. */
    <div className="min-h-screen bg-ink-100 lg:flex lg:gap-4 lg:p-4">
      <a href="#admin-main" className="skip-link">
        Skip to the page
      </a>

      <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-68 shrink-0 overflow-y-auto rounded-3xl bg-white scrollbar-none lg:block">
        <Sidebar
          local={local}
          regional={regional}
          nationwide={nationwide}
          broadcaster={broadcaster}
          agent={agent}
          tierLabel={scope.tierLabel}
          unitName={scope.unitName}
          roleTitle={scope.roleTitle}
          isSuperAdmin={scope.isSuperAdmin}
        />
      </aside>

      <div className="min-w-0 flex-1 lg:space-y-4">
        {/* ── Top bar ─────────────────────────────────────────────────────
            Search and the person. The search is the members register's own
            GET form, so it works from every page, needs no script, and lands
            on a shareable URL. Pinned on a phone, where it also carries the
            navigation and the territory being acted in. */}
        <header className="sticky top-0 z-30 bg-ink-100 lg:static lg:bg-transparent">
          <div className="flex items-center gap-3 px-4 pt-4 pb-3 lg:rounded-3xl lg:bg-white lg:px-6 lg:py-5">
            <SearchBox />

            {/* Two round shortcuts, the reference's mail and bell: the
                territory's SMS where this seat may send one, and the
                appointments queue, which is what "waiting on you" means here. */}
            <div className="ml-auto hidden items-center gap-2.5 sm:flex">
              {broadcaster && (
                <Link
                  href="/admin/broadcast"
                  aria-label="Bulk SMS"
                  title="Bulk SMS"
                  className="grid size-13 place-items-center rounded-full bg-ink-50 text-ink-700 ring-1 ring-hairline transition-colors hover:bg-white hover:text-brand-700 hover:ring-ink-200"
                >
                  <Mail size={20} strokeWidth={1.9} aria-hidden="true" />
                </Link>
              )}
              <Link
                href="/admin/appointments"
                aria-label="Appointments waiting"
                title="Appointments waiting"
                className="grid size-13 place-items-center rounded-full bg-ink-50 text-ink-700 ring-1 ring-hairline transition-colors hover:bg-white hover:text-brand-700 hover:ring-ink-200"
              >
                <Bell size={20} strokeWidth={1.9} aria-hidden="true" />
              </Link>
            </div>

            <Link
              href="/portal"
              className="flex shrink-0 items-center gap-3 rounded-full py-1 pr-1 pl-1 transition-colors hover:bg-ink-50 max-sm:ml-auto lg:pr-4"
            >
              <Avatar name={member.name} src={member.photoUrl} size="md" ring={false} className="rounded-full ring-2 ring-white shadow-e2" />
              <span className="hidden min-w-0 lg:block">
                <span className="block truncate text-[1rem] font-semibold tracking-[-0.01em] text-ink-950">{member.name}</span>
                <span className="block max-w-56 truncate text-[0.8125rem] text-content-subtle">
                  {scope.roleTitle}
                </span>
              </span>
              <span className="sr-only lg:hidden">{firstName}, your membership</span>
            </Link>
          </div>

          <p className="truncate px-5 pb-3 text-[0.8125rem] text-content-subtle lg:hidden">
            <span className="font-semibold text-ink-900">{scope.unitName}</span> · {scope.roleTitle}
          </p>

          <AdminNav
            local={local}
            regional={regional}
            nationwide={nationwide}
            broadcaster={broadcaster}
            agent={agent}
          />
        </header>

        <main
          id="admin-main"
          tabIndex={-1}
          className="w-full px-4 pt-4 pb-10 outline-none sm:px-6 lg:rounded-3xl lg:bg-ink-50 lg:px-8 lg:py-8 xl:px-10"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
