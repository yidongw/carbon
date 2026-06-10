import { partPrefetchCache } from "~/utils/prefetchCache";

const CACHE_TTL_MS = 5 * 60_000;

const cache = new Map<string, { data: unknown; ts: number }>();
const readyListeners = new Map<string, Set<() => void>>();

export function getPartRouteCache<T>(itemId: string): T | null {
  const hit = cache.get(itemId);
  if (!hit || Date.now() - hit.ts >= CACHE_TTL_MS) return null;
  return hit.data as T;
}

export function setPartRouteCache(itemId: string, data: unknown) {
  cache.set(itemId, { data, ts: Date.now() });
  partPrefetchCache.add(itemId);
  readyListeners.get(itemId)?.forEach((cb) => cb());
  readyListeners.delete(itemId);
}

export function onPartRouteCacheReady(itemId: string, cb: () => void) {
  if (hasPartRouteCache(itemId)) {
    cb();
    return () => {};
  }
  if (!readyListeners.has(itemId)) {
    readyListeners.set(itemId, new Set());
  }
  readyListeners.get(itemId)!.add(cb);
  return () => {
    readyListeners.get(itemId)?.delete(cb);
  };
}

export function clearPartRouteCache(itemId: string) {
  cache.delete(itemId);
}

export function hasPartRouteCache(itemId: string) {
  return getPartRouteCache(itemId) !== null;
}
