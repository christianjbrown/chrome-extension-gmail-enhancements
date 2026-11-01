import { RsvpLabels } from "../../src/answered-invites/rsvp-labels";

function control(markup: string): Element {
  const root = document.createElement("div");
  root.innerHTML = markup;
  return root.firstElementChild!;
}

describe("RsvpLabels", () => {
  const labels = new RsvpLabels();

  it.each([
    [`<div role="button"> Yes </div>`, "yes"],
    [`<div role="button">MAYBE</div>`, "maybe"],
    [`<div role="button">No</div>`, "no"],
    [`<div role="button" aria-label="Yes, I'll be there">Go</div>`, "yes"],
  ])("reads %s as %s", (markup, answer) => {
    expect(labels.answer(control(markup))).toBe(answer);
  });

  it("prefers the aria-label to the text", () => {
    expect(
      labels.answer(control(`<div role="button" aria-label="No">Yes</div>`)),
    ).toBe("no");
  });

  it.each(["Notes", "Yesterday", "Delete", "", "Say yes"])(
    "ignores %j",
    (text) => {
      expect(
        labels.answer(control(`<div role="button">${text}</div>`)),
      ).toBeUndefined();
    },
  );
});
