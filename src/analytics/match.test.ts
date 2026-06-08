import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseMatch } from "@/domain/parse-match";
import type { RiotMatchDto } from "@/match-source/riot-dto";
import { roundTimeline, eventPoints } from "./match";

const FIX = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures", "matches");
const m1 = parseMatch(JSON.parse(readFileSync(join(FIX, "m-0001.json"), "utf8")) as RiotMatchDto);

describe("match analytics", () => {
  it("round timeline has one entry per round with a winner", () => {
    const t = roundTimeline(m1);
    expect(t).toHaveLength(m1.rounds.length);
    expect(t.every((r) => r.winner === "Blue" || r.winner === "Red")).toBe(true);
  });
  it("event points include kills with in-bounds normalized coordinates", () => {
    const pts = eventPoints(m1);
    expect(pts.length).toBeGreaterThan(0);
    for (const p of pts) {
      expect(p.nx).toBeGreaterThanOrEqual(0); expect(p.nx).toBeLessThanOrEqual(1);
      expect(p.ny).toBeGreaterThanOrEqual(0); expect(p.ny).toBeLessThanOrEqual(1);
    }
  });
  it("kills carry the killing team's side", () => {
    const kills = eventPoints(m1).filter((p) => p.kind === "kill");
    expect(kills.length).toBeGreaterThan(0);
    expect(kills.every((k) => k.side === "Blue" || k.side === "Red")).toBe(true);
  });
});
