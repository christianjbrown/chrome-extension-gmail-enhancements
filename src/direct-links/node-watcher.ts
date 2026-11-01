// Reports every node Gmail adds to the page, and every element whose watched
// attributes change, since it renders messages long after the page loads.
export interface Watcher {
  watch(changed: (node: Node) => void): void;
}

export type ObserverFactory = (callback: MutationCallback) => MutationObserver;

export class NodeWatcher implements Watcher {
  constructor(
    private readonly observe: ObserverFactory,
    private readonly root: Node,
    private readonly attributes: string[],
  ) {}

  watch(changed: (node: Node) => void): void {
    this.observe((records) => {
      for (const record of records) {
        if (record.type === "attributes") changed(record.target);
        record.addedNodes.forEach((node) => {
          changed(node);
        });
      }
    }).observe(this.root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: this.attributes,
    });
  }
}
