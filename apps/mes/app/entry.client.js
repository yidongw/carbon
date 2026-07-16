"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
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
(0, react_1.startTransition)(function () {
    (0, client_1.hydrateRoot)(document, <react_1.Fragment>
      <dom_1.HydratedRouter />
      {/* <PosthogInit /> */}
    </react_1.Fragment>);
});
