import { ReportedBinner } from "../../src/reported-phishing/reported-binner";

describe("ReportedBinner", () => {
  const report = {
    route: "#spam/FMfcgzAbcdefGhijkLmnopQrstuvWxyz",
    messageId: "#msg-f:1",
  };
  const message = document.createElement("div");

  function setup(reopened = true, found: Element | null = message) {
    const spam = { reopen: vi.fn(() => Promise.resolve(reopened)) };
    const find = vi.fn(() => found ?? undefined);
    const deleter = { delete: vi.fn(() => Promise.resolve()) };
    const waiter = {
      until: <T>(look: () => T | undefined) => Promise.resolve(look()),
    };
    const binner = new ReportedBinner(spam, waiter, { find }, deleter);
    return { binner, spam, find, deleter };
  }

  it("reopens the conversation and deletes the reported message", async () => {
    const { binner, spam, find, deleter } = setup();

    await binner.afterReport(report);

    expect(spam.reopen).toHaveBeenCalledWith(report);
    expect(find).toHaveBeenCalledWith("#msg-f:1");
    expect(deleter.delete).toHaveBeenCalledExactlyOnceWith(message);
  });

  it("does nothing when Gmail did not go where a report sends it", async () => {
    const { binner, find, deleter } = setup(false);

    await binner.afterReport(report);

    expect(find).not.toHaveBeenCalled();
    expect(deleter.delete).not.toHaveBeenCalled();
  });

  it("does nothing when the message never shows up again", async () => {
    const { binner, deleter } = setup(true, null);

    await binner.afterReport(report);

    expect(deleter.delete).not.toHaveBeenCalled();
  });
});
