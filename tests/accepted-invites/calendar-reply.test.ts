import { CalendarReplyLink } from "../../src/accepted-invites/calendar-reply";
import { GoogleRedirect } from "../../src/direct-links/google-redirect";
import { WebOnly } from "../../src/direct-links/url-policy";

const reply =
  "https://calendar.google.com/calendar/event?action=RESPOND&eid=abc";

describe("CalendarReplyLink", () => {
  const webOnly = new WebOnly();
  const links = new CalendarReplyLink(new GoogleRedirect(webOnly), webOnly);

  it.each([
    ["1", "yes"],
    ["2", "no"],
    ["3", "maybe"],
  ])("reads rst=%s as %s", (rst, answer) => {
    expect(links.answer(`${reply}&rst=${rst}`)).toBe(answer);
  });

  it.each([
    "https://www.google.com/calendar/event?action=RESPOND&rst=1",
    "https://google.com/calendar/event?action=respond&rst=1",
    "https://calendar.google.com/calendar/u/1/event?action=RESPOND&rst=1",
  ])("knows the older host, second accounts and any case: %s", (href) => {
    expect(links.answer(href)).toBe("yes");
  });

  it("reads a link still wrapped in Google's redirect", () => {
    const wrapped =
      "https://www.google.com/url?q=" + encodeURIComponent(reply + "&rst=1");

    expect(links.answer(wrapped)).toBe("yes");
  });

  it.each([
    [
      "another action",
      "https://calendar.google.com/calendar/event?action=VIEW&rst=1",
    ],
    ["no action", "https://calendar.google.com/calendar/event?rst=1"],
    ["no reply", reply],
    ["an unknown reply", `${reply}&rst=4`],
    [
      "another page",
      "https://calendar.google.com/calendar/r?action=RESPOND&rst=1",
    ],
    [
      "another site",
      "https://calendar.example.com/calendar/event?action=RESPOND&rst=1",
    ],
    ["not a web address", "javascript:alert(1)"],
    ["not an address", "Yes"],
  ])("ignores %s", (_case, href) => {
    expect(links.answer(href)).toBeUndefined();
  });
});
