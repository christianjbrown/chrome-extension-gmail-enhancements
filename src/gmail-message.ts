// Gmail wraps each message it shows, in a full conversation or in the reading
// pane, in an element carrying the message's id. Gmail's own scripts read
// these attributes, so they survive the class name churn that comes with every
// build, and extensions have keyed off them for years.
export const MESSAGE_ID = "data-message-id";
const LEGACY_MESSAGE_ID = "data-legacy-message-id";
export const MESSAGE = `[${MESSAGE_ID}], [${LEGACY_MESSAGE_ID}]`;
