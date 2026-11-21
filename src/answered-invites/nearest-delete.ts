// Finds the visible Delete button nearest a message.
import { ARIA_LABEL, ROLE_BUTTON } from "../dom";
import { MESSAGE } from "../gmail-message";
import type { Visibility } from "../visibility";
import type { DeleteButton, DeleteFinder } from "./delete-finder";

// Gmail's Delete toolbar button. Its classes are renamed with every build,
// but its role, its aria-label (what a screen reader announces) and its
// tooltip all say what it is, and say "Delete" in English Gmail. Some views
// carry the tooltip as a plain title and nothing else.
const DELETE_ATTRIBUTES = [ARIA_LABEL, "data-tooltip", "title"];

export class NearestDelete implements DeleteFinder {
  private readonly selector: string;

  constructor(
    private readonly visibility: Visibility,
    label: string,
  ) {
    this.selector = DELETE_ATTRIBUTES.map(
      (attribute) => `${ROLE_BUTTON}[${attribute}='${label}']`,
    ).join(", ");
  }

  // The button for this message is the visible one closest to it: the
  // conversation's own toolbar, or the reading pane's. So walk out from the
  // message and stop at the first ancestor holding any. More than one there
  // means no telling which acts on what, so none is used.
  find(message: Element): DeleteButton | undefined {
    return this.from(message.parentElement);
  }

  private from(view: Element | null): DeleteButton | undefined {
    return view ? this.at(view) : undefined;
  }

  private at(view: Element): DeleteButton | undefined {
    const [control, ...others] = this.controls(view);
    return control
      ? this.only(control, others, view)
      : this.from(view.parentElement);
  }

  private only(
    control: Element,
    others: Element[],
    view: Element,
  ): DeleteButton | undefined {
    return others.length === 0 ? { control, view } : undefined;
  }

  // Anything inside a message is the sender's markup, not Gmail's.
  private controls(view: Element): Element[] {
    return [...view.querySelectorAll(this.selector)].filter(
      (control) =>
        control.closest(MESSAGE) === null && this.visibility.visible(control),
    );
  }
}
