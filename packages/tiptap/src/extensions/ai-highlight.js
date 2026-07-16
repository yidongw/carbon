"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAIHighlight = exports.removeAIHighlight = exports.AIHighlight = exports.pasteRegex = exports.inputRegex = void 0;
var core_1 = require("@tiptap/core");
exports.inputRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))$/;
exports.pasteRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))/g;
exports.AIHighlight = core_1.Mark.create({
    name: "ai-highlight",
    addOptions: function () {
        return {
            HTMLAttributes: {}
        };
    },
    addAttributes: function () {
        return {
            color: {
                default: null,
                parseHTML: function (element) {
                    return element.getAttribute("data-color") || element.style.backgroundColor;
                },
                renderHTML: function (attributes) {
                    if (!attributes.color) {
                        return {};
                    }
                    return {
                        "data-color": attributes.color,
                        style: "background-color: ".concat(attributes.color, "; color: inherit")
                    };
                }
            }
        };
    },
    parseHTML: function () {
        return [
            {
                tag: "mark"
            }
        ];
    },
    renderHTML: function (_a) {
        var HTMLAttributes = _a.HTMLAttributes;
        return [
            "mark",
            (0, core_1.mergeAttributes)(this.options.HTMLAttributes, HTMLAttributes),
            0
        ];
    },
    addCommands: function () {
        var _this = this;
        return {
            setAIHighlight: function (attributes) {
                return function (_a) {
                    var commands = _a.commands;
                    return commands.setMark(_this.name, attributes);
                };
            },
            toggleAIHighlight: function (attributes) {
                return function (_a) {
                    var commands = _a.commands;
                    return commands.toggleMark(_this.name, attributes);
                };
            },
            unsetAIHighlight: function () {
                return function (_a) {
                    var commands = _a.commands;
                    return commands.unsetMark(_this.name);
                };
            }
        };
    },
    addKeyboardShortcuts: function () {
        var _this = this;
        return {
            "Mod-Shift-h": function () { return _this.editor.commands.toggleAIHighlight(); }
        };
    },
    addInputRules: function () {
        return [
            (0, core_1.markInputRule)({
                find: exports.inputRegex,
                type: this.type
            })
        ];
    },
    addPasteRules: function () {
        return [
            (0, core_1.markPasteRule)({
                find: exports.pasteRegex,
                type: this.type
            })
        ];
    }
});
var removeAIHighlight = function (editor) {
    var tr = editor.state.tr;
    tr.removeMark(0, editor.state.doc.nodeSize - 2, editor.state.schema.marks["ai-highlight"]);
    editor.view.dispatch(tr);
};
exports.removeAIHighlight = removeAIHighlight;
var addAIHighlight = function (editor, color) {
    editor
        .chain()
        .setAIHighlight({ color: color !== null && color !== void 0 ? color : "#c1ecf970" })
        .run();
};
exports.addAIHighlight = addAIHighlight;
