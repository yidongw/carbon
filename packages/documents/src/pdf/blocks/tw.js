"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocStyleProvider = exports.tw = void 0;
exports.makeDocTw = makeDocTw;
exports.useTw = useTw;
exports.useDocTheme = useDocTheme;
var react_1 = require("react");
var react_pdf_tailwind_1 = require("react-pdf-tailwind");
var template_1 = require("../../template");
/**
 * Build a Tailwind instance for sales-document blocks whose gray palette is
 * driven by the document theme. The blocks reference semantic grays
 * (`text-gray-800` body, `text-gray-600` headings, `border-gray-200`…), so
 * remapping the palette re-colors every block from one place instead of
 * touching each call site.
 */
function makeDocTw(theme) {
    return (0, react_pdf_tailwind_1.createTw)({
        theme: {
            fontFamily: {
                sans: ["Inter", "Helvetica", "Arial", "sans-serif"]
            },
            extend: {
                colors: {
                    gray: {
                        50: "#f9fafb",
                        200: "#e5e7eb",
                        400: "#9ca3af",
                        // Theme-driven: section headings + body text.
                        600: theme.heading,
                        800: theme.text
                    }
                }
            }
        }
    });
}
/**
 * Default (unthemed) instance — also the context fallback, so a shared block
 * rendered outside a themed document still produces the original palette.
 */
exports.tw = makeDocTw(template_1.DEFAULT_THEME);
var DocStyleContext = (0, react_1.createContext)({
    tw: exports.tw,
    theme: template_1.DEFAULT_THEME
});
/** Provide a document's theme (and derived `tw`) to its block tree. */
exports.DocStyleProvider = DocStyleContext.Provider;
/** Read the document-themed `tw` (falls back to the default palette). */
function useTw() {
    return (0, react_1.useContext)(DocStyleContext).tw;
}
/** Read the raw document theme (e.g. for inline `theme.accent` styling). */
function useDocTheme() {
    return (0, react_1.useContext)(DocStyleContext).theme;
}
