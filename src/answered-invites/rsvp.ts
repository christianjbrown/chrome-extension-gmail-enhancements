// An answer given to an invitation, and how it was given.
import type { Answer } from "./answer";
import type { ReplyRecording } from "./reply-recording";

export interface Rsvp {
  answer: Answer;
  // The message holding the invitation.
  message: Element;
  // When the way it was given gets the reply recorded.
  recording: ReplyRecording;
}
