"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, IdCard, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation, primaryCta, secondaryCta, site, socials } from "@/lib/site";
import { assets } from "@/assets/assets";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import BrandIcon from "@/components/ui/BrandIcon";
import AccountMenu from "@/components/AccountMenu";
import { clearViewerCache, useViewer } from "@/lib/useViewer";

/**
 * The masthead: one quiet bar.
 *
 * The mark and the name on the left, five links in the middle, one action on
 * the right. No utility strip above it, no dropdowns, no second line under the
 * name. Everything else the old masthead carried (socials, the campaign site,
 * News, Contact) is one scroll away in the footer, and in the drawer on a
 * phone, where the footer is far away.
 */
function Lockup() {
  return (
    <Link href="/" aria-label={`${site.name} home`} className="group flex min-w-0 items-center gap-3">
      {/* The torch is tall and narrow, so it sits in a round badge to read
          as a logo rather than a sliver at masthead size. */}
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white shadow-e2 ring-1 ring-hairline transition-[transform,box-shadow] duration-300 ease-out-quart group-hover:-translate-y-0.5 group-hover:shadow-e3 lg:size-14">
        <Image src={assets.amvoraMark} alt="" priority sizes="56px" className="h-9 w-auto object-contain lg:h-10" />
      </span>
      <span className="truncate font-display text-[1.125rem] font-extrabold tracking-[-0.025em] text-content transition-colors duration-200 group-hover:text-brand-700 lg:max-xl:sr-only xl:text-[1.3125rem]">
        Power In The Streets
      </span>
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  /* Who, if anyone, is signed in. See lib/useViewer.js. */
  const { status, member } = useViewer();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const navRef = useRef(null);
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  /* Shadow after the first scroll; retract on the way down and return on the
     way up, so the bar is not permanently eating a phone screen. rAF-throttled,
     with a 6px deadband so momentum scrolling does not make it strobe. */
  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        // iOS rubber-banding reports negative values; clamp them.
        const y = Math.max(window.scrollY, 0);
        setScrolled(y > 8);
        if (Math.abs(y - lastY.current) > 6) {
          setHidden(y > lastY.current && y > 160);
          lastY.current = y;
        }
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Publish the masthead height so page-level sticky bars (the newsroom filter
     rail) sit directly beneath it, and drop it to 0 while it is retracted. */
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    const write = () =>
      document.documentElement.style.setProperty(
        "--masthead-offset",
        `${hidden && !open ? 0 : el.offsetHeight}px`
      );

    write();
    const observer = new ResizeObserver(write);
    observer.observe(el);
    return () => observer.disconnect();
  }, [hidden, open]);

  // Route change closes the drawer.
  /* eslint-disable-next-line react-hooks/set-state-in-effect --
       Synchronising with the router, which is what an effect is for. */
  useEffect(() => setOpen(false), [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  /* Drawer behaviour: lock the page behind it, trap Tab inside it, close on
     Escape. Without the trap, Tab walks invisibly through the page behind. */
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbarGap > 0) body.style.paddingRight = `${scrollbarGap}px`;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector("a, button")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = "";
    };
  }, [open, close]);

  /* Longest matching href wins, so /about/adebayo lights "Prince Adebayo"
     and not "About" as well. */
  const activeHref = navigation
    .map((item) => item.href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <>
      {/* `sticky` on the <header> itself: a sticky box travels only within its
          containing block, so it cannot live on a child of this element. */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-transform duration-300 ease-out-quart",
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <nav
          ref={navRef}
          aria-label="Primary"
          className={cn(
            "border-b bg-surface/90 backdrop-blur-xl backdrop-saturate-150 transition-[box-shadow,border-color] duration-300",
            scrolled ? "border-hairline shadow-e2" : "border-transparent shadow-none"
          )}
        >
          {/* A hairline of the two campaign colours, torch into amber. */}
          <div aria-hidden="true" className="h-1 bg-linear-to-r from-brand-600 via-brand-500 to-ember-500" />
          <div className="shell shell-wide flex h-18 items-center justify-between gap-6 lg:h-22">
            <Lockup />

            <ul className="hidden items-center gap-1 rounded-full bg-ink-50/80 p-1.5 ring-1 ring-hairline lg:flex">
              {navigation
                .filter((item) => !item.drawerOnly)
                .map((item) => {
                  const active = item.href === activeHref;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative block rounded-full px-3.5 py-2.5 text-[0.875rem] font-semibold whitespace-nowrap transition-[color,background-color,box-shadow] duration-200 xl:px-5 xl:text-[0.9375rem]",
                          active
                            ? "bg-white text-brand-700 shadow-e2"
                            : "text-content-muted hover:bg-white/70 hover:text-content"
                        )}
                      >
                        {item.label}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-x-5 bottom-1 h-0.5 rounded-full bg-brand-600 transition-transform duration-300 ease-out-quart",
                            active ? "scale-x-100" : "scale-x-0"
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
            </ul>

            <div className="flex shrink-0 items-center gap-3">
              {/* What the action slot holds depends on who is reading: a member
                  is never asked to join again. The placeholder is the size of
                  both outcomes so the bar does not lurch when the answer lands. */}
              <div className="hidden items-center gap-2 sm:flex">
                {status === "loading" ? (
                  <span aria-hidden="true" className="h-13 w-44 animate-pulse rounded-full bg-ink-100" />
                ) : member ? (
                  <AccountMenu member={member} />
                ) : (
                  <>
                    <Link
                      href="/portal"
                      className="rounded-full px-4 py-2.5 text-[0.9375rem] font-semibold text-content-muted transition-colors duration-200 hover:bg-ink-100 hover:text-content"
                    >
                      Sign in
                    </Link>
                    <Button href={primaryCta.href} variant="primary" size="lg" className="shadow-e2">
                      {primaryCta.label}
                      <ArrowRight
                        size={17}
                        strokeWidth={2.5}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </Button>
                  </>
                )}
              </div>

              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? "Close menu" : "Open menu"}
                className="grid size-12 shrink-0 place-items-center rounded-full border border-hairline bg-white text-content shadow-e1 transition-colors duration-200 hover:bg-ink-50 lg:hidden"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* The drawer is a sibling of <header>, not a child: the header carries a
          transform, which would make it the containing block for this fixed
          overlay and drag the overlay off screen with it. `overflow-hidden`
          stops the parked panel adding horizontal scroll on mobile. */}
      <div
        className={cn(
          "fixed inset-0 z-60 overflow-hidden lg:hidden",
          open ? "visible pointer-events-auto" : "invisible pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          onClick={close}
          className={cn(
            "absolute inset-0 bg-night/50 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          id="mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className={cn(
            "absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col overflow-y-auto overscroll-contain bg-surface shadow-e4",
            "transition-transform duration-420 ease-out-quart",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex h-18 items-center justify-between gap-4 border-b border-hairline px-5">
            <span className="font-display text-[1rem] font-bold tracking-[-0.02em]">Menu</span>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="grid size-10 shrink-0 place-items-center rounded-full border border-hairline text-content transition-colors hover:bg-ink-50"
            >
              <X size={20} />
            </button>
          </div>

          {member && (
            <div className="flex items-center gap-3.5 border-b border-hairline bg-ink-50 px-5 py-4">
              <Avatar name={member.name} src={member.photoUrl} size="md" />
              <div className="min-w-0">
                <p className="truncate font-display text-[0.9375rem] font-semibold text-ink-950">{member.name}</p>
                <p className="mt-0.5 truncate text-[0.75rem] tabular-nums text-content-muted">
                  {member.membershipNo ?? "Number pending"}
                </p>
              </div>
            </div>
          )}

          <ul className="flex flex-col gap-0.5 p-3">
            <li>
              <DrawerLink href="/" active={pathname === "/"}>
                Home
              </DrawerLink>
            </li>
            {navigation.map((item) => (
              <li key={item.href}>
                <DrawerLink href={item.href} active={item.href === activeHref}>
                  {item.label}
                </DrawerLink>
              </li>
            ))}
          </ul>

          {/* Safe-area padding: on a notched phone the home indicator sits over
              the last 34px, right on top of the primary action. */}
          <div className="mt-auto flex flex-col gap-3 border-t border-hairline p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            {member ? (
              <>
                <Button href="/portal" variant="primary" size="lg" full>
                  <IdCard size={17} strokeWidth={2.5} />
                  Your membership
                </Button>
                {member.office && (
                  <Button href="/admin" variant="outline" size="lg" full>
                    <LayoutDashboard size={17} strokeWidth={2.5} />
                    Secretariat
                  </Button>
                )}
                {/* A form, so signing out survives JavaScript being off (§5.4). */}
                <form action="/api/auth/logout" method="post" onSubmit={clearViewerCache}>
                  <Button type="submit" variant="ghost" size="lg" full>
                    <LogOut size={16} strokeWidth={2.5} />
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Button href={primaryCta.href} variant="primary" size="lg" full>
                  {primaryCta.label}
                  <ArrowRight size={17} strokeWidth={2.5} />
                </Button>
                <Button href="/portal" variant="outline" size="lg" full>
                  <IdCard size={17} strokeWidth={2.5} />
                  Sign in
                </Button>
              </>
            )}

            <div className="mt-2 flex items-center justify-between gap-3">
              <a
                href={secondaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-content-muted hover:text-brand-700"
              >
                {secondaryCta.label}
                <ArrowUpRight size={13} strokeWidth={2.5} aria-hidden="true" />
              </a>
              <ul className="flex items-center">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`PITS on ${social.label}`}
                      className="grid size-9 place-items-center rounded-full text-content-muted transition-colors hover:bg-ink-100 hover:text-brand-700"
                    >
                      <BrandIcon name={social.icon} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DrawerLink({ href, active, children }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-[1.0625rem] font-semibold tracking-[-0.015em] transition-colors duration-200",
        active ? "bg-brand-50 text-brand-700" : "text-content hover:bg-ink-100"
      )}
    >
      {children}
      <ArrowRight size={16} strokeWidth={2.5} aria-hidden="true" className={active ? "text-brand-600" : "text-ink-300"} />
    </Link>
  );
}
