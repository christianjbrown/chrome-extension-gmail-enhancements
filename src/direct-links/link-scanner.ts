// Finds the links worth cleaning in a freshly rendered piece of the page.
import { HREF, LINK } from "../dom";
import { isElement, isParent } from "../node-guards";
import { REDIRECT_MARK } from "./google-redirect";
import type { Cleaner } from "./cleaner";
import { SAFE_REDIRECT } from "./link-attributes";
import type { Scanner } from "./scanner";

const LINKS = `${LINK}[${SAFE_REDIRECT}], ${LINK}[${HREF}*='${REDIRECT_MARK}']`;

export class LinkScanner implements Scanner {
  constructor(private readonly cleaner: Cleaner) {}

  scan(root: Node): void {
    this.cleanSelf(root);
    this.cleanInside(root);
  }

  private cleanSelf(root: Node): void {
    if (isElement(root)) this.cleanIfLink(root);
  }

  private cleanIfLink(element: Element): void {
    if (element.matches(LINKS)) this.cleaner.clean(element);
  }

  private cleanInside(root: Node): void {
    if (isParent(root))
      root.querySelectorAll(LINKS).forEach((link) => {
        this.cleaner.clean(link);
      });
  }
}
