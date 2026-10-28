"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * When a public page throws.
 *
 * Without this file a failed page fell back to Next's unstyled "Application
 * error". The masthead and footer stay in place around this one (it renders
 * inside the root layout), so the visitor can still go anywhere else.
 */
export default function SiteError({ error, reset }) {
  /* The server has already reported this on its own side; the digest is how
     the two are matched up. */
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="shell flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-6 max-w-[20ch] text-fluid-4xl">This page could not be loaded.</h1>
      <p className="prose-body mt-5">
        It is a problem on our side, not yours. Please try again in a moment. If
        it keeps happening, let the Secretariat know which page you were on.
      </p>
      {error?.digest && (
        <p className="mt-5 rounded-full bg-ink-100 px-4 py-1.5 font-mono text-[0.75rem] text-ink-600">
          Reference {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={reset} variant="primary" size="lg">
          <RotateCw size={16} strokeWidth={2.5} aria-hidden="true" />
          Try again
        </Button>
        <Button href="/" variant="outline" size="lg">
          Back to the homepage
        </Button>
      </div>
    </section>
  );
}
