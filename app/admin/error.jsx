"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCw, TriangleAlert } from "lucide-react";

/**
 * When a secretariat page throws.
 *
 * Without this file the whole admin area fell back to the root error screen,
 * which in production is an unstyled "Application error" with no way forward
 * but the back button. A coordinator who hits it mid-appointment has no idea
 * whether the thing they just did was saved.
 *
 * So: say what happened in a sentence, say what it did not do, and offer the
 * two ways out. Retrying is `reset()`, which re-renders the segment — the rail
 * stays, the session stays, and nothing is re-submitted.
 */
export default function AdminError({ error, reset }) {
  /* Logged in the browser, not through lib/report: that module is documented
     server-only and reads SENTRY_DSN, which never crosses into a client
     bundle. The server has already reported this error on its own side; the
     digest below is how the two are matched up. */
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg border-2 border-red-600 bg-white p-8">
      <TriangleAlert size={24} className="text-red-700" aria-hidden="true" />
      <h1 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink-950">
        That page could not be loaded
      </h1>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-content-muted">
        Something went wrong while reading the register. Nothing you were doing
        has been changed. Try again, and if it keeps happening, tell the
        secretariat which page you were on.
      </p>
      {error?.digest && (
        <p className="mt-4 border border-ink-200 bg-ink-50 px-3 py-2 font-mono text-[0.75rem] text-ink-600">
          Reference {error.digest}
        </p>
      )}
      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 border-2 border-ink-950 bg-night px-5 py-3 text-[0.8125rem] font-bold tracking-[0.08em] text-white uppercase transition-colors hover:bg-white hover:text-ink-950"
        >
          <RotateCw size={15} strokeWidth={2.75} aria-hidden="true" />
          Try again
        </button>
        <Link
          href="/admin"
          className="inline-flex items-center border-2 border-ink-950 px-5 py-3 text-[0.8125rem] font-bold tracking-[0.08em] text-ink-950 uppercase transition-colors hover:bg-night hover:text-white"
        >
          Back to the dashboard
        </Link>
      </div>
    </div>
  );
}
