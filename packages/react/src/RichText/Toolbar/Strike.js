"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lu_1 = require("react-icons/lu");
var ToolbarButton_1 = require("./ToolbarButton");
var Strike = function (_a) {
    var editor = _a.editor;
    return (<ToolbarButton_1.default label="Strike" onClick={function () { return editor.chain().focus().toggleStrike().run(); }} isActive={editor.isActive("strike")} icon={<lu_1.LuStrikethrough />} disabled={!editor.isEditable}/>);
};
exports.default = Strike;
