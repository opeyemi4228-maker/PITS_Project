"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Loader2, Phone, PhoneCall } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Confirm the handset a member registered with.
 *
 * ── WHY THIS COMPONENT HAD TO BE WRITTEN ───────────────────────────────────
 * /api/auth/verify-phone was complete — rate limited, audited, five-minute
 * codes, resend metered two ways — and nothing in the product ever called it.
 * Registration creates the account with `phoneVerified: false` (see the note on
 * that route), so the flag could be written by nothing and was false for every
 * member in the register. A member could not confirm their number because
 * there was no screen that asked.
 *
 * ── THE TWO STATES, AND WHY THE SECOND ONE OWNS THE FIELD ──────────────────
 * Ask for a code, then type it. The field for the code does not exist until a
 * code has been sent, because an input sitting there before anything is on its
 * way is an invitation to type the wrong thing — people fill in the box in
 * front of them and then wonder why their password was rejected. Once it is
 * sent the input takes focus by itself: the member is already holding the
 * handset the code arrived on, and asking them to put it down and find a text
 * field is a step this flow can simply not have.
 *
 * ── WHAT IT DOES NOT PROMISE ───────────────────────────────────────────────
 * The route refuses a resend faster than its floor and answers 429 with a
 * `retryAfter`, so the button says how long rather than failing silently — and
 * a member who never receives anything is told plainly that the number on file
 * may be the problem, with the number printed beside it so they can check.
 */
/* `bare` draws only the controls, for when the portal's next-step card is the
   frame and has already said what this is and why. */
export default function ConfirmPhone({ phone, bare = false }) {
  const router = useRouter();
  const [stage, setStage] = useState("idle"); // idle → sent
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [wait, setWait] = useState(0);
  const field = useRef(null);

  /* The resend cooldown, counted down on screen. A disabled button with no
     reason on it reads as a broken button. */
  useEffect(() => {
    if (wait <= 0) return undefined;
    const timer = setTimeout(() => setWait((left) => left - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  useEffect(() => {
    if (stage === "sent") field.current?.focus();
  }, [stage]);

  async function post(body) {
    const response = await fetch("/api/auth/verify-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { response, data: await response.json().catch(() => ({})) };
  }

  async function send() {
    if (busy || wait > 0) return;
    setBusy(true);
    setError("");
    setNote("");

    try {
      const { response, data } = await post({ resend: true });

      if (!response.ok) {
        setError(data.error ?? "The code could not be sent. Try again shortly.");
        if (data.retryAfter) setWait(Number(data.retryAfter));
        return;
      }

      /* Already confirmed on another device, or in another tab. Nothing to
         type — refresh and let the server's answer redraw the page. */
      if (data.alreadyVerified) {
        router.refresh();
        return;
      }

      setStage("sent");
      setNote(`Sent to ${phone}. It expires in five minutes.`);
      setWait(60);
    } catch {
      setError("The network dropped. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function confirm(event) {
    event.preventDefault();
    if (busy || code.length !== 6) return;
    setBusy(true);
    setError("");
    setNote("");

    try {
      const { response, data } = await post({ code });

      if (!response.ok) {
        setError(
          data.remaining > 0
            ? `${data.error ?? "That code is not right."} ${data.remaining} ${
                data.remaining === 1 ? "try" : "tries"
              } left.`
            : (data.error ?? "That code is not right.")
        );
        return;
      }

      /* No local "done" state. The flag lives on the server and the whole page
         is drawn from it — the checklist above, the masthead, this card — so
         one refresh settles all of them at once and none of them can disagree
         with the others. */
      router.refresh();
    } catch {
      setError("The network dropped. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn(!bare && "h-full rounded-3xl bg-white p-6")}>
      {!bare && (
      <>
      <div className="flex items-center gap-2.5">
        <PhoneCall size={18} className="text-brand-600" aria-hidden="true" />
        <p className="text-[0.8125rem] font-medium text-ink-600">
          Your phone number
        </p>
      </div>

      <p className="mt-3 text-lg font-semibold tracking-[-0.01em] text-ink-950">
        Not yet confirmed
      </p>

      <p className="mt-2 text-[0.875rem] leading-relaxed text-content-muted">
        We only text confirmed numbers. One code and you&rsquo;re done.
      </p>
      </>
      )}

      <p className="mt-4 flex items-center gap-2 rounded-xl bg-ink-50 px-3.5 py-2.5 text-[0.9375rem] font-bold text-ink-950 tabular-nums">
        <Phone size={15} strokeWidth={2.5} aria-hidden="true" className="shrink-0 text-ink-500" />
        {phone}
      </p>

      {stage === "sent" && (
        <form onSubmit={confirm} className="mt-5">
          <label
            htmlFor="otp"
            className="block text-[0.8125rem] font-medium text-ink-600"
          >
            The six digit code
          </label>
          <input
            id="otp"
            ref={field}
            value={code}
            onChange={(event) => {
              setCode(event.target.value.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            inputMode="numeric"
            /* The one autocomplete token phones actually act on: iOS and
               Android both offer the code straight from the notification, so
               most members never type it at all. */
            autoComplete="one-time-code"
            placeholder="000000"
            className="mt-2 w-full rounded-xl border border-ink-200 px-4 py-3 text-center font-mono text-[1.25rem] tracking-[0.45em] text-ink-950 tabular-nums outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          />

          <button
            type="submit"
            disabled={code.length !== 6 || busy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-500"
          >
            {busy && <Loader2 size={14} strokeWidth={3} className="animate-spin" aria-hidden="true" />}
            {busy ? "Checking" : "Confirm my number"}
          </button>
        </form>
      )}

      {error && (
        <p className="mt-3 flex gap-2 text-[0.8125rem] leading-snug text-red-700">
          <CircleAlert size={15} strokeWidth={2.5} className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Both the "it is on its way" line and the failure above it are
          announced, because on a phone the member is looking at their messages
          rather than at this card when the answer arrives. */}
      <p aria-live="polite" className="mt-3 text-[0.8125rem] leading-snug text-content-muted">
        {note}
      </p>

      <button
        type="button"
        onClick={send}
        disabled={busy || wait > 0}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-ink-300 px-5 py-2.5 text-[0.875rem] font-semibold text-ink-950 transition-colors hover:border-brand-700 hover:text-brand-700 disabled:cursor-not-allowed disabled:border-ink-300 disabled:text-ink-400"
      >
        {busy && stage === "idle" && (
          <Loader2 size={13} strokeWidth={3} className="animate-spin" aria-hidden="true" />
        )}
        {wait > 0
          ? `Send again in ${wait}s`
          : stage === "sent"
            ? "Send it again"
            : "Send me the code"}
      </button>

      <p className="mt-3 text-[0.75rem] leading-relaxed text-content-subtle">
        Nothing arriving? If this number is wrong, your LGA Coordinator can
        correct it.
      </p>
    </div>
  );
}
