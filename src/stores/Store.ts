import type { Ratelimit } from "../types/types.d.ts";

export class Store {

    public get(ip: string): Ratelimit | undefined {
        throw "Not implemented";
    }

    public set(ip: string, ratelimit: Ratelimit): void {
        throw "Not implemented";
    }

    public delete(ip: string): void {
        throw "Not implemented";
    }

    public has(ip: string): boolean {
        throw "Not implemented";
    }
}