// Whether a message is an invitation: it carries an .ics file, or a
// Calendar reply link.
import { ARIA_LABEL, HREF, LINK } from "../dom";
import { RESPOND } from "./calendar-link";
import type { InviteCheck } from "./invite-check";
import type { ReplyLinks } from "./reply-links";

// Reply links, found cheaply before each is read properly.
const REPLY_LINKS = `${LINK}[${HREF}*='${RESPOND}']`;
// An .ics attachment, for invitations from Outlook and other calendars that
// carry no Calendar links. Gmail's attachment chip has a download_url that
// starts with the file's type, and an aria-label that names the file.
const ICS = `[download_url^='text/calendar:'], [${ARIA_LABEL}*='.ics']`;

export class CalendarInvite implements InviteCheck {
  constructor(private readonly links: ReplyLinks) {}

  invitation(message: Element): boolean {
    if (message.querySelector(ICS)) return true;
    return [...message.querySelectorAll<HTMLAnchorElement>(REPLY_LINKS)].some(
      (link) => this.links.answer(link.href) !== undefined,
    );
  }
}
