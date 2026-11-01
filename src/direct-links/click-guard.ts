// Cleans a link again in the instant it is pressed, before any of Gmail's own
// handlers run, in case Gmail rewrote it after the watcher last saw it.
import type { Enhancement } from "../enhancement";
import type { EventSource } from "../event-source";
import type { Cleaner } from "./link-cleaner";

// A middle click and a right click (for "Copy link address") count too.
const EVENTS = ["mousedown", "click", "auxclick", "contextmenu"];

export class ClickGuard implements Enhancement {
  constructor(
    private readonly source: EventSource,
    private readonly cleaner: Cleaner,
  ) {}

  start(): void {
    for (const type of EVENTS)
      this.source.addEventListener(
        type,
        (event) => {
          this.guard(event);
        },
        { capture: true },
      );
  }

  private guard(event: Event): void {
    const target = event.target as Partial<Element> | null;
    const link = target?.closest?.("a");
    if (link) this.cleaner.clean(link);
  }
}
