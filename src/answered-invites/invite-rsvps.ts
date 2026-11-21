// Reads the answer a click gave, trying each way an invitation can be
// answered.
import { BUTTON, HREF, LINK, ROLE_BUTTON, closestTo } from "../dom";
import { messageOf } from "../gmail-message";
import type { CardMessages } from "./card-messages";
import type { Rsvp } from "./rsvp";
import type { RsvpReader } from "./rsvp-reader";
import type { RsvpWay } from "./rsvp-way";

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
    private readonly cards: CardMessages,
  ) {}

  // The control is in the message, or on the event card Gmail draws above
  // it.
  read(target: EventTarget | null): Rsvp | undefined {
    const control = closestTo(target, CONTROLS);
    return control ? this.fromControl(control) : undefined;
  }

  private fromControl(control: Element): Rsvp | undefined {
    const message = this.messageFor(control);
    return message ? this.reply(control, message) : undefined;
  }

  private messageFor(control: Element): Element | undefined {
    return messageOf(control) ?? this.onCard(control);
  }

  private onCard(control: Element): Element | undefined {
    return control.matches(TOGGLE) ? undefined : this.cards.message(control);
  }

  private reply(control: Element, message: Element): Rsvp | undefined {
    return this.ways.reduce<Rsvp | undefined>(
      (found, way) => found ?? way.rsvp(control, message),
      undefined,
    );
  }
}
