"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Loader2, CircleAlert, KeyRound, LockKeyhole, UserRound } from "lucide-react";
import AuthShell, { AuthField, fieldClass } from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useViewer } from "@/lib/useViewer";

/* What an account is, said on the panel beside the form. Three things a member
   actually gets, not three adjectives. */
const POINTS = [
  "Your membership number and digital ID card",
  "The ward you are registered in, and who coordinates it",
  "Everyone you have brought into the movement, counted",
];

export default function Login() {
  const { member } = useViewer();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  /* Per-field, so the message sits under the field that is wrong instead of
     making the reader match a summary at the top to a box further down. */
  const [fieldErrors, setFieldErrors] = useState({});
  /* The second factor. Only ever shown after a correct password: the server
     refuses with mfaRequired and no session, and this is the state that
     records it. */
  const [mfa, setMfa] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const alertRef = useRef(null);

  async function submit(event) {
    event.preventDefault();
    setError("");

    /* Validated per field. The old version put one sentence covering both
       fields at the top of the page, which told somebody who had filled in
       their phone number correctly that it might be the thing at fault. */
    const next = {};
    if (!identifier.trim()) next.identifier = "Enter your phone number or email address.";
    if (!password) next.password = "Enter your password.";
    if (mfa && !code.trim()) next.code = "Enter the six digit code.";
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, ...(code ? { code } : {}) }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.mfaRequired) {
          /* The password was right. Nothing is said about that either way —
             the field simply appears — but the error, if there is one, is
             about the code and not the password. */
          setMfa(true);
          setError(data.error ?? "");
          return;
        }
        setMfa(false);
        setCode("");
        setError(data.error ?? "Those details do not match an account.");
        /* Move the reader to the message. Without this the page looks
           unchanged after a failed attempt on a long phone screen. */
        requestAnimationFrame(() => alertRef.current?.focus());
        return;
      }
      /* Go back to whatever sent them here — /admin bounces its guests to
         /login?next=/admin, and dumping a coordinator on the homepage after
         they have just signed in makes them navigate twice.

         Only same-site paths are honoured: an open redirect on a political
         movement's login page is a ready-made phishing tool.

         Read from `window` rather than useSearchParams(), which would force
         this page behind a Suspense boundary and out of static rendering for
         one string only needed at submit time. */
      const nextPath = new URLSearchParams(window.location.search).get("next");
      /* Default to /portal, not "/". A member who has just signed in needs to
         see their own name and membership number to know it worked; the
         homepage tells them nothing. /portal is the member dashboard and
         every member has one — /admin is only for the few holding a seat, and
         sending everyone there would greet most of the movement with a
         refusal page straight after a successful sign-in. */
      const safe =
        nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/portal";

      /* A full navigation, not router.push(). Two reasons:

         1. router.push() followed by router.refresh() aborts the push — the
            page sat on /login after a successful sign-in, cookie and all.
         2. Signing in changes what every server component renders. A hard
            load throws away the client cache built while logged out instead
            of leaving the masthead showing "Sign in" to a signed-in member. */
      window.location.assign(safe);
      return;
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      requestAnimationFrame(() => alertRef.current?.focus());
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell
      kicker="Member access"
      title={mfa ? "One more step" : "Sign in"}
      lead={
        mfa
          ? "Your password was accepted. Enter the code from your authenticator app to finish signing in."
          : "Use the phone number or email address you registered with."
      }
      points={POINTS}
      footer={
        member ? (
          <p className="text-[0.875rem] text-content-muted">
            Signed in as <span className="font-semibold text-ink-950">{member.name}</span>.{" "}
            <Link
              href="/portal"
              className="font-bold text-brand-700 underline underline-offset-4 transition-colors hover:text-ember-600"
            >
              Go to your membership
            </Link>
          </p>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[0.875rem] text-content-muted">Not a member yet?</p>
            <Link
              href="/join"
              className="group inline-flex h-11 items-center gap-2 rounded-full border border-ink-200 bg-white px-5 text-[0.875rem] font-semibold text-ink-950 shadow-e1 transition-colors hover:border-ink-950 hover:bg-night hover:text-white"
            >
              Join PITS
              <ArrowRight
                size={14}
                strokeWidth={3}
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        )
      }
    >
      {error && (
        <p
          ref={alertRef}
          role="alert"
          tabIndex={-1}
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-[0.875rem] leading-relaxed text-red-900 focus:outline-none"
        >
          <CircleAlert size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <form onSubmit={submit} noValidate className="space-y-5">
        <AuthField
          id="identifier"
          label="Phone number or email"
          icon={UserRound}
          error={fieldErrors.identifier}
          name="identifier"
          autoComplete="username"
          /* Not `type="tel"`: the field takes an email address too, and a
             numeric keypad cannot type one. `inputMode` still opens the phone
             pad for the far commoner case. */
          inputMode="tel"
          enterKeyHint="next"
          autoFocus
          placeholder="0803 123 4567"
          value={identifier}
          onChange={(event) => {
            setIdentifier(event.target.value);
            setFieldErrors((previous) => ({ ...previous, identifier: undefined }));
          }}
        />

        <AuthField
          id="password"
          label="Password"
          error={fieldErrors.password}
          /* The way out of a forgotten password belongs beside the field that
             is failing, at the moment it fails — not in a line under the
             submit button that nobody reads until they have already tried
             twice. */
          action={
            <Link
              href="/reset"
              className="text-[0.8125rem] font-semibold text-brand-700 underline decoration-brand-200 decoration-2 underline-offset-4 transition-colors hover:decoration-brand-700"
            >
              Forgotten it?
            </Link>
          }
        >
          <div className="group/field relative mt-2">
            <LockKeyhole
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-400 transition-colors group-focus-within/field:text-ink-900"
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              enterKeyHint="go"
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setFieldErrors((previous) => ({ ...previous, password: undefined }));
              }}
              className={cn(fieldClass(fieldErrors.password), "pr-13 pl-11")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-1 right-1 grid w-11 place-items-center rounded-lg text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-950"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </AuthField>

        {mfa && (
          <div className="rounded-2xl border border-ink-200 bg-ink-50 p-5">
            <p className="flex items-center gap-2 text-[0.8125rem] font-medium text-ink-950">
              <KeyRound size={14} strokeWidth={2.5} aria-hidden="true" className="text-ember-600" />
              Two factor authentication
            </p>
            <AuthField
              id="code"
              label="Authentication code"
              className="mt-4"
              error={fieldErrors.code}
              hint="The six digits from your authenticator app. Lost your phone? Enter one of your recovery codes instead. Each works once."
              value={code}
              onChange={(event) => {
                /* Six digits from the app, or a recovery code with a dash
                   in it. One field for both: somebody reaching for a
                   recovery code has lost their phone and does not need a
                   second decision to make first. */
                setCode(event.target.value.replace(/[^0-9A-Za-z-]/g, "").slice(0, 11));
                setError("");
                setFieldErrors((previous) => ({ ...previous, code: undefined }));
              }}
              autoComplete="one-time-code"
              inputMode="numeric"
              enterKeyHint="go"
              autoFocus
              placeholder="000000"
            />
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" full disabled={busy} className="mt-2 shadow-e2">
          {busy ? (
            <>
              <Loader2 size={17} className="animate-spin" aria-hidden="true" />
              Signing in
            </>
          ) : (
            <>
              {mfa ? "Verify and sign in" : "Sign in"}
              <ArrowRight size={17} strokeWidth={2.75} aria-hidden="true" />
            </>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
