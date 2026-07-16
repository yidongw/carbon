"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MCP_ENDPOINT = exports.useApiConfig = exports.DEFAULT_API_BASE = void 0;
exports.ApiConfigProvider = ApiConfigProvider;
exports.applyBase = applyBase;
exports.appOrigin = appOrigin;
exports.applyConfig = applyConfig;
var react_1 = require("react");
exports.DEFAULT_API_BASE = "https://rest.carbon.ms";
var BASE_STORAGE_KEY = "carbon-api-base";
var KEY_STORAGE_KEY = "carbon-api-key";
var API_KEY_PLACEHOLDER = "<api-key>";
var ApiConfigCtx = (0, react_1.createContext)({
    base: exports.DEFAULT_API_BASE,
    setBase: function () { },
    isDefault: true,
    apiKey: "",
    setApiKey: function () { },
});
function ApiConfigProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(exports.DEFAULT_API_BASE), base = _b[0], setBaseState = _b[1];
    var _c = (0, react_1.useState)(""), apiKey = _c[0], setApiKeyState = _c[1];
    (0, react_1.useEffect)(function () {
        try {
            var savedBase = localStorage.getItem(BASE_STORAGE_KEY);
            if (savedBase)
                setBaseState(savedBase);
            var savedKey = localStorage.getItem(KEY_STORAGE_KEY);
            if (savedKey)
                setApiKeyState(savedKey);
        }
        catch (_a) { }
    }, []);
    var setBase = function (v) {
        var val = (v || "").trim().replace(/\/+$/, "") || exports.DEFAULT_API_BASE;
        setBaseState(val);
        try {
            localStorage.setItem(BASE_STORAGE_KEY, val);
        }
        catch (_a) { }
    };
    var setApiKey = function (v) {
        var val = (v || "").trim();
        setApiKeyState(val);
        try {
            if (val)
                localStorage.setItem(KEY_STORAGE_KEY, val);
            else
                localStorage.removeItem(KEY_STORAGE_KEY);
        }
        catch (_a) { }
    };
    return (<ApiConfigCtx.Provider value={{ base: base, setBase: setBase, isDefault: base === exports.DEFAULT_API_BASE, apiKey: apiKey, setApiKey: setApiKey }}>
      {children}
    </ApiConfigCtx.Provider>);
}
var useApiConfig = function () { return (0, react_1.useContext)(ApiConfigCtx); };
exports.useApiConfig = useApiConfig;
/** Rewrite the default base URL in a sample to the configured instance. */
function applyBase(text, base) {
    if (!text || base === exports.DEFAULT_API_BASE)
        return text;
    return text.split(exports.DEFAULT_API_BASE).join(base);
}
// The MCP server lives on the app host (app.carbon.ms), a sibling of the REST API
// host (rest.carbon.ms) the configurator controls. Derive the instance's MCP
// endpoint from the configured base by swapping the `rest.` subdomain for `app.`.
exports.DEFAULT_MCP_ENDPOINT = "https://app.carbon.ms/api/mcp";
/** App host for the configured instance (where Settings and the MCP server live).
 *  The configurator controls the REST host (rest.*); the app host swaps that subdomain. */
function appOrigin(base) {
    if (base === exports.DEFAULT_API_BASE)
        return "https://app.carbon.ms";
    try {
        var u = new URL(base);
        u.hostname = u.hostname.replace(/^rest\./, "app.");
        return u.origin;
    }
    catch (_a) {
        return "https://app.carbon.ms";
    }
}
function mcpEndpointFor(base) {
    return "".concat(appOrigin(base), "/api/mcp");
}
function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
/**
 * Apply the configured base URL and API key to a sample. Pass `html: true` when `text`
 * is shiki-highlighted HTML — there the `<api-key>` placeholder is entity-escaped to
 * `&lt;api-key&gt;`, and the substituted key must be escaped too.
 */
function applyConfig(text, base, apiKey, html) {
    if (html === void 0) { html = false; }
    var out = applyBase(text, base);
    out = out.split(exports.DEFAULT_MCP_ENDPOINT).join(mcpEndpointFor(base));
    if (apiKey) {
        if (html) {
            var keyEsc = escapeHtml(apiKey);
            // Shiki encodes the placeholder's angle brackets as hex entities (&#x3C;);
            // also cover decimal (&#60;) and named (&lt;) so substitution is encoding-proof.
            for (var _i = 0, _a = ["&#x3C;api-key&#x3E;", "&#60;api-key&#62;", "&lt;api-key&gt;"]; _i < _a.length; _i++) {
                var needle = _a[_i];
                out = out.split(needle).join(keyEsc);
            }
        }
        else {
            out = out.split(API_KEY_PLACEHOLDER).join(apiKey);
        }
    }
    return out;
}
