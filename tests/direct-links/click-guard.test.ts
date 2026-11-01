import { ClickGuard } from "../../src/direct-links/click-guard";

describe("ClickGuard", () => {
  function guard() {
    const clean = vi.fn();
    const source = document.createElement("div");
    new ClickGuard(source, { clean }).start();
    // jsdom cannot follow a link, so a click must not try.
    for (const type of ["click", "auxclick"])
      source.addEventListener(type, (event) => {
        event.preventDefault();
      });
    return { clean, source };
  }

  it.each(["mousedown", "click", "auxclick", "contextmenu"])(
    "cleans the link a %s lands in, before the link's own handlers",
    (type) => {
      const { clean, source } = guard();
      source.innerHTML = `<a href="https://a.com/"><b>text</b></a>`;
      const link = source.querySelector("a")!;
      link.addEventListener(type, () => {
        expect(clean).toHaveBeenCalledWith(link);
      });

      source
        .querySelector("b")!
        .dispatchEvent(
          new MouseEvent(type, { bubbles: true, cancelable: true }),
        );

      expect(clean).toHaveBeenCalledExactlyOnceWith(link);
    },
  );

  it("ignores a press outside any link", () => {
    const { clean, source } = guard();
    source.innerHTML = `<span>text</span>`;

    source
      .querySelector("span")!
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    source.dispatchEvent(new MouseEvent("click"));

    expect(clean).not.toHaveBeenCalled();
  });

  it("ignores an event whose target is not an element", () => {
    const { clean, source } = guard();
    const text = document.createTextNode("text");
    source.append(text);

    text.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(clean).not.toHaveBeenCalled();
  });
});
