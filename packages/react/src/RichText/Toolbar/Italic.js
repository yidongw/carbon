"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lu_1 = require("react-icons/lu");
var ToolbarButton_1 = require("./ToolbarButton");
var Italic = function (_a) {
    var editor = _a.editor;
    return (<ToolbarButton_1.default label="Italic" onClick={function () { return editor.chain().focus().toggleItalic().run(); }} isActive={editor.isActive("italic")} icon={<lu_1.LuItalic />} disabled={!editor.isEditable}>
      I
    </ToolbarButton_1.default>);
};
exports.default = Italic;
