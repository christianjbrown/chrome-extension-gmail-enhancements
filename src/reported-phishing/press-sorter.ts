// Sorts a press into an answer to the report dialog or a press that reports
// a message, and says which to whoever is listening.
import type { DialogChoice } from "./report-dialog";

export interface PressHandler {
  // A button in the dialog that asks before sending a report was pressed.
  answered(choice: DialogChoice): void;
  // A control that reports this message was pressed.
  reported(message: Element): void;
}

export interface PressSorter {
  sort(target: EventTarget | null, handler: PressHandler): void;
}
