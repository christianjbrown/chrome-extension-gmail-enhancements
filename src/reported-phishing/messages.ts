// Finds the message Gmail shows for a message id. Gmail keeps the views you
// are not looking at in the page, hidden, so only the one on screen counts.
import { MESSAGE_ID } from "../gmail-message";
import type { Visibility } from "../visibility";

export interface MessageLookup {
  find(id: string): Element | undefined;
}

const MESSAGES = `[${MESSAGE_ID}]`;

export class VisibleMessages implements MessageLookup {
  constructor(
    private readonly page: ParentNode,
    private readonly visibility: Visibility,
  ) {}

  find(id: string): Element | undefined {
    return [...this.page.querySelectorAll(MESSAGES)].find(
      (message) =>
        message.getAttribute(MESSAGE_ID) === id &&
        this.visibility.visible(message),
    );
  }
}
