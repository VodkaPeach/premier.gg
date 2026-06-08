# Deploy the mock demo to Vercel

The Phase 1 demo runs entirely on **mock fixture data** — no Riot API access, no secrets, no
database. These are the exact steps to get a public URL for the Riot application.

## Prerequisites

- The `phase-1-demo` branch is merged into (or pushed and ready to deploy from) `main`.
- Node **20+** and **pnpm** (via `corepack`) — Vercel auto-detects both from the repo.

## Steps

1. **Push the branch.** Make sure your work is committed and pushed:

   ```bash
   git push origin phase-1-demo      # or merge to main first, then push main
   ```

2. **Import the repo at [vercel.com](https://vercel.com).** New Project → Import the
   `premier.gg` Git repository → pick the branch you want to deploy (e.g. `main`).

3. **Framework preset:** Vercel **auto-detects Next.js** — leave the defaults.
   - Build command: `next build` (the project's `build` script).
   - Install command: `pnpm install` (auto-detected from the lockfile).
   - Output: handled by the Next.js adapter — no manual output dir.

4. **Set the environment variable:**

   | Name | Value | Notes |
   |---|---|---|
   | `MATCH_SOURCE` | `mock` | Forces the mock data seam. This is the default behavior in Phase 1, so the demo also works with it unset — set it explicitly to be safe and forward-compatible. |

   **No other secrets are required.** The mock demo reads no live Riot data, so there is no
   Riot API key, no RSO client secret, and no database URL to configure.

5. **Deploy.** Click Deploy and wait for the build to finish. Vercel gives you a production
   URL like `https://premier-gg.vercel.app`.

6. **Record the URL.** Copy the resulting URL into the **Demo URL** placeholder
   (`[your deployed demo URL]`) in
   [`docs/application/riot-application-answers.md`](./application/riot-application-answers.md),
   and into the dev-rel inquiry if you send one.

7. **Verify your domain for Riot (required for the production key).** Riot **cannot grant a
   production key without a verified website**, and it verifies ownership via a **`riot.txt`** file
   at the site root. When you apply, Riot gives you a verification string — add it to this repo at
   **`public/riot.txt`** (Next.js serves everything in `public/` at the site root) and redeploy, so
   it's reachable at `https://<your-domain>/riot.txt`. For a clearly-owned, branded domain, add a
   custom domain under Vercel → **Settings → Domains** and verify that one (preferred over the
   default `*.vercel.app` URL). Riot does **not** accept a GitHub repo/source in place of a live site.

## Verify after deploy

Click through the walkthrough path to confirm the demo is healthy:
`/` → `/connect` → `/connect/riot` → `/dashboard` → `/matches/m-0001` → `/team/mock-esports`.
The footer should show the mock-data note and the Riot non-endorsement disclaimer on every
page. See [`docs/application/walkthrough-script.md`](./application/walkthrough-script.md).

## Notes

- **Secrets:** none needed for the mock demo. Real Riot API keys, the RSO client secret, and
  the database URL are introduced in Phase 2 (real ingestion) — not now.
- **Build:** `next build` runs the production build and statically prerenders the marketing and
  legal pages; the dashboard / match / team routes are server-rendered on demand.
- **The demo link must load reliably.** A broken/blank/unreachable demo link is the single most
  common reason applications are held or rejected — reviewers reject when they "cannot verify what
  your project is intended to do." Open the deployed URL in a fresh browser (no cache, logged-out)
  and click the full walkthrough before submitting. The live `/privacy` + `/terms` pages must also
  be reachable (Riot reviews them).
