import { ChosenYes } from "../../src/accepted-invites/accept-state";
import { RsvpLabels } from "../../src/accepted-invites/rsvp-labels";

function message(markup: string): Element {
  const root = document.createElement("div");
  root.innerHTML = markup;
  return root;
}

describe("ChosenYes", () => {
  const state = new ChosenYes(new RsvpLabels());

  it.each(["aria-pressed", "aria-checked", "aria-selected"])(
    "sees a Yes marked %s",
    (attribute) => {
      expect(
        state.accepted(
          message(`<div role="button" ${attribute}="true">Yes</div>`),
        ),
      ).toBe(true);
    },
  );

  it("does not count a Yes that is not chosen, or another chosen answer", () => {
    expect(
      state.accepted(
        message(`
          <div role="button" aria-pressed="false">Yes</div>
          <div role="button" aria-pressed="true">Maybe</div>`),
      ),
    ).toBe(false);
  });
});
