import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { MatchSource, MatchlistEntry } from "./index";
import type { RiotMatchDto } from "./riot-dto";

// Resolved from the project root so the path survives Next.js server bundling
// (import.meta.url would resolve into .next/ at runtime). Run node/CLI from the repo root.
const FIXTURES = join(process.cwd(), "src", "fixtures");

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
