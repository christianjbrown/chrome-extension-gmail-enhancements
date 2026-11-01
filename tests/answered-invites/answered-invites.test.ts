import { AnsweredInvites } from "../../src/answered-invites/answered-invites";
import type { Answer } from "../../src/answered-invites/answer";
import type { Rsvp } from "../../src/answered-invites/rsvp-reader";

describe("AnsweredInvites", () => {
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
    new AnsweredInvites(source, { read }, { confirmed }, { bin }).start();
    const click = () => {
      source.dispatchEvent(new MouseEvent("click"));
    };
    return { bin, confirmed, pending, read, click, source };
  }

  function settle() {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  it.each<Answer>(["yes", "maybe", "no"])(
    "bins the invitation once a %s is confirmed",
    async (answer) => {
      const { bin, confirmed, pending, read, click, source } = setup(answer);

      click();
      pending[0]!(true);

      expect(read).toHaveBeenCalledWith(source);
      expect(confirmed.mock.calls[0]![0]).toEqual({
        answer,
        message,
        via: "button",
      });
      await vi.waitFor(() => {
        expect(bin).toHaveBeenCalledExactlyOnceWith(message);
      });
    },
  );

  it("keeps the invitation when the reply is not confirmed", async () => {
    const { bin, pending, click } = setup("yes");

    click();
    pending[0]!(false);

    await settle();
    expect(bin).not.toHaveBeenCalled();
  });

  it("ignores clicks that are not replies", () => {
    const { confirmed, click } = setup(undefined);

    click();

    expect(confirmed).not.toHaveBeenCalled();
  });

  it("goes by the latest answer when it changes before the first is confirmed", async () => {
    const { bin, pending, click } = setup("yes", "no");

    click();
    click();
    pending[0]!(true);
    await settle();

    expect(bin).not.toHaveBeenCalled();

    pending[1]!(true);
    await vi.waitFor(() => {
      expect(bin).toHaveBeenCalledExactlyOnceWith(message);
    });
  });

  it("listens before Gmail's own handlers", () => {
    const addEventListener = vi.fn();

    new AnsweredInvites(
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
