"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MergeTokenHighlight = void 0;
var core_1 = require("@tiptap/core");
var state_1 = require("@tiptap/pm/state");
var view_1 = require("@tiptap/pm/view");
/** Matches a single-brace merge token like `{invoice.number}`. */
var TOKEN_RE = /\{[\w.]+\}/g;
var KNOWN_CLS = "rounded-sm bg-blue-500/25 ring-1 ring-blue-500/50 px-0.5";
var UNKNOWN_CLS = "rounded-sm bg-destructive/20 ring-1 ring-destructive/50 px-0.5";
/**
 * Visually highlights `{token}` merge fields with an inline decoration. Purely
 * decorative — the document content stays plain `{token}` text, so merge-field
 * interpolation is unaffected.
 */
exports.MergeTokenHighlight = core_1.Extension.create({
    name: "mergeTokenHighlight",
    addOptions: function () {
        return { knownTokens: [] };
    },
    addProseMirrorPlugins: function () {
        var options = this.options;
        return [
            new state_1.Plugin({
                key: new state_1.PluginKey("mergeTokenHighlight"),
                props: {
                    decorations: function (state) {
                        var known = new Set(options.knownTokens);
                        var decorations = [];
                        state.doc.descendants(function (node, pos) {
                            if (!node.isText || !node.text)
                                return;
                            var re = new RegExp(TOKEN_RE);
                            var match = re.exec(node.text);
                            while (match !== null) {
                                var token = match[0].slice(1, -1);
                                var cls = known.size === 0 || known.has(token)
                                    ? KNOWN_CLS
                                    : UNKNOWN_CLS;
                                var from = pos + match.index;
                                decorations.push(view_1.Decoration.inline(from, from + match[0].length, {
                                    class: cls
                                }));
                                match = re.exec(node.text);
                            }
                        });
                        return view_1.DecorationSet.create(state.doc, decorations);
                    }
                }
            })
        ];
    }
});
