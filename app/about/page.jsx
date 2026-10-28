import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, ShieldCheck, Scale, Users, HeartHandshake, Flag, Compass } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { coreValues, objectives, nationalExecutive, totalSeats } from "@/lib/map";
import { site, secondaryCta } from "@/lib/site";
import { candidate } from "@/lib/adebayo";
import { assets } from "@/assets/assets";
import JoinCta from "@/components/JoinCta";

export const metadata = {
  title: "About the Movement",
  description:
    "Power In The Streets (PITS): its mission, its values, its objectives, the candidate it supports and its National Executive.",
};

/* Values are ordered by the lib/map.js list; the icons map onto it by index so
   the two stay in step without repeating the copy here. */
const valueIcons = [ShieldCheck, Scale, Compass, Users, HeartHandshake, Flag];

const formatter = new Intl.NumberFormat("en-NG");

export default function About() {
  return (
    <>
      <PageHeader
        breadcrumb="About"
        kicker={`${site.movement} · by ${site.parent}`}
        title="Power belongs to people, organised where they live."
        lead={`One objective: ${candidate.name} for President. Organising in all 36 states, the FCT, 774 Local Government Areas and over 8,000 wards.`}
        image={assets.ngLekki}
        imagePosition="object-[center_60%]"
      >
        <div className="flex flex-wrap gap-3">
          <JoinCta variant="ember" size="lg" />
          <Button href="/structure" variant="inverseOutline" size="lg">
            See the structure
          </Button>
        </div>
      </PageHeader>

      {/* --------------------------------------------------------- the case */}
      <Section>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-5">
          <Reveal className="card p-7 sm:p-10 lg:p-12">
            <p className="eyebrow">Why the movement exists</p>
            <h2 className="mt-5 text-fluid-4xl">Structure is the argument.</h2>
            <div className="prose-body mt-6 space-y-4">
              <p>
                Nigerian politics is not short of declarations. It is short of
                organisations that can name who is responsible in a given ward,
                and when they were appointed. That is the gap PITS closes.
              </p>
              <p>
                The register holds {formatter.format(totalSeats)} seats, from the
                National Executive to the tenth officer in the smallest ward.
                Each is either filled by a named member or openly vacant. There
                is no third state.
              </p>
              <p>
                Members accept the Code of Conduct and register in the ward where
                they vote. That is what places them in the structure. Office at
                LGA level and above requires verification.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100} className="rounded-[var(--radius-card)] bg-night p-7 text-white sm:p-10 lg:p-12">
            <p className="eyebrow eyebrow-inverse">Our objectives</p>
            <ol className="mt-7 space-y-5">
              {objectives.map((objective, index) => (
                <li key={objective} className="flex gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 font-display text-[0.875rem] font-semibold text-ember-400 tabular-nums">
                    {index + 1}
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed text-white/75">{objective}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Section>

      {/* ---------------------------------------------------------- values */}
      <Section className="pt-0">
        <SectionHeading eyebrow="Core values" title="What membership commits you to" />

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {coreValues.map((value, index) => {
            const Icon = valueIcons[index] ?? ShieldCheck;
            return (
              <Reveal as="li" key={value.title} delay={index * 60} className="card p-7">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon size={22} strokeWidth={2} aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-fluid-lg">{value.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-content-muted">{value.body}</p>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      {/* ------------------------------------------- the movement and the man */}
      <Section className="pt-0">
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {/* The candidate. */}
          <Reveal className="card grid overflow-hidden sm:grid-cols-[13rem_minmax(0,1fr)]">
            <div className="relative aspect-square sm:aspect-auto">
              <Image
                src={assets.adebayoResolve}
                alt={candidate.name}
                fill
                sizes="(min-width: 640px) 13rem, 100vw"
                className="object-cover object-[center_20%]"
              />
            </div>
            <div className="flex flex-col p-7 lg:p-8">
              <p className="text-[0.8125rem] font-medium text-ember-700">The candidate</p>
              <h3 className="mt-3 text-fluid-2xl">{candidate.name}</h3>
              <p className="mt-1.5 text-[0.875rem] text-content-subtle">
                {candidate.party} · {candidate.descriptor}
              </p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-content-muted">
                The man the movement was formed to carry to every ward, and his
                eight pillar plan.
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <Button href="/about/adebayo" variant="dark" size="md">
                  Who is {candidate.short}?
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Button>
                <Button href={secondaryCta.href} variant="outline" size="md" external>
                  Campaign site
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </Button>
              </div>
            </div>
          </Reveal>

          {/* The organisation behind PITS. Named here and in the footer, not
              in the masthead: the movement is PITS, and Amvora is who runs it. */}
          <Reveal delay={80} className="card flex flex-col p-7 lg:p-8">
            <div className="flex items-center gap-4">
              <Image src={assets.amvoraMark} alt="" sizes="64px" className="h-16 w-auto" />
              <div>
                <p className="text-[0.8125rem] font-medium text-ember-700">Run by</p>
                <h3 className="mt-1 text-fluid-2xl">{site.parent}</h3>
              </div>
            </div>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-content-muted">
              Power In The Streets began as Amvora&rsquo;s community services
              platform: civic education, advocacy, youth leadership and
              accountability, built on three words: people, capacity, action.
              This register is how it organises for 2027.
            </p>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-content-muted">
              The movement is not the party. Joining PITS is not joining the{" "}
              {site.partyShort}, and membership of either is free.
            </p>
            <div className="mt-auto pt-6">
              <Button href={site.parentUrl} variant="outline" size="md" external>
                PITS community services
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Read next. */}
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:mt-5 lg:grid-cols-4 lg:gap-4">
          {[
            { href: "/manifesto", label: "The Manifesto", body: "Eight pillars, each linked to its source." },
            { href: "/structure", label: "Structure", body: "Every seat, from the National Executive to the ward." },
            { href: "/media", label: "Media", body: "The calendar, photographs and video." },
            { href: "/news", label: "Newsroom", body: "Statements and campaign updates." },
          ].map((card, index) => (
            <Reveal as="li" key={card.href} delay={index * 60}>
              <Link href={card.href} className="card card-interactive group flex h-full items-start justify-between gap-4 p-6">
                <span>
                  <span className="block font-display text-fluid-lg font-semibold tracking-[-0.02em]">{card.label}</span>
                  <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-content-muted">{card.body}</span>
                </span>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink-100 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                  <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------- national executive */}
      <section className="px-2 sm:px-3">
        <div className="section relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-night">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_0%_0%,color-mix(in_oklch,var(--color-brand-600)_30%,transparent)_0%,transparent_70%)]"
          />
          <div className="shell">
            <SectionHeading
              tone="inverse"
              eyebrow="National Executive"
              title="Fifteen offices, named as each is confirmed"
              lead="None of the fifteen has been announced yet. Names appear here as appointments are confirmed. Never before, and never as placeholders."
            />

            <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {nationalExecutive.map((office, index) => (
                <Reveal
                  as="li"
                  key={office.code}
                  delay={Math.min(index * 40, 320)}
                  className="glass flex flex-col rounded-[var(--radius-card)] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[1rem] leading-snug text-white">{office.title}</h3>
                    {office.authority === "Super Admin" && (
                      <span className="shrink-0 rounded-full bg-ember-500 px-2.5 py-0.5 text-[0.75rem] font-medium text-ink-950">
                        Leads
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[0.8125rem] leading-snug text-white/50">{office.scope}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section className="shell shell-wide py-12 lg:py-16">
        <div className="flex flex-col gap-8 rounded-[var(--radius-panel)] bg-ember-500 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14">
          <div className="max-w-2xl">
            <h2 className="text-fluid-3xl text-ink-950">Register in under a minute.</h2>
            <p className="mt-4 text-fluid-lg leading-relaxed text-ink-950/70">
              Then find the seat your ward still needs filled.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <JoinCta variant="dark" size="lg" />
            <Button href="/structure" variant="outline" size="lg">
              See the structure
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
