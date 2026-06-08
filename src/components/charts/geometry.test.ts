import { describe, it, expect } from "vitest";
import { dashArray } from "./geometry";

describe("donut geometry", () => {
  it("full ratio fills the circumference", () => {
    const C = 2 * Math.PI * 40;
    const [filled, gap] = dashArray(1, 40);
    expect(filled).toBeCloseTo(C, 3);
    expect(gap).toBeCloseTo(0, 3);
  });
  it("half ratio fills half", () => {
    const C = 2 * Math.PI * 40;
    const [filled] = dashArray(0.5, 40);
    expect(filled).toBeCloseTo(C / 2, 3);
  });
});
