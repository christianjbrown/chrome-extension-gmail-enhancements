import { GmailConfirmation } from "../../src/answered-invites/confirmation";
import type { Rsvp } from "../../src/answered-invites/rsvp-reader";

function rsvp(via: Rsvp["via"]): Rsvp {
  const message = document.createElement("div");
  document.body.append(message);
  return { answer: "maybe", message, via };
}

function click(prevented: boolean): Event {
  const event = new Event("click", { cancelable: true });
  if (prevented) event.preventDefault();
  return event;
}

describe("GmailConfirmation", () => {
  const delay = vi.fn((_milliseconds: number) => Promise.resolve());

  function confirmation(...states: boolean[]) {
    const answered = vi.fn(
      (_message: Element, _answer: string) => states.shift() ?? false,
    );
    return {
      answered,
      confirmation: new GmailConfirmation({ delay }, { answered }),
    };
  }

  it("confirms once Gmail has shown the answer as chosen twice in a row", async () => {
    const { answered, confirmation: subject } = confirmation(
      false,
      true,
      false,
      true,
      true,
    );

    await expect(subject.confirmed(rsvp("button"), click(false))).resolves.toBe(
      true,
    );
    expect(answered).toHaveBeenCalledTimes(5);
    expect(answered).toHaveBeenLastCalledWith(expect.any(Element), "maybe");
    expect(delay).toHaveBeenCalledWith(500);
  });

  it("gives up after fifteen seconds when the reply never shows", async () => {
    const { answered, confirmation: subject } = confirmation();

    await expect(subject.confirmed(rsvp("button"), click(false))).resolves.toBe(
      false,
    );
    expect(answered).toHaveBeenCalledTimes(30);
    expect(delay).toHaveBeenCalledTimes(30);
  });

  it("gives up when the message leaves the page", async () => {
    const { answered, confirmation: subject } = confirmation(true, true);
    const answer = rsvp("button");
    answer.message.remove();

    await expect(subject.confirmed(answer, click(false))).resolves.toBe(false);
    expect(answered).not.toHaveBeenCalled();
  });

  it("confirms a reply link that opened Calendar", async () => {
    const { answered, confirmation: subject } = confirmation();

    await expect(subject.confirmed(rsvp("link"), click(false))).resolves.toBe(
      true,
    );
    expect(answered).not.toHaveBeenCalled();
  });

  it("waits for the card when Gmail handled the reply link itself", async () => {
    const { answered, confirmation: subject } = confirmation(true, true);

    await expect(subject.confirmed(rsvp("link"), click(true))).resolves.toBe(
      true,
    );
    expect(answered).toHaveBeenCalledTimes(2);
  });
});
