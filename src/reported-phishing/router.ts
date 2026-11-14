// Where Gmail is, and a way to send it somewhere else. main.ts hands over the
// window's location.
import type { RoutePolicy } from "./spam-routes";

export interface Router {
  current(): string;
  go(route: string): void;
}

// Where Gmail is, and what its addresses mean.
export interface Navigation {
  router: Router;
  routes: RoutePolicy;
}
