"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { assets } from "@/assets/assets";
import Button from "@/components/ui/Button";
import JoinCta from "@/components/JoinCta";
import { election } from "@/lib/agenda";
import { candidate } from "@/lib/adebayo";
import { cn } from "@/lib/utils";

/* ════════════════════════════════════════════════════════════════════════════
   THE HERO

   One photographic panel, inset a few pixels from the viewport and rounded,
   with the candidate standing in it, the headline anchored bottom-left where
   the scrim is darkest, and a frosted card bottom-right carrying the one live
   fact on the page: how long is left.

   ── ONE PHOTOGRAPH, TWO LAYERS ─────────────────────────────────────────────
   The campaign's portraits are 720px squares against a pale wall — too small
   to stretch across a 1,400px panel and too bright to set white type over.
   So the same frame is drawn twice:

     1. Behind: scaled up past the panel, blurred hard and darkened. Blur is
        the one treatment that hides a low-resolution source, and darkened it
        becomes the warm, out-of-focus room the scene is lit by.
     2. In front: at close to its native size, sharp, with its edges masked
        away. Because the layer behind is the *same* photograph, the mask has
        nothing to reveal but a softer version of what it is hiding, so the
        join cannot be seen.

   ── THE CARD ───────────────────────────────────────────────────────────────
   The countdown is computed in an effect, not during render: the server and
   the browser would disagree about "now" by however long the page took to
   arrive, and a hydration mismatch on the first thing a visitor sees is the
   worst place to have one. Until it runs, the card shows its labels and an
   en dash at the same size, so nothing moves when the number lands.
   ════════════════════════════════════════════════════════════════════════ */

const UNITS = [
  { key: "days", label: "Days", ms: 86_400_000 },
  { key: "weeks", label: "Weeks", ms: 604_800_000 },
  { key: "hours", label: "Hours", ms: 3_600_000 },
];

const ZONES = ["NC", "NE", "NW", "SE", "SS", "SW"];

function Countdown() {
  const [unit, setUnit] = useState("days");
  const [left, setLeft] = useState(null);

  useEffect(() => {
    const target = new Date(election.date).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const current = UNITS.find((u) => u.key === unit);
  const value =
    left === null ? "…" : new Intl.NumberFormat("en-NG").format(Math.floor(left / current.ms));

  return (
    <aside
      aria-label="Countdown to the presidential election"
      className="glass-light w-full max-w-[19rem] shrink-0 rounded-[1.5rem] p-5 text-ink-950 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-[1.25rem] font-semibold tracking-[-0.03em]">Election day</p>
        <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[0.75rem] font-semibold text-white">
          {candidate.partyShort} 2027
        </span>
      </div>

      <div role="tablist" aria-label="Count in" className="mt-3 flex gap-4 text-[0.8125rem]">
        {UNITS.map((u) => (
          <button
            key={u.key}
            type="button"
            role="tab"
            aria-selected={unit === u.key}
            onClick={() => setUnit(u.key)}
            className={cn(
              "transition-colors",
              unit === u.key ? "font-semibold text-ink-950" : "text-ink-400 hover:text-ink-700"
            )}
          >
            {u.label}
          </button>
        ))}
      </div>

      <p
        aria-live="polite"
        className="mt-5 font-display text-[3.25rem] leading-none font-semibold tracking-[-0.03em] tabular-nums"
      >
        {value}
      </p>
      <p className="mt-2 text-[0.8125rem] text-ink-500">
        {current.label.toLowerCase()} until polls open · {election.day}
      </p>

      {/* The six zones the movement organises in, drawn as the card's bars.
          Two heights, alternating, as a pattern and not as data: this is a
          statement that every zone counts the same, not a chart of anything. */}
      <div aria-hidden="true" className="mt-5 grid grid-cols-6 items-end gap-1.5">
        {ZONES.map((zone, index) => (
          <div key={zone} className="flex flex-col items-center gap-1.5">
            <span
              className={cn("w-full rounded-md", index % 2 ? "h-8 bg-ember-500" : "h-11 bg-brand-600")}
            />
            <span className="text-[0.625rem] font-medium text-ink-500">{zone}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[0.75rem] text-ink-400">Organising in all six zones</p>
    </aside>
  );
}

/* The campaign tape under the hero: the call, said the way a rally chant says
   it. Decorative (aria-hidden) because each phrase is stated in text on the
   page. */
function Tape() {
  const tape = [
    "Power in the streets",
    `${candidate.short} for President`,
    "Security · Production · Justice",
    "A Nigeria that works",
    election.day,
    "Hope in action",
  ];
  const run = (copy) =>
    tape.map((phrase) => (
      <span key={`${copy}-${phrase}`} className="flex shrink-0 items-center gap-7 pr-7">
        <span>{phrase}</span>
        <span aria-hidden="true" className="size-1.5 rounded-full bg-ink-950/60" />
      </span>
    ));

  return (
    <div
      aria-hidden="true"
      className="mx-2 mt-2 overflow-hidden rounded-full bg-ember-500 text-ink-950 sm:mx-3"
    >
      {/* Two identical runs, moved by exactly half their width, loop without
          a seam. Paused on hover so it can be read. */}
      <div className="flex w-max animate-marquee py-3 font-display text-[0.9375rem] font-semibold tracking-[-0.01em] whitespace-nowrap hover:[animation-play-state:paused]">
        {run("a")}
        {run("b")}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <div className="px-2 pt-2 sm:px-3 sm:pt-3">
        <div className="relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-night text-white">
          {/* 1. The room: the portrait, enlarged, blurred and darkened. */}
          <Image
            src={assets.adebayoPointing}
            alt=""
            priority
            sizes="40vw"
            className="absolute inset-0 -z-20 h-full w-full scale-125 object-cover opacity-80 blur-2xl brightness-[0.42] saturate-[1.2]"
          />
          {/* A trace of torch light from the right. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20 bg-[radial-gradient(55%_70%_at_75%_30%,color-mix(in_oklch,var(--color-brand-500)_26%,transparent)_0%,transparent_70%)]"
          />

          {/* 2. The man: sharp, near native size, edges melted away. Named in
              the headline's paragraph, so the image itself is decorative.

              On a phone he stands at the top of the panel, full width, fading
              downward, and the copy starts below his face. From lg he stands
              to the right of the copy in a radial vignette. The inner overlay
              darkens the pale wall at the edge of the sharp frame, which
              otherwise shows as a lighter halo against the darkened room. */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 aspect-square w-full [mask-image:linear-gradient(to_bottom,#000_45%,transparent_92%)] sm:inset-x-auto sm:right-[-6%] sm:h-full sm:w-auto sm:[mask-image:radial-gradient(closest-side,#000_42%,transparent_96%)] lg:right-[16%]"
          >
            <Image
              src={assets.adebayoPointing}
              alt=""
              priority
              quality={92}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-full w-full object-cover object-[center_25%] brightness-[0.9]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(closest-side,transparent_35%,color-mix(in_oklch,var(--color-night)_75%,transparent)_100%)]" />
          </div>

          {/* Scrim: heaviest bottom-left, where the type sits. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-night)_0%,color-mix(in_oklch,var(--color-night)_55%,transparent)_38%,transparent_68%),linear-gradient(to_right,color-mix(in_oklch,var(--color-night)_82%,transparent)_0%,transparent_58%)]"
          />

          <div className="shell shell-wide flex min-h-[calc(100svh-8rem)] flex-col justify-end gap-10 pt-[62vw] pb-8 sm:pt-40 sm:pb-10 lg:min-h-[44rem] lg:flex-row lg:items-end lg:justify-between lg:pb-12">
            <div className="max-w-3xl">
              <p className="glass flex w-fit items-center gap-2.5 rounded-full py-1.5 pr-4 pl-1.5 text-[0.8125rem] text-white/85">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white">
                  <Image src={assets.amvoraMark} alt="" sizes="28px" className="h-5 w-auto" />
                </span>
                <span className="sm:hidden">{candidate.partyShort} · {election.day.replace(/^\S+ /, "")}</span>
                <span className="hidden sm:inline">
                  {candidate.party} · {election.day}
                </span>
              </p>

              <h1
                id="hero-title"
                className="mt-6 text-[clamp(2.75rem,1.4rem+6.2vw,6.25rem)] leading-[0.95] font-semibold tracking-[-0.03em] text-white"
              >
                Power is in
                <br />
                the streets.
              </h1>

              <p className="mt-6 max-w-[34rem] text-fluid-lg leading-relaxed text-white/75">
                Join the movement organising every ward in Nigeria behind{" "}
                <span className="text-white">{candidate.name}</span> and his plan
                for security, production and justice.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <JoinCta variant="ember" size="lg" />
                <Button href="/manifesto" variant="inverseOutline" size="lg">
                  Read the manifesto
                  <ArrowRight size={17} strokeWidth={2.5} aria-hidden="true" />
                </Button>
              </div>

              <p className="mt-5 text-[0.8125rem] text-white/50">
                Free, and it takes under a minute.
              </p>
            </div>

            <Countdown />
          </div>
        </div>
      </div>

      <Tape />
    </section>
  );
}
