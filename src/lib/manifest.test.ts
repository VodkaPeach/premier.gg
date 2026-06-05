import { describe, it, expect } from "vitest";
import { readManifest, matchSummary } from "./manifest";

describe("manifest reader", () => {
  it("reads the captain puuid and 5 match summaries", () => {
    const m = readManifest();
    expect(m.captainPuuid).toBe("mock-captain-0001");
    expect(m.matches).toHaveLength(5);
    expect(m.team.name).toBe("Mock Esports");
  });

  it("looks up a match summary by id", () => {
    const m = readManifest();
    const s = matchSummary(m, "m-0001");
    expect(s?.map).toBe("Ascent");
    expect(s?.result).toBe("win");
    expect(s?.opponent.name).toBe("Rival Squad");
  });

  it("returns undefined for an unknown match id", () => {
    const m = readManifest();
    expect(matchSummary(m, "nope")).toBeUndefined();
  });
});
