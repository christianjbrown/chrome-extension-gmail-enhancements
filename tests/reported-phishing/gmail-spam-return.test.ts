import { GmailSpamReturn } from "../../src/reported-phishing/gmail-spam-return";
import { GmailRoutes } from "../../src/reported-phishing/gmail-routes";

describe("GmailSpamReturn", () => {
  const route = "#spam/FMfcgzAbcdefGhijkLmnopQrstuvWxyz";
  const report = { route, messageId: "#msg-f:1" };

  // Where Gmail is on each look, the last one repeating.
  function setup(routes: string[]) {
    const router = {
      current: vi.fn(() => (routes.length > 1 ? routes.shift()! : routes[0]!)),
      go: vi.fn(),
    };
    // Looks once, then gives up, the way the real one does after ten seconds.
    const waiter = {
      until: <T>(look: () => T | undefined) =>
        Promise.resolve(look() ?? look()),
    };
    const spam = new GmailSpamReturn(
      { router, routes: new GmailRoutes(16) },
      waiter,
    );
    return { spam, router };
  }

  it("opens the conversation again in Spam once Gmail is back in the list", async () => {
    const { spam, router } = setup([route, "#spam"]);

    await expect(spam.reopen(report)).resolves.toBe(true);

    expect(router.go).toHaveBeenCalledExactlyOnceWith(route);
  });

  it("opens an email reported from the inbox in Spam", async () => {
    const inbox = "#inbox/FMfcgzAbcdefGhijkLmnopQrstuvWxyz";
    const { spam, router } = setup([inbox, "#inbox"]);

    await expect(
      spam.reopen({ route: inbox, messageId: "#msg-f:1" }),
    ).resolves.toBe(true);

    expect(router.go).toHaveBeenCalledExactlyOnceWith(route);
  });

  it("stays put when Gmail never leaves the conversation", async () => {
    const { spam, router } = setup([route]);

    await expect(spam.reopen(report)).resolves.toBe(false);

    expect(router.go).not.toHaveBeenCalled();
  });

  it("stays put when the person has gone somewhere else", async () => {
    const { spam, router } = setup([route, "#starred"]);

    await expect(spam.reopen(report)).resolves.toBe(false);

    expect(router.go).not.toHaveBeenCalled();
  });
});
