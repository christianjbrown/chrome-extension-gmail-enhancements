// The words on Gmail's controls, in English Gmail. In another language nothing
// matches and nothing happens.
import { ANSWER, type Answer } from "./answered-invites/answer";
import type { ControlWords } from "./control-words";

export const CONTROL_WORDS: ControlWords = {
  report: "Report phishing",
  reported: "Report as not phishing",
  delete: "Delete",
  moreMessageOptions: "More message options",
};

// The word an invitation's answer starts with.
export const ANSWER_WORDS: ReadonlyMap<string, Answer> = new Map([
  ["yes", ANSWER.yes],
  ["maybe", ANSWER.maybe],
  ["no", ANSWER.no],
]);
