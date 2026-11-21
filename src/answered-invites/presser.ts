// Presses one of Gmail's buttons the way a mouse does.
import { MOUSE_EVENTS } from "../dom";

export interface Presser {
  press(control: Element): void;
}

export type EventFactory = (type: string) => Event;

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
