// Moves a message reported as phishing to Bin, once Gmail has the report.
//
// Confirming the report sends Gmail back to the list it was made from, with
// the email now in Spam (or still there, when that is where it was), and
// Spam has no Delete that goes to Bin: only "Delete forever". So this opens
// the conversation again in Spam and uses the message menu's own Delete,
// which moves it to Bin with Gmail's usual Undo. It deletes only
// once that menu says "Report as not phishing", which is Gmail showing it has
// the report.
import type { Presser } from "../presser";
import { DELETE, REPORTED } from "../gmail-labels";
import type { MenuButtons, MenuItems } from "./message-menu";
import type { MessageLookup } from "./messages";
import type { Waiter } from "./poller";
import type { Cleanup, Report } from "./reported-phishing";
import type { SpamNavigation } from "./router";

// The parts of a conversation it reads.
export interface Conversation {
  messages: MessageLookup;
  buttons: MenuButtons;
  items: MenuItems;
}

export class ReportedBinner implements Cleanup {
  constructor(
    private readonly navigation: SpamNavigation,
    private readonly waiter: Waiter,
    private readonly conversation: Conversation,
    private readonly presser: Presser,
  ) {}

  async afterReport(report: Report): Promise<void> {
    if (!(await this.reopened(report))) return;
    const message = await this.waiter.until(() =>
      this.conversation.messages.find(report.messageId),
    );
    const button = message && this.conversation.buttons.button(message);
    if (button) await this.delete(button);
  }

  // Back in the conversation, now in Spam, as long as Gmail went to the list
  // and the person has not gone anywhere else since.
  private async reopened({ route }: Report): Promise<boolean> {
    const { router, routes } = this.navigation;
    const left = await this.waiter.until(() =>
      router.current() === route ? undefined : true,
    );
    if (!left || router.current() !== routes.list(route)) return false;
    router.go(routes.inSpam(route));
    return true;
  }

  private async delete(button: Element): Promise<void> {
    this.presser.press(button);
    const reported = await this.waiter.until(() =>
      this.conversation.items.item(REPORTED),
    );
    const del = reported && this.conversation.items.sibling(reported, DELETE);
    // No sign of the report, so the email stays, with its menu left open.
    if (del) this.presser.press(del);
  }
}
