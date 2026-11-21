// Reports every node Gmail adds to the page, and every element whose watched
// attributes change.
export interface Watcher {
  watch(changed: (node: Node) => void): void;
}
