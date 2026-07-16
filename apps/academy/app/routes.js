"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var remix_routes_option_adapter_1 = require("@react-router/remix-routes-option-adapter");
var remix_flat_routes_1 = require("remix-flat-routes");
exports.default = (0, remix_routes_option_adapter_1.remixRoutesOptionAdapter)(function (defineRoutes) {
    return (0, remix_flat_routes_1.flatRoutes)("routes", defineRoutes, {
        ignoredRouteFiles: [
            ".*",
            "**/*.css",
            "**/*.test.{js,jsx,ts,tsx}",
            "**/__*.*",
            // This is for server-side utilities you want to colocate
            // next to your routes without making an additional
            // directory. If you need a route that includes "server" or
            // "client" in the filename, use the escape brackets like:
            // my-route.[server].tsx
            "**/*.server.*",
            "**/*.client.*"
        ]
    });
});
