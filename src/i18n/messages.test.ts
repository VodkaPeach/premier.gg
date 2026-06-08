import { describe, it, expect } from "vitest";
import { messages } from "./messages";

describe("i18n messages", () => {
  it("has the app name and the Riot non-endorsement disclaimer", () => {
    expect(messages.app.name).toBe("premier.gg");
    expect(messages.disclaimer).toContain("isn't endorsed by Riot Games");
  });
});
