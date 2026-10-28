"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * The section rail for /media.
 *
 * ── WHY THIS EXISTS ────────────────────────────────────────────────────────
 * Activities, photographs and video used to be three pages, and three pages
 * carry their own wayfinding for free: you always knew where you were because
 * the address bar told you. Folding them into one long page throws that away,
 * so it has to be given back deliberately. This rail is the replacement — it
 * names the three parts up front, so the visitor knows the page's full extent
 * from the first screen and never has to scroll to find out whether the thing
 * they came for is here.
 *
 * ── WHY PLAIN ANCHORS ──────────────────────────────────────────────────────
 * These are real <a href="#..."> links, not buttons with scroll handlers. They
 * work before this component hydrates, they work if the JavaScript never
 * arrives — which on a Nigerian mobile connection is a real outcome, not a
 * hypothetical — and they can be opened in a new tab or copied like any link.
 * The observer below only adds the highlight; it is decoration on something
 * that already works.
 *
 * ── WHY IT PINS UNDER THE MASTHEAD ─────────────────────────────────────────
 * `--masthead-offset` is published by Navbar and tracks the bar as it condenses
 * and retracts, so this rail sits *beneath* the masthead rather than under it.
 * Same device the newsroom filter bar uses.
 * ───────────────────────────────────────────────────────────────────────────
 */
export default function MediaNav({ sections }) {
  const [active, setActive] = useState(sections[0]?.id ?? null);
  const railRef = useRef(null);

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter(Boolean);

    if (targets.length === 0) return;

    /* The rail and the masthead together occupy the top of the viewport, so a
       section is "current" once it crosses below them — not once it touches
       y=0, which would light the next section up while the previous one still
       fills the screen. The bottom margin keeps the last section from winning
       merely because the page has run out of scroll. */
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-176px 0px -55% 0px", threshold: 0 }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [sections]);

  /* Keep the active chip in view on mobile, where the rail scrolls sideways and
     the current section can otherwise sit off-screen. `nearest` rather than
     `center` so it only moves when it actually has to. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !active) return;

    const chip = rail.querySelector(`[data-chip="${active}"]`);
    if (!chip) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    chip.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      inline: "nearest",
      block: "nearest",
    });
  }, [active]);

  return (
    <nav
      aria-label="Sections on this page"
      className="sticky top-(--masthead-offset,0px) z-30 border-b border-hairline bg-white/95 backdrop-blur-sm transition-[top] duration-300 ease-out-quart"
    >
      <div className="shell">
        <ul
          ref={railRef}
          className="-mx-1 flex snap-x gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((section) => {
            const current = active === section.id;
            return (
              <li key={section.id} className="snap-start">
                <a
                  href={`#${section.id}`}
                  data-chip={section.id}
                  aria-current={current ? "true" : undefined}
                  className={cn(
                    /* min-h-11 keeps the tap target at the 44px floor: this
                       audience is overwhelmingly on phones, and a row of chips
                       is exactly where thumbs miss. */
                    "relative flex min-h-11 items-center gap-2 px-4 text-[0.8125rem] font-medium whitespace-nowrap transition-colors duration-200",
                    current
                      ? "text-ink-950"
                      : "text-content-subtle hover:text-brand-700"
                  )}
                >
                  {section.label}

                  {/* The count is the page's information scent: it tells the
                      visitor what is behind the link before they spend a scroll
                      on it. Suppressed at zero — three "0" badges would only
                      announce emptiness three times over, and the sections say
                      so themselves, in words, once you are there. */}
                  {section.count > 0 && (
                    <span className="bg-ink-100 px-1.5 py-0.5 text-[0.6875rem] font-bold text-ink-600 tabular-nums">
                      {section.count}
                    </span>
                  )}

                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 bottom-0 h-0.5 origin-center bg-ember-500 transition-transform duration-300 ease-out-quart",
                      current ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
