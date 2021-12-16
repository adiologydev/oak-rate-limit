import { Middleware, Context } from "../deps.ts";
import type { RatelimitOptions } from "./types/types.d.ts";
import { DefaultOptions } from "./utils/defaults.ts";

export const RateLimiter = (options?: Partial<RatelimitOptions>): Middleware => {
    const opt = { ...DefaultOptions, ...options };

    if(typeof opt.onRateLimit !== "function") throw "onRateLimit must be a function.";

    return async (ctx: Context, next) => {
        const { ip } = ctx.request;
        const timestamp = Date.now();

        if(opt.headers) ctx.response.headers.set("X-RateLimit-Limit", opt.max.toString());

        if (opt.store.has(ip) && timestamp - opt.store.get(ip)!.lastRequestTimestamp > opt.windowMs) opt.store.delete(ip);
        if (!opt.store.has(ip)) opt.store.set(ip, { remaining: opt.max, lastRequestTimestamp: timestamp });

        if (opt.store.has(ip) && opt.store.get(ip)!.remaining === 0) opt.onRateLimit(ctx, next, opt);
        else {
            await next();
            if(opt.headers) ctx.response.headers.set("X-RateLimit-Remaining", opt.store.get(ip) ? opt.store.get(ip)!.remaining.toString() : opt.max.toString());
            opt.store.set(ip, { remaining: opt.store.get(ip)!.remaining - 1, lastRequestTimestamp: timestamp });
        }
    }
}

export const onRateLimit = (ctx: Context, next: () => Promise<unknown>, opt: RatelimitOptions): unknown => {
    opt.store.set(ctx.request.ip, { remaining: 0, lastRequestTimestamp: Date.now() });
    ctx.response.status = opt.statusCode;
    if(opt.headers) ctx.response.headers.set("X-RateLimit-Remaining", "0");
    return ctx.response.body = { error: opt.message };
}