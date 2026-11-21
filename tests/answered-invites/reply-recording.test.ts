import { RecordedLater } from "../../src/answered-invites/recorded-later";
import { RecordedOnClick } from "../../src/answered-invites/recorded-on-click";

function click(prevented: boolean): Event {
  const event = new Event("click", { cancelable: true });
  if (prevented) event.preventDefault();
  return event;
}

describe("RecordedOnClick", () => {
  it("counts the reply in once Gmail lets the click through", () => {
    expect(new RecordedOnClick().recordedBy(click(false))).toBe(true);
  });

  it("does not when Gmail handled the click itself", () => {
    expect(new RecordedOnClick().recordedBy(click(true))).toBe(false);
  });
});

describe("RecordedLater", () => {
  it("never counts the reply in from the click alone", () => {
    expect(new RecordedLater().recordedBy()).toBe(false);
  });
});
