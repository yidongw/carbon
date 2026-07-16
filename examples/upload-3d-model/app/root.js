"use strict";
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
exports.links = links;
exports.loader = loader;
exports.action = action;
exports.default = App;
exports.ErrorBoundary = ErrorBoundary;
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var tailwind_css_url_1 = require("~/styles/tailwind.css?url");
function links() {
    return [{ rel: "stylesheet", href: tailwind_css_url_1.default }];
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var request = _b.request;
        return __generator(this, function (_c) {
            return [2 /*return*/, {
                    env: {}
                }];
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var request = _b.request;
        return __generator(this, function (_c) {
            return [2 /*return*/, {}];
        });
    });
}
function Document(_a) {
    var children = _a.children, _b = _a.title, title = _b === void 0 ? "Upload RFQ" : _b;
    return (<html lang="en" className="h-full overflow-x-hidden">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <react_router_1.Meta />
        <title>{title}</title>
        <react_router_1.Links />
      </head>
      <body className="h-full bg-background antialiased selection:bg-primary/10 selection:text-primary">
        {children}
        <react_1.Toaster />
        <react_router_1.ScrollRestoration />
        <react_router_1.Scripts />
      </body>
    </html>);
}
function App() {
    var env = (0, react_router_1.useLoaderData)().env;
    return (<Document>
      <react_router_1.Outlet />
      <script dangerouslySetInnerHTML={{
            __html: "window.env = ".concat(JSON.stringify(env))
        }}/>
    </Document>);
}
function ErrorBoundary() {
    var _a;
    var error = (0, react_router_1.useRouteError)();
    var message = (0, react_router_1.isRouteErrorResponse)(error)
        ? ((_a = error.data.message) !== null && _a !== void 0 ? _a : error.data)
        : error instanceof Error
            ? error.message
            : String(error);
    return (<Document title="Error!">
      <div className="light">
        <div className="flex flex-col w-full h-screen  items-center justify-center space-y-4 ">
          <img src="/carbon-mark-light.svg" alt="Carbon Logo" className="block max-w-[60px]"/>
          <img src="/carbon-mark-dark.svg" alt="Carbon Logo" className="max-w-[60px] hidden dark:block"/>
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground max-w-2xl">{message}</p>
        </div>
      </div>
    </Document>);
}
