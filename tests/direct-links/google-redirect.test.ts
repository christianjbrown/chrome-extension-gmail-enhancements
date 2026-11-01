import { GoogleRedirect } from "../../src/direct-links/google-redirect";
import { WebOnly } from "../../src/direct-links/url-policy";

const usnews =
  "https://www.usnews.com/news/world/articles/2026-10-31/uk-pm-burnham-says-he-is-open-to-formal-apology-for-slavery-but-rules-out-reparations";

describe("GoogleRedirect", () => {
  const unwrapper = new GoogleRedirect(new WebOnly());

  it("unwraps the redirect Gmail sends links through", () => {
    expect(
      unwrapper.unwrap(
        `https://www.google.com/url?q=${usnews}&source=gmail&ust=1793610735485000&sa=E&sec_src=gmail`,
      ),
    ).toBe(usnews);
  });

  it("decodes an encoded target, keeping its own & and #", () => {
    expect(
      unwrapper.unwrap(
        "https://www.google.com/url?q=https%3A%2F%2Fexample.com%2Fp%3Fa%3D1%26b%3D2%23top&source=gmail",
      ),
    ).toBe("https://example.com/p?a=1&b=2#top");
  });

  it("reads url= when there is no q=", () => {
    expect(
      unwrapper.unwrap(
        "https://google.com/url?sa=t&url=http%3A%2F%2Fexample.com%2F",
      ),
    ).toBe("http://example.com/");
  });

  it("falls back to url= when q= is not a web address", () => {
    expect(
      unwrapper.unwrap(
        "https://www.google.com/url?q=javascript:alert(1)&url=https://example.com/",
      ),
    ).toBe("https://example.com/");
  });

  it.each([
    [
      "a javascript: target",
      "https://www.google.com/url?q=javascript:alert(1)",
    ],
    [
      "an encoded javascript: target",
      "https://www.google.com/url?q=javascript%3Aalert(document.cookie)",
    ],
    ["a data: target", "https://www.google.com/url?q=data:text/html,hi"],
    ["a relative target", "https://www.google.com/url?q=/search"],
    ["no target", "https://www.google.com/url?source=gmail"],
    ["another Google path", "https://www.google.com/search?q=https://a.com/"],
    ["another host", "https://evil.example/url?q=https://a.com/"],
    [
      "a lookalike host",
      "https://www.google.com.evil.example/url?q=https://a.com/",
    ],
    ["an ordinary link", "https://example.com/url?q=https://a.com/"],
    ["a mailto: link", "mailto:someone@example.com"],
    ["a relative href", "#inbox"],
  ])("leaves %s alone", (_, href) => {
    expect(unwrapper.unwrap(href)).toBeUndefined();
  });
});
