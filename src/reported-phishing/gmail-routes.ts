// Which of Gmail's addresses are an open conversation, the list Gmail goes
// back to from one, and where the same conversation lives in Spam. Gmail keeps
// its place in the part of the address after the #: "#inbox" is a list and
// "#inbox/<id>" a conversation in it, with a page in between
// ("#spam/p2/<id>") further down a list. A conversation keeps its id wherever
// it is, so "#spam/<id>" opens it once Gmail has moved it to Spam.
export interface RoutePolicy {
  conversation(route: string): boolean;
  list(route: string): string;
  inSpam(route: string): string;
}

const SEPARATOR = "/";
const SPAM = `#spam${SEPARATOR}`;
// Gmail's conversation ids are long runs of letters and digits, which no
// list, page or label short enough to type looks like.
const MIN_ID_LENGTH = 16;
const CONVERSATION_ID = new RegExp(`^[A-Za-z0-9]{${String(MIN_ID_LENGTH)},}$`);

export class GmailRoutes implements RoutePolicy {
  conversation(route: string): boolean {
    return route.includes(SEPARATOR) && CONVERSATION_ID.test(this.id(route));
  }

  list(route: string): string {
    return route.slice(0, route.lastIndexOf(SEPARATOR));
  }

  inSpam(route: string): string {
    return SPAM + this.id(route);
  }

  private id(route: string): string {
    return route.slice(route.lastIndexOf(SEPARATOR) + 1);
  }
}
