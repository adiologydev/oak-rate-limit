import type { Ratelimit } from "../types/types.d.ts";

export abstract class Store {
  public get(_ip: string): Ratelimit | Promise<Ratelimit> | undefined {
    throw "Not implemented";
  }

  public set(_ip: string, _ratelimit: Ratelimit): void | Promise<void> {
    throw "Not implemented";
  }

  public delete(_ip: string): void | Promise<void> {
    throw "Not implemented";
  }

  public has(_ip: string): boolean | Promise<boolean> {
    throw "Not implemented";
  }
}