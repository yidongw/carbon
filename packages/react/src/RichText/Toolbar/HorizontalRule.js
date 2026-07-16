"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lu_1 = require("react-icons/lu");
var ToolbarButton_1 = require("./ToolbarButton");
var HorizontalRule = function (_a) {
    var editor = _a.editor;
    return (<ToolbarButton_1.default label="Horizontal rule" onClick={function () { return editor.chain().focus().setHorizontalRule().run(); }} icon={<lu_1.LuMinus />} disabled={!editor.isEditable}/>);
};
exports.default = HorizontalRule;
