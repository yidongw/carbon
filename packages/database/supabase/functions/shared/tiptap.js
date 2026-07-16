"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTiptapDoc = toTiptapDoc;
// Mirrors `textToTiptap` from @carbon/utils. Kept local because edge functions run on
// Deno and don't resolve the workspace import map.
function textToTiptap(text) {
    var lines = text.split("\n");
    var content = lines.map(function (line) {
        // ProseMirror text nodes cannot be empty, so blank lines become a bare paragraph
        return line === ""
            ? { type: "paragraph" }
            : { type: "paragraph", content: [{ type: "text", text: line }] };
    });
    return { type: "doc", content: content };
}
/**
 * Normalize an operation-step `description` into a valid tiptap doc (jsonb object).
 *
 * The Supabase client returns jsonb scalar strings as JS strings; re-inserting a JS
 * string into a jsonb column makes node-pg send unquoted text and Postgres rejects it.
 * Objects pass through, strings are wrapped into a doc, and null/empty become {}.
 */
function toTiptapDoc(value) {
    if (value && typeof value === "object")
        return value;
    if (typeof value === "string" && value.length > 0)
        return textToTiptap(value);
    return {};
}
