"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textToTiptap = void 0;
exports.parseMentionsFromDocument = parseMentionsFromDocument;
exports.normalizeTiptapContent = normalizeTiptapContent;
exports.tiptapToHTML = tiptapToHTML;
/**
 * Recursively extracts unique item mention IDs from a TipTap/ProseMirror JSON document.
 * Handles deeply nested structures including paragraphs, lists, and other block elements.
 */
function parseMentionsFromDocument(content) {
    var mentionIds = new Set();
    function traverse(node) {
        var _a;
        if (!node)
            return;
        if (Array.isArray(node)) {
            for (var _i = 0, node_1 = node; _i < node_1.length; _i++) {
                var child = node_1[_i];
                traverse(child);
            }
            return;
        }
        if (node.type === "mention" && ((_a = node.attrs) === null || _a === void 0 ? void 0 : _a.id)) {
            mentionIds.add(node.attrs.id);
        }
        if (node.content) {
            traverse(node.content);
        }
    }
    traverse(content);
    return Array.from(mentionIds);
}
function normalizeTiptapContent(content) {
    if (!content || content.type !== "doc") {
        return undefined;
    }
    return content;
}
var textToTiptap = function (text) {
    var lines = text.split("\n");
    var content = lines.map(function (line) {
        // ProseMirror text nodes cannot be empty, so blank lines become a bare paragraph
        return line === ""
            ? { type: "paragraph" }
            : { type: "paragraph", content: [{ type: "text", text: line }] };
    });
    return { type: "doc", content: content };
};
exports.textToTiptap = textToTiptap;
/**
 * Convert a Tiptap JSON document to an HTML string.
 * Works server-side without DOM dependencies.
 */
function tiptapToHTML(doc) {
    if (!doc || !doc.content)
        return "";
    return doc.content.map(tiptapNodeToHTML).join("");
}
function tiptapNodeToHTML(node) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    switch (node.type) {
        case "paragraph": {
            var inner = node.content
                ? node.content.map(tiptapInlineToHTML).join("")
                : "";
            return "<p>".concat(inner, "</p>");
        }
        case "heading": {
            var level = (_b = (_a = node.attrs) === null || _a === void 0 ? void 0 : _a.level) !== null && _b !== void 0 ? _b : 1;
            var inner = node.content
                ? node.content.map(tiptapInlineToHTML).join("")
                : "";
            return "<h".concat(level, ">").concat(inner, "</h").concat(level, ">");
        }
        case "bulletList":
            return "<ul>".concat(((_c = node.content) !== null && _c !== void 0 ? _c : []).map(tiptapNodeToHTML).join(""), "</ul>");
        case "orderedList":
            return "<ol>".concat(((_d = node.content) !== null && _d !== void 0 ? _d : []).map(tiptapNodeToHTML).join(""), "</ol>");
        case "listItem":
            return "<li>".concat(((_e = node.content) !== null && _e !== void 0 ? _e : []).map(tiptapNodeToHTML).join(""), "</li>");
        case "blockquote":
            return "<blockquote>".concat(((_f = node.content) !== null && _f !== void 0 ? _f : []).map(tiptapNodeToHTML).join(""), "</blockquote>");
        case "codeBlock": {
            var code = (_j = (_h = (_g = node.content) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.text) !== null && _j !== void 0 ? _j : "";
            return "<pre><code>".concat(escapeHTMLChars(code), "</code></pre>");
        }
        case "horizontalRule":
            return "<hr>";
        default:
            return node.content ? node.content.map(tiptapInlineToHTML).join("") : "";
    }
}
function tiptapInlineToHTML(node) {
    var _a, _b, _c;
    if (node.type === "text") {
        var text = escapeHTMLChars((_a = node.text) !== null && _a !== void 0 ? _a : "");
        if (node.marks) {
            for (var _i = 0, _d = node.marks; _i < _d.length; _i++) {
                var mark = _d[_i];
                switch (mark.type) {
                    case "bold":
                        text = "<strong>".concat(text, "</strong>");
                        break;
                    case "italic":
                        text = "<em>".concat(text, "</em>");
                        break;
                    case "underline":
                        text = "<u>".concat(text, "</u>");
                        break;
                    case "strike":
                        text = "<s>".concat(text, "</s>");
                        break;
                    case "code":
                        text = "<code>".concat(text, "</code>");
                        break;
                    case "link":
                        text = "<a href=\"".concat(escapeHTMLChars((_c = (_b = mark.attrs) === null || _b === void 0 ? void 0 : _b.href) !== null && _c !== void 0 ? _c : ""), "\">").concat(text, "</a>");
                        break;
                }
            }
        }
        return text;
    }
    if (node.type === "hardBreak") {
        return "<br>";
    }
    return "";
}
function escapeHTMLChars(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
