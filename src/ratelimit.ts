import { Middleware, Context } from "../deps.ts";
import { MapStore } from "./stores/mapStore.ts";
import type { RatelimitOptions } from "./types/types.d.ts";

export const RateLimiter = (options: RatelimitOptions): Middleware => {
    Object.assign(options, {
        windowMs: options.windowMs || "60000",
        max: options.max || "10",
        store: options.store || new MapStore(),
    });

    return async (ctx: Context, next) => {
        const { ip } = ctx.request;
        const timestamp = Date.now();

        ctx.response.headers.set("X-RateLimit-Limit", options.max.toString());

        if (options.store.has(ip) && timestamp - options.store.get(ip)!.lastRequestTimestamp > options.windowMs) options.store.delete(ip);
        if (!options.store.has(ip)) options.store.set(ip, { remaining: options.max, lastRequestTimestamp: timestamp });

        if (options.store.has(ip) && options.store.get(ip)!.remaining === 0) {
            options.store.set(ip, { remaining: 0, lastRequestTimestamp: timestamp });
            ctx.response.status = 429;
            ctx.response.headers.set("X-RateLimit-Remaining", "0");
            return ctx.response.body = { error: "Too many requests" };
        } else {
            await next();
            options.store.set(ip, { remaining: options.store.get(ip)!.remaining - 1, lastRequestTimestamp: timestamp });
            return ctx.response.headers.set("X-RateLimit-Remaining", options.store.get(ip) ? options.store.get(ip)!.remaining.toString() : options.max.toString());
        }
    }
}