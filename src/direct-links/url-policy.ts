// Which addresses a link may be pointed at.
export interface UrlPolicy {
  // The parsed address when it is acceptable, otherwise undefined.
  accept(value: string): URL | undefined;
}
