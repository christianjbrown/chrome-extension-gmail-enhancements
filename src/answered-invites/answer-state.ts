// Whether Gmail shows a message's invitation as answered a given way.
import type { Answer } from "./answer";

export interface AnswerState {
  answered(message: Element, answer: Answer): boolean;
}
