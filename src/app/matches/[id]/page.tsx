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
