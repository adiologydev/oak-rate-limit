import { connect } from "../../deps.ts";
import type { Ratelimit } from "../types/types.d.ts";
import { Store } from "./AbstractStore.ts";

type Bulk<T> = BulkString | BulkNil;
type BulkString = string;
type BulkNil = string;

export class RedisStore extends Store {
    private readonly store;

    constructor(hostname?: string, port?: number) {
        super();
        this.store = connect({
            hostname: hostname ?? "localhost",
            port
        })
    }

    public async get(ip: string) {
        const data = await (await this.store).get(ip)
        if (!data) return
        return JSON.parse(data)
    }

    public async set(ip: string, ratelimit: Ratelimit) {
        (await this.store).set(ip, JSON.stringify(ratelimit));
    }

    public async delete(ip: string) {
        (await this.store).del(ip);
    }

    public async has(ip: string) {
        return await (await this.store).exists(ip)
    }
}
