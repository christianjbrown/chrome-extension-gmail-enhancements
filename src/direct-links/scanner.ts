// Finds the links worth cleaning in a freshly rendered piece of the page.
export interface Scanner {
  scan(root: Node): void;
}
