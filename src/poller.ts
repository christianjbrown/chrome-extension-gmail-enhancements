// Looks for something on a schedule, giving up after the last look.
import type { PollSchedule, Timer } from "./timer";
import type { Waiter } from "./waiter";

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
