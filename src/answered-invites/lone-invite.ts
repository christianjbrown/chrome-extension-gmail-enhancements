// Says whether binning the conversation would take only the invitation.
// Gmail's Delete bins the whole conversation, and acts on any rows checked in
// the list instead, so anything else in reach means the email stays put.
import { MESSAGE } from "./gmail-message";
import type { Visibility } from "./visibility";

export interface SafetyCheck {
  onlyInvite(message: Element, view: Element): boolean;
}

// Gmail lays a conversation out as a list with one item per message,
// collapsed ones included, for screen readers.
const LIST = "[role='list']";
const ITEM = "[role='listitem']";
// A checked row in the conversation list.
const CHECKED = "[role='checkbox'][aria-checked='true']";

export class LoneInvite implements SafetyCheck {
  constructor(private readonly visibility: Visibility) {}

  // Messages are counted two ways, and either finding more than one is
  // enough to stop: counting too many only means an email stays put.
  onlyInvite(message: Element, view: Element): boolean {
    return (
      this.messages(view) === 1 &&
      this.items(message) <= 1 &&
      !this.visibleIn(view, CHECKED).length
    );
  }

  // Messages inside messages are quoted or forwarded mail, not their own.
  private messages(view: Element): number {
    return this.visibleIn(view, MESSAGE).filter(
      (element) => !element.parentElement?.closest(MESSAGE),
    ).length;
  }

  private items(message: Element): number {
    const list = message.closest(LIST);
    if (list === null) return 0;
    return [...list.querySelectorAll(ITEM)].filter(
      (item) => item.parentElement?.closest(LIST) === list,
    ).length;
  }

  private visibleIn(view: Element, selector: string): Element[] {
    return [...view.querySelectorAll(selector)].filter((element) =>
      this.visibility.visible(element),
    );
  }
}
