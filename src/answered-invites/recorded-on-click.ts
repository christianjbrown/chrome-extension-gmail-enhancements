// A reply link opens Calendar, which records the reply as it loads, so the
// reply is in as soon as Gmail lets the click through.
import type { ReplyRecording } from "./reply-recording";

export class RecordedOnClick implements ReplyRecording {
  recordedBy(click: Event): boolean {
    return !click.defaultPrevented;
  }
}
