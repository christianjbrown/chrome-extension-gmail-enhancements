// Watches Gmail until it shows the reply recorded, and keeps showing it.
import type { Waiter } from "../waiter";
import type { AnswerState } from "./answer-state";
import type { Confirmation } from "./confirmation";
import { VIA, type Rsvp, type Via } from "./rsvp";

// Whether a reply made this way is recorded as soon as Gmail lets the click
// through. A reply link opens Calendar, which records the reply as it loads.
const RECORDED_ON_CLICK: Readonly<Record<Via, boolean>> = {
  [VIA.link]: true,
  [VIA.button]: false,
};

export class GmailConfirmation implements Confirmation {
  constructor(
    private readonly waiter: Waiter,
    private readonly state: AnswerState,
    // Looks in a row that must show the answer, so one Gmail shows and then
    // takes back on a failed reply does not count.
    private readonly settled: number,
  ) {}

  async confirmed(rsvp: Rsvp, click: Event): Promise<boolean> {
    let streak = 0;
    const outcome = await this.waiter.until(() => {
      // Gone from the page: the person moved on, so leave it be.
      if (!rsvp.message.isConnected) return false;
      if (RECORDED_ON_CLICK[rsvp.via] && !click.defaultPrevented) return true;
      streak = this.state.answered(rsvp.message, rsvp.answer) ? streak + 1 : 0;
      return streak === this.settled ? true : undefined;
    });
    // Out of looks: the reply never showed, so the email stays.
    return outcome ?? false;
  }
}
