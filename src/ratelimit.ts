import { Context, Middleware } from "../deps.ts";
import type { Ratelimit, RatelimitOptions } from "./types/types.d.ts";
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

    const getStoreItem = await opt.store.get(ip)!
    const checkStoreItem = await opt.store.has(ip)


    if (await opt.skip(ctx)) return next();
    if (opt.headers) {
      ctx.response.headers.set("X-RateLimit-Limit", opt.max.toString());
    }

    if (
      checkStoreItem &&
      timestamp - getStoreItem.lastRequestTimestamp > opt.windowMs
    ) {
      await opt.store.delete(ip);
    }
    if (!checkStoreItem) {
      await opt.store.set(ip, {
        remaining: opt.max,
        lastRequestTimestamp: timestamp,
      });
    }

    if (checkStoreItem && getStoreItem.remaining === 0) {
      opt.onRateLimit(ctx, next, opt);
    } else {
      await next();
      if (opt.headers) {
        ctx.response.headers.set(
          "X-RateLimit-Remaining",
          await opt.store.get(ip)
            ? getStoreItem.remaining.toString()
            : opt.max.toString(),
        );
      }
      await opt.store.set(ip, {
        remaining: getStoreItem.remaining - 1,
        lastRequestTimestamp: timestamp,
      });
    }
  };
};

export const onRateLimit = async (
  ctx: Context,
  _next: () => Promise<unknown>,
  opt: RatelimitOptions,
): Promise<unknown> => {
  await opt.store.set(ctx.request.ip, {
    remaining: 0,
    lastRequestTimestamp: Date.now(),
  });
  ctx.response.status = opt.statusCode;
  if (opt.headers) ctx.response.headers.set("X-RateLimit-Remaining", "0");
  return ctx.response.body = { error: opt.message };
};