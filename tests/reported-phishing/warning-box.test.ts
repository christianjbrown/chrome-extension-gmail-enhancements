import { WarningBox } from "../../src/reported-phishing/warning-box";

describe("WarningBox", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-message-id="#msg-f:1" id="message">
        <button id="report"> Report phishing </button>
        <button id="not-spam">Report as not spam</button>
        <div role="menuitem" id="item">Report phishing</div>
      </div>
      <button id="outside">Report phishing</button>`;
  });
  const element = (id: string) => document.getElementById(id)!;

  it("finds the message its Report phishing button sits in", () => {
    expect(new WarningBox().message(element("report"))).toBe(
      element("message"),
    );
  });

  it.each(["not-spam", "item", "outside"])("ignores %s", (id) => {
    expect(new WarningBox().message(element(id))).toBeUndefined();
  });
});
