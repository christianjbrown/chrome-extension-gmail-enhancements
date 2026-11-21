// The attributes that say where one of Gmail's links goes.
import { HREF } from "../dom";

// Gmail keeps the real address in href and its redirect here, and swaps the
// redirect in on mousedown. Without it there is nothing to swap.
export const SAFE_REDIRECT = "data-saferedirecturl";
// Either changing means the link needs cleaning again.
export const LINK_ATTRIBUTES = [HREF, SAFE_REDIRECT];
