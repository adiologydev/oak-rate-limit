import { Context } from "oak";
import { Store } from "stores";

export interface Ratelimit {
  remaining: number;
  lastRequestTimestamp: number;
}

export interface RatelimitOptions {
  windowMs: number;
  max: number;
  store: Store;
  headers: boolean;
  message: string;
  statusCode: number;
  skip: (ctx: Context) => Promise<boolean> | boolean;
  onRateLimit: (
    ctx: Context,
    next: () => Promise<unknown>,
    opt: RatelimitOptions,
  ) => unknown;
}
