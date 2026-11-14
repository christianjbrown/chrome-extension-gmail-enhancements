// Waits for something to show up on the page, giving up after a while.
import type { Timer } from "../answered-invites/confirmation";

export interface Waiter {
  until<T>(find: () => T | undefined): Promise<T | undefined>;
}

const INTERVAL = 250;
// Ten seconds, then it gives up and nothing happens.
const POLLS = 40;

export class Poller implements Waiter {
  constructor(private readonly timer: Timer) {}

  until<T>(find: () => T | undefined): Promise<T | undefined> {
    return this.poll(find, 0);
  }

  private async poll<T>(
    find: () => T | undefined,
    polls: number,
  ): Promise<T | undefined> {
    if (polls === POLLS) return undefined;
    await this.timer.delay(INTERVAL);
    return find() ?? this.poll(find, polls + 1);
  }
}
