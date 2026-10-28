"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A member's referral code as the page's dark green feature card.
 *
 * The code is set large because most of the time it is not copied at all — it
 * is read off a screen and said out loud at a ward meeting. The two round
 * buttons are the two ways it is actually passed on: copied into a message,
 * or handed to the phone's own share sheet, which on most handsets in this
 * movement means WhatsApp.
 */
export default function ReferralHero({ code, className, note = "Everyone who joins with it is credited to you." }) {
  const [copied, setCopied] = useState(null);

  if (!code) return null;

  const link = () => `${window.location.origin}/join?ref=${code}`;

  async function copy(what, value) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(what);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard refused. The code is on screen, which always works.
    }
  }

  async function share() {
    const url = link();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join PITS",
          text: `Join Power In The Streets (PITS) with my code ${code}`,
          url,
        });
      } catch {
        // Dismissed.
      }
      return;
    }
    copy("link", url);
  }

  const round =
    "grid size-12 place-items-center rounded-full transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-white";

  return (
    <div
      className={cn(
        "relative isolate flex flex-col overflow-hidden rounded-3xl bg-brand-950 p-6 text-white",
        className
      )}
    >
      {/* Contour lines, drawn in CSS: texture without an image request. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_110%,transparent_0_18%,rgb(255_255_255/0.07)_18.5%_19%,transparent_19.5%_28%,rgb(255_255_255/0.07)_28.5%_29%,transparent_29.5%_38%,rgb(255_255_255/0.07)_38.5%_39%,transparent_39.5%_48%,rgb(255_255_255/0.06)_48.5%_49%,transparent_49.5%),radial-gradient(120%_100%_at_100%_100%,var(--color-brand-700),var(--color-brand-950)_70%)]"
      />
      <p className="text-[0.9375rem] font-medium text-white/85">Your referral code</p>
      <p className="mt-5 font-display text-[2.5rem] leading-none font-bold tracking-[0.08em] tabular-nums">
        {code}
      </p>
      <p className="mt-3 text-[0.8125rem] leading-snug text-white/65">{note}</p>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => copy("code", code)}
          aria-label="Copy your referral code"
          className={cn(round, "bg-white text-brand-950")}
        >
          {copied === "code" ? <Check size={20} strokeWidth={2.75} /> : <Copy size={19} strokeWidth={2.25} />}
        </button>
        <button
          type="button"
          onClick={share}
          aria-label="Share your joining link"
          className={cn(round, "bg-ember-500 text-white")}
        >
          {copied === "link" ? <Check size={20} strokeWidth={2.75} /> : <Share2 size={19} strokeWidth={2.25} />}
        </button>
        {/* Silent until there is something to confirm: the two buttons
            explain themselves, and a caption beside them would only wrap. */}
        <span className="ml-1 text-[0.8125rem] font-medium text-white" aria-live="polite">
          {copied === "code" ? "Copied" : copied === "link" ? "Link copied" : ""}
        </span>
      </div>
    </div>
  );
}
