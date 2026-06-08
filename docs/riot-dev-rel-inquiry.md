# Riot Developer Relations — pre-application inquiry (draft)

> Draft for submission to Riot Developer Relations (support-developer.riotgames.com) **before**
> filing the VALORANT production API key application. Fill in the `[bracketed]` placeholders and
> adjust the voice before sending. Questions are ordered approval-critical first.

---

**Subject:** Pre-application policy check — VALORANT match-review app (RSO, val-match-v1)

Hi Developer Relations team,

I'm building a VALORANT match-analytics web app and would like to confirm a few policy points
**before** I submit my production API key application, so I can get the product and naming right up front.

## What it is

A web app where a VALORANT player signs in with their Riot account (RSO) to **review their own
Premier match history** — team performance, per-map and economy breakdowns, and positional views
(kill/plant maps and heatmaps rendered on official minimaps). It also surfaces **retrospective
profiles of opponents the player has personally played against**.

- **APIs used:** `val-match-v1` (`matchlists/by-puuid`, `matches/{matchId}`), `val-content-v1`
  (asset names + minimap images), and RSO for login.
- **Audience:** global Riot-operated regions; UI in English and Chinese (language only — no
  CN/Tencent data).
- **Monetization:** free at launch; if a paid tier is added later it will be transformative
  (added analysis/insights) with a free tier retained. No betting or gambling.
- **Status:** functioning prototype on mock data; a clickable demo will accompany the application.
  [Preview link available on request / will be at: ____]

## Architectural guardrails (relevant to the questions below)

1. A signed-in user can only ever pull **their own** match history. There is **no player or team
   search**, and no way to query an arbitrary player/team.
2. Any opponent information appears **only as a by-product of matches the signed-in user personally
   played** — i.e., data already visible to them in their own in-client match history/scoreboard.

## Questions

**1. Product name / domain ("premier.gg").**
The working name is **premier.gg**. I understand "Premier" is the name of the VALORANT competitive
mode. I will not use the VALORANT name or logo in the branding, will use a distinct visual identity,
and will display the non-endorsement disclaimer. Is using the word **"Premier" in the product name
and domain** acceptable under your trademark/trade-name policy, or would you consider it use of a
Riot mark? If it's a concern, could you advise where the line is (e.g., descriptive use only)?

**2. Retrospective opponent review vs. prohibited "scouting."**
Your policy lists *"scouting — seeing an opponent's stats before a match starts"* as a prohibited use
case. My opponent feature is strictly **retrospective and co-played-only**, enforced by the
guardrails above (own-history-only, no search, opponents only from matches the user played). It is
framed as "review of matches you played," not pre-match preparation. **Can you confirm this model is
acceptable** and does not fall under the scouting prohibition? Are there framing or scope constraints
you'd want applied?

**3. Displaying co-participants' data under a single sign-in (consent scope).**
A match response inherently includes all ten participants. With one signed-in user (e.g., a team
captain) opting in via RSO, the app would display the **in-match stats of their teammates and
opponents from matches that user played in** — the same data the user already sees in their own match
history. Your opt-in disclaimer states players must sign up to display their stats. **Could you
clarify:** is it permissible to display other participants' in-match data **derived solely from
matches the consenting user played in**, or must each displayed player individually opt in? The app
provides unlink/delete and a data-removal path.

**4. (Secondary, technical) Premier matches via the API.**
I plan to ingest Premier matches via `matchlists/by-puuid` → `matches/{matchId}`, filtering by queue.
**Can you confirm Premier matches are returned through these endpoints with the standard `MatchDto`,
and what the `queueId` value is for Premier?** (Documented values I've found include `competitive`
and `unrated`; I couldn't locate the Premier value.)

Thank you for any guidance — I'd rather align with policy before applying than discover an issue
during review.

Best regards,
[Your name]
[Contact email / Riot ID]
[Region]
