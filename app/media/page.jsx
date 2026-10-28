import React from "react";
import { ArrowRight, Camera, Images, ShieldCheck, Upload } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/Section";
import VideoCard, { VideoSlot } from "@/components/VideoCard";
import ActivityCalendar from "@/components/media/ActivityCalendar";
import MediaNav from "@/components/media/MediaNav";
import { activities } from "@/lib/activities";
import { SLOTS, videoCategories, videoGrid, videos } from "@/lib/videos";

export const metadata = {
  title: "Media",
  description:
    "What PITS has scheduled, and what it looked like: congresses, rallies and mobilisation drives across Nigeria, with the photographs and footage from them.",
};

/* No albums are listed. §5.1 of the platform plan is explicit that this site
   uses real PITS event photography only: "no stock imagery of Nigerians,
   visitors detect it instantly and it damages credibility". Seeding this page
   with Unsplash crowds to make it look populated would break exactly the rule
   the gallery exists to honour. Albums appear as the Media directorate uploads
   and moderates them. */
const albums = [];

/**
 * Media: the activity, and the record of it.
 *
 * ── WHY THESE THREE ARE ONE PAGE ───────────────────────────────────────────
 * Activities, Gallery and Videos were three routes describing one object at
 * three moments of its life: a rally is scheduled, then it happens, then it
 * exists as photographs and footage. Split across three pages, a visitor who
 * remembers *the Kano congress* and wants to know what happened there has to
 * guess in advance which of the three holds it — and the answer depends on
 * something they cannot know, namely whether anyone brought a camera.
 *
 * Together they read as one narrative in time order: what is coming, what it
 * looked like, what was said. The anchors — #activities, #photographs, #video —
 * keep each addressable, and the old routes redirect onto them, so nothing that
 * was ever linked or shared breaks.
 *
 * ── ON THE EMPTY STATES ────────────────────────────────────────────────────
 * All three datasets are currently empty, and that is the hardest thing about
 * this page. Three stacked dashed rectangles do not read as "new"; they read as
 * abandoned, and a movement's site that looks abandoned undoes the argument it
 * is making merely by loading. The project's own rules forbid the usual escape
 * — no stock photography, no invented rallies — so the answer has to come from
 * arrangement instead:
 *
 *   · one full empty state, not three. Activities gets the large one with the
 *     action attached, because it is the one with a next step for the visitor;
 *     photographs states its case in a sentence and hands off to the calendar.
 *   · the video slots stay, because they are not an empty state. They are the
 *     page's finished shape, drawn early.
 *   · the page ends on the process, not on a void. Peak–end: what a visitor
 *     carries away from a page is its strongest moment and its last one, and
 *     "here is how this fills up, and who fills it" is a far better last
 *     impression than a dashed border.
 *
 * ── SERVER SHELL, CLIENT ISLANDS ───────────────────────────────────────────
 * This file is a server component and stays static. Only the two pieces that
 * genuinely need the browser — the calendar's filtering and the rail's
 * scrollspy — ship as client components. Merging three pages into one is not a
 * licence to send three pages' worth of JavaScript to a phone on mobile data.
 * ───────────────────────────────────────────────────────────────────────────
 */
export default function Media() {
  const grid = videoGrid(SLOTS);

  const sections = [
    { id: "activities", label: "Activities", count: activities.length },
    { id: "photographs", label: "Photographs", count: albums.length },
    { id: "video", label: "Video", count: videos.length },
  ];

  return (
    <>
      <PageHeader
        breadcrumb="Media"
        kicker="The movement in the field"
        title="What we are doing, and what it looked like"
        lead="Every congress, rally and mobilisation drive PITS convenes. Each is listed with its date, its venue and the officer who called it, then photographed and filmed once it has happened."
      />

      <MediaNav sections={sections} />

      {/* ----------------------------------------------------- activities
          First, because it is the only section with a future tense in it. A
          visitor who can still attend something is worth more to the movement
          than one who can only look at what they missed, and the page should
          meet them with the thing they can still act on. */}
      <Section
        id="activities"
        className="scroll-mt-[calc(var(--masthead-offset,0px)_+_3.5rem)] bg-white"
      >
        <SectionHeading
          index={1}
          eyebrow="The calendar"
          title="Rallies, congresses and ward mobilisation"
          lead="PITS organises in public. Every congress, town hall and registration drive is listed here before it happens, and reported here after."
        />

        <ActivityCalendar />
      </Section>

      {/* ---------------------------------------------------- photographs */}
      <Section
        id="photographs"
        className="scroll-mt-[calc(var(--masthead-offset,0px)_+_3.5rem)] border-t border-ink-200"
      >
        <SectionHeading
          index={2}
          eyebrow="Photographs"
          title="Filed by event and by state"
          lead="Photography from PITS' own events only: ward congresses, rallies and community engagements. Every photograph is credited to its photographer and filed by state. Nothing stock, nothing borrowed."
        />

        {albums.length > 0 ? (
          <ul className="mt-14 grid tiles sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <li key={album.slug} className="bg-white p-6">
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink-950">
                  {album.title}
                </h3>
                <p className="prose-body mt-2 text-[0.9375rem]">
                  {album.state} · {album.date} · {album.count} photographs
                </p>
              </li>
            ))}
          </ul>
        ) : (
          /* Deliberately a band rather than the tall dashed box this used to
             be. It sits between two sections that both carry weight, and a
             second cavernous placeholder in the middle of the page would make
             the whole thing sag. Says the same thing in a third of the height,
             and points at the calendar rather than dead-ending. */
          <div className="mt-14 flex flex-col gap-6 border-2 border-ink-950 bg-white p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
            <Images
              size={30}
              strokeWidth={1.5}
              aria-hidden="true"
              className="shrink-0 text-ember-600"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink-950">
                The first albums are being prepared
              </h3>
              <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-content-muted">
                Albums appear here as coordinators upload them and the Media
                directorate clears them, each one tied to the activity it came
                from.
              </p>
            </div>
            <Button
              href="#activities"
              variant="outline"
              size="md"
              className="shrink-0 self-start sm:self-auto"
            >
              See what&rsquo;s scheduled
              <ArrowRight size={16} strokeWidth={2.75} />
            </Button>
          </div>
        )}
      </Section>

      {/* ---------------------------------------------------------- video */}
      <Section
        id="video"
        className="border-t border-ink-200 scroll-mt-[calc(var(--masthead-offset,0px)_+_3.5rem)] bg-white"
      >
        <SectionHeading
          index={3}
          eyebrow="Watch"
          title="On the record"
          lead="Speeches, rallies and footage from the field. What the candidate and the movement have said, in their own words, rather than a paraphrase of it."
        />

        {videoCategories.length > 1 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {videoCategories.map((category) => (
              <span
                key={category}
                className="border-2 border-ink-200 px-4 py-2 text-[0.8125rem] font-medium text-ink-600"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Every video there is, then labelled slots to make the count up. The
            slots are not a loading state and are not pretending to be one —
            each disappears the moment a video takes its place, so the section
            resolves gradually rather than switching from placeholder to content
            in one jump. Nothing here needs deleting when the footage lands. */}
        <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((entry, index) => (
            <Reveal as="li" key={entry.video?.slug ?? `slot-${entry.slot}`} delay={index * 60}>
              {entry.video ? (
                <VideoCard video={entry.video} priority={index < 3} />
              ) : (
                <VideoSlot index={entry.slot} />
              )}
            </Reveal>
          ))}
        </ul>

        {videos.length === 0 && (
          /* This used to print upload instructions — the directory to drop the
             files in, the file to edit. That is a note to whoever builds the
             site, and it was being shown to voters. It now lives where the
             person who needs it will actually be, which is the top of
             lib/videos.js. What stands here is for the audience. */
          <p className="mt-10 max-w-prose text-[0.9375rem] leading-relaxed text-content-muted">
            The slots above are held for footage now being cut. Video comes from
            the movement&rsquo;s official channel and loads only when you press
            play, so nothing downloads until you ask for it.
          </p>
        )}
      </Section>

      {/* ------------------------------------------------------ the process
          One lifecycle, where there used to be two near-identical three-up
          grids on two different pages — one explaining how activities get
          published, one explaining how photographs do. They were always the
          same three steps: a coordinator convenes it, the tier above clears it,
          the record is filed afterwards. The photographs and the footage *are*
          step three, which is the clearest argument there is for these having
          been one page all along. */}
      <Section className="bg-night">
        <SectionHeading
          index={4}
          eyebrow="How this page fills up"
          title="Convened locally, verified upward"
          lead="Nothing appears here because head office decided it should. Every entry starts with a coordinator in the territory it happened in."
          tone="inverse"
        />

        <div className="mt-14 grid gap-px bg-white/15 md:grid-cols-3">
          {[
            {
              step: "01",
              icon: Camera,
              title: "Convened by a coordinator",
              body: "Any officer at LGA level or above can schedule an activity and upload the photography from it. They can only do so within the territory they are responsible for.",
            },
            {
              step: "02",
              icon: ShieldCheck,
              title: "Cleared before it appears",
              body: "Activities are published once approved by the tier above. Every photograph enters a queue reviewed by the Assistant Director of Media before anyone outside the movement sees it.",
            },
            {
              step: "03",
              icon: Upload,
              title: "Reported afterwards",
              body: "Attendance, photographs and footage are filed against the activity they came from, feeding the movement's mobilisation reports as well as this page.",
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.step} delay={index * 80} className="bg-night">
                <div className="flex h-full flex-col p-6 sm:p-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-fluid-2xl font-semibold tracking-[-0.03em] text-white/20 tabular-nums">
                      {item.step}
                    </span>
                    <Icon
                      size={24}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className="shrink-0 self-center text-ember-400"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-white/70">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>
    </>
  );
}
