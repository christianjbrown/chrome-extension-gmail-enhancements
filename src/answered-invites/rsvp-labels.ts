// Which reply an RSVP control stands for, from what it says. Gmail draws the
// Yes, Maybe and No on its invite card as role="button" elements whose class
// names change with every build, so their words are the anchor: the
// aria-label a screen reader announces, or the text when there is none. In
// a language the words do not cover nothing matches, and only Calendar's own
// reply links are recognised.
import { ARIA_LABEL } from "../dom";
import type { Answer } from "./answer";
import type { Labels } from "./labels";

// The first whole word, so "Yes, I'll be there" counts and "Notes" does not.
const FIRST_WORD = /^\w+/;

export class RsvpLabels implements Labels {
  // Each answer's word, in lower case.
  constructor(private readonly words: ReadonlyMap<string, Answer>) {}

  answer(control: Element): Answer | undefined {
    const label = control.getAttribute(ARIA_LABEL) ?? control.textContent;
    const word = FIRST_WORD.exec(label.trim())?.[0];
    return word === undefined ? undefined : this.words.get(word.toLowerCase());
  }
}
