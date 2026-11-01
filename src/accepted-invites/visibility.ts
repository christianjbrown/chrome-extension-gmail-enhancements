// Whether something is on screen. Gmail keeps the toolbars and messages of
// views you are not looking at in the page, hidden, so only what is visible
// counts.
export interface Visibility {
  visible(element: Element): boolean;
}
