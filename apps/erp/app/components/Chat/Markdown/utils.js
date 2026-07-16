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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedHTMLElements = void 0;
exports.remarkPlugins = remarkPlugins;
exports.rehypePlugins = rehypePlugins;
var rehype_raw_1 = require("rehype-raw");
var rehype_sanitize_1 = require("rehype-sanitize");
var remark_gfm_1 = require("remark-gfm");
var unist_util_visit_1 = require("unist-util-visit");
exports.allowedHTMLElements = [
    "a",
    "b",
    "blockquote",
    "br",
    "code",
    "dd",
    "del",
    "details",
    "div",
    "dl",
    "dt",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "i",
    "ins",
    "kbd",
    "li",
    "ol",
    "p",
    "pre",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "source",
    "span",
    "strike",
    "strong",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "tfoot",
    "th",
    "thead",
    "tr",
    "ul",
    "var"
];
var rehypeSanitizeOptions = __assign(__assign({}, rehype_sanitize_1.defaultSchema), { tagNames: exports.allowedHTMLElements, attributes: __assign(__assign({}, rehype_sanitize_1.defaultSchema.attributes), { div: __spreadArray(__spreadArray([], ((_b = (_a = rehype_sanitize_1.defaultSchema.attributes) === null || _a === void 0 ? void 0 : _a.div) !== null && _b !== void 0 ? _b : []), true), [
            "data*",
            ["className", "__boltArtifact__"]
        ], false) }), strip: [] });
function remarkPlugins(limitedMarkdown) {
    var plugins = [remark_gfm_1.default];
    if (limitedMarkdown) {
        plugins.unshift(limitedMarkdownPlugin);
    }
    return plugins;
}
function rehypePlugins(html) {
    var plugins = [];
    if (html) {
        // @ts-ignore
        plugins.push(rehype_raw_1.default, [rehype_sanitize_1.default, rehypeSanitizeOptions]);
    }
    return plugins;
}
var limitedMarkdownPlugin = function () {
    return function (tree, file) {
        var contents = file.toString();
        (0, unist_util_visit_1.visit)(tree, function (node, index, parent) {
            if (index == null ||
                parent == null ||
                !parent.children ||
                [
                    "paragraph",
                    "text",
                    "inlineCode",
                    "code",
                    "strong",
                    "emphasis",
                    "table",
                    "tableRow",
                    "tableCell"
                ].includes(node.type) ||
                !node.position) {
                return true;
            }
            var value = contents.slice(node.position.start.offset, node.position.end.offset);
            if (node.type === "heading") {
                value = "\n".concat(value);
            }
            parent.children[index] = {
                type: "text",
                value: value
            };
            return [unist_util_visit_1.SKIP, index];
        });
    };
};
