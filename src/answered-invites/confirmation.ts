// Waits until a reply to an invitation has really gone through, so a reply
// that fails never costs the email.
import type { Rsvp } from "./rsvp";

export interface Confirmation {
  confirmed(rsvp: Rsvp, click: Event): Promise<boolean>;
}
