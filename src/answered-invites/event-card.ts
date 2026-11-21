// Gmail's summary card for an event it found in an email: the date, the
// guests and the Yes, No and Maybe buttons at the top of a conversation, with
// "Based on this email" under it. It sits beside the message rather than in
// it, in an element whose data-container-id names the message, such as
// "0:msg-f:123:extractedsmartmailevent" for data-message-id="#msg-f:123".
import { GMAIL_ID, MESSAGE_ID, MESSAGE_ID_PREFIX } from "../gmail-message";

export interface CardMessages {
  // The message a control on a card is about.
  message(control: Element): Element | undefined;
}

export interface MessageCards {
  // The card Gmail drew for a message, if any. Gmail draws a new card each
  // time it records an answer, so it is looked up afresh rather than kept.
  card(message: Element): Element | undefined;
}

const CONTAINER_ID = "data-container-id";
const CARD = `[${CONTAINER_ID}]`;
// What separates the parts of a container id.
const SEPARATOR = ":";
// The message id inside a container id, followed by what the card holds.
const CONTAINED = new RegExp(`(?:^|${SEPARATOR})(${GMAIL_ID})${SEPARATOR}`);
// A message id as data-message-id carries it.
const MESSAGE_ID_VALUE = new RegExp(`^${MESSAGE_ID_PREFIX}?(${GMAIL_ID})$`);

export class SmartEventCards implements CardMessages, MessageCards {
  message(control: Element): Element | undefined {
    const card = control.closest(CARD);
    const id = CONTAINED.exec(card?.getAttribute(CONTAINER_ID) ?? "")?.[1];
    return card && id
      ? near(card, `[${MESSAGE_ID}="${MESSAGE_ID_PREFIX}${id}"]`)
      : undefined;
  }

  card(message: Element): Element | undefined {
    const id = MESSAGE_ID_VALUE.exec(
      message.getAttribute(MESSAGE_ID) ?? "",
    )?.[1];
    return id
      ? near(message, `[${CONTAINER_ID}*="${id}${SEPARATOR}"]`)
      : undefined;
  }
}

// Gmail keeps the views you are not looking at in the page, so the match
// that counts is the one nearest: the first found walking out from here.
function near(from: Element, selector: string): Element | undefined {
  for (let view = from.parentElement; view; view = view.parentElement) {
    const match = view.querySelector(selector);
    if (match) return match;
  }
  return undefined;
}
