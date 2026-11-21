// Confirming a report sends Gmail back to the list it was made from, with the
// email now in Spam (or still there, when that is where it was). So the way
// back is to wait for Gmail to leave the conversation, check it went to that
// list, and open the conversation again in Spam.
import type { Report } from "./report";
import type { SpamNavigation } from "./router";
import type { SpamReturn } from "./spam-return";
import type { Waiter } from "../waiter";

export class GmailSpamReturn implements SpamReturn {
  constructor(
    private readonly navigation: SpamNavigation,
    private readonly waiter: Waiter,
  ) {}

  async reopen({ route }: Report): Promise<boolean> {
    const { router, routes } = this.navigation;
    const left = await this.waiter.until(() =>
      router.current() === route ? undefined : true,
    );
    if (!left || router.current() !== routes.list(route)) return false;
    router.go(routes.inSpam(route));
    return true;
  }
}
