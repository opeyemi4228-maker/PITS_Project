"use client";

import { useMemo, useState } from "react";
import { Calendar, CalendarPlus, MapPin } from "lucide-react";

import JoinCta from "@/components/JoinCta";
import { cn } from "@/lib/utils";
import { activities, activityTypes } from "@/lib/activities";
import { zones } from "@/lib/map";

/**
 * The activity calendar.
 *
 * ── ON THE FILTERS ─────────────────────────────────────────────────────────
 * The zone and type selects are drawn only when there is something to filter.
 * Two dropdowns and a tab bar over an empty set is three decisions offered in
 * exchange for nothing — the visitor pays the cost of reading them, tries one,
 * and finds the same empty state underneath. Worse, controls over an emptiness
 * imply the emptiness is the visitor's fault: that they have filtered the
 * events away and could filter them back. They cannot. So until the Secretariat
 * files an activity, this is a tab bar and an honest sentence.
 * ───────────────────────────────────────────────────────────────────────────
 */
export default function ActivityCalendar() {
  const [tab, setTab] = useState("upcoming");
  const [zone, setZone] = useState("All zones");
  const [type, setType] = useState("All types");

  const visible = useMemo(
    () =>
      activities.filter(
        (activity) =>
          activity.tense === tab &&
          (zone === "All zones" || activity.zone === zone) &&
          (type === "All types" || activity.type === type)
      ),
    [tab, zone, type]
  );

  const filterable = activities.length > 0;
  const filtered = zone !== "All zones" || type !== "All types";

  return (
    <div className="mt-12">
      {/* ---------------------------------------------------------- tabs */}
      <div
        role="tablist"
        aria-label="Activity timeframe"
        className="flex border-b border-hairline"
      >
        {[
          { id: "upcoming", label: "Upcoming" },
          { id: "past", label: "Past" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls="activity-panel"
            onClick={() => setTab(item.id)}
            className={cn(
              "relative -mb-0.5 min-h-11 px-6 py-3.5 text-[0.8125rem] font-medium transition-colors duration-200",
              tab === item.id ? "text-ink-950" : "text-content-subtle hover:text-brand-700"
            )}
          >
            {item.label}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 -bottom-0.5 h-1 origin-center bg-ember-500 transition-transform duration-300 ease-out-quart",
                tab === item.id ? "scale-x-100" : "scale-x-0"
              )}
            />
          </button>
        ))}
      </div>

      {/* -------------------------------------------------------- filters */}
      {filterable && (
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="zone-filter"
              className="block text-[0.8125rem] font-medium text-ink-500"
            >
              Zone
            </label>
            <select
              id="zone-filter"
              value={zone}
              onChange={(event) => setZone(event.target.value)}
              className="mt-2.5 h-12 w-full border-2 border-ink-200 bg-white px-4 font-display text-[0.875rem] font-bold text-ink-950 transition-colors focus:border-brand-600 focus:outline-none"
            >
              <option>All zones</option>
              {zones.map((item) => (
                <option key={item.code}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="min-w-0 flex-1">
            <label
              htmlFor="type-filter"
              className="block text-[0.8125rem] font-medium text-ink-500"
            >
              Activity type
            </label>
            <select
              id="type-filter"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="mt-2.5 h-12 w-full border-2 border-ink-200 bg-white px-4 font-display text-[0.875rem] font-bold text-ink-950 transition-colors focus:border-brand-600 focus:outline-none"
            >
              <option>All types</option>
              {activityTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- results */}
      <div id="activity-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-10">
        {/* Changing a select rewrites the list silently for anyone not looking
            at it. This says what happened, to screen readers only. */}
        {filterable && (
          <p aria-live="polite" className="sr-only">
            {visible.length} {tab}{" "}
            {visible.length === 1 ? "activity" : "activities"}
            {filtered ? " matching the current filters" : ""}.
          </p>
        )}

        {visible.length > 0 ? (
          <ul className="grid tiles md:grid-cols-2 lg:grid-cols-3">
            {visible.map((activity) => (
              <li key={activity.slug} className="bg-white">
                <article className="flex h-full flex-col p-6">
                  <span className="self-start bg-brand-50 px-2.5 py-1 text-[0.8125rem] font-medium text-brand-700">
                    {activity.type}
                  </span>
                  <h3 className="mt-4 font-display text-lg leading-snug font-semibold tracking-tight text-ink-950">
                    {activity.title}
                  </h3>
                  <dl className="mt-4 space-y-2 text-[0.875rem] text-content-muted">
                    <div className="flex items-center gap-2.5">
                      <dt className="sr-only">Date</dt>
                      <Calendar size={15} aria-hidden="true" className="shrink-0 text-ink-400" />
                      <dd>{activity.date}</dd>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <dt className="sr-only">Venue</dt>
                      <MapPin size={15} aria-hidden="true" className="shrink-0 text-ink-400" />
                      <dd>
                        {activity.venue}, {activity.state}
                      </dd>
                    </div>
                  </dl>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="border-2 border-dashed border-ink-200 px-6 py-20 text-center">
            <CalendarPlus
              size={32}
              strokeWidth={1.5}
              aria-hidden="true"
              className="mx-auto text-ink-300"
            />
            <h3 className="mt-6 font-display text-lg font-semibold tracking-tight text-ink-950">
              {filtered
                ? "Nothing matches those filters"
                : `No ${tab} activities listed yet`}
            </h3>
            <p className="prose-body mx-auto mt-3 max-w-md text-[0.9375rem]">
              {filtered
                ? "Widen the zone or the activity type to see more of the calendar."
                : tab === "upcoming"
                  ? "Congresses, rallies and registration drives appear here as coordinators schedule them. Members are notified in advance and can RSVP."
                  : "Past activities are published with their photographs and attendance figures once the organising officer files the report."}
            </p>
            <div className="mt-8">
              {filtered ? (
                <button
                  type="button"
                  onClick={() => {
                    setZone("All zones");
                    setType("All types");
                  }}
                  className="min-h-11 border-2 border-ink-950 px-6 text-[0.8125rem] font-medium text-ink-950 transition-colors duration-200 hover:bg-night hover:text-white"
                >
                  Clear filters
                </button>
              ) : (
                <JoinCta label="Join to be notified" variant="primary" size="md" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
