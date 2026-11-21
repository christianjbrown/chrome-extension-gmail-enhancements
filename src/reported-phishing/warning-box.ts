// Gmail puts a warning box at the top of a message it suspects, with its own
// "Report phishing" button. That button sits inside the message it reports.
import { MESSAGE } from "../answered-invites/gmail-message";
import { BUTTON } from "../dom";
import { REPORT } from "../gmail-labels";
import type { ReportPlace } from "./report-place";

export class WarningBox implements ReportPlace {
  reported(control: Element): Element | undefined {
    const reports =
      control.matches(BUTTON) && control.textContent.trim() === REPORT;
    return reports ? (control.closest(MESSAGE) ?? undefined) : undefined;
  }
}
