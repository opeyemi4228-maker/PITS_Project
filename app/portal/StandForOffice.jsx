"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, CircleCheck, Clock, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const STATUS = {
  SUBMITTED: ["bg-ember-100 text-ember-800", "Waiting on a decision"],
  UNDER_REVIEW: ["bg-ember-100 text-ember-800", "Being looked at"],
  APPROVED: ["bg-brand-600 text-white", "Appointed"],
  REJECTED: ["bg-ink-200 text-ink-700", "Not this time"],
  WITHDRAWN: ["bg-ink-100 text-ink-600", "Withdrawn"],
  ESCALATED: ["bg-night text-white", "Escalated"],
};

/**
 * Put your name forward for a vacancy in your own ward, LGA or state.
 *
 * ── THE SENTENCE THIS COMPONENT EXISTS TO SAY HONESTLY ─────────────────────
 * Applying is not getting. The officer above the seat may appoint somebody who
 * never applied, and often will — so the copy says so before the button rather
 * than leaving somebody to discover it from a rejection. A movement that
 * implies a queue resolves itself in your favour produces more disappointment
 * than one that says plainly what an application is: a way of being considered.
 *
 * What it does promise is an answer inside 72 hours (§8.1.6), and that clock is
 * shown on every open application so the member can see it running rather than
 * having to ask.
 * ───────────────────────────────────────────────────────────────────────────
 */
export default function StandForOffice({ vacancies, applications }) {
  const router = useRouter();
  const [chosen, setChosen] = useState("");
  const [statement, setStatement] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const open = applications.filter((row) =>
    ["SUBMITTED", "UNDER_REVIEW", "ESCALATED"].includes(row.status)
  );

  async function submit(event) {
    event.preventDefault();
    if (busy || !chosen) return;
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatId: chosen, statement }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "That could not be sent.");
        return;
      }
      setDone(true);
      setChosen("");
      setStatement("");
      router.refresh();
    } catch {
      setError("The network dropped. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function pull(id) {
    setBusy(true);
    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: id, withdraw: true }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6">
      <h2 className="text-lg font-semibold tracking-[-0.01em] text-ink-950">Stand for office</h2>

      {applications.length > 0 && (
        <ul className="mt-4 space-y-2">
          {applications.slice(0, 5).map((row) => {
            const [tone, label] = STATUS[row.status] ?? ["bg-ink-100 text-ink-600", row.status];
            return (
              <li key={row.id} className="rounded-2xl border border-ink-100 p-3.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block text-[0.875rem] font-bold text-ink-950">
                      {row.title}
                    </span>
                    <span className="block text-[0.75rem] text-content-muted">{row.unit}</span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-md px-2 py-0.5 text-[0.6875rem] font-medium",
                      tone
                    )}
                  >
                    {label}
                  </span>
                </div>

                {row.decisionNote && (
                  <p className="mt-2 text-[0.75rem] leading-snug text-content-muted">
                    &ldquo;{row.decisionNote}&rdquo;
                  </p>
                )}

                {["SUBMITTED", "UNDER_REVIEW"].includes(row.status) && (
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 text-[0.6875rem] text-content-subtle">
                      <Clock size={11} strokeWidth={3} aria-hidden="true" />
                      An answer is due by{" "}
                      {new Intl.DateTimeFormat("en-NG", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Africa/Lagos",
                      }).format(new Date(row.slaDueAt))}
                    </span>
                    <button
                      type="button"
                      onClick={() => pull(row.id)}
                      disabled={busy}
                      className="text-[0.6875rem] font-bold text-ink-500 hover:text-red-700 disabled:opacity-40"
                    >
                      Withdraw
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {done && (
        <p className="mt-4 flex gap-2 rounded-xl bg-brand-50 px-4 py-3 text-[0.8125rem] leading-snug text-ink-950">
          <CircleCheck size={15} strokeWidth={2.5} className="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
          Sent. The officer above that seat has 72 hours to answer you.
        </p>
      )}

      {vacancies.length === 0 ? (
        <p className="mt-4 text-[0.875rem] leading-relaxed text-content-muted">
          There is no vacancy in your ward, LGA or state at the moment. When one opens it
          appears here.
        </p>
      ) : open.length >= 3 ? (
        <p className="mt-4 text-[0.875rem] leading-relaxed text-content-muted">
          You have three applications open. Wait for one to be decided before putting your
          name forward again.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-5 border-t border-ink-200 pt-5">
          <label
            htmlFor="seat"
            className="block text-[0.8125rem] font-medium text-ink-600"
          >
            Vacancies near you
          </label>
          <select
            id="seat"
            value={chosen}
            onChange={(event) => {
              setChosen(event.target.value);
              setError("");
              setDone(false);
            }}
            className="mt-2 w-full rounded-xl border border-ink-200 bg-white px-3 py-2.5 text-[0.875rem] text-ink-950 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Choose a seat…</option>
            {vacancies.map((seat) => (
              <option key={seat.id} value={seat.id}>
                {seat.title}, {seat.unit}
                {seat.applications > 0 ? ` (${seat.applications} already applied)` : ""}
              </option>
            ))}
          </select>

          <label
            htmlFor="statement"
            className="mt-4 block text-[0.8125rem] font-medium text-ink-600"
          >
            Why you (optional)
          </label>
          <textarea
            id="statement"
            value={statement}
            onChange={(event) => setStatement(event.target.value)}
            rows={3}
            maxLength={500}
            placeholder="What you would do, and what you have done already."
            className="mt-2 w-full resize-y rounded-xl border border-ink-200 px-3 py-2.5 text-[0.875rem] leading-relaxed outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
          />

          {error && (
            <p className="mt-3 flex gap-2 text-[0.8125rem] leading-snug text-red-700">
              <CircleAlert size={15} strokeWidth={2.5} className="mt-0.5 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!chosen || busy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-ink-300 px-5 py-2.5 text-[0.875rem] font-semibold text-ink-950 transition-colors hover:border-brand-700 hover:text-brand-700 disabled:cursor-not-allowed disabled:border-ink-300 disabled:text-ink-400"
          >
            {busy && <Loader2 size={13} strokeWidth={3} className="animate-spin" />}
            Put my name forward
          </button>

          <p className="mt-3 text-[0.75rem] leading-relaxed text-content-subtle">
            Applying is not getting. The officer above that seat may appoint somebody who
            never applied. What this guarantees is that they see your name and answer you
            within 72 hours.
          </p>
        </form>
      )}
    </div>
  );
}
