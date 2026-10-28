import { Skeleton, SkeletonTable, SkeletonTile } from "./ui";

/**
 * What the secretariat shows while a page is being fetched.
 *
 * Every page in this area is `force-dynamic` and opens by awaiting several
 * database queries at once, so there is a real gap between the tap and the
 * first pixel. Until this file existed, Next had no boundary to fall back to
 * and the browser simply sat on the previous page: no spinner, no change, no
 * sign the tap registered. On a phone at a ward meeting that reads as a broken
 * link, and the coordinator taps again.
 *
 * One file covers the whole area: a loading state at a segment wraps every
 * route beneath it that does not define its own. So it is drawn as the shape
 * all of them share — a ruled title, a row of figures, a block, a table —
 * rather than as any one page. It is the rhythm that matters here, not the
 * detail: the rail and the scope chip beside it never leave, so the reader can
 * already see where they are going.
 */
export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <Skeleton className="h-10 w-72" />
          <Skeleton className="mt-3 h-3.5 w-44" />
        </div>
        <Skeleton className="h-12 w-40 rounded-full" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <SkeletonTile key={index} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-12">
        <div className="h-80 rounded-3xl bg-white p-6 lg:col-span-2 xl:col-span-5">
          <Skeleton className="h-4 w-28" />
          <div className="mt-10 flex h-44 items-end gap-3">
            {[50, 75, 60, 100, 40, 70, 55].map((height, index) => (
              <Skeleton key={index} className="flex-1 rounded-full" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
        <div className="h-80 rounded-3xl bg-white p-6 xl:col-span-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-6 h-7 w-4/5" />
          <Skeleton className="mt-3 h-3 w-3/5" />
          <Skeleton className="mt-24 h-12 w-full rounded-full" />
        </div>
        <div className="h-80 rounded-3xl bg-white p-6 xl:col-span-3">
          <Skeleton className="h-4 w-32" />
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="mt-5 flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>

      <SkeletonTable rows={4} />

      <p className="sr-only" role="status">
        Loading
      </p>
    </div>
  );
}
