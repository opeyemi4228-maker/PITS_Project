import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  CreditCard,
  Crown,
  MapPin,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";

import Avatar from "@/components/ui/Avatar";
import PhotoUploader from "@/components/PhotoUploader";
import ReferralHero from "@/components/ReferralHero";
import SignOutForm from "@/components/SignOutForm";
import { StatTile } from "@/app/admin/ui";
import Checklist, { nextStep } from "./Checklist";
import ConfirmPhone from "./ConfirmPhone";
import VerifyCard from "./VerifyCard";
import StandForOffice from "./StandForOffice";

const LAGOS = "Africa/Lagos";

const shortDate = (value) =>
  new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", timeZone: LAGOS }).format(
    new Date(value)
  );

function CardTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-lg font-semibold tracking-[-0.01em] text-ink-950">{children}</h2>
      {action}
    </div>
  );
}

/**
 * The member dashboard (§3.3, /portal).
 *
 * Where signing in lands for everybody — deliberately not /admin, which most
 * members have no seat for.
 *
 * ── THE ONE RULE ───────────────────────────────────────────────────────────
 * A member opens this page to check three things: that they are in, whether
 * anything is missing, and how to bring somebody else in. The page answers
 * those three in its first two rows, in that order, in as few words as it
 * can. Everything a card used to explain in a paragraph is now a label or
 * gone; what could not be cut sits in the card it belongs to, next to the
 * control it explains.
 *
 * ── THE ORDER ──────────────────────────────────────────────────────────────
 *   row 1   who you are (verification included) · the number you are proudest of
 *   row 2   the next step · the people you brought in · your code
 *   row 3   your details: photo, phone, NIN — minus the one the next-step
 *           card is holding, because every form appears exactly once
 *   row 4   office and ward, the reference material
 *
 * The next-step card is the only place that asks for anything, and it asks
 * for one thing: the cheapest one still outstanding (see Checklist), with the
 * form to do it right there in the card. The row below never repeats it.
 */
export default function PortalView({ member, scope, referrals, brought, vacancies, applications }) {
  const verified = member.verification === "VERIFIED";
  const total = referrals?.total ?? 0;
  const firstName = member.name.split(" ")[0];
  const done = {
    photo: Boolean(member.photoUrl),
    phone: member.phoneVerified,
    nin: verified,
    referral: total > 0,
  };
  const next = nextStep(done);
  const complete = !next;

  /* Each form exists once on the page. Whichever step is next lives inside
     the next-step card; the row further down draws the others. */
  const photoForm = <PhotoUploader name={member.name} photoUrl={member.photoUrl} />;
  const phoneForm = <ConfirmPhone phone={member.phone} bare />;
  const ninForm = <VerifyCard verified={verified} hasNin={member.hasNin} bare />;

  const details = [
    next?.key !== "photo" && (
      <section key="photo" id="photograph" className="scroll-mt-24 rounded-3xl bg-white p-6">
        <CardTitle>Your photo</CardTitle>
        <div className="mt-5">{photoForm}</div>
      </section>
    ),
    next?.key !== "phone" &&
      (member.phoneVerified ? (
        <section key="phone" id="phone" className="flex scroll-mt-24 flex-col rounded-3xl bg-white p-6">
          <CardTitle>Your phone</CardTitle>
          <span className="mt-6 grid size-12 place-items-center rounded-full bg-brand-50 text-brand-700">
            <PhoneCall size={22} strokeWidth={2} aria-hidden="true" />
          </span>
          <p className="mt-4 text-xl font-semibold text-ink-950 tabular-nums">{member.phone}</p>
          <p className="mt-1 text-[0.875rem] text-content-subtle">
            Confirmed. This is how your ward reaches you.
          </p>
        </section>
      ) : (
        <div key="phone" id="phone" className="scroll-mt-24">
          <ConfirmPhone phone={member.phone} />
        </div>
      )),
    next?.key !== "nin" && (
      <div key="nin" id="verification" className="scroll-mt-24">
        <VerifyCard verified={verified} hasNin={member.hasNin} />
      </div>
    ),
  ].filter(Boolean);

  return (
    <main className="mx-auto max-w-352 space-y-4 pt-8 pb-10 sm:pt-10">
      {/* ── Title ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5 px-1 pb-2">
        <div className="min-w-0">
          <h1 className="font-display text-[2.25rem] font-bold tracking-[-0.025em] text-ink-950 sm:text-[2.75rem] leading-[1.05]">
            Hello, {firstName}
          </h1>
          <p className="mt-2 text-[0.9375rem] text-content-subtle">Your membership at a glance.</p>
        </div>
        <Link
          href="/portal/id-card"
          className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-800"
        >
          <CreditCard size={18} strokeWidth={2} aria-hidden="true" />
          My membership card
        </Link>
      </div>

      {/* ── Row 1: you · your number · verification ────────────────────── */}
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:grid-cols-12">
        <section
          aria-label="Your membership"
          className="rounded-3xl bg-white p-6 xl:col-span-8"
        >
          <div className="flex items-center gap-5">
            <Avatar
              name={member.name}
              src={member.photoUrl}
              size="lg"
              ring={false}
              className="rounded-full"
            />
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold tracking-[-0.02em] text-ink-950">
                {member.name}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {/* The number is the one thing on this page they may have to
                    read out loud, so it is the darkest thing on the card. */}
                <span className="rounded-full bg-night px-3 py-1 text-[0.8125rem] font-semibold text-white tabular-nums">
                  {member.membershipNo ?? "Number pending"}
                </span>
                {/* Verification lives here as a status and in exactly one
                    form elsewhere — never as a third, separate figure. */}
                {verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[0.75rem] font-semibold text-brand-700">
                    <BadgeCheck size={14} strokeWidth={2.5} aria-hidden="true" />
                    Verified
                  </span>
                ) : (
                  <a
                    href="#verification"
                    className="inline-flex items-center gap-1 rounded-full bg-ember-50 px-2.5 py-1 text-[0.75rem] font-semibold text-ember-700 hover:bg-ember-100"
                  >
                    <ShieldAlert size={14} strokeWidth={2.5} aria-hidden="true" />
                    Not verified
                  </a>
                )}
                {scope && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ember-50 px-2.5 py-1 text-[0.75rem] font-semibold text-ember-700">
                    <Crown size={13} strokeWidth={2.5} aria-hidden="true" />
                    {scope.roleTitle}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Where they vote: half of what a membership record is. */}
          {/* Rows on a phone, three across once there is room: a ward name
              truncated to "Rumuo…" is not a place anybody can check. */}
          <dl className="mt-6 grid gap-2 sm:grid-cols-3">
            {[
              ["Ward", member.ward],
              ["LGA", member.lga],
              ["State", member.state],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex min-w-0 items-baseline justify-between gap-4 rounded-2xl bg-ink-50 px-4 py-3 sm:block"
              >
                <dt className="shrink-0 text-[0.75rem] text-content-subtle">{label}</dt>
                <dd className="min-w-0 truncate text-right text-[0.9375rem] font-semibold text-ink-950 sm:mt-0.5 sm:text-left">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="xl:col-span-4 [&>*]:h-full">
          <StatTile
            hero
            label="People you brought in"
            value={total}
            sub={referrals?.recent ? `${referrals.recent} this month` : "Share your code to start"}
            href="#referrals"
          />
        </div>

      </div>

      {/* ── Row 2: next step · your people · your code ─────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
        {complete ? (
          /* Finished: the slot the request used to hold says so once, calmly. */
          <section className="flex flex-col rounded-3xl bg-white p-6 xl:col-span-4">
            <CardTitle>You&rsquo;re all set</CardTitle>
            <span className="mt-6 grid size-12 place-items-center rounded-full bg-brand-50 text-brand-700">
              <ShieldCheck size={24} strokeWidth={2} aria-hidden="true" />
            </span>
            <p className="mt-4 font-display text-[1.625rem] font-bold tracking-tight text-brand-800 leading-[1.15]">
              Your membership is complete
            </p>
            <p className="mt-2 text-[0.875rem] text-content-subtle">
              Photo, phone and NIN are done, and you&rsquo;ve brought people in.
            </p>
          </section>
        ) : (
          <Checklist
            className="xl:col-span-4"
            done={done}
            forms={{ photo: photoForm, phone: phoneForm, nin: ninForm }}
          />
        )}

        <section
          id="referrals"
          className="flex scroll-mt-24 flex-col rounded-3xl bg-white p-6 xl:col-span-5"
        >
          <CardTitle
            action={
              total > 0 && (
                <span className="rounded-full bg-ink-50 px-3 py-1 text-[0.8125rem] font-medium text-ink-600 tabular-nums">
                  {total.toLocaleString()} total
                </span>
              )
            }
          >
            People you brought in
          </CardTitle>

          {brought.length > 0 ? (
            <ul className="mt-5 space-y-4">
              {brought.map((person) => (
                <li key={person.id} className="flex items-center gap-3.5">
                  <Avatar
                    name={person.name}
                    src={person.photoUrl}
                    size="md"
                    ring={false}
                    className="rounded-full"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.9375rem] font-medium text-ink-950">
                      {person.name}
                    </span>
                    <span className="block truncate text-[0.8125rem] text-content-subtle">
                      {person.ward} · joined {shortDate(person.joinedAt)}
                    </span>
                  </span>
                  {person.referrals > 0 && (
                    <span className="shrink-0 rounded-md border border-brand-200 bg-brand-50 px-2 py-0.5 text-[0.6875rem] font-medium text-brand-700">
                      +{person.referrals} of their own
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-ink-50 text-ink-400">
                <Users size={22} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <p className="mt-4 text-[0.9375rem] font-semibold text-ink-950">Nobody yet</p>
              <p className="mt-1 max-w-xs text-[0.875rem] text-content-subtle">
                Share your code with one person this week. Everyone who joins with it appears here.
              </p>
            </div>
          )}
        </section>

        <ReferralHero code={member.referralCode} className="min-h-64 md:col-span-2 xl:col-span-3" />
      </div>

      {/* ── Row 3: your details, minus whichever one the card above holds ── */}
      <div
        className={
          details.length === 3
            ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            : "grid gap-4 md:grid-cols-2"
        }
      >
        {details}
      </div>

      {/* ── Row 4: office and ward ─────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {scope ? (
          <section className="flex flex-col rounded-3xl bg-white p-6">
            <CardTitle>Your office</CardTitle>
            <p className="mt-5 font-display text-[1.625rem] font-bold tracking-tight text-brand-800 leading-[1.15]">
              {scope.roleTitle}
            </p>
            <p className="mt-1 text-[0.875rem] text-content-subtle">{scope.label}</p>
            <div className="mt-auto pt-6">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-800"
              >
                Open the secretariat
                <ArrowUpRight size={17} strokeWidth={2.25} aria-hidden="true" />
              </Link>
            </div>
          </section>
        ) : (
          /* Not drawn for an office holder: the lookup above never runs for
             them, and the card would announce "no vacancy" on the strength of
             a query that did not happen. */
          <div className="[&>div]:h-full">
            <StandForOffice vacancies={vacancies} applications={applications} />
          </div>
        )}

        <section className="flex flex-col rounded-3xl bg-white p-6">
          <CardTitle>Where you vote</CardTitle>
          <div className="mt-5 flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-ink-50 text-brand-700">
              <MapPin size={22} strokeWidth={2} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[0.9375rem] font-semibold text-ink-950">{member.ward} Ward</p>
              <p className="text-[0.875rem] text-content-subtle">
                {member.lga}, {member.state}
              </p>
            </div>
          </div>
          <p className="mt-4 text-[0.875rem] leading-relaxed text-content-subtle">
            Your ward is where you appear in the register and where you can be appointed. Moving
            needs a transfer approved by the receiving LGA Coordinator.
          </p>
          {referrals?.invitedBy && (
            <p className="mt-3 text-[0.875rem] text-content-subtle">
              Invited by{" "}
              <span className="font-semibold text-ink-950">{referrals.invitedBy.name}</span>
            </p>
          )}
        </section>
      </div>

      {/* ── Account ───────────────────────────────────────────────────── */}
      <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-3xl bg-white px-6 py-4">
        <p className="text-[0.875rem] text-content-subtle">
          Signed in as{" "}
          <span className="font-semibold text-ink-950 tabular-nums">{member.phone}</span>
          {member.email && <span className="max-sm:hidden"> · {member.email}</span>}
        </p>
        <p className="flex items-center gap-2 text-[0.8125rem] text-content-subtle">
          <ShieldCheck size={16} className="shrink-0 text-brand-600" aria-hidden="true" />
          PITS never asks for payment to join, to serve, or to stay.
        </p>
        <SignOutForm>
          <button
            type="submit"
            className="rounded-full border border-ink-300 px-5 py-2 text-[0.875rem] font-semibold text-ink-950 transition-colors hover:border-red-600 hover:text-red-600"
          >
            Sign out
          </button>
        </SignOutForm>
      </footer>
    </main>
  );
}
