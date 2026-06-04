# premier.gg — Roadmap to Public-Presentable

Target end state: a **public beta** anyone can sign into with their Riot account and get
team + opponent + positional analysis of their Premier matches, in English or Chinese.

## Locked decisions (context)

| Area | Decision |
|---|---|
| Depth | Stats **+ positional** (heatmaps / kill-plant maps); no full 2D replay |
| Focus | **Team-centric + opponent scouting**, scouting limited to **co-played** matches |
| Auth/team | **Single captain** RSO login reconstructs the whole team |
| Audience | Global Riot-operated regions; **EN/ZH** UI (Chinese = language, not CN/Tencent data) |
| Monetization | **Free at launch, freemium-ready** (entitlement scaffolding now, no billing pre-launch) |
| Launch seq. | **Submit early + public mock demo** while awaiting approval |
| Map assets | **Official Riot minimap images** via val-content |
| Stack | Next.js + TS, Auth.js (RSO), Postgres/Prisma, ECharts, SVG/D3, next-intl, Vercel |
| Capacity | ~20 hrs/week, solo |

## Legend

- 🎯 **Milestone**  ·  🚧 **Blocker** (see register)  ·  👤 **Needs human steering** (your judgment/decision/legal)
- Effort: **S** ≤1 wk · **M** ~1.5–3 wks · **L** ~3–5 wks (at ~20 hrs/wk)

---

## The critical insight: one external gate, absorbed by parallel work

RSO/production approval is the **only hard external dependency** and the long pole (up to ~3+ weeks,
and *can be denied*). But because the seam puts everything downstream of `parseMatch` on the **parsed
domain model**, Phases 3–6 are **source-agnostic** — they develop fully on fixtures while approval is
pending. Only a thin `RiotMatchSource` swap + a data-shape validation actually need approval.

```
 P0 ─ P1 ──┬─────────────────────────────► (build continues on fixtures)
 (seam)   (submit) │                         P3 ─ P4 ─ P5 ─ P6
                   │                          (analytics, positional, scouting, i18n)
                   └─[ RSO approval wait ]──► P2 (swap to real data) ─┐
                                                                      ▼
                                                       P7 (compliance) ─ P8 (public beta) 🎯
```

If approval lands mid-build, P2 is a small merge. If it's denied, P1's quality is why — see B1.

---

## Phases

### Phase 0 — Foundations & seam · **S** · ✅ largely done
**Goal:** the contract that makes the mock→real swap a one-class change.
- Done: `docs/` seam (DTO types, `MatchSource`, `MockMatchSource`), generated fixtures, `parseMatch`, calibration, content map.
- Remaining: scaffold the actual Next.js app (repo, CI, lint, vitest, Prisma), promote `docs/` types into `src/`, wire `MockMatchSource` into a route.
- **Exit:** `dev` server boots, tests green, a page renders a parsed fixture.

### Phase 1 — Prototype shell + public demo + submit application · **M** · 🎯 **M2** · 👤👤
**Goal:** deployed clickable demo (mock data) showing the full user flow, and the production + RSO application **submitted** (starts the clock).
- Screens 1–8 (landing, consent/opt-in, simulated RSO, link success, mock dashboard, mock match detail, settings w/ unlink+delete, public profile).
- EN/ZH skeleton, Privacy Policy + ToS, "not endorsed by Riot" notice, deploy to Vercel.
- Write application answers + a 60-sec flow walkthrough; submit.
- 👤 **The reviewer-facing demo + narrative — approval hinges on this.** 👤 Privacy/ToS/consent copy (legal). 👤 **Product name/domain check** (using "Premier" in the name may conflict with Riot IP policy — decide before committing the brand).
- **Exit:** demo is public, application is in Riot's queue.

### Phase 2 — RSO integration + real ingestion · **S–M work, calendar gated** · 🎯 **M3 (the unblock)** · 🚧 B1 B2 B4
**Goal:** real login + pull real Premier matches.
- `RiotMatchSource` (auth header, regional routing americas/europe/asia, rate-limit/backoff, retries) behind the existing interface.
- Auth.js custom RSO provider; encrypted token storage + refresh.
- Ingestion: matchlist → details, filter `queueId="premier"`, cache raw + parsed to Postgres, dedupe.
- 🚧 **Day-1 validation: confirm Premier returns via matchlist with the standard MatchDto** (B2).
- 👤 If **denied**: re-scope per rejection reason and resubmit (treat as a real branch, not an edge case).
- **Exit:** a real captain login ingests real Premier matches; one match parses identically to a fixture.

### Phase 3 — Core analytics: player + team · **L** · 🎯 **M4** · *(source-agnostic — build during approval wait)*
**Goal:** the dashboards that are the core value.
- Player: K/D/A, ACS, ADR, HS%, first-blood/first-death, multikills, clutch (1vX), trade%, per-agent/role, econ efficiency.
- Team: comp WR per map, map-pool W/L, atk/def split, pistol WR + conversion, thrifty/eco conversion, post-plant/retake success, attack site-hit distribution, half splits.
- Analysis engine over `Match[]`, dashboards (ECharts), filters (map/side/round-type/patch), snapshot tests on fixtures.
- **Exit:** full player + team dashboards render off fixtures (and will light up on real data at M3).

### Phase 4 — Positional layer · **M–L** · 🎯 **M5** · 🚧 B3 · *(source-agnostic)*
**Goal:** kill/death/plant maps + heatmaps on official Riot minimaps.
- Fetch `displayIcon` minimaps via val-content; wire the world→minimap forward transform (already built); SVG/Canvas overlay; heatmap rendering; filters; surface the "event-points only, not continuous tracks" caveat in-UI.
- 🚧 **Verify Riot minimap commercial-use terms** (B3). 👤 legal sign-off on asset use.
- **Exit:** positional views for every played map, points landing correctly (validated by the round-trip check).

### Phase 5 — Opponent scouting (co-played) · **M** · 🎯 **M6** · *(source-agnostic)*
**Goal:** opponent profiles from matches your team actually played.
- `OpponentProfile` aggregation: comp tendencies per map, attack-site preference + execute timing, eco patterns, key-player agent pools, defensive hold/kill locations.
- Opponent UI with explicit "based on N matches vs you" framing; enforce the policy-safe boundary (never fetch non-co-played history).
- **Exit:** scouting view for any opponent faced ≥1 time.

### Phase 6 — i18n completion (EN/ZH) · **M** *(overlaps)* · 🎯 part of **M7** · 👤
**Goal:** native-feeling Chinese, not machine-translated.
- Full string extraction; localized agent/map/weapon names from val-content (locale param); tactical-term glossary; locale routing/switch; number/date formatting.
- 👤 **ZH terminology review by a native/competitive speaker.**
- **Exit:** both locales complete and reviewed.

### Phase 7 — Compliance, privacy & hardening · **M** · 🎯 **M7** · 🚧 B-compliance · 👤
**Goal:** safe to expose publicly.
- End-to-end **delete-my-data** + unlink; retention policy; token-security audit; consent enforcement; data export; Riot-policy compliance pass; rate-limit/quotas; error handling; observability; backups; run the security review.
- 👤 **Final legal/privacy review** before any public exposure of real player data.
- **Exit:** compliance checklist green, security review passed.

### Phase 8 — Public beta / presentable launch · **M–L** · 🎯 **M8 (goal)** · 👤
**Goal:** the public-presentable state.
- Onboarding polish, landing content, empty/error/loading states, performance (query + image optimization, caching), mobile responsiveness, monitoring (Sentry + web analytics), feedback channel.
- Freemium-ready entitlement scaffolding wired but all-free.
- Soft-launch to a small cohort → iterate → open up.
- 👤 **Go/no-go quality gate.** 👤 Define the (not-yet-enabled) **free vs premium boundary** so the scaffolding is shaped right.
- **Exit:** public beta live; a stranger can onboard unaided; system monitored.

---

## Milestones

| ID | Milestone | Gates |
|---|---|---|
| M1 | Seam + fixtures complete | ✅ done |
| M2 | Public mock demo live + application submitted | starts approval clock |
| M3 | **RSO approved + first real Premier match ingested** | unblocks real-data product |
| M4 | Player + team analytics complete | core value proven |
| M5 | Positional / heatmaps live | the rib.gg-style differentiator |
| M6 | Opponent scouting live | full feature set |
| M7 | EN/ZH complete + compliance/security passed | safe + global-ready |
| M8 | **Public beta launch** | the target |

## Blocker register

| ID | Blocker | Type | Mitigation |
|---|---|---|---|
| **B1** | **RSO/production approval** — up to ~3+ wks, can be denied | External, critical path | High-quality demo + clear flow (Phase 1); design around known rejection reasons; have a resubmit plan |
| **B2** | Premier may not surface in match API as standard MatchDto | Technical, unverified | Validate first thing at M3; if shape differs, adapt `parseMatch` (isolated) |
| **B3** | Riot minimap **commercial-use** terms for a freemium product | Legal | Verify under Riot policies before Phase 4 ships; fallback = community/own assets |
| **B4** | Rate limits + Vercel function timeouts during ingestion | Technical | Chunked on-demand pulls, backoff, aggressive caching; move ingestion to a worker if needed |
| **B5** | No official Premier metadata API (standings/schedule/rosters) | Data gap | Reconstruct team/opponent context from match data (already the chosen approach) |
| **B-name** | "Premier" in product name/domain may conflict with Riot IP policy | Legal/brand | Decide before committing brand (Phase 1) |
| **B-comp** | Compliance must precede any public real-data exposure | Process | Phase 7 gates Phase 8 |

## Where you (human) must steer

1. **Phase 1 — the Riot application & demo.** The single highest-leverage human node; approval depends on the story you tell.
2. **Legal copy** — privacy policy, ToS, consent/disclaimer wording.
3. **Brand/name decision** (B-name) before you commit a domain/identity.
4. **Map-asset commercial terms** sign-off (B3).
5. **RSO rejection handling** — judgment call on re-scope if denied.
6. **ZH terminology review** — needs a human who knows competitive Valorant in Chinese.
7. **Final compliance/privacy review** before public exposure.
8. **Public-beta go/no-go** + **freemium boundary** definition.

## Rough timeline (≈20 hrs/wk — estimates, not commitments)

- Active build effort ≈ **16–22 weeks** of work.
- The RSO wait (B1) largely **overlaps** Phases 3–6, so it's mostly absorbed rather than additive.
- **Calendar to public beta ≈ 4–5.5 months**, with RSO approval (and possible denial/resubmit) the dominant source of variance.
- Treat dates as directional; re-baseline after M2 (you'll know the real approval latency) and after M3.

## Beyond v1 (post-presentable, not required to launch)

Enable the freemium tier · background ingestion + live in-Stage refresh · optional teammate linking for ranked/scrim context · deeper metrics & trends · shareable/embeddable reports · additional languages.
