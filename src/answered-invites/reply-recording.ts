// When a way of replying gets the reply recorded. Each way of replying is
// given its own in main.ts, so a new way brings its own and nothing else changes.
export interface ReplyRecording {
  // Whether the reply is already recorded, given the click that made it.
  recordedBy(click: Event): boolean;
}
