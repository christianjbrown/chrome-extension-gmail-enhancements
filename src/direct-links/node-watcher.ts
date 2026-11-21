// Watches the page with a MutationObserver, since Gmail renders messages long
// after the page loads.
import type { ObserverFactory } from "./observer-factory";
import type { Watcher } from "./watcher";

// The kind of record a change to a watched attribute makes.
const ATTRIBUTE_CHANGE: MutationRecordType = "attributes";

export class NodeWatcher implements Watcher {
  constructor(
    private readonly observe: ObserverFactory,
    private readonly root: Node,
    private readonly attributes: string[],
  ) {}

  watch(changed: (node: Node) => void): void {
    this.observe((records) => {
      for (const record of records) {
        if (record.type === ATTRIBUTE_CHANGE) changed(record.target);
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
