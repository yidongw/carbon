"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_1 = require("react-router");
// @ts-expect-error
var build = require("virtual:react-router/server-build");
var handler = (0, react_router_1.createRequestHandler)(build);
var isVercel = !!process.env.VERCEL_DEPLOYMENT_ID;
// Browsers probe `/.well-known/...` — no app route; avoid noisy "No route
// matches" errors in dev logs.
var fn = function (req) {
    try {
        var pathname = new URL(req.url).pathname;
        if (pathname.startsWith("/.well-known/")) {
            return Promise.resolve(new Response(null, { status: 204 }));
        }
    }
    catch (_a) {
        // fall through to handler
    }
    // @ts-expect-error RouterContextProvider matches runtime loadContext; types drift vs AppLoadContext
    return handler(req, new react_router_1.RouterContextProvider());
};
var wrapper = isVercel
    ? fn
    : {
        fetch: fn,
    };
exports.default = wrapper;
