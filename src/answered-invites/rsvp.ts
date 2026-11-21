// An answer given to an invitation, and how it was given.
import type { Answer } from "./answer";

// A Calendar reply link, or a control on one of Gmail's invite cards.
export const VIA = { link: "link", button: "button" } as const;

export type Via = (typeof VIA)[keyof typeof VIA];

export interface Rsvp {
  answer: Answer;
  // The message holding the invitation.
  message: Element;
  via: Via;
}
