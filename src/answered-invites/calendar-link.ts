// What a Google Calendar invitation's reply link looks like. Every invitation
// Calendar emails carries Yes, Maybe and No links of the form
// .../calendar/event?action=RESPOND&rst=<n>, a format that has outlived every
// Gmail redesign, so it is the most stable sign of an invite there is.
import { CALENDAR, GOOGLE, WWW_GOOGLE } from "../google-hosts";
import { ANSWER, type Answer } from "./answer";

export const HOSTS: ReadonlySet<string> = new Set([
  CALENDAR,
  WWW_GOOGLE,
  GOOGLE,
]);
// /calendar/event, or /calendar/u/1/event from a second signed-in account.
export const PATH = /^\/calendar\/(?:u\/\d+\/)?event$/;
export const ACTION = "action";
// The action every reply link carries, whatever the answer.
export const RESPOND = "RESPOND";
// Calendar's code for the answer, in the rst parameter.
export const REPLY = "rst";
export const REPLIES: ReadonlyMap<string, Answer> = new Map([
  ["1", ANSWER.yes],
  ["2", ANSWER.no],
  ["3", ANSWER.maybe],
]);
