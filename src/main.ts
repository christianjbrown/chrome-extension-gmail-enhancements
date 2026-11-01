// The content script: builds every enhancement and starts it. Nothing else
// touches the page's globals.
import { ChosenAnswer } from "./answered-invites/answer-state";
import { AnsweredInvites } from "./answered-invites/answered-invites";
import { CalendarReplyLink } from "./answered-invites/calendar-reply";
import { GmailConfirmation } from "./answered-invites/confirmation";
import { NearestDelete } from "./answered-invites/delete-finder";
import { ConversationBinner } from "./answered-invites/invite-binner";
import { LoneInvite } from "./answered-invites/lone-invite";
import { MousePresser } from "./answered-invites/presser";
import { RsvpLabels } from "./answered-invites/rsvp-labels";
import { InviteRsvps } from "./answered-invites/rsvp-reader";
import { ClickGuard } from "./direct-links/click-guard";
import { DirectLinks } from "./direct-links/direct-links";
import { GoogleRedirect } from "./direct-links/google-redirect";
import { LinkCleaner } from "./direct-links/link-cleaner";
import { LinkScanner } from "./direct-links/link-scanner";
import { NodeWatcher } from "./direct-links/node-watcher";
import { WebOnly } from "./direct-links/url-policy";
import type { Enhancement } from "./enhancement";

function directLinks(): Enhancement {
  const webOnly = new WebOnly();
  const cleaner = new LinkCleaner(new GoogleRedirect(webOnly), webOnly);
  return new DirectLinks(
    document,
    new LinkScanner(cleaner),
    new NodeWatcher((callback) => new MutationObserver(callback), document, [
      "href",
      "data-saferedirecturl",
    ]),
    new ClickGuard(window, cleaner),
  );
}

function answeredInvites(): Enhancement {
  const webOnly = new WebOnly();
  const labels = new RsvpLabels();
  const visibility = {
    visible: (element: Element) => element.checkVisibility(),
  };
  return new AnsweredInvites(
    window,
    new InviteRsvps(
      new CalendarReplyLink(new GoogleRedirect(webOnly), webOnly),
      labels,
    ),
    new GmailConfirmation(
      {
        delay: (milliseconds) =>
          new Promise((resolve) => window.setTimeout(resolve, milliseconds)),
      },
      new ChosenAnswer(labels),
    ),
    new ConversationBinner(
      new NearestDelete(visibility),
      new LoneInvite(visibility),
      new MousePresser(
        (type) => new MouseEvent(type, { bubbles: true, cancelable: true }),
      ),
    ),
  );
}

// A new enhancement is a new class and a new line here.
const enhancements: Enhancement[] = [directLinks(), answeredInvites()];

for (const enhancement of enhancements) enhancement.start();
