import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseMatch } from "@/domain/parse-match";
import type { RiotMatchDto } from "@/match-source/riot-dto";
import { rosterStats } from "./player";

const FIX = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures", "matches");
const matches = ["m-0001", "m-0002", "m-0003", "m-0004", "m-0005"].map((id) =>
  parseMatch(JSON.parse(readFileSync(join(FIX, `${id}.json`), "utf8")) as RiotMatchDto));
const ROSTER = ["mock-captain-0001", "mock-p2", "mock-p3", "mock-p4", "mock-p5"];

describe("player analytics", () => {
  it("aggregates the 5-man roster with non-negative K/D/A and a KD ratio", () => {
    const rows = rosterStats(matches, ROSTER);
    expect(rows).toHaveLength(5);
    for (const r of rows) {
      expect(r.kills).toBeGreaterThanOrEqual(0);
      expect(r.deaths).toBeGreaterThanOrEqual(0);
      expect(r.kd).toBeCloseTo(r.deaths === 0 ? r.kills : r.kills / r.deaths, 5);
      expect(r.riotId).toContain("#");
    }
  });
});
