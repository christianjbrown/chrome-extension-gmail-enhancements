// Links in emails go straight where they point, instead of through Google's
// redirect page.
import type { Enhancement } from "../enhancement";
import type { Scanner } from "./link-scanner";
import type { Watcher } from "./node-watcher";

export class DirectLinks implements Enhancement {
  constructor(
    private readonly page: Node,
    private readonly scanner: Scanner,
    private readonly watcher: Watcher,
    private readonly guard: Enhancement,
  ) {}

  start(): void {
    this.guard.start();
    this.scanner.scan(this.page);
    this.watcher.watch((node) => {
      this.scanner.scan(node);
    });
  }
}
