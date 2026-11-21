// Points one link straight at its target.
import { HREF } from "../dom";
import type { Unwrapper } from "./google-redirect";
import type { UrlPolicy } from "./url-policy";

export interface Cleaner {
  clean(link: Element): void;
}

// Gmail keeps the real address in href and its redirect here, and swaps the
// redirect in on mousedown. Without it there is nothing to swap.
export const SAFE_REDIRECT = "data-saferedirecturl";
// Either changing means the link needs cleaning again.
export const LINK_ATTRIBUTES = [HREF, SAFE_REDIRECT];

export class LinkCleaner implements Cleaner {
  constructor(
    private readonly unwrapper: Unwrapper,
    private readonly policy: UrlPolicy,
  ) {}

  // Only writes what changes, so the attribute mutations it causes come back
  // through the watcher as no-ops rather than a loop.
  clean(link: Element): void {
    const href = link.getAttribute(HREF);
    if (href === null) return;
    const direct = this.unwrapper.unwrap(href);
    if (direct !== undefined) link.setAttribute(HREF, direct);
    if (
      link.hasAttribute(SAFE_REDIRECT) &&
      this.policy.accept(direct ?? href) !== undefined
    )
      link.removeAttribute(SAFE_REDIRECT);
  }
}
