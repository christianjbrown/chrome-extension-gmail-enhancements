// Settings for the content script. Only its entry point reads them, and hands
// each one to the part that needs it.
import type { PollSchedule } from "./timer";

export interface ContentConfig {
  // How long to wait for Gmail to show an invitation's reply as recorded.
  inviteChecks: PollSchedule;
  // Looks in a row that must show the reply, so an answer Gmail shows and
  // then takes back on a failed reply does not count.
  inviteSettledChecks: number;
  // How long to wait for each step of Gmail's phishing report to show.
  phishingChecks: PollSchedule;
  // The shortest run of letters and digits taken as a conversation id.
  conversationIdMinLength: number;
}

export const CONTENT_CONFIG: ContentConfig = {
  // Fifteen seconds, then the email stays where it is.
  inviteChecks: { everyMs: 500, checks: 30 },
  inviteSettledChecks: 2,
  // Ten seconds, then nothing happens.
  phishingChecks: { everyMs: 250, checks: 40 },
  conversationIdMinLength: 16,
};
