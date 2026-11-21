// Report an email as phishing and it goes to Bin as well. Gmail only moves it
// to Spam, or leaves it there, for another 30 days, when the point of
// reporting was to be rid of it.
import { MOUSE_EVENTS } from "../dom";
import type { Enhancement } from "../enhancement";
import { BEFORE_GMAIL, type EventSource } from "../event-source";
import type { PressHandler, PressSorter } from "./press-sorter";
import type { Cleanup, Report } from "./report";
import { DIALOG_CHOICE, type DialogChoice } from "./report-dialog";
import type { ReportRule } from "./report-rule";

export class ReportedPhishing implements Enhancement, PressHandler {
  // The report waiting on the dialog Gmail asks it in.
  private pending: Report | undefined;

  constructor(
    private readonly source: EventSource,
    private readonly presses: PressSorter,
    private readonly rule: ReportRule,
    private readonly cleanup: Cleanup,
  ) {}

  start(): void {
    this.source.addEventListener(
      MOUSE_EVENTS.click,
      (event) => {
        this.presses.sort(event.target, this);
      },
      BEFORE_GMAIL,
    );
  }

  reported(message: Element): void {
    this.pending = this.rule.report(message);
  }

  answered(choice: DialogChoice): void {
    const report = this.pending;
    this.pending = undefined;
    if (report && choice === DIALOG_CHOICE.confirm)
      void this.cleanup.afterReport(report);
  }
}
