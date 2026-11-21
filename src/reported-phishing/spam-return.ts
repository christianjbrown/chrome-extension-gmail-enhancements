import type { Report } from "./report";

// Where Gmail goes once it has a report, and the way back to the reported
// conversation from there.
export interface SpamReturn {
  // Opens the conversation again where Gmail moved it. False when Gmail went
  // somewhere a report does not send it, or the person has moved on.
  reopen(report: Report): Promise<boolean>;
}
