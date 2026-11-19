// Report an email as phishing and it goes to Bin as well. Gmail only moves it
// to Spam, or leaves it there, for another 30 days, when the point of
// reporting was to be rid of it.
import type { Enhancement } from "../enhancement";
import type { EventSource } from "../event-source";
import { REPORT } from "./labels";
import type { MessageMenu } from "./message-menu";
import { MESSAGE_ID } from "./messages";
import type { Navigation } from "./router";
import type { ReportButton } from "./warning-box";

export interface Report {
  // The address of the conversation the report was made from.
  route: string;
  // The id of the message reported.
  messageId: string;
}

// The two places Gmail offers "Report phishing": a message's own menu and the
// warning box above a suspect message.
export interface ReportControls {
  menu: MessageMenu;
  warning: ReportButton;
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
    private readonly controls: ReportControls,
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
    if (control.matches(DIALOG_ACTION)) this.answered(control);
    else this.chose(control);
  }

  private chose(control: Element): void {
    const { menu } = this.controls;
    const owner = menu.owner(control);
    if (owner) this.opened = owner;
    else if (menu.is(control, REPORT)) this.pending = this.report(this.opened);
    else this.fromWarning(control);
  }

  // The warning box's button names its message by where it sits.
  private fromWarning(control: Element): void {
    const message = this.controls.warning.message(control);
    if (message) this.pending = this.report(message);
  }

  // Only a report made from an open conversation counts.
  private report(message: Element | undefined): Report | undefined {
    const route = this.navigation.router.current();
    const messageId = message?.getAttribute(MESSAGE_ID);
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
