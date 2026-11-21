// Waits until a reply to an invitation has really gone through, so a reply
// that fails never costs the email.
import type { PollSchedule, Timer } from "../timer";
import type { AnswerState } from "./answer-state";
import { VIA, type Rsvp, type Via } from "./rsvp-reader";

export interface Confirmation {
  confirmed(rsvp: Rsvp, click: Event): Promise<boolean>;
}

// Whether a reply made this way is recorded as soon as Gmail lets the click
// through. A reply link opens Calendar, which records the reply as it loads.
const RECORDED_ON_CLICK: Readonly<Record<Via, boolean>> = {
  [VIA.link]: true,
  [VIA.button]: false,
};

export class GmailConfirmation implements Confirmation {
  constructor(
    private readonly timer: Timer,
    private readonly state: AnswerState,
    private readonly schedule: PollSchedule,
    // Looks in a row that must show the answer, so one Gmail shows and then
    // takes back on a failed reply does not count.
    private readonly settled: number,
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
    if (polls === this.schedule.checks) return false;
    await this.timer.delay(this.schedule.everyMs);
    // Gone from the page: the person moved on, so leave it be.
    if (!rsvp.message.isConnected) return false;
    if (RECORDED_ON_CLICK[rsvp.via] && !click.defaultPrevented) return true;
    const next = this.state.answered(rsvp.message, rsvp.answer)
      ? streak + 1
      : 0;
    return next === this.settled || this.poll(rsvp, click, polls + 1, next);
  }
}
