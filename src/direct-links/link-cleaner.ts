// Points one link straight at its target.
import { HREF } from "../dom";
import type { Cleaner } from "./cleaner";
import { SAFE_REDIRECT } from "./link-attributes";
import type { Unwrapper } from "./unwrapper";
import type { UrlPolicy } from "./url-policy";

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
