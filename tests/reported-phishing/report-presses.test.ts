import { DIALOG_CHOICE } from "../../src/reported-phishing/report-dialog";
import { ReportPresses } from "../../src/reported-phishing/report-presses";

describe("ReportPresses", () => {
  function setup(
    choice: (typeof DIALOG_CHOICE)[keyof typeof DIALOG_CHOICE] | undefined,
  ) {
    document.body.innerHTML = `
      <div id="message"></div>
      <button id="button"><span id="inside">Press</span></button>
      <p id="text">Words</p>`;
    const message = document.getElementById("message")!;
    const seen: Element[] = [];
    const presses = new ReportPresses({
      places: [
        { reported: () => undefined },
        {
          reported: (control) => {
            seen.push(control);
            return message;
          },
        },
      ],
      dialog: { choice: () => choice },
    });
    const handler = { answered: vi.fn(), reported: vi.fn() };
    return { presses, handler, message, seen };
  }

  it("passes on a dialog answer", () => {
    const { presses, handler } = setup(DIALOG_CHOICE.confirm);

    presses.sort(document.getElementById("button"), handler);

    expect(handler.answered).toHaveBeenCalledExactlyOnceWith(
      DIALOG_CHOICE.confirm,
    );
    expect(handler.reported).not.toHaveBeenCalled();
  });

  it("passes on the message the first place reports", () => {
    const { presses, handler, message, seen } = setup(undefined);

    presses.sort(document.getElementById("inside"), handler);

    expect(handler.reported).toHaveBeenCalledExactlyOnceWith(message);
    expect(seen).toEqual([document.getElementById("button")]);
  });

  it("passes on nothing when no place reports a message", () => {
    const handler = { answered: vi.fn(), reported: vi.fn() };
    document.body.innerHTML = `<button id="button"></button>`;

    new ReportPresses({
      places: [{ reported: () => undefined }],
      dialog: { choice: () => undefined },
    }).sort(document.getElementById("button"), handler);

    expect(handler.reported).not.toHaveBeenCalled();
    expect(handler.answered).not.toHaveBeenCalled();
  });

  it.each([
    ["something that cannot be pressed", "text"],
    ["no target", undefined],
  ])("ignores a press on %s", (_name, id) => {
    const { presses, handler } = setup(DIALOG_CHOICE.confirm);

    presses.sort(id ? document.getElementById(id) : null, handler);

    expect(handler.answered).not.toHaveBeenCalled();
    expect(handler.reported).not.toHaveBeenCalled();
  });

  it("ignores a press whose target is not an element", () => {
    const { presses, handler } = setup(DIALOG_CHOICE.confirm);

    presses.sort(window, handler);

    expect(handler.answered).not.toHaveBeenCalled();
    expect(handler.reported).not.toHaveBeenCalled();
  });
});
