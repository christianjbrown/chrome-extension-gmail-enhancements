// Moves a message reported as phishing to Bin, once Gmail has the report:
// back to the conversation where Gmail moved it, then the message's own Delete.
import type { MessageLookup } from "./message-lookup";
import type { Cleanup, Report } from "./report";
import type { ReportedDelete } from "./reported-delete";
import type { SpamReturn } from "./spam-return";
import type { Waiter } from "../waiter";

export class ReportedBinner implements Cleanup {
  constructor(
    private readonly spam: SpamReturn,
    private readonly waiter: Waiter,
    private readonly messages: MessageLookup,
    private readonly deleter: ReportedDelete,
  ) {}

  async afterReport(report: Report): Promise<void> {
    if (!(await this.spam.reopen(report))) return;
    const message = await this.waiter.until(() =>
      this.messages.find(report.messageId),
    );
    if (message) await this.deleter.delete(message);
  }
}
