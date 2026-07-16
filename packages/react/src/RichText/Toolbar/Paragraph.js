"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lu_1 = require("react-icons/lu");
var ToolbarButton_1 = require("./ToolbarButton");
var Paragraph = function (_a) {
    var editor = _a.editor;
    return (<ToolbarButton_1.default label="Normal text" onClick={function () { return editor.chain().focus().setParagraph().run(); }} isActive={editor.isActive("paragraph")} icon={<lu_1.LuText />} disabled={!editor.isEditable}/>);
};
exports.default = Paragraph;
