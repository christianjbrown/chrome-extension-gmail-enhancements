// Reads the reply a Google Calendar invitation link sends.
import type { Unwrapper } from "../direct-links/unwrapper";
import type { UrlPolicy } from "../direct-links/url-policy";
import type { Answer } from "./answer";
import { ACTION, HOSTS, PATH, REPLIES, REPLY, RESPOND } from "./calendar-link";
import type { ReplyLinks } from "./reply-links";

// A link with no answer code reads as an empty one, which is no answer.
const NO_REPLY = "";

const isRespond = (action: string | null): boolean =>
  action?.toUpperCase() === RESPOND;

const answerOf = (url: URL): Answer | undefined =>
  REPLIES.get(url.searchParams.get(REPLY) ?? NO_REPLY);

const atCalendar = (url: URL): boolean =>
  HOSTS.has(url.hostname) && PATH.test(url.pathname);

export class CalendarReplyLink implements ReplyLinks {
  constructor(
    private readonly unwrapper: Unwrapper,
    private readonly policy: UrlPolicy,
  ) {}

  // The link may still be wrapped in Google's redirect if Gmail rewrote it
  // after direct links last saw it.
  answer(href: string): Answer | undefined {
    const url = this.policy.accept(this.unwrapped(href));
    return url === undefined ? undefined : this.replyOf(url);
  }

  private unwrapped(href: string): string {
    return this.unwrapper.unwrap(href) ?? href;
  }

  private replyOf(url: URL): Answer | undefined {
    return this.isReply(url) ? answerOf(url) : undefined;
  }

  private isReply(url: URL): boolean {
    return atCalendar(url) && isRespond(url.searchParams.get(ACTION));
  }
}
