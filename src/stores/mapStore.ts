import type { Ratelimit } from "../types/types.d.ts";
import { Store } from "./AbstractStore.ts";

export class MapStore extends Store {
    private readonly store: Map<string, Ratelimit>;

    constructor() {
        super();
        this.store = new Map<string, Ratelimit>();
    }

    public get(ip: string) {
        return this.store.get(ip);
    }

    public set(ip: string, ratelimit: Ratelimit) {
        this.store.set(ip, ratelimit);
    }

    public delete(ip: string) {
        this.store.delete(ip);
    }

    public has(ip: string) {
        return this.store.has(ip);
    }
}