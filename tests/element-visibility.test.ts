import { ElementVisibility } from "../src/element-visibility";

describe("ElementVisibility", () => {
  it("asks the browser whether the element is on screen", () => {
    const element = document.createElement("div");
    element.checkVisibility = vi.fn(() => false);

    expect(new ElementVisibility().visible(element)).toBe(false);
    expect(element.checkVisibility).toHaveBeenCalled();
  });
});
