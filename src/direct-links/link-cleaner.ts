// Points one link straight at its target.
import type { Unwrapper } from "./google-redirect";
import type { UrlPolicy } from "./url-policy";

export interface Cleaner {
  clean(link: Element): void;
}

// Gmail keeps the real address in href and its redirect here, and swaps the
// redirect in on mousedown. Without it there is nothing to swap.
const SAFE_REDIRECT = "data-saferedirecturl";

export class LinkCleaner implements Cleaner {
  constructor(
    private readonly unwrapper: Unwrapper,
    private readonly policy: UrlPolicy,
  ) {}

  // Only writes what changes, so the attribute mutations it causes come back
  // through the watcher as no-ops rather than a loop.
  clean(link: Element): void {
    const href = link.getAttribute("href");
    if (href === null) return;
    const direct = this.unwrapper.unwrap(href);
    if (direct !== undefined) link.setAttribute("href", direct);
    if (
      link.hasAttribute(SAFE_REDIRECT) &&
      this.policy.accept(direct ?? href) !== undefined
    )
      link.removeAttribute(SAFE_REDIRECT);
  }
}
