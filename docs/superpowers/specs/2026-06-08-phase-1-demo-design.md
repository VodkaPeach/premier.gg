# Phase 1 — Prototype shell + public demo design

**Date:** 2026-06-08
**Status:** Approved-to-proceed (design choices locked with user; implementation defaults noted)
**Roadmap:** Phase 1 / Milestone M2 (`docs/roadmap.md`)

## Goal

A deployed, clickable **mock-data demo** showing the full premier.gg user flow end-to-end, plus the
**application materials** (Riot production-key answers + a 60-second walkthrough) and **draft legal
pages**. The demo + narrative are what the Riot reviewer judges, so the bar is "a stranger
understands the product and trusts its data handling."

**Exit (roadmap):** demo is public (deployed), application is in Riot's queue. *Buildable here:* the
full demo + all artifacts, Vercel-ready. *Human-only handoff:* the actual Vercel deploy and the Riot
submission (the user's account + identity).

## Locked decisions

| Choice | Decision |
|---|---|
| Brand / look | **Modern dark analytics** — dark UI, original violet accent (ours, not VALORANT's), data-dense cards + charts; independent identity (supports B-name) |
| i18n | **EN only, i18n-ready** — all strings via `next-intl` `t()`, single `en.json`; ZH is a drop-in later (full locale routing deferred to Phase 6) |
| Analytics depth | **Representative + polished** — real metrics computed from Phase 0 fixtures; not the full Phase 3 catalog |
| Legal copy | **Draft full copy, marked "DRAFT — requires legal review"** |
| Demo structure | **Foundational** — the demo IS the app shell; Phase 3 fills analytics, Phase 2 swaps in real auth/data. Nothing throwaway |
| Charts | **Custom lightweight SVG** (bar/donut/area) for the demo; ECharts deferred to Phase 3 |
| Positional map | **Neutral original map backdrop** (not official Riot minimaps) — sidesteps B3 and the no-pre-approval-asset reality; points plotted via existing `toMinimap` |
| Auth | **Simulated** RSO (cookie-gated); real Auth.js/RSO is Phase 2 |
| Deploy | Built Vercel-ready; **user** runs the deploy + submits the application |

## Architecture

### Stack additions (on the Phase 0 Next.js app)
- **Tailwind CSS** + a design-token layer (`globals.css` CSS variables: bg/surface/border/text, violet
  accent; one display + one text font). Replaces Phase 0 inline styles.
- **next-intl** in EN-ready mode: `NextIntlClientProvider` at the root, messages from
  `src/i18n/en.json`, every visible string via `t('key')`. No `[locale]` route segment yet (keeps the
  demo simple); a `src/i18n/` structure that makes adding `zh.json` + a switcher a Phase-6 drop-in.
- **No new data layer** — everything flows through the existing `getMatchSource()` + `parseMatch`.

### Mock auth (cookie-gated)
- `POST` from the simulated-RSO screen sets a `pg_demo_linked=1` cookie (httpOnly not required; demo).
- App routes (`/dashboard`, `/matches/[id]`, `/settings`, profile) check the cookie in a server
  component / lightweight middleware; if absent → redirect to `/` (landing). Unlink/delete clear it.
- The "linked" identity is hardcoded to the fixture captain (`mock-captain-0001` / Mock Esports).

### Analytics module (`src/analytics/`)
A pure module computing the demo's representative metrics from `Match[]` — the seed of the Phase 3
engine, fixture-driven and unit-tested:
- Team: win% (W-L from fixtures), map pool W/L, atk/def round-win split, recent form (last N).
- Player (per roster member): K/D/A, ACS-ish score/round, per-match lines.
- Match: round timeline (win/loss by round, plant/defuse markers), economy summary.
Each function takes `Match[]` (or one `Match`) and returns a plain typed result. No UI in here.

### Charts (`src/components/charts/`)
Small SVG components: `BarRow`, `Donut`, `AreaTrend`, `SplitBar`. Themed via CSS variables. Pure,
prop-driven, no client deps. Used by dashboard + match detail.

### Positional map (`src/components/positional/`)
`MatchMap` renders a neutral SVG map backdrop (a stylized, original site/lane sketch per map key — NOT
a Riot asset) sized to a unit square; plots kill/plant points by passing each event's world `loc`
through `toMinimap(loc, MAP_CALIB[map])` (existing `geo/calibration.ts`). Legend for kill/plant/defuse.
Surfaces the "event points, not continuous tracks" caveat in-UI.

## Screens (1–8)

Mock auth gates 5–8 behind the simulated login. Shared `AppHeader` (logo, nav, language stub,
account menu) on app screens; a lighter marketing header on 1–4.

1. **Landing** (`/`) — hero value prop ("Review your VALORANT Premier matches — your team, your
   opponents, your positions"), primary CTA "Sign in with Riot *(demo)*", the **not-endorsed-by-Riot**
   notice in the footer, links to `/privacy` + `/terms`, an "it's a mock demo" banner.
2. **Consent / opt-in** (`/connect`) — plain-language explanation: what we read (your own Premier
   match history), what we show (your team + opponents you've played), the **single-captain** model,
   own-history-only / no-search framing; an explicit **opt-in checkbox** (required to proceed) + a
   privacy link. Continue → simulated RSO.
3. **Simulated RSO** (`/connect/riot`) — a clearly-labeled **mock** "Riot Sign On" card (not real
   credentials; a disabled-looking demo form + "Authorize (demo)" button). Authorize → sets cookie.
4. **Link success** (`/connect/success`) — "Account linked" confirmation, summary of what was
   imported (mock: "5 Premier matches"), CTA → dashboard.
5. **Dashboard** (`/dashboard`) — Mock Esports overview: stat cards (win%, K/D, atk WR, maps),
   map-pool bars, atk/def split, recent-form dots, recent-matches list (links to detail). All computed
   by `src/analytics/` from fixtures.
6. **Match detail** (`/matches/[id]`) — upgrades the Phase 0 route to the dark theme: header (map,
   score, result), the two-team scoreboard (existing parsed data), a **round timeline**, an **economy**
   summary, and the **positional kill/plant map** (`MatchMap`). Back to dashboard.
7. **Settings** (`/settings`) — language stub; **unlink** (clears cookie → landing) and
   **delete my data** (mock confirm dialog → clears cookie → landing). Copy explains real deletion
   behavior coming with real accounts.
8. **Public profile** (`/team/mock-esports`) — shareable read-only team profile: headline stats, map
   pool, and an **opponents-faced** list framed "based on N matches vs you" (bakes in the B-scout
   not-a-scouting narrative). No login required to view; no search/lookup anywhere.

## Legal pages (draft, marked for review)
- `/privacy` — Privacy Policy tailored to actual practices: RSO opt-in, **own-history-only**,
  **single-captain** consent model + how co-participants' data is shown, data stored, retention,
  **delete/unlink**, third parties, Riot non-affiliation. Headed "DRAFT — requires legal review."
- `/terms` — ToS: acceptable use, the Riot non-endorsement notice, no-warranty, account/termination,
  changes. Same DRAFT header.

## Application artifacts (`docs/application/`)
- `riot-application-answers.md` — drafted answers to the production-key application: product
  description, data use, **why it's not scouting** (own-history-only / no search / co-played-only),
  **consent model** (single-captain), monetization (free + transformative), security (no key in
  client, HTTPS, RSO), and the demo URL placeholder.
- `walkthrough-script.md` — a 60-second click-path narration for the reviewer (landing → consent →
  simulated RSO → dashboard → match detail w/ positional map → public profile), hitting the
  trust/compliance beats.

## Deployment (Vercel-ready; user executes)
- `next build` clean; `.env.example` documents `MATCH_SOURCE=mock`; a short `docs/deploy.md` with exact
  steps (import repo to Vercel, framework auto-detected, env var, deploy) + how to plug the resulting
  URL into the application answers. No secrets needed (mock data, no real API key).

## Testing
- Unit tests (vitest) for `src/analytics/` against fixtures (deterministic — assert win% = 3/5, map
  pool counts, atk/def splits, round timeline length = rounds).
- A `toMinimap` round-trip sanity test for the positional mapping (points land in [0,1]).
- `pnpm typecheck` + `pnpm lint` + `pnpm build` clean; manual click-through of all 8 screens.

## File structure (added/changed)
```
src/
  app/
    layout.tsx              + NextIntlProvider, Tailwind, dark theme
    page.tsx                landing (replaces list)
    connect/page.tsx        consent
    connect/riot/page.tsx   simulated RSO
    connect/success/page.tsx
    dashboard/page.tsx
    matches/[id]/page.tsx   upgraded detail (+ positional map)
    settings/page.tsx
    team/[slug]/page.tsx    public profile
    privacy/page.tsx  terms/page.tsx
    api/connect/route.ts    sets/clears the demo cookie
  analytics/                team.ts player.ts match.ts (+ tests)
  components/
    AppHeader.tsx  MarketingHeader.tsx  StatCard.tsx  ...
    charts/ (BarRow, Donut, AreaTrend, SplitBar)
    positional/ (MatchMap, maps backdrops)
  i18n/ (request config, en.json)
  lib/auth.ts               cookie read/require helpers
docs/
  application/ (riot-application-answers.md, walkthrough-script.md)
  deploy.md
tailwind.config.ts  postcss.config.mjs  src/app/globals.css
```

## Out of scope (later phases)
Real Auth.js/RSO + token storage (P2), real ingestion/Postgres (P2), full Phase 3 metric catalog,
official Riot minimap assets (P4), native ZH translation + locale routing (P6), billing.

## Risks
- **Scope is large for one plan.** Mitigation: the plan groups tasks (foundation → screens →
  analytics → legal/app artifacts → deploy prep) and builds incrementally; each screen is self-contained.
- **Charts/positional from scratch** could eat time. Mitigation: keep SVG components minimal and
  reuse across screens; the positional map reuses the existing calibration transform.
- **Legal copy is draft only.** Clearly marked; real sign-off is the user's Phase-1 human task.
