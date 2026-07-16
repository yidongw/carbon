"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpEndpoint = McpEndpoint;
exports.AuthHeader = AuthHeader;
exports.ApiKeysLink = ApiKeysLink;
var config_context_1 = require("./config-context");
var doc_1 = require("./doc");
/* Reactive inline references for prose — they read the Configurator (api key + base
 * URL) so the MCP endpoint, auth header, and Settings link match the instance the
 * reader configured, everywhere they appear (not just in the code blocks). */
/** Inline MCP endpoint for the configured instance. */
function McpEndpoint() {
    var base = (0, config_context_1.useApiConfig)().base;
    return <doc_1.Code>{"".concat((0, config_context_1.appOrigin)(base), "/api/mcp")}</doc_1.Code>;
}
/** Inline bearer-auth header carrying the configured API key (placeholder if unset). */
function AuthHeader() {
    var apiKey = (0, config_context_1.useApiConfig)().apiKey;
    return <doc_1.Code>Authorization: Bearer {apiKey || "<api-key>"}</doc_1.Code>;
}
/** Settings → API Keys link on the configured instance's app host. */
function ApiKeysLink(_a) {
    var children = _a.children;
    var base = (0, config_context_1.useApiConfig)().base;
    return <doc_1.DocLink href={"".concat((0, config_context_1.appOrigin)(base), "/x/settings/api-keys")}>{children}</doc_1.DocLink>;
}
