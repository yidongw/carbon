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

function createPrefetchQueue(cache: PrefetchCache, toHref: (id: string) => string) {
  const queue: string[] = [];
  const inFlight = new Set<string>();
  const completed = new Set<string>();
  let active = 0;

  function drain(load: (href: string) => void) {
    while (active < MAX_CONCURRENT_PREFETCHES && queue.length > 0) {
      const id = queue.shift()!;
      if (completed.has(id) || cache.has(id)) continue;
      active++;
      inFlight.add(id);
      load(toHref(id));
    }
  }

  return {
    queue(id: string, load: (href: string) => void) {
      if (
        completed.has(id) ||
        cache.has(id) ||
        inFlight.has(id) ||
        queue.includes(id)
      ) {
        return;
      }
      queue.push(id);
      drain(load);
    },
    prioritize(id: string, load: (href: string) => void) {
      if (completed.has(id) || cache.has(id)) return;
      const idx = queue.indexOf(id);
      if (idx > 0) {
        queue.splice(idx, 1);
        queue.unshift(id);
      } else if (idx === -1 && !inFlight.has(id)) {
        queue.unshift(id);
      }
      drain(load);
    },
    complete(id: string, load: (href: string) => void) {
      inFlight.delete(id);
      completed.add(id);
      cache.add(id);
      active = Math.max(0, active - 1);
      drain(load);
    }
  };
}

// Prefetch the details route so the parent loader (including used-in groups)
// and child clientLoaders populate caches before navigation.
const partQueue = createPrefetchQueue(partPrefetchCache, path.to.partDetails);
const jobQueue = createPrefetchQueue(jobPrefetchCache, path.to.job);

export const queuePartPrefetch = partQueue.queue;
export const prioritizePartPrefetch = partQueue.prioritize;
export const completePartPrefetch = partQueue.complete;

export const queueJobPrefetch = jobQueue.queue;
export const prioritizeJobPrefetch = jobQueue.prioritize;
export const completeJobPrefetch = jobQueue.complete;
