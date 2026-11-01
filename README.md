# Gmail Enhancements Chrome Extension 📬

A little Chrome extension that smooths out the bits of Gmail that bug me. Right now that's two things, and it's built to collect more. No options page, no button, no settings. It just quietly makes Gmail nicer.

## Enhancements ✨

- **Direct links.** Click a link in an email and you go straight there, instead of bouncing through Google's "Redirect Notice" page first. Hover a link and you see where it really goes, too. 🎯
- **Answered invites tidy themselves away.** Reply Yes, Maybe or No to a meeting invite and the email goes to Bin by itself, the way Outlook does it. Your answer's in your calendar anyway, so the email was just clutter. 🗓️

## What direct links does 🔗

Gmail sends every link in an email through `https://www.google.com/url?q=...`, and sometimes stops you on a "Redirect Notice" page on the way. This rewrites the links before you click them:

- **Gmail's swap is switched off.** Gmail keeps the real address in the link and its redirect in a `data-saferedirecturl` attribute, then swaps the redirect in the moment you press the mouse. That attribute gets removed, so there's nothing to swap.
- **Wrapped links get unwrapped.** A link that is itself a `google.com/url?q=` (or `url=`) link is pointed at its target, with any encoded `&` or `#` decoded properly.
- **New messages too.** Gmail draws messages long after the page loads, so it keeps an eye on the page and fixes links as they show up.
- **Belt and braces.** Every click, middle click and right click on a link cleans it one more time, before Gmail's own handlers get a look in. So "Copy link address" copies the real one. 📋

What it leaves alone 🙅:

- **Anything that isn't a web page.** A redirect only gets unwrapped to an `http:` or `https:` address. One that points at `javascript:`, `data:` or anything else stays exactly as Gmail made it.
- **Every other link.** Ordinary links, Gmail's own buttons and anything outside `mail.google.com` aren't touched.

## What answered invites does 📅

Gmail keeps an invite in your inbox after you've replied to it. This bins it for you, once Gmail has actually recorded your reply:

- **Any reply counts.** Yes, Maybe and No all send the invite to Bin. Change your mind while a reply is still going through, and it goes by the newer one.
- **It waits for Gmail.** Pressing a button on Gmail's invite card isn't enough on its own. It waits until Gmail shows that answer as yours, and if that never happens (the reply failed, say), the email stays put. Clicking the Yes, Maybe or No link inside a Google Calendar invite opens Calendar, which records the reply, and that counts too.
- **Gmail's own Delete does the binning.** It presses the same Delete button you would, so the email lands in Bin and you get Gmail's usual Undo.
- **Conversation or reading pane, both work.** It uses the Delete for whatever you're looking at.

What it leaves alone 🙅:

- **Conversations with more than the invite.** Delete bins the whole conversation, so if there are replies, updates or anything else in there, nothing gets binned. You'd rather tidy one invite by hand than lose a reply.
- **Anything while you've got rows ticked in the list.** Gmail's Delete would bin those too, so it does nothing.
- **Invites you answer from the inbox list.** Only ones you open.

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
- **Any reply to an invite sends it to Bin, not into thin air.** Gmail keeps things in Bin for 30 days, so if you need an invite back, it's there. It uses English Gmail's button names, so in another language only the reply links inside Google Calendar invites work.
- **Why not block the redirect page itself?** Chrome could redirect `www.google.com/url` requests, but that needs access to google.com as well, and it can't decode the target properly anyway. Fixing the links before you click covers it without asking for more.

## No tracking 🔒

No analytics, no tracking, no ads, no accounts, and nothing phoning home. It never talks to the internet at all, so nothing about your email leaves your machine. It reads link addresses on the page and rewrites them in place, and presses Gmail's own Delete on an invite you've answered, and that's it.

## Development 🛠️

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
- **`answered-invites/`** bins invites you reply to:
  - **`answered-invites.ts`** hears every click and bins the invite once a reply is confirmed.
  - **`rsvp-reader.ts`** works out whether a click answered an invite, and with what.
  - **`calendar-reply.ts`** reads the answer a Google Calendar `action=RESPOND` link sends.
  - **`rsvp-labels.ts`** reads the answer off a Yes, Maybe or No button.
  - **`confirmation.ts`** and **`answer-state.ts`** wait until Gmail shows the reply as your answer.
  - **`invite-binner.ts`** presses Delete, using **`delete-finder.ts`** to find the right one, **`lone-invite.ts`** to check the invite is all it would bin, and **`presser.ts`** to press it.

Every class gets its collaborators through its constructor, behind an interface, so each one is tested on its own with fakes. Adding the next enhancement means a new class and one more line in the list in `main.ts`. 🧩

## Licence 📄

MIT. See [LICENSE](LICENSE).
