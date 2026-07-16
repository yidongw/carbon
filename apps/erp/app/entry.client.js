"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pdf_worker_min_mjs_url_1 = require("pdfjs-dist/build/pdf.worker.min.mjs?url");
var react_1 = require("react");
var react_pdf_1 = require("react-pdf");
react_pdf_1.pdfjs.GlobalWorkerOptions.workerSrc = pdf_worker_min_mjs_url_1.default;
var client_1 = require("react-dom/client");
var dom_1 = require("react-router/dom");
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
    while (document.body.firstChild &&
        document.body.firstChild.nodeName !== "DIV") {
        document.body.removeChild(document.body.firstChild);
    }
}
stripInjectedBodyNodes();
(0, react_1.startTransition)(function () {
    (0, client_1.hydrateRoot)(document, <react_1.Fragment>
      <dom_1.HydratedRouter />
      {/* <PosthogInit /> */}
    </react_1.Fragment>);
});
