// Report an email as phishing and it goes to Bin as well. Gmail only moves it
// to Spam, or leaves it there, for another 30 days, when the point of
// reporting was to be rid of it.
import { BUTTON, MOUSE_EVENTS, ROLE_BUTTON, ROLE_MENU_ITEM } from "../dom";
import type { Enhancement } from "../enhancement";
import { BEFORE_GMAIL, type EventSource } from "../event-source";
import type { Cleanup, Report } from "./report";
import type { ReportControls } from "./report-controls";
import { DIALOG_CHOICE, type DialogChoice } from "./report-dialog";
import type { ReportRule } from "./report-rule";

// Anything a person can press.
const CONTROLS = `${ROLE_MENU_ITEM}, ${BUTTON}, ${ROLE_BUTTON}`;

export class ReportedPhishing implements Enhancement {
  // The report waiting on the dialog Gmail asks it in.
  private pending: Report | undefined;

  constructor(
    private readonly source: EventSource,
    private readonly rule: ReportRule,
    private readonly controls: ReportControls,
    private readonly cleanup: Cleanup,
  ) {}

  start(): void {
    this.source.addEventListener(
      MOUSE_EVENTS.click,
      (event) => {
        this.clicked(event.target);
      },
      BEFORE_GMAIL,
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
    if (message) this.pending = this.rule.report(message);
  }

  private answered(choice: DialogChoice): void {
    const report = this.pending;
    this.pending = undefined;
    if (report && choice === DIALOG_CHOICE.confirm)
      void this.cleanup.afterReport(report);
  }
}
