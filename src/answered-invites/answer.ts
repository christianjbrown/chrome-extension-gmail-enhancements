// The three replies an invitation takes.
export const ANSWER = { yes: "yes", maybe: "maybe", no: "no" } as const;

export type Answer = (typeof ANSWER)[keyof typeof ANSWER];
