// Accept a meeting invitation and the email goes to Bin by itself, the way
// Outlook does it. The event is in Calendar, and Bin keeps the email for 30
// days.
import type { Enhancement } from "../enhancement";
import type { EventSource } from "../event-source";
import type { Confirmation } from "./confirmation";
import type { Binner } from "./invite-binner";
import type { Rsvp, RsvpReader } from "./rsvp-reader";

export class AcceptedInvites implements Enhancement {
  // The last answer given on each invitation, so changing it to Maybe or No
  // while a Yes is still being confirmed calls the Yes off.
  private readonly latest = new WeakMap<Element, Rsvp>();

  constructor(
    private readonly source: EventSource,
    private readonly reader: RsvpReader,
    private readonly confirmation: Confirmation,
    private readonly binner: Binner,
  ) {}

  start(): void {
    this.source.addEventListener(
      "click",
      (event) => {
        this.answered(event);
      },
      { capture: true },
    );
  }

  private answered(click: Event): void {
    const rsvp = this.reader.read(click.target);
    if (rsvp === undefined) return;
    this.latest.set(rsvp.message, rsvp);
    if (rsvp.answer !== "yes") return;
    void this.confirmation.confirmed(rsvp, click).then((confirmed) => {
      if (confirmed && this.latest.get(rsvp.message) === rsvp)
        this.binner.bin(rsvp.message);
    });
  }
}
