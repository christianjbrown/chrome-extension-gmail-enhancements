// Which event card Gmail drew for a message.
export interface MessageCards {
  // The card Gmail drew for a message, if any. Gmail draws a new card each
  // time it records an answer, so it is looked up afresh rather than kept.
  card(message: Element): Element | undefined;
}
