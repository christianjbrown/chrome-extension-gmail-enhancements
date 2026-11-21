// Spam has no Delete that goes to Bin, only "Delete forever", so this uses the
// message menu's own Delete, which moves it to Bin with Gmail's usual Undo. It
// deletes only once that menu says "Report as not phishing", which is Gmail
// showing it has the report.
import type { Presser } from "../presser";
import type { ControlWords } from "../control-words";
import type { MenuButtons, MenuItems } from "./menu-parts";
import type { ReportedDelete } from "./reported-delete";
import type { Waiter } from "../waiter";

export class MenuDelete implements ReportedDelete {
  constructor(
    // The menu that opens from a message, and the items it then shows.
    private readonly menu: MenuButtons & MenuItems,
    private readonly waiter: Waiter,
    private readonly presser: Presser,
    private readonly words: Pick<ControlWords, "reported" | "delete">,
  ) {}

  async delete(message: Element): Promise<void> {
    const button = this.menu.button(message);
    if (button) await this.fromMenu(button);
  }

  private async fromMenu(button: Element): Promise<void> {
    this.presser.press(button);
    const reported = await this.waiter.until(() =>
      this.menu.item(this.words.reported),
    );
    // No sign of the report, so the email stays, with its menu left open.
    if (reported) this.deleteBeside(reported);
  }

  private deleteBeside(reported: Element): void {
    const del = this.menu.sibling(reported, this.words.delete);
    if (del) this.presser.press(del);
  }
}
