// Which reply an RSVP control stands for, from what it says. Gmail draws the
// Yes, Maybe and No on its invite card as role="button" elements whose class
// names change with every build, so their words are the anchor: the
// aria-label a screen reader announces, or the text when there is none. These
// are English Gmail's words. In another language nothing matches, and only
// Calendar's own reply links are recognised.
import { ARIA_LABEL } from "../dom";
import type { Answer } from "./answer";

export interface Labels {
  answer(control: Element): Answer | undefined;
}

// A whole word at the start, so "Yes, I'll be there" counts and "Notes" does
// not.
const WORDS = /^(yes|maybe|no)\b/i;

export class RsvpLabels implements Labels {
  answer(control: Element): Answer | undefined {
    const label = control.getAttribute(ARIA_LABEL) ?? control.textContent;
    const word = WORDS.exec(label.trim())?.[1]?.toLowerCase();
    return word as Answer | undefined;
  }
}
