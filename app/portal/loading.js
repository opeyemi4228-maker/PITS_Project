/**
 * The member portal, while it loads.
 *
 * Same reasoning as the secretariat's: the page is force-dynamic and opens by
 * awaiting the referral summary, the referral list and ninety days of growth.
 * This is the shape those blocks arrive in — the white masthead with the
 * portrait, then the cards — so nothing jumps when they do.
 */
function Block({ className = "" }) {
  return (
    <div aria-hidden="true" className={`rounded-3xl bg-white motion-safe:animate-pulse ${className}`} />
  );
}

export default function PortalLoading() {
  return (
    <div className="mx-auto max-w-352 space-y-4 pt-8 pb-10 sm:pt-10">
      <div className="flex flex-wrap items-end justify-between gap-5 px-1 pb-2">
        <div>
          <div className="h-10 w-56 rounded-xl bg-ink-200/70 motion-safe:animate-pulse" />
          <div className="mt-3 h-3.5 w-44 rounded-lg bg-ink-200/70 motion-safe:animate-pulse" />
        </div>
        <div className="h-12 w-52 rounded-full bg-ink-200/70 motion-safe:animate-pulse" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
        <Block className="h-56 md:col-span-2 xl:col-span-6" />
        <Block className="h-56 bg-brand-900/15 xl:col-span-3" />
        <Block className="h-56 xl:col-span-3" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
        <Block className="h-80 xl:col-span-4" />
        <Block className="h-80 xl:col-span-5" />
        <Block className="h-80 bg-brand-950/15 md:col-span-2 xl:col-span-3" />
      </div>

      <p className="sr-only" role="status">
        Loading your membership
      </p>
    </div>
  );
}
