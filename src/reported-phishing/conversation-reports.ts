// Only a report made from an open conversation counts, and only for a message
// that says which it is.
import { MESSAGE_ID } from "../gmail-message";
import type { Report } from "./report";
import type { ReportRule } from "./report-rule";
import type { ConversationNavigation } from "./router";

export class ConversationReports implements ReportRule {
  constructor(private readonly navigation: ConversationNavigation) {}

  report(message: Element): Report | undefined {
    const route = this.navigation.router.current();
    const messageId = message.getAttribute(MESSAGE_ID);
    if (!messageId || !this.navigation.routes.conversation(route))
      return undefined;
    return { route, messageId };
  }
}
