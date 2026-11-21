// Waits on the page's own clock. main.ts hands over the window.
import type { Timer } from "./timer";

export class WindowTimer implements Timer {
  constructor(private readonly clock: Pick<Window, "setTimeout">) {}

  delay(milliseconds: number): Promise<void> {
    return new Promise<void>((resolve) =>
      this.clock.setTimeout(resolve, milliseconds),
    );
  }
}
