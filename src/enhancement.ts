// One Gmail tweak. Each is independent of the others, and main.ts starts them
// all once, as the page loads.
export interface Enhancement {
  start(): void;
}
