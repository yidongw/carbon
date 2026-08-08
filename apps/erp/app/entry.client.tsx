import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Fragment, startTransition } from "react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

// function PosthogInit() {
//   useEffect(() => {
//     if (!window?.location.href.includes("localhost")) {
//       posthog.init(POSTHOG_PROJECT_PUBLIC_KEY, {
//         api_host: POSTHOG_API_HOST
//       });
//     }
//   }, []);
//   return null;
// }

// Cloudflare can inject anonymous nodes at the start of <body>, which breaks
// body-level hydration. Remove those leading nodes before hydrating so the
// server and client trees line up again.
function stripInjectedBodyNodes() {
  while (
    document.body.firstChild &&
    document.body.firstChild.nodeName !== "DIV"
  ) {
    document.body.removeChild(document.body.firstChild);
  }
}

stripInjectedBodyNodes();

startTransition(() => {
  hydrateRoot(
    document,
    <Fragment>
      <HydratedRouter />
      {/* <PosthogInit /> */}
    </Fragment>
  );
});

// On kiosk/tablet displays (the native app, or a URL with ?kiosk=1), register a
// service worker that caches immutable static assets (hashed JS/CSS, fonts,
// images) so repeat loads are fast and resilient on weak networks. Scoped to
// kiosk so normal desktop browsers are unaffected. Data/HTML still hit the
// network — this only speeds up asset delivery, it is not full offline.
if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  const isKiosk =
    new URLSearchParams(window.location.search).get("kiosk") === "1" ||
    !!(window as any).Capacitor?.isNativePlatform?.();
  if (isKiosk) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/serviceWorker.js").catch(() => {});
    });
  }
}
