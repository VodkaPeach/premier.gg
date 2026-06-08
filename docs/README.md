# premier.gg

VALORANT Premier match analysis. Phase 0 runs entirely on mock fixtures behind a
**data-source seam**: swapping mock data for the real Riot API in Phase 1/2 is a one-class
change (`MockMatchSource` → `RiotMatchSource`) behind the `MatchSource` interface.

See `docs/roadmap.md` for the full phase plan.

## Run the app (Phase 0)

```
pnpm install
pnpm dev          # http://localhost:3000
```

- `/` — match list (mock data, via the seam)
- `/matches/<id>` — parsed match detail (e.g. `/matches/m-0001`)

## Phase 1 demo

A clickable mock demo of the full product surface. Everything runs on **Phase 0 fixtures**
plus a **simulated** Riot Sign On — there is no real Riot API call or login yet. A cookie
(`pg_demo_linked`) is set during the simulated link to mark the demo account "linked", and the
gated screens (dashboard, settings, match detail) check it via `src/lib/auth.ts`.

User flow:

```
Landing      /                  → marketing entry point
Consent      /connect           → opt-in / consent gate
Simulated    /connect/riot      → stand-in for Riot Sign On (sets the linked cookie)
Success      /connect/success   → link confirmation
Dashboard    /dashboard         → team + player analytics
Match detail /matches/<id>      → per-match breakdown (e.g. /matches/m-0001)
Settings     /settings          → account + data-deletion controls
```

Plus a public profile at `/team/mock-esports` and legal pages at `/privacy` and `/terms`.

- **Mock data + simulated RSO:** all numbers come from the seeded fixtures; the "linked" state
  is just a cookie, so no Riot credentials, OAuth, or live endpoints are involved.
- **Theme & locale:** a dark "modern analytics" theme; EN-only for now but **i18n-ready** via
  `next-intl` (strings live in `src/i18n/en.json`).
- **Analytics:** every stat shown is computed from fixtures by `src/analytics/` (team, player,
  match), keeping the UI free of derivation logic.

See `docs/deploy.md` for deploying this demo, and `docs/application/` for the Riot application
materials (answers + walkthrough script).

## Scripts

```
pnpm dev          # Next.js dev server
pnpm build        # production build
pnpm test         # vitest (parser invariants + manifest reader)
pnpm typecheck    # tsc --noEmit
pnpm lint         # next lint
pnpm fixtures     # regenerate seeded fixtures (deterministic, seed 1337)
```

## Code layout

```
src/
  match-source/      the seam
    riot-dto.ts        raw val-match-v1 MatchDto types (the wire contract; fixtures conform)
    index.ts           MatchSource interface + MatchlistEntry
    mock-match-source.ts  reads fixtures/ (Phase 0). RiotMatchSource mirrors this in Phase 1.
  domain/            parsed model the UI + analysis consume (never the raw DTO)
    types.ts
    parse-match.ts     pure RiotMatchDto -> Match transform (derivations happen here, once)
  geo/calibration.ts   per-map world<->minimap transforms (forward + inverse)
  content/content-map.ts  agent / map / weapon UUID -> name resolution
  fixtures/            seeded generator + emitted mock world
    generate.mjs       deterministic (seed 1337); emits matches/, matchlist, manifest
  analytics/           pure stat derivation from fixtures (UI consumes the results)
    team.ts            team-level aggregates
    player.ts          per-player aggregates
    match.ts           per-match breakdown
  components/          Phase 1 UI building blocks
    charts/            SVG chart primitives + geometry.ts (pure layout math)
    positional/        MatchMap + per-map backdrops (uses geo/calibration)
    (chrome)           AppHeader, MarketingHeader, Footer, Card, StatCard, Disclaimer
    legal/             LegalPage shell for /privacy + /terms
  i18n/                next-intl setup (EN-ready)
    en.json            all UI strings
    messages.ts        request.ts  loader + per-request config
  lib/
    match-source.ts    getMatchSource() — the single Phase 2 swap point
    manifest.ts        reads manifest.json for list metadata
    auth.ts            simulated-link helpers (pg_demo_linked cookie, requireLinked)
  app/                 Next.js routes
    page.tsx           / landing
    connect/           /connect, /connect/riot (sim RSO), /connect/success
    dashboard/         /dashboard
    matches/[id]/      /matches/<id> detail
    settings/          /settings
    team/[slug]/       /team/<slug> public profile
    privacy/  terms/   legal pages
tests/
  parse-match.test.ts  invariants over a generated fixture
```

Analytics, i18n, charts geometry, and auth each ship co-located `*.test.ts` files
(run by `pnpm test`).

## Phase 1 swap

Implement `RiotMatchSource` against the `MatchSource` interface (auth header, base URL,
rate-limit/backoff) and branch on it inside `src/lib/match-source.ts` (`MATCH_SOURCE=riot`).
Parser, analysis, UI, and tests are unchanged.

## Fidelity caveats (verify in Phase 1)

DTO field names were validated (2026-06-05) against an official `val-match-v1` sample response —
`puuid`, `queueId`, `gameTime`/`roundTime`, `playerLocations`, `victimLocation`, plant/defuse coords
all match. ⚠️ Model against the **official developer API**, *not* the in-game **client API** that
community docs (e.g. techchrism's valapidocs) describe — that one uses different names (`subject`,
`queueID`, `timeSinceRoundStartMillis`).

- Agent / weapon / armor / map UUIDs in `content/content-map.ts` are real published values but
  should be re-synced from `val-content-v1` once you have API access.
- **Unverified (day-1 task after approval):** (a) that Premier matches surface via
  `matchlists/by-puuid` at all, and (b) the Premier `queueId` value — the official sample shows
  `"unrated"`; Premier's value is undocumented, so the fixtures' `queueId: "premier"` (and the
  `queueId === "premier"` filter in the list route) is a provisional assumption.
- **Policy constraints** (see `docs/roadmap.md` — B-scout, B-consent): Riot prohibits pre-match
  "scouting", and requires player opt-in to display stats. These shape the opponent feature and the
  consent model — they are product/legal decisions, not code caveats.
