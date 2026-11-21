// Presses one of Gmail's buttons the way a mouse does.
export interface Presser {
  press(control: Element): void;
}
