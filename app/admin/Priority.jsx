import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";

import { cn } from "@/lib/utils";

const LAGOS = "Africa/Lagos";

const due = (value) =>
  new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: LAGOS,
  }).format(new Date(value));

const plural = (n, one, many) =>
  `${n.toLocaleString()} ${n === 1 ? one : many}`;

/**
 * What is waiting on the reader, most urgent first.
 *
 * ── ONE HEADLINE, NOT A LIST OF ALARMS ─────────────────────────────────────
 * The most urgent thing gets the card: a large line, one short sentence, and
 * the only button. Anything else waiting sits underneath as a quiet row. A
 * column of three red banners asks the reader to triage; a headline has
 * already triaged for them, and the thing people do next is whatever the page
 * made biggest.
 *
 * Ranked by whose time is being spent: an application past its 72 hours
 * (§8.1.6) is a promise to a member already broken; one inside them is the
 * same promise still keepable; a unit with no coordinator compounds, but
 * nobody is refreshing a page waiting for it.
 *
 * ── WHEN NOTHING IS WAITING ────────────────────────────────────────────────
 * It says so, calmly. Silence would be indistinguishable from a card that
 * failed to load, and "you are caught up" is the one piece of good news a
 * working dashboard can honestly give.
 */
export default function Priority({
  overdue,
  waiting,
  soonest,
  leaderless,
  unitWord,
  appoints,
  className,
}) {
  const items = [];

  if (overdue > 0) {
    items.push({
      key: "overdue",
      urgent: true,
      title: `${plural(overdue, "application", "applications")} past 72 hours`,
      detail:
        "Members are waiting on your answer. A yes or a no both close it.",
      cta: "Answer now",
    });
  }
  if (waiting > 0) {
    items.push({
      key: "waiting",
      title: `${plural(waiting, "application", "applications")} to review`,
      detail: soonest
        ? `First answer due ${due(soonest)}.`
        : "Each is owed an answer within 72 hours.",
      cta: "Review",
    });
  }
  if (leaderless > 0) {
    items.push({
      key: "leaderless",
      title: `${plural(leaderless, unitWord, `${unitWord}s`)} with no coordinator`,
      detail: "Nothing beneath them can be filled until they have one.",
      cta: "Appoint",
    });
  }

  /* Every item lands on the appointments page, which refuses an office that
     appoints to nothing. For such an office there is no button — one that
     opens a 404 is worse than none. */
  const href = appoints ? "/admin/appointments" : null;
  const [lead, ...rest] = items;

  return (
    <section
      aria-labelledby="priority-heading"
      className={cn("flex flex-col rounded-3xl bg-white p-6", className)}
    >
      <h2
        id="priority-heading"
        className="text-lg font-semibold tracking-[-0.01em] text-ink-950"
      >
        Needs you
      </h2>

      {!lead ? (
        <div className="flex flex-1 flex-col justify-center py-6">
          <span className="grid size-12 place-items-center rounded-full bg-brand-50 text-brand-700">
            <CircleCheck size={24} strokeWidth={2} aria-hidden="true" />
          </span>
          <p className="mt-4 font-display text-2xl font-bold tracking-[-0.02em] text-brand-800 leading-[1.15]">
            You&rsquo;re all caught up
          </p>
          <p className="mt-2 text-[0.875rem] text-content-subtle">
            No applications waiting, and every unit has a coordinator.
          </p>
        </div>
      ) : (
        <>
          <p
            className={cn(
              "mt-5 font-display text-[1.625rem] font-bold tracking-tight leading-[1.15]",
              lead.urgent ? "text-red-600" : "text-brand-800",
            )}
          >
            {lead.title}
          </p>
          <p className="mt-2 text-[0.875rem] text-content-subtle">
            {lead.detail}
          </p>

          {rest.length > 0 && (
            <ul className="mt-4 space-y-2">
              {rest.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center gap-2.5 text-[0.8125rem] text-ink-600"
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 shrink-0 rounded-full bg-ember-500"
                  />
                  {item.title}
                </li>
              ))}
            </ul>
          )}

          {href && (
            <div className="mt-auto pt-6">
              <Link
                href={href}
                className={cn(
                  "group flex items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-[0.9375rem] font-semibold text-white transition-colors",
                  lead.urgent
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-brand-700 hover:bg-brand-800",
                )}
              >
                {lead.cta}
                <ArrowRight
                  size={17}
                  strokeWidth={2.25}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
