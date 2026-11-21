import { HashRouter } from "../../src/reported-phishing/hash-router";

describe("HashRouter", () => {
  it("reads where Gmail is from the hash", () => {
    expect(new HashRouter({ hash: "#inbox/abc" }).current()).toBe("#inbox/abc");
  });

  it("sends Gmail somewhere else by setting the hash", () => {
    const location = { hash: "#inbox" };

    new HashRouter(location).go("#spam/abc");

    expect(location.hash).toBe("#spam/abc");
  });
});
