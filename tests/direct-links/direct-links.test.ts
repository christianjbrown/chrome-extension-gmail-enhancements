import { DirectLinks } from "../../src/direct-links/direct-links";

describe("DirectLinks", () => {
  it("guards clicks, scans the page, then scans whatever changes", () => {
    const order: string[] = [];
    const page = document.createElement("div");
    const added = document.createElement("p");
    const scan = vi.fn((node: Node) =>
      order.push(node === page ? "page" : "added"),
    );
    let changed: (node: Node) => void = (_node) => undefined;

    new DirectLinks(
      page,
      { scan },
      {
        watch: (listener) => {
          order.push("watch");
          changed = listener;
        },
      },
      { start: () => order.push("guard") },
    ).start();
    changed(added);

    expect(order).toEqual(["guard", "page", "watch", "added"]);
    expect(scan).toHaveBeenLastCalledWith(added);
  });
});
