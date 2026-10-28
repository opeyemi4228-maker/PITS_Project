import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  HandHeart,
  MapPin,
  Scale,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import Hero from "@/components/HeaderSlider";
import AgendaBand from "@/components/AgendaBand";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import { Section, SectionHeading } from "@/components/ui/Section";
import { assets } from "@/assets/assets";
import { tiers, totalSeats } from "@/lib/map";
import { latestNews } from "@/lib/news";
import { site, secondaryCta } from "@/lib/site";
import { bio, candidate, quote, zoneFocus } from "@/lib/adebayo";
import JoinCta from "@/components/JoinCta";

/* ════════════════════════════════════════════════════════════════════════════
   The homepage.

   ── WHY THIS ORDER ──────────────────────────────────────────────────────────
   What a reader retains is the front and the back of a page, so identity takes
   the top (the hero, the plan, who we are, the candidate) and the ask takes
   the bottom (take action, the integrity desk, the close). Evidence — the
   structure, the zones, the newsroom — sits in the middle, where attention
   dips, because evidence is what a reader scans rather than reads.

   Earn, then ask. Nothing asks a stranger for anything between the hero and
   "Take action", and the integrity desk ("nobody may charge you") sits
   immediately after the ask, where that doubt actually arises.

   ── RHYTHM ──────────────────────────────────────────────────────────────────
   Paper, with white cards resting on it. Two night bands break the run — the
   candidate's words and the close — about a third and a whole page in, and the
   photographic zone cards break it a third time without needing a band.
   ════════════════════════════════════════════════════════════════════════ */

/** The four figures beside the story. */
const scale = [
  { value: 37, label: "States and the FCT" },
  { value: 774, label: "Local Government Areas" },
  { value: 8809, label: "Wards nationwide" },
  { value: totalSeats, label: "Named seats in the structure" },
];

/**
 * The six zones, with the campaign's own one-line focus for each (from
 * lib/adebayo.js). The photographs are of the country, not of the movement:
 * the alt text says only what is in the frame, and nothing is captioned as if
 * it were a rally PITS held. The movement's own photography belongs on /media.
 */
const zoneImages = {
  NC: { src: assets.ngFarmer, alt: "A farmer in a field" },
  NE: { src: assets.ngPupils, alt: "Pupils in a classroom" },
  NW: { src: assets.ngRice, alt: "A rice harvest" },
  SE: { src: assets.ngMarket, alt: "A busy market" },
  SS: { src: assets.ngBeach, alt: "The coastline" },
  SW: { src: assets.ngLagos, alt: "The Lagos skyline" },
};

/** Take action: specific asks, each a route that exists. */
const actions = [
  {
    href: "/join",
    icon: UserPlus,
    title: "Register in the ward where you vote",
    body: "Free, and under a minute. The ward you register in places you in the structure.",
  },
  {
    href: "/structure#find",
    icon: MapPin,
    title: "Find the seat your ward still needs",
    body: "Every seat is held by a named officer or openly vacant. See yours, and who appoints to it.",
  },
  {
    href: "/connect",
    icon: Users,
    title: "Find your chapter",
    body: "The coordinators already organising in your state and local government.",
  },
  {
    href: "/volunteer",
    icon: HandHeart,
    title: "Volunteer",
    body: "Give a day, a skill or a room. Each state office publishes what it needs now.",
  },
];

/** The integrity desk. Both are the movement's standing policy, from /terms. */
const integrity = [
  {
    href: "/contact",
    icon: ShieldCheck,
    title: "Report impersonation or extortion",
    body: "Membership is free. PITS never asks for payment to register or to hold office. Anyone demanding money is not acting for this movement.",
    cta: "Report it",
  },
  {
    href: "/terms",
    icon: Scale,
    title: "Know how office is given",
    body: "Each office is filled by the one named officer above it, and every appointment is recorded against their name.",
    cta: "Read the rules",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* ══════════════════════════════════════════════════ the manifesto ══ */}
      <AgendaBand />

      {/* ══════════════════════════════════════════════════ who we are ══ */}
      <Section>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-5">
          <Reveal className="card flex flex-col p-7 sm:p-10 lg:p-12">
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-5 max-w-[16ch] text-fluid-4xl">
              A movement you can find in <span className="text-brand-600">your ward.</span>
            </h2>
            <div className="prose-body mt-6 space-y-4">
              <p>
                A movement that cannot name who speaks for it in Oredo, or
                Gwagwalada, or Nganzai is not national. It is an announcement
                with a logo. PITS works the other way round: structure first,
                one register, the same shape in every state.
              </p>
              <p>
                Power In The Streets is run by Amvora, on one belief: power
                belongs to ordinary people, organised where they live.
              </p>
            </div>
            <div className="mt-auto flex flex-wrap gap-3 pt-9">
              <Button href="/about" variant="dark" size="lg">
                About the movement
                <ArrowRight size={17} strokeWidth={2.5} />
              </Button>
              <Button href={site.parentUrl} variant="outline" size="lg" external>
                PITS community services
                <ArrowUpRight size={17} strokeWidth={2.5} />
              </Button>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {scale.map((item, index) => (
              <Reveal
                key={item.label}
                delay={index * 60}
                className={
                  index === 0
                    ? "relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-card)] bg-night p-6 text-white"
                    : "card flex flex-col justify-between p-6"
                }
              >
                {index === 0 && (
                  <Image
                    src={assets.amvoraMarkLight}
                    alt=""
                    sizes="120px"
                    className="pointer-events-none absolute -right-4 -bottom-6 h-36 w-auto opacity-25"
                  />
                )}
                <Counter
                  value={item.value}
                  className={`font-display text-fluid-3xl font-semibold tracking-[-0.03em] tabular-nums ${index === 0 ? "text-ember-400" : "text-content"}`}
                />
                <p className={`mt-8 text-[0.875rem] ${index === 0 ? "text-white/70" : "text-content-muted"}`}>
                  {item.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════ the candidate ══ */}
      <section className="px-2 sm:px-3">
        <div className="relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-night text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_90%_at_0%_100%,color-mix(in_oklch,var(--color-brand-600)_40%,transparent)_0%,transparent_70%)]"
          />
          <div className="shell shell-wide grid items-center gap-12 py-16 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20 lg:py-24">
            <Reveal>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[1.75rem] lg:max-w-none">
                <Image
                  src={assets.adebayoResolve}
                  alt={candidate.name}
                  fill
                  sizes="(min-width: 1024px) 26rem, 90vw"
                  className="object-cover object-[center_20%]"
                />
                <div className="glass absolute inset-x-3 bottom-3 rounded-2xl px-4 py-3">
                  <p className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em]">
                    {candidate.name}
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] text-white/70">
                    {candidate.partyShort} candidate for President
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <p className="eyebrow eyebrow-inverse">In his words</p>
              <blockquote className="mt-6 font-display text-fluid-3xl leading-[1.08] font-semibold tracking-[-0.025em] text-balance">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <p className="mt-7 max-w-[58ch] text-fluid-lg leading-relaxed text-white/70">
                {bio[0]}
              </p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {candidate.descriptor.split(" · ").map((word) => (
                  <li key={word} className="glass rounded-full px-4 py-1.5 text-[0.875rem] text-white/85">
                    {word}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/about/adebayo" variant="inverse" size="lg">
                  Meet the man
                  <ArrowRight size={17} strokeWidth={2.5} />
                </Button>
                <Button href={secondaryCta.href} variant="inverseOutline" size="lg" external>
                  The campaign site
                  <ArrowUpRight size={17} strokeWidth={2.5} />
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ the structure ══ */}
      <Section>
        <SectionHeading
          eyebrow="How we are organised"
          title="Five tiers, from the ward up"
          lead={`Every office at every level exists as a named seat, ${new Intl.NumberFormat("en-NG").format(totalSeats)} of them, filled by a named officer, or openly vacant and waiting on the office above it to appoint.`}
          actions={
            <Button href="/structure" variant="outline" size="md">
              See the full structure
              <ArrowRight size={16} strokeWidth={2.5} />
            </Button>
          }
        />

        <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {tiers.map((tier, index) => (
            <Reveal as="li" key={tier.key} delay={index * 60} className="card flex flex-col p-6">
              <span className="grid size-10 place-items-center rounded-full bg-brand-50 font-display text-[0.9375rem] font-semibold text-brand-700 tabular-nums">
                {tier.rank}
              </span>
              <h3 className="mt-6 text-fluid-xl">{tier.name}</h3>
              <p className="mt-1.5 text-[0.875rem] text-content-subtle">{tier.scope}</p>
              <p className="mt-auto pt-6 text-[0.8125rem] font-medium text-content">
                {new Intl.NumberFormat("en-NG").format(tier.units)} ×{" "}
                <span className="text-brand-600">{tier.seatsPerUnit} seats</span>
              </p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ═══════════════════════════════════════════════════ six zones ══ */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="The campaign"
          title="Six zones. One mission."
          lead="The campaign's own focus for each geopolitical zone. PITS organises in all six, the same way in every one."
          actions={
            <Button href="/structure#find" variant="outline" size="md">
              Find your zone
              <ArrowRight size={16} strokeWidth={2.5} />
            </Button>
          }
        />

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {zoneFocus.map((zone, index) => (
            <Reveal
              as="li"
              key={zone.code}
              delay={index * 60}
              className="group relative isolate aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-night text-white"
            >
              <Image
                src={zoneImages[zone.code].src}
                alt={zoneImages[zone.code].alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="-z-10 object-cover transition-transform duration-700 ease-out-quart group-hover:scale-[1.05]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/40 to-transparent"
              />
              <span className="glass absolute top-4 left-4 rounded-full px-3 py-1 text-[0.75rem] font-medium">
                {zone.code}
              </span>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-fluid-xl text-white">{zone.name}</h3>
                <p className="mt-1.5 max-w-[30ch] text-[0.9375rem] leading-snug text-white/75">
                  {zone.focus}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ═══════════════════════════════════════════════════ newsroom ══ */}
      <Section className="pt-0">
        <div className="card grid gap-10 p-7 sm:p-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14 lg:p-12">
          <div>
            <p className="eyebrow">News &amp; updates</p>
            <h2 className="mt-5 text-fluid-3xl">From the campaign trail</h2>
            <div className="mt-7">
              <Button href="/news" variant="outline" size="md">
                All news
                <ArrowRight size={16} strokeWidth={2.5} />
              </Button>
            </div>
          </div>

          <ul className="divide-y divide-hairline">
            {latestNews.slice(0, 3).map((article, index) => (
              <Reveal as="li" key={article.id} delay={index * 70}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-6 py-6 first:pt-0"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-content-subtle">
                      <span className="rounded-full bg-ember-100 px-2.5 py-0.5 font-medium text-ember-800">
                        {article.category}
                      </span>
                      {article.date}
                    </span>
                    <span className="mt-3 block font-display text-fluid-lg leading-snug font-semibold tracking-[-0.02em] text-content transition-colors duration-300 group-hover:text-brand-700">
                      {article.title}
                    </span>
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-hairline text-content-muted transition-colors duration-300 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white">
                    <ArrowUpRight size={17} strokeWidth={2.25} aria-hidden="true" />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* ═════════════════════════════════════════════════ take action ══ */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Take action"
          title="Four things you can do today"
          align="center"
        />

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Reveal as="li" key={action.href} delay={index * 60}>
                <Link href={action.href} className="card card-interactive group flex h-full flex-col p-6">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon size={22} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-fluid-lg">{action.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-content-muted">{action.body}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[0.875rem] font-semibold text-brand-600">
                    Start
                    <ArrowRight
                      size={15}
                      strokeWidth={2.5}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>

        {/* ── the integrity desk, directly after the ask ── */}
        <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:gap-4">
          {integrity.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal as="li" key={item.href} delay={index * 80}>
                <Link
                  href={item.href}
                  className="group flex h-full items-start gap-5 rounded-[var(--radius-card)] border border-ember-200 bg-ember-50 p-6 transition-colors duration-300 hover:bg-ember-100 lg:p-7"
                >
                  <Icon size={26} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0 text-ember-700" />
                  <span className="min-w-0">
                    <span className="block font-display text-fluid-lg font-semibold tracking-[-0.02em] text-ink-950">
                      {item.title}
                    </span>
                    <span className="mt-2 block text-[0.9375rem] leading-relaxed text-ink-700">{item.body}</span>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-ember-800">
                      {item.cta}
                      <ArrowRight
                        size={15}
                        strokeWidth={2.5}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      {/* ═══════════════════════════════════════════════════ the close ══ */}
      <section className="px-2 pb-2 sm:px-3 sm:pb-3">
        <div className="relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-night text-white">
          <Image
            src={assets.ngBridgeNight}
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover opacity-60"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-night via-night/60 to-night/20"
          />
          <div className="shell flex flex-col items-center py-24 text-center lg:py-32">
            <Reveal className="flex flex-col items-center">
              <Image src={assets.amvoraMarkLight} alt="" sizes="64px" className="h-16 w-auto" />
              <h2 className="mt-8 max-w-3xl text-fluid-5xl text-white">
                Hope, in action.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-fluid-lg leading-relaxed text-white/75">
                Registration is free and takes under a minute. Then find the
                seat your ward still needs filled.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <JoinCta variant="ember" size="lg" />
                <Button href="/structure" variant="inverseOutline" size="lg">
                  See the structure
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
