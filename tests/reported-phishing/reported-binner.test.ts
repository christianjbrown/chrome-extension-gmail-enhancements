import type { MessageMenu } from "../../src/reported-phishing/message-menu";
import { ReportedBinner } from "../../src/reported-phishing/reported-binner";
import { GmailRoutes } from "../../src/reported-phishing/gmail-routes";

describe("ReportedBinner", () => {
  const route = "#spam/FMfcgzAbcdefGhijkLmnopQrstuvWxyz";
  const report = { route, messageId: "#msg-f:1" };
  const message = document.createElement("div");
  const button = document.createElement("div");
  const reported = document.createElement("div");
  const del = document.createElement("div");

  interface Options {
    // Where Gmail is on each look, the last one repeating.
    routes?: string[];
    found?: Element | undefined;
    button?: Element | undefined;
    reported?: Element | undefined;
    del?: Element | undefined;
  }

  function setup(options: Options = {}) {
    const routes = options.routes ?? [route, "#spam"];
    const router = {
      current: vi.fn(() => (routes.length > 1 ? routes.shift()! : routes[0]!)),
      go: vi.fn(),
    };
    const press = vi.fn();
    const menu: MessageMenu = {
      owner: vi.fn(),
      is: vi.fn(),
      button: vi.fn(() => ("button" in options ? options.button : button)),
      item: vi.fn(() => ("reported" in options ? options.reported : reported)),
      sibling: vi.fn(() => ("del" in options ? options.del : del)),
    };
    const find = vi.fn(() => ("found" in options ? options.found : message));
    // Looks once, then gives up, the way the real one does after ten seconds.
    const waiter = {
      until: <T>(look: () => T | undefined) =>
        Promise.resolve(look() ?? look()),
    };
    const binner = new ReportedBinner(
      { router, routes: new GmailRoutes(16) },
      waiter,
      { messages: { find }, menu },
      { press },
    );
    return { binner, router, press, menu, find };
  }

  it("reopens the conversation and presses the menu's Delete", async () => {
    const { binner, router, press, menu, find } = setup();

    await binner.afterReport(report);

    expect(router.go).toHaveBeenCalledExactlyOnceWith(route);
    expect(find).toHaveBeenCalledWith("#msg-f:1");
    expect(menu.button).toHaveBeenCalledWith(message);
    expect(menu.item).toHaveBeenCalledWith("Report as not phishing");
    expect(menu.sibling).toHaveBeenCalledWith(reported, "Delete");
    expect(press.mock.calls).toEqual([[button], [del]]);
  });

  it("opens an email reported from the inbox in Spam to delete it", async () => {
    const inbox = "#inbox/FMfcgzAbcdefGhijkLmnopQrstuvWxyz";
    const { binner, router, press } = setup({ routes: [inbox, "#inbox"] });

    await binner.afterReport({ route: inbox, messageId: "#msg-f:1" });

    expect(router.go).toHaveBeenCalledExactlyOnceWith(route);
    expect(press.mock.calls).toEqual([[button], [del]]);
  });

  it("does nothing when Gmail never leaves the conversation", async () => {
    const { binner, router, press } = setup({ routes: [route] });

    await binner.afterReport(report);

    expect(router.go).not.toHaveBeenCalled();
    expect(press).not.toHaveBeenCalled();
  });

  it("does nothing when the person has gone somewhere else", async () => {
    const { binner, router } = setup({ routes: [route, "#starred"] });

    await binner.afterReport(report);

    expect(router.go).not.toHaveBeenCalled();
  });

  it("does nothing when the message never shows up again", async () => {
    const { binner, menu, press } = setup({ found: undefined });

    await binner.afterReport(report);

    expect(menu.button).not.toHaveBeenCalled();
    expect(press).not.toHaveBeenCalled();
  });

  it("does nothing when the message has no menu", async () => {
    const { binner, press } = setup({ button: undefined });

    await binner.afterReport(report);

    expect(press).not.toHaveBeenCalled();
  });

  it("keeps the email when Gmail shows no sign of the report", async () => {
    const { binner, press, menu } = setup({ reported: undefined });

    await binner.afterReport(report);

    expect(menu.sibling).not.toHaveBeenCalled();
    expect(press).toHaveBeenCalledExactlyOnceWith(button);
  });

  it("keeps the email when the menu has no Delete", async () => {
    const { binner, press } = setup({ del: undefined });

    await binner.afterReport(report);

    expect(press).toHaveBeenCalledExactlyOnceWith(button);
  });
});
