// Works out whether a click answered an invitation, and how.
import { BUTTON, HREF, LINK, ROLE_BUTTON } from "../dom";
import type { Answer } from "./answer";
import type { EventCards } from "./event-card";
import { MESSAGE } from "./gmail-message";

// A Calendar reply link, or a control on one of Gmail's invite cards.
export const VIA = { link: "link", button: "button" } as const;

export type Via = (typeof VIA)[keyof typeof VIA];

export interface Rsvp {
  answer: Answer;
  // The message holding the invitation.
  message: Element;
  via: Via;
}

export interface RsvpReader {
  read(target: EventTarget | null): Rsvp | undefined;
}

// One way a control can answer the invitation in a message.
export interface RsvpWay {
  rsvp(control: Element, message: Element): Rsvp | undefined;
}

// Anything a person can press: a link, a real button, or one of Gmail's
// role="button" elements, which is what its invite card answers are.
const CONTROLS = `${LINK}[${HREF}], ${BUTTON}, ${ROLE_BUTTON}`;
// A toggle on Gmail's event card is its "Correct?" thumbs up or down, labelled
// Yes and No, asking whether it read the email right. Never an answer.
const TOGGLE = "[aria-pressed]";

export class InviteRsvps implements RsvpReader {
  // The ways are tried in order, and the first that reads an answer wins.
  constructor(
    private readonly ways: readonly RsvpWay[],
    private readonly cards: EventCards,
  ) {}

  // The control is in the message, or on the event card Gmail draws above
  // it.
  read(target: EventTarget | null): Rsvp | undefined {
    const control = (target as Partial<Element> | null)?.closest?.(CONTROLS);
    if (!control) return undefined;
    const message = control.closest(MESSAGE) ?? this.onCard(control);
    return message ? this.reply(control, message) : undefined;
  }

  private onCard(control: Element): Element | undefined {
    return control.matches(TOGGLE) ? undefined : this.cards.message(control);
  }

  private reply(control: Element, message: Element): Rsvp | undefined {
    for (const way of this.ways) {
      const rsvp = way.rsvp(control, message);
      if (rsvp) return rsvp;
    }
    return undefined;
  }
}
