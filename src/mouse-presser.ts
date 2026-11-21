// Presses a control by sending it the events a real mouse press makes.
import { MOUSE_EVENTS } from "./dom";
import type { EventFactory } from "./event-factory";
import type { Presser } from "./presser";

// Gmail's toolbar buttons act on mousedown and mouseup rather than on click,
// so a press is the whole sequence a real one makes.
const SEQUENCE = [
  MOUSE_EVENTS.mouseDown,
  MOUSE_EVENTS.mouseUp,
  MOUSE_EVENTS.click,
];

export class MousePresser implements Presser {
  constructor(private readonly event: EventFactory) {}

  press(control: Element): void {
    for (const type of SEQUENCE) control.dispatchEvent(this.event(type));
  }
}
