"use strict";
/**
 * Utilities for bidirectional conversion between Atlassian Document Format (ADF)
 * and Tiptap JSON (Carbon's rich text format).
 *
 * Jira Cloud uses ADF for rich text fields like description.
 * Carbon uses Tiptap/ProseMirror JSON for rich text editing.
 *
 * ADF documentation: https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.adfToTiptap = adfToTiptap;
exports.tiptapToAdf = tiptapToAdf;
exports.tiptapDocumentsEqual = tiptapDocumentsEqual;
exports.isTiptapEmpty = isTiptapEmpty;
/**
 * Convert ADF (Atlassian Document Format) to Tiptap JSON.
 * Used when syncing from Jira → Carbon.
 */
function adfToTiptap(adf) {
    if (!adf || !adf.content || adf.content.length === 0) {
        return { type: "doc", content: [{ type: "paragraph" }] };
    }
    var content = adf.content
        .map(convertADFNodeToTiptap)
        .filter(Boolean);
    if (content.length === 0) {
        return { type: "doc", content: [{ type: "paragraph" }] };
    }
    return { type: "doc", content: content };
}
function convertADFNodeToTiptap(node) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    switch (node.type) {
        case "paragraph":
            return {
                type: "paragraph",
                content: ((_a = node.content) === null || _a === void 0 ? void 0 : _a.map(convertADFNodeToTiptap).filter(Boolean)) || []
            };
        case "heading":
            return {
                type: "heading",
                attrs: { level: (_c = (_b = node.attrs) === null || _b === void 0 ? void 0 : _b.level) !== null && _c !== void 0 ? _c : 1 },
                content: ((_d = node.content) === null || _d === void 0 ? void 0 : _d.map(convertADFNodeToTiptap).filter(Boolean)) || []
            };
        case "bulletList":
            return {
                type: "bulletList",
                content: ((_e = node.content) === null || _e === void 0 ? void 0 : _e.map(convertADFNodeToTiptap).filter(Boolean)) || []
            };
        case "orderedList":
            return {
                type: "orderedList",
                content: ((_f = node.content) === null || _f === void 0 ? void 0 : _f.map(convertADFNodeToTiptap).filter(Boolean)) || []
            };
        case "listItem":
            return {
                type: "listItem",
                content: ((_g = node.content) === null || _g === void 0 ? void 0 : _g.map(convertADFNodeToTiptap).filter(Boolean)) || []
            };
        case "blockquote":
            return {
                type: "blockquote",
                content: ((_h = node.content) === null || _h === void 0 ? void 0 : _h.map(convertADFNodeToTiptap).filter(Boolean)) || []
            };
        case "codeBlock":
            return {
                type: "codeBlock",
                attrs: ((_j = node.attrs) === null || _j === void 0 ? void 0 : _j.language)
                    ? { language: node.attrs.language }
                    : undefined,
                content: ((_k = node.content) === null || _k === void 0 ? void 0 : _k.map(convertADFNodeToTiptap).filter(Boolean)) || []
            };
        case "rule":
            return { type: "horizontalRule" };
        case "hardBreak":
            return { type: "hardBreak" };
        case "text":
            return {
                type: "text",
                text: (_l = node.text) !== null && _l !== void 0 ? _l : "",
                marks: (_m = node.marks) === null || _m === void 0 ? void 0 : _m.map(convertADFMarkToTiptap).filter(Boolean)
            };
        case "mention":
            // Convert Jira mentions to plain text
            return {
                type: "text",
                text: ((_o = node.attrs) === null || _o === void 0 ? void 0 : _o.text) || "@mention"
            };
        case "emoji":
            return {
                type: "text",
                text: ((_p = node.attrs) === null || _p === void 0 ? void 0 : _p.shortName) || ((_q = node.attrs) === null || _q === void 0 ? void 0 : _q.text) || ""
            };
        case "inlineCard":
        case "blockCard":
            // Convert Jira cards to links
            return {
                type: "text",
                text: ((_r = node.attrs) === null || _r === void 0 ? void 0 : _r.url) || "",
                marks: ((_s = node.attrs) === null || _s === void 0 ? void 0 : _s.url)
                    ? [{ type: "link", attrs: { href: node.attrs.url } }]
                    : undefined
            };
        case "mediaGroup":
        case "mediaSingle":
            // Skip media for now - could be enhanced to handle attachments
            return null;
        case "table":
        case "tableRow":
        case "tableCell":
        case "tableHeader":
            // Tables are complex - skip for now
            return null;
        default:
            // For unknown types, try to extract text content
            if (node.content) {
                return {
                    type: "paragraph",
                    content: node.content
                        .map(convertADFNodeToTiptap)
                        .filter(Boolean)
                };
            }
            return null;
    }
}
function convertADFMarkToTiptap(mark) {
    var _a, _b;
    switch (mark.type) {
        case "strong":
            return { type: "bold" };
        case "em":
            return { type: "italic" };
        case "strike":
            return { type: "strike" };
        case "code":
            return { type: "code" };
        case "link":
            return { type: "link", attrs: { href: (_a = mark.attrs) === null || _a === void 0 ? void 0 : _a.href } };
        case "underline":
            return { type: "underline" };
        case "textColor":
            return { type: "textStyle", attrs: { color: (_b = mark.attrs) === null || _b === void 0 ? void 0 : _b.color } };
        case "subsup":
            // Subscript/superscript - map to appropriate type or skip
            return null;
        default:
            return null;
    }
}
/**
 * Convert Tiptap JSON to ADF (Atlassian Document Format).
 * Used when syncing from Carbon → Jira.
 */
function tiptapToAdf(tiptapDoc) {
    if (!tiptapDoc || !tiptapDoc.content || tiptapDoc.content.length === 0) {
        return {
            version: 1,
            type: "doc",
            content: [{ type: "paragraph", content: [] }]
        };
    }
    var content = tiptapDoc.content
        .map(convertTiptapNodeToADF)
        .filter(Boolean);
    if (content.length === 0) {
        return {
            version: 1,
            type: "doc",
            content: [{ type: "paragraph", content: [] }]
        };
    }
    return { version: 1, type: "doc", content: content };
}
function convertTiptapNodeToADF(node) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    switch (node.type) {
        case "paragraph":
            return {
                type: "paragraph",
                content: ((_a = node.content) === null || _a === void 0 ? void 0 : _a.map(convertTiptapNodeToADF).filter(Boolean)) || []
            };
        case "heading":
            return {
                type: "heading",
                attrs: { level: (_c = (_b = node.attrs) === null || _b === void 0 ? void 0 : _b.level) !== null && _c !== void 0 ? _c : 1 },
                content: ((_d = node.content) === null || _d === void 0 ? void 0 : _d.map(convertTiptapNodeToADF).filter(Boolean)) || []
            };
        case "bulletList":
            return {
                type: "bulletList",
                content: ((_e = node.content) === null || _e === void 0 ? void 0 : _e.map(convertTiptapNodeToADF).filter(Boolean)) || []
            };
        case "orderedList":
            return {
                type: "orderedList",
                content: ((_f = node.content) === null || _f === void 0 ? void 0 : _f.map(convertTiptapNodeToADF).filter(Boolean)) || []
            };
        case "listItem":
            return {
                type: "listItem",
                content: ((_g = node.content) === null || _g === void 0 ? void 0 : _g.map(convertTiptapNodeToADF).filter(Boolean)) || []
            };
        case "blockquote":
            return {
                type: "blockquote",
                content: ((_h = node.content) === null || _h === void 0 ? void 0 : _h.map(convertTiptapNodeToADF).filter(Boolean)) || []
            };
        case "codeBlock":
            return {
                type: "codeBlock",
                attrs: ((_j = node.attrs) === null || _j === void 0 ? void 0 : _j.language) ? { language: node.attrs.language } : {},
                content: ((_k = node.content) === null || _k === void 0 ? void 0 : _k.map(convertTiptapNodeToADF).filter(Boolean)) || []
            };
        case "horizontalRule":
            return { type: "rule" };
        case "hardBreak":
            return { type: "hardBreak" };
        case "text":
            return {
                type: "text",
                text: (_l = node.text) !== null && _l !== void 0 ? _l : "",
                marks: (_m = node.marks) === null || _m === void 0 ? void 0 : _m.map(convertTiptapMarkToADF).filter(Boolean)
            };
        default:
            // For unknown types, try to extract text content
            if (node.content) {
                return {
                    type: "paragraph",
                    content: node.content
                        .map(convertTiptapNodeToADF)
                        .filter(Boolean)
                };
            }
            return null;
    }
}
function convertTiptapMarkToADF(mark) {
    var _a, _b;
    switch (mark.type) {
        case "bold":
            return { type: "strong" };
        case "italic":
            return { type: "em" };
        case "strike":
            return { type: "strike" };
        case "code":
            return { type: "code" };
        case "link":
            return { type: "link", attrs: { href: (_a = mark.attrs) === null || _a === void 0 ? void 0 : _a.href } };
        case "underline":
            return { type: "underline" };
        case "textStyle":
            if ((_b = mark.attrs) === null || _b === void 0 ? void 0 : _b.color) {
                return { type: "textColor", attrs: { color: mark.attrs.color } };
            }
            return null;
        default:
            return null;
    }
}
/**
 * Check if two Tiptap documents have the same content.
 * Used to prevent unnecessary syncs when content hasn't changed.
 */
function tiptapDocumentsEqual(a, b) {
    if (!a && !b)
        return true;
    if (!a || !b)
        return false;
    return JSON.stringify(a) === JSON.stringify(b);
}
/**
 * Check if a Tiptap document is empty (no meaningful content).
 */
function isTiptapEmpty(doc) {
    if (!doc || !doc.content)
        return true;
    var hasContent = doc.content.some(function (node) {
        if (node.type === "paragraph" && node.content) {
            return node.content.some(function (inline) { var _a; return inline.type === "text" && ((_a = inline.text) === null || _a === void 0 ? void 0 : _a.trim()); });
        }
        return node.content && node.content.length > 0;
    });
    return !hasContent;
}
