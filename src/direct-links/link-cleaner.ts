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
    if (href !== null) this.cleanHref(link, href);
  }

  private cleanHref(link: Element, href: string): void {
    const direct = this.unwrapper.unwrap(href);
    this.point(link, direct);
    this.dropRedirect(link, direct ?? href);
  }

  // A link that is not wrapped stays as it is.
  private point(link: Element, direct: string | undefined): void {
    if (direct !== undefined) link.setAttribute(HREF, direct);
  }

  // Without Gmail's redirect there is nothing for it to swap in on mousedown.
  private dropRedirect(link: Element, target: string): void {
    if (link.hasAttribute(SAFE_REDIRECT)) this.dropIfSafe(link, target);
  }

  // Only once the link itself goes somewhere safe.
  private dropIfSafe(link: Element, target: string): void {
    if (this.policy.accept(target) !== undefined)
      link.removeAttribute(SAFE_REDIRECT);
  }
}
