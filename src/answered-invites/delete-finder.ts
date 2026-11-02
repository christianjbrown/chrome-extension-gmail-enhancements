// Finds the Delete button that acts on the conversation a message is in.
import { MESSAGE } from "./gmail-message";
import type { Visibility } from "./visibility";

export interface DeleteButton {
  control: Element;
  // The part of the page the button belongs to.
  view: Element;
}

export interface DeleteFinder {
  find(message: Element): DeleteButton | undefined;
}

// Gmail's Delete toolbar button. Its classes are renamed with every build,
// but its role, its aria-label (what a screen reader announces) and its
// tooltip all say what it is, and say "Delete" in English Gmail. Some views
// carry the tooltip as a plain title and nothing else.
const DELETE = ["aria-label", "data-tooltip", "title"]
  .map((attribute) => `[role='button'][${attribute}='Delete']`)
  .join(", ");

export class NearestDelete implements DeleteFinder {
  constructor(private readonly visibility: Visibility) {}

  // The button for this message is the visible one closest to it: the
  // conversation's own toolbar, or the reading pane's. So walk out from the
  // message and stop at the first ancestor holding any. More than one there
  // means no telling which acts on what, so none is used.
  find(message: Element): DeleteButton | undefined {
    for (let view = message.parentElement; view; view = view.parentElement) {
      const [control, ...others] = this.controls(view);
      if (control) return others.length === 0 ? { control, view } : undefined;
    }
    return undefined;
  }

  // Anything inside a message is the sender's markup, not Gmail's.
  private controls(view: Element): Element[] {
    return [...view.querySelectorAll(DELETE)].filter(
      (control) =>
        control.closest(MESSAGE) === null && this.visibility.visible(control),
    );
  }
}
