// An answer given with one of Calendar's reply links.
import { HREF } from "../dom";
import type { ReplyLinks } from "./reply-links";
import type { ReplyRecording } from "./reply-recording";
import type { Rsvp } from "./rsvp";
import type { RsvpWay } from "./rsvp-way";

export class ReplyLinkRsvps implements RsvpWay {
  constructor(
    private readonly links: ReplyLinks,
    private readonly recording: ReplyRecording,
  ) {}

  rsvp(control: Element, message: Element): Rsvp | undefined {
    const href = control.getAttribute(HREF);
    return href === null ? undefined : this.fromLink(href, message);
  }

  private fromLink(href: string, message: Element): Rsvp | undefined {
    const answer = this.links.answer(href);
    return answer === undefined
      ? undefined
      : { answer, message, recording: this.recording };
  }
}
