// Finds the message Gmail shows for a message id.
export interface MessageLookup {
  find(id: string): Element | undefined;
}
