// Checks on what the page hands over, made at run time, so code reads only the
// members a node really has.

// Only an element can say what it sits in or what it matches, not text, the
// window or the document.
export const isElement = (value: unknown): value is Element =>
  value instanceof Element;

// A link, with the resolved address Gmail's markup gives it.
export const isLink = (value: unknown): value is HTMLAnchorElement =>
  value instanceof HTMLAnchorElement;

// The nodes that hold others to search through: elements, documents and
// fragments. Text and comment nodes hold none.
export const isParent = (node: Node): node is Node & ParentNode =>
  [Element, Document, DocumentFragment].some((kind) => node instanceof kind);
