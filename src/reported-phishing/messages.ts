// Finds the message Gmail shows for a message id. Gmail keeps the views you
// are not looking at in the page, hidden, so only the one on screen counts.
import type { Visibility } from "../answered-invites/visibility";

export interface MessageLookup {
  find(id: string): Element | undefined;
}

const MESSAGES = "[data-message-id]";
export const MESSAGE_ID = "data-message-id";

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
