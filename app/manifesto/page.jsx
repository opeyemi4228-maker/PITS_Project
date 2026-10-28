import React from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Quote } from "lucide-react";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/Section";
import AgendaIcon from "@/components/AgendaIcon";
import JoinCta from "@/components/JoinCta";
import { election, framing, headline, pillars, sources, themes } from "@/lib/agenda";

export const metadata = {
  title: "The Manifesto",
  description:
    "Prince Adewole Adebayo's eight pillar plan for the 2027 election: security and the rule of law, a production economy, education, healthcare in every ward, power, food security, accountable government and inclusion. Every commitment linked to its source.",
};

/* ════════════════════════════════════════════════════════════════════════════
   /manifesto — what the candidate will do.

   Built for the reader who has heard the campaign's one line — "security,
   production and justice" — and has come to see what is behind it. So the
   page answers in that order:

     1. The argument, and the date it will be settled on.
     2. The three words, each opening the pillar that carries it.
     3. All eight pillars, grouped by what they change in a household.
     4. Where every line came from.
     5. What to do about it.

   Every commitment is read from lib/agenda.js, which carries its source. This
   page adds layout, not claims.
   ════════════════════════════════════════════════════════════════════════ */

const totalPoints = pillars.length;

/* The campaign's own numbering, 01 to 08, so "pillar 4" means the same thing
   here as it does on the candidate's site. */
const numberOf = Object.fromEntries(pillars.map((pillar) => [pillar.slug, pillar.number]));

function SourceLink({ source, className }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "group inline-flex items-start gap-1.5 text-[0.75rem] leading-snug text-ink-500 transition-colors hover:text-brand-700"
      }
    >
      <span>
        <span className="font-semibold">Source:</span> {source.label}, {source.date}
      </span>
      <ArrowUpRight size={12} strokeWidth={2.5} aria-hidden="true" className="mt-0.5 shrink-0" />
    </a>
  );
}

export default function AgendaPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════ hero ══ */}
      <header className="relative isolate overflow-hidden bg-night text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_90%_at_85%_10%,color-mix(in_oklch,var(--color-brand-600)_55%,transparent)_0%,transparent_65%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]"
        />

        <div className="shell shell-wide pt-14 pb-12 lg:pt-20 lg:pb-16">
          <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-end xl:gap-16">
            <div>
              <Reveal>
                <p className="flex flex-wrap items-center gap-3 text-[0.8125rem] font-medium text-white/70">
                  <span className="bg-ember-500 px-2 py-1 text-ink-950">SDP 2027</span>
                  {totalPoints} pillars, one Nigeria
                </p>
              </Reveal>

              <Reveal delay={70}>
                {/* Two lines, one idea each: the country as it is, struck out,
                    over the country the plan is for. Read aloud it is the
                    sentence in the sr-only span.

                    Each line is kept whole, so the size is set by the width it
                    has: about 12.5em per line, in a column that loses 30rem to
                    the countdown from xl. */}
                <h1 className="mt-7 text-[clamp(1.75rem,7vw,4.25rem)] xl:text-[clamp(2.25rem,7vw-2.5rem,4.25rem)]">
                  <span className="sr-only">From a poorly managed Nigeria to a Nigeria that works.</span>
                  <span aria-hidden="true" className="block whitespace-nowrap text-white/35 line-through decoration-ember-500 decoration-[0.08em]">
                    Poorly managed.
                  </span>
                  <span aria-hidden="true" className="block whitespace-nowrap text-ember-400">
                    A Nigeria that works.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={140}>
                <p className="mt-7 max-w-[52ch] text-fluid-lg leading-relaxed text-white/70">
                  Prince Adewole Adebayo&rsquo;s plan for the 2027 election,
                  pillar by pillar. In plain language, with a link to where each
                  commitment was published.
                </p>
              </Reveal>

              <Reveal delay={210}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button href="#three-words" variant="ember" size="lg">
                    The plan in three words
                    <ArrowDown size={17} strokeWidth={2.75} aria-hidden="true" />
                  </Button>
                  <Button href="#points" variant="inverseOutline" size="lg">
                    All {totalPoints} pillars
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* The date the argument is settled on. */}
            <Reveal delay={180}>
              <aside
                aria-label="Election dates"
                className="max-w-xl border border-white/15 bg-white/[0.04] backdrop-blur-sm xl:max-w-none"
              >
                <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
                  <p className="text-[0.8125rem] font-medium text-white/60">
                    Presidential election
                  </p>
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full rounded-full bg-ember-400 opacity-70 motion-safe:animate-ping" />
                    <span className="relative inline-flex size-2 rounded-full bg-ember-400" />
                  </span>
                </div>
                <div className="px-6 py-7">
                  <p className="font-display text-fluid-xl font-semibold tracking-[-0.025em]">
                    {election.day}
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-white/55">
                    Governorship and State Assembly: {election.governorship}
                  </p>
                </div>
                <div className="border-t border-white/10 px-6 py-3.5">
                  <SourceLink
                    source={election.source}
                    className="group inline-flex items-start gap-1.5 text-[0.6875rem] leading-snug text-white/45 transition-colors hover:text-white"
                  />
                </div>
              </aside>
            </Reveal>
          </div>

          {/* The three themes, as a table of contents. */}
          <nav aria-label="Agenda themes" className="mt-14 lg:mt-20">
            <ul className="grid border-t border-white/15 sm:grid-cols-3">
              {themes.map((theme, index) => (
                <li
                  key={theme.slug}
                  /* The padding lives here, on the <li>, not on the <Link>
                     inside it. `first:` matches an element that is the first
                     child of its own parent — and every one of these links is
                     the first child of its own <li>, so `first:pl-0` on the
                     link stripped the left padding off every column and
                     jammed them up against the divider to their left.
                     On the <li> it means what it reads as: only the first
                     column loses its inset, so its text lines up with the
                     page's left edge, and only the last loses its right one. */
                  className="border-b border-white/15 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
                >
                  <Link
                    href={`#${theme.slug}`}
                    className="group flex h-full flex-col gap-2 py-5 transition-colors"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-[0.8125rem] font-medium text-ember-400">
                        {String(index + 1).padStart(2, "0")} · {theme.pillars.length} pillars
                      </span>
                      <ArrowDown
                        size={15}
                        aria-hidden="true"
                        className="text-white/40 transition-transform duration-300 group-hover:translate-y-0.5 group-hover:text-white"
                      />
                    </span>
                    <span className="font-display text-lg font-semibold tracking-[-0.02em] group-hover:text-ember-300">
                      {theme.title}
                    </span>
                    <span className="text-[0.8125rem] leading-snug text-white/55">{theme.line}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════ the framing ══ */}
      <section className="bg-ember-500 text-ink-950">
        <div className="shell shell-wide py-14 lg:py-20">
          <Reveal>
            <figure className="grid gap-8 lg:grid-cols-[4rem_minmax(0,1fr)] lg:gap-10">
              <Quote size={48} strokeWidth={2.5} aria-hidden="true" className="text-ink-950/25" />
              <div>
                <blockquote className="max-w-5xl font-display text-fluid-3xl leading-[1.08] font-semibold tracking-[-0.03em] text-balance">
                  &ldquo;{framing.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-7 flex flex-col gap-2 text-[0.875rem] sm:flex-row sm:items-center sm:gap-4">
                  <span>
                    <span className="font-bold">{framing.by}</span>
                    <span className="text-ink-950/70">, {framing.role}</span>
                  </span>
                  <span aria-hidden="true" className="hidden h-4 w-px bg-night/25 sm:block" />
                  <SourceLink
                    source={framing.source}
                    className="inline-flex items-start gap-1.5 text-[0.75rem] text-ink-950/70 underline-offset-2 hover:underline"
                  />
                </figcaption>
              </div>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ the three words ══ */}
      <section id={headline.slug} className="section scroll-mt-24 bg-white">
        <div className="shell shell-wide">
          <SectionHeading
            index={1}
            eyebrow={headline.kicker}
            title={headline.title}
            lead={headline.lead}
          />

          <ol className="mt-14 grid tiles md:grid-cols-3">
            {headline.words.map((word, index) => (
              <Reveal as="li" key={word.label} delay={index * 70} className="bg-white">
                <Link
                  href={`#point-${word.pillar}`}
                  className="group flex h-full flex-col p-8 transition-colors duration-300 hover:bg-ink-50 lg:p-10"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-[0.8125rem] font-semibold text-ember-600 tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-5 font-display text-fluid-3xl leading-none font-semibold tracking-[-0.025em] text-ink-950 group-hover:text-brand-700">
                    {word.label}
                  </span>
                  <span className="prose-body mt-4 text-[0.9375rem]">{word.detail}</span>
                  <span className="mt-auto flex items-center gap-2 pt-8 text-[0.8125rem] font-medium text-ink-500">
                    Pillar {String(numberOf[word.pillar]).padStart(2, "0")}
                    <ArrowDown
                      size={14}
                      strokeWidth={2.75}
                      aria-hidden="true"
                      className="text-ember-600 transition-transform duration-300 group-hover:translate-y-0.5"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>

          <ul className="mt-6 space-y-2">
            {headline.sources.map((source) => (
              <li key={source.url}>
                <SourceLink source={source} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════ the eight pillars ══ */}
      <section id="points" className="section scroll-mt-24 border-t border-ink-200 bg-ink-50">
        <div className="shell shell-wide">
          <SectionHeading
            index={2}
            eyebrow={`The ${totalPoints} pillars`}
            title="Everything the candidate has committed to"
            lead="Grouped by what each one changes in a household. The grouping is ours, for reading; the numbering and the commitments are the campaign's."
          />

          <div className="mt-16 space-y-20 lg:space-y-28">
            {themes.map((theme, themeIndex) => (
              <div
                key={theme.slug}
                id={theme.slug}
                className="grid scroll-mt-28 gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14"
              >
                {/* Theme label, pinned while its points scroll past. */}
                <div>
                  <div className="lg:sticky lg:top-[calc(var(--masthead-offset,6rem)+2rem)]">
                    <p className="text-[0.8125rem] font-medium text-ember-600">
                      Theme {String(themeIndex + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 text-fluid-3xl text-ink-950">{theme.title}</h3>
                    <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed text-content-muted">
                      {theme.line}
                    </p>
                  </div>
                </div>

                <ul className="grid tiles md:grid-cols-2">
                  {theme.pillars.map((pillar) => {
                    const n = numberOf[pillar.slug];
                    const number = String(n).padStart(2, "0");
                    return (
                      <li
                        key={pillar.slug}
                        id={`point-${pillar.slug}`}
                        /* An odd point out spans the row, rather than leaving
                           a grey hole beside it. */
                        className="scroll-mt-28 bg-white md:last:odd:col-span-2"
                      >
                        <article className="group flex h-full flex-col p-7 transition-colors duration-300 hover:bg-white lg:p-9">
                          <div className="flex items-start justify-between gap-4">
                            <span className="grid size-12 place-items-center bg-brand-600 text-white transition-colors duration-300 group-hover:bg-ember-500 group-hover:text-ink-950">
                              <AgendaIcon name={pillar.icon} size={22} strokeWidth={2} />
                            </span>
                            <span
                              aria-hidden="true"
                              className="font-display text-fluid-3xl leading-none font-semibold tracking-[-0.03em] text-ink-200 tabular-nums transition-colors duration-300 group-hover:text-ember-500"
                            >
                              {number}
                            </span>
                          </div>

                          <h4 className="mt-7 font-display text-fluid-xl leading-tight font-semibold tracking-[-0.025em] text-ink-950">
                            <span className="sr-only">Pillar {n}: </span>
                            {pillar.title}
                          </h4>
                          <p className="mt-3 text-[0.9375rem] leading-relaxed text-content-muted">
                            {pillar.pledge}
                          </p>

                          <ul className="mt-6 space-y-2.5 border-t border-ink-200 pt-6">
                            {pillar.commitments.map((line) => (
                              <li key={line} className="flex gap-3 text-[0.875rem] leading-snug text-ink-800">
                                <Check
                                  size={16}
                                  strokeWidth={3}
                                  aria-hidden="true"
                                  className="mt-0.5 shrink-0 text-brand-600"
                                />
                                {line}
                              </li>
                            ))}
                          </ul>

                          <p className="mt-6 border-l-2 border-ember-500 bg-ember-50 px-4 py-3 text-[0.8125rem] leading-snug text-ink-800">
                            <span className="font-bold text-ink-950">What it means: </span>
                            {pillar.forYou}
                          </p>

                          <div className="mt-auto space-y-1.5 pt-6">
                            <SourceLink source={pillar.source} />
                            {pillar.also && <SourceLink source={pillar.also} />}
                          </div>
                        </article>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════ the sources ══ */}
      <section className="section-tight border-t border-ink-200 bg-white">
        <div className="shell shell-wide grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14">
          <div>
            <h2 className="text-fluid-2xl text-ink-950">Read it yourself</h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-content-muted">
              This page summarises what the campaign has published. When the
              SDP publishes its full manifesto document, that document takes
              precedence.
            </p>
          </div>
          <ol className="divide-y divide-ink-200 border-y border-ink-200">
            {sources.map((source, index) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 py-5 transition-colors hover:bg-ink-50 sm:px-3"
                >
                  <span className="font-display text-[0.8125rem] font-semibold text-ember-600 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink-950 group-hover:text-brand-700">
                      {source.label}
                    </span>
                    <span className="mt-0.5 block text-[0.8125rem] text-ink-500">{source.date}</span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    aria-hidden="true"
                    className="text-ink-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-700"
                  />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ the ask ══ */}
      <section className="relative isolate overflow-hidden bg-brand-900 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_100%_at_50%_0%,var(--color-brand-600)_0%,transparent_70%)]"
        />
        <div className="shell py-20 text-center lg:py-28">
          <Reveal>
            <p className="eyebrow eyebrow-center eyebrow-inverse text-white/60">
              {election.day}
            </p>
            <h2 className="mx-auto mt-6 max-w-4xl text-fluid-4xl">
              A plan only wins if every ward <span className="text-ember-400">hears it.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-fluid-lg leading-relaxed text-white/70">
              Join PITS, then take the plan to the people who will vote in
              your polling unit.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <JoinCta variant="ember" size="lg" />
              <Button href="/structure#find" variant="inverseOutline" size="lg">
                Find your coordinator
                <ArrowRight size={17} strokeWidth={2.75} aria-hidden="true" />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
