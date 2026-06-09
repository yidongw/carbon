import { useSyncExternalStore } from "react";
import { path } from "~/utils/path";

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

const MAX_CONCURRENT_PREFETCHES = 3;
const prefetchQueue: string[] = [];
const prefetchInFlight = new Set<string>();
const prefetchCompleted = new Set<string>();
let activePrefetches = 0;

function drainPrefetchQueue(load: (href: string) => void) {
  while (activePrefetches < MAX_CONCURRENT_PREFETCHES && prefetchQueue.length > 0) {
    const itemId = prefetchQueue.shift()!;
    if (prefetchCompleted.has(itemId) || partPrefetchCache.has(itemId)) continue;
    activePrefetches++;
    prefetchInFlight.add(itemId);
    load(path.to.partDetails(itemId));
  }
}

/** Queue a part detail route for active loader prefetch (throttled). */
export function queuePartPrefetch(
  itemId: string,
  load: (href: string) => void
) {
  if (
    prefetchCompleted.has(itemId) ||
    partPrefetchCache.has(itemId) ||
    prefetchInFlight.has(itemId) ||
    prefetchQueue.includes(itemId)
  ) {
    return;
  }
  prefetchQueue.push(itemId);
  drainPrefetchQueue(load);
}

/** Bump a part to the front of the prefetch queue (e.g. on hover). */
export function prioritizePartPrefetch(
  itemId: string,
  load: (href: string) => void
) {
  if (prefetchCompleted.has(itemId) || partPrefetchCache.has(itemId)) return;
  const idx = prefetchQueue.indexOf(itemId);
  if (idx > 0) {
    prefetchQueue.splice(idx, 1);
    prefetchQueue.unshift(itemId);
  } else if (idx === -1 && !prefetchInFlight.has(itemId)) {
    prefetchQueue.unshift(itemId);
  }
  drainPrefetchQueue(load);
}

/** Call when a prefetch fetcher returns to idle. */
export function completePartPrefetch(itemId: string, load: (href: string) => void) {
  prefetchInFlight.delete(itemId);
  prefetchCompleted.add(itemId);
  partPrefetchCache.add(itemId);
  activePrefetches = Math.max(0, activePrefetches - 1);
  drainPrefetchQueue(load);
}
