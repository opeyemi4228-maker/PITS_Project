"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Radio } from "lucide-react";

import { election } from "@/lib/agenda";

const pad = (value) => String(value).padStart(2, "0");

/**
 * The rail's foot: how long until the polls open, ticking.
 *
 * Every seat in the structure exists for that morning, so the rail keeps it in
 * view the way a project tool keeps a timer running. The clock starts after
 * mount: the server's "now" and the browser's would disagree by however long
 * the page took to arrive, and a hydration mismatch on a ticking number is
 * guaranteed.
 */
export default function Countdown() {
  const [now, setNow] = useState(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const left = now == null ? null : Math.max(0, new Date(election.date).getTime() - now);
  const days = left == null ? "--" : Math.floor(left / 86_400_000);
  const clock =
    left == null
      ? "--:--:--"
      : `${pad(Math.floor(left / 3_600_000) % 24)}:${pad(Math.floor(left / 60_000) % 60)}:${pad(Math.floor(left / 1000) % 60)}`;

  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-brand-950 p-5 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_0%,var(--color-brand-600)_0%,var(--color-brand-800)_45%,var(--color-brand-950)_100%)]"
      />
      {/* Contour lines, the texture the reference's dark cards carry. */}
      <svg aria-hidden="true" viewBox="0 0 200 200" className="absolute -right-16 -bottom-20 -z-10 size-64 text-white/10">
        {[30, 50, 70, 90, 110].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeWidth="1.25" />
        ))}
      </svg>

      <p className="flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.08em] text-ember-300 uppercase">
        <span className="relative flex size-2">
          <span className="absolute inset-0 rounded-full bg-ember-400 motion-safe:animate-ping" />
          <span className="relative size-2 rounded-full bg-ember-400" />
        </span>
        Election day
      </p>

      <p className="mt-3 font-display leading-none font-bold tracking-[-0.03em] tabular-nums" aria-live="off">
        <span className="text-[2.5rem]">{days}</span>
        <span className="ml-1 text-[1rem] font-semibold text-white/60">days</span>
      </p>
      <p className="mt-1.5 font-display text-[1.25rem] font-semibold tracking-[-0.01em] text-white/85 tabular-nums">
        {clock}
      </p>
      <p className="mt-2 text-[0.75rem] text-white/55">{election.day}</p>

      <Link
        href="/admin/results"
        className="mt-5 flex h-11 items-center justify-center gap-2 rounded-full bg-white text-[0.875rem] font-semibold text-brand-900 transition-colors hover:bg-ember-100"
      >
        <Radio size={16} strokeWidth={2.25} aria-hidden="true" />
        Live results
      </Link>
    </div>
  );
}
