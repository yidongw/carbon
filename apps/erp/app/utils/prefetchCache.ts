import { useSyncExternalStore } from "react";

class PrefetchCache {
  private ids = new Set<string>();
  private version = 0;
  private listeners = new Set<() => void>();

  add(id: string) {
    if (!this.ids.has(id)) {
      this.ids.add(id);
      this.version++;
      this.listeners.forEach((fn) => fn());
    }
  }

  has(id: string) {
    return this.ids.has(id);
  }

  getVersion() {
    return this.version;
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const partPrefetchCache = new PrefetchCache();
export const jobPrefetchCache = new PrefetchCache();

export function usePrefetchCache(cache: PrefetchCache) {
  useSyncExternalStore(
    (fn) => cache.subscribe(fn),
    () => cache.getVersion(),
    () => 0
  );
  return cache;
}
