// Works out whether a click answered an invitation, and how.
import type { Answer } from "./answer";
import type { ReplyLinks } from "./calendar-reply";
import { MESSAGE } from "./gmail-message";
import type { Labels } from "./rsvp-labels";

export interface Rsvp {
  answer: Answer;
  // The message holding the invitation.
  message: Element;
  // A Calendar reply link, or a control on Gmail's invite card.
  via: "link" | "button";
}

export interface RsvpReader {
  read(target: EventTarget | null): Rsvp | undefined;
}

// Anything a person can press: a link, a real button, or one of Gmail's
// role="button" elements, which is what its invite card answers are.
const CONTROLS = "a[href], button, [role='button']";
// Reply links, found cheaply before each is read properly.
const REPLY_LINKS = "a[href*='RESPOND']";
// An .ics attachment, for invitations from Outlook and other calendars that
// carry no Calendar links. Gmail's attachment chip has a download_url that
// starts with the file's type, and an aria-label that names the file.
const ICS = "[download_url^='text/calendar:'], [aria-label*='.ics']";

export class InviteRsvps implements RsvpReader {
  constructor(
    private readonly links: ReplyLinks,
    private readonly labels: Labels,
  ) {}

  read(target: EventTarget | null): Rsvp | undefined {
    const control = (target as Partial<Element> | null)?.closest?.(CONTROLS);
    const message = control?.closest(MESSAGE);
    return control && message ? this.reply(control, message) : undefined;
  }

  private reply(control: Element, message: Element): Rsvp | undefined {
    const href = control.getAttribute("href");
    const linked = href === null ? undefined : this.links.answer(href);
    if (linked !== undefined) return { answer: linked, message, via: "link" };
    // A word on a button means nothing outside an invitation.
    const labelled = this.labels.answer(control);
    if (labelled === undefined || !this.isInvite(message)) return undefined;
    return { answer: labelled, message, via: "button" };
  }

  private isInvite(message: Element): boolean {
    if (message.querySelector(ICS)) return true;
    return [...message.querySelectorAll<HTMLAnchorElement>(REPLY_LINKS)].some(
      (link) => this.links.answer(link.href) !== undefined,
    );
  }
}
