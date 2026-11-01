import { ConversationBinner } from "../../src/accepted-invites/invite-binner";

describe("ConversationBinner", () => {
  const control = document.createElement("div");
  const view = document.createElement("div");

  function binner(onlyInvite: boolean, found = true) {
    const press = vi.fn();
    const find = vi.fn(() => (found ? { control, view } : undefined));
    const check = vi.fn(() => onlyInvite);
    return {
      press,
      find,
      check,
      binner: new ConversationBinner(
        { find },
        { onlyInvite: check },
        { press },
      ),
    };
  }

  function message(): Element {
    const element = document.createElement("div");
    document.body.append(element);
    return element;
  }

  it("presses Delete when the conversation is only the invitation", () => {
    const subject = binner(true);
    const invite = message();

    subject.binner.bin(invite);

    expect(subject.check).toHaveBeenCalledWith(invite, view);
    expect(subject.press).toHaveBeenCalledExactlyOnceWith(control);
  });

  it("leaves a conversation that holds more", () => {
    const subject = binner(false);

    subject.binner.bin(message());

    expect(subject.press).not.toHaveBeenCalled();
  });

  it("does nothing without a Delete to press", () => {
    const subject = binner(true, false);

    subject.binner.bin(message());

    expect(subject.check).not.toHaveBeenCalled();
    expect(subject.press).not.toHaveBeenCalled();
  });

  it("does nothing once the message has left the page", () => {
    const subject = binner(true);

    subject.binner.bin(document.createElement("div"));

    expect(subject.find).not.toHaveBeenCalled();
  });
});
