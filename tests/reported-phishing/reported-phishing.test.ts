import { DIALOG_CHOICE } from "../../src/reported-phishing/report-dialog";
import { MenuReports } from "../../src/reported-phishing/menu-reports";
import { GmailMessageMenu } from "../../src/reported-phishing/message-menu";
import { GmailReportDialog } from "../../src/reported-phishing/gmail-report-dialog";
import { ReportPresses } from "../../src/reported-phishing/report-presses";
import { ReportedPhishing } from "../../src/reported-phishing/reported-phishing";
import { GmailRoutes } from "../../src/reported-phishing/gmail-routes";
import { ConversationReports } from "../../src/reported-phishing/conversation-reports";
import { WarningBox } from "../../src/reported-phishing/warning-box";

function controls() {
  const menu = new GmailMessageMenu(document, { visible: () => true });
  return {
    places: [new MenuReports(menu, menu), new WarningBox()],
    dialog: new GmailReportDialog(),
  };
}

describe("ReportedPhishing", () => {
  const conversation = "#spam/FMfcgzAbcdefGhijkLmnopQrstuvWxyz";

  function setup(route = conversation) {
    document.body.innerHTML = `
      <div data-message-id="#msg-f:1">
        <div role="button" aria-label="More message options" id="more"></div>
        <button id="warning"><span id="warning-label">Report phishing</span></button>
      </div>
      <div role="menu">
        <div role="menuitem" id="report">Report phishing</div>
        <div role="menuitem" id="reply">Reply</div>
      </div>
      <div role="alertdialog">
        <button data-mdc-dialog-action="cancel" id="cancel">Cancel</button>
        <button data-mdc-dialog-action="ok" id="confirm"><span id="label">Report Phishing Message</span></button>
      </div>
      <button id="elsewhere">Elsewhere</button>
      <p id="text">Words</p>`;
    const afterReport = vi.fn(() => Promise.resolve());
    const router = { current: vi.fn(() => route) };
    new ReportedPhishing(
      document,
      new ReportPresses(controls()),
      new ConversationReports({ router, routes: new GmailRoutes(16) }),
      { afterReport },
    ).start();
    const click = (...ids: string[]) => {
      for (const id of ids)
        document
          .getElementById(id)!
          .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    };
    return { afterReport, click };
  }

  it.each([
    conversation,
    "#inbox/FMfcgzAbcdefGhijkLmnopQrstuvWxyz",
    "#label/Receipts/FMfcgzAbcdefGhijkLmnopQrstuvWxyz",
  ])("cleans up once a report from %s is confirmed", (route) => {
    const { afterReport, click } = setup(route);

    click("more", "report", "label");

    expect(afterReport).toHaveBeenCalledExactlyOnceWith({
      route,
      messageId: "#msg-f:1",
    });
  });

  it("cleans up once a report from the warning box is confirmed", () => {
    const { afterReport, click } = setup();

    click("warning-label", "confirm");

    expect(afterReport).toHaveBeenCalledExactlyOnceWith({
      route: conversation,
      messageId: "#msg-f:1",
    });
  });

  it("does nothing when a warning box report is cancelled", () => {
    const { afterReport, click } = setup();

    click("warning", "cancel", "confirm");

    expect(afterReport).not.toHaveBeenCalled();
  });

  it("does nothing when the report is cancelled", () => {
    const { afterReport, click } = setup();

    click("more", "report", "cancel", "confirm");

    expect(afterReport).not.toHaveBeenCalled();
  });

  it("does nothing for a report made with no conversation open", () => {
    const { afterReport, click } = setup("#inbox");

    click("more", "report", "confirm");

    expect(afterReport).not.toHaveBeenCalled();
  });

  it("does nothing without knowing which message was reported", () => {
    const { afterReport, click } = setup();

    click("report", "confirm");

    expect(afterReport).not.toHaveBeenCalled();
  });

  it("ignores other menu items and clicks", () => {
    const { afterReport, click } = setup();

    click("more", "reply", "elsewhere", "text", "confirm");

    expect(afterReport).not.toHaveBeenCalled();
  });

  it("ignores clicks with no element behind them", () => {
    const afterReport = vi.fn(() => Promise.resolve());
    const listeners: ((event: Event) => void)[] = [];
    new ReportedPhishing(
      { addEventListener: (_type, listener) => listeners.push(listener) },
      new ReportPresses(controls()),
      { report: vi.fn() },
      { afterReport },
    ).start();

    listeners[0]!(new Event("click"));

    expect(afterReport).not.toHaveBeenCalled();
  });

  it("listens before Gmail's own handlers", () => {
    const addEventListener = vi.fn();

    new ReportedPhishing(
      { addEventListener },
      new ReportPresses(controls()),
      { report: vi.fn() },
      { afterReport: vi.fn() },
    ).start();

    expect(addEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      { capture: true },
    );
  });
});

describe("ReportedPhishing with its collaborators faked", () => {
  const report = { route: "#inbox/abc", messageId: "#msg-f:1" };

  function setup(counts: (message: Element) => boolean) {
    const afterReport = vi.fn(() => Promise.resolve());
    const phishing = new ReportedPhishing(
      { addEventListener: vi.fn() },
      { sort: vi.fn() },
      { report: (message) => (counts(message) ? report : undefined) },
      { afterReport },
    );
    return { phishing, afterReport };
  }

  it("forgets a pending report when a later press makes none that counts", () => {
    const first = document.createElement("div");
    const { phishing, afterReport } = setup((message) => message === first);

    phishing.reported(first);
    phishing.reported(document.createElement("div"));
    phishing.answered(DIALOG_CHOICE.confirm);

    expect(afterReport).not.toHaveBeenCalled();
  });

  it("cleans up only once per confirmed report", () => {
    const { phishing, afterReport } = setup(() => true);

    phishing.reported(document.createElement("div"));
    phishing.answered(DIALOG_CHOICE.confirm);
    phishing.answered(DIALOG_CHOICE.confirm);

    expect(afterReport).toHaveBeenCalledExactlyOnceWith(report);
  });
});
