import { requireSecretariat } from "@/lib/guard";
import { queue } from "@/lib/applications";
import { newestMembers, overview, ownSeats, territory } from "@/lib/dashboard";
import { can } from "@/lib/permissions";
import { growthSeries, topRecruiters } from "@/lib/referrals";
import { seatsIAppointTo } from "@/lib/vacancies";
import OverviewView from "./OverviewView";
import { Empty } from "./ui";

export const dynamic = "force-dynamic";

/**
 * The secretariat overview (§10.1): the data. What it looks like, and why,
 * is in OverviewView — kept apart so the layout can be rendered and checked
 * with sample figures, and so this file stays about what is fetched and who
 * may see it.
 */
export default async function AdminOverview() {
  const { member, scope } = await requireSecretariat();
  const isWard = scope.scopeType === "WARD";

  const [stats, units, series, recruiters, seats, newest, waiting, appointable] =
    await Promise.all([
      overview(scope),
      territory(scope),
      growthSeries({ scope, days: 7 }),
      topRecruiters(scope, { take: 4 }),
      isWard ? ownSeats(scope) : null,
      newestMembers(scope, { take: 4 }),
      /* The same call and limit as the appointments page, so the two can never
         disagree about how many people are waiting. */
      queue(scope),
      /* One row is enough to know whether this office appoints at all. The
         appointments page 404s for an office that does not, and every button
         on this page that points there must not be offered to one. */
      seatsIAppointTo(scope, { take: 1 }),
    ]);

  if (!stats) return <Empty>No territory is assigned to your seat.</Empty>;

  return (
    <OverviewView
      member={member}
      scope={scope}
      stats={stats}
      units={units}
      series={series}
      recruiters={recruiters}
      seats={seats}
      newest={newest}
      waiting={waiting}
      appoints={appointable.length > 0 || waiting.length > 0}
      broadcaster={can(scope, "broadcast")}
    />
  );
}
