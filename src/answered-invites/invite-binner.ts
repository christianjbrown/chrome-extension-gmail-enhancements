// Moves an answered invitation's conversation to Bin with Gmail's own Delete,
// so nothing is ever deleted for good and Undo works as usual.
import type { DeleteFinder } from "./delete-finder";
import type { SafetyCheck } from "./lone-invite";
import type { Presser } from "./presser";

export interface Binner {
  bin(message: Element): void;
}

export class ConversationBinner implements Binner {
  constructor(
    private readonly finder: DeleteFinder,
    private readonly check: SafetyCheck,
    private readonly presser: Presser,
  ) {}

  bin(message: Element): void {
    if (!message.isConnected) return;
    const button = this.finder.find(message);
    if (button && this.check.onlyInvite(message, button.view))
      this.presser.press(button.control);
  }
}
