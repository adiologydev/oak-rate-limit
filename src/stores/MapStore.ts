import { Store } from "stores";
import type { Ratelimit } from "types";

export class MapStore extends Store {
  private readonly store: Map<string, Ratelimit>;

  constructor() {
    super();
    this.store = new Map<string, Ratelimit>();
  }

  public init() {
    return;
  }

  public get(ip: string) {
    return this.store.get(ip);
  }

  public set(ip: string, ratelimit: Ratelimit) {
    return this.store.set(ip, ratelimit);
  }

  public delete(ip: string) {
    return this.store.delete(ip);
  }

  public has(ip: string) {
    return this.store.has(ip);
  }
}
