// The dialog that asks before sending a phishing report, and what pressing
// one of its buttons answers.
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
