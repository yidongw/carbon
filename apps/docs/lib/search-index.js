"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSearchIndexes = buildSearchIndexes;
require("server-only");
var api_data_1 = require("@/lib/api-data");
var source_1 = require("@/lib/source");
var tools_data_1 = require("@/lib/tools-data");
function mdxIndexes(pages, tag, crumb) {
    return pages.map(function (page) {
        var _a, _b;
        return ({
            id: page.url,
            url: page.url,
            title: (_a = page.data.title) !== null && _a !== void 0 ? _a : page.url,
            description: page.data.description,
            tag: tag,
            breadcrumbs: [crumb],
            structuredData: (_b = page.data.structuredData) !== null && _b !== void 0 ? _b : { headings: [], contents: [] },
        });
    });
}
function toolParamNames(schema) {
    if (schema && typeof schema === "object" && "properties" in schema) {
        var props = schema.properties;
        if (props && typeof props === "object")
            return Object.keys(props);
    }
    return [];
}
function toolIndexes() {
    return tools_data_1.toolModules.flatMap(function (mod) {
        return mod.tools.map(function (tool) {
            var params = toolParamNames(tool.schema);
            var contents = [
                {
                    heading: undefined,
                    content: "".concat(tool.description, ". ").concat(tool.classification, " tool in the ").concat(mod.name, " module."),
                },
            ];
            if (params.length) {
                contents.push({ heading: undefined, content: "Parameters: ".concat(params.join(", "), ".") });
            }
            return {
                id: "/mcp/tools/".concat(tool.slug),
                url: "/mcp/tools/".concat(tool.slug),
                title: tool.name,
                description: tool.description,
                tag: "tools",
                breadcrumbs: ["MCP", mod.name],
                structuredData: { headings: [], contents: contents },
            };
        });
    });
}
function resourceIndexes() {
    return api_data_1.apiModules.flatMap(function (mod) {
        return mod.resources.map(function (r) {
            // Endpoint titles become headings whose ids match the page's <section id> anchors,
            // so a heading hit deep-links straight to "List customers" etc.
            var headings = r.endpoints.map(function (e) { return ({
                id: e.id,
                content: e.title,
            }); });
            // Every field name across the resource's endpoints — a search for a column lands here.
            var fields = Array.from(new Set(r.endpoints.flatMap(function (e) { return e.attributes.map(function (a) { return a.name; }); })));
            var contents = __spreadArray([
                {
                    heading: undefined,
                    content: "The ".concat(r.name, " ").concat(r.kind, " (").concat(r.table, ") in the ").concat(mod.name, " module."),
                }
            ], r.endpoints.map(function (e) { return ({
                heading: e.title,
                content: "".concat(e.method, " ").concat(e.path, " \u2014 ").concat(e.description),
            }); }), true);
            if (fields.length) {
                contents.push({ heading: undefined, content: "Fields: ".concat(fields.join(", "), ".") });
            }
            return {
                id: "/api-reference/".concat(mod.slug, "/").concat(r.slug),
                url: "/api-reference/".concat(mod.slug, "/").concat(r.slug),
                title: r.name,
                description: r.description,
                tag: "resources",
                breadcrumbs: ["API", mod.name],
                structuredData: { headings: headings, contents: contents },
            };
        });
    });
}
function buildSearchIndexes() {
    return __spreadArray(__spreadArray(__spreadArray(__spreadArray([], mdxIndexes(source_1.source.getPages(), "docs", "Reference"), true), mdxIndexes(source_1.guideSource.getPages(), "guide", "Guide"), true), resourceIndexes(), true), toolIndexes(), true);
}
