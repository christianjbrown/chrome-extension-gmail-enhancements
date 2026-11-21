// A phishing report Gmail has confirmed, and what happens after one.
export interface Report {
  // The address of the conversation the report was made from.
  route: string;
  // The id of the message reported.
  messageId: string;
}

export interface Cleanup {
  afterReport(report: Report): Promise<void>;
}
