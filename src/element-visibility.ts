// Whether the browser lays an element out on screen.
import type { Visibility } from "./visibility";

export class ElementVisibility implements Visibility {
  visible(element: Element): boolean {
    return element.checkVisibility();
  }
}
