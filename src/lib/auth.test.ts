import { describe, it, expect } from "vitest";
import { DEMO_COOKIE } from "./auth";

describe("auth cookie", () => {
  it("uses a stable demo cookie name", () => {
    expect(DEMO_COOKIE).toBe("pg_demo_linked");
  });
});
