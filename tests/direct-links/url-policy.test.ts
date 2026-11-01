import { WebOnly } from "../../src/direct-links/url-policy";

describe("WebOnly", () => {
  const policy = new WebOnly();

  it.each(["https://example.com/a?b=c#d", "http://example.com/"])(
    "accepts %s",
    (value) => {
      expect(policy.accept(value)?.href).toBe(value);
    },
  );

  it.each([
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "blob:https://example.com/abc",
    "file:///etc/passwd",
    "mailto:someone@example.com",
    "/relative/path",
    "not a url",
    "",
  ])("refuses %s", (value) => {
    expect(policy.accept(value)).toBeUndefined();
  });
});
