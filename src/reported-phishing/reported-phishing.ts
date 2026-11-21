// Report an email as phishing and it goes to Bin as well. Gmail only moves it
// to Spam, or leaves it there, for another 30 days, when the point of
// reporting was to be rid of it.
import { MESSAGE_ID } from "../answered-invites/gmail-message";
import { BUTTON, MOUSE_EVENTS, ROLE_BUTTON, ROLE_MENU_ITEM } from "../dom";
import type { Enhancement } from "../enhancement";
import type { EventSource } from "../event-source";
import {
  DIALOG_CHOICE,
  type DialogChoice,
  type ReportDialog,
} from "./report-dialog";
import type { ReportPlace } from "./report-place";
import type { Navigation } from "./router";

export interface Report {
  // The address of the conversation the report was made from.
  route: string;
  // The id of the message reported.
  messageId: string;
}

// The places Gmail offers "Report phishing", such as a message's own menu and
// the warning box above a suspect message, and the dialog that confirms it.
export interface ReportControls {
  places: readonly ReportPlace[];
  dialog: ReportDialog;
}

export interface Cleanup {
  afterReport(report: Report): Promise<void>;
}

// Anything a person can press.
const CONTROLS = `${ROLE_MENU_ITEM}, ${BUTTON}, ${ROLE_BUTTON}`;

export class ReportedPhishing implements Enhancement {
  // The report waiting on the dialog Gmail asks it in.
  private pending: Report | undefined;

  constructor(
    private readonly source: EventSource,
    private readonly navigation: Navigation,
    private readonly controls: ReportControls,
    private readonly cleanup: Cleanup,
  ) {}

  start(): void {
    this.source.addEventListener(
      MOUSE_EVENTS.click,
      (event) => {
        this.clicked(event.target);
      },
      { capture: true },
    );
  }

  private clicked(target: EventTarget | null): void {
    const control = (target as Partial<Element> | null)?.closest?.(CONTROLS);
    if (!control) return;
    const choice = this.controls.dialog.choice(control);
    if (choice === undefined) this.chose(control);
    else this.answered(choice);
  }

  // Every place sees every press, since some keep track of what was opened.
  private chose(control: Element): void {
    const [message] = this.controls.places.flatMap(
      (place) => place.reported(control) ?? [],
    );
    if (message) this.pending = this.report(message);
  }

  // Only a report made from an open conversation counts.
  private report(message: Element): Report | undefined {
    const route = this.navigation.router.current();
    const messageId = message.getAttribute(MESSAGE_ID);
    if (!messageId || !this.navigation.routes.conversation(route))
      return undefined;
    return { route, messageId };
  }

  private answered(choice: DialogChoice): void {
    const report = this.pending;
    this.pending = undefined;
    if (report && choice === DIALOG_CHOICE.confirm)
      void this.cleanup.afterReport(report);
  }
}
