// What each part of the code reads from the menu behind the three dots on a
// message, one interface per reader.
export interface MenuOwners {
  // The message whose menu a control opens, when it is that button.
  owner(control: Element): Element | undefined;
}

export interface MenuButtons {
  // The button that opens a message's menu.
  button(message: Element): Element | undefined;
}

export interface MenuLabels {
  // Whether a control is the menu item saying exactly this.
  is(control: Element, label: string): boolean;
}

export interface MenuItems {
  // The menu item on screen saying exactly this.
  item(label: string): Element | undefined;
  // The item saying this in the same menu as another item.
  sibling(item: Element, label: string): Element | undefined;
}
