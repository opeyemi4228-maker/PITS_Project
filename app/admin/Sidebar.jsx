"use client";

import Image from "next/image";
import Link from "next/link";
import { CircleHelp, Globe, LogOut, ShieldCheck, ArrowUpRight } from "lucide-react";

import { assets } from "@/assets/assets";
import SignOutForm from "@/components/SignOutForm";
import { AdminRail } from "./AdminNav";
import Countdown from "./Countdown";

/**
 * The dashboard rail: mark, territory, navigation, and the way out.
 *
 * White, like the rest of the product. The reference this layout was modelled
 * on uses a dark rail; the separation it buys is already done here by the 2px
 * rule down its edge, and a black column would be the only surface in the whole
 * system that is not paper.
 *
 * The scope chip at the top is not decoration. Administering the wrong
 * territory is the failure this whole area is built to prevent, and the two
 * facts that decide whether an action is legitimate — which office you hold and
 * which unit it governs — stay in the reader's eyeline for the entire session.
 *
 * It is a client component only because the navigation inside it reads the
 * current path. Everything the rail *says* is resolved on the server and handed
 * down, so nothing about a coordinator's authority is decided in the browser.
 */
export default function Sidebar({
  local,
  regional,
  nationwide,
  broadcaster,
  agent,
  tierLabel,
  unitName,
  roleTitle,
  isSuperAdmin,
}) {
  const quiet =
    "flex w-full items-center gap-4 px-8 py-2.5 text-[1rem] text-ink-500 transition-colors hover:text-ink-950";

  return (
    <div className="flex h-full flex-col rounded-3xl bg-ink-50/70 py-7">
      <Link href="/" className="group flex items-center gap-3.5 px-7 pb-8">
        <span className="grid size-13 shrink-0 place-items-center rounded-full bg-white shadow-e2 ring-1 ring-hairline transition-transform duration-300 group-hover:-translate-y-0.5">
          <Image src={assets.amvoraMark} alt="" sizes="52px" className="h-9 w-auto object-contain" />
        </span>
        <span className="flex min-w-0 flex-col leading-none">
          <span className="font-display text-[1.5rem] font-extrabold tracking-[-0.035em] text-ink-950">PITS</span>
          <span className="mt-1 text-[0.75rem] font-medium text-ink-400">Secretariat</span>
        </span>
      </Link>

      {/* ── Where you stand ───────────────────────────────────────────────
          Administering the wrong territory is the failure this whole area is
          built to prevent, so which office and which unit stay in view for
          the entire session. Quiet, but always there. */}
      <div className="mx-5 mb-8 rounded-2xl bg-white px-4 py-3.5 shadow-e1 ring-1 ring-hairline">
        <p className="text-[0.6875rem] font-medium tracking-[0.06em] text-ink-400 uppercase">
          {tierLabel}
        </p>
        <p className="mt-0.5 truncate text-[0.9375rem] font-semibold text-ink-950">{unitName}</p>
        <p className="truncate text-[0.8125rem] text-content-subtle">{roleTitle}</p>
        {isSuperAdmin && (
          <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-ember-50 px-2 py-0.5 text-[0.6875rem] font-semibold text-ember-700">
            <ShieldCheck size={12} strokeWidth={2.5} aria-hidden="true" />
            Super admin
          </span>
        )}
      </div>

      <div className="flex-1">
        <AdminRail
          local={local}
          regional={regional}
          nationwide={nationwide}
          broadcaster={broadcaster}
          agent={agent}
        />
      </div>

      <div className="mt-8">
        <p className="px-8 pb-2.5 text-[0.75rem] font-medium tracking-[0.08em] text-ink-400 uppercase">
          General
        </p>
        {/* The way back out. A logo is not a signpost: somebody deep in the
            register looking for the public site should not have to guess that
            the mark is how they leave. */}
        <Link href="/portal" className={quiet}>
          <ArrowUpRight size={21} strokeWidth={1.75} className="shrink-0 text-ink-400" aria-hidden="true" />
          My membership
        </Link>
        <Link href="/" className={quiet}>
          <Globe size={21} strokeWidth={1.75} className="shrink-0 text-ink-400" aria-hidden="true" />
          Website
        </Link>
        <Link href="/contact" className={quiet}>
          <CircleHelp size={21} strokeWidth={1.75} className="shrink-0 text-ink-400" aria-hidden="true" />
          Help
        </Link>
        <SignOutForm>
          <button type="submit" className={`${quiet} hover:text-red-600`}>
            <LogOut size={21} strokeWidth={1.75} className="shrink-0 text-ink-400" aria-hidden="true" />
            Sign out
          </button>
        </SignOutForm>
      </div>

      <div className="mt-8 px-5">
        <Countdown />
      </div>
    </div>
  );
}
