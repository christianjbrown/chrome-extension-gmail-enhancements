// Gmail's summary card for an event it found in an email: the date, the
// guests and the Yes, No and Maybe buttons at the top of a conversation, with
// "Based on this email" under it. It sits beside the message rather than in
// it, in an element whose data-container-id names the message, such as
// "0:msg-f:123:extractedsmartmailevent" for data-message-id="#msg-f:123".
import { GMAIL_ID, MESSAGE_ID, MESSAGE_ID_PREFIX } from "../gmail-message";
import type { CardMessages } from "./card-messages";
import type { MessageCards } from "./message-cards";

const CONTAINER_ID = "data-container-id";
const CARD = `[${CONTAINER_ID}]`;
// What separates the parts of a container id.
const SEPARATOR = ":";
// The message id inside a container id, followed by what the card holds.
const CONTAINED = new RegExp(`(?:^|${SEPARATOR})(${GMAIL_ID})${SEPARATOR}`);
// A message id as data-message-id carries it.
const MESSAGE_ID_VALUE = new RegExp(`^${MESSAGE_ID_PREFIX}?(${GMAIL_ID})$`);
// A missing attribute reads as an empty one, which holds no id.
const MISSING = "";

const attributeOf = (element: Element, name: string): string =>
  element.getAttribute(name) ?? MISSING;

// The id a pattern found, when it found one.
const idIn = (pattern: RegExp, value: string): string | undefined =>
  pattern.exec(value)?.[1];

export class SmartEventCards implements CardMessages, MessageCards {
  message(control: Element): Element | undefined {
    const card = control.closest(CARD);
    return card ? this.cardMessage(card) : undefined;
  }

  card(message: Element): Element | undefined {
    const id = idIn(MESSAGE_ID_VALUE, attributeOf(message, MESSAGE_ID));
    return id
      ? near(message, `[${CONTAINER_ID}*="${id}${SEPARATOR}"]`)
      : undefined;
  }

  private cardMessage(card: Element): Element | undefined {
    const id = idIn(CONTAINED, attributeOf(card, CONTAINER_ID));
    return id
      ? near(card, `[${MESSAGE_ID}="${MESSAGE_ID_PREFIX}${id}"]`)
      : undefined;
  }
}

// Gmail keeps the views you are not looking at in the page, so the match
// that counts is the one nearest: the first found walking out from here.
function near(from: Element, selector: string): Element | undefined {
  const view = from.parentElement;
  return view ? nearIn(view, selector) : undefined;
}

function nearIn(view: Element, selector: string): Element | undefined {
  return view.querySelector(selector) ?? near(view, selector);
}
