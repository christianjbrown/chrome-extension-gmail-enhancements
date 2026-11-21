// Where Gmail is, and a way to send it somewhere else. main.ts hands over the
// window's location.
import type { ConversationRoutes, SpamRoutes } from "./routes";

interface RouteReader {
  current(): string;
}

export interface Router extends RouteReader {
  go(route: string): void;
}

// Where Gmail is, and whether that is an open conversation.
export interface ConversationNavigation {
  router: RouteReader;
  routes: ConversationRoutes;
}

// Where Gmail is, and how to get from a conversation to its copy in Spam.
export interface SpamNavigation {
  router: Router;
  routes: SpamRoutes;
}
