import type { Match } from "@/domain/types";

export interface PlayerAgg {
  puuid: string;
  riotId: string;
  agent: string;
  kills: number;
  deaths: number;
  assists: number;
  kd: number;
  matches: number;
}

export function rosterStats(matches: Match[], puuids: string[]): PlayerAgg[] {
  return puuids.map((puuid) => {
    let kills = 0, deaths = 0, assists = 0, mp = 0, riotId = puuid;
    const agentCount = new Map<string, number>();
    for (const m of matches) {
      const p = m.players.find((pl) => pl.puuid === puuid);
      if (!p) continue;
      mp += 1; kills += p.kills; deaths += p.deaths; assists += p.assists; riotId = p.riotId;
      agentCount.set(p.agent, (agentCount.get(p.agent) ?? 0) + 1);
    }
    const agent = [...agentCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    return { puuid, riotId, agent, kills, deaths, assists, kd: deaths ? kills / deaths : kills, matches: mp };
  });
}
