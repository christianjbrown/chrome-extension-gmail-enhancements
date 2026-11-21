import { ConversationReports } from "../../src/reported-phishing/conversation-reports";

describe("ConversationReports", () => {
  const conversation = "#inbox/FMfcgzAbcdefGhijkLmnopQrstuvWxyz";

  function rule(route: string, isConversation: boolean) {
    return new ConversationReports({
      router: { current: () => route },
      routes: { conversation: (at) => at === route && isConversation },
    });
  }

  function message(id?: string): Element {
    const element = document.createElement("div");
    if (id !== undefined) element.setAttribute("data-message-id", id);
    return element;
  }

  it("reports a message from an open conversation", () => {
    expect(rule(conversation, true).report(message("#msg-f:1"))).toEqual({
      route: conversation,
      messageId: "#msg-f:1",
    });
  });

  it("counts nothing made with no conversation open", () => {
    expect(rule("#inbox", false).report(message("#msg-f:1"))).toBeUndefined();
  });

  it("counts nothing for a message with no id", () => {
    expect(rule(conversation, true).report(message())).toBeUndefined();
  });
});
