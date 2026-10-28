import Link from "next/link";
import { ArrowUpRight, MessageSquare, Plus, Share2, Users } from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import Gauge from "@/components/ui/Gauge";
import WeekBars from "@/components/ui/WeekBars";
import ReferralHero from "@/components/ReferralHero";
import Priority from "./Priority";
import { Card, Coverage, StatTile, Tag } from "./ui";

const LEVEL_LABEL = { zone: "Zone", state: "State", lga: "LGA", ward: "Ward" };
const LAGOS = "Africa/Lagos";

function greeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-NG", { hour: "numeric", hour12: false, timeZone: LAGOS }).format(
      new Date()
    )
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const shortDay = (value) =>
  new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", timeZone: LAGOS }).format(
    new Date(value)
  );

/** A card with a title and an optional small pill link, the way every card here opens. */
function CardHead({ title, href, label = "See all" }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-[1.1875rem] font-semibold tracking-[-0.015em] text-ink-950">{title}</h2>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-ink-200 px-3 py-1 text-[0.8125rem] font-medium text-ink-700 transition-colors hover:border-brand-600 hover:text-brand-700"
        >
          {label}
          <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

/**
 * The secretariat overview (§10.1).
 *
 * ── WHAT CHANGED, AND THE ONE RULE BEHIND IT ───────────────────────────────
 * The previous page was right about what to say and wrong about how much. Every
 * block carried a paragraph, every figure an explanation, and a coordinator had
 * to read the page to use it. The rule now: a card says one thing, in as few
 * words as it can, and the number or the face does the rest.
 *
 * The order is still work first. Top row, the four figures, one of them green
 * so the eye lands somewhere. Second row, left to right: this week, what needs
 * you, who is recruiting — the three questions a coordinator opens this page
 * to ask. Below that, the people and the structure. Nothing below the fold is
 * urgent; that is the promise the top half makes.
 *
 * Everything with a deeper page links to it. Nothing on this page tries to be
 * that page.
 */
export default function OverviewView({
  member,
  scope,
  stats,
  units,
  series,
  recruiters,
  seats,
  newest,
  waiting,
  appoints,
  broadcaster,
}) {
  const isWard = scope.scopeType === "WARD";

  const leaderless = units?.rows.filter((row) => !row.coordinator).length ?? 0;
  /* "LGA" is an acronym and stays capitalised; the others read as words. */
  const unitWord = units
    ? units.level === "lga"
      ? "LGA"
      : LEVEL_LABEL[units.level].toLowerCase()
    : "unit";
  const overdue = waiting.filter((row) => row.overdue).length;
  const soonest = waiting.find((row) => !row.overdue)?.slaDueAt ?? null;
  const place = scope.scopeType === "NATION" ? "the movement" : scope.label;
  const firstName = member.name.split(" ")[0];
  const weekJoined = (series ?? []).reduce((sum, day) => sum + day.joined, 0);

  return (
    <div className="space-y-6">
      {/* ── Title ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
        <div className="min-w-0">
          <h1 className="font-display text-[2.25rem] leading-[1.05] font-bold tracking-[-0.035em] text-ink-950 sm:text-[3rem]">
            {greeting()}, {firstName}
          </h1>
          <p className="mt-2.5 text-[1rem] text-content-subtle">
            Here&rsquo;s {place} today.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {appoints && (
            <Link
              href="/admin/appointments"
              className="inline-flex h-13 items-center gap-2 rounded-full bg-brand-700 px-7 text-[1rem] font-semibold text-white shadow-[0_12px_28px_-14px_var(--color-brand-700)] transition-colors hover:bg-brand-800"
            >
              <Plus size={18} strokeWidth={2.25} aria-hidden="true" />
              Appoint
            </Link>
          )}
          <Link
            href={broadcaster ? "/admin/broadcast" : "/admin/members"}
            className="inline-flex h-13 items-center gap-2 rounded-full border border-ink-300 bg-white px-7 text-[1rem] font-semibold text-ink-950 transition-colors hover:border-ink-950"
          >
            {broadcaster ? (
              <MessageSquare size={17} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Users size={17} strokeWidth={2} aria-hidden="true" />
            )}
            {broadcaster ? "Send SMS" : "Members"}
          </Link>
        </div>
      </div>

      {/* ── The four figures ─────────────────────────────────────────────
          Members is the hero: it is the number this whole structure exists
          to grow, and one green card gives the row a place to start. */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatTile
          hero
          label="Members"
          value={stats.members}
          delta={stats.growth}
          sub={`${stats.recent.toLocaleString()} this month`}
          href="/admin/members"
        />
        <StatTile
          label="Seats filled"
          value={stats.filled}
          sub={`of ${stats.seats.toLocaleString()}`}
          href="/admin/structure"
        />
        <StatTile
          label="Through referrals"
          value={stats.referred}
          sub={`${stats.referredShare}% of members`}
          href="/admin/referrals"
        />
        <StatTile
          label={appoints ? "Waiting on you" : "Polling units covered"}
          value={appoints ? waiting.length : stats.agents}
          tone={overdue ? "alert" : "default"}
          sub={
            appoints
              ? overdue
                ? `${overdue} past 72 hours`
                : waiting.length
                  ? "all inside 72 hours"
                  : "nothing open"
              : `of ${stats.booths.toLocaleString()}`
          }
          href={appoints ? "/admin/appointments" : undefined}
        />
      </div>

      {/* ── This week · Needs you · Recruiting ─────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-12">
        <Card className="p-6 lg:col-span-2 xl:col-span-5">
          <CardHead title="This week" href="/admin/analytics" label="Analytics" />
          <p className="mt-1 text-[0.875rem] text-content-subtle">
            <span className="font-semibold text-ink-950 tabular-nums">
              {weekJoined.toLocaleString()}
            </span>{" "}
            joined in the last 7 days
          </p>
          <WeekBars data={series} className="mt-6" />
        </Card>

        {/* First on a phone: the work comes before the chart. */}
        <Priority
          className="max-lg:order-first xl:col-span-4"
          overdue={overdue}
          waiting={waiting.length - overdue}
          soonest={soonest}
          leaderless={leaderless}
          unitWord={unitWord}
          appoints={appoints}
        />

        <Card className="p-6 xl:col-span-3">
          <CardHead title="Recruiters" href="/admin/referrals" />
          {recruiters?.length ? (
            <ol className="mt-5 space-y-4">
              {recruiters.map((person) => (
                <li key={person.id}>
                  <Link href={`/admin/members/${person.id}`} className="group flex items-center gap-3">
                    <Avatar
                      name={person.name}
                      src={person.photoUrl}
                      size="sm"
                      ring={false}
                      className="rounded-full"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.9375rem] font-medium text-ink-950 group-hover:text-brand-700">
                        {person.name}
                      </span>
                      <span className="block truncate text-[0.75rem] text-content-subtle">
                        {person.ward}
                      </span>
                    </span>
                    <span className="shrink-0 text-[0.9375rem] font-semibold text-ink-950 tabular-nums">
                      {person.referrals.toLocaleString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/60 px-5 py-7 text-center">
              <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand-700 shadow-e1 ring-1 ring-hairline">
                <Share2 size={20} strokeWidth={2} aria-hidden="true" />
              </span>
              <p className="mt-4 text-[0.9375rem] font-semibold text-ink-950">No referrals yet</p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-content-subtle">
                Share your code. It&rsquo;s the fastest way to start.
              </p>
              <Link
                href="/admin/referrals"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-night px-4 py-2 text-[0.8125rem] whitespace-nowrap font-semibold text-white transition-colors hover:bg-brand-800"
              >
                Recruit
                <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden="true" />
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* ── People · Structure · Your code ─────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-12">
        <Card className="p-6 lg:col-span-2 xl:col-span-5">
          <CardHead title="Just joined" href="/admin/members" />
          {newest.length ? (
            <ul className="mt-5 space-y-4">
              {newest.map((person) => {
                const verified = person.verification === "VERIFIED";
                return (
                  <li key={person.id}>
                    <Link href={`/admin/members/${person.id}`} className="group flex items-center gap-3.5">
                      <Avatar
                        name={person.name}
                        src={person.photoUrl}
                        size="md"
                        ring={false}
                        className="rounded-full"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.9375rem] font-medium text-ink-950 group-hover:text-brand-700">
                          {person.name}
                        </span>
                        <span className="block truncate text-[0.8125rem] text-content-subtle">
                          {person.ward} · {shortDay(person.joinedAt)}
                        </span>
                      </span>
                      <Tag tone={verified ? "verified" : "pending"}>
                        {verified ? "Verified" : "Pending"}
                      </Tag>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-5 text-[0.875rem] text-content-subtle">
              Nobody has registered in {scope.unitName} yet.
            </p>
          )}
        </Card>

        {/* The structure as one ring, the way §10.1 asks for it. At a new
            territory's 2% a percentage alone reads as broken; a short arc
            reads as a start. */}
        <Card className="flex flex-col p-6 xl:col-span-4">
          <CardHead title="Structure" href="/admin/structure" label="Seat map" />
          <Gauge
            className="mt-6 flex flex-1 flex-col justify-center"
            value={stats.coverage}
            label="Seats filled"
            legend={[
              { label: "Filled", value: stats.filled.toLocaleString() },
              { label: "Vacant", value: stats.vacant.toLocaleString(), hatched: true },
            ]}
          />
        </Card>

        <ReferralHero code={member.referralCode} className="min-h-64 xl:col-span-3" />
      </div>

      {/* ── The weakest units, or a ward's own ten seats ─────────────────
          Five rows, weakest first. The page's job is to point at the gap; the
          seat map is where the whole list lives. */}
      {isWard && seats?.length > 0 && (
        <Card className="p-6">
          <CardHead title={`${scope.unitName} ward seats`} href={appoints ? "/admin/appointments" : undefined} label="Appoint" />
          <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {seats.map((seat) => (
              <li key={seat.id} className="flex items-center gap-3.5">
                <Avatar
                  name={seat.holder?.name ?? "?"}
                  src={seat.holder?.photoUrl}
                  size="sm"
                  ring={false}
                  className={seat.holder ? "rounded-full" : "rounded-full bg-ink-100 text-ink-400"}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.9375rem] font-medium text-ink-950">
                    {seat.holder?.name ?? "Vacant"}
                  </span>
                  <span className="block truncate text-[0.8125rem] text-content-subtle">
                    {seat.title}
                    {seat.seatIndex ? ` ${seat.seatIndex}` : ""}
                  </span>
                </span>
                <Tag tone={seat.holder ? "filled" : "pending"}>{seat.holder ? "Filled" : "Open"}</Tag>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {units?.rows.length > 0 && (
        <Card className="p-6">
          <CardHead
            title={`${LEVEL_LABEL[units.level]}s that need the most help`}
            href="/admin/structure"
          />
          <ul className="mt-5 divide-y divide-ink-100">
            {units.rows.slice(0, 5).map((row) => (
              <li key={row.id} className="grid items-center gap-x-6 gap-y-2 py-3.5 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(9rem,1fr)]">
                <span className="min-w-0">
                  <span className="block truncate text-[0.9375rem] font-medium text-ink-950">{row.name}</span>
                  <span className="block text-[0.8125rem] text-content-subtle tabular-nums">
                    {row.members.toLocaleString()} members · {row.filled}/{row.seats} seats
                  </span>
                </span>
                <span className="min-w-0 text-[0.875rem]">
                  {row.coordinator ? (
                    <span className="truncate text-ink-700">{row.coordinator}</span>
                  ) : appoints ? (
                    <Link href="/admin/appointments" className="font-medium text-ember-700 hover:underline">
                      No coordinator. Appoint
                    </Link>
                  ) : (
                    <span className="text-ember-700">No coordinator</span>
                  )}
                </span>
                <Coverage value={row.coverage} label={`${row.name} seats filled`} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
