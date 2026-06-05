# Phase 0 — App shell design

**Date:** 2026-06-05
**Status:** Approved (brainstorming) — ready for implementation plan
**Scope owner:** Phase 0 "Foundations & seam" (see `docs/roadmap.md`)

## Goal

Finish Phase 0 by standing up the real Next.js application around the already-authored
data-source seam. The seam, parser, fixtures, and test under `docs/` are complete; what's
missing is an app that runs them.

**Exit criteria (from the roadmap):**
- `dev` server boots
- tests green
- a page renders a parsed fixture

## Decisions (locked during brainstorming)

| Decision | Choice | Rationale |
|---|---|---|
| Scaffold scope | **Minimal-to-exit** | Prisma/Postgres/CI are not exercised until Phase 2 (real ingestion). YAGNI — defer them. |
| Package manager | **pnpm** | Standard for modern Next.js; fast, disk-efficient. |
| Demo shape | **Approach B — lean vertical slice** | Two real routes (list + detail) through the seam. Mirrors the eventual dashboard IA so Phase 1 extends rather than replaces it. |
| `docs/` `.ts` files | **Move into `src/`** | `docs/` becomes prose-only; `src/` is the real app. No cross-directory imports into `docs/`. |

**Explicitly deferred (not in this scope):** Prisma/Postgres, CI (GitHub Actions),
i18n (next-intl), Auth.js/RSO, styling/design system, ECharts, any Phase 1 screens
(landing, consent, dashboard polish).

## Architecture

### Repo layout (after this work)

```
src/
  match-source/   # moved verbatim from docs/match-source
    riot-dto.ts
    index.ts            # MatchSource interface + MatchlistEntry
    mock-match-source.ts
  domain/         # moved from docs/domain
    types.ts
    parse-match.ts
  geo/
    calibration.ts
  content/
    content-map.ts
  fixtures/       # moved from docs/fixtures
    generate.mjs
    manifest.json
    matchlist.<puuid>.json
    matches/<matchId>.json
  lib/
    match-source.ts     # getMatchSource() factory — the single Phase 2 swap point
    manifest.ts         # tiny reader for fixtures/manifest.json (list metadata)
  app/
    layout.tsx
    page.tsx                  # match list (server component)
    matches/[id]/page.tsx     # match detail (server component)
tests/
  parse-match.test.ts   # moved from docs/tests
docs/                    # prose only after this: README.md, plan/, superpowers/specs/
  README.md             # updated to point at src/ instead of docs/ for code
  plan/roadmap.md
```

The seam code is **relocated, not rewritten**. Import paths update from relative
`../` chains to whatever the moved structure requires (kept identical depth where possible,
so most imports are unchanged).

### Data flow

```
Route (server component)
  -> getMatchSource()                # lib/match-source.ts factory
  -> MockMatchSource.getMatchlist()  # list route: matchlist + manifest
     / .getMatch(id)                 # detail route
  -> parseMatch(dto)                 # detail route only
  -> rendered HTML
```

- **List route (`/`)**: reads `fixtures/manifest.json` (captain puuid, team, per-match
  map/opponent/result/score) plus the matchlist entries. Renders a list of 5 matches with
  links to detail. It does **not** parse all 5 matches just to list them — the manifest
  already carries the summary metadata.
- **Detail route (`/matches/[id]`)**: `getMatch(id)` → `parseMatch` → renders the parsed
  `Match` (score, teams, 10 players with K/D/A/agent, round count). This is the route that
  proves the full seam → parser → UI path.

### The swap point

`lib/match-source.ts` is the only place that constructs a source:

```ts
export function getMatchSource(): MatchSource {
  // Phase 2: if (process.env.MATCH_SOURCE === "riot") return new RiotMatchSource(...)
  return new MockMatchSource();
}
```

Phase 2 adds the `riot` branch here and changes nothing upstream. `.env.example` documents
`MATCH_SOURCE=mock`.

## Tooling

- **pnpm** workspace (single package).
- **Next.js** (App Router) + **TypeScript** (`strict: true`).
- **ESLint** (Next.js config) + **Prettier**.
- **vitest** — the moved `tests/parse-match.test.ts` runs as-is (it reads fixtures from disk).
- `package.json` scripts:
  - `dev` — `next dev`
  - `build` — `next build`
  - `lint` — `next lint`
  - `typecheck` — `tsc --noEmit`
  - `test` — `vitest run`
  - `fixtures` — `node src/fixtures/generate.mjs` (regenerate seeded fixtures)

Fixtures are read from disk at runtime by `MockMatchSource`; routes run on the Node.js
runtime (not Edge) so filesystem access works.

## Testing & verification

The Phase 0 exit is verified by:

1. `pnpm install` succeeds.
2. `pnpm fixtures` regenerates deterministically (seed 1337 — no diff vs committed fixtures).
3. `pnpm test` — `parse-match.test.ts` green (the existing invariants over `m-0001`).
4. `pnpm typecheck` and `pnpm lint` clean.
5. `pnpm dev` boots; `/` lists the 5 fixture matches; `/matches/m-0001` renders the parsed
   Ascent Premier match (10 players, 5 per side, score, rounds).

No new test logic is introduced in this phase beyond relocating the existing test — the
analysis/UI tests belong to Phase 3+. Manual route verification covers the "page renders a
parsed fixture" criterion.

## Risks & notes

- **Import path churn** when moving files. Mitigated by preserving the same nesting depth
  under `src/` as under `docs/`, so most relative imports are unchanged.
- **`generate.mjs` output paths** must be updated to write into `src/fixtures/` after the
  move; verify a regenerate produces no diff.
- **README drift**: `docs/README.md` currently documents the seam as living in `docs/`. It
  must be updated to reflect that code now lives in `src/` (the seam *concept* is unchanged).
- Nothing here touches the seam contract, the parser, or the fixture data shape — those
  remain the stable foundation Phases 1–6 build on.
