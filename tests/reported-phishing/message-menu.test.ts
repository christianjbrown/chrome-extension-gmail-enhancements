import { CONTROL_WORDS } from "../../src/gmail-labels";
import { GmailMessageMenu } from "../../src/reported-phishing/message-menu";

describe("GmailMessageMenu", () => {
  const visibility = {
    visible: (element: Element) => !element.closest("[hidden]"),
  };

  function page(html: string) {
    const root = document.createElement("div");
    root.innerHTML = html;
    return {
      root,
      menu: new GmailMessageMenu(
        root,
        visibility,
        CONTROL_WORDS.moreMessageOptions,
      ),
    };
  }

  const byId = (root: Element, id: string) => root.querySelector(`#${id}`)!;

  it("knows which message a three dots button belongs to", () => {
    const { root, menu } = page(
      `<div data-message-id="#msg-f:1" id="message">
         <div role="button" aria-label="More message options" id="more"></div>
         <div role="button" aria-label="Reply" id="reply"></div>
       </div>
       <div role="button" aria-label="More message options" id="loose"></div>`,
    );

    expect(menu.owner(byId(root, "more"))).toBe(byId(root, "message"));
    expect(menu.owner(byId(root, "reply"))).toBeUndefined();
    expect(menu.owner(byId(root, "loose"))).toBeUndefined();
  });

  it("finds a message's three dots button", () => {
    const { root, menu } = page(
      `<div id="message"><div aria-label="More message options" id="more"></div></div>
       <div id="bare"></div>`,
    );

    expect(menu.button(byId(root, "message"))).toBe(byId(root, "more"));
    expect(menu.button(byId(root, "bare"))).toBeUndefined();
  });

  it("matches a menu item by its exact words", () => {
    const { root, menu } = page(
      `<div role="menuitem" id="item"> Report phishing </div>
       <div role="button" id="button">Report phishing</div>`,
    );

    expect(menu.is(byId(root, "item"), "Report phishing")).toBe(true);
    expect(menu.is(byId(root, "item"), "Report as not phishing")).toBe(false);
    expect(menu.is(byId(root, "button"), "Report phishing")).toBe(false);
  });

  it("finds the item on screen, and its siblings in the same menu", () => {
    const { root, menu } = page(
      `<div role="menu" hidden>
         <div role="menuitem">Delete</div>
         <div role="menuitem">Report as not phishing</div>
       </div>
       <div role="menu">
         <div role="menuitem" id="delete">Delete</div>
         <div role="menuitem" id="reported">Report as not phishing</div>
       </div>`,
    );

    const reported = menu.item("Report as not phishing");
    expect(reported).toBe(byId(root, "reported"));
    expect(menu.sibling(reported!, "Delete")).toBe(byId(root, "delete"));
    expect(menu.item("Report phishing")).toBeUndefined();
  });

  it("finds no sibling outside a menu", () => {
    const { root, menu } = page(`<div role="menuitem" id="loose">Delete</div>`);

    expect(menu.sibling(byId(root, "loose"), "Delete")).toBeUndefined();
  });
});
