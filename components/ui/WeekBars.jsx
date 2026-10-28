import { cn } from "@/lib/utils";

/* A hatched surface: "nothing here" drawn as a texture rather than a blank,
   so an empty day still holds its place in the week instead of vanishing. */
const HATCH =
  "bg-[repeating-linear-gradient(135deg,var(--color-ink-300)_0_2px,transparent_2px_8px)]";

const dayLetter = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-NG", { weekday: "narrow", timeZone: "UTC" });
const dayName = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

/**
 * The last seven days of arrivals, one pill per day.
 *
 * ── WHY SEVEN PILLS AND NOT NINETY DAYS OF LINE ────────────────────────────
 * The question a coordinator brings to this card is "is it working this
 * week?", and a cumulative line answers a different one. Seven bars can be
 * read in the time it takes to glance: which day was best, which days were
 * dead, and whether today has started. The full history is one click away on
 * the analytics page for the reader who wants it.
 *
 * Height is the count. The best day is the darkest, so the eye goes to it
 * first; today is the lightest and carries its number, because "how many so
 * far today" is the question asked most. A day with nobody is hatched at a
 * fixed height rather than drawn as nothing — a missing bar reads as missing
 * data, a textured one reads as a quiet day.
 *
 * The bars are decoration to a screen reader; the list underneath them in
 * the markup is the data.
 */
export default function WeekBars({ data, className }) {
  const week = (data ?? []).slice(-7);
  if (!week.length) return null;

  const max = Math.max(...week.map((day) => day.joined), 1);
  const best = week.reduce((top, day) => (day.joined > top.joined ? day : top), week[0]);
  const total = week.reduce((sum, day) => sum + day.joined, 0);

  return (
    <figure className={className}>
      <div aria-hidden="true" className="flex h-52 items-end justify-between gap-2 sm:gap-3.5">
        {week.map((day, index) => {
          const today = index === week.length - 1;
          const empty = day.joined === 0;
          const top = !empty && day.date === best.date;

          return (
            <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end">
              {(today || top) && !empty && (
                /* A flag on a stem with a dot at its foot, pinned to the top
                   of the bar it labels. */
                <span className="mb-1 flex flex-col items-center">
                  <span className="rounded-lg border border-brand-200 bg-white px-2 py-0.5 text-[0.75rem] font-semibold text-brand-700 shadow-e1 tabular-nums">
                    {day.joined}
                  </span>
                  <span className="h-2 w-px bg-brand-300" />
                  <span className="size-2 rounded-full border-2 border-white bg-brand-600 shadow-e1" />
                </span>
              )}
              <div
                className={cn(
                  "w-full max-w-18 rounded-full transition-[height] duration-700 ease-out-quart",
                  empty
                    ? cn(HATCH, "border border-ink-200")
                    : top
                      ? "bg-brand-900"
                      : today
                        ? "bg-brand-400"
                        : "bg-brand-600"
                )}
                style={{ height: empty ? "38%" : `${Math.max(22, (day.joined / max) * 100)}%` }}
              />
            </div>
          );
        })}
      </div>

      <div aria-hidden="true" className="mt-3 flex justify-between gap-2 sm:gap-3">
        {week.map((day, index) => (
          <span
            key={day.date}
            className={cn(
              "flex-1 text-center text-[0.8125rem]",
              index === week.length - 1 ? "font-semibold text-ink-950" : "text-ink-400"
            )}
          >
            {dayLetter(day.date)}
          </span>
        ))}
      </div>

      <figcaption className="sr-only">
        {total} joined in the last seven days.
        <ul>
          {week.map((day) => (
            <li key={day.date}>
              {dayName(day.date)}: {day.joined}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
