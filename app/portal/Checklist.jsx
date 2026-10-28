import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * What is still missing from a membership record, and the one thing to do next.
 *
 * ── WHY THIS EXISTS AT ALL ─────────────────────────────────────────────────
 * The four things that finish a membership — a face, a confirmed handset, a
 * NIN, and one person brought in — were four separate cards scattered down two
 * columns, each asking for attention with the same weight and none of them
 * saying how far along the member already was. A page of equal requests is a
 * page with no request on it: the reader picks none of them and leaves.
 *
 * So the four are counted in one place, and only ONE of them is put forward at
 * a time — the cheapest one still outstanding. Somebody who has done nothing is
 * asked for a photograph, not for their National Identification Number, because
 * the first thing you ask of a person decides whether they do the second.
 *
 * ── WHY IT DISAPPEARS ──────────────────────────────────────────────────────
 * A completed record renders nothing. Not a trophy, not a green "all done"
 * banner that occupies the best space on the page for ever. The reward for
 * finishing is that the page stops asking — which is the only reward a member
 * who has finished actually wants, and it keeps the block meaningful for the
 * members who still see it. A permanent bar at 100% teaches everyone to ignore
 * the bar.
 *
 * ── WHY THESE FOUR AND NOT SIX ─────────────────────────────────────────────
 * Every step here is a fact the server already knows and the member can change
 * today. Nothing is counted that they cannot act on, and nothing is counted
 * twice. "Share your code" is not a step, because the server cannot see a
 * shared code — "one person registered with it" is, because it can.
 */
/* The four steps, cheapest first. Exported so the page can tell which form
   the card below is holding, and leave that form out of everywhere else. */
export const STEPS = [
  { key: "photo", label: "Add your photo", why: "It goes on your membership card.", anchor: "photograph" },
  { key: "phone", label: "Confirm your phone", why: "One code, and your ward can reach you.", anchor: "phone" },
  { key: "nin", label: "Verify with your NIN", why: "Unlocks office above ward level.", anchor: "verification" },
  {
    key: "referral",
    label: "Bring in one person",
    why: "Share the code on the green card with someone this week.",
    anchor: "referrals",
  },
];

export function nextStep(done) {
  return STEPS.find((step) => !done[step.key]) ?? null;
}

/**
 * ── ONE CONTROL PER TASK ───────────────────────────────────────────────────
 * This card used to end in a button — "Upload a photo" — that scrolled to a
 * card lower down with its own button, "Add a photograph". One task, two
 * buttons, two names for it, and the first button's only job was to find the
 * second. So the card now holds the real form for the step it is asking for
 * (`forms`, keyed by step), and the page leaves that form out of the row
 * below. There is exactly one place to do each thing, and it is the place
 * that asked.
 *
 * The referral step has no form here: the code and its copy and share
 * buttons are already on the green card beside this one, and a second set
 * would be the same repetition again.
 */
export default function Checklist({ done, forms = {}, className }) {
  const count = STEPS.filter((step) => done[step.key]).length;
  const next = nextStep(done);

  /* Finished. The page says so elsewhere; this card has nothing to ask. */
  if (!next) return null;

  const form = forms[next.key];

  return (
    <section
      id={next.anchor}
      aria-labelledby="checklist-heading"
      className={cn("flex scroll-mt-24 flex-col rounded-3xl bg-white p-6", className)}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 id="checklist-heading" className="text-lg font-semibold tracking-[-0.01em] text-ink-950">
          Next step
        </h2>
        <p className="text-[0.8125rem] font-medium text-content-subtle tabular-nums">
          {count} of {STEPS.length} done
        </p>
      </div>

      {/* Four segments rather than one bar: each is a thing the member did,
          and seeing two filled beside two empty is what makes the empty ones
          worth closing. */}
      <div
        role="progressbar"
        aria-label="Membership steps completed"
        aria-valuenow={count}
        aria-valuemin={0}
        aria-valuemax={STEPS.length}
        className="mt-4 grid grid-cols-4 gap-1.5"
      >
        {/* Filled from the left by count, not by which steps: progress reads
            left to right, and one done step lit at the far end reads as a gap. */}
        {STEPS.map((step, index) => (
          <span
            key={step.key}
            className={cn("h-2 rounded-full", index < count ? "bg-brand-600" : "bg-ink-100")}
          />
        ))}
      </div>

      <p className="mt-6 font-display text-[1.625rem] leading-[1.15] font-bold tracking-tight text-brand-800">
        {next.label}
      </p>
      <p className="mt-2 text-[0.875rem] text-content-subtle">{next.why}</p>

      {form && <div className="mt-5">{form}</div>}

      {/* The rest, small: done ones ticked, open ones as plain text. Not
          links — the only way to act on a step is to reach it here. */}
      <ul className="mt-auto flex flex-wrap gap-2 pt-6">
        {STEPS.filter((step) => step.key !== next.key).map((step) => (
          <li
            key={step.key}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.75rem] font-medium",
              done[step.key] ? "bg-brand-50 text-brand-700" : "bg-ink-50 text-ink-500"
            )}
          >
            {done[step.key] && <Check size={12} strokeWidth={3} aria-hidden="true" />}
            {step.label}
            <span className="sr-only">{done[step.key] ? ", done" : ", later"}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
