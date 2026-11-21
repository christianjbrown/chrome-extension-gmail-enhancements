// What Gmail's addresses mean: which are an open conversation, the list Gmail
// goes back to from one, and where the same conversation lives in Spam.
export interface ConversationRoutes {
  conversation(route: string): boolean;
}

export interface SpamRoutes {
  list(route: string): string;
  inSpam(route: string): string;
}
