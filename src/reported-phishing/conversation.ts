// The parts of a conversation the phishing cleanup reads.
import type { MenuButtons, MenuItems } from "./menu-parts";
import type { MessageLookup } from "./message-lookup";

export interface Conversation {
  messages: MessageLookup;
  buttons: MenuButtons;
  items: MenuItems;
}
