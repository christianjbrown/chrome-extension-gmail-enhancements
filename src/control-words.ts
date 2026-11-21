// The words on Gmail's controls that the enhancements look for. The entry
// point hands each part only the words it needs.
export interface ControlWords {
  // The message menu's item that reports phishing.
  report: string;
  // What the same item says once Gmail has the report.
  reported: string;
  // The menu item and toolbar button that move a conversation to Bin.
  delete: string;
  // What a screen reader announces for the three dots that open a message's
  // menu.
  moreMessageOptions: string;
}
