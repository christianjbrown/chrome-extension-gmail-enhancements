// Finds the Delete button that acts on the conversation a message is in.
export interface DeleteButton {
  control: Element;
  // The part of the page the button belongs to.
  view: Element;
}

export interface DeleteFinder {
  find(message: Element): DeleteButton | undefined;
}
