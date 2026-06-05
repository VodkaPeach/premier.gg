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
