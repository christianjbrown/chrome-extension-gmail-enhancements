// Waits until a reply to an invitation has really gone through, so a reply
// that fails never costs the email.
import type { AnswerState } from "./answer-state";
import type { Rsvp } from "./rsvp-reader";

export interface Timer {
  delay(milliseconds: number): Promise<void>;
}

export interface Confirmation {
  confirmed(rsvp: Rsvp, click: Event): Promise<boolean>;
}

const INTERVAL = 500;
// Fifteen seconds, then it gives up and the email stays where it is.
const POLLS = 30;
// Two looks in a row, so an answer Gmail shows and then takes back on a
// failed reply does not count.
const SETTLED = 2;

export class GmailConfirmation implements Confirmation {
  constructor(
    private readonly timer: Timer,
    private readonly state: AnswerState,
  ) {}

  confirmed(rsvp: Rsvp, click: Event): Promise<boolean> {
    return this.poll(rsvp, click, 0, 0);
  }

  private async poll(
    rsvp: Rsvp,
    click: Event,
    polls: number,
    streak: number,
  ): Promise<boolean> {
    if (polls === POLLS) return false;
    await this.timer.delay(INTERVAL);
    // Gone from the page: the person moved on, so leave it be.
    if (!rsvp.message.isConnected) return false;
    // A reply link Gmail let through opened Calendar, which records the
    // reply as it loads.
    if (rsvp.via === "link" && !click.defaultPrevented) return true;
    const next = this.state.answered(rsvp.message, rsvp.answer)
      ? streak + 1
      : 0;
    return next === SETTLED || this.poll(rsvp, click, polls + 1, next);
  }
}
