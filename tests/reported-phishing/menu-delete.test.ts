import { CONTROL_WORDS } from "../../src/gmail-labels";
import { MenuDelete } from "../../src/reported-phishing/menu-delete";

describe("MenuDelete", () => {
  const message = document.createElement("div");
  const button = document.createElement("div");
  const reported = document.createElement("div");
  const del = document.createElement("div");

  interface Options {
    button?: Element | undefined;
    reported?: Element | undefined;
    del?: Element | undefined;
  }

  function setup(options: Options = {}) {
    const press = vi.fn();
    const menu = {
      button: vi.fn(() => ("button" in options ? options.button : button)),
      item: vi.fn(() => ("reported" in options ? options.reported : reported)),
      sibling: vi.fn(() => ("del" in options ? options.del : del)),
    };
    const waiter = {
      until: <T>(look: () => T | undefined) => Promise.resolve(look()),
    };
    const deleter = new MenuDelete(menu, waiter, { press }, CONTROL_WORDS);
    return { deleter, press, menu };
  }

  it("presses the menu's Delete once the menu shows the report", async () => {
    const { deleter, press, menu } = setup();

    await deleter.delete(message);

    expect(menu.button).toHaveBeenCalledWith(message);
    expect(menu.item).toHaveBeenCalledWith("Report as not phishing");
    expect(menu.sibling).toHaveBeenCalledWith(reported, "Delete");
    expect(press.mock.calls).toEqual([[button], [del]]);
  });

  it("does nothing when the message has no menu", async () => {
    const { deleter, press } = setup({ button: undefined });

    await deleter.delete(message);

    expect(press).not.toHaveBeenCalled();
  });

  it("keeps the email when Gmail shows no sign of the report", async () => {
    const { deleter, press, menu } = setup({ reported: undefined });

    await deleter.delete(message);

    expect(menu.sibling).not.toHaveBeenCalled();
    expect(press).toHaveBeenCalledExactlyOnceWith(button);
  });

  it("keeps the email when the menu has no Delete", async () => {
    const { deleter, press } = setup({ del: undefined });

    await deleter.delete(message);

    expect(press).toHaveBeenCalledExactlyOnceWith(button);
  });
});
