"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleAlert,
  Copy,
  Eye,
  EyeOff,
  IdCard,
  Loader2,
  MessageCircle,
  Plus,
} from "lucide-react";
import AuthShell, { fieldClass } from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { states } from "@/lib/geography";
import { useGeography } from "@/lib/useGeography";
import { normalisePhone } from "@/lib/phone";
import { site } from "@/lib/site";

/* ════════════════════════════════════════════════════════════════════════════
   JOINING, ON ONE SCREEN.

   Six required fields and one button: who you are (name, phone, password) and
   where you vote (state, LGA, ward). That is everything the register needs to
   place a member, and nothing else is asked for up front.

     · No steps. Three screens of Continue and Back were three chances to leave.
     · No "confirm password". The eye toggle shows what was typed, and the live
       checks under it say when it is good enough, before anything is sent.
     · NIN is not here. The portal asks for it as its own step (Checklist.jsx),
       once the member is in and has a reason to trust the site with it.
     · Optional extras keep out of the way: the polling unit appears only once
       a ward is chosen, and email and referral code sit behind a link each. A
       shared /join?ref= link opens and fills the referral field by itself.
     · A half-finished form survives a refresh (sessionStorage, never the
       password), because on a slow connection a reload is not a decision to
       start again.
   ════════════════════════════════════════════════════════════════════════ */

const POINTS = [
  "Free, and done in under a minute",
  "A permanent membership number, tied to the ward where you vote",
  "Your ward and LGA coordinators can find you in the register",
];

const EMPTY = {
  name: "",
  phone: "",
  password: "",
  state: "",
  lga: "",
  ward: "",
  pollingUnit: "",
  email: "",
  referralCode: "",
};

/* Everything except the password is worth keeping across a reload. */
const DRAFT_KEY = "pits:join-draft";
const DRAFTED = ["name", "phone", "state", "lga", "ward", "pollingUnit", "email", "referralCode"];

/* The order errors are focused in: top of the form first. */
const ORDER = ["name", "phone", "password", "state", "lga", "ward", "pollingUnit", "email", "referralCode"];

export default function Join() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [extras, setExtras] = useState({ email: false, referral: false });
  const [done, setDone] = useState(null);
  const restored = useRef(false);

  const referrer = useReferrer(form.referralCode);
  const geo = useGeography(form.state, form.lga, form.ward);

  /* Restore the draft and read ?ref= after mount, not in a lazy initialiser:
     the page is prerendered, and a first client render that differs from the
     server's would leave the inputs showing the server's empty values. */
  /* eslint-disable react-hooks/set-state-in-effect --
       Reading browser-only state (the URL, sessionStorage) once on mount is
       what an effect is for; there is no render-time source for it. */
  useEffect(() => {
    let draft = {};
    try {
      draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "{}");
    } catch {
      /* Private mode or a corrupt draft: start clean. */
    }
    const ref = new URLSearchParams(window.location.search).get("ref");
    const next = { ...EMPTY };
    for (const key of DRAFTED) if (typeof draft[key] === "string") next[key] = draft[key];
    if (ref) next.referralCode = ref.toUpperCase();

    setForm(next);
    setExtras({ email: Boolean(next.email), referral: Boolean(next.referralCode) });
    restored.current = true;
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!restored.current) return;
    try {
      const draft = Object.fromEntries(DRAFTED.map((key) => [key, form[key]]));
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* Storage blocked: the form still works, it just will not survive a reload. */
    }
  }, [form]);

  const set = (field) => (event) => {
    const value = event.target.value;
    setForm((previous) => {
      const next = { ...previous, [field]: value };
      // Changing a parent invalidates its children.
      if (field === "state") Object.assign(next, { lga: "", ward: "", pollingUnit: "" });
      if (field === "lga") Object.assign(next, { ward: "", pollingUnit: "" });
      if (field === "ward") next.pollingUnit = "";
      return next;
    });
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setNotice("");
  };

  const phoneValid = Boolean(normalisePhone(form.phone));
  const passwordLong = form.password.length >= 8;
  const passwordMixed = /[a-zA-Z]/.test(form.password) && /\d/.test(form.password);

  /* Mirrors lib/auth.js validateRegistration. The server is the authority;
     this only spares a round trip for the mistakes that can be seen here. */
  function check() {
    const found = {};
    if (form.name.trim().replace(/\s+/g, " ").length < 3) found.name = "Enter your full name.";
    if (!form.phone.trim()) found.phone = "Enter your mobile number.";
    else if (!phoneValid) found.phone = "Enter a valid Nigerian mobile number, like 0803 123 4567.";
    if (!passwordLong) found.password = "Use at least 8 characters.";
    else if (!passwordMixed) found.password = "Include at least one letter and one number.";
    if (!form.state) found.state = "Select your state.";
    if (!form.lga) found.lga = "Select your Local Government Area.";
    if (!form.ward) found.ward = "Select your ward.";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      found.email = "Enter a valid email address, or remove it.";
    if (form.referralCode.trim() && referrer.state === "unknown")
      found.referralCode = "No member holds that code. Check it, or clear it.";
    return found;
  }

  /* Put the cursor on the first thing to fix, opening its section if it is
     one of the folded extras. */
  function showErrors(found) {
    setErrors(found);
    if (found.email) setExtras((value) => ({ ...value, email: true }));
    if (found.referralCode) setExtras((value) => ({ ...value, referral: true }));
    const first = ORDER.find((key) => found[key]);
    if (first) requestAnimationFrame(() => document.getElementById(first)?.focus());
  }

  async function submit(event) {
    event.preventDefault();
    if (busy) return;

    const found = check();
    if (Object.keys(found).length) {
      showErrors(found);
      return;
    }

    setBusy(true);
    setNotice("");

    /* The selects hold names, because that is what a member recognises. The
       INEC codes travel with them, and are what the server resolves against. */
    const unit = geo.units.find((option) => option.value === form.pollingUnit);
    const payload = {
      ...form,
      wardCode: geo.wardCode,
      pollingUnit: unit?.name ?? "",
      pollingUnitCode: unit?.value ?? "",
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.errors) showErrors(data.errors);
        setNotice(data.error ?? (data.errors ? "" : "Something went wrong. Please try again."));
        return;
      }

      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {}
      setDone(data.member);
      window.scrollTo({ top: 0 });
    } catch {
      setNotice("Could not reach the server. Check your connection and try again. Nothing you typed has been lost.");
    } finally {
      setBusy(false);
    }
  }

  if (done) return <Welcome member={done} />;

  return (
    <AuthShell
      kicker="Membership is free"
      title="Join the movement"
      lead="Six quick details and you're in. It takes under a minute."
      points={POINTS}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.875rem] text-content-muted">Already a member?</p>
          <Link
            href="/login"
            className="group inline-flex h-11 items-center gap-2 rounded-full border border-ink-200 bg-white px-5 text-[0.875rem] font-semibold text-ink-950 shadow-e1 transition-colors hover:border-ink-950 hover:bg-night hover:text-white"
          >
            Sign in
            <ArrowRight
              size={14}
              strokeWidth={3}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      }
    >
      {notice && (
        <p
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-[0.875rem] leading-relaxed text-red-900"
        >
          <CircleAlert size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
          {notice}
        </p>
      )}

      {/* Invited by someone: say so first. It is the most reassuring line a
          stranger can read on this page. */}
      {referrer.state === "found" && (
        <p className="mb-6 flex items-center gap-2.5 rounded-xl bg-brand-50 px-4 py-3 text-[0.875rem] text-ink-950 ring-1 ring-brand-100">
          <BadgeCheck size={17} className="shrink-0 text-brand-600" aria-hidden="true" />
          <span>
            Invited by <strong className="font-semibold">{referrer.name}</strong>
          </span>
        </p>
      )}

      <form onSubmit={submit} noValidate>
        <Group title="About you">
          <Field
            id="name"
            label="Full name"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="next"
          />
          <Field
            id="phone"
            label="Mobile number"
            type="tel"
            inputMode="tel"
            placeholder="0803 123 4567"
            value={form.phone}
            onChange={set("phone")}
            error={
              errors.phone === "That number is already registered. Log in instead." ? (
                <>
                  That number is already registered.{" "}
                  <Link href="/login" className="underline underline-offset-2">
                    Sign in instead
                  </Link>
                </>
              ) : (
                errors.phone
              )
            }
            autoComplete="tel"
            enterKeyHint="next"
            hint="You sign in with this number."
            trailing={phoneValid ? <Tick /> : null}
          />
          <Field
            id="password"
            label="Choose a password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={set("password")}
            error={errors.password}
            autoComplete="new-password"
            enterKeyHint="next"
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="grid size-11 place-items-center rounded-lg text-ink-400 transition-colors hover:text-ink-950"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            below={
              !errors.password && (
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem]" aria-label="Password rules">
                  <Rule met={passwordLong}>8 or more characters</Rule>
                  <Rule met={passwordMixed}>A letter and a number</Rule>
                </ul>
              )
            }
          />
        </Group>

        <Group title="Where you vote" note="This places you in your ward's structure.">
          {/* Nobody types their ward. Each list is the INEC register for the
              tier above it, so the name in the record is INEC's own. */}
          <Select
            id="state"
            label="State"
            value={form.state}
            onChange={set("state")}
            error={errors.state}
            placeholder="Select your state"
            options={states.map((entry) => entry.name)}
          />
          <Select
            id="lga"
            label="Local Government Area"
            value={form.lga}
            onChange={set("lga")}
            error={errors.lga}
            placeholder={!form.state ? "Choose a state first" : geo.loading ? "Loading LGAs…" : "Select your LGA"}
            options={geo.lgas}
            disabled={!form.state || !geo.ready}
            hint={geo.error ? "Could not load the LGA list. Check your connection and pick your state again." : undefined}
          />
          <Select
            id="ward"
            label="Ward"
            value={form.ward}
            onChange={set("ward")}
            error={errors.ward}
            placeholder={form.lga ? "Select your ward" : "Choose an LGA first"}
            options={geo.wards}
            disabled={!form.lga}
          />

          {/* Only once there is a ward to choose a unit in. */}
          {form.ward && (
            <Select
              id="pollingUnit"
              label="Polling unit"
              optional
              value={form.pollingUnit}
              onChange={set("pollingUnit")}
              error={errors.pollingUnit}
              placeholder={geo.unitsLoading ? "Loading polling units…" : "Select your polling unit"}
              options={geo.units}
              disabled={geo.unitsLoading}
              hint={
                !geo.unitsLoading && geo.units.length === 0
                  ? "The list for this ward could not be loaded. You can leave it blank."
                  : "Helps your ward coordinator plan for election day."
              }
            />
          )}
        </Group>

        {/* ── the optional extras, folded ───────────────────────────────── */}
        <div className="mt-6 space-y-5">
          {extras.referral ? (
            <Field
              id="referralCode"
              label="Referral code"
              optional
              value={form.referralCode}
              onChange={set("referralCode")}
              error={errors.referralCode}
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={10}
              placeholder="7K4Q2X"
              className="font-medium tracking-[0.15em] uppercase tabular-nums"
              hint={
                referrer.state === "checking"
                  ? "Checking that code…"
                  : referrer.state === "found"
                    ? undefined
                    : "The member who invited you is credited on their page."
              }
              trailing={
                referrer.state === "found" ? (
                  <Tick />
                ) : referrer.state === "checking" ? (
                  <span className="grid size-11 place-items-center text-ink-400">
                    <Loader2 size={16} className="animate-spin" />
                  </span>
                ) : null
              }
            />
          ) : null}

          {extras.email ? (
            <Field
              id="email"
              label="Email address"
              optional
              type="email"
              inputMode="email"
              value={form.email}
              onChange={set("email")}
              error={errors.email}
              autoComplete="email"
              hint="You can sign in with it as well as your number."
            />
          ) : null}

          {(!extras.referral || !extras.email) && (
            <div className="flex flex-wrap gap-2">
              {!extras.referral && (
                <AddLink onClick={() => setExtras((value) => ({ ...value, referral: true }))} focus="referralCode">
                  Have a referral code?
                </AddLink>
              )}
              {!extras.email && (
                <AddLink onClick={() => setExtras((value) => ({ ...value, email: true }))} focus="email">
                  Add an email
                </AddLink>
              )}
            </div>
          )}
        </div>

        <Button type="submit" variant="primary" size="xl" full disabled={busy} className="mt-8">
          {busy ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating your membership
            </>
          ) : (
            <>
              Join PITS
              <ArrowRight size={18} strokeWidth={2.75} />
            </>
          )}
        </Button>

        <p className="mt-4 text-center text-[0.8125rem] leading-relaxed text-content-subtle">
          By joining you accept the{" "}
          <Link href="/terms" className="font-semibold text-ink-700 underline underline-offset-2 hover:text-brand-700">
            Terms of Use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-semibold text-ink-700 underline underline-offset-2 hover:text-brand-700">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}

/* ------------------------------------------------------------- welcome */

/**
 * After joining. Registration has already signed them in, so the main action
 * is straight into their membership. The second is the referral code, with the
 * two things people actually do with it: copy it, and send it on WhatsApp.
 */
function Welcome({ member }) {
  const [copied, setCopied] = useState(false);
  const link = member.referralCode ? `${site.url}/join?ref=${member.referralCode}` : `${site.url}/join`;
  const message = `I just joined Power In The Streets (PITS), organising ward by ward for ${site.aspirant}. Membership is free and takes a minute: ${link}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(member.referralCode ?? link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked: the code is on screen to copy by hand. */
    }
  };

  return (
    <AuthShell
      kicker="Welcome to the movement"
      title={`You're in, ${member.name.split(" ")[0]}.`}
      lead={`Registered in ${member.ward}, ${member.lga}, ${member.state}. Your membership is active from today.`}
      points={POINTS}
    >
      <div className="rounded-2xl bg-night p-6 text-white shadow-e3 sm:p-7">
        <p className="flex items-center gap-2 text-[0.8125rem] font-medium text-white/60">
          <span className="grid size-5 place-items-center rounded-full bg-ember-500 text-ink-950">
            <Check size={12} strokeWidth={3.5} aria-hidden="true" />
          </span>
          Membership number
        </p>
        <p className="mt-3 font-display text-fluid-2xl font-bold tracking-[-0.01em] tabular-nums">
          {member.membershipNo}
        </p>
        <p className="mt-3 text-[0.8125rem] text-white/60">Sign in any time with {member.phone}.</p>
      </div>

      <Button href="/portal" variant="primary" size="xl" full className="mt-6">
        <IdCard size={18} strokeWidth={2.5} />
        Open your membership
        <ArrowRight size={18} strokeWidth={2.75} />
      </Button>

      {member.referralCode && (
        <div className="mt-8 rounded-2xl border border-hairline bg-ink-50 p-6">
          <p className="font-display text-[1.0625rem] font-semibold">Bring someone in</p>
          <p className="mt-1.5 text-[0.875rem] leading-relaxed text-content-muted">
            Everyone who joins with your code appears on your page, by name.
          </p>
          <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-hairline bg-white py-2 pr-2 pl-5">
            <span className="font-display text-[1.25rem] font-bold tracking-[0.2em] tabular-nums">
              {member.referralCode}
            </span>
            <Button type="button" variant="outline" size="sm" onClick={copy}>
              {copied ? <Check size={15} strokeWidth={3} /> : <Copy size={15} strokeWidth={2.5} />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <Button
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            external
            variant="dark"
            size="lg"
            full
            className="mt-3"
          >
            <MessageCircle size={17} strokeWidth={2.5} />
            Share on WhatsApp
          </Button>
        </div>
      )}

      <p className="mt-6 text-center text-[0.8125rem] text-content-subtle">
        Next in your portal: add a photo for your card, and verify with your NIN.
      </p>
    </AuthShell>
  );
}

/**
 * Resolves a referral code to the member who holds it, as it is typed.
 *
 * Returns { state: "idle" | "checking" | "found" | "unknown", name }. The
 * lookup only fires on a complete six-character code, debounced, and an
 * in-flight request is aborted when the code changes, so a slow answer for an
 * old code never overwrites the answer for the current one.
 */
function useReferrer(input) {
  /* One atom, keyed by the code it describes. "idle" and "checking" are
     derived from the gap between the code typed and an answer for it. */
  const [answer, setAnswer] = useState({ code: null, name: null, found: false });

  /* The server's rule (lib/referrals.js): "PITS" comes off a ten-character
     shape only. */
  let code = String(input ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (code.length === 10 && code.startsWith("PITS")) code = code.slice(4);

  useEffect(() => {
    if (code.length !== 6) return;

    const controller = new AbortController();

    const timer = setTimeout(() => {
      fetch(`/api/referrals/${code}`, { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => setAnswer({ code, name: data?.name ?? null, found: Boolean(data) }))
        // Neither an abort nor a dropped connection is a failure: the server
        // checks the code again at submit.
        .catch(() => {
          if (!controller.signal.aborted) setAnswer({ code, name: null, found: false });
        });
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [code]);

  if (code.length !== 6) return { state: "idle", name: null };
  if (answer.code !== code) return { state: "checking", name: null };
  return answer.found ? { state: "found", name: answer.name } : { state: "unknown", name: null };
}

/* ------------------------------------------------------------- primitives */

function Group({ title, note, children }) {
  return (
    <fieldset className="mt-8 first:mt-0">
      <legend className="flex w-full flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <span className="font-display text-[1rem] font-semibold text-ink-950">{title}</span>
        {note && <span className="text-[0.75rem] text-content-subtle">{note}</span>}
      </legend>
      <div className="mt-4 space-y-4">{children}</div>
    </fieldset>
  );
}

function Tick() {
  return (
    <span className="grid size-11 place-items-center text-brand-600" aria-hidden="true">
      <BadgeCheck size={18} strokeWidth={2.5} />
    </span>
  );
}

function Rule({ met, children }) {
  return (
    <li className={cn("flex items-center gap-1.5 transition-colors", met ? "text-emerald-700" : "text-content-subtle")}>
      <span
        className={cn(
          "grid size-4 place-items-center rounded-full transition-colors",
          met ? "bg-emerald-600 text-white" : "bg-ink-100 text-transparent"
        )}
      >
        <Check size={10} strokeWidth={4} aria-hidden="true" />
      </span>
      {children}
      <span className="sr-only">{met ? ", done" : ", not yet"}</span>
    </li>
  );
}

function AddLink({ onClick, focus, children }) {
  return (
    <button
      type="button"
      onClick={() => {
        onClick();
        requestAnimationFrame(() => document.getElementById(focus)?.focus());
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-ink-300 px-3.5 py-2 text-[0.8125rem] font-medium text-content-muted transition-colors hover:border-ink-500 hover:text-ink-950"
    >
      <Plus size={14} strokeWidth={2.75} aria-hidden="true" />
      {children}
    </button>
  );
}

function Field({ id, label, optional = false, hint, error, trailing, below, className, ...props }) {
  const describedBy = [hint && !error && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-[0.875rem] font-medium text-ink-800">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-400">(optional)</span>}
      </label>

      <div className="relative mt-1.5">
        <input
          id={id}
          name={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(fieldClass(error), trailing && "pr-12", className)}
          {...props}
        />
        {trailing && <span className="absolute inset-y-0 right-1 flex items-center">{trailing}</span>}
      </div>

      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[0.8125rem] font-semibold text-red-700">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-[0.8125rem] leading-snug text-content-subtle">
            {hint}
          </p>
        )
      )}
      {below}
    </div>
  );
}

/* A plain <select>, deliberately. The ward and polling unit lists run to
   dozens of entries, and the native control gives the platform's own scroller
   and type ahead: on a phone, a full-height wheel that beats any custom list. */
function Select({ id, label, options, placeholder, error, hint, optional = false, ...props }) {
  const describedBy = [hint && !error && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");

  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-[0.875rem] font-medium text-ink-800">
        {label}
        {optional && <span className="ml-1.5 font-normal text-ink-400">(optional)</span>}
      </label>
      <select
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn("mt-1.5", fieldClass(error))}
        {...props}
      >
        <option value="">{placeholder}</option>
        {/* LGA and ward lists are plain names; polling units are { value,
            label }, because two units in one ward can share a name. */}
        {options.map((option) => {
          const value = option.value ?? option;
          return (
            <option key={value} value={value}>
              {option.label ?? option}
            </option>
          );
        })}
      </select>

      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[0.8125rem] font-semibold text-red-700">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-[0.8125rem] leading-snug text-content-subtle">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
