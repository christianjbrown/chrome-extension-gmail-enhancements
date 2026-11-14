// Which of Gmail's addresses are a conversation open in Spam, and the list
// Gmail goes back to from one. Gmail keeps its place in the part of the
// address after the #: "#spam" is the list and "#spam/<id>" a conversation in
// it, with a page in between ("#spam/p2/<id>") further down the list.
export interface RoutePolicy {
  conversation(route: string): boolean;
  list(route: string): string;
}

const SPAM = "#spam/";
const SEPARATOR = "/";

export class SpamRoutes implements RoutePolicy {
  conversation(route: string): boolean {
    return route.startsWith(SPAM) && route.length > SPAM.length;
  }

  list(route: string): string {
    return route.slice(0, route.lastIndexOf(SEPARATOR));
  }
}
