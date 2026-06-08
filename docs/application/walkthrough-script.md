# 60-second demo walkthrough — narrated click-path

> A short, reviewer-facing narration of the demo. Each beat is one stop on the click-path,
> with its route and one or two sentences hitting the trust / compliance points. Total read
> time ≈ 60 seconds. The demo runs entirely on mock data — no live Riot data is used.

---

**1. Landing — `/`**
"This is premier.gg, a VALORANT Premier match-review app. The pitch is simple: turn the
matches *you* play into clear team analytics. Note the line up front — *we only ever show
matches you've played; no opponent search, no lookup* — and the Riot non-endorsement
disclaimer in the footer."

**2. Consent / opt-in — `/connect`**
"Before anything connects, the user opts in. We explain exactly what we read — *your own
Premier match history, via Riot Sign-On, and nothing else* — and how the single-captain model
works: one captain signs in and we reconstruct the team from their matches. There is no player
search anywhere."

**3. Simulated RSO — `/connect/riot`**
"Sign-in goes through Riot Sign-On. This is a simulated RSO screen for the demo — no real
credentials are collected or sent — but it shows the real flow: the user authenticates with
Riot, and we only ever receive a scoped token to read their own history."

**4. Dashboard — `/dashboard`**
"After linking, the captain lands on the team dashboard: win rate, form, map pool, and economy
trends across the matches they played. Every number here comes from the captain's own match
history — the same data already in their in-client match history, just analyzed."

**5. Match detail with positional map — `/matches/m-0001`**
"Drilling into a single match gives the round breakdown plus the positional layer — kill
locations and spike plants mapped onto the official minimap. This is the rib.gg-style
differentiator, and it's all derived from a match the user personally played."

**6. Public profile — co-played framing — `/team/mock-esports`**
"Finally, the opponent view. Crucially, it's framed as *retrospective review* — 'based on N
matches you played against this team' — never pre-match scouting. Opponents appear only as a
by-product of co-played matches; there's no way to look up a team you haven't faced. And from
Settings, the user can unlink or delete-my-data at any time. premier.gg is own-history-only,
has no search, and isn't endorsed by Riot Games."
