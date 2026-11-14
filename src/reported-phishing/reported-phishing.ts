// Report an email that is already in Spam as phishing and it goes to Bin as
// well. Reporting it there leaves it sitting in Spam for another 30 days, when
// the point of reporting was to be rid of it.
import type { Enhancement } from "../enhancement";
import type { EventSource } from "../event-source";
import { REPORT } from "./labels";
import type { MessageMenu } from "./message-menu";
import { MESSAGE_ID } from "./messages";
import type { Navigation } from "./router";

export interface Report {
  // The address of the conversation the report was made from.
  route: string;
  // The id of the message reported.
  messageId: string;
}

export interface Cleanup {
  afterReport(report: Report): Promise<void>;
}

// Anything a person can press.
const CONTROLS = "[role='menuitem'], button, [role='button']";
// The buttons on Gmail's "Report Phishing" dialog say which they are.
const DIALOG_ACTION = "[role='alertdialog'] [data-mdc-dialog-action]";
const ACTION = "data-mdc-dialog-action";
const CONFIRM = "ok";

export class ReportedPhishing implements Enhancement {
  // The message whose menu was opened last, and the report waiting on the
  // dialog Gmail asks it in.
  private opened: Element | undefined;
  private pending: Report | undefined;

  constructor(
    private readonly source: EventSource,
    private readonly navigation: Navigation,
    private readonly menu: MessageMenu,
    private readonly cleanup: Cleanup,
  ) {}

  start(): void {
    this.source.addEventListener(
      "click",
      (event) => {
        this.clicked(event.target);
      },
      { capture: true },
    );
  }

  private clicked(target: EventTarget | null): void {
    const control = (target as Partial<Element> | null)?.closest?.(CONTROLS);
    if (!control) return;
    const owner = this.menu.owner(control);
    if (owner) this.opened = owner;
    else if (this.menu.is(control, REPORT)) this.pending = this.report();
    else if (control.matches(DIALOG_ACTION)) this.answered(control);
  }

  // Only a report made from a conversation open in Spam counts.
  private report(): Report | undefined {
    const route = this.navigation.router.current();
    const messageId = this.opened?.getAttribute(MESSAGE_ID);
    if (!messageId || !this.navigation.routes.conversation(route))
      return undefined;
    return { route, messageId };
  }

  // Cancel, or anything else, drops the report.
  private answered(control: Element): void {
    const report = this.pending;
    this.pending = undefined;
    if (report && control.getAttribute(ACTION) === CONFIRM)
      void this.cleanup.afterReport(report);
  }
}
