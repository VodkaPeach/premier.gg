// Pure transform: raw val-match-v1 MatchDto -> domain Match.
// All derivations (agent/weapon resolution, first-blood, trade, killer position) happen here ONCE,
// so mock and real data flow through identical analysis code.

import type {
  RiotMatchDto, RoundResultDto, KillDto, PlayerLocationsDto, RiotTeamId,
} from "../match-source/riot-dto";
import { resolveAgent, resolveWeapon, resolveArmor, resolveMap } from "../content/content-map";
import type {
  Match, Round, KillEvent, PlayerMatch, Side, TeamSide, PositionSample, Vec2,
} from "./types";

export const TRADE_WINDOW_MS = 3000;

const asSide = (t: RiotTeamId): Side => t;

function sample(p: PlayerLocationsDto): PositionSample {
  return { puuid: p.puuid, loc: p.location, viewRadians: p.viewRadians };
}

function killerLoc(k: KillDto): Vec2 | undefined {
  return k.playerLocations.find((p) => p.puuid === k.killer)?.location;
}

/** attacker = team that does NOT start on defense. Halves swap at round 12; OT alternates. */
function attackingSide(roundNum: number, blueAttacksFirst: boolean): Side {
  let blueAttacks: boolean;
  if (roundNum < 12) blueAttacks = blueAttacksFirst;
  else if (roundNum < 24) blueAttacks = !blueAttacksFirst;
  else blueAttacks = (roundNum - 24) % 2 === 0 ? blueAttacksFirst : !blueAttacksFirst;
  return blueAttacks ? "Blue" : "Red";
}

function parseRound(
  r: RoundResultDto,
  sideOf: Map<string, Side>,
  blueAttacksFirst: boolean,
): Round {
  // Flatten all kills in the round and order by time.
  const flat: KillDto[] = r.playerStats.flatMap((ps) => ps.kills);
  flat.sort((a, b) => a.roundTime - b.roundTime);

  const kills: KillEvent[] = flat.map((k, i) => {
    const isTrade = flat.some(
      (prior) =>
        prior.roundTime < k.roundTime &&
        k.roundTime - prior.roundTime <= TRADE_WINDOW_MS &&
        prior.killer === k.victim, // we killed the player who just got a kill
    );
    return {
      roundNum: r.roundNum,
      roundTime: k.roundTime,
      killer: k.killer,
      victim: k.victim,
      assistants: k.assistants,
      victimLoc: k.victimLocation,
      killerLoc: killerLoc(k),
      weapon:
        k.finishingDamage.damageType === "Weapon"
          ? resolveWeapon(k.finishingDamage.damageItem)
          : k.finishingDamage.damageType,
      isFirstBlood: i === 0,
      isTrade,
    };
  });

  const round: Round = {
    num: r.roundNum,
    winner: asSide(r.winningTeam),
    attackingSide: attackingSide(r.roundNum, blueAttacksFirst),
    outcome: r.roundResult,
    kills,
    economy: r.playerStats.map((ps) => ({
      puuid: ps.puuid,
      loadoutValue: ps.economy.loadoutValue,
      weapon: resolveWeapon(ps.economy.weapon),
      armor: resolveArmor(ps.economy.armor),
      spent: ps.economy.spent,
      remaining: ps.economy.remaining,
    })),
  };

  if (r.bombPlanter && r.plantSite) {
    round.plant = {
      site: r.plantSite as "A" | "B" | "C",
      byPuuid: r.bombPlanter,
      roundTime: r.plantRoundTime,
      loc: r.plantLocation,
      playerLocs: (r.plantPlayerLocations ?? []).map(sample),
    };
  }
  if (r.bombDefuser) {
    round.defuse = {
      byPuuid: r.bombDefuser,
      roundTime: r.defuseRoundTime,
      loc: r.defuseLocation,
      playerLocs: (r.defusePlayerLocations ?? []).map(sample),
    };
  }
  return round;
}

export function parseMatch(dto: RiotMatchDto): Match {
  const sideOf = new Map<string, Side>(dto.players.map((p) => [p.puuid, asSide(p.teamId)]));

  // Determine which side attacked first from round 0's outcome geometry isn't in the data,
  // so we record the convention used by the generator: Blue attacks first half by default.
  // In Phase 1, derive from round-by-round economy/plant patterns or accept the unknown.
  const blueAttacksFirst = true;

  const players: PlayerMatch[] = dto.players.map((p) => ({
    puuid: p.puuid,
    riotId: `${p.gameName}#${p.tagLine}`,
    side: asSide(p.teamId),
    agent: resolveAgent(p.characterId),
    partyId: p.partyId,
    tier: p.competitiveTier,
    kills: p.stats.kills,
    deaths: p.stats.deaths,
    assists: p.stats.assists,
    score: p.stats.score,
  }));

  const teams = {} as Record<Side, TeamSide>;
  for (const t of dto.teams) {
    teams[asSide(t.teamId)] = {
      side: asSide(t.teamId),
      won: t.won,
      roundsWon: t.roundsWon,
      roundsPlayed: t.roundsPlayed,
    };
  }

  return {
    id: dto.matchInfo.matchId,
    map: resolveMap(dto.matchInfo.mapId),
    queue: dto.matchInfo.queueId,
    startedAt: new Date(dto.matchInfo.gameStartMillis),
    durationMs: dto.matchInfo.gameLengthMillis,
    patch: dto.matchInfo.gameVersion,
    teams,
    players,
    rounds: dto.roundResults.map((r) => parseRound(r, sideOf, blueAttacksFirst)),
  };
}
