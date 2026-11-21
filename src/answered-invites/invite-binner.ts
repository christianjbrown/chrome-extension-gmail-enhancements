// Moves an answered invitation's conversation to Bin with Gmail's own Delete,
// so nothing is ever deleted for good and Undo works as usual.
import type { Presser } from "../presser";
import type { Binner } from "./binner";
import type { DeleteButton, DeleteFinder } from "./delete-finder";
import type { SafetyCheck } from "./safety-check";

export class ConversationBinner implements Binner {
  constructor(
    private readonly finder: DeleteFinder,
    private readonly check: SafetyCheck,
    private readonly presser: Presser,
  ) {}

  bin(message: Element): void {
    if (message.isConnected) this.binShown(message);
  }

  private binShown(message: Element): void {
    const button = this.finder.find(message);
    if (button) this.pressIfSafe(message, button);
  }

  private pressIfSafe(message: Element, button: DeleteButton): void {
    if (this.check.onlyInvite(message, button.view))
      this.presser.press(button.control);
  }
}
