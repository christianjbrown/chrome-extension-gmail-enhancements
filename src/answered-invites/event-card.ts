// Gmail's summary card for an event it found in an email: the date, the
// guests and the Yes, No and Maybe buttons at the top of a conversation, with
// "Based on this email" under it. It sits beside the message rather than in
// it, in an element whose data-container-id names the message, such as
// "0:msg-f:123:extractedsmartmailevent" for data-message-id="#msg-f:123".
export interface EventCards {
  // The message a control on a card is about.
  message(control: Element): Element | undefined;
  // The card Gmail drew for a message, if any. Gmail draws a new card each
  // time it records an answer, so it is looked up afresh rather than kept.
  card(message: Element): Element | undefined;
}

const CARD = "[data-container-id]";
// The message id inside a container id, followed by what the card holds.
const CONTAINED = /(?:^|:)(msg-[a-z]+:\d+):/;
// A message id as data-message-id carries it.
const MESSAGE_ID = /^#?(msg-[a-z]+:\d+)$/;

export class SmartEventCards implements EventCards {
  message(control: Element): Element | undefined {
    const card = control.closest(CARD);
    const id = CONTAINED.exec(
      card?.getAttribute("data-container-id") ?? "",
    )?.[1];
    return card && id ? near(card, `[data-message-id="#${id}"]`) : undefined;
  }

  card(message: Element): Element | undefined {
    const id = MESSAGE_ID.exec(
      message.getAttribute("data-message-id") ?? "",
    )?.[1];
    return id ? near(message, `[data-container-id*="${id}:"]`) : undefined;
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
