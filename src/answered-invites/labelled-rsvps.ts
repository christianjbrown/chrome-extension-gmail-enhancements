// An answer given with a button whose words say Yes, Maybe or No. A word on a
// button means nothing outside an invitation, so the message must be one.
import type { Answer } from "./answer";
import type { InviteCheck } from "./invite-check";
import type { Labels } from "./labels";
import type { ReplyRecording } from "./reply-recording";
import type { Rsvp } from "./rsvp";
import type { RsvpWay } from "./rsvp-way";

export class LabelledRsvps implements RsvpWay {
  constructor(
    private readonly labels: Labels,
    private readonly invites: InviteCheck,
    private readonly recording: ReplyRecording,
  ) {}

  rsvp(control: Element, message: Element): Rsvp | undefined {
    const answer = this.labels.answer(control);
    return answer === undefined ? undefined : this.inInvite(answer, message);
  }

  private inInvite(answer: Answer, message: Element): Rsvp | undefined {
    return this.invites.invitation(message)
      ? { answer, message, recording: this.recording }
      : undefined;
  }
}
