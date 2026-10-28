import React from "react";
import { ArrowRight, ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import BrandIcon from "@/components/ui/BrandIcon";
import { Section, SectionHeading } from "@/components/ui/Section";
import { assets } from "@/assets/assets";
import { zones } from "@/lib/map";
import { community, site, socials } from "@/lib/site";

export const metadata = {
  title: "Find Your Chapter",
  description:
    "Find Power In The Streets (PITS) in your zone and state, see who coordinates your ward, and join the PITS community.",
};

/* Every channel on this page is one PITS actually publishes (lib/site.js).
   An earlier version listed invented addresses and a form that discarded what
   it was sent; a person trying to reach the movement deserves a real door or
   none. */
export default function Connect() {
  return (
    <>
      <PageHeader
        breadcrumb="Find your chapter"
        kicker="Connect"
        title="PITS is already in your state."
        lead="Find your zone, then the coordinator responsible for your ward. Every seat is either held by a named officer or openly vacant."
        image={assets.ngMarket}
        imagePosition="object-[center_45%]"
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/structure#find" variant="ember" size="lg">
            <MapPin size={18} strokeWidth={2.25} aria-hidden="true" />
            Find your coordinator
          </Button>
          <Button href={community.href} variant="inverseOutline" size="lg" external>
            <MessageCircle size={18} strokeWidth={2.25} aria-hidden="true" />
            WhatsApp community
          </Button>
        </div>
      </PageHeader>

      <Section>
        <SectionHeading
          eyebrow="Six zones"
          title="Pick your zone"
          lead="Each state has a State Executive, each LGA its own, and every ward ten officers. Your state's coordinators are listed on the structure page."
        />

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {zones.map((zone, index) => (
            <Reveal as="li" key={zone.code} delay={index * 50} className="card flex flex-col p-6 lg:p-7">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-fluid-xl">{zone.name}</h3>
                <span className="rounded-full bg-ember-100 px-2.5 py-1 text-[0.75rem] font-medium text-ember-800">
                  {zone.code}
                </span>
              </div>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {zone.states.map((state) => (
                  <li key={state} className="rounded-full bg-ink-50 px-3 py-1 text-[0.8125rem] text-ink-700">
                    {state}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <Button href="/structure#find" variant="outline" size="sm">
                  Coordinators in {zone.name}
                  <ArrowRight size={14} strokeWidth={2.5} />
                </Button>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
          <Reveal className="rounded-[var(--radius-card)] bg-night p-7 text-white lg:col-span-2 lg:p-10">
            <p className="eyebrow eyebrow-inverse">The community</p>
            <h2 className="mt-5 text-fluid-3xl text-white">Join the conversation where it happens.</h2>
            <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-white/65">
              Announcements, ward meetings and calls to action go to the PITS
              WhatsApp community first, then to our channels.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={community.href} variant="ember" size="lg" external>
                Join on WhatsApp
                <ArrowUpRight size={17} strokeWidth={2.5} />
              </Button>
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`PITS on ${social.label}`}
                  className="grid size-12 place-items-center rounded-full bg-white/8 ring-1 ring-white/12 transition-colors hover:bg-ember-500 hover:text-ink-950"
                >
                  <BrandIcon name={social.icon} className="size-4" />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={80} className="card flex flex-col p-7 lg:p-8">
            <p className="eyebrow">Reach the Secretariat</p>
            <ul className="mt-6 space-y-4 text-[0.9375rem]">
              {site.contact.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-3 hover:text-brand-700">
                    <Phone size={17} className="shrink-0 text-brand-600" aria-hidden="true" />
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.contact.email}`} className="flex items-center gap-3 break-all hover:text-brand-700">
                  <Mail size={17} className="shrink-0 text-brand-600" aria-hidden="true" />
                  {site.contact.email}
                </a>
              </li>
            </ul>
            <div className="mt-auto pt-7">
              <Button href="/contact" variant="dark" size="md">
                All contact options
                <ArrowRight size={16} strokeWidth={2.5} />
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
