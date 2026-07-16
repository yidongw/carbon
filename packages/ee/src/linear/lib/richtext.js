"use strict";
/**
 * Utilities for bidirectional conversion between Markdown (Linear description format)
 * and Tiptap JSON (Carbon's rich text format).
 *
 * Linear's API uses plain markdown for the `description` field.
 * Carbon uses Tiptap/ProseMirror JSON for rich text editing.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToTiptap = markdownToTiptap;
exports.tiptapToMarkdown = tiptapToMarkdown;
exports.tiptapDocumentsEqual = tiptapDocumentsEqual;
exports.isTiptapEmpty = isTiptapEmpty;
/**
 * Convert Markdown to Tiptap JSON format.
 * This is used when syncing from Linear → Carbon.
 */
function markdownToTiptap(markdown) {
    if (!markdown || !markdown.trim()) {
        return { type: "doc", content: [{ type: "paragraph" }] };
    }
    var lines = markdown.split("\n");
    var content = [];
    var i = 0;
    while (i < lines.length) {
        var line = lines[i];
        // Heading
        var headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch) {
            var level = headingMatch[1].length;
            content.push({
                type: "heading",
                attrs: { level: level },
                content: parseInlineMarkdown(headingMatch[2])
            });
            i++;
            continue;
        }
        // Horizontal rule
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
            content.push({ type: "horizontalRule" });
            i++;
            continue;
        }
        // Code block
        if (line.startsWith("```")) {
            var language = line.slice(3).trim() || undefined;
            var codeLines = [];
            i++;
            while (i < lines.length && !lines[i].startsWith("```")) {
                codeLines.push(lines[i]);
                i++;
            }
            content.push({
                type: "codeBlock",
                attrs: language ? { language: language } : undefined,
                content: codeLines.length > 0
                    ? [{ type: "text", text: codeLines.join("\n") }]
                    : undefined
            });
            i++; // Skip closing ```
            continue;
        }
        // Blockquote
        if (line.startsWith("> ")) {
            var quoteLines = [];
            while (i < lines.length && lines[i].startsWith("> ")) {
                quoteLines.push(lines[i].slice(2));
                i++;
            }
            content.push({
                type: "blockquote",
                content: [
                    {
                        type: "paragraph",
                        content: parseInlineMarkdown(quoteLines.join("\n"))
                    }
                ]
            });
            continue;
        }
        // Unordered list
        if (/^[-*+]\s+/.test(line)) {
            var listItems = [];
            while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
                var itemText = lines[i].replace(/^[-*+]\s+/, "");
                listItems.push({
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            content: parseInlineMarkdown(itemText)
                        }
                    ]
                });
                i++;
            }
            content.push({
                type: "bulletList",
                content: listItems
            });
            continue;
        }
        // Ordered list
        if (/^\d+\.\s+/.test(line)) {
            var listItems = [];
            while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
                var itemText = lines[i].replace(/^\d+\.\s+/, "");
                listItems.push({
                    type: "listItem",
                    content: [
                        {
                            type: "paragraph",
                            content: parseInlineMarkdown(itemText)
                        }
                    ]
                });
                i++;
            }
            content.push({
                type: "orderedList",
                content: listItems
            });
            continue;
        }
        // Empty line or regular paragraph
        if (line.trim() === "") {
            i++;
            continue;
        }
        // Regular paragraph
        content.push({
            type: "paragraph",
            content: parseInlineMarkdown(line)
        });
        i++;
    }
    if (content.length === 0) {
        return { type: "doc", content: [{ type: "paragraph" }] };
    }
    return { type: "doc", content: content };
}
/**
 * Parse inline markdown (bold, italic, links, code) into Tiptap nodes.
 */
function parseInlineMarkdown(text) {
    if (!text)
        return [];
    var nodes = [];
    var remaining = text;
    while (remaining.length > 0) {
        // Link: [text](url)
        var linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
            nodes.push({
                type: "text",
                text: linkMatch[1],
                marks: [{ type: "link", attrs: { href: linkMatch[2] } }]
            });
            remaining = remaining.slice(linkMatch[0].length);
            continue;
        }
        // Bold: **text** or __text__
        var boldMatch = remaining.match(/^(\*\*|__)(.+?)\1/);
        if (boldMatch) {
            nodes.push({
                type: "text",
                text: boldMatch[2],
                marks: [{ type: "bold" }]
            });
            remaining = remaining.slice(boldMatch[0].length);
            continue;
        }
        // Italic: *text* or _text_
        var italicMatch = remaining.match(/^(\*|_)([^*_]+)\1/);
        if (italicMatch) {
            nodes.push({
                type: "text",
                text: italicMatch[2],
                marks: [{ type: "italic" }]
            });
            remaining = remaining.slice(italicMatch[0].length);
            continue;
        }
        // Strikethrough: ~~text~~
        var strikeMatch = remaining.match(/^~~(.+?)~~/);
        if (strikeMatch) {
            nodes.push({
                type: "text",
                text: strikeMatch[1],
                marks: [{ type: "strike" }]
            });
            remaining = remaining.slice(strikeMatch[0].length);
            continue;
        }
        // Inline code: `text`
        var codeMatch = remaining.match(/^`([^`]+)`/);
        if (codeMatch) {
            nodes.push({
                type: "text",
                text: codeMatch[1],
                marks: [{ type: "code" }]
            });
            remaining = remaining.slice(codeMatch[0].length);
            continue;
        }
        // Plain text (find next special character or end)
        var nextSpecial = remaining.search(/[[*_~`]/);
        if (nextSpecial === -1) {
            nodes.push({ type: "text", text: remaining });
            break;
        }
        else if (nextSpecial === 0) {
            // The special character didn't match a pattern, treat as literal
            nodes.push({ type: "text", text: remaining[0] });
            remaining = remaining.slice(1);
        }
        else {
            nodes.push({ type: "text", text: remaining.slice(0, nextSpecial) });
            remaining = remaining.slice(nextSpecial);
        }
    }
    return nodes;
}
/**
 * Convert Tiptap JSON to Markdown format.
 * This is used when syncing from Carbon → Linear.
 */
function tiptapToMarkdown(tiptapDoc) {
    if (!tiptapDoc || !tiptapDoc.content)
        return "";
    return tiptapDoc.content.map(nodeToMarkdown).join("\n\n");
}
function nodeToMarkdown(node) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    switch (node.type) {
        case "paragraph":
            return node.content ? node.content.map(inlineToMarkdown).join("") : "";
        case "heading": {
            var level = (_b = (_a = node.attrs) === null || _a === void 0 ? void 0 : _a.level) !== null && _b !== void 0 ? _b : 1;
            var prefix = "#".repeat(level);
            var text = node.content
                ? node.content.map(inlineToMarkdown).join("")
                : "";
            return "".concat(prefix, " ").concat(text);
        }
        case "bulletList":
            return ((_c = node.content) !== null && _c !== void 0 ? _c : [])
                .map(function (item) {
                var _a, _b;
                var itemContent = (_b = (_a = item.content) === null || _a === void 0 ? void 0 : _a.map(nodeToMarkdown).join("\n")) !== null && _b !== void 0 ? _b : "";
                return "- ".concat(itemContent);
            })
                .join("\n");
        case "orderedList":
            return ((_d = node.content) !== null && _d !== void 0 ? _d : [])
                .map(function (item, index) {
                var _a, _b;
                var itemContent = (_b = (_a = item.content) === null || _a === void 0 ? void 0 : _a.map(nodeToMarkdown).join("\n")) !== null && _b !== void 0 ? _b : "";
                return "".concat(index + 1, ". ").concat(itemContent);
            })
                .join("\n");
        case "blockquote":
            return ((_e = node.content) !== null && _e !== void 0 ? _e : [])
                .map(function (child) { return "> ".concat(nodeToMarkdown(child)); })
                .join("\n");
        case "codeBlock": {
            var language = (_g = (_f = node.attrs) === null || _f === void 0 ? void 0 : _f.language) !== null && _g !== void 0 ? _g : "";
            var code = (_k = (_j = (_h = node.content) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.text) !== null && _k !== void 0 ? _k : "";
            return "```".concat(language, "\n").concat(code, "\n```");
        }
        case "horizontalRule":
            return "---";
        case "listItem":
            return (_m = (_l = node.content) === null || _l === void 0 ? void 0 : _l.map(nodeToMarkdown).join("\n")) !== null && _m !== void 0 ? _m : "";
        default:
            return node.content ? node.content.map(inlineToMarkdown).join("") : "";
    }
}
function inlineToMarkdown(node) {
    var _a, _b, _c;
    if (node.type === "text") {
        var text = (_a = node.text) !== null && _a !== void 0 ? _a : "";
        if (node.marks) {
            for (var _i = 0, _d = node.marks; _i < _d.length; _i++) {
                var mark = _d[_i];
                switch (mark.type) {
                    case "bold":
                        text = "**".concat(text, "**");
                        break;
                    case "italic":
                        text = "*".concat(text, "*");
                        break;
                    case "strike":
                        text = "~~".concat(text, "~~");
                        break;
                    case "code":
                        text = "`".concat(text, "`");
                        break;
                    case "link":
                        text = "[".concat(text, "](").concat((_c = (_b = mark.attrs) === null || _b === void 0 ? void 0 : _b.href) !== null && _c !== void 0 ? _c : "", ")");
                        break;
                }
            }
        }
        return text;
    }
    if (node.type === "hardBreak") {
        return "\n";
    }
    return "";
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
