import { SmartEventCards } from "../../src/answered-invites/event-card";

function page(markup: string): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = markup;
  return root;
}

// Gmail's layout: the card beside the conversation list, not inside it, and
// a hidden view of the same message left behind elsewhere in the page.
const conversation = page(`
  <div id="hidden-view">
    <div id="stale-card" data-container-id="0:msg-f:123:extractedsmartmailevent"></div>
    <div id="stale" data-message-id="#msg-f:123"></div>
  </div>
  <div id="view">
    <div id="card" data-container-id="0:msg-f:123:extractedsmartmailevent">
      <button id="yes">Yes</button>
    </div>
    <div role="list">
      <div role="listitem"><div id="message" data-message-id="#msg-f:123"></div></div>
    </div>
  </div>
`);

function at(root: HTMLElement, id: string): Element {
  return root.querySelector(`#${id}`)!;
}

describe("SmartEventCards", () => {
  const cards = new SmartEventCards();

  it("finds the message a card control is about, in the same view", () => {
    expect(cards.message(at(conversation, "yes"))).toBe(
      at(conversation, "message"),
    );
  });

  it("finds the card for a message, in the same view", () => {
    expect(cards.card(at(conversation, "message"))).toBe(
      at(conversation, "card"),
    );
  });

  it("does not take a message whose id only starts the same", () => {
    const root = page(`
      <div data-container-id="0:msg-f:12:extractedsmartmailevent"><button>Yes</button></div>
      <div data-message-id="#msg-f:123"></div>`);

    expect(cards.message(root.querySelector("button")!)).toBeUndefined();
    expect(
      cards.card(root.querySelector("[data-message-id]")!),
    ).toBeUndefined();
  });

  it.each([
    `<button>Yes</button>`,
    `<div data-container-id="something-else"><button>Yes</button></div>`,
  ])("finds no message for a control on no card: %s", (markup) => {
    const root = page(`${markup}<div data-message-id="#msg-f:1"></div>`);

    expect(cards.message(root.querySelector("button")!)).toBeUndefined();
  });

  it("finds no message when the card's message is not on the page", () => {
    const root = page(
      `<div data-container-id="0:msg-f:1:extractedsmartmailevent"><button>Yes</button></div>`,
    );

    expect(cards.message(root.querySelector("button")!)).toBeUndefined();
  });

  it.each([
    `<div data-legacy-message-id="1a2b"></div>`,
    `<div data-message-id="#thread-f:1"></div>`,
    `<div data-message-id="#msg-f:1"></div>`,
  ])("finds no card for a message without one: %s", (markup) => {
    const root = page(markup);

    expect(cards.card(root.firstElementChild!)).toBeUndefined();
  });
});
