import { NodeWatcher } from "../../src/direct-links/node-watcher";

function watch(root: Node) {
  const changed = vi.fn();
  new NodeWatcher((callback) => new MutationObserver(callback), root, [
    "href",
  ]).watch(changed);
  return changed;
}

describe("NodeWatcher", () => {
  it("reports nodes added anywhere below the root", async () => {
    const root = document.createElement("div");
    root.append(document.createElement("section"));
    const changed = watch(root);
    const message = document.createElement("p");

    root.firstElementChild!.append(message);

    await vi.waitFor(() => {
      expect(changed).toHaveBeenCalledWith(message);
    });
  });

  it("reports an element whose watched attribute changes", async () => {
    const root = document.createElement("div");
    const link = document.createElement("a");
    root.append(link);
    const changed = watch(root);

    link.setAttribute("title", "ignored");
    link.setAttribute("href", "https://a.com/");

    await vi.waitFor(() => {
      expect(changed).toHaveBeenCalledExactlyOnceWith(link);
    });
  });
});
