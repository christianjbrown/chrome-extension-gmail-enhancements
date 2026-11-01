// Somewhere page events can be heard from. main.ts hands over the window.
export interface EventSource {
  addEventListener(
    type: string,
    listener: (event: Event) => void,
    options: AddEventListenerOptions,
  ): void;
}
