import {
    connect,
    RedisConnectOptions,
} from "https://deno.land/x/redis@v0.25.0/mod.ts";
import type { Ratelimit } from "../types/types.d.ts";
import { Store } from "./AbstractStore.ts";

export class RedisStore extends Store {
    private readonly store;

    constructor(options: RedisConnectOptions) {
        super();
        this.store = connect({
            hostname: options.hostname,
            port: options.port,
            tls: options.tls,
            db: options.db,
            password: options.password,
            name: options.name,
            maxRetryCount: options.maxRetryCount,
            retryInterval: options.retryInterval,
        });
    }

    public async get(ip: string) {
        const data = await (await this.store).get(ip);
        if (!data) return;
        return JSON.parse(data);
    }

    public async set(ip: string, ratelimit: Ratelimit) {
        const newRatelimit = await (
            await this.store
        ).set(ip, JSON.stringify(ratelimit));
        return JSON.parse(newRatelimit);
    }

    public async delete(ip: string) {
        const value = Boolean((await this.store).del(ip));
        return value;
    }

    public async has(ip: string) {
        const value = Boolean((await this.store).exists(ip));
        return value;
    }
}
