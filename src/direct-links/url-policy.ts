// Which addresses a link may be pointed at.
export interface UrlPolicy {
  // The parsed address when it is acceptable, otherwise undefined.
  accept(value: string): URL | undefined;
}

const WEB_PROTOCOLS = new Set(["http:", "https:"]);

// Ordinary web pages only. Never javascript:, data:, blob:, file: or anything
// else a crafted redirect could smuggle into an href.
export class WebOnly implements UrlPolicy {
  accept(value: string): URL | undefined {
    const url = URL.parse(value);
    return url !== null && WEB_PROTOCOLS.has(url.protocol) ? url : undefined;
  }
}
