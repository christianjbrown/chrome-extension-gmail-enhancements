// Moves a message reported as phishing to Bin, once Gmail has the report.
//
// Confirming the report sends Gmail back to the Spam list, with the email
// still in it, and the list has no Delete that goes to Bin: only "Delete
// forever". So this opens the conversation again and uses the message menu's
// own Delete, which moves it to Bin with Gmail's usual Undo. It deletes only
// once that menu says "Report as not phishing", which is Gmail showing it has
// the report.
import type { Presser } from "../answered-invites/presser";
import { DELETE, REPORTED } from "./labels";
import type { MessageMenu } from "./message-menu";
import type { MessageLookup } from "./messages";
import type { Waiter } from "./poller";
import type { Cleanup, Report } from "./reported-phishing";
import type { Navigation } from "./router";

// The parts of a conversation it reads.
export interface Conversation {
  messages: MessageLookup;
  menu: MessageMenu;
}

export class ReportedBinner implements Cleanup {
  constructor(
    private readonly navigation: Navigation,
    private readonly waiter: Waiter,
    private readonly conversation: Conversation,
    private readonly presser: Presser,
  ) {}

  async afterReport(report: Report): Promise<void> {
    if (!(await this.reopened(report))) return;
    const message = await this.waiter.until(() =>
      this.conversation.messages.find(report.messageId),
    );
    const button = message && this.conversation.menu.button(message);
    if (button) await this.delete(button);
  }

  // Back in the conversation, as long as Gmail went to the list and the
  // person has not gone anywhere else since.
  private async reopened({ route }: Report): Promise<boolean> {
    const { router, routes } = this.navigation;
    const left = await this.waiter.until(() =>
      router.current() === route ? undefined : true,
    );
    if (!left || router.current() !== routes.list(route)) return false;
    router.go(route);
    return true;
  }

  private async delete(button: Element): Promise<void> {
    this.presser.press(button);
    const reported = await this.waiter.until(() =>
      this.conversation.menu.item(REPORTED),
    );
    const del = reported && this.conversation.menu.sibling(reported, DELETE);
    // No sign of the report, so the email stays, with its menu left open.
    if (del) this.presser.press(del);
  }
}
