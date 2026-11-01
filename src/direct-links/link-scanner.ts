// Finds the links worth cleaning in a freshly rendered piece of the page.
import type { Cleaner } from "./link-cleaner";

export interface Scanner {
  scan(root: Node): void;
}

const LINKS = "a[data-saferedirecturl], a[href*='google.com/url']";

export class LinkScanner implements Scanner {
  constructor(private readonly cleaner: Cleaner) {}

  scan(root: Node): void {
    if (isElement(root) && root.matches(LINKS)) this.cleaner.clean(root);
    if (isParent(root))
      root.querySelectorAll(LINKS).forEach((link) => {
        this.cleaner.clean(link);
      });
  }
}

// Text and comment nodes have neither, and are skipped.
function isElement(node: Node): node is Element {
  return "matches" in node;
}

function isParent(node: Node): node is Node & ParentNode {
  return "querySelectorAll" in node;
}
