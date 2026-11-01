import { CalendarReplyLink } from "../../src/answered-invites/calendar-reply";
import { RsvpLabels } from "../../src/answered-invites/rsvp-labels";
import { InviteRsvps } from "../../src/answered-invites/rsvp-reader";
import { GoogleRedirect } from "../../src/direct-links/google-redirect";
import { WebOnly } from "../../src/direct-links/url-policy";

const respond = "https://calendar.google.com/calendar/event?action=RESPOND";

function page(markup: string): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = markup;
  return root;
}

const invite = page(`
  <div id="message" data-message-id="#msg-f:1">
    <div role="button" id="card-yes"><span id="card-yes-text">Yes</span></div>
    <div role="button" id="card-maybe">Maybe</div>
    <div role="button" id="card-other">Show details</div>
    <a id="link-yes" href="${respond}&rst=1">Yes</a>
    <a id="link-no" href="${respond}&rst=2">No</a>
    <a id="other" href="https://example.com/">Agenda</a>
    <p id="text">You have been invited</p>
  </div>
`);

function at(root: HTMLElement, id: string): Element {
  return root.querySelector(`#${id}`)!;
}

describe("InviteRsvps", () => {
  const webOnly = new WebOnly();
  const reader = new InviteRsvps(
    new CalendarReplyLink(new GoogleRedirect(webOnly), webOnly),
    new RsvpLabels(),
  );
  const message = at(invite, "message");

  it("reads a Calendar reply link", () => {
    expect(reader.read(at(invite, "link-yes"))).toEqual({
      answer: "yes",
      message,
      via: "link",
    });
    expect(reader.read(at(invite, "link-no"))?.answer).toBe("no");
  });

  it("reads Gmail's invite card, from wherever in the button the click lands", () => {
    expect(reader.read(at(invite, "card-yes-text"))).toEqual({
      answer: "yes",
      message,
      via: "button",
    });
    expect(reader.read(at(invite, "card-maybe"))?.answer).toBe("maybe");
  });

  it("ignores other controls and text in an invitation", () => {
    for (const id of ["card-other", "other", "text"])
      expect(reader.read(at(invite, id))).toBeUndefined();
  });

  it("ignores a Yes button in a message that is not an invitation", () => {
    const root = page(`
      <div data-legacy-message-id="2">
        <a href="${respond}">Calendar</a>
        <button>Yes</button>
      </div>`);

    expect(reader.read(root.querySelector("button"))).toBeUndefined();
  });

  it.each([
    `<span download_url="text/calendar:invite.ics:https://mail.google.com/x"></span>`,
    `<span aria-label="Attachment: invite.ics"></span>`,
  ])("takes an .ics attachment as an invitation: %s", (attachment) => {
    const root = page(
      `<div data-message-id="3">${attachment}<button>Yes</button></div>`,
    );

    expect(reader.read(root.querySelector("button"))?.via).toBe("button");
  });

  it("ignores a reply link outside any message", () => {
    const root = page(`<a href="${respond}&rst=1">Yes</a>`);

    expect(reader.read(root.querySelector("a"))).toBeUndefined();
  });

  it("ignores targets that are not elements", () => {
    expect(reader.read(null)).toBeUndefined();
    expect(reader.read(document.createTextNode("Yes"))).toBeUndefined();
  });
});
