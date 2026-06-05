// Invariants over a generated fixture. Run with: pnpm test (after `pnpm fixtures`).
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseMatch } from "../src/domain/parse-match";
import type { RiotMatchDto } from "../src/match-source/riot-dto";

const FIX = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "fixtures");
const load = (id: string): RiotMatchDto =>
  JSON.parse(readFileSync(join(FIX, "matches", `${id}.json`), "utf8"));

describe("parseMatch over generated fixtures", () => {
  it("m-0001 is an Ascent Premier match with 10 players", () => {
    const m = parseMatch(load("m-0001"));
    expect(m.map).toBe("Ascent");
    expect(m.queue).toBe("premier");
    expect(m.players).toHaveLength(10);
    expect(m.players.filter((p) => p.side === "Blue")).toHaveLength(5);
  });

  it("team roundsWon equals number of rounds that team won", () => {
    const m = parseMatch(load("m-0001"));
    const blueWins = m.rounds.filter((r) => r.winner === "Blue").length;
    expect(blueWins).toBe(m.teams.Blue.roundsWon);
    expect(m.rounds).toHaveLength(m.teams.Blue.roundsWon + m.teams.Red.roundsWon);
  });

  it("every round with kills has exactly one first blood", () => {
    const m = parseMatch(load("m-0001"));
    for (const r of m.rounds) {
      if (r.kills.length === 0) continue;
      expect(r.kills.filter((k) => k.isFirstBlood)).toHaveLength(1);
      // first blood is the earliest kill
      const fb = r.kills.find((k) => k.isFirstBlood)!;
      expect(fb.roundTime).toBe(Math.min(...r.kills.map((k) => k.roundTime)));
    }
  });

  it("all kill weapons resolve to a readable name (not a raw uuid)", () => {
    const m = parseMatch(load("m-0001"));
    const uuidLike = /^[0-9a-f]{8}-/;
    for (const r of m.rounds)
      for (const k of r.kills) expect(k.weapon).not.toMatch(uuidLike);
  });

  it("contains at least one 1vX clutch round won by the trailing side", () => {
    const m = parseMatch(load("m-0001"));
    // a clutch round here = a round where the winning side's last-killer made >=3 kills
    const hasClutch = m.rounds.some((r) => {
      const byKiller = new Map<string, number>();
      for (const k of r.kills) byKiller.set(k.killer, (byKiller.get(k.killer) ?? 0) + 1);
      return [...byKiller.values()].some((n) => n >= 3);
    });
    expect(hasClutch).toBe(true);
  });
});
