// The page's own words that several parts share: attribute names, roles, tags
// and the mouse events a press is made of.
import { isElement } from "./node-guards";

export const HREF = "href";
export const ARIA_LABEL = "aria-label";
export const LINK = "a";
export const BUTTON = "button";
export const ROLE_BUTTON = "[role='button']";
export const ROLE_MENU_ITEM = "[role='menuitem']";

// The element matching the selector that an event's target is, or sits in.
export const closestTo = (
  target: EventTarget | null,
  selector: string,
): Element | null => (isElement(target) ? target.closest(selector) : null);

export const MOUSE_EVENTS = {
  click: "click",
  mouseDown: "mousedown",
  mouseUp: "mouseup",
  auxClick: "auxclick",
  contextMenu: "contextmenu",
} as const;
