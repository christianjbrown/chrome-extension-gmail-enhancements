// Answer a meeting invitation, Yes, Maybe or No, and the email goes to Bin by
// itself, the way Outlook does it. The event is in Calendar, and Bin keeps
// the email for 30 days.
import { MOUSE_EVENTS } from "../dom";
import type { Enhancement } from "../enhancement";
import { BEFORE_GMAIL, type EventSource } from "../event-source";
import type { Confirmation } from "./confirmation";
import type { Binner } from "./binner";
import type { Rsvp } from "./rsvp";
import type { RsvpReader } from "./rsvp-reader";

export class AnsweredInvites implements Enhancement {
  // The last answer given on each invitation. Only the latest one's
  // confirmation counts, so changing your mind while a reply is still going
  // through waits for the new reply instead.
  private readonly latest = new WeakMap<Element, Rsvp>();

  constructor(
    private readonly source: EventSource,
    private readonly reader: RsvpReader,
    private readonly confirmation: Confirmation,
    private readonly binner: Binner,
  ) {}

  start(): void {
    this.source.addEventListener(
      MOUSE_EVENTS.click,
      (event) => {
        this.answered(event);
      },
      BEFORE_GMAIL,
    );
  }

  private answered(click: Event): void {
    const rsvp = this.reader.read(click.target);
    if (rsvp === undefined) return;
    this.latest.set(rsvp.message, rsvp);
    void this.confirmation.confirmed(rsvp, click).then((confirmed) => {
      if (confirmed && this.latest.get(rsvp.message) === rsvp)
        this.binner.bin(rsvp.message);
    });
  }
}
