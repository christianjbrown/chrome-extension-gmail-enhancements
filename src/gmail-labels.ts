// The words on Gmail's controls, in English Gmail. In another language nothing
// matches and nothing happens.
import { ANSWER, type Answer } from "./answered-invites/answer";

// The message menu's items.
export const REPORT = "Report phishing";
// What the same item says once Gmail has the report.
export const REPORTED = "Report as not phishing";
// The menu item and toolbar button that move a conversation to Bin.
export const DELETE = "Delete";
// What a screen reader announces for the three dots that open a message's
// menu.
export const MORE_MESSAGE_OPTIONS = "More message options";

// The word an invitation's answer starts with.
export const ANSWER_WORDS: ReadonlyMap<string, Answer> = new Map([
  ["yes", ANSWER.yes],
  ["maybe", ANSWER.maybe],
  ["no", ANSWER.no],
]);
