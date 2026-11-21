// The menu behind the three dots on a message: Reply, Delete, Report phishing
// and the rest. The button that opens it sits in the message, but Gmail draws
// the menu itself elsewhere on the page, so the open one is the one on screen.
// Its items carry no labels of their own beyond their words, which are
// English Gmail's.
import { MESSAGE } from "../answered-invites/gmail-message";
import type { Visibility } from "../answered-invites/visibility";
import { ARIA_LABEL, ROLE_MENU_ITEM } from "../dom";
import { MORE_MESSAGE_OPTIONS } from "../gmail-labels";

export interface MessageMenu {
  // The message whose menu a control opens, when it is that button.
  owner(control: Element): Element | undefined;
  // The button that opens a message's menu.
  button(message: Element): Element | undefined;
  // Whether a control is the menu item saying exactly this.
  is(control: Element, label: string): boolean;
  // The menu item on screen saying exactly this.
  item(label: string): Element | undefined;
  // The item saying this in the same menu as another item.
  sibling(item: Element, label: string): Element | undefined;
}

const BUTTON = `[${ARIA_LABEL}='${MORE_MESSAGE_OPTIONS}']`;
const MENU = "[role='menu']";

export class GmailMessageMenu implements MessageMenu {
  constructor(
    private readonly page: ParentNode,
    private readonly visibility: Visibility,
  ) {}

  owner(control: Element): Element | undefined {
    return control.matches(BUTTON)
      ? (control.closest(MESSAGE) ?? undefined)
      : undefined;
  }

  button(message: Element): Element | undefined {
    return message.querySelector(BUTTON) ?? undefined;
  }

  is(control: Element, label: string): boolean {
    return (
      control.matches(ROLE_MENU_ITEM) && control.textContent.trim() === label
    );
  }

  item(label: string): Element | undefined {
    return this.labelled(this.page, label);
  }

  sibling(item: Element, label: string): Element | undefined {
    const menu = item.closest(MENU);
    return menu ? this.labelled(menu, label) : undefined;
  }

  private labelled(within: ParentNode, label: string): Element | undefined {
    return [...within.querySelectorAll(ROLE_MENU_ITEM)].find(
      (item) => this.is(item, label) && this.visibility.visible(item),
    );
  }
}
