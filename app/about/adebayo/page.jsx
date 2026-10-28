import React from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { assets } from "@/assets/assets";
import { bio, candidate, photos, quote, record, timeline, zoneFocus } from "@/lib/adebayo";
import { site } from "@/lib/site";
import JoinCta from "@/components/JoinCta";
import PhotoGallery from "@/components/PhotoGallery";

export const metadata = {
  title: "Who is Prince Adebayo",
  description:
    "Prince Adewole Adebayo: lawyer, entrepreneur and reformer, born in Ondo State in 1972, founder of KAFTAN TV and presidential candidate of the Social Democratic Party (SDP).",
};

/* Everything on this page is read from lib/adebayo.js, which takes it from the
   campaign's own site and from nothing else. The page adds layout, not claims. */
export default function WhoIsAdebayo() {
  return (
    <>
      <PageHeader
        breadcrumb="The Man"
        kicker={`${candidate.partyShort} candidate for President`}
        title={`Who is ${candidate.short}?`}
        lead="A lawyer, builder and reformer, with three decades in law, enterprise and public advocacy, and a costed plan for security, production and justice."
        image={assets.ngAsoRock}
        imagePosition="object-[center_55%]"
      />

      {/* ------------------------------------------------------------- bio */}
      <Section>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-5">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-ink-100 lg:aspect-auto lg:min-h-full">
            <Image
              src={assets.adebayoSpeaking}
              alt={candidate.name}
              fill
              sizes="(min-width: 1024px) 22rem, 100vw"
              className="object-cover object-[center_20%]"
            />
            <div className="glass absolute inset-x-3 bottom-3 rounded-2xl px-4 py-3 text-white">
              <p className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em]">{candidate.name}</p>
              <p className="mt-0.5 text-[0.8125rem] text-white/75">Born {candidate.born}</p>
            </div>
          </Reveal>

          <Reveal delay={80} className="card p-7 sm:p-10 lg:p-12">
            <p className="eyebrow">In brief</p>
            <h2 className="mt-5 text-fluid-3xl">The short answer</h2>
            <div className="prose-body mt-6 space-y-4">
              {bio.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {record.map((item) => (
                <div key={item.label} className="rounded-2xl bg-paper p-4">
                  <dd className="flex items-baseline gap-1">
                    <Counter
                      value={item.value}
                      suffix={item.suffix}
                      className="font-display text-fluid-2xl font-semibold tracking-[-0.03em] text-brand-600 tabular-nums"
                    />
                    {item.unit && (
                      <span className="text-[0.75rem] font-medium text-content-subtle">{item.unit.toLowerCase()}</span>
                    )}
                  </dd>
                  <dt className="mt-2 text-[0.8125rem] leading-snug text-content-muted">{item.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------------- the quote */}
      <section className="px-2 sm:px-3">
        <div className="relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-night text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_90%_at_100%_100%,color-mix(in_oklch,var(--color-brand-600)_40%,transparent)_0%,transparent_70%)]"
          />
          <div className="shell py-20 text-center lg:py-28">
            <Reveal>
              <p className="eyebrow eyebrow-inverse eyebrow-center">In his words</p>
              <blockquote className="mx-auto mt-7 max-w-4xl font-display text-fluid-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <p className="mt-6 text-[0.9375rem] text-white/60">{quote.by}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- timeline */}
      <Section>
        <SectionHeading
          eyebrow="The journey"
          title="From Ondo to the 2027 ballot"
          lead="The campaign's own timeline. Where it gives no year, neither do we."
        />

        <ol className="relative mt-12 space-y-3 lg:space-y-4">
          {timeline.map((item, index) => (
            <Reveal as="li" key={item.id} delay={index * 50}>
              <article className="card grid gap-3 p-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline sm:gap-8 lg:p-7">
                <p className="font-display text-fluid-xl font-semibold tracking-[-0.03em] text-brand-600">
                  {item.period}
                </p>
                <div>
                  <h3 className="text-fluid-lg">{item.title}</h3>
                  <p className="mt-1 text-[0.8125rem] text-content-subtle">{item.location}</p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-content-muted">{item.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* --------------------------------------------------------- the zones */}
      <Section className="pt-0">
        <SectionHeading
          eyebrow="Six zones, one mission"
          title="What the campaign says each zone needs"
          actions={
            <Button href="/manifesto" variant="outline" size="md">
              The eight pillars
              <ArrowRight size={16} strokeWidth={2.5} />
            </Button>
          }
        />
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {zoneFocus.map((zone, index) => (
            <Reveal as="li" key={zone.code} delay={index * 50} className="card p-6">
              <span className="rounded-full bg-ember-100 px-2.5 py-1 text-[0.75rem] font-medium text-ember-800">
                {zone.code}
              </span>
              <h3 className="mt-5 text-fluid-lg">{zone.name}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-content-muted">{zone.focus}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------------ photographs */}
      <Section className="pt-0">
        <SectionHeading eyebrow="In pictures" title={candidate.name} />
        <PhotoGallery photos={photos} />
      </Section>

      {/* ------------------------------------------------------------- CTA */}
      <section className="shell shell-wide pb-12 lg:pb-16">
        <div className="flex flex-col gap-8 rounded-[var(--radius-panel)] bg-brand-600 p-8 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14">
          <div className="max-w-2xl">
            <h2 className="text-fluid-3xl text-white">Read the plan. Judge the man.</h2>
            <p className="mt-4 text-fluid-lg leading-relaxed text-white/80">
              Then take both to the people who vote in your polling unit.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href="/manifesto" variant="inverse" size="lg">
              The manifesto
              <ArrowRight size={17} strokeWidth={2.5} />
            </Button>
            <JoinCta variant="ember" size="lg" />
            <Button href={site.aspirantUrl} variant="inverseOutline" size="lg" external>
              Campaign site
              <ArrowUpRight size={17} strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
