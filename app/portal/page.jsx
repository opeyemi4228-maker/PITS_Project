import { redirect } from "next/navigation";

import PortalView from "./PortalView";
import { currentSession } from "@/lib/session";
import { myApplications } from "@/lib/applications";
import { vacanciesForMember } from "@/lib/vacancies";
import { referralList, referralSummary } from "@/lib/referrals";

export const metadata = {
  title: "Your membership | PITS",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * The member dashboard (§3.3, /portal): the data. What it looks like, and
 * why, is in PortalView.
 */
export default async function Portal() {
  const { member, scope } = await currentSession();
  if (!member) redirect("/login?next=/portal");

  const [referrals, brought] = await Promise.all([
    referralSummary(member.id),
    referralList(member.id, { take: 5 }),
  ]);

  /* Only for a member with no office — somebody who already holds one cannot
     hold a second, so offering them the form would be offering a refusal. */
  const [vacancies, applications] = scope
    ? [[], []]
    : await Promise.all([vacanciesForMember(member), myApplications(member.id)]);

  return (
    <PortalView
      member={member}
      scope={scope}
      referrals={referrals}
      brought={brought}
      vacancies={vacancies}
      applications={applications}
    />
  );
}
