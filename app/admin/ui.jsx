import Link from "next/link";
import { ArrowUpRight, Inbox, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

/* The dashboard's shared parts. Kept out of the pages so five tiers of admin
   read the same figures in the same shape — a State Coordinator and an LGA
   Coordinator comparing notes should not be looking at two different designs.

   ── THE LOOK ─────────────────────────────────────────────────────────────
   The public site is editorial: square, ruled, loud. The dashboards are a tool
   somebody sits in for an hour, so they are quiet instead — white cards with
   generous rounding on a soft grey canvas, one green hero per screen, big
   numbers and very few words. Weight comes from size and colour, never from a
   heavy border; a page where everything is outlined in black has nowhere left
   for the eye to rest. */

/** The white block everything on the dashboard sits in. */
export function Card({ className, children, ...props }) {
  return (
    <div className={cn("rounded-3xl bg-white", className)} {...props}>
      {children}
    </div>
  );
}

/** A card heading, with an optional way out of it. */
export function SectionHead({ title, lead, href, hrefLabel, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-[-0.01em] text-ink-950 leading-[1.3]">
          {title}
        </h2>
        {lead && <p className="mt-1 text-[0.8125rem] text-content-subtle">{lead}</p>}
      </div>
      {action}
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink-200 px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink-700 transition-colors hover:border-brand-600 hover:text-brand-700"
        >
          {hrefLabel}
          <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

/**
 * A headline figure. Label, a big number, one line underneath — nothing else.
 *
 * `hero` paints it green: one per page, on the figure the page is about, so the
 * eye has a place to land first. `delta` is shown with an arrow and a sign as
 * well as a colour, so direction never rests on colour alone. `icon` is
 * accepted for older callers and deliberately not drawn: four icons above four
 * numbers is four more things to read that say nothing the label does not.
 */
export function StatTile({ label, value, sub, delta, href, tone = "default", hero = false }) {
  const rising = delta > 0;
  const falling = delta < 0;
  const alert = tone === "alert" && value > 0;

  const Tag = href ? Link : "div";

  return (
    <Tag
      {...(href ? { href } : {})}
      className={cn(
        "group relative isolate flex min-h-36 flex-col overflow-hidden rounded-3xl p-5 transition-[transform,box-shadow] duration-300 sm:min-h-48 sm:p-6",
        hero
          ? "bg-[radial-gradient(120%_120%_at_100%_0%,var(--color-brand-600)_0%,var(--color-brand-800)_55%,var(--color-brand-950)_100%)] text-white shadow-[0_20px_44px_-24px_var(--color-brand-700)]"
          : "bg-white text-ink-950",
        href && "hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgb(0_0_0/0.35)]"
      )}
    >
      {hero && (
        /* Contour lines: texture on the one card meant to be seen first. */
        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="absolute -right-20 -bottom-24 -z-10 size-72 text-white/10 transition-transform duration-700 group-hover:scale-105"
        >
          {[30, 52, 74, 96, 118].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeWidth="1.25" />
          ))}
        </svg>
      )}
      <div className="flex items-start justify-between gap-4">
        <p className={cn("text-[0.875rem] font-semibold tracking-[-0.01em] sm:text-[1rem]", hero ? "text-white" : "text-ink-900")}>
          {label}
        </p>
        {href && (
          <span
            aria-hidden="true"
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full transition-[color,background-color,border-color,transform] duration-300 group-hover:rotate-45 sm:size-10",
              hero
                ? "bg-white text-brand-900"
                : "border border-ink-300 text-ink-700 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white"
            )}
          >
            <ArrowUpRight size={18} strokeWidth={2.25} />
          </span>
        )}
      </div>

      <p
        className={cn(
          "mt-auto pt-5 font-display text-[2.25rem] leading-none font-bold tracking-[-0.04em] tabular-nums sm:text-[3.25rem]",
          alert && !hero && "text-red-600"
        )}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>

      <p
        className={cn(
          "mt-3.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] sm:text-[0.875rem]",
          hero ? "text-ember-200" : "text-content-subtle"
        )}
      >
        {(rising || falling) && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.6875rem] font-semibold tabular-nums ring-1",
              hero
                ? "bg-white/15 text-white ring-white/25"
                : rising
                  ? "bg-brand-50 text-brand-700 ring-brand-200"
                  : "bg-red-50 text-red-700 ring-red-200"
            )}
          >
            {rising ? (
              <TrendingUp size={12} strokeWidth={2.5} aria-hidden="true" />
            ) : (
              <TrendingDown size={12} strokeWidth={2.5} aria-hidden="true" />
            )}
            {rising ? "+" : ""}
            {delta.toLocaleString()}
            <span className="sr-only">
              {rising ? " more than" : " fewer than"} the previous period
            </span>
          </span>
        )}
        {sub && <span>{sub}</span>}
      </p>
    </Tag>
  );
}

/** The top of every secretariat page: a big title, one line under it, actions right. */
export function PageTitle({ title, lead, action }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-[2rem] font-bold tracking-[-0.03em] text-ink-950 sm:text-[2.5rem] leading-[1.1]">
          {title}
        </h1>
        {lead && (
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-snug text-content-subtle">{lead}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, sub, tone = "default" }) {
  return <StatTile label={label} value={value} sub={sub} tone={tone} />;
}

/** Coverage as a slim rounded bar with its number. */
export function Coverage({ value, label = "Coverage", className }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full min-w-16 overflow-hidden rounded-full bg-ink-100"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width]",
            value >= 70 ? "bg-brand-600" : value >= 30 ? "bg-ember-500" : "bg-red-500"
          )}
          style={{ width: `${Math.max(value, value > 0 ? 3 : 0)}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-[0.8125rem] font-semibold tabular-nums text-ink-900">
        {value}%
      </span>
    </div>
  );
}

/**
 * The dashboard's one table: a rounded white card with hairline rows.
 *
 * The right edge fades while the table can scroll sideways — the only cue a
 * phone gets that there are columns past the screen. No sticky header: an
 * `overflow-x` box is a scroll container on both axes, so a sticky row inside
 * it would pin to the box, not the page.
 */
export function Table({ head, children, empty, caption }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-linear-to-l from-white to-transparent xl:hidden"
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr>
              {head.map((cell) => (
                <th
                  key={cell.key ?? cell.label}
                  scope="col"
                  className={cn(
                    "border-b border-ink-100 px-5 pt-5 pb-3 text-[0.75rem] font-medium whitespace-nowrap text-content-subtle",
                    cell.align === "right" && "text-right"
                  )}
                >
                  {cell.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {empty}
    </div>
  );
}

export function Row({ children }) {
  return (
    <tr className="border-b border-ink-100 transition-colors last:border-0 hover:bg-ink-50">
      {children}
    </tr>
  );
}

export function Cell({ children, align, className, ...props }) {
  return (
    <td
      className={cn(
        "px-5 py-3.5 text-[0.875rem] text-ink-900",
        align === "right" && "text-right tabular-nums",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

/**
 * Nothing here, and what to do about it. An empty table is the moment somebody
 * is most likely to think the platform is broken rather than that the work has
 * not been done yet, so where the caller can name the next step it is a button.
 */
export function Empty({ children, icon: Icon = Inbox, title, href, hrefLabel }) {
  return (
    <div className="px-6 py-14 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-ink-50 text-ink-400">
        <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
      </span>
      {title && <p className="mt-4 text-[0.9375rem] font-semibold text-ink-950">{title}</p>}
      <p className="mx-auto mt-1.5 max-w-sm text-[0.875rem] leading-relaxed text-content-subtle">
        {children}
      </p>
      {href && (
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-brand-800"
        >
          {hrefLabel}
          <ArrowUpRight size={15} strokeWidth={2.25} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

/* ── Waiting ───────────────────────────────────────────────────────────────
   Every page here is force-dynamic and awaits several queries before the
   first pixel. These are the same sizes as the real blocks, so nothing jumps
   when the page arrives, and a coordinator on a slow connection can see the
   tap registered. */

export function Skeleton({ className, style }) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={cn("rounded-lg bg-ink-200/70 motion-safe:animate-pulse", className)}
    />
  );
}

export function SkeletonTile() {
  return (
    <div className="flex min-h-44 flex-col rounded-3xl bg-white p-6">
      <Skeleton className="h-3.5 w-28" />
      <Skeleton className="mt-auto h-10 w-20" />
      <Skeleton className="mt-3 h-3 w-36" />
    </div>
  );
}

export function SkeletonTable({ rows = 6 }) {
  return (
    <div className="rounded-3xl bg-white p-5">
      <Skeleton className="h-3 w-40" />
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="mt-5 flex items-center gap-4">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="ml-auto h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

const TONES = {
  filled: "border-brand-200 bg-brand-50 text-brand-700",
  vacant: "border-ink-200 bg-ink-50 text-ink-600",
  verified: "border-brand-200 bg-brand-50 text-brand-700",
  pending: "border-ember-200 bg-ember-50 text-ember-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  admin: "border-ink-900 bg-ink-900 text-white",
  functional: "border-ink-200 bg-ink-100 text-ink-700",
};

/** A small status pill. */
export function Tag({ tone = "vacant", children }) {
  return (
    <span
      className={cn(
        "inline-block rounded-md border px-2 py-0.5 text-[0.6875rem] font-medium whitespace-nowrap",
        TONES[tone] ?? TONES.vacant
      )}
    >
      {children}
    </span>
  );
}
