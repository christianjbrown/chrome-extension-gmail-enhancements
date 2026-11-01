import { NearestDelete } from "../../src/accepted-invites/delete-finder";

const visibility = {
  visible: (element: Element) => element.closest("[hidden]") === null,
};
const finder = new NearestDelete(visibility);

function page(markup: string): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = markup;
  return root;
}

function message(root: HTMLElement): Element {
  return root.querySelector("[data-message-id]")!;
}

describe("NearestDelete", () => {
  it("finds the conversation's own toolbar Delete, skipping hidden views", () => {
    const root = page(`
      <div id="list-view" hidden>
        <div role="button" aria-label="Delete"></div>
      </div>
      <div id="conversation-view">
        <div role="toolbar"><div role="button" data-tooltip="Delete" id="delete"></div></div>
        <div><div data-message-id="1"></div></div>
      </div>`);

    expect(finder.find(message(root))).toEqual({
      control: root.querySelector("#delete"),
      view: root.querySelector("#conversation-view"),
    });
  });

  it("prefers the reading pane's Delete to the list's", () => {
    const root = page(`
      <div role="button" aria-label="Delete"></div>
      <div id="pane">
        <div role="button" aria-label="Delete" id="delete"></div>
        <div data-message-id="1"></div>
      </div>`);

    expect(finder.find(message(root))?.control.id).toBe("delete");
  });

  it("ignores a Delete inside a message, which is the sender's markup", () => {
    const root = page(`
      <div data-message-id="1"><div role="button" aria-label="Delete"></div></div>`);

    expect(finder.find(message(root))).toBeUndefined();
  });

  it("finds none when two Deletes are equally close", () => {
    const root = page(`
      <div role="button" aria-label="Delete"></div>
      <div role="button" aria-label="Delete"></div>
      <div data-message-id="1"></div>`);

    expect(finder.find(message(root))).toBeUndefined();
  });
});
