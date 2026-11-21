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
    return redirect === undefined ? undefined : this.fromRedirect(redirect);
  }

  private fromRedirect(url: URL): string | undefined {
    return this.isRedirect(url) ? this.target(url.searchParams) : undefined;
  }

  private isRedirect(url: URL): boolean {
    return (
      this.format.hosts.has(url.hostname) && url.pathname === this.format.path
    );
  }

  // URLSearchParams decodes the value, so an encoded & or # in the target
  // comes back as part of the target rather than splitting it. The first
  // parameter carrying an acceptable target wins.
  private target(parameters: URLSearchParams): string | undefined {
    return this.format.targets.reduce<string | undefined>(
      (found, name) => found ?? this.targetIn(parameters.get(name)),
      undefined,
    );
  }

  private targetIn(value: string | null): string | undefined {
    return value === null ? undefined : this.accepted(value);
  }

  private accepted(value: string): string | undefined {
    return this.policy.accept(value)?.href;
  }
}
