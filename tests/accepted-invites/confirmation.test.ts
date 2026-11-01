import { GmailConfirmation } from "../../src/accepted-invites/confirmation";
import type { Rsvp } from "../../src/accepted-invites/rsvp-reader";

function rsvp(via: Rsvp["via"]): Rsvp {
  const message = document.createElement("div");
  document.body.append(message);
  return { answer: "yes", message, via };
}

function click(prevented: boolean): Event {
  const event = new Event("click", { cancelable: true });
  if (prevented) event.preventDefault();
  return event;
}

describe("GmailConfirmation", () => {
  const delay = vi.fn((_milliseconds: number) => Promise.resolve());

  function confirmation(...states: boolean[]) {
    const accepted = vi.fn(() => states.shift() ?? false);
    return {
      accepted,
      confirmation: new GmailConfirmation({ delay }, { accepted }),
    };
  }

  it("confirms once Gmail has shown the Yes as chosen twice in a row", async () => {
    const { accepted, confirmation: subject } = confirmation(
      false,
      true,
      false,
      true,
      true,
    );

    await expect(subject.confirmed(rsvp("button"), click(false))).resolves.toBe(
      true,
    );
    expect(accepted).toHaveBeenCalledTimes(5);
    expect(delay).toHaveBeenCalledWith(500);
  });

  it("gives up after fifteen seconds when the reply never shows", async () => {
    const { accepted, confirmation: subject } = confirmation();

    await expect(subject.confirmed(rsvp("button"), click(false))).resolves.toBe(
      false,
    );
    expect(accepted).toHaveBeenCalledTimes(30);
    expect(delay).toHaveBeenCalledTimes(30);
  });

  it("gives up when the message leaves the page", async () => {
    const { accepted, confirmation: subject } = confirmation(true, true);
    const answer = rsvp("button");
    answer.message.remove();

    await expect(subject.confirmed(answer, click(false))).resolves.toBe(false);
    expect(accepted).not.toHaveBeenCalled();
  });

  it("confirms a reply link that opened Calendar", async () => {
    const { accepted, confirmation: subject } = confirmation();

    await expect(subject.confirmed(rsvp("link"), click(false))).resolves.toBe(
      true,
    );
    expect(accepted).not.toHaveBeenCalled();
  });

  it("waits for the card when Gmail handled the reply link itself", async () => {
    const { accepted, confirmation: subject } = confirmation(true, true);

    await expect(subject.confirmed(rsvp("link"), click(true))).resolves.toBe(
      true,
    );
    expect(accepted).toHaveBeenCalledTimes(2);
  });
});
