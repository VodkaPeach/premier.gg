# Phase 0 App Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a runnable Next.js app around the existing data-source seam so the Phase 0 exit criteria pass: dev server boots, tests green, a page renders a parsed fixture.

**Architecture:** Promote the already-authored seam/parser/fixtures code from `docs/` into `src/`, add a single `getMatchSource()` factory (the Phase 2 swap point), and render two server-component routes — match list (`/`) and match detail (`/matches/[id]`) — both driven through the real `MatchSource` interface. No Prisma, no CI, no styling system (all deferred).

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript (strict), vitest, ESLint (next config), Prettier, pnpm.

**Design doc:** `docs/superpowers/specs/2026-06-05-phase-0-app-shell-design.md`

---

## File Structure

**Created:**
- `package.json`, `tsconfig.json`, `next.config.mjs`, `vitest.config.ts`, `.eslintrc.json`, `.prettierrc`, `.env.example` — tooling/config
- `src/app/layout.tsx` — root layout
- `src/app/page.tsx` — match list route
- `src/app/matches/[id]/page.tsx` — match detail route
- `src/lib/match-source.ts` — `getMatchSource()` factory (the swap point)
- `src/lib/manifest.ts` — reads `manifest.json` for list metadata
- `src/lib/manifest.test.ts` — unit test for the manifest reader

**Moved (via `git mv`, content otherwise unchanged):**
- `docs/match-source/*` → `src/match-source/*`
- `docs/domain/*` → `src/domain/*`
- `docs/geo/*` → `src/geo/*`
- `docs/content/*` → `src/content/*`
- `docs/fixtures/*` → `src/fixtures/*`
- `docs/tests/parse-match.test.ts` → `tests/parse-match.test.ts`

**Modified:**
- `src/match-source/mock-match-source.ts` — change the `FIXTURES` path to resolve from `process.cwd()` (survives Next bundling)
- `tests/parse-match.test.ts` — update relative import/fixture paths to point at `src/`
- `.gitignore` — ignore `next-env.d.ts` and `*.tsbuildinfo`
- `docs/README.md` — point at `src/` instead of `docs/` for code

---

## Task 1: Tooling & config scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `vitest.config.ts`, `.eslintrc.json`, `.prettierrc`, `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "premier-gg",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "fixtures": "node src/fixtures/generate.mjs"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "eslint": "^8.57.1",
    "eslint-config-next": "^15.1.0",
    "prettier": "^3.4.2",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
  },
});
```

- [ ] **Step 5: Create `.eslintrc.json`**

```json
{
  "extends": "next/core-web-vitals"
}
```

- [ ] **Step 6: Create `.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100
}
```

- [ ] **Step 7: Create `.env.example`**

```
# Data source for match ingestion. Phase 0 serves authored fixtures.
# Phase 2 will add MATCH_SOURCE=riot to switch to the real Riot API.
MATCH_SOURCE=mock
```

- [ ] **Step 8: Append to `.gitignore`**

Add these lines to the end of the existing `.gitignore`:

```
# Next.js generated types
next-env.d.ts
*.tsbuildinfo
```

- [ ] **Step 9: Install dependencies**

Run: `pnpm install`
Expected: completes, writes `pnpm-lock.yaml` and `node_modules/`.

- [ ] **Step 10: Commit**

```bash
git add package.json tsconfig.json next.config.mjs vitest.config.ts .eslintrc.json .prettierrc .env.example .gitignore pnpm-lock.yaml
git commit -m "chore: scaffold Next.js + vitest tooling for Phase 0 app shell

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Promote seam code into `src/`

**Files:**
- Move: `docs/{match-source,domain,geo,content,fixtures}` → `src/{...}`
- Modify: `src/match-source/mock-match-source.ts`

The seam code is relocated unchanged except for one runtime path: `MockMatchSource` resolves
fixtures relative to its own source file via `import.meta.url`, which breaks once Next.js bundles
the route (the path would point inside `.next/`). Resolve from `process.cwd()` instead.

- [ ] **Step 1: Move the code directories**

```bash
mkdir -p src
git mv docs/match-source src/match-source
git mv docs/domain src/domain
git mv docs/geo src/geo
git mv docs/content src/content
git mv docs/fixtures src/fixtures
```

- [ ] **Step 2: Verify nothing else references `docs/` for code**

Run: `grep -rn "docs/" src tests 2>/dev/null || echo "no docs/ references"`
Expected: `no docs/ references` (or only comment lines you will fix in Step 3).

- [ ] **Step 3: Update the `FIXTURES` path in `src/match-source/mock-match-source.ts`**

Replace the file's top section. Old:

```ts
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { MatchSource, MatchlistEntry } from "./index";
import type { RiotMatchDto } from "./riot-dto";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures");
```

New:

```ts
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { MatchSource, MatchlistEntry } from "./index";
import type { RiotMatchDto } from "./riot-dto";

// Resolved from the project root so the path survives Next.js server bundling
// (import.meta.url would resolve into .next/ at runtime). Run node/CLI from the repo root.
const FIXTURES = join(process.cwd(), "src", "fixtures");
```

Leave the `getMatchlist` / `getMatch` method bodies unchanged.

- [ ] **Step 4: Regenerate fixtures and confirm determinism**

The generator writes relative to its own location, so it now writes into `src/fixtures/` with no code change.

Run: `pnpm fixtures`
Expected: prints `Wrote 5 matches + matchlist + manifest to .../src/fixtures`.

Run: `git status --short src/fixtures`
Expected: no modified fixture files (only the moves from Step 1). Deterministic seed 1337 reproduces identical bytes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: promote seam code from docs/ into src/

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Move the parser test and get it green

**Files:**
- Move: `docs/tests/parse-match.test.ts` → `tests/parse-match.test.ts`
- Modify: `tests/parse-match.test.ts` (import + fixture paths)

- [ ] **Step 1: Move the test**

```bash
mkdir -p tests
git mv docs/tests/parse-match.test.ts tests/parse-match.test.ts
rmdir docs/tests 2>/dev/null || true
```

- [ ] **Step 2: Fix the test's paths**

Replace the header of `tests/parse-match.test.ts`. Old:

```ts
// Invariants over a generated fixture. Run with: npx vitest (after `node docs/fixtures/generate.mjs`).
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseMatch } from "../domain/parse-match";
import type { RiotMatchDto } from "../match-source/riot-dto";

const FIX = join(__dirname, "..", "fixtures");
const load = (id: string): RiotMatchDto =>
  JSON.parse(readFileSync(join(FIX, "matches", `${id}.json`), "utf8"));
```

New:

```ts
// Invariants over a generated fixture. Run with: pnpm test (after `pnpm fixtures`).
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseMatch } from "../src/domain/parse-match";
import type { RiotMatchDto } from "../src/match-source/riot-dto";

const FIX = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "fixtures");
const load = (id: string): RiotMatchDto =>
  JSON.parse(readFileSync(join(FIX, "matches", `${id}.json`), "utf8"));
```

Leave the five `it(...)` blocks unchanged.

- [ ] **Step 3: Run the test**

Run: `pnpm test`
Expected: PASS — `parseMatch over generated fixtures` with 5 passing tests.

- [ ] **Step 4: Run typecheck**

Run: `pnpm typecheck`
Expected: no errors. (`next-env.d.ts` does not exist yet; `tsc` tolerates the missing include entry. If it errors on the missing file, run `pnpm build` once to generate it, then re-run — but Task 6 will generate it anyway.)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: relocate parse-match test to tests/ and point at src/

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Match-source factory and manifest reader

**Files:**
- Create: `src/lib/match-source.ts`
- Create: `src/lib/manifest.ts`
- Test: `src/lib/manifest.test.ts`

- [ ] **Step 1: Write the failing manifest-reader test**

Create `src/lib/manifest.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { readManifest, matchSummary } from "./manifest";

describe("manifest reader", () => {
  it("reads the captain puuid and 5 match summaries", () => {
    const m = readManifest();
    expect(m.captainPuuid).toBe("mock-captain-0001");
    expect(m.matches).toHaveLength(5);
    expect(m.team.name).toBe("Mock Esports");
  });

  it("looks up a match summary by id", () => {
    const m = readManifest();
    const s = matchSummary(m, "m-0001");
    expect(s?.map).toBe("Ascent");
    expect(s?.result).toBe("win");
    expect(s?.opponent.name).toBe("Rival Squad");
  });

  it("returns undefined for an unknown match id", () => {
    const m = readManifest();
    expect(matchSummary(m, "nope")).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `pnpm test src/lib/manifest.test.ts`
Expected: FAIL — cannot resolve `./manifest`.

- [ ] **Step 3: Create `src/lib/manifest.ts`**

```ts
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface ManifestMatchSummary {
  matchId: string;
  map: string;
  result: "win" | "loss";
  score: string;
  opponent: { name: string; tag: string };
}

export interface ManifestRosterEntry {
  puuid: string;
  gameName: string;
  tagLine: string;
  agent: string;
}

export interface Manifest {
  captainPuuid: string;
  team: { name: string; tag: string; roster: ManifestRosterEntry[] };
  matches: ManifestMatchSummary[];
}

const MANIFEST_PATH = join(process.cwd(), "src", "fixtures", "manifest.json");

export function readManifest(): Manifest {
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
}

export function matchSummary(
  manifest: Manifest,
  matchId: string,
): ManifestMatchSummary | undefined {
  return manifest.matches.find((m) => m.matchId === matchId);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm test src/lib/manifest.test.ts`
Expected: PASS — 3 tests.

- [ ] **Step 5: Create the `getMatchSource()` factory `src/lib/match-source.ts`**

```ts
import { MockMatchSource } from "@/match-source/mock-match-source";
import type { MatchSource } from "@/match-source";

/**
 * The single swap point between Phase 0 (mock) and Phase 1/2 (real Riot data).
 * Phase 2 adds: if (process.env.MATCH_SOURCE === "riot") return new RiotMatchSource(...).
 */
export function getMatchSource(): MatchSource {
  return new MockMatchSource();
}
```

- [ ] **Step 6: Run the full suite**

Run: `pnpm test`
Expected: PASS — parse-match (5) + manifest (3).

- [ ] **Step 7: Commit**

```bash
git add src/lib
git commit -m "feat: add getMatchSource factory and manifest reader

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Root layout and match-list route

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Create `src/app/layout.tsx`**

```tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "premier.gg",
  description: "VALORANT Premier match analysis — Phase 0 mock demo",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, padding: 24, lineHeight: 1.5 }}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create `src/app/page.tsx`**

```tsx
import Link from "next/link";
import { getMatchSource } from "@/lib/match-source";
import { readManifest, matchSummary } from "@/lib/manifest";

export default async function HomePage() {
  const manifest = readManifest();
  const source = getMatchSource();
  const entries = await source.getMatchlist(manifest.captainPuuid);

  return (
    <main>
      <h1>{manifest.team.name} — Premier matches</h1>
      <p>
        {entries.length} matches · mock data{" "}
        <span style={{ color: "#888" }}>(not endorsed by Riot Games)</span>
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {entries.map((e) => {
          const s = matchSummary(manifest, e.matchId);
          return (
            <li key={e.matchId} style={{ margin: "8px 0" }}>
              <Link href={`/matches/${e.matchId}`}>
                <strong>{s?.map ?? e.matchId}</strong>
                {" — "}
                {s?.result ?? "?"} {s?.score ?? ""} vs {s?.opponent.name ?? "?"}
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
```

- [ ] **Step 3: Boot the dev server**

Run: `pnpm dev`
Expected: starts on http://localhost:3000 (this is the first run; Next generates `next-env.d.ts`).

- [ ] **Step 4: Verify the list renders**

Open http://localhost:3000 and confirm a list of 5 matches: Ascent (win 13-8 vs Rival Squad), Bind (loss 9-13 vs Team Two), Ascent (win 13-10 vs Rival Squad), Bind (win 13-6 vs Squad Three), Haven (loss 11-13 vs Four Gaming). Order follows the matchlist (most recent first). Stop the server (Ctrl-C).

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "feat: root layout and match-list route through the seam

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Match-detail route

**Files:**
- Create: `src/app/matches/[id]/page.tsx`

This is the route that proves the full seam → `parseMatch` → UI path (the Phase 0 exit criterion).

- [ ] **Step 1: Create `src/app/matches/[id]/page.tsx`**

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMatchSource } from "@/lib/match-source";
import { parseMatch } from "@/domain/parse-match";
import type { Side } from "@/domain/types";

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const source = getMatchSource();

  const dto = await source.getMatch(id).catch(() => null);
  if (!dto) notFound();
  const match = parseMatch(dto);

  const sides: Side[] = ["Blue", "Red"];
  return (
    <main>
      <p>
        <Link href="/">← all matches</Link>
      </p>
      <h1>
        {match.map} · {match.queue}
      </h1>
      <p>
        {match.teams.Blue.roundsWon}–{match.teams.Red.roundsWon} · {match.rounds.length} rounds ·
        patch {match.patch}
      </p>
      {sides.map((side) => (
        <section key={side}>
          <h2>
            {side} {match.teams[side].won ? "(won)" : ""}
          </h2>
          <table cellPadding={6} style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
                <th>Player</th>
                <th>Agent</th>
                <th>K</th>
                <th>D</th>
                <th>A</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {match.players
                .filter((p) => p.side === side)
                .map((p) => (
                  <tr key={p.puuid}>
                    <td>{p.riotId}</td>
                    <td>{p.agent}</td>
                    <td align="center">{p.kills}</td>
                    <td align="center">{p.deaths}</td>
                    <td align="center">{p.assists}</td>
                    <td align="center">{p.score}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  );
}
```

- [ ] **Step 2: Boot the dev server**

Run: `pnpm dev`
Expected: starts on http://localhost:3000.

- [ ] **Step 3: Verify the detail renders a parsed fixture**

Open http://localhost:3000/matches/m-0001 and confirm: heading "Ascent · premier", score "13–8", two tables (Blue/Red) of 5 players each (10 total) showing resolved agent names (e.g. "Jett", not a UUID) and K/D/A. Then open http://localhost:3000/matches/does-not-exist and confirm the Next 404 page. Stop the server (Ctrl-C).

- [ ] **Step 4: Verify production build succeeds**

Run: `pnpm build`
Expected: build completes without type or lint errors; generates `next-env.d.ts`.

- [ ] **Step 5: Commit**

```bash
git add src/app/matches
git commit -m "feat: match-detail route renders parsed fixture

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Update README and final exit verification

**Files:**
- Modify: `docs/README.md`

- [ ] **Step 1: Replace `docs/README.md` with the updated map**

```markdown
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

- Agent / weapon / armor / map UUIDs in `content/content-map.ts` are real published values but
  should be re-synced from `val-content-v1` once you have API access.
- That Premier matches return via `matchlists/by-puuid` with `queueId: "premier"` and the
  standard `MatchDto` is the day-1 validation task after RSO approval.
```

- [ ] **Step 2: Full exit verification**

Run each and confirm:

```bash
pnpm fixtures        # -> "Wrote 5 matches + matchlist + manifest"
git status --short src/fixtures   # -> no changes (deterministic)
pnpm test            # -> all tests pass (parse-match 5 + manifest 3)
pnpm typecheck       # -> no errors
pnpm lint            # -> no errors
pnpm build           # -> build succeeds
```

Then `pnpm dev` and confirm `/` lists 5 matches and `/matches/m-0001` renders the parsed Ascent match (10 players, resolved agent names, 13–8 score).

- [ ] **Step 3: Commit**

```bash
git add docs/README.md
git commit -m "docs: update README for Phase 0 app shell (code now in src/)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Done criteria

- [ ] `pnpm dev` boots
- [ ] `pnpm test` green
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm build` clean
- [ ] `/` renders the 5-match list through the seam
- [ ] `/matches/m-0001` renders a parsed fixture (10 players, resolved agent names, score, rounds)
- [ ] `docs/` is prose-only; all code lives under `src/` and `tests/`
- [ ] `getMatchSource()` is the single place a source is constructed (Phase 2 swap point)
