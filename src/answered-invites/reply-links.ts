// Reads the reply an invitation's link sends.
import type { Answer } from "./answer";

export interface ReplyLinks {
  // The reply the link sends, or undefined when it is not a reply link.
  answer(href: string): Answer | undefined;
}
