import { VisibleMessages } from "../../src/reported-phishing/messages";

describe("VisibleMessages", () => {
  function page(html: string) {
    const root = document.createElement("div");
    root.innerHTML = html;
    return root;
  }
  const visibility = {
    visible: (element: Element) => !element.hasAttribute("hidden"),
  };

  it("finds the message on screen with the id", () => {
    const root = page(
      `<div data-message-id="#msg-f:1" hidden id="old"></div>
       <div data-message-id="#msg-f:2"></div>
       <div data-message-id="#msg-f:1" id="shown"></div>`,
    );

    expect(new VisibleMessages(root, visibility).find("#msg-f:1")?.id).toBe(
      "shown",
    );
  });

  it("finds nothing when no message on screen has it", () => {
    const root = page(`<div data-message-id="#msg-f:1" hidden></div>`);

    expect(
      new VisibleMessages(root, visibility).find("#msg-f:1"),
    ).toBeUndefined();
  });
});
