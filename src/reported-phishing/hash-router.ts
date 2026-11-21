// Gmail keeps its place in the part of the address after the #, so that is
// where it is and how it is sent elsewhere. main.ts hands over the window's
// location.
import type { Router } from "./router";

export class HashRouter implements Router {
  constructor(private readonly location: Pick<Location, "hash">) {}

  current(): string {
    return this.location.hash;
  }

  go(route: string): void {
    this.location.hash = route;
  }
}
