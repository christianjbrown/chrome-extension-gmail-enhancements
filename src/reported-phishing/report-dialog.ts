// Gmail's "Report Phishing" dialog, which asks before sending a report. Its
// buttons say which they are.
export const DIALOG_CHOICE = {
  confirm: "confirm",
  dismiss: "dismiss",
} as const;

export type DialogChoice = (typeof DIALOG_CHOICE)[keyof typeof DIALOG_CHOICE];

export interface ReportDialog {
  // What pressing the control answers, or undefined when it is not one of
  // the dialog's buttons.
  choice(control: Element): DialogChoice | undefined;
}

const ACTION = "data-mdc-dialog-action";
const BUTTONS = `[role='alertdialog'] [${ACTION}]`;
const CONFIRM = "ok";

export class GmailReportDialog implements ReportDialog {
  // Cancel, or anything else, dismisses it.
  choice(control: Element): DialogChoice | undefined {
    if (!control.matches(BUTTONS)) return undefined;
    return control.getAttribute(ACTION) === CONFIRM
      ? DIALOG_CHOICE.confirm
      : DIALOG_CHOICE.dismiss;
  }
}
