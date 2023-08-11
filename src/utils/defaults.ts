import { onRateLimit } from "../ratelimit.ts";
import { MapStore } from "../stores/MapStore.ts";
import { RatelimitOptions } from "../types/types.d.ts";

export const DefaultOptions: RatelimitOptions = {
  windowMs: 60 * 1000,
  max: () => 100,
  store: new MapStore(),
  headers: true,
  message: "Too many requests, please try again later.",
  statusCode: 429,
  skip: () => false,
  onRateLimit: (ctx, next, opt) => onRateLimit(ctx, next, opt),
};
