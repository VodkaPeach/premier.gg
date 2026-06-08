import type { Match, Side } from "@/domain/types";

export type Result = "W" | "L";
export interface TeamSummary { matches: number; wins: number; losses: number; winRate: number; }
export interface MapRecord { map: string; wins: number; losses: number; played: number; }
export interface SideSplit {
  atkRoundsWon: number; atkRoundsPlayed: number; atkWinRate: number;
  defRoundsWon: number; defRoundsPlayed: number; defWinRate: number;
}

/** Which side our player is on in a given match. */
export function ourSideOf(match: Match, puuid: string): Side {
  const p = match.players.find((pl) => pl.puuid === puuid);
  return p ? p.side : "Blue";
}

function won(match: Match, puuid: string): boolean {
  return match.teams[ourSideOf(match, puuid)].won;
}

export function teamSummary(matches: Match[], puuid: string): TeamSummary {
  const wins = matches.filter((m) => won(m, puuid)).length;
  const total = matches.length;
  return { matches: total, wins, losses: total - wins, winRate: total ? wins / total : 0 };
}

export function mapPool(matches: Match[], puuid: string): MapRecord[] {
  const acc = new Map<string, MapRecord>();
  for (const m of matches) {
    const key = String(m.map);
    const rec = acc.get(key) ?? { map: key, wins: 0, losses: 0, played: 0 };
    rec.played += 1;
    if (won(m, puuid)) rec.wins += 1; else rec.losses += 1;
    acc.set(key, rec);
  }
  return [...acc.values()].sort((a, b) => b.played - a.played);
}

export function sideSplit(matches: Match[], puuid: string): SideSplit {
  let atkWon = 0, atkPlayed = 0, defWon = 0, defPlayed = 0;
  for (const m of matches) {
    const us = ourSideOf(m, puuid);
    for (const r of m.rounds) {
      const weAttacked = r.attackingSide === us;
      const weWon = r.winner === us;
      if (weAttacked) { atkPlayed++; if (weWon) atkWon++; }
      else { defPlayed++; if (weWon) defWon++; }
    }
  }
  return {
    atkRoundsWon: atkWon, atkRoundsPlayed: atkPlayed, atkWinRate: atkPlayed ? atkWon / atkPlayed : 0,
    defRoundsWon: defWon, defRoundsPlayed: defPlayed, defWinRate: defPlayed ? defWon / defPlayed : 0,
  };
}

export function recentForm(matches: Match[], puuid: string, n: number): Result[] {
  return [...matches]
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
    .slice(0, n)
    .map((m) => (won(m, puuid) ? "W" : "L"));
}
