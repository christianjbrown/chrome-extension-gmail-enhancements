import { ChosenAnswer } from "../../src/answered-invites/answer-state";
import { RsvpLabels } from "../../src/answered-invites/rsvp-labels";

function message(markup: string): Element {
  const root = document.createElement("div");
  root.innerHTML = markup;
  return root;
}

describe("ChosenAnswer", () => {
  const state = new ChosenAnswer(new RsvpLabels());

  it.each(["aria-pressed", "aria-checked", "aria-selected"])(
    "sees an answer marked %s",
    (attribute) => {
      const invite = message(
        `<div role="button" ${attribute}="true">Maybe</div>`,
      );

      expect(state.answered(invite, "maybe")).toBe(true);
    },
  );

  it("does not count an answer that is not chosen, or another chosen one", () => {
    const invite = message(`
      <div role="button" aria-pressed="false">Yes</div>
      <div role="button" aria-pressed="true">No</div>`);

    expect(state.answered(invite, "yes")).toBe(false);
    expect(state.answered(invite, "no")).toBe(true);
  });
});
