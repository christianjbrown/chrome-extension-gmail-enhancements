import { isElement, isLink, isParent } from "../src/node-guards";

describe("isElement", () => {
  it("takes an element", () => {
    expect(isElement(document.createElement("div"))).toBe(true);
  });

  it("refuses the window, text, anything with a closest of its own and nothing", () => {
    expect(isElement(window)).toBe(false);
    expect(isElement(document.createTextNode("x"))).toBe(false);
    expect(isElement({ closest: () => null })).toBe(false);
    expect(isElement(null)).toBe(false);
  });
});

describe("isLink", () => {
  it("takes a link", () => {
    expect(isLink(document.createElement("a"))).toBe(true);
  });

  it("refuses another element and anything with an href of its own", () => {
    expect(isLink(document.createElement("span"))).toBe(false);
    expect(isLink({ href: "https://a.com/" })).toBe(false);
  });
});

describe("isParent", () => {
  it("takes elements, documents and fragments", () => {
    expect(isParent(document.createElement("div"))).toBe(true);
    expect(isParent(document)).toBe(true);
    expect(isParent(document.createDocumentFragment())).toBe(true);
  });

  it("refuses text and comments", () => {
    expect(isParent(document.createTextNode("x"))).toBe(false);
    expect(isParent(document.createComment("x"))).toBe(false);
  });
});
