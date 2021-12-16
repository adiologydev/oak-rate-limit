import { RatelimitOptions } from "../types/types.d.ts";
import { MapStore } from "../stores/mapStore.ts";

export const DefaultOptions: RatelimitOptions = {
    windowMs: 60 * 1000,
    max: 100,
    store: new MapStore()
}