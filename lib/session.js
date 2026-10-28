import { cache } from "react";
import { cookies } from "next/headers";

import { readSession, SESSION_COOKIE } from "./auth";
import { prisma } from "./db";
import { resolveScope } from "./permissions";
import { fullName } from "./store";

/**
 * Who is asking, and what are they allowed to see.
 *
 * The signed cookie proves identity only. Everything about authority — the
 * seat held, the tier, the territory — is read from the database on every
 * request and never from the token, because a session issued the day someone
 * was State Coordinator must not still grant that after they are removed.
 *
 * Both readers are wrapped in React's `cache`, which dedupes them for the
 * lifetime of one request. A layout and the page inside it can now each ask
 * who is signed in — the portal's top bar needs the seat to offer the
 * secretariat switch, and the page needs the whole member — and the database
 * is read once, not twice.
 *
 * Server only.
 */

export const currentMember = cache(async function currentMember() {
  const store = await cookies();
  const payload = readSession(store.get(SESSION_COOKIE)?.value);
  if (!payload?.sub) return null;

  const member = await prisma.member.findUnique({
    where: { id: BigInt(payload.sub) },
    include: {
      user: { select: { phone: true, email: true, status: true, phoneVerified: true } },
      state: { select: { name: true } },
      lga: { select: { name: true } },
      ward: { select: { name: true } },
    },
  });

  if (!member || member.user.status !== "ACTIVE") return null;

  return {
    id: String(member.id),
    /* The account behind the member. Server-side only — every route that hangs
       something off the user rather than the member needs it: the one-time
       codes, the second factor, the last-sign-in stamp. It is never rendered
       and never returned to a browser; /api/auth/session builds its own slim
       payload and publicMember() strips it. */
    userId: String(member.userId),
    name: fullName(member),
    membershipNo: member.membershipNo,
    phone: member.user.phone,
    email: member.user.email,
    photoUrl: member.photoUrl,
    // Their own code, on every page they see: the dashboard rail, the portal,
    // the confirmation after registering.
    referralCode: member.referralCode,
    verification: member.verification,
    hasNin: Boolean(member.ninEncrypted),
    /* Whether the number they registered with has been confirmed by a code.
       The portal's checklist counts it as one of the four things that make a
       membership record complete, and it is the only one of the four the
       member can finish without leaving the page they are on. */
    phoneVerified: member.user.phoneVerified,
    state: member.state.name,
    lga: member.lga.name,
    ward: member.ward.name,
    /* The ids behind those names. Server-side only, like userId: a page asking
       "what can this member stand for" needs to compare against seat columns,
       and doing that by name would break the moment two states have a ward
       called Central — which several do. */
    stateId: member.stateId,
    lgaId: member.lgaId,
    wardId: member.wardId,
    pollingUnitId: member.pollingUnitId,
  };
});

/**
 * The member plus their resolved authority. `scope` is null for an ordinary
 * member — they have no admin surface at all.
 */
export const currentSession = cache(async function currentSession() {
  const member = await currentMember();
  if (!member) return { member: null, scope: null };
  return { member, scope: await resolveScope(member.id) };
});
