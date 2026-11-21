// Works out whether a click answered an invitation, and how.
import type { Rsvp } from "./rsvp";

export interface RsvpReader {
  read(target: EventTarget | null): Rsvp | undefined;
}
