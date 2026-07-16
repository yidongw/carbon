"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@tiptap/core");
var CustomKeymap = core_1.Extension.create({
    name: "CustomKeymap",
    addCommands: function () {
        return {
            selectTextWithinNodeBoundaries: function () {
                return function (_a) {
                    var editor = _a.editor, commands = _a.commands;
                    var state = editor.state;
                    var tr = state.tr;
                    var startNodePos = tr.selection.$from.start();
                    var endNodePos = tr.selection.$to.end();
                    return commands.setTextSelection({
                        from: startNodePos,
                        to: endNodePos
                    });
                };
            }
        };
    },
    addKeyboardShortcuts: function () {
        return {
            "Mod-a": function (_a) {
                var editor = _a.editor;
                var state = editor.state;
                var tr = state.tr;
                var startSelectionPos = tr.selection.from;
                var endSelectionPos = tr.selection.to;
                var startNodePos = tr.selection.$from.start();
                var endNodePos = tr.selection.$to.end();
                var isCurrentTextSelectionNotExtendedToNodeBoundaries = startSelectionPos > startNodePos || endSelectionPos < endNodePos;
                if (isCurrentTextSelectionNotExtendedToNodeBoundaries) {
                    editor.chain().selectTextWithinNodeBoundaries().run();
                    return true;
                }
                return false;
            }
        };
    }
});
exports.default = CustomKeymap;
