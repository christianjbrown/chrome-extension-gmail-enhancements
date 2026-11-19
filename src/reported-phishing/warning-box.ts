// Gmail puts a warning box at the top of a message it suspects, with its own
// "Report phishing" button. That button sits inside the message it reports.
import { MESSAGE } from "../answered-invites/gmail-message";
import { REPORT } from "./labels";

export interface ReportButton {
  message(control: Element): Element | undefined;
}

const BUTTON = "button";

export class WarningBox implements ReportButton {
  message(control: Element): Element | undefined {
    const reports =
      control.matches(BUTTON) && control.textContent.trim() === REPORT;
    return reports ? (control.closest(MESSAGE) ?? undefined) : undefined;
  }
}
