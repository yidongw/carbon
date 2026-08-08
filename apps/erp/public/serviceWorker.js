// Caches immutable static assets (hashed build JS/CSS, fonts, images) so kiosk
// tablets on weak networks get fast, resilient repeat loads. Registered only in
// kiosk/native mode (see entry.client.tsx).
//
// Deliberately conservative: cache-first ONLY for same-origin static assets,
// which are content-hashed and safe to keep. HTML documents, auth flows, and
// data (loaders/API) are never intercepted — they always hit the network, so
// there is no risk of serving a stale page or breaking a login redirect.

const ASSET_CACHE = "assets-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== ASSET_CACHE).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // same-origin only

  const dest = req.destination;
  const isImmutableAsset =
    url.pathname.startsWith("/assets/") ||
    dest === "script" ||
    dest === "style" ||
    dest === "font" ||
    dest === "image";

  if (!isImmutableAsset) return; // HTML / data / everything else -> network

  event.respondWith(
    caches.open(ASSET_CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      if (cached) return cached;
      const res = await fetch(req);
      // Only cache successful, non-opaque same-origin responses.
      if (res && res.status === 200 && res.type === "basic") {
        cache.put(req, res.clone());
      }
      return res;
    })
  );
});
