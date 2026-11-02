// Whether Gmail shows a message's invitation as answered a given way.
import type { Answer } from "./answer";
import type { EventCards } from "./event-card";
import type { Labels } from "./rsvp-labels";

export interface AnswerState {
  answered(message: Element, answer: Answer): boolean;
}

// The ARIA states a toggle uses to tell a screen reader which answer is the
// chosen one. Gmail sets one of them on the answer it has recorded, whatever
// the button's classes are called this week.
const CHOSEN =
  "[aria-pressed='true'], [aria-checked='true'], [aria-selected='true']";

// Gmail's event card shows no ARIA state. Once an answer is recorded, it
// swaps its Yes, No and Maybe for one button naming the answer, which opens a
// menu to change it.
const RECORDED = "[aria-haspopup='menu']";

export class ChosenAnswer implements AnswerState {
  constructor(
    private readonly labels: Labels,
    private readonly cards: EventCards,
  ) {}

  answered(message: Element, answer: Answer): boolean {
    return (
      this.shows(message, CHOSEN, answer) ||
      this.shows(this.cards.card(message), RECORDED, answer)
    );
  }

  private shows(
    within: Element | undefined,
    selector: string,
    answer: Answer,
  ): boolean {
    return [...(within?.querySelectorAll(selector) ?? [])].some(
      (control) => this.labels.answer(control) === answer,
    );
  }
}
