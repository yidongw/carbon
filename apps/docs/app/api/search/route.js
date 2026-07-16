"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
var server_1 = require("fumadocs-core/search/server");
var search_index_1 = require("@/lib/search-index");
/* Single search endpoint across all four surfaces (Reference docs, the Guide, API
 * resources, MCP tools). Canonical fumadocs pattern: one combined `indexes` array, each
 * entry `tag`ged (docs | guide | resources | tools) so the header's surface pills can
 * filter via `?tag=`. Result count is capped client-side (no server limit in fumadocs). */
exports.GET = (0, server_1.createSearchAPI)("advanced", {
    language: "english",
    indexes: (0, search_index_1.buildSearchIndexes)()
}).GET;
