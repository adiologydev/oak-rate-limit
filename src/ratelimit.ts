import { Context, Middleware } from "../deps.ts";
import type { RatelimitOptions } from "./types/types.d.ts";
import { DefaultOptions } from "./utils/defaults.ts";

export const RateLimiter = (
  options?: Partial<RatelimitOptions>,
): Middleware => {
  const opt = { ...DefaultOptions, ...options };

  if (typeof opt.onRateLimit !== "function") {
    throw "onRateLimit must be a function.";
  }
  if (typeof opt.skip !== "function") throw "skip must be a function.";

  return async (ctx: Context, next) => {
    const { ip } = ctx.request;
    const timestamp = Date.now();

    if (await opt.skip(ctx)) return next();
    if (opt.headers) {
      ctx.response.headers.set("X-RateLimit-Limit", opt.max.toString());
    }

    if (
      await opt.store.has(ip) &&
      timestamp - (await opt.store.get(ip)!).lastRequestTimestamp > opt.windowMs
    ) {
      opt.store.delete(ip);
    }
    if (!await opt.store.has(ip)) {
      opt.store.set(ip, {
        remaining: opt.max,
        lastRequestTimestamp: timestamp,
      });
    }

    if (await opt.store.has(ip) && (await opt.store.get(ip)!).remaining === 0) {
      opt.onRateLimit(ctx, next, opt);
    } else {
      await next();
      if (opt.headers) {
        ctx.response.headers.set(
          "X-RateLimit-Remaining",
          await opt.store.get(ip)
            ? (await opt.store.get(ip)!).remaining.toString()
            : opt.max.toString(),
        );
      }
      opt.store.set(ip, {
        remaining: (await opt.store.get(ip)!).remaining - 1,
        lastRequestTimestamp: timestamp,
      });
    }
  };
};

export const onRateLimit = (
  ctx: Context,
  _next: () => Promise<unknown>,
  opt: RatelimitOptions,
): unknown => {
  opt.store.set(ctx.request.ip, {
    remaining: 0,
    lastRequestTimestamp: Date.now(),
  });
  ctx.response.status = opt.statusCode;
  if (opt.headers) ctx.response.headers.set("X-RateLimit-Remaining", "0");
  return ctx.response.body = { error: opt.message };
};