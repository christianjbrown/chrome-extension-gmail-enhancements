// The page's own words that several parts share: attribute names, roles, tags
// and the mouse events a press is made of.
export const HREF = "href";
export const ARIA_LABEL = "aria-label";
export const LINK = "a";
export const BUTTON = "button";
export const ROLE_BUTTON = "[role='button']";
export const ROLE_MENU_ITEM = "[role='menuitem']";

export const MOUSE_EVENTS = {
  click: "click",
  mouseDown: "mousedown",
  mouseUp: "mouseup",
  auxClick: "auxclick",
  contextMenu: "contextmenu",
} as const;
