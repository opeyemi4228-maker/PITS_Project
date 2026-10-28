import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

/**
 * The header every inner page opens with.
 *
 * The homepage hero's shape, at a smaller scale: a rounded photographic panel
 * inset from the viewport, the headline set white and anchored bottom-left,
 * where the scrim is heaviest and the eye lands after the photograph. Without
 * a photograph it falls back to the night band with a torch-red glow, so a
 * page never opens on a flat grey slab.
 */
export default function PageHeader({
  kicker,
  title,
  lead,
  image,
  /* Where the photograph is anchored. A literal class, so Tailwind sees it. */
  imagePosition = "object-[center_35%]",
  breadcrumb,
  align = "left",
  children,
  className,
}) {
  const hasImage = Boolean(image);
  const centered = align === "center";

  return (
    <header className={cn("px-2 pt-2 sm:px-3 sm:pt-3", className)}>
      <div className="relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-night text-white">
        {hasImage ? (
          <>
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="100vw"
              className={cn("-z-10 object-cover", imagePosition)}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-night)_0%,color-mix(in_oklch,var(--color-night)_70%,transparent)_38%,color-mix(in_oklch,var(--color-night)_25%,transparent)_100%)]"
            />
          </>
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(70%_100%_at_85%_0%,color-mix(in_oklch,var(--color-brand-600)_45%,transparent)_0%,transparent_70%)]"
          />
        )}

        <div
          className={cn(
            "shell shell-wide flex min-h-[26rem] flex-col justify-end pt-32 pb-12 sm:min-h-[30rem] lg:min-h-[34rem] lg:pb-16",
            centered && "items-center text-center"
          )}
        >
          {breadcrumb && (
            <Reveal>
              <nav aria-label="Breadcrumb">
                <ol className="glass flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.8125rem] text-white/70">
                  <li>
                    <Link href="/" className="transition-colors hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-white/35">/</li>
                  <li className="font-medium text-white">{breadcrumb}</li>
                </ol>
              </nav>
            </Reveal>
          )}

          <Reveal delay={60}>
            {kicker && (
              <p className="mt-6 text-[0.9375rem] font-medium text-ember-400">{kicker}</p>
            )}

            <h1
              className={cn(
                "mt-3 max-w-[18ch] text-fluid-5xl text-white",
                centered && "mx-auto"
              )}
            >
              {title}
            </h1>
          </Reveal>

          {lead && (
            <Reveal delay={130}>
              <p
                className={cn(
                  "mt-6 max-w-2xl text-fluid-lg leading-relaxed text-white/75",
                  centered && "mx-auto"
                )}
              >
                {lead}
              </p>
            </Reveal>
          )}

          {children && (
            <Reveal delay={200}>
              <div className="mt-9">{children}</div>
            </Reveal>
          )}
        </div>
      </div>
    </header>
  );
}

/** A row of figures, reused across the inner pages. */
export function StatRow({ items, className, tone = "default" }) {
  const inverse = tone === "inverse";
  return (
    <dl
      className={cn(
        "grid grid-cols-[repeat(2,minmax(min-content,1fr))] overflow-hidden rounded-[var(--radius-card)] border sm:grid-cols-[repeat(4,minmax(min-content,1fr))]",
        inverse ? "glass" : "border-hairline bg-white shadow-e2",
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "px-5 py-6",
            inverse ? "border-l border-white/15" : "border-l border-ink-200",
            "first:border-l-0"
          )}
        >
          <dd
            className={cn(
              "font-display text-fluid-2xl font-semibold tracking-[-0.03em] tabular-nums",
              inverse ? "text-white" : "text-ink-950"
            )}
          >
            {item.value}
          </dd>
          <dt
            className={cn(
              "mt-1.5 text-[0.8125rem] leading-snug",
              inverse ? "text-white/55" : "text-ink-500"
            )}
          >
            {item.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
