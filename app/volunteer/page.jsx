import React from "react";
import { ArrowRight, ArrowUpRight, Building2, Clock, Megaphone, ShieldCheck, Sparkles, Users } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { assets } from "@/assets/assets";
import { community, site } from "@/lib/site";
import JoinCta from "@/components/JoinCta";

export const metadata = {
  title: "Volunteer",
  description:
    "Volunteer with Power In The Streets (PITS): give a day, a skill or a room for a ward meeting. Membership is free, and PITS never asks for payment to join or hold office.",
};

/* There is no payment form on this page. The one it replaced took card
   details into a form that sent them nowhere. Financial support goes through
   PITS's own donate page, run by Amvora, which is linked — never collected
   here. */
const ways = [
  {
    icon: Clock,
    title: "Give a day",
    body: "Registration drives, door to door canvassing and ward congresses all run on volunteers. Your ward coordinator says when.",
    href: "/join",
    cta: "Register first",
  },
  {
    icon: Sparkles,
    title: "Give a skill",
    body: "Design, video, data, law, logistics, first aid. Each state office says what it is short of.",
    href: "/contact",
    cta: "Tell the Secretariat",
  },
  {
    icon: Building2,
    title: "Give a room",
    body: "A hall, a shop front or a compound for a ward meeting. One room can host a whole ward's congress.",
    href: "/contact",
    cta: "Offer a venue",
  },
  {
    icon: Megaphone,
    title: "Spread the word",
    body: "Share your referral code. Every member you bring in is counted to you, and placed in their own ward.",
    href: "/portal",
    cta: "Get your code",
  },
  {
    icon: Users,
    title: "Stand for office",
    body: "Every seat is a named job. See the vacancies in your own territory from your membership portal.",
    href: "/structure#find",
    cta: "See vacancies",
  },
];

export default function Volunteer() {
  return (
    <>
      <PageHeader
        breadcrumb="Volunteer"
        kicker="Volunteer with PITS"
        title="The structure is built by volunteers, ward by ward."
        lead="A day of your time, a skill, a room for a ward meeting. Pick what fits your week, and here is who to tell."
        image={assets.ngPupils}
        imagePosition="object-[center_40%]"
      >
        <div className="flex flex-wrap gap-3">
          <JoinCta variant="ember" size="lg" />
          <Button href={community.href} variant="inverseOutline" size="lg" external>
            WhatsApp community
            <ArrowUpRight size={17} strokeWidth={2.5} />
          </Button>
        </div>
      </PageHeader>

      <Section>
        <SectionHeading eyebrow="Five ways to volunteer" title="Pick the one that fits your week" />

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {ways.map((way, index) => {
            const Icon = way.icon;
            return (
              <Reveal as="li" key={way.title} delay={index * 60}>
                <a href={way.href} className="card card-interactive group flex h-full flex-col p-7">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon size={22} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-fluid-lg">{way.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-content-muted">{way.body}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[0.875rem] font-semibold text-brand-600">
                    {way.cta}
                    <ArrowRight size={15} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </Reveal>
            );
          })}

          <Reveal as="li" delay={ways.length * 60}>
            <div className="flex h-full flex-col rounded-[var(--radius-card)] bg-night p-7 text-white">
              <p className="text-[0.8125rem] font-medium text-ember-400">Financial support</p>
              <h3 className="mt-4 text-fluid-lg text-white">Donate through PITS by Amvora</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-white/65">
                Donations are handled on Amvora&rsquo;s own page, never on this
                one. No coordinator may collect money in the movement&rsquo;s name.
              </p>
              <div className="mt-auto pt-6">
                <Button href={`${site.parentUrl}/donate`} variant="ember" size="md" external>
                  Go to the donate page
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </Button>
              </div>
            </div>
          </Reveal>
        </ul>

        <Reveal delay={120}>
          <p className="mt-6 flex items-start gap-3 rounded-[var(--radius-card)] border border-ember-200 bg-ember-50 p-5 text-[0.9375rem] leading-relaxed text-ink-800">
            <ShieldCheck size={20} className="mt-0.5 shrink-0 text-ember-700" aria-hidden="true" />
            Membership is free. PITS never asks for payment to register, to be
            appointed or to keep an office. If anyone asks you for money in the
            movement&rsquo;s name, report it to {site.contact.email}.
          </p>
        </Reveal>
      </Section>
    </>
  );
}
