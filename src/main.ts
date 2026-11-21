// The content script: builds every enhancement and starts it. Nothing else
// touches the page's globals.
import { AnsweredInvites } from "./answered-invites/answered-invites";
import { CalendarInvite } from "./answered-invites/calendar-invite";
import { CalendarReplyLink } from "./answered-invites/calendar-reply";
import { ChosenAnswer } from "./answered-invites/chosen-answer";
import { SmartEventCards } from "./answered-invites/event-card";
import { GmailConfirmation } from "./answered-invites/gmail-confirmation";
import { ConversationBinner } from "./answered-invites/invite-binner";
import { InviteRsvps } from "./answered-invites/invite-rsvps";
import { LabelledRsvps } from "./answered-invites/labelled-rsvps";
import { LoneInvite } from "./answered-invites/lone-invite";
import { NearestDelete } from "./answered-invites/nearest-delete";
import { ReplyLinkRsvps } from "./answered-invites/reply-link-rsvps";
import { RsvpLabels } from "./answered-invites/rsvp-labels";
import { RecordedLater } from "./answered-invites/recorded-later";
import { RecordedOnClick } from "./answered-invites/recorded-on-click";
import { CONTENT_CONFIG } from "./config";
import { ClickGuard } from "./direct-links/click-guard";
import { DirectLinks } from "./direct-links/direct-links";
import { GOOGLE_REDIRECT } from "./direct-links/google-redirect";
import { LINK_ATTRIBUTES } from "./direct-links/link-attributes";
import { LinkCleaner } from "./direct-links/link-cleaner";
import { LinkScanner } from "./direct-links/link-scanner";
import { NodeWatcher } from "./direct-links/node-watcher";
import { RedirectUnwrapper } from "./direct-links/redirect-unwrapper";
import { WebOnly } from "./direct-links/web-only";
import { ElementVisibility } from "./element-visibility";
import type { Enhancement } from "./enhancement";
import { ANSWER_WORDS } from "./gmail-labels";
import { MousePresser } from "./mouse-presser";
import { Poller } from "./poller";
import { ConversationReports } from "./reported-phishing/conversation-reports";
import { GmailReportDialog } from "./reported-phishing/gmail-report-dialog";
import { GmailRoutes } from "./reported-phishing/gmail-routes";
import { HashRouter } from "./reported-phishing/hash-router";
import { MenuReports } from "./reported-phishing/menu-reports";
import { GmailMessageMenu } from "./reported-phishing/message-menu";
import { VisibleMessages } from "./reported-phishing/messages";
import { ReportPresses } from "./reported-phishing/report-presses";
import { GmailSpamReturn } from "./reported-phishing/gmail-spam-return";
import { MenuDelete } from "./reported-phishing/menu-delete";
import { ReportedBinner } from "./reported-phishing/reported-binner";
import { ReportedPhishing } from "./reported-phishing/reported-phishing";
import { WarningBox } from "./reported-phishing/warning-box";
import { WindowTimer } from "./window-timer";

function directLinks(): Enhancement {
  const webOnly = new WebOnly();
  const cleaner = new LinkCleaner(
    new RedirectUnwrapper(webOnly, GOOGLE_REDIRECT),
    webOnly,
  );
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

const visibility = new ElementVisibility();

const timer = new WindowTimer(window);

const presser = new MousePresser(
  (type) => new MouseEvent(type, { bubbles: true, cancelable: true }),
);

function answeredInvites(): Enhancement {
  const webOnly = new WebOnly();
  const labels = new RsvpLabels(ANSWER_WORDS);
  const cards = new SmartEventCards();
  const links = new CalendarReplyLink(
    new RedirectUnwrapper(webOnly, GOOGLE_REDIRECT),
    webOnly,
  );
  return new AnsweredInvites(
    window,
    new InviteRsvps(
      [
        new ReplyLinkRsvps(links, new RecordedOnClick()),
        new LabelledRsvps(
          labels,
          new CalendarInvite(links),
          new RecordedLater(),
        ),
      ],
      cards,
    ),
    new GmailConfirmation(
      new Poller(timer, CONTENT_CONFIG.inviteChecks),
      new ChosenAnswer(labels, cards),
      CONTENT_CONFIG.inviteSettledChecks,
    ),
    new ConversationBinner(
      new NearestDelete(visibility),
      new LoneInvite(visibility),
      presser,
    ),
  );
}

function reportedPhishing(): Enhancement {
  const router = new HashRouter(window.location);
  const menu = new GmailMessageMenu(document, visibility);
  const waiter = new Poller(timer, CONTENT_CONFIG.phishingChecks);
  const navigation = {
    router,
    routes: new GmailRoutes(CONTENT_CONFIG.conversationIdMinLength),
  };
  return new ReportedPhishing(
    window,
    new ReportPresses({
      places: [new MenuReports(menu, menu), new WarningBox()],
      dialog: new GmailReportDialog(),
    }),
    new ConversationReports(navigation),
    new ReportedBinner(
      new GmailSpamReturn(navigation, waiter),
      waiter,
      new VisibleMessages(document, visibility),
      new MenuDelete(menu, menu, waiter, presser),
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
