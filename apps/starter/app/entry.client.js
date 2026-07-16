"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var i18n_1 = require("@react-aria/i18n");
var posthog_js_1 = require("posthog-js");
var react_2 = require("react");
var client_1 = require("react-dom/client");
var dom_1 = require("react-router/dom");
function PosthogInit() {
    (0, react_2.useEffect)(function () {
        if (auth_1.VERCEL_URL && !(auth_1.VERCEL_URL === null || auth_1.VERCEL_URL === void 0 ? void 0 : auth_1.VERCEL_URL.includes("localhost"))) {
            posthog_js_1.default.init(auth_1.POSTHOG_PROJECT_PUBLIC_KEY, {
                api_host: auth_1.POSTHOG_API_HOST,
                autocapture: false,
                capture_pageview: false
            });
        }
    }, []);
    return null;
}
(0, react_2.startTransition)(function () {
    var _a, _b, _c;
    (0, client_1.hydrateRoot)(document, <react_1.OperatingSystemContextProvider platform={window.navigator.userAgent.includes("Mac") ? "mac" : "windows"}>
      <i18n_1.I18nProvider locale={(_c = (_a = navigator.language) !== null && _a !== void 0 ? _a : (_b = navigator.languages) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : "en-US"}>
        <dom_1.HydratedRouter />
      </i18n_1.I18nProvider>
      <PosthogInit />
    </react_1.OperatingSystemContextProvider>);
});
