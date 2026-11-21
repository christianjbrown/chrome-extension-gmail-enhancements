// Unwraps a redirector's link back to the target, given where the redirector
// lives and how it carries the target.
import type { RedirectFormat } from "./google-redirect";
import type { Unwrapper } from "./unwrapper";
import type { UrlPolicy } from "./url-policy";

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
