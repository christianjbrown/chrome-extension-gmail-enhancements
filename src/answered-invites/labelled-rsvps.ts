// An answer given with a button whose words say Yes, Maybe or No. A word on a
// button means nothing outside an invitation, so the message must be one.
import type { InviteCheck } from "./invite-check";
import type { Labels } from "./labels";
import { VIA, type Rsvp } from "./rsvp";
import type { RsvpWay } from "./rsvp-way";

export class LabelledRsvps implements RsvpWay {
  constructor(
    private readonly labels: Labels,
    private readonly invites: InviteCheck,
  ) {}

  rsvp(control: Element, message: Element): Rsvp | undefined {
    const answer = this.labels.answer(control);
    if (answer === undefined || !this.invites.invitation(message))
      return undefined;
    return { answer, message, via: VIA.button };
  }
}
