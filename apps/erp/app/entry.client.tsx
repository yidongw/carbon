import { Fragment, startTransition } from "react";
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
    document.body.firstChild.tagName !== "DIV"
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
