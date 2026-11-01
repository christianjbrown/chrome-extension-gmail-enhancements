// Reads the reply a Google Calendar invitation link sends. Every invitation
// Calendar emails carries Yes, Maybe and No links of the form
// .../calendar/event?action=RESPOND&rst=<n>, a format that has outlived every
// Gmail redesign, so it is the most stable sign of an invite there is.
import type { Unwrapper } from "../direct-links/google-redirect";
import type { UrlPolicy } from "../direct-links/url-policy";
import type { Answer } from "./answer";

export interface ReplyLinks {
  // The reply the link sends, or undefined when it is not a reply link.
  answer(href: string): Answer | undefined;
}

const HOSTS = new Set(["calendar.google.com", "www.google.com", "google.com"]);
// /calendar/event, or /calendar/u/1/event from a second signed-in account.
const PATH = /^\/calendar\/(?:u\/\d+\/)?event$/;
const REPLIES = new Map<string, Answer>([
  ["1", "yes"],
  ["2", "no"],
  ["3", "maybe"],
]);

export class CalendarReplyLink implements ReplyLinks {
  constructor(
    private readonly unwrapper: Unwrapper,
    private readonly policy: UrlPolicy,
  ) {}

  // The link may still be wrapped in Google's redirect if Gmail rewrote it
  // after direct links last saw it.
  answer(href: string): Answer | undefined {
    const url = this.policy.accept(this.unwrapper.unwrap(href) ?? href);
    if (url === undefined || !this.isReply(url)) return undefined;
    return REPLIES.get(url.searchParams.get("rst") ?? "");
  }

  private isReply(url: URL): boolean {
    return (
      HOSTS.has(url.hostname) &&
      PATH.test(url.pathname) &&
      url.searchParams.get("action")?.toUpperCase() === "RESPOND"
    );
  }
}
