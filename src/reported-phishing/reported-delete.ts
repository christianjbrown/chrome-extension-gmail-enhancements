// Deletes a message once Gmail shows it has the report for it.
export interface ReportedDelete {
  delete(message: Element): Promise<void>;
}
