import Link from "next/link";
import { getMatchSource } from "@/lib/match-source";
import { readManifest, matchSummary } from "@/lib/manifest";

// Fetch per request, not at build. The mock is static, but a Phase-1 RiotMatchSource
// fetches live — without this the matchlist would be frozen at build time, making the
// seam swap more than a one-place change.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const manifest = readManifest();
  const source = getMatchSource();
  // The seam contract marks queueId for filtering; the real matchlist returns mixed
  // queues, so keep only Premier (no-op on the all-premier mock, correct after swap).
  const entries = (await source.getMatchlist(manifest.captainPuuid)).filter(
    (e) => e.queueId === "premier",
  );

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
