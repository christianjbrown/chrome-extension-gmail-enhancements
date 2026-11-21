// Waits for something to show up on the page, giving up after a while.
export interface Waiter {
  until<T>(find: () => T | undefined): Promise<T | undefined>;
}
