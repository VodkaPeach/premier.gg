import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { MatchSource, MatchlistEntry } from "./index";
import type { RiotMatchDto } from "./riot-dto";

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures");

/**
 * Phase 0 implementation: serves authored fixtures behind the real interface.
 * Swap for RiotMatchSource in Phase 1 with zero changes upstream.
 */
export class MockMatchSource implements MatchSource {
  async getMatchlist(puuid: string): Promise<MatchlistEntry[]> {
    const raw = await readFile(join(FIXTURES, `matchlist.${puuid}.json`), "utf8");
    return JSON.parse(raw) as MatchlistEntry[];
  }

  async getMatch(matchId: string): Promise<RiotMatchDto> {
    const raw = await readFile(join(FIXTURES, "matches", `${matchId}.json`), "utf8");
    return JSON.parse(raw) as RiotMatchDto;
  }
}
