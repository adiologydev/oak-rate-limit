import type { Ratelimit } from "../types/types.d.ts";

export abstract class Store {

    public get(_ip: string): Ratelimit | undefined {
        throw "Not implemented";
    }

    public set(_ip: string, _ratelimit: Ratelimit): void {
        throw "Not implemented";
    }

    public delete(_ip: string): void {
        throw "Not implemented";
    }

    public has(_ip: string): boolean {
        throw "Not implemented";
    }
}