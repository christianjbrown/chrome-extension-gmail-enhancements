// Accepts ordinary web addresses for a link, and nothing else.
import type { UrlPolicy } from "./url-policy";

const WEB_PROTOCOLS = new Set(["http:", "https:"]);

// Ordinary web pages only. Never javascript:, data:, blob:, file: or anything
// else a crafted redirect could smuggle into an href.
export class WebOnly implements UrlPolicy {
  accept(value: string): URL | undefined {
    const url = URL.parse(value);
    return url !== null && WEB_PROTOCOLS.has(url.protocol) ? url : undefined;
  }
}
