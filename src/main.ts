// The content script: builds every enhancement and starts it. Nothing else
// touches the page's globals.
import { ChosenAnswer } from "./answered-invites/answer-state";
import { AnsweredInvites } from "./answered-invites/answered-invites";
import { CalendarReplyLink } from "./answered-invites/calendar-reply";
import { GmailConfirmation } from "./answered-invites/confirmation";
import { SmartEventCards } from "./answered-invites/event-card";
import { NearestDelete } from "./answered-invites/delete-finder";
import { ConversationBinner } from "./answered-invites/invite-binner";
import { LoneInvite } from "./answered-invites/lone-invite";
import { MousePresser } from "./answered-invites/presser";
import { RsvpLabels } from "./answered-invites/rsvp-labels";
import { InviteRsvps } from "./answered-invites/rsvp-reader";
import { ClickGuard } from "./direct-links/click-guard";
import { DirectLinks } from "./direct-links/direct-links";
import { GoogleRedirect } from "./direct-links/google-redirect";
import { LINK_ATTRIBUTES, LinkCleaner } from "./direct-links/link-cleaner";
import { LinkScanner } from "./direct-links/link-scanner";
import { NodeWatcher } from "./direct-links/node-watcher";
import { WebOnly } from "./direct-links/url-policy";
import type { Enhancement } from "./enhancement";
import { GmailMessageMenu } from "./reported-phishing/message-menu";
import { VisibleMessages } from "./reported-phishing/messages";
import { Poller } from "./reported-phishing/poller";
import { ReportedBinner } from "./reported-phishing/reported-binner";
import { ReportedPhishing } from "./reported-phishing/reported-phishing";
import type { Router } from "./reported-phishing/router";
import { GmailRoutes } from "./reported-phishing/gmail-routes";
import { WarningBox } from "./reported-phishing/warning-box";

function directLinks(): Enhancement {
  const webOnly = new WebOnly();
  const cleaner = new LinkCleaner(new GoogleRedirect(webOnly), webOnly);
  return new DirectLinks(
    document,
    new LinkScanner(cleaner),
    new NodeWatcher(
      (callback) => new MutationObserver(callback),
      document,
      LINK_ATTRIBUTES,
    ),
    new ClickGuard(window, cleaner),
  );
}

const visibility = {
  visible: (element: Element) => element.checkVisibility(),
};

const timer = {
  delay: (milliseconds: number) =>
    new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds)),
};

const presser = new MousePresser(
  (type) => new MouseEvent(type, { bubbles: true, cancelable: true }),
);

function answeredInvites(): Enhancement {
  const webOnly = new WebOnly();
  const labels = new RsvpLabels();
  const cards = new SmartEventCards();
  return new AnsweredInvites(
    window,
    new InviteRsvps(
      new CalendarReplyLink(new GoogleRedirect(webOnly), webOnly),
      labels,
      cards,
    ),
    new GmailConfirmation(timer, new ChosenAnswer(labels, cards)),
    new ConversationBinner(
      new NearestDelete(visibility),
      new LoneInvite(visibility),
      presser,
    ),
  );
}

function reportedPhishing(): Enhancement {
  const router: Router = {
    current: () => window.location.hash,
    go: (route) => {
      window.location.hash = route;
    },
  };
  const menu = new GmailMessageMenu(document, visibility);
  const navigation = { router, routes: new GmailRoutes() };
  return new ReportedPhishing(
    window,
    navigation,
    { menu, warning: new WarningBox() },
    new ReportedBinner(
      navigation,
      new Poller(timer),
      { messages: new VisibleMessages(document, visibility), menu },
      presser,
    ),
  );
}

// A new enhancement is a new class and a new line here.
const enhancements: Enhancement[] = [
  directLinks(),
  answeredInvites(),
  reportedPhishing(),
];

for (const enhancement of enhancements) enhancement.start();
