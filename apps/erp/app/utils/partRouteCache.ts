import { partPrefetchCache } from "~/utils/prefetchCache";

const CACHE_TTL_MS = 5 * 60_000;

const cache = new Map<string, { data: unknown; ts: number }>();

export function getPartRouteCache<T>(itemId: string): T | null {
  const hit = cache.get(itemId);
  if (!hit || Date.now() - hit.ts >= CACHE_TTL_MS) return null;
  return hit.data as T;
}

export function setPartRouteCache(itemId: string, data: unknown) {
  cache.set(itemId, { data, ts: Date.now() });
  partPrefetchCache.add(itemId);
}

export function clearPartRouteCache(itemId: string) {
  cache.delete(itemId);
}

export function hasPartRouteCache(itemId: string) {
  return getPartRouteCache(itemId) !== null;
}
