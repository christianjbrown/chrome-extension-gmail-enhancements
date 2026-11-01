// Unwraps https://www.google.com/url?q=<target>, the redirector Gmail sends
// email links through, back to the target.
import type { UrlPolicy } from "./url-policy";

export interface Unwrapper {
  // The address the link really points at, or undefined to leave it alone.
  unwrap(href: string): string | undefined;
}

const HOSTS = new Set(["google.com", "www.google.com"]);
const TARGET_PARAMETERS = ["q", "url"];

export class GoogleRedirect implements Unwrapper {
  constructor(private readonly policy: UrlPolicy) {}

  unwrap(href: string): string | undefined {
    const redirect = this.policy.accept(href);
    if (
      redirect === undefined ||
      !HOSTS.has(redirect.hostname) ||
      redirect.pathname !== "/url"
    )
      return undefined;
    return this.target(redirect.searchParams);
  }

  // URLSearchParams decodes the value, so an encoded & or # in the target
  // comes back as part of the target rather than splitting it.
  private target(parameters: URLSearchParams): string | undefined {
    for (const name of TARGET_PARAMETERS) {
      const value = parameters.get(name);
      const target = value === null ? undefined : this.policy.accept(value);
      if (target !== undefined) return target.href;
    }
    return undefined;
  }
}
