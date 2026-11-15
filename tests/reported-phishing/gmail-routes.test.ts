import { GmailRoutes } from "../../src/reported-phishing/gmail-routes";

describe("GmailRoutes", () => {
  const routes = new GmailRoutes();
  const id = "FMfcgzAbcdefGhijkLmnopQrstuvWxyz";

  it.each([
    `#spam/${id}`,
    `#spam/p2/${id}`,
    `#inbox/${id}`,
    `#label/Receipts/${id}`,
    `#search/spam/${id}`,
    "#inbox/18c0ffee12345678",
  ])("knows %s is a conversation", (route) => {
    expect(routes.conversation(route)).toBe(true);
  });

  it.each(["#spam", "#spam/", "#spam/p2", "#label/Receipts", "#inbox", ""])(
    "knows %s is not",
    (route) => {
      expect(routes.conversation(route)).toBe(false);
    },
  );

  it.each([
    [`#spam/${id}`, "#spam"],
    [`#spam/p2/${id}`, "#spam/p2"],
    [`#inbox/${id}`, "#inbox"],
    [`#label/Receipts/${id}`, "#label/Receipts"],
  ])("goes back from %s to %s", (route, list) => {
    expect(routes.list(route)).toBe(list);
  });

  it.each([
    [`#inbox/${id}`, `#spam/${id}`],
    [`#spam/p2/${id}`, `#spam/${id}`],
    [`#label/Receipts/${id}`, `#spam/${id}`],
  ])("finds %s in Spam at %s", (route, spam) => {
    expect(routes.inSpam(route)).toBe(spam);
  });
});
