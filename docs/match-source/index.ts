import type { RiotMatchDto } from "./riot-dto";

export interface MatchlistEntry {
  matchId: string;
  gameStartTimeMillis: number;
  queueId: string; // filter on === "premier"
}

/**
 * The seam. Everything above this interface is shared between Phase 0 and Phase 1.
 * Phase 0: MockMatchSource (reads fixtures/).
 * Phase 1: RiotMatchSource (calls val-match-v1) — same signatures, adds auth + rate limiting.
 */
export interface MatchSource {
  /** val-match-v1: /val/match/v1/matchlists/by-puuid/{puuid} */
  getMatchlist(puuid: string): Promise<MatchlistEntry[]>;
  /** val-match-v1: /val/match/v1/matches/{matchId} */
  getMatch(matchId: string): Promise<RiotMatchDto>;
}

export type { RiotMatchDto };
