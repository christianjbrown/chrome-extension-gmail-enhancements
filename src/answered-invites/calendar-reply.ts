// Reads the reply a Google Calendar invitation link sends.
import type { Unwrapper } from "../direct-links/unwrapper";
import type { UrlPolicy } from "../direct-links/url-policy";
import type { Answer } from "./answer";
import { ACTION, HOSTS, PATH, REPLIES, REPLY, RESPOND } from "./calendar-link";
import type { ReplyLinks } from "./reply-links";

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
    return REPLIES.get(url.searchParams.get(REPLY) ?? "");
  }

  private isReply(url: URL): boolean {
    return (
      HOSTS.has(url.hostname) &&
      PATH.test(url.pathname) &&
      url.searchParams.get(ACTION)?.toUpperCase() === RESPOND
    );
  }
}
