# MAP Platform — Features

**Movement for Amaechi Presidency (MAP)** — a membership, structure and
election-returns platform for a Nigerian presidential campaign.

Three products in one Next.js application:

| Product | Route prefix | Audience |
|---|---|---|
| Public campaign site | `/`, `/about`, `/structure`, `/news`, … | Anybody |
| Member portal | `/portal` | Any signed-in member |
| Secretariat dashboard | `/admin/**` | Members holding an active seat |
| Public results | `/results/**` | Anybody, on election night |

**Stack:** Next.js 16 (App Router, React 19), Prisma 7 → PostgreSQL,
Tailwind 4, `sharp` for server-side image work, `qrcode`, `motion`,
`lucide-react`. No TypeScript build step — plain JavaScript with JSDoc.

---

## 1. The organisational structure

The whole platform is built on one idea: the movement is a **chain of
accountable offices**, six tiers deep, and every seat exists as a database row
whether or not anyone holds it. A vacancy is therefore a fact you can query,
not an absence you have to infer.

### 1.1 Six tiers, 92,184 seats

| Rank | Tier | Units | Seats per unit |
|---:|---|---:|---:|
| 1 | National | 1 | 15 offices |
| 2 | Zonal | 6 geopolitical zones | 6 coordinators + 4 executive per zone |
| 3 | State | 37 (36 + FCT) | 5 |
| 4 | LGA | 774 | 5 |
| 5 | Ward (Registration Area) | 8,809 | 10 (1 Coordinator + 9 Officers) |
| 6 | Polling Unit | 176,623 | 1 (`PU_AGENT`) |

The full office catalogue lives in [prisma/roles.mjs](prisma/roles.mjs) —
`NAT_COORD`, `ASST_COORD_NORTH`/`SOUTH`, six directorates, the six zonal
coordinators (`ZC_NE`…`ZC_SW`), and the repeating executive of five
(Coordinator, Secretary, Mobilization Officer, Youth Leader, Women Leader)
at zonal, state and LGA level.

### 1.2 The Descendant Rule

Implemented once, in [lib/permissions.js](lib/permissions.js):

> An admin may view, appoint, promote or remove any member or seat whose scope
> is **at or below** their own scope, and whose tier is **strictly lower** than
> their own — except the Super Admin, who may act anywhere.

Every dashboard query and every privileged write passes through
`memberScopeWhere()` / `seatScopeWhere()` / `pollingUnitScopeWhere()` /
`canAdminister()`. No page builds its own `where` clause, so an Edo Coordinator
and an Edo Coordinator's API response are cut by the same SQL.

Capabilities exposed by `can(scope, capability)`:
`viewDirectory`, `viewNationwide`, `appoint`, `remove`, `broadcast`,
`publishContent`, `viewAudit`.

### 1.3 The approval chain

`approverRole` is **data on each role**, not a switch statement — so the chain
can be corrected with an `UPDATE` rather than a deploy. Each office appoints
the one directly below it: national → state, state → LGA, LGA → ward, ward →
booth. Covered by [tests/appointments.test.js](tests/appointments.test.js).

### 1.4 Schema design note

A seat carries `scopeType` **and** four nullable foreign keys, exactly one of
which is set — deliberately departing from the plan's polymorphic
`scope_type`/`scope_id` pointer. Postgres refuses an orphan scope, and "every
vacant seat in Edo" becomes one indexed query.

---

## 2. Membership and registration

### 2.1 Three-step join form (`/join`)

| Step | Fields |
|---|---|
| 1 — You | Name, phone, email, referral code |
| 2 — Where you vote | State → LGA → Ward → Polling unit |
| 3 — Security | NIN (optional), password, confirm |

- Client-side validation mirrors the server's, but the server is the authority;
  a rejected submission bounces the user back to the step that actually holds
  the error.
- `?ref=7K4Q2X` pre-fills the referral field, and
  `GET /api/referrals/[code]` resolves it live so the joiner sees
  "Invited by Adaeze Okoro" before they finish.
- Phone numbers are normalised to a canonical `+234XXXXXXXXXX` — tested,
  because a number that normalises two ways lets one person hold two accounts.

### 2.2 The INEC register (`public/geo/`)

Committed to the repo, so the site builds and deploys with no network:
**37 states, 774 LGAs, 8,809 wards, 176,623 polling units**, current as of the
2021 delimitation (including the 56,737 units created for the 2023 general
election).

- Members never type a place name — they pick from the list, so the register
  holds one spelling of every ward in the country.
- Every row carries **INEC's own delimitation code** (`28/06/07/003` becomes
  `OND-006-07-003`), and the server resolves a registration against that code,
  never against a ward's spelling.
- Loaded in two lazy levels: `public/geo/<state>.json` (5–40 KB) on state
  selection, `public/geo/pu/<LGA>.json` (2–60 KB) on LGA selection. Nobody
  downloads the country to fill in three dropdowns.
- Rebuilt by `npm run geo:build` ([scripts/build-geography.mjs](scripts/build-geography.mjs)).

### 2.3 Member portal (`/portal`)

Where signing in lands — deliberately *not* `/admin`, because most members hold
no seat.

- Name, membership number and verification state, immediately after sign-in
- **Photograph upload** with a live preview
- **Membership card** link
- **Referral card** — permanent code, QR/share link, 90-day growth chart of who
  they've brought in, and the list of those members
- **Verify by NIN** panel
- **Stand for office** — the vacancies in *their own* territory, with a 500-char
  statement, plus the status of applications already submitted

### 2.4 Membership card (`/portal/id-card`, `/admin/id-card`)

Drawn **once** as a string of SVG in [lib/idcard.js](lib/idcard.js) and used
three ways, so the printed card cannot drift from the on-screen one:

- inlined into the page,
- rasterised to print-resolution PNG by `sharp` (`GET /api/member/id-card`),
- served as vector SVG (`?format=svg`).

Print button works with JavaScript off. The QR code opens the register filtered
to that membership number — which requires a coordinator's login, so a scan by a
stranger lands nowhere. Explicitly **not** an identity document: no hologram,
no signature panel, no expiry.

### 2.5 Referrals

- Six-character codes over an alphabet that drops `0/O`, `1/I/L` and `U` — 729
  million codes, unambiguous over a phone line and in Montserrat, and no
  ordinary English word can be generated.
- Issued once at registration, **never reissued** (a rotating code stops working
  after the poster is printed). Stored uppercase, read case-insensitively.
- `npm run referrals:backfill` issues codes to pre-existing members.
- Leaderboards and growth series at member, territory and national level.

### 2.6 Photographs

Every uploaded image is **re-encoded from scratch** by `sharp`
([lib/photos.js](lib/photos.js)) — nothing a member uploads is ever served back
byte-for-byte. That rules out polyglot files and strips EXIF, which on a phone
photo carries GPS coordinates. Stored in Postgres (`MemberPhoto`) with a content
hash used as both the `?v=` and the ETag. Served through
`GET /api/members/[id]/photo`, which is scope-checked — member ids are
sequential, so a public photo endpoint would be an enumerable face directory.
The browser downscales to ~1024px before upload; a hard byte ceiling is applied
before a single byte reaches the decoder.

---

## 3. Authentication and security

### 3.1 Accounts and sessions

- **scrypt** password hashing at OWASP parameters (N=2¹⁶, r=8, p=1, 64-byte
  output) — memory-hard, no native dependency to build. The interface
  (`hashPassword`/`verifyPassword`) is the only thing that would change to move
  to Argon2id.
- Signed session cookie proves **identity only**. Every fact about *authority*
  — seat, tier, territory — is read from the database on every request, so a
  session issued while someone was State Coordinator stops granting that the
  moment they are removed.
- `GET /api/auth/session` exists so the masthead can be a client component
  without opting every marketing page out of static rendering.

### 3.2 Phone verification by OTP

Six-digit codes, HMAC-hashed on `SESSION_SECRET`, **five-minute expiry**,
single use, with an attempt cap. Purposes: `REGISTRATION`, `LOGIN`,
`PASSWORD_RESET`. The hash is not brute-force protection (a million codes
defeats any hash) — it is there so a leaked backup or a careless `SELECT`
cannot hand somebody a live code. HMAC rather than a slow KDF, deliberately:
scrypt on the hot path would be a denial-of-service vector.

### 3.3 Two-factor authentication (`/admin/security`, `/secure`)

- **TOTP**, hand-implemented and tested against **RFC 6238's published
  vectors** ([tests/totp.test.js](tests/totp.test.js)) — so every authenticator
  app agrees with it.
- QR enrolment, recovery codes, replay protection via `mfaLastStep`.
- **Mandatory at state level and above.** "Mandatory" means: sign-in still
  works, and the admin area shows nothing but the enrolment screen until it is
  set up. A coordinator locked out on election morning is a worse outcome than
  the risk.
- The gate lives **inside each page**, not in the layout — a redirecting layout
  does not stop the page underneath from rendering, and the earlier layout-level
  wall was shipping 292 KB of unscoped console data attached to a 307.

### 3.4 NIN handling

- **AES-256-GCM envelope encryption** at rest, plus a **blind index** (`ninHash`)
  so duplicates can be detected without decrypting anything.
- The NIN never leaves `POST /api/member/nin` in either direction — it arrives
  once and the response says only whether it worked. `publicMember` strips the
  ciphertext and returns `hasNin`.
- **If `NIN_ENCRYPTION_KEY` is unset, a submitted NIN is discarded rather than
  stored in plaintext.** Losing an optional field is recoverable; leaking a
  national identity number is not.
- No encrypted VIN or NIN appears in **any** CSV export, ever.

### 3.5 Rate limiting

[lib/ratelimit.js](lib/ratelimit.js) — one interface, two backends:
**Upstash Redis over REST** when `UPSTASH_REDIS_REST_URL` is set (shared across
every instance), otherwise an in-process `Map`. REST rather than a TCP client
because a serverless instance living 200 ms cannot usefully own a connection
pool. A Redis failure **falls back rather than refusing** — a limiter that takes
the site down when its own dependency blinks is a worse outage than the attack.

### 3.6 Password reset (`/reset`)

Two steps through one route (`/api/auth/reset`): OTP to the registered phone,
then a new password held to the same strength rule the join form applies.

### 3.7 Transport and headers

Set in [next.config.mjs](next.config.mjs): `X-Content-Type-Options: nosniff`,
`X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
a `Permissions-Policy` denying camera/microphone/geolocation/FLoC, and
`Cache-Control: private, no-store` on everything under `/admin` and `/portal`.
`remotePatterns` is empty — there is no remote image host to fetch from.
`DATABASE_URL` is documented to require `sslmode=verify-full`, not the
`sslmode=require` Neon hands out.

### 3.8 Audit log

`AuditLog` records actor, action, entity, scope, **before and after state** as
JSON, and IP address. Readable by admins at LGA level and above
(`viewAudit`); the full feed and CSV export sit in the national console.

### 3.9 Error reporting

[lib/report.js](lib/report.js) — one door, a driver behind it. With no
`SENTRY_DSN` it writes one **structured JSON line** per error, which every
hosting platform's log viewer can already search and alert on; set the DSN and
the same errors also go to Sentry. Wired to Next's `onRequestError` in
[instrumentation.js](instrumentation.js), which deliberately does **not** attach
headers or bodies — an error report is not a place to accumulate session
cookies.

---

## 4. Appointments and applications

### 4.1 Appointments (`/admin/appointments`)

Filling and emptying seats **through the application**, which previously
required a terminal and the database URL. A movement whose Ward Coordinators
cannot appoint their own booth agents has a spreadsheet, not a structure.

- `GET /api/admin/appointments?seat=<id>&q=<name>` — who this actor may appoint
- `POST { seatId, memberId }` — appoint
- `POST { seatId, release }` — end the current appointment
- **One active appointment per member**, enforced by a partial unique index in
  the migration as well as by the check (the check has a race; the index does
  not).
- **Nothing is ever deleted.** Ending an appointment sets `endDate`,
  `endReason` (`INACTIVITY`, `MISCONDUCT`, `ANTI_PARTY_ACTIVITY`,
  `RESTRUCTURING`, `RESIGNATION`, `TRANSFER`, `OTHER`) and `status` — so a
  succession dispute is settled by looking rather than by arguing.

### 4.2 Applications (`/api/applications`)

A member may put themselves forward for any vacancy **in their own territory**.

- Applying is not getting: it places a row in the approving officer's queue and
  confers no office, no priority and no entitlement. The officer may appoint
  somebody who never applied.
- **72-hour SLA** — `slaDueAt` is stored (so "what is overdue" is an index
  scan). Nothing happens automatically when it passes; it goes red on the
  officer's screen, which is the pressure the rule is actually for. An
  auto-approving timer would be exactly the entitlement the design refuses.
- Full status machine (`DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`,
  `REJECTED`, `ESCALATED`, `WITHDRAWN`) with an `ApplicationEvent` trail of
  every transition and its actor.

---

## 5. Election returns — the parallel vote tabulation

Fully documented in **[docs/results-pipeline.md](docs/results-pipeline.md)**
(624 lines, from the booth to the map).

### 5.1 What the numbers are

MAP's **own agents' returns** from the polling units they were appointed to — a
parallel vote tabulation, the thing party agents and observer missions have done
in Nigerian elections for decades. **They are not INEC's results**, and that is
enforced by the schema, not a footer: where an agent can also read INEC's
declared figure it goes in its **own columns** (`inecAccredited`,
`inecTotalVotes`) and is never merged with the agent's count.

Two rules that follow, applied everywhere:

- **Silence is not zero.** A unit nobody reported from is grey and labelled
  "no returns yet" — never in a party's colour, never as a low number.
- **Coverage travels with every total.** A leader with 4% of units in is not a
  leader, and every published figure sits next to the share of booths it is
  drawn from.

### 5.2 Filing a return (`/admin/election`)

- Available to exactly one office: the **Polling Unit Coordinator** standing at
  the booth. Nobody above them may enter a result — the entry is hidden and the
  form refuses them server-side.
- The polling unit is **read from the appointment**, never from the request. A
  form field naming the booth would be a form field somebody could change.
- Per-party vote entry, plus registered voters, accredited voters and rejected
  ballots, with arithmetic guards.
- A **location tick** and a terms acceptance, stored as `locationConfirmed` /
  `termsAccepted` — a declaration by a named person, kept as evidence, not
  offered as a security control.
- **Photograph of the EC8A result sheet** is required — downscaled in the
  browser, re-encoded server-side, stored in `ResultSheet` with a content hash
  that is both the ETag and the proof the image served today is the one
  submitted on election night. Served by `GET /api/results/[id]/sheet`.
- **Offline draft** ([lib/draft.js](lib/draft.js)): every keystroke is written
  to `localStorage`, and the prepared photo blob to **IndexedDB** (which stores
  Blobs natively). Nothing is cleared until the server confirms the write. A
  crashed tab, a dead battery, a walk out of signal and back — the figures are
  still there. This exists for the one moment in the product where a person is
  least able to do the job twice.
- **A booth reports once** — unique on `(electionId, pollingUnitId)`. A
  correction amends the row; it never adds a second.

### 5.3 Review, verification and disputes (`/admin/results`)

- `POST /api/results/[id]` — a coordinator above the agent checks the figures
  against the sheet photograph and marks the return `VERIFIED` or `DISPUTED`,
  with a note.
- **A disputed return is kept, never deleted.** A disputed return is evidence,
  and deleting it would be the single most suspicious thing the system could do.
  `resultsWhere` is what keeps `DISPUTED` rows out of published totals — tested
  in [tests/elections.test.js](tests/elections.test.js).

### 5.4 Constituency-aware aggregation

Only a presidential election has one ballot nationwide.
[lib/constituencies.js](lib/constituencies.js) models the three that don't:

| Election | Contested in | Count |
|---|---|---:|
| Governorship | One state | 37 |
| Senate | Senatorial district (whole LGAs) | 109 |
| House of Reps | Federal constituency (mostly whole LGAs; some split one) | 360 |

The split case is why membership is a **pair of join tables** —
`ConstituencyLga` and `ConstituencyWard`. Aggregating by the state column
instead would report the whole of Kano as the result of each of its three
senatorial districts: three wrong answers where there should be three different
right ones.

### 5.5 Reading the returns

Every result row carries its ward, LGA and state **denormalised**, written by
the server from the polling unit. "Votes per party in Rivers" is therefore one
grouped scan of an indexed column, not a four-table join over 176,623 rows —
and the same query shape serves all five levels by changing one field name.

[lib/elections.js](lib/elections.js) exports:
`resultsWhere` (the scope + status filter), `tally` (totals for one place),
`breakdown` (the units one level below), `reporting` (coverage),
`latestReturns` (the ticker), `divergence` (agent count vs INEC), and
`currentElection` / `electionsOnOffer`.

### 5.6 Public results (`/results`)

| Route | Shows |
|---|---|
| `/results` | The federation — national tally, coverage, the map of 37 states |
| `/results/zone/[code]` | One geopolitical zone, its states drawn |
| `/results/[state]` | A state, drilling down through LGA → ward → polling unit |
| `/results/gap` | **Where the figures disagree** — agent count vs INEC declaration |

- Live, `revalidate = 0`, with a `LiveRefresh` component polling every 45–60 s.
- **Choropleth maps** rendered as inline SVG from pre-projected outlines
  ([lib/shapes.js](lib/shapes.js), built by
  [scripts/build-map.mjs](scripts/build-map.mjs)). Projection, name matching and
  bounding-box maths are decided once for all three levels.
- **Colour is never the only encoding** — every figure is also given as text
  and as a share of units reporting.
- A **results band on the homepage** shows the real numbers rather than a link:
  on the night, the homepage is where people land first, and what they want is
  one look at who is ahead and how much is in.

---

## 6. The secretariat dashboard (`/admin`)

Every page calls `guard()` as its **first statement**, before any query — the
repetition is deliberate, because a page missing the line is obvious in review
while a page trusting its parent looks fine. Navigation is filtered by tier and
capability, and every entry lands on a page that exists and reads real data.

| Page | What it does | Who sees it |
|---|---|---|
| `/admin` | Coverage, growth, own seats, newest members | Any seat |
| `/admin/results` | Live returns, scoped to the reader's territory | Any seat |
| `/admin/election` | **File a return** — the one entry surface | `PU_AGENT` only |
| `/admin/leadership` | Coordinator directory, vacancies listed too | Any seat |
| `/admin/appointments` | Fill and release seats | Approvers |
| `/admin/members` | The register, paginated and searchable | Any seat |
| `/admin/members/[id]` | One member's full record | Any seat |
| `/admin/lga-coordinators` | The LGA executive across the territory | Above LGA |
| `/admin/referrals` | Growth, and who is driving it | Any seat |
| `/admin/broadcast` | Bulk SMS to the territory | `broadcast` capability |
| `/admin/analytics` | Growth, verification split, structure fill | Any seat |
| `/admin/polling-units` | PU tracker — units and members at each | LGA and Ward |
| `/admin/structure` | Every seat, filled or vacant | Any seat |
| `/admin/id-card` | Own membership card without leaving the dashboard | Any seat |
| `/admin/security` | Own 2FA settings | Any seat |
| `/admin/console` | **Everything, nationwide** | `viewNationwide` |

Two entries are hidden where they are not tools: the PU tracker is a working
list of 40 units in a ward and not of 176,623 in the country; LGA Coordinators
is meaningless to an LGA Coordinator.

### 6.1 The national console (`/admin/console`)

[lib/console.js](lib/console.js) answers "what is the state of the entire
platform" — a different question from the scoped dashboards, with a different
audience: the National Coordinator, the Director of Media & IT, and whoever is
awake at 3am on election night. **It has no scope filters at all**, which is the
whole risk of the file, so there is exactly one page and one export route
consuming it and both check `can(scope, "viewNationwide")` first.

Sections: the register · ninety-day growth · newest registrations ·
**integrity** checks · coverage of the federation (states / LGAs / wards /
polling units reached) · every state in a table · the structure · election
operations · referrals · broadcasts (sent, delivered, refused, SMS credits
spent) · accounts and security · audit trail · table sizes.

### 6.2 CSV export (`/api/admin/export/[dataset]`)

Datasets: `members`, `states`, `seats`, `returns`, `referrals`, `audit`.
**No encrypted VIN or NIN in any of them, ever** — the fields are
envelope-encrypted precisely so an export cannot become the breach, and a column
of ciphertext in a spreadsheet is a column somebody will eventually try to
decrypt.

---

## 7. Bulk SMS (`/admin/broadcast`)

### 7.1 The one rule

**The recipient list is never sent by the browser.** It is derived on the server
from the sender's seat, every time, through the same `memberScopeWhere()` every
other query uses. A Ward Coordinator cannot text the state by posting a longer
list, because there is no list in the request to lengthen.

### 7.2 What it does

- Live recipient count, live cost, and a paginated **disclosure of the actual
  numbers** (200 per page; CSV for anything larger).
- Optional "verified members only" filter. **Rejected members are excluded from
  every audience regardless of what the sender selects.**
- **Billable segment counting** worked out at send time from the encoding and
  stored on the row, because the price is `segments × recipients` and the
  gateway's invoice arrives a month later. Tested.
- Batched sending with live progress polled from
  `GET /api/admin/broadcast/[id]` — itself scoped, so a coordinator can only
  watch a send from inside their own territory.
- Status machine: `QUEUED` → `SENDING` → `SENT` / `PARTIAL` / `FAILED`, with the
  gateway's own error text and up to fifty refused numbers kept (bounded, so a
  universal failure cannot write the register into one row).
- **History is denormalised on purpose** — `scopeLabel` records the territory as
  it was at the moment of sending, so moving or removing the sender later cannot
  change the record of who a message went to.
- A coordinator sees every broadcast sent from beneath them, not only their own.

### 7.3 Gateways

One door, drivers behind it ([lib/sms.js](lib/sms.js)):
**Termii**, **Africa's Talking**, or `console`.

With nothing configured the page still works — count, cost and recipient list
are all live — and the send button **refuses with the name of the missing
variable**. It never pretends to have sent: a tool that reports "sent to 4,312
members" when nothing left the building is worse than no tool at all, because
somebody will believe it and stop making phone calls.

---

## 8. The public campaign site

| Route | Content |
|---|---|
| `/` | Hero slider, live results band with mini map, news preview, take-part rail |
| `/about` | The movement, the mission |
| `/leaders` | Our Leaders: both men introduced as equals, their records as figures, and a shared career timeline; in the masthead as a dropdown to the two profiles |
| `/about/atiku` | "Who is Atiku" — bio, offices and stated positions |
| `/about/amaechi` | "Who is Amaechi" — bio and the record, from one source |
| `/leader` | Leadership timeline |
| `/planforchange` | The Amaechi Agenda |
| `/governance` | Policy pillars |
| `/structure` | The six tiers, the offices, and a state → zone lookup |
| `/media` | The activity calendar, photographs from the field and video, on one page with three anchors (`#activities`, `#photographs`, `#video`) and a sticky section rail; `/activities`, `/gallery` and `/videos` redirect here |
| `/news` | Newsroom, sharing one source with the homepage preview |
| `/connect` | Find your chapter |
| `/contact` | Secretariat and zonal offices |
| `/support` | Campaign support |
| `/join`, `/registration` | Registration |
| `/login`, `/reset`, `/secure` | Auth |
| `/privacy`, `/terms` | Legal |

Design principles held throughout:

- **Nothing invented.** No officer names, secretariat address or founding date
  appears anywhere they were not supplied. Slots needing the Secretariat are
  marked `pending` and render as an honest "position vacant / to be announced"
  rather than placeholder text that looks like data.
- **One source per fact.** Site chrome in [lib/site.js](lib/site.js), the
  movement's structure in [lib/map.js](lib/map.js), the aspirant's record in
  [lib/amaechi.js](lib/amaechi.js), newsroom in [lib/news.js](lib/news.js) — so
  a figure cannot drift between the hero, the profile and the plan.
- Navigation is rooted absolutely in one place, after relative `href`s broke on
  every nested route.
- Built for the small Android screens most visitors arrive on.

---

## 9. Data model

**Geography (seeded, never written at runtime):** `Zone`, `State`, `Lga`,
`Ward`, `PollingUnit`

**People:** `User`, `OtpCode`, `Member`, `MemberPhoto`

**Structure:** `RoleDefinition`, `Seat`, `Appointment`, `Application`,
`ApplicationEvent`

**Elections:** `Party`, `Election`, `Candidate`, `Constituency`,
`ConstituencyLga`, `ConstituencyWard`, `PollingUnitResult`, `ResultVote`,
`ResultSheet`

**Operations:** `Broadcast`, `AuditLog`

Ten migrations, from `init` through polling-unit delimitation codes, member
photos, referral codes, PU tiers, election results, broadcasts, the NIN blind
index and MFA.

---

## 10. Operations

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` / `npm start` | Production build and serve |
| `npm run lint` | ESLint |
| `npm test` | Node's built-in test runner |
| `npm run db:migrate` | `prisma migrate deploy` |
| `npm run db:seed` | Seed / reconcile all reference data |
| `npm run db:studio` | Prisma Studio |
| `npm run geo:build` | Rebuild `public/geo` from the INEC source |
| `npm run referrals:backfill` | Issue codes to members without one |

Plus [scripts/build-map.mjs](scripts/build-map.mjs) (map outlines),
[scripts/seed-constituencies.mjs](scripts/seed-constituencies.mjs) and
[scripts/seed-election.mjs](scripts/seed-election.mjs).

### Seeding

`npm run db:seed` writes 8,809 wards, 176,623 polling units and 92,184 seats.
It is **idempotent and reconciling** — run it again after any change to
`public/geo` and it applies the difference rather than duplicating.
`-- --dry-run` reports what it would do and writes nothing.

### Demo accounts

[prisma/demo.mjs](prisma/demo.mjs) creates one account per rung of the
structure — National Coordinator (Super Admin) down to a Polling Unit
Coordinator and a member with no seat — for walking the dashboards and for
checking that the Edo and Rivers coordinators cannot read each other.
`node prisma/demo.mjs --remove` deletes them and frees their seats.

### Configuration

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | **Pooled** Postgres, `sslmode=verify-full` |
| `SESSION_SECRET` | Yes | Signs session cookies; also keys OTP HMAC |
| `NIN_ENCRYPTION_KEY` | Recommended | AES-256-GCM, 32 bytes base64; NIN discarded if unset |
| `SMS_PROVIDER` / `SMS_SENDER_ID` | For sending | `termii` \| `africastalking` \| `console` |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Multi-instance | Shared rate-limit window |
| `SENTRY_DSN` | Optional | Error reporting; structured JSON logs otherwise |

### Tests

Node's built-in runner, no framework. Five suites covering the things whose
failure modes are invisible until they matter:

- [tests/permissions.test.js](tests/permissions.test.js) — the Descendant Rule
- [tests/appointments.test.js](tests/appointments.test.js) — the approval chain
- [tests/auth.test.js](tests/auth.test.js) — hashing, phone normalisation,
  registration validation, SMS segmentation
- [tests/elections.test.js](tests/elections.test.js) — the result filter and the
  arithmetic guards
- [tests/totp.test.js](tests/totp.test.js) — RFC 6238 vectors

### Deployment

Any Node host that can run `next build` and reach Postgres. `sharp` is a
**runtime** dependency, not just a build one — the membership card is rasterised
on the server. Note that Prisma's migration advisory lock is not honoured by
PgBouncer in transaction mode: if `migrate deploy` times out with `P1002`, run
it with `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=true` or against the unpooled URL.

---

## 11. Conventions

- **Server-only modules** — `lib/auth.js`, `lib/permissions.js`, `lib/store.js`,
  `lib/dashboard.js`, `lib/console.js`, `lib/referrals.js`, `lib/idcard.js`,
  `lib/results.js`, `lib/elections.js`, `lib/shapes.js`, `lib/mfa.js`,
  `lib/otp.js`, `lib/broadcast.js`. Never imported into a client component.
- **Scope checks are server-side, always.** Hiding a button is not a permission.
- **No BigInt escapes a query module** — a BigInt crossing into a React tree
  throws at render and names the component rather than the query.
- **Files carry their reasoning in a header comment.** If a decision looks odd,
  the reason it was made that way is written directly above it.
