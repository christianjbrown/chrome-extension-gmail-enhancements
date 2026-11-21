// What counts as a phishing report worth cleaning up after.
import type { Report } from "./report";

export interface ReportRule {
  // The report a press on this message makes, or undefined when it makes
  // none that counts.
  report(message: Element): Report | undefined;
}
