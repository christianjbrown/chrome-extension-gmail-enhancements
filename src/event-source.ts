// Somewhere page events can be heard from. main.ts hands over the window.
export interface EventSource {
  addEventListener(
    type: string,
    listener: (event: Event) => void,
    options: AddEventListenerOptions,
  ): void;
}

// Listening in the capture phase hears a press before any of Gmail's own
// handlers can act on it or stop it.
export const BEFORE_GMAIL: AddEventListenerOptions = { capture: true };
