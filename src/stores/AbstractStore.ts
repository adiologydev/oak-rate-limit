import { Bulk } from "https://deno.land/x/redis@v0.25.0/mod.ts";
import type { Ratelimit } from "../types/types.d.ts";

export abstract class Store {
  public get(_ip: string): Ratelimit | Promise<Ratelimit | undefined> | undefined {
    throw "Not implemented";
  }

  public set(_ip: string, _ratelimit: Ratelimit): void {
    throw "Not implemented";
  }

  public delete(_ip: string): void {
    throw "Not implemented";
  }

  public has(_ip: string): boolean | Promise<number> {
    throw "Not implemented";
  }
}
