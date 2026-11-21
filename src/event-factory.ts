// Makes a page event of a given type. main.ts hands over one that makes real
// mouse events.
export type EventFactory = (type: string) => Event;
