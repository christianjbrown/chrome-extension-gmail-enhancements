// Which message a control on one of Gmail's event cards is about.
export interface CardMessages {
  // The message a control on a card is about.
  message(control: Element): Element | undefined;
}
