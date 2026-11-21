// An answer given with one of Calendar's reply links.
import { HREF } from "../dom";
import type { ReplyLinks } from "./calendar-reply";
import { VIA, type Rsvp, type RsvpWay } from "./rsvp-reader";

export class ReplyLinkRsvps implements RsvpWay {
  constructor(private readonly links: ReplyLinks) {}

  rsvp(control: Element, message: Element): Rsvp | undefined {
    const href = control.getAttribute(HREF);
    const answer = href === null ? undefined : this.links.answer(href);
    return answer === undefined
      ? undefined
      : { answer, message, via: VIA.link };
  }
}
