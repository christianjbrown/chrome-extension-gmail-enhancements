// A reply that is only in once Gmail shows it, whatever happened to the click.
import type { ReplyRecording } from "./reply-recording";

export class RecordedLater implements ReplyRecording {
  recordedBy(): boolean {
    return false;
  }
}
