// Works out whether a click answered an invitation, and how.
import type { Answer } from "./answer";
import type { ReplyLinks } from "./calendar-reply";
import type { EventCards } from "./event-card";
import { MESSAGE } from "./gmail-message";
import type { Labels } from "./rsvp-labels";

export interface Rsvp {
  answer: Answer;
  // The message holding the invitation.
  message: Element;
  // A Calendar reply link, or a control on one of Gmail's invite cards.
  via: "link" | "button";
}

export interface RsvpReader {
  read(target: EventTarget | null): Rsvp | undefined;
}

// Anything a person can press: a link, a real button, or one of Gmail's
// role="button" elements, which is what its invite card answers are.
const CONTROLS = "a[href], button, [role='button']";
// A toggle on Gmail's event card is its "Correct?" thumbs up or down, labelled
// Yes and No, asking whether it read the email right. Never an answer.
const TOGGLE = "[aria-pressed]";
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
    private readonly cards: EventCards,
  ) {}

  // The control is in the message, or on the event card Gmail draws above
  // it.
  read(target: EventTarget | null): Rsvp | undefined {
    const control = (target as Partial<Element> | null)?.closest?.(CONTROLS);
    if (!control) return undefined;
    const message = control.closest(MESSAGE) ?? this.onCard(control);
    return message ? this.reply(control, message) : undefined;
  }

  private onCard(control: Element): Element | undefined {
    return control.matches(TOGGLE) ? undefined : this.cards.message(control);
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
