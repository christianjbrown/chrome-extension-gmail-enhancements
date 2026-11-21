// Where a redirector such as https://www.google.com/url?q=<target>, the one
// Gmail sends email links through, lives and which parameters carry the
// target.
import { GOOGLE, WWW_GOOGLE } from "../google-hosts";

// The parameters that carry the target are tried in order.
export interface RedirectFormat {
  hosts: ReadonlySet<string>;
  path: string;
  targets: readonly string[];
}

export const GOOGLE_REDIRECT: RedirectFormat = {
  hosts: new Set([GOOGLE, WWW_GOOGLE]),
  path: "/url",
  targets: ["q", "url"],
};

// Enough of Google's redirect address to spot one with a selector.
export const REDIRECT_MARK = GOOGLE + GOOGLE_REDIRECT.path;
