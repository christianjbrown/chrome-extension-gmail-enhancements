// A place Gmail offers "Report phishing".
export interface ReportPlace {
  // The message a press there reports, or undefined when it reports none.
  reported(control: Element): Element | undefined;
}
