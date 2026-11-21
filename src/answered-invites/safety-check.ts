// Says whether binning the conversation would take only the invitation.
export interface SafetyCheck {
  onlyInvite(message: Element, view: Element): boolean;
}
