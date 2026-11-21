// Finds the message Gmail shows for a message id. Gmail keeps the views you
// are not looking at in the page, hidden, so only the one on screen counts.
import { MESSAGE_ID, WITH_MESSAGE_ID } from "../gmail-message";
import type { Visibility } from "../visibility";
import type { MessageLookup } from "./message-lookup";

export class VisibleMessages implements MessageLookup {
  constructor(
    private readonly page: ParentNode,
    private readonly visibility: Visibility,
  ) {}

  find(id: string): Element | undefined {
    return [...this.page.querySelectorAll(WITH_MESSAGE_ID)].find(
      (message) =>
        message.getAttribute(MESSAGE_ID) === id &&
        this.visibility.visible(message),
    );
  }
}
