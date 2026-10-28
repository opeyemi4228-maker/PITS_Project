import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { assets } from "@/assets/assets";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/* Where most mistyped or outdated links should have been going. */
const suggestions = [
  { href: "/about", label: "About PITS" },
  { href: "/about/adebayo", label: "Prince Adebayo" },
  { href: "/manifesto", label: "The Manifesto" },
  { href: "/structure", label: "Find your coordinator" },
  { href: "/news", label: "Newsroom" },
  { href: "/contact", label: "Contact the Secretariat" },
];

/**
 * The 404. Same night panel the inner pages open with, so a broken link still
 * lands somewhere that looks like the movement, and then offers the pages a
 * visitor was most likely looking for.
 */
export default function NotFound() {
  return (
    <section className="px-2 pt-2 pb-16 sm:px-3 sm:pt-3 lg:pb-24">
      <div className="relative isolate overflow-hidden rounded-[var(--radius-panel)] bg-night text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_100%_at_85%_0%,color-mix(in_oklch,var(--color-brand-600)_45%,transparent)_0%,transparent_70%)]"
        />
        <Image
          src={assets.amvoraMarkLight}
          alt=""
          sizes="400px"
          className="pointer-events-none absolute -right-12 -bottom-20 -z-10 h-[26rem] w-auto opacity-[0.07]"
        />
        <div className="shell flex min-h-[30rem] flex-col justify-center py-20 lg:py-28">
          <p className="eyebrow eyebrow-inverse">Error 404</p>
          <h1 className="mt-6 max-w-[18ch] text-fluid-5xl text-white">This page is not on the map.</h1>
          <p className="mt-6 max-w-xl text-fluid-lg leading-relaxed text-white/70">
            The link may be old, or the address may have a typo. Everything the
            movement publishes is still here, starting from the homepage.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/" variant="inverse" size="lg">
              Back to the homepage
              <ArrowRight size={17} strokeWidth={2.5} aria-hidden="true" />
            </Button>
            <Button href="/join" variant="inverseOutline" size="lg">
              Join PITS
            </Button>
          </div>
        </div>
      </div>

      <div className="shell mt-12">
        <h2 className="text-fluid-xl">Perhaps you were looking for</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="card card-interactive group flex items-center justify-between gap-4 px-6 py-5 font-semibold"
              >
                {item.label}
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className="text-ink-300 transition-[color,transform] duration-300 group-hover:translate-x-0.5 group-hover:text-brand-600"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
