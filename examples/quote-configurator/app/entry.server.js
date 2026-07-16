"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamTimeout = void 0;
exports.default = handleRequest;
var entry_server_1 = require("@vercel/react-router/entry.server");
exports.streamTimeout = 5000;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, _loadContext // RouterContextProvider when v8_middleware is turned on
) {
    return (0, entry_server_1.handleRequest)(request, responseStatusCode, responseHeaders, routerContext, 
    // @ts-expect-error
    _loadContext // Vercel's handler still expecting AppLoadContext type
    );
}
