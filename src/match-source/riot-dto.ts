// Raw val-match-v1 wire types. Fixtures MUST conform to these exactly.
// This is the contract; nothing here is premier.gg-specific.
//
// These model the OFFICIAL developer API (production key), validated 2026-06-05 against an
// official sample response: `puuid`, `queueId`, `gameTime`/`roundTime`. Do NOT "fix" these to
// match community client-API docs (techchrism), which use `subject`/`queueID`/`timeSinceRoundStartMillis` —
// that is the in-game client API, a different contract. See docs/plan/roadmap.md "policy & data findings".

export interface RiotMatchDto {
  matchInfo: MatchInfoDto;
  players: PlayerDto[];
  teams: TeamDto[];
  roundResults: RoundResultDto[];
}

export interface MatchInfoDto {
  matchId: string;
  mapId: string; // content path, e.g. "/Game/Maps/Ascent/Ascent"
  gameVersion: string;
  gameLengthMillis: number;
  gameStartMillis: number;
  queueId: string; // "premier"
  gameMode: string;
  isRanked: boolean;
  isCompleted: boolean;
  seasonId: string;
}

export type RiotTeamId = "Red" | "Blue";

export interface PlayerDto {
  puuid: string;
  gameName: string;
  tagLine: string;
  teamId: RiotTeamId;
  partyId: string;
  characterId: string; // agent UUID
  competitiveTier: number;
  stats: StatsDto;
}

export interface StatsDto {
  score: number;
  roundsPlayed: number;
  kills: number;
  deaths: number;
  assists: number;
  playtimeMillis: number;
  abilityCasts: AbilityCastsDto | null;
}

export interface AbilityCastsDto {
  grenadeCasts: number;
  ability1Casts: number;
  ability2Casts: number;
  ultimateCasts: number;
}

export interface TeamDto {
  teamId: RiotTeamId;
  won: boolean;
  roundsPlayed: number;
  roundsWon: number;
  numPoints: number;
}

export interface RoundResultDto {
  roundNum: number;
  roundResult: string; // e.g. "Eliminated", "Bomb defused", "Bomb detonated"
  winningTeam: RiotTeamId;
  plantSite: "A" | "B" | "C" | "";
  bombPlanter: string | null;
  bombDefuser: string | null;
  plantRoundTime: number;
  defuseRoundTime: number;
  plantLocation: LocationDto;
  defuseLocation: LocationDto;
  plantPlayerLocations: PlayerLocationsDto[] | null;
  defusePlayerLocations: PlayerLocationsDto[] | null;
  playerStats: PlayerRoundStatsDto[];
}

export interface PlayerRoundStatsDto {
  puuid: string;
  score: number;
  kills: KillDto[]; // kills MADE BY this player in this round
  damage: DamageDto[];
  economy: EconomyDto;
}

export interface KillDto {
  gameTime: number;
  roundTime: number;
  killer: string;
  victim: string;
  assistants: string[];
  victimLocation: LocationDto;
  playerLocations: PlayerLocationsDto[]; // everyone's position at kill time
  finishingDamage: FinishingDamageDto;
}

export interface FinishingDamageDto {
  damageType: string; // "Weapon" | "Ability" | "Bomb" | "Fall" | "Melee"
  damageItem: string; // weapon UUID when damageType === "Weapon"
  isSecondaryFireMode: boolean;
}

export interface DamageDto {
  receiver: string;
  damage: number;
  legshots: number;
  bodyshots: number;
  headshots: number;
}

export interface EconomyDto {
  loadoutValue: number;
  weapon: string; // weapon UUID
  armor: string; // armor UUID or ""
  remaining: number;
  spent: number;
}

export interface LocationDto {
  x: number;
  y: number;
}

export interface PlayerLocationsDto {
  puuid: string;
  viewRadians: number;
  location: LocationDto;
}
