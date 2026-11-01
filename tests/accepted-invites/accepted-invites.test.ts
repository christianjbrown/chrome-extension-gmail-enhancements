import { AcceptedInvites } from "../../src/accepted-invites/accepted-invites";
import type { Answer } from "../../src/accepted-invites/answer";
import type { Rsvp } from "../../src/accepted-invites/rsvp-reader";

describe("AcceptedInvites", () => {
  const message = document.createElement("div");

  function setup(...answers: (Answer | undefined)[]) {
    const source = document.createElement("div");
    const bin = vi.fn();
    const pending: ((confirmed: boolean) => void)[] = [];
    const confirmed = vi.fn(
      (_rsvp: Rsvp, _click: Event) =>
        new Promise<boolean>((resolve) => pending.push(resolve)),
    );
    const read = vi.fn((_target: EventTarget | null) => {
      const answer = answers.shift();
      return answer && { answer, message, via: "button" as const };
    });
    new AcceptedInvites(source, { read }, { confirmed }, { bin }).start();
    const click = () => {
      source.dispatchEvent(new MouseEvent("click"));
    };
    return { bin, confirmed, pending, read, click, source };
  }

  it("bins the invitation once an accept is confirmed", async () => {
    const { bin, confirmed, pending, read, click, source } = setup("yes");

    click();
    pending[0]!(true);

    expect(read).toHaveBeenCalledWith(source);
    expect(confirmed.mock.calls[0]![0]).toEqual({
      answer: "yes",
      message,
      via: "button",
    });
    await vi.waitFor(() => {
      expect(bin).toHaveBeenCalledExactlyOnceWith(message);
    });
  });

  it("keeps the invitation when the accept is not confirmed", async () => {
    const { bin, pending, click } = setup("yes");

    click();
    pending[0]!(false);

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(bin).not.toHaveBeenCalled();
  });

  it("never touches Maybe, No or other clicks", () => {
    const { confirmed, click } = setup("maybe", "no", undefined);

    click();
    click();
    click();

    expect(confirmed).not.toHaveBeenCalled();
  });

  it("calls a Yes off when the answer changes before it is confirmed", async () => {
    const { bin, pending, click } = setup("yes", "no");

    click();
    click();
    pending[0]!(true);

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(bin).not.toHaveBeenCalled();
  });

  it("listens before Gmail's own handlers", () => {
    const addEventListener = vi.fn();

    new AcceptedInvites(
      { addEventListener },
      { read: vi.fn() },
      { confirmed: vi.fn() },
      { bin: vi.fn() },
    ).start();

    expect(addEventListener).toHaveBeenCalledWith(
      "click",
      expect.any(Function),
      { capture: true },
    );
  });
});
