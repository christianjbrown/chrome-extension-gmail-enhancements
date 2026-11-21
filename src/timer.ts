// Waiting, and how long to keep looking for something before giving up.
export interface Timer {
  delay(milliseconds: number): Promise<void>;
}

export interface PollSchedule {
  // The wait before each look.
  everyMs: number;
  // How many looks before giving up.
  checks: number;
}
