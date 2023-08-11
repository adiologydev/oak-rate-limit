import { MapStore } from "stores";
import { RatelimitOptions } from "types";
import { onRateLimit } from "../ratelimit.ts";

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
