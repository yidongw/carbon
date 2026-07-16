"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navTree = exports.firstResourcePath = exports.apiBase = exports.apiModules = exports.apiData = void 0;
exports.getResource = getResource;
exports.allResourceParams = allResourceParams;
var api_data_generated_1 = require("./api-data.generated");
exports.apiData = api_data_generated_1.default;
exports.apiModules = exports.apiData.modules;
exports.apiBase = exports.apiData.base;
function getResource(moduleSlug, resourceSlug) {
    var module = exports.apiModules.find(function (m) { return m.slug === moduleSlug; });
    var resource = module === null || module === void 0 ? void 0 : module.resources.find(function (r) { return r.slug === resourceSlug; });
    if (!module || !resource)
        return null;
    return { module: module, resource: resource };
}
function allResourceParams() {
    return exports.apiModules.flatMap(function (m) { return m.resources.map(function (r) { return ({ module: m.slug, resource: r.slug }); }); });
}
exports.firstResourcePath = (function () {
    var m = exports.apiModules[0];
    var r = m === null || m === void 0 ? void 0 : m.resources[0];
    return m && r ? "/api-reference/".concat(m.slug, "/").concat(r.slug) : "/api-reference";
})();
// Modules and their resources are listed alphabetically in the nav.
exports.navTree = exports.apiModules
    .map(function (m) { return ({
    name: m.name,
    slug: m.slug,
    resources: m.resources
        .map(function (r) { return ({
        name: r.name,
        slug: r.slug,
        module: m.slug,
        kind: r.kind,
        endpoints: r.endpoints.map(function (e) { return ({ id: e.id, method: e.method, title: e.title }); }),
    }); })
        .sort(function (a, b) { return a.name.localeCompare(b.name); }),
}); })
    .sort(function (a, b) { return a.name.localeCompare(b.name); });
