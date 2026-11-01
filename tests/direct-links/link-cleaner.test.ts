import { GoogleRedirect } from "../../src/direct-links/google-redirect";
import { LinkCleaner } from "../../src/direct-links/link-cleaner";
import { WebOnly } from "../../src/direct-links/url-policy";

const redirect =
  "https://www.google.com/url?q=https://example.com/&source=gmail";

function link(attributes: Record<string, string>): HTMLAnchorElement {
  const anchor = document.createElement("a");
  for (const [name, value] of Object.entries(attributes))
    anchor.setAttribute(name, value);
  return anchor;
}

describe("LinkCleaner", () => {
  const webOnly = new WebOnly();
  const cleaner = new LinkCleaner(new GoogleRedirect(webOnly), webOnly);

  it("strips the redirect Gmail would swap in on mousedown", () => {
    const anchor = link({
      href: "https://example.com/",
      "data-saferedirecturl": redirect,
    });

    cleaner.clean(anchor);

    expect(anchor.getAttribute("href")).toBe("https://example.com/");
    expect(anchor.hasAttribute("data-saferedirecturl")).toBe(false);
  });

  it("unwraps an href that is itself the redirect", () => {
    const anchor = link({ href: redirect, "data-saferedirecturl": redirect });

    cleaner.clean(anchor);

    expect(anchor.getAttribute("href")).toBe("https://example.com/");
    expect(anchor.hasAttribute("data-saferedirecturl")).toBe(false);
  });

  it("leaves a redirect to javascript: wrapped", () => {
    const wrapped = "https://www.google.com/url?q=javascript:alert(1)";
    const anchor = link({ href: wrapped });

    cleaner.clean(anchor);

    expect(anchor.getAttribute("href")).toBe(wrapped);
  });

  it("keeps Gmail's safe redirect on a link that is not a web address", () => {
    const anchor = link({
      href: "javascript:alert(1)",
      "data-saferedirecturl": redirect,
    });

    cleaner.clean(anchor);

    expect(anchor.getAttribute("href")).toBe("javascript:alert(1)");
    expect(anchor.getAttribute("data-saferedirecturl")).toBe(redirect);
  });

  it("does nothing to a link with no href", () => {
    const anchor = link({ "data-saferedirecturl": redirect });

    cleaner.clean(anchor);

    expect(anchor.getAttribute("data-saferedirecturl")).toBe(redirect);
  });

  it("writes nothing when there is nothing to change", () => {
    const anchor = link({ href: "https://example.com/" });
    const setAttribute = vi.spyOn(anchor, "setAttribute");
    const removeAttribute = vi.spyOn(anchor, "removeAttribute");

    cleaner.clean(anchor);

    expect(setAttribute).not.toHaveBeenCalled();
    expect(removeAttribute).not.toHaveBeenCalled();
  });
});
