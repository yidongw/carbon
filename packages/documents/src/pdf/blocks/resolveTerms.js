"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasContent = hasContent;
exports.resolveTerms = resolveTerms;
var template_1 = require("../../template");
/** True when a tiptap doc has at least one node (i.e. renders something). */
function hasContent(content) {
    return Boolean(content &&
        typeof content === "object" &&
        Array.isArray(content.content) &&
        content.content.length > 0);
}
/**
 * The effective terms for a document: the block's own authored content
 * (interpolated with merge fields) when present, otherwise the company-level
 * terms setting passed in as `fallback`. Returns undefined when neither exists.
 */
function resolveTerms(block, fallback, vars) {
    if (hasContent(block.content)) {
        return (0, template_1.interpolateContent)(block.content, vars);
    }
    return fallback;
}
