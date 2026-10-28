import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import { assets } from "@/assets/assets";
import { headline, pillars, themes } from "@/lib/agenda";

/* ════════════════════════════════════════════════════════════════════════════
   The manifesto, on the homepage.

   Directly under the hero, because the hero says who and this says what.

   ── WHY IT IS LIGHT, NOT DARK ──────────────────────────────────────────────
   Directly beneath a dark hero, a dark band reads as a continuation of the
   hero rather than as the first thing the page says. Paper gives the hero an
   edge to end on. The three words are photographic cards, so the band still
   carries the hero's weight without repeating its colour.

   The photographs are of the country, not of the candidate or the movement,
   and their alt text says only what is in the frame.

   ── WHY THREE CARDS AND NOT EIGHT ROWS ──────────────────────────────────────
   The eight pillars already arrive grouped into three themes, each with a
   sentence of its own. Three groups is something a reader can hold; eight
   items is a list they skim and abandon. So the homepage shows the campaign's
   own three-word summary, then the three themes as the shape of the rest, then
   one way through to the whole thing. Nothing is hidden — /manifesto carries
   all eight, with sources — and the homepage never restates a commitment in
   words of its own.
   ════════════════════════════════════════════════════════════════════════ */

/* One photograph per word: what the word looks like when it works. */
const wordImages = {
  security: { src: assets.ngPolice, alt: "Police officers on duty" },
  economy: { src: assets.ngMarket, alt: "A busy market" },
  governance: { src: assets.ngAssembly, alt: "The National Assembly" },
};

export default function AgendaBand() {
  return (
    <section aria-labelledby="agenda-band" className="section">
      <div className="shell shell-wide">
        <SectionHeading
          eyebrow={`${headline.kicker} · SDP 2027`}
          title={
            <span id="agenda-band">
              Eight pillars. <span className="text-brand-600">One Nigeria.</span>
            </span>
          }
          lead={headline.lead}
          actions={
            <Button href="/manifesto" variant="dark" size="lg">
              All {pillars.length} pillars, with sources
              <ArrowRight size={17} strokeWidth={2.5} aria-hidden="true" />
            </Button>
          }
        />

        {/* ─────────────────────────────────────────────── the three words */}
        <ul className="mt-12 grid gap-3 md:grid-cols-3 lg:gap-4">
          {headline.words.map((word, index) => (
            <Reveal
              as="li"
              key={word.label}
              delay={index * 80}
              className="group relative isolate min-h-[22rem] overflow-hidden rounded-[var(--radius-card)] bg-night text-white lg:min-h-[26rem]"
            >
              <Link href={`/manifesto#point-${word.pillar}`} className="absolute inset-0 flex flex-col justify-end p-6 lg:p-7">
                <Image
                  src={wordImages[word.pillar].src}
                  alt={wordImages[word.pillar].alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="-z-10 object-cover transition-transform duration-700 ease-out-quart group-hover:scale-[1.05]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/55 to-night/5"
                />
                <span className="glass absolute top-5 left-5 grid size-10 place-items-center rounded-full font-display text-[0.9375rem] font-semibold tabular-nums">
                  {index + 1}
                </span>
                <span className="font-display text-fluid-3xl leading-none font-semibold tracking-[-0.03em]">
                  {word.label}
                </span>
                <span className="mt-3 max-w-[30ch] text-[0.9375rem] leading-relaxed text-white/75">
                  {word.detail}
                </span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-ember-400">
                  Read the pillar
                  <ArrowRight
                    size={15}
                    strokeWidth={2.5}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        {/* ──────────────────────────────────────────────── the eight pillars
            As the three themes they belong to. Each card opens that part of
            the manifesto and lists its pillars by name. */}
        <ul className="mt-3 grid gap-3 md:grid-cols-3 lg:mt-4 lg:gap-4">
          {themes.map((theme, index) => (
            <Reveal as="li" key={theme.slug} delay={index * 70}>
              <Link
                href={`/manifesto#${theme.slug}`}
                className="card card-interactive group flex h-full flex-col p-6 lg:p-7"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[0.8125rem] font-medium text-content-subtle">
                    {theme.pillars.length} {theme.pillars.length === 1 ? "pillar" : "pillars"}
                  </span>
                  <span className="grid size-9 place-items-center rounded-full bg-ink-100 text-content transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                    <ArrowRight size={15} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                </span>
                <h3 className="mt-5 text-fluid-xl">{theme.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-content-muted">{theme.line}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
                  {theme.pillars.map((pillar) => (
                    <li
                      key={pillar.slug}
                      className="rounded-full bg-ink-50 px-3 py-1 text-[0.8125rem] text-ink-700"
                    >
                      {pillar.title}
                    </li>
                  ))}
                </ul>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
