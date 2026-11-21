// "Report phishing" in a message's own menu. The menu's items do not say which
// message they are about, so it is the one whose menu was opened last.
import { REPORT } from "../gmail-labels";
import type { MessageMenu } from "./message-menu";
import type { ReportPlace } from "./report-place";

export class MenuReports implements ReportPlace {
  private opened: Element | undefined;

  constructor(private readonly menu: MessageMenu) {}

  reported(control: Element): Element | undefined {
    const owner = this.menu.owner(control);
    if (owner) this.opened = owner;
    else if (this.menu.is(control, REPORT)) return this.opened;
    return undefined;
  }
}
