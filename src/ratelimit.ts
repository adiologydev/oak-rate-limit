import { Context, Middleware } from "oak";
import type { RatelimitOptions } from "types";
import { DefaultOptions } from "utils";

export const RateLimiter = async (
  options?: Partial<RatelimitOptions>,
): Promise<Middleware> => {
  const opt = { ...DefaultOptions, ...options };

  await opt.store.init();

  if (typeof opt.onRateLimit !== "function") {
    throw "onRateLimit must be a function.";
  }
  if (typeof opt.skip !== "function") throw "skip must be a function.";

  return async (ctx: Context, next) => {
    const { ip } = ctx.request;
    const timestamp = Date.now();

    if (await opt.skip(ctx)) return next();
    if (opt.headers) {
      ctx.response.headers.set(
        "X-RateLimit-Limit",
        await opt.max(ctx).toString(),
      );
    }

    if (
      await opt.store.has(ip) &&
      timestamp - (await opt.store.get(ip)!).lastRequestTimestamp >
      opt.windowMs
    ) {
      opt.store.delete(ip);
    }
    if (!opt.store.has(ip)) {
      opt.store.set(ip, {
        remaining: await opt.max(ctx),
        lastRequestTimestamp: timestamp,
      });
    }

    if (await opt.store.has(ip) && (await opt.store.get(ip)!).remaining === 0) {
      await opt.onRateLimit(ctx, next, opt);
    } else {
      await next();
      if (opt.headers) {
        ctx.response.headers.set(
          "X-RateLimit-Remaining",
          opt.store.get(ip)
            ? (await opt.store.get(ip)!).remaining.toString()
            : await opt.max(ctx).toString(),
        );
      }
      opt.store.set(ip, {
        remaining: (await opt.store.get(ip)!).remaining - 1,
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
