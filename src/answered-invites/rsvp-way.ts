// One way a control can answer the invitation in a message.
import type { Rsvp } from "./rsvp";

export interface RsvpWay {
  rsvp(control: Element, message: Element): Rsvp | undefined;
}
