# docs/ — Phase 0 ⇄ Phase 1 seam scaffold

This directory holds the **data-source seam** for premier.gg: the contract that lets the
Phase 0 prototype run on mock data and Phase 1 swap in the real Riot API by changing
**one class only** (`MockMatchSource` → `RiotMatchSource`).

```
docs/
  match-source/      the seam
    riot-dto.ts        raw val-match-v1 MatchDto types (the wire contract; fixtures conform to these)
    index.ts           MatchSource interface + MatchlistEntry
    mock-match-source.ts  reads fixtures/ (Phase 0). RiotMatchSource will mirror this in Phase 1.
  domain/            parsed model the UI + analysis consume (never the raw DTO)
    types.ts
    parse-match.ts     pure RiotMatchDto -> Match transform (derivations happen here, once)
  geo/
    calibration.ts     per-map world<->minimap transforms (forward + inverse)
  content/
    content-map.ts     agent / map / weapon UUID -> name resolution
  fixtures/
    generate.mjs       deterministic generator (seeded) -> emits everything below
    manifest.json      describes the mock world
    matchlist.<puuid>.json
    matches/<matchId>.json
  tests/
    parse-match.test.ts  invariants over a generated fixture
```

## Regenerate fixtures
```
node docs/fixtures/generate.mjs
```
Deterministic (seed 1337) — same output every run, so fixtures double as regression test data.

## Phase 1 swap
Implement `RiotMatchSource` against the `MatchSource` interface (add auth header, base URL,
rate-limit/backoff), set `MATCH_SOURCE=riot`. Parser, analysis, UI, and tests are unchanged.

## Fidelity caveats (verify in Phase 1)
- Agent / weapon / armor / map UUIDs in `content/content-map.ts` are real published values but
  should be re-synced from `val-content-v1` once you have API access.
- That Premier matches return via `matchlists/by-puuid` with `queueId: "premier"` and the standard
  `MatchDto` is the day-1 validation task after RSO approval.
