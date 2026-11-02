import { ChosenAnswer } from "../../src/answered-invites/answer-state";
import { SmartEventCards } from "../../src/answered-invites/event-card";
import { RsvpLabels } from "../../src/answered-invites/rsvp-labels";

function message(markup: string): Element {
  const root = document.createElement("div");
  root.innerHTML = markup;
  return root;
}

describe("ChosenAnswer", () => {
  const state = new ChosenAnswer(new RsvpLabels(), new SmartEventCards());

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

  describe("on Gmail's event card above the message", () => {
    function conversation(card: string): Element {
      const root = document.createElement("div");
      root.innerHTML = `
        <div data-container-id="0:msg-f:5:extractedsmartmailevent">${card}</div>
        <div id="invite" data-message-id="#msg-f:5"></div>`;
      return root.querySelector("#invite")!;
    }

    it("sees an answer once the card swaps its buttons for that one", () => {
      const invite = conversation(
        `<button aria-haspopup="menu">Yes</button>
         <button aria-haspopup="menu" aria-label="Toggle more actions menu"></button>`,
      );

      expect(state.answered(invite, "yes")).toBe(true);
      expect(state.answered(invite, "no")).toBe(false);
    });

    it("does not count the card before an answer is recorded", () => {
      const invite = conversation(
        `<button>Yes</button><button>No</button><button>Maybe</button>`,
      );

      expect(state.answered(invite, "yes")).toBe(false);
    });

    it("does not count a pressed Correct? thumb, though it says Yes", () => {
      const invite = conversation(
        `<button>Yes</button><button aria-label="Yes" aria-pressed="true"></button>`,
      );

      expect(state.answered(invite, "yes")).toBe(false);
    });
  });
});
