import { GmailConfirmation } from "../../src/answered-invites/gmail-confirmation";
import type { Rsvp } from "../../src/answered-invites/rsvp";
import type { Waiter } from "../../src/waiter";

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

// Looks as many times as it is allowed, straight away.
function waiter(looks: number): Waiter & { looks: number } {
  const fake = {
    looks: 0,
    until<T>(find: () => T | undefined): Promise<T | undefined> {
      while (fake.looks < looks) {
        fake.looks += 1;
        const found = find();
        if (found !== undefined) return Promise.resolve(found);
      }
      return Promise.resolve(undefined);
    },
  };
  return fake;
}

describe("GmailConfirmation", () => {
  let looks: ReturnType<typeof waiter>;

  function confirmation(...states: boolean[]) {
    const answered = vi.fn(
      (_message: Element, _answer: string) => states.shift() ?? false,
    );
    looks = waiter(30);
    return {
      answered,
      confirmation: new GmailConfirmation(looks, { answered }, 2),
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
  });

  it("gives up after fifteen seconds when the reply never shows", async () => {
    const { answered, confirmation: subject } = confirmation();

    await expect(subject.confirmed(rsvp("button"), click(false))).resolves.toBe(
      false,
    );
    expect(answered).toHaveBeenCalledTimes(30);
    expect(looks.looks).toBe(30);
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
