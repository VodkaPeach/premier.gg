import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseMatch } from "@/domain/parse-match";
import type { RiotMatchDto } from "@/match-source/riot-dto";
import { ourSideOf, teamSummary, mapPool, sideSplit, recentForm } from "./team";

const FIX = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures", "matches");
const ids = ["m-0001", "m-0002", "m-0003", "m-0004", "m-0005"];
const matches = ids.map((id) => parseMatch(JSON.parse(readFileSync(join(FIX, `${id}.json`), "utf8")) as RiotMatchDto));
const CAP = "mock-captain-0001";

describe("team analytics", () => {
  it("captain is always on Blue in fixtures", () => {
    for (const m of matches) expect(ourSideOf(m, CAP)).toBe("Blue");
  });
  it("summary: 5 matches, 3 wins, 60% win rate", () => {
    const s = teamSummary(matches, CAP);
    expect(s.matches).toBe(5);
    expect(s.wins).toBe(3);
    expect(s.losses).toBe(2);
    expect(s.winRate).toBeCloseTo(0.6);
  });
  it("map pool: Ascent 2-0, Bind 1-1, Haven 0-1", () => {
    const pool = mapPool(matches, CAP);
    const byMap = Object.fromEntries(pool.map((p) => [p.map, p]));
    expect(byMap.Ascent).toMatchObject({ wins: 2, losses: 0 });
    expect(byMap.Bind).toMatchObject({ wins: 1, losses: 1 });
    expect(byMap.Haven).toMatchObject({ wins: 0, losses: 1 });
  });
  it("side split rounds sum to total rounds played", () => {
    const s = sideSplit(matches, CAP);
    const totalRounds = matches.reduce((n, m) => n + m.rounds.length, 0);
    expect(s.atkRoundsPlayed + s.defRoundsPlayed).toBe(totalRounds);
    expect(s.atkWinRate).toBeGreaterThanOrEqual(0);
    expect(s.atkWinRate).toBeLessThanOrEqual(1);
  });
  it("recent form returns most-recent-first W/L of requested length", () => {
    const f = recentForm(matches, CAP, 5);
    expect(f).toHaveLength(5);
    expect(f.every((r) => r === "W" || r === "L")).toBe(true);
  });
});
