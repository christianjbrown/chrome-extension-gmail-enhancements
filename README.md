# Gmail Enhancements 📬

A little Chrome extension that smooths out the bits of Gmail that bug me. Right now that's one thing, but it's built to collect more. No options page, no button, no settings. It just quietly makes Gmail nicer.

## Enhancements ✨

- **Direct links.** Click a link in an email and you go straight there, instead of bouncing through Google's "Redirect Notice" page first. Hover a link and you see where it really goes, too. 🎯

## What direct links does 🔗

Gmail sends every link in an email through `https://www.google.com/url?q=...`, and sometimes stops you on a "Redirect Notice" page on the way. This rewrites the links before you click them:

- **Gmail's swap is switched off.** Gmail keeps the real address in the link and its redirect in a `data-saferedirecturl` attribute, then swaps the redirect in the moment you press the mouse. That attribute gets removed, so there's nothing to swap.
- **Wrapped links get unwrapped.** A link that is itself a `google.com/url?q=` (or `url=`) link is pointed at its target, with any encoded `&` or `#` decoded properly.
- **New messages too.** Gmail draws messages long after the page loads, so it keeps an eye on the page and fixes links as they show up.
- **Belt and braces.** Every click, middle click and right click on a link cleans it one more time, before Gmail's own handlers get a look in. So "Copy link address" copies the real one. 📋

What it leaves alone 🙅:

- **Anything that isn't a web page.** A redirect only gets unwrapped to an `http:` or `https:` address. One that points at `javascript:`, `data:` or anything else stays exactly as Gmail made it.
- **Every other link.** Ordinary links, Gmail's own buttons and anything outside `mail.google.com` aren't touched.

## Install it 🔧

You need [Node.js](https://nodejs.org) 22 or newer, and Chrome 126 or newer.

1. Grab the code and build it:

   ```bash
   git clone https://github.com/christianjbrown/chrome-extension-gmail-enhancements.git
   cd chrome-extension-gmail-enhancements
   npm ci
   npm run build
   ```

   That makes a `dist` folder, which is the actual extension.

2. Open `chrome://extensions` in Chrome.
3. Flip on **Developer mode** (top right).
4. Click **Load unpacked** and pick the `dist` folder.
5. Reload any Gmail tab you already had open.

### Updating 🔄

```bash
git pull
npm ci
npm run build
```

Then hit the reload arrow on the Christian's Gmail Enhancements card in `chrome://extensions`, and reload Gmail.

## Good to know 🤓

- **It asks for no permissions.** It only runs on `mail.google.com`, so Chrome will say it can read and change your data there, and that's the whole list.
- **You lose Google's warning page too.** The redirect is also where Gmail shows its "this link may be unsafe" page for links it doesn't trust. Once the links point straight at their targets, that page never gets a chance to appear, so a dodgy link in a dodgy email goes straight where it says. The same care you'd take anywhere else applies. ⚠️
- **Why not block the redirect page itself?** Chrome could redirect `www.google.com/url` requests, but that needs access to google.com as well, and it can't decode the target properly anyway. Fixing the links before you click covers it without asking for more.

## No tracking 🔒

No analytics, no tracking, no ads, no accounts, and nothing phoning home. It never talks to the internet at all, so nothing about your email leaves your machine. It reads link addresses on the page and rewrites them in place, and that's it.

## Hacking on it 🛠️

It's TypeScript, bundled with esbuild, tested with Vitest.

```bash
npm test          # the unit tests
npm run ci        # everything CI checks: format, lint, types, unused code, 100% coverage, build
```

`npm run ci` is exactly what CI runs, and coverage has to stay at 100% for lines, branches, functions and statements, or it fails. To run it before every push, point git at the committed hook: `git config core.hooksPath .githooks`.

How it fits together, all in `src`:

- **`main.ts`** builds every enhancement and starts it. It's the only file that touches `document`, `window` or `MutationObserver`.
- **`enhancement.ts`** is the one-method interface every enhancement implements.
- **`direct-links/`** is the first enhancement:
  - **`direct-links.ts`** starts the click guard, cleans what's on the page, then watches for more.
  - **`node-watcher.ts`** reports nodes Gmail adds and links whose `href` changes.
  - **`link-scanner.ts`** finds the links worth cleaning inside a node.
  - **`link-cleaner.ts`** strips `data-saferedirecturl` and unwraps a wrapped `href`.
  - **`google-redirect.ts`** turns a `google.com/url?q=` address back into its target.
  - **`url-policy.ts`** says which targets are allowed: `http:` and `https:` only.
  - **`click-guard.ts`** cleans a link again the instant it's pressed.

Every class gets its collaborators through its constructor, behind an interface, so each one is tested on its own with fakes. Adding the next enhancement means a new class and one more line in the list in `main.ts`. 🧩

## Licence 📄

MIT. See [LICENSE](LICENSE).
