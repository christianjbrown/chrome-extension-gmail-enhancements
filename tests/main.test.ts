// Loads the content script into jsdom's page and checks every enhancement
// works through the real wiring.
const target = "https://example.com/story?a=1&b=2#top";
const redirect = `https://www.google.com/url?q=${encodeURIComponent(target)}&source=gmail`;

async function load() {
  vi.resetModules();
  document.body.innerHTML = `<a id="early" href="${target}" data-saferedirecturl="${redirect}">early</a>`;
  await import("../src/main");
}

describe("content script", () => {
  it("cleans links already on the page", async () => {
    await load();

    const early = document.getElementById("early")!;
    expect(early.hasAttribute("data-saferedirecturl")).toBe(false);
  });

  it("cleans a message Gmail renders after load", async () => {
    await load();

    document.body.insertAdjacentHTML(
      "beforeend",
      `<div><a id="late" href="${redirect}" data-saferedirecturl="${redirect}">late</a></div>`,
    );

    const late = document.getElementById("late")!;
    await vi.waitFor(() => {
      expect(late.getAttribute("href")).toBe(target);
    });
    expect(late.hasAttribute("data-saferedirecturl")).toBe(false);
  });

  it("cleans a link Gmail rewrites just before the click", async () => {
    await load();
    const early = document.getElementById("early")!;
    early.setAttribute("href", redirect);
    early.addEventListener("click", (event) => {
      event.preventDefault();
    });

    early.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    );

    expect(early.getAttribute("href")).toBe(target);
  });
});
