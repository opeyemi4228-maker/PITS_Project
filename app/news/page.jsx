import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import { assets } from "@/assets/assets";
import { news } from "@/lib/news";
import { site } from "@/lib/site";

export const metadata = {
  title: "News",
  description:
    "Statements from PITS, and the speeches, interviews and press releases of Prince Adewole Adebayo's SDP presidential campaign, each linked to where it was published.",
};

/* A wire feed, not a magazine. Every row is something a reader can open at
   its source; there are no view counts, no "breaking" banners and no articles
   rewritten in the movement's words. See lib/news.js for what belongs here. */
export default function NewsPage() {
  return (
    <>
      <PageHeader
        breadcrumb="News"
        kicker="Newsroom"
        title="News and statements"
        lead="From PITS and from the candidate's campaign. Each item opens where it was first published."
        image={assets.ngBridgeNight}
      />

      <Section className="bg-white">
        <SectionHeading
          index={1}
          eyebrow="Latest"
          title="From the campaign trail"
          actions={
            <Button href={site.aspirantUrl} variant="outline" size="md" external>
              The campaign&rsquo;s media page
              <ArrowUpRight size={16} strokeWidth={2.75} />
            </Button>
          }
        />

        <ul className="mt-14 border-t border-hairline">
          {news.map((item, index) => (
            <Reveal as="li" key={item.id} delay={index * 70}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 border-b border-ink-200 py-8 transition-colors duration-300 hover:bg-ink-50 md:flex-row md:items-baseline md:gap-10 md:px-2"
              >
                <span className="shrink-0 md:w-48">
                  <span className="block text-[0.8125rem] text-content-subtle tabular-nums">
                    {item.date}
                  </span>
                  <span className="mt-1 block text-[0.8125rem] font-medium text-ember-600">
                    {item.category}
                  </span>
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-display text-fluid-xl leading-snug font-semibold tracking-[-0.02em] text-ink-950 transition-colors duration-300 group-hover:text-brand-700">
                    {item.title}
                  </span>
                  <span className="prose-body mt-2 block text-[0.9375rem]">{item.excerpt}</span>
                  <span className="mt-3 block text-[0.75rem] text-content-subtle">
                    {item.source}
                  </span>
                </span>

                <ArrowUpRight
                  size={22}
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className="hidden shrink-0 self-start text-ink-300 transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ember-500 md:block"
                />
              </a>
            </Reveal>
          ))}
        </ul>
      </Section>

      <section className="bg-ember-500">
        <div className="shell flex flex-col items-start gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl font-display text-fluid-xl font-semibold tracking-[-0.02em] text-ink-950">
            Press enquiries for the candidate go to his campaign at{" "}
            <a href={`mailto:${site.contact.pressEmail}`} className="underline underline-offset-4">
              {site.contact.pressEmail}
            </a>
            .
          </p>
          <Button href="/contact" variant="dark" size="lg">
            Contact PITS
            <ArrowRight size={17} strokeWidth={2.75} />
          </Button>
        </div>
      </section>
    </>
  );
}
