// Gmail's "Report Phishing" dialog, which asks before sending a report. Its
// buttons say which they are.
import {
  DIALOG_CHOICE,
  type DialogChoice,
  type ReportDialog,
} from "./report-dialog";

const ACTION = "data-mdc-dialog-action";
const BUTTONS = `[role='alertdialog'] [${ACTION}]`;
const CONFIRM = "ok";

export class GmailReportDialog implements ReportDialog {
  // Cancel, or anything else, dismisses it.
  choice(control: Element): DialogChoice | undefined {
    return control.matches(BUTTONS) ? this.answer(control) : undefined;
  }

  private answer(button: Element): DialogChoice {
    return button.getAttribute(ACTION) === CONFIRM
      ? DIALOG_CHOICE.confirm
      : DIALOG_CHOICE.dismiss;
  }
}
