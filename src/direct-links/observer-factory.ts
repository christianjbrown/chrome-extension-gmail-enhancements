// Makes the browser's MutationObserver. main.ts hands over the real one.
export type ObserverFactory = (callback: MutationCallback) => MutationObserver;
