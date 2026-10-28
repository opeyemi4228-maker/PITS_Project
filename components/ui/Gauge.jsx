import { useId } from "react";

/**
 * One proportion as a half ring, with the number in the middle.
 *
 * The filled part is solid green and the rest is hatched, not grey: grey reads
 * as "disabled", a texture reads as "not yet". At the 2% a new territory
 * starts on, the arc is a short stub rather than nothing, so the reader sees a
 * beginning rather than a broken chart — the same reason coverage was never a
 * bare percentage on this dashboard.
 */
export default function Gauge({ value, label, legend, className }) {
  const id = useId().replace(/:/g, "");
  const shown = Math.min(100, Math.max(0, value));
  const arc = "M 24 120 A 96 96 0 0 1 216 120";

  return (
    <figure className={className}>
      <div className="relative mx-auto max-w-72">
        <svg viewBox="0 0 240 132" className="w-full" role="img" aria-label={`${label}: ${shown}%`}>
          <defs>
            <pattern id={`hatch-${id}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="white" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--color-ink-300)" strokeWidth="3" />
            </pattern>
          </defs>
          <path d={arc} fill="none" stroke={`url(#hatch-${id})`} strokeWidth="34" strokeLinecap="round" />
          {shown > 0 && (
            <path
              d={arc}
              fill="none"
              stroke="var(--color-brand-700)"
              strokeWidth="34"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray={`${Math.max(shown, 1.5)} 100`}
            />
          )}
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="font-display text-[2.75rem] leading-none font-bold tracking-[-0.03em] text-ink-950 tabular-nums">
            {shown}%
          </p>
          <p className="mt-1 text-[0.8125rem] text-content-subtle">{label}</p>
        </div>
      </div>

      {legend && (
        <figcaption className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.8125rem] text-ink-600">
          {legend.map((item) => (
            <span key={item.label} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={
                  item.hatched
                    ? "size-3.5 rounded-full border border-ink-300 bg-[repeating-linear-gradient(135deg,var(--color-ink-300)_0_1.5px,transparent_1.5px_4px)]"
                    : "size-3.5 rounded-full bg-brand-700"
                }
              />
              {item.label}
              {item.value != null && (
                <span className="font-semibold text-ink-950 tabular-nums">{item.value}</span>
              )}
            </span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
