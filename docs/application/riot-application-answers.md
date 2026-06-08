# Riot production API key application — drafted answers

> Working draft of the answers for the VALORANT production API key + RSO application.
> Fill in every `[bracketed]` placeholder and adjust voice before submitting. Framing is
> kept consistent with `docs/roadmap.md` (B-scout / B-consent + "Why premier.gg is not a
> scouting tool") and `docs/riot-dev-rel-inquiry.md`.

---

## Product summary

premier.gg is an independent VALORANT **Premier match-review** web app. A player signs in
with their Riot account (RSO) and reviews **their own** Premier match history: team and
player performance, per-map and economy breakdowns, and **positional views** (kill / plant
maps and heatmaps rendered on official minimaps). It also surfaces **retrospective profiles
of opponents the player has personally played against**.

**User value:** Premier teams get honest, structured analytics on the matches they actually
played — where rounds are won and lost, how their map pool and economy hold up, and how teams
they've already faced tend to play — without leaving their own match history. It turns the
match data a player already has into clear team-improvement insight.

- **Audience:** global Riot-operated regions; UI in English and Chinese (language only — no
  CN/Tencent data).
- **Status:** functioning prototype on mock data; a public clickable demo accompanies this
  application (see Demo URL below).

## APIs used

| API | Endpoints | Purpose |
|---|---|---|
| **val-match-v1** | `matchlists/by-puuid/{puuid}`, `matches/{matchId}` | Pull the signed-in user's own Premier matchlist, then full match details. |
| **val-content-v1** | content listing | Resolve agent / map / weapon names and fetch official minimap images for the positional layer. |
| **RSO (Riot Sign-On)** | OAuth authorize / token | Authenticate the user and obtain a scoped token to read **their own** match history. |

We do not use any player/team search or leaderboard endpoint, and we ingest **only the
signed-in user's own** matchlist — never an arbitrary player's.

## Data use — and why it's not scouting

Riot's policy lists, as a prohibited use case, **"scouting, which is seeing an opponent's
stats before a match starts."** premier.gg **structurally cannot do that.** The architecture
is built around three hard product invariants:

- **Own-history-only.** A user can only ever pull *their own* match history, via their own
  RSO opt-in. There is no mechanism to query an arbitrary player or team.
- **No player/team search.** The product has **no search or lookup surface at all**. You
  cannot type in an opponent and get their stats.
- **Co-played-only.** The *only* way a user sees any opponent information is as a by-product
  of matches they **personally played** against that opponent, recently enough to be in their
  own history.

So the opponent feature is **retrospective review of shared matches**, not
intelligence-gathering. The prohibited case — "seeing an opponent's stats *before a match
starts*" — implies looking up an opponent you are *about* to face. premier.gg has **no
opponent-lookup surface**, so there is no path by which a user could pull a future opponent's
stats. Every opponent number on the screen is derived from a match the user already played and
already saw the scoreboard for. We will keep these three constraints as permanent invariants
and will not add player/team search or arbitrary-puuid lookup in any later phase.

## Consent model

premier.gg uses a **single-captain** model: one team captain signs in with RSO, and the team
is reconstructed from that captain's own matches.

- The in-match stats shown for **teammates and opponents** are derived **solely from matches
  the consenting captain played in** — the same scoreboard data that captain already sees in
  their own in-client match history. We never fetch any co-participant's separate history.
- We provide **unlink** (revokes our access) and **delete-my-data** (permanently removes
  stored matches and the account record), plus a teammate-removal path.
- We will disclose this model in the application and validate it at our pre-launch legal
  review. We'd welcome guidance on whether displaying co-participants' in-match data derived
  solely from the consenting user's own matches is acceptable, or whether each displayed
  player must individually opt in.

## Monetization

- **Free at launch.** No betting, gambling, or wagering of any kind.
- If a paid tier is added later it will be **transformative** (added analysis / insight, not
  raw Riot data behind a paywall), with a free tier always retained.

## Security

- **No API key in client code.** All Riot API calls are made server-side; the production key
  is held only in server-side environment configuration and never shipped to the browser.
- **HTTPS** everywhere (Vercel-managed TLS).
- **RSO** for all authentication — we never see or store a Riot password.
- **Encrypted token storage** with refresh handling (Phase 2, when live RSO is enabled).
- Ingestion is scoped to the signed-in user only; there is no endpoint that accepts an
  arbitrary puuid from the client.

## Compliance

- **Non-endorsement disclaimer** is shown on every screen: *"premier.gg isn't endorsed by
  Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially
  involved in producing or managing Riot Games properties."*
- **Privacy Policy:** `/privacy` · **Terms of Service:** `/terms` (both linked in the app
  footer; currently drafts pending legal review).
- "VALORANT" and "Premier" are used **descriptively** only; independent branding, no Riot
  logos or marks in the product identity.
- One product per key; we are not reselling or redistributing Riot data.

## Demo URL

`[your deployed demo URL]`

> Replace this placeholder with the live Vercel URL once deployed — see `docs/deploy.md`.
> The demo runs entirely on mock fixture data (`MATCH_SOURCE=mock`); no live Riot data is
> read, and no secrets are required to run it.
