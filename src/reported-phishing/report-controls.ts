// The places Gmail offers "Report phishing", such as a message's own menu and
// the warning box above a suspect message, and the dialog that confirms it.
import type { ReportDialog } from "./report-dialog";
import type { ReportPlace } from "./report-place";

export interface ReportControls {
  places: readonly ReportPlace[];
  dialog: ReportDialog;
}
