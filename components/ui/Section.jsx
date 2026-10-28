import React from "react";
import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

/**
 * Section shell + heading block.
 *
 * Every section previously re-declared its own container width, gutters and
 * vertical padding, so no two lined up. These own that rhythm.
 *
 * The heading is a pill label, then the title set large and calm, then a
 * standfirst in a muted tone. `index` is accepted for older call sites but no
 * longer drawn: numbering every section read as a printed report, and this is
 * a movement's front door.
 */
export function Section({
  as: Tag = "section",
  className,
  children,
  wide = false,
  tight = false,
  ...props
}) {
  return (
    <Tag className={cn(tight ? "section-tight" : "section", className)} {...props}>
      <div className={cn("shell", wide && "shell-wide")}>{children}</div>
    </Tag>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "default",
  className,
  actions,
  as: TitleTag = "h2",
}) {
  const inverse = tone === "inverse";
  const centered = align === "center";

  return (
    <header
      className={cn(
        "relative flex flex-col gap-8",
        actions && "lg:flex-row lg:items-end lg:justify-between lg:gap-12",
        className
      )}
    >
      <Reveal className={cn("min-w-0", centered && "mx-auto flex flex-col items-center text-center")}>
        {eyebrow && (
          <p
            className={cn(
              "eyebrow",
              centered && "eyebrow-center",
              inverse && "eyebrow-inverse"
            )}
          >
            {eyebrow}
          </p>
        )}

        <TitleTag
          className={cn(
            "mt-5 max-w-[20ch] text-fluid-4xl",
            centered && "mx-auto",
            inverse ? "text-white" : "text-content"
          )}
        >
          {title}
        </TitleTag>

        {lead && (
          <p
            className={cn(
              "prose-body mt-5",
              centered && "mx-auto",
              inverse && "text-white/70"
            )}
          >
            {lead}
          </p>
        )}
      </Reveal>

      {actions && (
        <Reveal delay={120} className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </Reveal>
      )}
    </header>
  );
}

export default Section;
