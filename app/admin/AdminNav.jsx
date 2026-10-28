"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  LayoutGrid,
  MapPin,
  Network,
  Radio,
  Share2,
  ShieldCheck,
  Gauge,
  MessageSquare,
  UserCheck,
  UserPlus,
  Users,
  Vote,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * What a coordinator can reach, by tier.
 *
 * Every entry lands on a page that exists and reads real data — there are no
 * placeholders in this list. A rail that advertises a destination before it is
 * built makes a Ward Coordinator click, find nothing, and stop trusting the
 * next one.
 *
 * Two entries are tier-conditional, because at the wrong tier they are not
 * tools:
 *
 *   LGA Coordinators  only above LGA level. An LGA Coordinator has no LGA
 *                     coordinators beneath them, and a Ward Coordinator has
 *                     nobody at all.
 *   PU Tracker        only at LGA and Ward. The 40 polling units in a ward are
 *                     a working list; the 176,623 in the country are not.
 *   Console           only for a scope that reads nationwide, because every
 *                     query behind it is unscoped.
 *   Bulk SMS          only for a scope that carries the broadcast capability —
 *                     an admin coordinator, not a functional director.
 *   File a return     only for a Polling Unit Coordinator. Everybody above them
 *                     views results; nobody above them enters one.
 */
const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid, group: "menu" },
  /* Election day, and the two halves of it are deliberately separate entries.

     "File a return" is the only doing surface in the whole secretariat, and it
     belongs to exactly one office: the Polling Unit Coordinator standing at the
     booth. Nobody above them may enter a result — a National Coordinator typing
     a number into a system whose whole claim is "these came from our agents at
     the booths" would destroy the thing the system is for. So the entry is not
     shown to anybody else, and the form refuses them server-side as well.

     "Live results" is the reading surface, and it is for everybody with a seat.
     The query behind it is cut to the reader's territory by resultScope(): the
     federation for a National Coordinator, one state for a State Coordinator,
     one ward for a Ward Coordinator. */
  { href: "/admin/results", label: "Live results", icon: Radio, group: "election" },
  { href: "/admin/election", label: "File a return", icon: Vote, agent: true, group: "election" },
  { href: "/admin/leadership", label: "Coordinators", icon: UserCheck, group: "menu" },
  /* Shown to everybody with a seat; the page itself 404s for an office that
     appoints to nothing, because isApproverFor() is the only thing that
     decides and it needs the seats to answer. */
  { href: "/admin/appointments", label: "Appointments", icon: UserPlus, group: "menu" },
  { href: "/admin/members", label: "Members", icon: Users, group: "menu" },
  { href: "/admin/lga-coordinators", label: "LGA coordinators", icon: Network, regional: true, group: "menu" },
  { href: "/admin/referrals", label: "Referrals", icon: Share2, group: "menu" },
  /* Only for a scope that speaks for a territory. A functional director reads
     nationwide but broadcasts nowhere, and §6.11 says so through `broadcast`. */
  { href: "/admin/broadcast", label: "Bulk SMS", icon: MessageSquare, broadcaster: true, group: "tools" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, group: "menu" },
  { href: "/admin/polling-units", label: "Polling units", icon: MapPin, local: true, group: "election" },
  { href: "/admin/structure", label: "Structure", icon: Network, group: "menu" },
  { href: "/admin/id-card", label: "ID card", icon: CreditCard, group: "tools" },
  /* Your own account, not anybody else's. Open to every seat: two-factor is
     obligatory from state level up and available to all. */
  { href: "/admin/security", label: "Security", icon: ShieldCheck, group: "tools" },
  /* Last, and only for a scope that reads nationwide. It is the one page in the
     secretariat with no territory filter on any of its queries, so it is not
     advertised to anybody who would be refused it. */
  { href: "/admin/console", label: "Console", icon: Gauge, nationwide: true, group: "tools" },
];

/**
 * `local` and `regional` are decided on the server from the seat and handed
 * down as booleans. The icons cannot cross that boundary — they are functions —
 * so the list lives here and the server sends only the facts that change it.
 */
function itemsFor({ local, regional, nationwide, broadcaster, agent }) {
  return ITEMS.filter((item) => {
    if (item.local && !local) return false;
    if (item.regional && !regional) return false;
    if (item.nationwide && !nationwide) return false;
    if (item.broadcaster && !broadcaster) return false;
    if (item.agent && !agent) return false;
    return true;
  });
}

/* The rail in three short lists rather than one long one. Fifteen links in a
   single column is a list nobody reads past the sixth; three headed groups of
   four or five is a menu somebody learns in a day. Order inside each group is
   the order of ITEMS, so the list above stays the single source of truth. */
const GROUPS = [
  { key: "menu", label: "Menu" },
  { key: "election", label: "Election" },
  { key: "tools", label: "Tools" },
];

/** Phone: a scrolling row of pills above the content. */
export default function AdminNav({ local, regional, nationwide, broadcaster, agent }) {
  const pathname = usePathname();
  const items = itemsFor({ local, regional, nationwide, broadcaster, agent });

  return (
    /* Up to fifteen destinations and a phone shows about three. The fade is
       the only thing saying the others exist. */
    <div className="relative lg:hidden">
      <nav
        aria-label="Secretariat"
        className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none"
      >
        {items.map((item) => (
          <Tab key={item.href} item={item} pathname={pathname} orientation="horizontal" />
        ))}
      </nav>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-ink-100 to-transparent"
      />
    </div>
  );
}

/** Desk: the rail, in headed groups. */
export function AdminRail({ local, regional, nationwide, broadcaster, agent }) {
  const pathname = usePathname();
  const items = itemsFor({ local, regional, nationwide, broadcaster, agent });

  return (
    <nav aria-label="Secretariat" className="space-y-7">
      {GROUPS.map((group) => {
        const inGroup = items.filter((item) => item.group === group.key);
        if (!inGroup.length) return null;
        return (
          <div key={group.key}>
            <p className="px-8 pb-2.5 text-[0.75rem] font-medium tracking-[0.08em] text-ink-400 uppercase">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {inGroup.map((item) => (
                <li key={item.href}>
                  <Tab item={item} pathname={pathname} orientation="vertical" />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function Tab({ item, pathname, orientation }) {
  // "/admin" would otherwise match every child route.
  const active =
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
  const Icon = item.icon;

  if (orientation === "horizontal") {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[0.8125rem] font-medium transition-colors",
          active ? "bg-brand-700 text-white" : "bg-white text-ink-600 hover:text-ink-950"
        )}
      >
        <Icon size={15} strokeWidth={2} className="shrink-0" aria-hidden="true" />
        {item.label}
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-4 px-8 py-2.5 text-[1rem] transition-colors",
        active ? "font-semibold text-ink-950" : "text-ink-500 hover:text-ink-950"
      )}
    >
      {/* The green tab on the rail's edge: position, not colour alone, says
          which page this is. */}
      {active && (
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-0 w-1.5 rounded-r-full bg-brand-700 shadow-[0_0_12px_var(--color-brand-500)]"
        />
      )}
      <Icon
        size={21}
        strokeWidth={active ? 2.25 : 1.75}
        className={cn(
          "shrink-0 transition-colors",
          active ? "text-brand-700" : "text-ink-400 group-hover:text-ink-700"
        )}
        aria-hidden="true"
      />
      {item.label}
    </Link>
  );
}
