// The content script: builds every enhancement and starts it. Nothing else
// touches the page's globals.
import { ClickGuard } from "./direct-links/click-guard";
import { DirectLinks } from "./direct-links/direct-links";
import { GoogleRedirect } from "./direct-links/google-redirect";
import { LinkCleaner } from "./direct-links/link-cleaner";
import { LinkScanner } from "./direct-links/link-scanner";
import { NodeWatcher } from "./direct-links/node-watcher";
import { WebOnly } from "./direct-links/url-policy";
import type { Enhancement } from "./enhancement";

function directLinks(): Enhancement {
  const webOnly = new WebOnly();
  const cleaner = new LinkCleaner(new GoogleRedirect(webOnly), webOnly);
  return new DirectLinks(
    document,
    new LinkScanner(cleaner),
    new NodeWatcher((callback) => new MutationObserver(callback), document, [
      "href",
      "data-saferedirecturl",
    ]),
    new ClickGuard(window, cleaner),
  );
}

// A new enhancement is a new class and a new line here.
const enhancements: Enhancement[] = [directLinks()];

for (const enhancement of enhancements) enhancement.start();
