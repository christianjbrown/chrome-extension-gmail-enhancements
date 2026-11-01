import { LoneInvite } from "../../src/answered-invites/lone-invite";

const check = new LoneInvite({
  visible: (element) => element.closest("[hidden]") === null,
});

function view(markup: string): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = markup;
  return root;
}

function invite(root: HTMLElement): Element {
  return root.querySelector("#invite")!;
}

describe("LoneInvite", () => {
  it("passes a conversation that is only the invitation", () => {
    const root = view(`
      <div hidden><div data-message-id="old"></div></div>
      <div role="list">
        <div role="listitem">
          <div id="invite" data-message-id="1">
            <div data-message-id="quoted"></div>
          </div>
        </div>
      </div>`);

    expect(check.onlyInvite(invite(root), root)).toBe(true);
  });

  it("passes a lone message Gmail drew without a list", () => {
    const root = view(`<div id="invite" data-legacy-message-id="1"></div>`);

    expect(check.onlyInvite(invite(root), root)).toBe(true);
  });

  it("stops at a reply in the conversation", () => {
    const root = view(`
      <div id="invite" data-message-id="1"></div>
      <div data-message-id="2"></div>`);

    expect(check.onlyInvite(invite(root), root)).toBe(false);
  });

  it("stops at a collapsed message that carries no id", () => {
    const root = view(`
      <div role="list">
        <div role="listitem"><span>Earlier message</span></div>
        <div role="listitem">
          <div id="invite" data-message-id="1">
            <div role="list"><div role="listitem"></div><div role="listitem"></div></div>
          </div>
        </div>
      </div>`);

    expect(check.onlyInvite(invite(root), root)).toBe(false);
  });

  it("stops when rows are checked in the list", () => {
    const root = view(`
      <div role="checkbox" aria-checked="true"></div>
      <div id="invite" data-message-id="1"></div>`);

    expect(check.onlyInvite(invite(root), root)).toBe(false);
  });

  it("ignores checked rows in a hidden list", () => {
    const root = view(`
      <div hidden><div role="checkbox" aria-checked="true"></div></div>
      <div id="invite" data-message-id="1"></div>`);

    expect(check.onlyInvite(invite(root), root)).toBe(true);
  });
});
