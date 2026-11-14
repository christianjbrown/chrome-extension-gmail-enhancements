import { SpamRoutes } from "../../src/reported-phishing/spam-routes";

describe("SpamRoutes", () => {
  const routes = new SpamRoutes();

  it.each(["#spam/FMfcgzAbc", "#spam/p2/FMfcgzAbc"])(
    "knows %s is a conversation in Spam",
    (route) => {
      expect(routes.conversation(route)).toBe(true);
    },
  );

  it.each([
    "#spam",
    "#spam/",
    "#inbox/FMfcgzAbc",
    "#search/spam/FMfcgzAbc",
    "",
  ])("knows %s is not", (route) => {
    expect(routes.conversation(route)).toBe(false);
  });

  it.each([
    ["#spam/FMfcgzAbc", "#spam"],
    ["#spam/p2/FMfcgzAbc", "#spam/p2"],
  ])("goes back from %s to %s", (route, list) => {
    expect(routes.list(route)).toBe(list);
  });
});
