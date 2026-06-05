# premier.gg

VALORANT Premier match analysis. Phase 0 runs entirely on mock fixtures behind a
**data-source seam**: swapping mock data for the real Riot API in Phase 1/2 is a one-class
change (`MockMatchSource` → `RiotMatchSource`) behind the `MatchSource` interface.

See `docs/plan/roadmap.md` for the full phase plan.

## Run the app (Phase 0)

```
pnpm install
pnpm dev          # http://localhost:3000
```

- `/` — match list (mock data, via the seam)
- `/matches/<id>` — parsed match detail (e.g. `/matches/m-0001`)

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
  lib/
    match-source.ts    getMatchSource() — the single Phase 2 swap point
    manifest.ts        reads manifest.json for list metadata
  app/                 Next.js routes (list + detail)
tests/
  parse-match.test.ts  invariants over a generated fixture
```

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
- **Policy constraints** (see `docs/plan/roadmap.md` — B-scout, B-consent): Riot prohibits pre-match
  "scouting", and requires player opt-in to display stats. These shape the opponent feature and the
  consent model — they are product/legal decisions, not code caveats.
