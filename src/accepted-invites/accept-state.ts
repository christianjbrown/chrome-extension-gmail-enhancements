// Whether Gmail shows a message's invitation as accepted.
import type { Labels } from "./rsvp-labels";

export interface AcceptState {
  accepted(message: Element): boolean;
}

// The ARIA states a toggle uses to tell a screen reader which answer is the
// chosen one. Gmail sets one of them on the answer it has recorded, whatever
// the button's classes are called this week.
const CHOSEN =
  "[aria-pressed='true'], [aria-checked='true'], [aria-selected='true']";

export class ChosenYes implements AcceptState {
  constructor(private readonly labels: Labels) {}

  accepted(message: Element): boolean {
    return [...message.querySelectorAll(CHOSEN)].some(
      (control) => this.labels.answer(control) === "yes",
    );
  }
}
