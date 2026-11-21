// Watches Gmail until it shows the reply recorded, and keeps showing it.
import type { Waiter } from "../waiter";
import type { AnswerState } from "./answer-state";
import type { Confirmation } from "./confirmation";
import type { Rsvp } from "./rsvp";

// How many looks in a row have shown the answer.
interface Looks {
  streak: number;
}

export class GmailConfirmation implements Confirmation {
  constructor(
    private readonly waiter: Waiter,
    private readonly state: AnswerState,
    // Looks in a row that must show the answer, so one Gmail shows and then
    // takes back on a failed reply does not count.
    private readonly settled: number,
  ) {}

  async confirmed(rsvp: Rsvp, click: Event): Promise<boolean> {
    const looks: Looks = { streak: 0 };
    const outcome = await this.waiter.until(() =>
      this.look(rsvp, click, looks),
    );
    // Out of looks: the reply never showed, so the email stays.
    return outcome ?? false;
  }

  // Gone from the page: the person moved on, so leave it be.
  private look(rsvp: Rsvp, click: Event, looks: Looks): boolean | undefined {
    return rsvp.message.isConnected ? this.lookAt(rsvp, click, looks) : false;
  }

  // True once it is recorded, and undefined to look again.
  private lookAt(rsvp: Rsvp, click: Event, looks: Looks): true | undefined {
    return rsvp.recording.recordedBy(click)
      ? true
      : this.settledOn(rsvp, looks);
  }

  private settledOn(rsvp: Rsvp, looks: Looks): true | undefined {
    looks.streak = this.nextStreak(rsvp, looks.streak);
    return looks.streak === this.settled ? true : undefined;
  }

  // A look that does not show the answer starts the count again.
  private nextStreak(rsvp: Rsvp, streak: number): number {
    return this.state.answered(rsvp.message, rsvp.answer) ? streak + 1 : 0;
  }
}
