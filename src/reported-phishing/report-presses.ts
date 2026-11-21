// Sorts what a person pressed by the places Gmail offers "Report phishing"
// and the dialog that confirms it. A press on anything else is ignored.
import { BUTTON, ROLE_BUTTON, ROLE_MENU_ITEM } from "../dom";
import type { PressHandler, PressSorter } from "./press-sorter";
import type { ReportControls } from "./report-controls";

// Anything a person can press.
const CONTROLS = `${ROLE_MENU_ITEM}, ${BUTTON}, ${ROLE_BUTTON}`;

export class ReportPresses implements PressSorter {
  constructor(private readonly controls: ReportControls) {}

  sort(target: EventTarget | null, handler: PressHandler): void {
    const control = (target as Partial<Element> | null)?.closest?.(CONTROLS);
    if (!control) return;
    const choice = this.controls.dialog.choice(control);
    if (choice !== undefined) {
      handler.answered(choice);
      return;
    }
    const message = this.reported(control);
    if (message) handler.reported(message);
  }

  // Every place sees every press, since some keep track of what was opened.
  private reported(control: Element): Element | undefined {
    const [message] = this.controls.places.flatMap(
      (place) => place.reported(control) ?? [],
    );
    return message;
  }
}
