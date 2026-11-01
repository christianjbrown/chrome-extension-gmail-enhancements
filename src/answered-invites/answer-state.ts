// Whether Gmail shows a message's invitation as answered a given way.
import type { Answer } from "./answer";
import type { Labels } from "./rsvp-labels";

export interface AnswerState {
  answered(message: Element, answer: Answer): boolean;
}

// The ARIA states a toggle uses to tell a screen reader which answer is the
// chosen one. Gmail sets one of them on the answer it has recorded, whatever
// the button's classes are called this week.
const CHOSEN =
  "[aria-pressed='true'], [aria-checked='true'], [aria-selected='true']";

export class ChosenAnswer implements AnswerState {
  constructor(private readonly labels: Labels) {}

  answered(message: Element, answer: Answer): boolean {
    return [...message.querySelectorAll(CHOSEN)].some(
      (control) => this.labels.answer(control) === answer,
    );
  }
}
