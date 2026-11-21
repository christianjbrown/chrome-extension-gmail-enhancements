import { CONTENT_CONFIG } from "../src/config";

describe("content config", () => {
  it("waits fifteen seconds for an invitation's reply, looking every half second", () => {
    expect(CONTENT_CONFIG.inviteChecks).toEqual({ everyMs: 500, checks: 30 });
  });

  it("needs the reply shown twice in a row", () => {
    expect(CONTENT_CONFIG.inviteSettledChecks).toBe(2);
  });

  it("waits ten seconds for each step of a phishing report, looking every quarter second", () => {
    expect(CONTENT_CONFIG.phishingChecks).toEqual({ everyMs: 250, checks: 40 });
  });

  it("takes sixteen letters and digits as a conversation id", () => {
    expect(CONTENT_CONFIG.conversationIdMinLength).toBe(16);
  });
});
