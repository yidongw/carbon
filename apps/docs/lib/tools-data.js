"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolsNavTree = exports.toolModules = void 0;
exports.getTool = getTool;
exports.allToolParams = allToolParams;
var tools_data_generated_1 = require("./tools-data.generated");
exports.toolModules = tools_data_generated_1.default.modules;
function getTool(slug) {
    for (var _i = 0, toolModules_1 = exports.toolModules; _i < toolModules_1.length; _i++) {
        var m = toolModules_1[_i];
        var tool = m.tools.find(function (t) { return t.slug === slug; });
        if (tool)
            return { module: m, tool: tool };
    }
    return null;
}
function allToolParams() {
    return exports.toolModules.flatMap(function (m) { return m.tools.map(function (t) { return ({ tool: t.slug }); }); });
}
// Modules and their tools are listed alphabetically in the nav.
exports.toolsNavTree = exports.toolModules
    .map(function (m) { return ({
    name: m.name,
    slug: m.slug,
    tools: m.tools
        .map(function (t) { return ({ name: t.name, slug: t.slug, classification: t.classification }); })
        .sort(function (a, b) { return a.name.localeCompare(b.name); }),
}); })
    .sort(function (a, b) { return a.name.localeCompare(b.name); });
