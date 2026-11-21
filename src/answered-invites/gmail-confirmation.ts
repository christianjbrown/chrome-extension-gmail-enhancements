// Watches Gmail until it shows the reply recorded, and keeps showing it.
import type { Waiter } from "../waiter";
import type { AnswerState } from "./answer-state";
import type { Confirmation } from "./confirmation";
import type { Rsvp } from "./rsvp";

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
      if (rsvp.recording.recordedBy(click)) return true;
      streak = this.state.answered(rsvp.message, rsvp.answer) ? streak + 1 : 0;
      return streak === this.settled ? true : undefined;
    });
    // Out of looks: the reply never showed, so the email stays.
    return outcome ?? false;
  }
}
