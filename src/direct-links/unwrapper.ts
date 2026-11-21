// Unwraps a redirector's link back to the address it points at.
export interface Unwrapper {
  // The address the link really points at, or undefined to leave it alone.
  unwrap(href: string): string | undefined;
}
