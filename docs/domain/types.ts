// Domain model: what the analysis engine and UI consume. Never the raw DTO.
import type { MapKey, Vec2 } from "../geo/calibration";

export type Side = "Red" | "Blue";
export type { Vec2, MapKey };

export interface Match {
  id: string;
  map: MapKey | string;
  queue: string; // "premier"
  startedAt: Date;
  durationMs: number;
  patch: string;
  teams: Record<Side, TeamSide>;
  players: PlayerMatch[]; // 10
  rounds: Round[];
}

export interface TeamSide {
  side: Side;
  won: boolean;
  roundsWon: number;
  roundsPlayed: number;
}

export interface PlayerMatch {
  puuid: string;
  riotId: string; // gameName#tagLine
  side: Side;
  agent: string;
  partyId: string;
  tier: number;
  kills: number;
  deaths: number;
  assists: number;
  score: number;
}

export interface Round {
  num: number;
  winner: Side;
  attackingSide: Side;
  outcome: string;
  plant?: PlantEvent;
  defuse?: DefuseEvent;
  kills: KillEvent[]; // all kills in the round, time-ordered
  economy: PlayerRoundEconomy[];
}

export interface PlantEvent {
  site: "A" | "B" | "C";
  byPuuid: string;
  roundTime: number;
  loc: Vec2;
  playerLocs: PositionSample[];
}

export interface DefuseEvent {
  byPuuid: string;
  roundTime: number;
  loc: Vec2;
  playerLocs: PositionSample[];
}

export interface KillEvent {
  roundNum: number;
  roundTime: number;
  killer: string;
  victim: string;
  assistants: string[];
  victimLoc: Vec2;
  killerLoc?: Vec2; // pulled out of playerLocations
  weapon: string;
  isFirstBlood: boolean;
  isTrade: boolean; // killer avenged a teammate killed within TRADE_WINDOW_MS
}

export interface PlayerRoundEconomy {
  puuid: string;
  loadoutValue: number;
  weapon: string;
  armor: string;
  spent: number;
  remaining: number;
}

export interface PositionSample {
  puuid: string;
  loc: Vec2;
  viewRadians: number;
}
