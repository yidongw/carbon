"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.meta = exports.links = exports.clientMiddleware = exports.middleware = void 0;
exports.loader = loader;
exports.action = action;
exports.default = App;
exports.ErrorBoundary = ErrorBoundary;
var auth_1 = require("@carbon/auth");
var flash_client_1 = require("@carbon/auth/middleware/flash.client");
var flash_server_1 = require("@carbon/auth/middleware/flash.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var react_2 = require("@vercel/analytics/react");
var react_router_1 = require("react-router");
var mode_server_1 = require("~/services/mode.server");
var background_css_url_1 = require("~/styles/background.css?url");
var nprogress_css_url_1 = require("~/styles/nprogress.css?url");
var tailwind_css_url_1 = require("~/styles/tailwind.css?url");
var theme_server_1 = require("./services/theme.server");
exports.middleware = [flash_server_1.flashMiddleware];
exports.clientMiddleware = [flash_client_1.flashClientMiddleware];
var links = function () { return [
    { rel: "stylesheet", href: tailwind_css_url_1.default },
    { rel: "stylesheet", href: background_css_url_1.default },
    { rel: "stylesheet", href: nprogress_css_url_1.default },
    {
        rel: "icon",
        type: "image/svg+xml",
        href: "/carbon-mark-light.svg",
        media: "(prefers-color-scheme: light)"
    },
    {
        rel: "icon",
        type: "image/svg+xml",
        href: "/carbon-mark-dark.svg",
        media: "(prefers-color-scheme: dark)"
    },
    {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png"
    },
    {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png"
    },
    {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png"
    },
    { rel: "manifest", href: "/site.webmanifest" }
]; };
exports.links = links;
var meta = function () {
    return [
        {
            title: "Carbon | Starter"
        }
    ];
};
exports.meta = meta;
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, CARBON_EDITION, POSTHOG_API_HOST, POSTHOG_PROJECT_PUBLIC_KEY, SUPABASE_URL, SUPABASE_ANON_KEY;
        var _d;
        var request = _b.request, context = _b.context;
        return __generator(this, function (_e) {
            _c = (0, auth_1.getBrowserEnv)(), CARBON_EDITION = _c.CARBON_EDITION, POSTHOG_API_HOST = _c.POSTHOG_API_HOST, POSTHOG_PROJECT_PUBLIC_KEY = _c.POSTHOG_PROJECT_PUBLIC_KEY, SUPABASE_URL = _c.SUPABASE_URL, SUPABASE_ANON_KEY = _c.SUPABASE_ANON_KEY;
            return [2 /*return*/, (0, react_router_1.data)({
                    env: {
                        CARBON_EDITION: CARBON_EDITION,
                        POSTHOG_API_HOST: POSTHOG_API_HOST,
                        POSTHOG_PROJECT_PUBLIC_KEY: POSTHOG_PROJECT_PUBLIC_KEY,
                        SUPABASE_URL: SUPABASE_URL,
                        SUPABASE_ANON_KEY: SUPABASE_ANON_KEY
                    },
                    mode: (0, mode_server_1.getMode)(request),
                    theme: (0, theme_server_1.getTheme)(request),
                    result: context.get(flash_server_1.flashResultContext)
                }, {
                    headers: (_d = context.get(flash_server_1.flashHeadersContext)) !== null && _d !== void 0 ? _d : undefined
                })];
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var contentType, validation, _c, _d;
        var _e;
        var request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    contentType = (_e = request.headers.get("content-type")) !== null && _e !== void 0 ? _e : "";
                    if (!contentType.includes("multipart/form-data") &&
                        !contentType.includes("application/x-www-form-urlencoded")) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid content type" }, { status: 400 })];
                    }
                    _d = (_c = (0, form_1.validator)(utils_1.modeValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 1: return [4 /*yield*/, _d.apply(_c, [_f.sent()])];
                case 2:
                    validation = _f.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, react_router_1.data)((0, auth_1.error)(validation.error, "Invalid mode"), {
                                status: 400
                            })];
                    }
                    return [2 /*return*/, (0, react_router_1.data)({}, {
                            headers: { "Set-Cookie": (0, mode_server_1.setMode)(validation.data.mode) }
                        })];
            }
        });
    });
}
function Document(_a) {
    var children = _a.children, _b = _a.title, title = _b === void 0 ? "Carbon" : _b, _c = _a.mode, mode = _c === void 0 ? "light" : _c, _d = _a.theme, theme = _d === void 0 ? "zinc" : _d;
    var selectedTheme = utils_1.themes.find(function (t) { return t.name === theme; });
    // Create style objects for both light and dark modes
    var lightVars = {};
    var darkVars = {};
    if (selectedTheme) {
        // Set light mode variables
        Object.entries(selectedTheme.cssVars.light).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            var cssKey = "--".concat(key);
            lightVars[cssKey] = "".concat(value);
        });
        // Set dark mode variables
        Object.entries(selectedTheme.cssVars.dark).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            var cssKey = "--".concat(key);
            darkVars[cssKey] = "".concat(value);
        });
    }
    // Combine the styles with proper selectors
    var themeStyle = __assign(__assign({}, (mode === "dark" ? darkVars : lightVars)), { "--radius": "0.675rem" });
    return (<html lang="en" className={"".concat(mode, " h-full overflow-x-hidden")} style={themeStyle}>
      <head>
        <exports.meta charSet="utf-8"/>
        <exports.meta name="viewport" content="width=device-width, initial-scale=1"/>
        <react_router_1.Meta />
        <title>{title}</title>
        <react_router_1.Links />
      </head>
      <body className="h-full bg-background antialiased selection:bg-primary/10 selection:text-primary">
        {children}
        <react_1.Toaster position="bottom-right" visibleToasts={5}/>
        <react_router_1.ScrollRestoration />
        <react_router_1.Scripts />
        {!auth_1.CONTROLLED_ENVIRONMENT && <react_2.Analytics />}
      </body>
    </html>);
}
function App() {
    var _a, _b;
    var loaderData = (0, react_router_1.useLoaderData)();
    var env = (_a = loaderData === null || loaderData === void 0 ? void 0 : loaderData.env) !== null && _a !== void 0 ? _a : {};
    var theme = (_b = loaderData === null || loaderData === void 0 ? void 0 : loaderData.theme) !== null && _b !== void 0 ? _b : "zinc";
    /* Dark/Light Mode */
    var mode = (0, react_1.useMode)();
    return (<Document mode={mode} theme={theme}>
      <react_router_1.Outlet />
      <script dangerouslySetInnerHTML={{
            __html: "window.env = ".concat(JSON.stringify(env))
        }}/>
    </Document>);
}
function ErrorBoundary(_a) {
    var _b;
    var error = _a.error;
    var message = (0, react_router_1.isRouteErrorResponse)(error)
        ? ((_b = error.data.message) !== null && _b !== void 0 ? _b : error.data)
        : error instanceof Error
            ? error.message
            : String(error);
    return (<Document title="Error!">
      <div className="light">
        <div className="flex flex-col w-full h-screen  items-center justify-center space-y-4 ">
          <img src="/carbon-mark-light.svg" alt="Carbon Logo" className="block max-w-[60px] dark:hidden"/>
          <img src="/carbon-mark-dark.svg" alt="Carbon Logo" className="max-w-[60px] hidden dark:block"/>
          <react_1.Heading size="h1">Something went wrong</react_1.Heading>
          <p className="text-muted-foreground max-w-2xl">{message}</p>
          <react_1.Button onClick={function () { return (window.location.href = "/"); }}>
            Back Home
          </react_1.Button>
        </div>
      </div>
    </Document>);
}
