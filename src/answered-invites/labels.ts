// Which reply an RSVP control stands for, from what it says.
import type { Answer } from "./answer";

export interface Labels {
  answer(control: Element): Answer | undefined;
}
