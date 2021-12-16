import { Store } from "../stores/AbstractStore.ts";

export interface Ratelimit {
    remaining: number;
    lastRequestTimestamp: number;
}

export interface RatelimitOptions {
    windowMs: number;
    max: number;
    store: Store;
}