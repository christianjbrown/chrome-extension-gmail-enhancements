// Unwraps a redirector's link, such as https://www.google.com/url?q=<target>,
// the one Gmail sends email links through, back to the target.
import { GOOGLE, WWW_GOOGLE } from "../google-hosts";
import type { UrlPolicy } from "./url-policy";

export interface Unwrapper {
  // The address the link really points at, or undefined to leave it alone.
  unwrap(href: string): string | undefined;
}

// Where a redirector lives and which parameters carry the target, tried in
// order.
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

export class RedirectUnwrapper implements Unwrapper {
  constructor(
    private readonly policy: UrlPolicy,
    private readonly format: RedirectFormat,
  ) {}

  unwrap(href: string): string | undefined {
    const redirect = this.policy.accept(href);
    if (
      redirect === undefined ||
      !this.format.hosts.has(redirect.hostname) ||
      redirect.pathname !== this.format.path
    )
      return undefined;
    return this.target(redirect.searchParams);
  }

  // URLSearchParams decodes the value, so an encoded & or # in the target
  // comes back as part of the target rather than splitting it.
  private target(parameters: URLSearchParams): string | undefined {
    for (const name of this.format.targets) {
      const value = parameters.get(name);
      const target = value === null ? undefined : this.policy.accept(value);
      if (target !== undefined) return target.href;
    }
    return undefined;
  }
}
