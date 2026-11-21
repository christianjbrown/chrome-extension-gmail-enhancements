// Moves an answered invitation's conversation to Bin.
export interface Binner {
  bin(message: Element): void;
}
