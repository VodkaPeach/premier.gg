import { MockMatchSource } from "@/match-source/mock-match-source";
import type { MatchSource } from "@/match-source";

/**
 * The single swap point between Phase 0 (mock) and Phase 1/2 (real Riot data).
 * Phase 2 adds: if (process.env.MATCH_SOURCE === "riot") return new RiotMatchSource(...).
 */
export function getMatchSource(): MatchSource {
  return new MockMatchSource();
}
