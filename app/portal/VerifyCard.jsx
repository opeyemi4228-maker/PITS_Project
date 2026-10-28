"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, CircleAlert, Loader2, ShieldAlert } from "lucide-react";

import { clearViewerCache } from "@/lib/useViewer";
import { cn } from "@/lib/utils";

/**
 * Verification, and the one thing that grants it.
 *
 * ── WHY THE NIN IS THE WHOLE OF IT ─────────────────────────────────────────
 * A membership register anybody can add a name to is a mailing list. The NIN is
 * the one identifier an ordinary Nigerian already has that maps to exactly one
 * person, so it is what separates "somebody typed this name in" from "this is a
 * person, and only one row in this register is them". Give it and you are
 * verified; don't and you are pending. There is no queue, no reviewer, and
 * nothing to wait for — which also means there is nobody to blame when a
 * member is still pending three weeks later.
 *
 * ── WHAT THE FORM PROMISES AND WHAT IT DOES NOT ────────────────────────────
 * It says plainly that the number is encrypted and never shown again, because
 * asking a Nigerian for their NIN on a political website is asking for real
 * trust and the only way to earn it is to be specific about what happens to it.
 *
 * It does not claim the number is checked against NIMC. It is not. All the
 * server can tell is that nobody else in this register has claimed it. Saying
 * "verified" without saying that would be the page overstating itself.
 * ───────────────────────────────────────────────────────────────────────────
 */
/* `bare` draws only the form, for when the portal's next-step card is already
   the frame around it and has already said what this is and why. */
export default function VerifyCard({ verified, hasNin, bare = false }) {
  const router = useRouter();
  const [nin, setNin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const settled = verified || done;

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/member/nin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nin }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "That could not be saved. Please try again.");
        return;
      }

      setDone(true);
      setNin("");
      /* The masthead caches the viewer, and it carries the verification badge.
         Leaving it stale would show "Not verified" in the header of a page that
         has just said the opposite. */
      clearViewerCache();
      router.refresh();
    } catch {
      setError("The network dropped. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={cn(
        !bare && "h-full rounded-3xl bg-white p-6",
        false
      )}
    >
      {!bare && (
      <>
      <div className="flex items-center gap-2.5">
        {settled ? (
          <BadgeCheck size={18} className="text-brand-600" aria-hidden="true" />
        ) : (
          <ShieldAlert size={18} className="text-brand-600" aria-hidden="true" />
        )}
        <p className="text-[0.8125rem] font-medium text-ink-600">
          Verification
        </p>
      </div>

      <p className="mt-3 text-lg font-semibold tracking-[-0.01em] text-ink-950">
        {settled ? "Verified" : "Not yet verified"}
      </p>
      </>
      )}

      {settled ? (
        <p className="mt-2 text-[0.875rem] leading-relaxed text-content-muted">
          Your National Identification Number is on file, encrypted. You are eligible to
          hold office at any tier.
        </p>
      ) : (
        <>
          {!bare && (
            <p className="mt-2 text-[0.875rem] leading-relaxed text-content-muted">
              Add your NIN and you&rsquo;re verified instantly. It unlocks office above ward level.
            </p>
          )}

          <form onSubmit={submit} className={bare ? "" : "mt-5"}>
            <label
              htmlFor="nin"
              className="block text-[0.8125rem] font-medium text-ink-600"
            >
              NIN (11 digits)
            </label>
            <input
              id="nin"
              name="nin"
              value={nin}
              onChange={(event) => {
                setNin(event.target.value.replace(/\D/g, "").slice(0, 11));
                setError("");
              }}
              inputMode="numeric"
              autoComplete="off"
              placeholder="12345678901"
              aria-describedby="nin-note"
              className="mt-2 w-full rounded-xl border border-ink-200 px-4 py-3 font-mono text-[1.0625rem] tabular-nums text-ink-950 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
            />

            {error && (
              <p className="mt-3 flex gap-2 text-[0.8125rem] leading-snug text-red-700">
                <CircleAlert size={15} strokeWidth={2.5} className="mt-0.5 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={nin.length !== 11 || busy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-500"
            >
              {busy && <Loader2 size={14} strokeWidth={3} className="animate-spin" />}
              {busy ? "Saving" : "Verify my membership"}
            </button>

            <p id="nin-note" className="mt-4 text-[0.75rem] leading-relaxed text-content-subtle">
              Encrypted on arrival and never shown again: not to you, coordinators or any
              export. It only proves one person holds one membership; it is not checked
              against NIMC.
            </p>
          </form>
        </>
      )}
    </div>
  );
}
