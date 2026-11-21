// Waits for something to show up on the page, giving up after a while.
import type { PollSchedule, Timer } from "../timer";

export interface Waiter {
  until<T>(find: () => T | undefined): Promise<T | undefined>;
}

export class Poller implements Waiter {
  constructor(
    private readonly timer: Timer,
    private readonly schedule: PollSchedule,
  ) {}

  until<T>(find: () => T | undefined): Promise<T | undefined> {
    return this.poll(find, 0);
  }

  private async poll<T>(
    find: () => T | undefined,
    polls: number,
  ): Promise<T | undefined> {
    if (polls === this.schedule.checks) return undefined;
    await this.timer.delay(this.schedule.everyMs);
    return find() ?? this.poll(find, polls + 1);
  }
}
