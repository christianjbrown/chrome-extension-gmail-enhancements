// The content script: builds every enhancement and starts it. Nothing else
// touches the page's globals.
import { ChosenYes } from "./accepted-invites/accept-state";
import { AcceptedInvites } from "./accepted-invites/accepted-invites";
import { CalendarReplyLink } from "./accepted-invites/calendar-reply";
import { GmailConfirmation } from "./accepted-invites/confirmation";
import { NearestDelete } from "./accepted-invites/delete-finder";
import { ConversationBinner } from "./accepted-invites/invite-binner";
import { LoneInvite } from "./accepted-invites/lone-invite";
import { MousePresser } from "./accepted-invites/presser";
import { RsvpLabels } from "./accepted-invites/rsvp-labels";
import { InviteRsvps } from "./accepted-invites/rsvp-reader";
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

function acceptedInvites(): Enhancement {
  const webOnly = new WebOnly();
  const labels = new RsvpLabels();
  const visibility = {
    visible: (element: Element) => element.checkVisibility(),
  };
  return new AcceptedInvites(
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
      new ChosenYes(labels),
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
const enhancements: Enhancement[] = [directLinks(), acceptedInvites()];

for (const enhancement of enhancements) enhancement.start();
