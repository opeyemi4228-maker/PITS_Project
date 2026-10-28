"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HandHeart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { volunteerCta } from "@/lib/site";

/**
 * Persistent volunteer call to action.
 *
 * Desk: a rounded tab on the right edge that slides out to show "Join the
 * team" on hover. Phone: a floating pill above the home indicator rather than
 * a full-width bar, so it reads as an invitation and not as a banner covering
 * the page.
 *
 * Behaviour: stays out of the way until the hero is behind you, retracts near
 * the footer so it never covers the footer's own calls to action, and is not
 * shown on the volunteer page itself, where it would point at where you are.
 */
export default function VolunteerRail() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewport = window.innerHeight;
      const pastHero = y > viewport * 0.6;
      // Hide over roughly the last screen of the page (the footer zone).
      const nearFooter = y + viewport > docHeight - viewport * 0.75;
      setVisible(pastHero && !nearFooter);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (pathname === volunteerCta.href) return null;

  return (
    <>
      {/* Desktop: a vertical tab on the right edge. */}
      <Link
        href={volunteerCta.href}
        aria-label="Volunteer with PITS"
        className={cn(
          "group no-print fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 md:flex",
          "flex-col items-center gap-4 rounded-l-2xl py-6 pr-3 pl-3.5 text-white",
          "bg-linear-to-b from-brand-500 via-brand-600 to-brand-800",
          "shadow-[0_18px_40px_-12px_var(--color-brand-700)] ring-1 ring-white/15",
          "transition-[transform,opacity,padding] duration-500 ease-out-quart hover:pl-5",
          visible ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0"
        )}
      >
        <span className="grid size-9 place-items-center rounded-full bg-white/15 ring-1 ring-white/25 transition-transform duration-500 ease-out-quart group-hover:scale-110 group-hover:bg-white group-hover:text-brand-700">
          <HandHeart size={18} strokeWidth={2.25} aria-hidden="true" />
        </span>
        <span
          className="text-[0.8125rem] font-semibold tracking-[0.06em] uppercase"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          {volunteerCta.label}
        </span>
        <span aria-hidden="true" className="size-1.5 rounded-full bg-ember-400 shadow-[0_0_8px_var(--color-ember-400)]" />
      </Link>

      {/* Mobile: a floating pill, clear of the home indicator. */}
      <div
        className={cn(
          "no-print pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 md:hidden",
          "transition-[transform,opacity] duration-500 ease-out-quart",
          visible ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0"
        )}
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <Link
          href={volunteerCta.href}
          tabIndex={visible ? undefined : -1}
          className={cn(
            "flex h-14 items-center gap-3 rounded-full bg-linear-to-r from-brand-600 to-brand-700 pr-5 pl-2 text-[0.9375rem] font-semibold text-white",
            "shadow-[0_16px_36px_-12px_var(--color-brand-800)] ring-1 ring-white/15 active:scale-[0.98]",
            visible && "pointer-events-auto"
          )}
        >
          <span className="grid size-10 place-items-center rounded-full bg-white text-brand-700">
            <HandHeart size={19} strokeWidth={2.25} aria-hidden="true" />
          </span>
          Volunteer with PITS
          <ArrowRight size={17} strokeWidth={2.5} aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
