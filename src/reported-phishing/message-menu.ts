// The menu behind the three dots on a message: Reply, Delete, Report phishing
// and the rest. The button that opens it sits in the message, but Gmail draws
// the menu itself elsewhere on the page, so the open one is the one on screen.
// Its items carry no labels of their own beyond their words, which are
// English Gmail's.
import { messageOf } from "../gmail-message";
import type { Visibility } from "../visibility";
import { ARIA_LABEL, ROLE_MENU_ITEM } from "../dom";
import type {
  MenuButtons,
  MenuItems,
  MenuLabels,
  MenuOwners,
} from "./menu-parts";

const MENU = "[role='menu']";

export class GmailMessageMenu
  implements MenuOwners, MenuButtons, MenuLabels, MenuItems
{
  // The three dots, found by what a screen reader announces for them.
  private readonly opener: string;

  constructor(
    private readonly page: ParentNode,
    private readonly visibility: Visibility,
    moreOptions: string,
  ) {
    this.opener = `[${ARIA_LABEL}='${moreOptions}']`;
  }

  owner(control: Element): Element | undefined {
    return control.matches(this.opener) ? messageOf(control) : undefined;
  }

  button(message: Element): Element | undefined {
    return message.querySelector(this.opener) ?? undefined;
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
