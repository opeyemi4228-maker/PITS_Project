"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { community, footerColumns, socials, site, volunteerCta } from "@/lib/site";
import { assets } from "@/assets/assets";
import Button from "@/components/ui/Button";
import BrandIcon from "@/components/ui/BrandIcon";
import { useViewer } from "@/lib/useViewer";

/* ════════════════════════════════════════════════════════════════════════════
   THE FOOTER

     1. The appeal      A paper band with one white card: why support matters,
                        and one action. Skipped on the homepage, which already
                        closes on its own photographic call to action — two
                        back to back read as the page asking twice.
     2. The night panel Rounded and inset like the hero, so the page opens and
                        closes on the same shape. The community first, then the
                        directory, then the base bar.

   There is no newsletter field. The one that used to sit here waited 700ms and
   announced "You're on the list" without sending anything anywhere, which is a
   promise to a member the movement had no way to keep. The WhatsApp community
   is real, so that is what the footer offers instead.

   The base bar carries the builder's credit, "Built by BitLayerX
   Technologies", on every page. It is a standing instruction: do not remove it.
   ════════════════════════════════════════════════════════════════════════ */

const BUILDER = { name: "BitLayerX Technologies", href: "https://www.bitlayerx.com" };

const linkClass =
  "inline-block text-[0.9375rem] leading-snug text-white/60 transition-colors duration-200 hover:text-white";

function FooterLink({ link }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {link.label}
        <ArrowUpRight
          size={12}
          strokeWidth={2.5}
          aria-hidden="true"
          className="ml-1 inline-block align-[-1px] text-white/35"
        />
      </a>
    );
  }
  return (
    <Link href={link.href} className={linkClass}>
      {link.label}
    </Link>
  );
}

function SocialLink({ label, href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`PITS on ${label}`}
      className="grid size-11 place-items-center rounded-full bg-white/8 text-white/80 ring-1 ring-white/12 transition-colors duration-300 ease-out-quart hover:bg-ember-500 hover:text-ink-950 hover:ring-ember-500"
    >
      <BrandIcon name={icon} className="size-4" />
    </a>
  );
}

function Appeal() {
  return (
    <section aria-labelledby="footer-appeal" className="shell shell-wide pb-12 lg:pb-16">
      <div className="card flex flex-col items-start gap-8 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
        <div className="max-w-2xl">
          <p className="eyebrow">Volunteer</p>
          <h2 id="footer-appeal" className="mt-5 text-fluid-3xl">
            Volunteers build the structure, ward by ward.
          </h2>
          <p className="prose-body mt-4">
            A day of your time, a skill, a room for a ward meeting. Every seat
            filled makes the movement stronger.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Button href={volunteerCta.href} variant="primary" size="lg">
            Volunteer with PITS
            <ArrowRight size={17} strokeWidth={2.5} aria-hidden="true" />
          </Button>
          <Button href="/structure#find" variant="outline" size="lg">
            Find your ward
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function Footer() {
  const pathname = usePathname();

  /* A member who has already joined should not be invited to join, anywhere.
     The link is replaced rather than removed so the column keeps its shape. */
  const { member } = useViewer();
  const columns = member
    ? footerColumns.map((column) => ({
        ...column,
        links: column.links.map((link) =>
          link.href === "/join" ? { label: "Your membership", href: "/portal" } : link
        ),
      }))
    : footerColumns;

  const year = new Date().getFullYear();

  return (
    <footer>
      {pathname !== "/" && <Appeal />}

      <div className="px-2 pb-2 sm:px-3 sm:pb-3">
        <div className="relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-night text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_100%_0%,color-mix(in_oklch,var(--color-brand-600)_32%,transparent)_0%,transparent_70%)]"
          />
          <Image
            src={assets.amvoraMarkLight}
            alt=""
            sizes="400px"
            className="pointer-events-none absolute -right-16 -bottom-24 -z-10 h-[30rem] w-auto opacity-[0.06]"
          />

          {/* ---------------------------------------------------- community */}
          <div className="shell shell-wide grid gap-8 border-b border-white/10 py-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:py-16">
            <div>
              <h2 className="max-w-[16ch] text-fluid-4xl text-white">
                Stay close to the streets.
              </h2>
              <p className="mt-4 max-w-md text-[0.9375rem] leading-relaxed text-white/60">
                Statements, events and new appointments in your state, as they
                happen, in the PITS community and on our channels.
              </p>
            </div>
            <div className="flex flex-col gap-5 lg:items-end">
              <Button href={community.href} variant="ember" size="lg" external>
                <MessageCircle size={18} strokeWidth={2.25} aria-hidden="true" />
                Join the WhatsApp community
                <ArrowUpRight size={17} strokeWidth={2.5} aria-hidden="true" />
              </Button>
              <ul className="flex flex-wrap gap-2.5">
                {socials.map((social) => (
                  <li key={social.label}>
                    <SocialLink {...social} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ----------------------------------------------------- directory */}
          <div className="shell shell-wide grid gap-12 py-14 lg:grid-cols-12 lg:gap-10 lg:py-16">
            <div className="lg:col-span-4">
              <Link href="/" aria-label={`${site.name} home`} className="inline-flex items-center gap-3.5">
                <Image
                  src={assets.amvoraMarkLight}
                  alt=""
                  sizes="96px"
                  className="h-14 w-auto shrink-0 object-contain"
                />
                <span className="flex flex-col leading-none">
                  <span className="font-display text-[1.25rem] font-semibold tracking-[-0.03em]">
                    Power In The Streets
                  </span>
                  <span className="mt-1.5 text-[0.8125rem] text-white/50">
                    PITS · by {site.parent} · {site.tagline}
                  </span>
                </span>
              </Link>

              <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-white/55">
                Organising in all 36 states, the FCT, 774 local governments and
                over 8,000 wards behind {site.aspirant}, {site.partyShort}{" "}
                candidate for President.
              </p>

              <ul className="mt-7 space-y-3 text-[0.9375rem] text-white/70">
                <li className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-ember-400" aria-hidden="true" />
                  <span>
                    {site.contact.phones.map((phone, index) => (
                      <React.Fragment key={phone}>
                        {index > 0 && <span className="text-white/30"> · </span>}
                        <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white">
                          {phone}
                        </a>
                      </React.Fragment>
                    ))}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-ember-400" aria-hidden="true" />
                  <a href={`mailto:${site.contact.email}`} className="hover:text-white">
                    {site.contact.email}
                  </a>
                </li>
              </ul>
            </div>

            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-8 xl:gap-x-10"
            >
              {columns.map((column) => (
                <div key={column.title}>
                  <h2 className="text-[0.875rem] font-semibold tracking-[-0.01em] text-white">
                    {column.title}
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <FooterLink link={link} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* ------------------------------------------------------ base bar */}
          <div className="border-t border-white/10">
            <div className="shell shell-wide flex flex-col gap-4 py-6 text-[0.8125rem] text-white/50 lg:flex-row lg:items-center lg:justify-between">
              <p>
                © {year} {site.movement}. All rights reserved.
              </p>

              {/* Standing policy from /terms, on every page, so nobody has to
                  go looking for it before they are asked for a "fee". */}
              <p className="flex items-center gap-2 text-white/65">
                <ShieldCheck size={15} className="shrink-0 text-ember-400" aria-hidden="true" />
                Membership is free. PITS never asks for payment.
              </p>

              <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <Link href="/privacy" className="transition-colors hover:text-white">
                  Privacy
                </Link>
                <Link href="/terms" className="transition-colors hover:text-white">
                  Terms
                </Link>
                <a
                  href={BUILDER.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-white/65 transition-colors hover:text-white"
                >
                  Built by <span className="font-semibold text-white">{BUILDER.name}</span>
                  <ArrowUpRight
                    size={13}
                    strokeWidth={2.5}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
