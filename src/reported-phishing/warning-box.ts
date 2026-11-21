// Gmail puts a warning box at the top of a message it suspects, with its own
// "Report phishing" button. That button sits inside the message it reports.
import { messageOf } from "../gmail-message";
import { BUTTON } from "../dom";
import { REPORT } from "../gmail-labels";
import type { ReportPlace } from "./report-place";

export class WarningBox implements ReportPlace {
  reported(control: Element): Element | undefined {
    return this.reports(control) ? messageOf(control) : undefined;
  }

  private reports(control: Element): boolean {
    return control.matches(BUTTON) && control.textContent.trim() === REPORT;
  }
}
