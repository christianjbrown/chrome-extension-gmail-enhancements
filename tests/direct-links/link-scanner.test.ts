import { LinkScanner } from "../../src/direct-links/link-scanner";

function html(markup: string): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = markup;
  return root;
}

describe("LinkScanner", () => {
  const clean = vi.fn();
  const scanner = new LinkScanner({ clean });

  it("cleans Gmail's redirecting links and wrapped hrefs inside a node", () => {
    const root = html(`
      <a id="safe" href="https://a.com/" data-saferedirecturl="x">a</a>
      <a id="wrapped" href="https://www.google.com/url?q=https://b.com/">b</a>
      <a id="plain" href="https://c.com/">c</a>
      <span data-saferedirecturl="x">not a link</span>
    `);

    scanner.scan(root);

    expect(clean.mock.calls.map(([link]) => (link as Element).id)).toEqual([
      "safe",
      "wrapped",
    ]);
  });

  it("cleans the node itself when it is such a link", () => {
    const link = html(
      `<a href="https://a.com/" data-saferedirecturl="x">a</a>`,
    ).firstElementChild!;

    scanner.scan(link);

    expect(clean).toHaveBeenCalledExactlyOnceWith(link);
  });

  it("scans a whole document", () => {
    const page = document.implementation.createHTMLDocument();
    page.body.innerHTML = `<a href="https://a.com/" data-saferedirecturl="x">a</a>`;

    scanner.scan(page);

    expect(clean).toHaveBeenCalledOnce();
  });

  it("skips text nodes", () => {
    scanner.scan(document.createTextNode("https://www.google.com/url?q=x"));

    expect(clean).not.toHaveBeenCalled();
  });
});
