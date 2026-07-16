"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lu_1 = require("react-icons/lu");
var ToolbarButton_1 = require("./ToolbarButton");
var Code = function (_a) {
    var editor = _a.editor;
    return (<ToolbarButton_1.default label="Code" onClick={function () { return editor.chain().focus().toggleCode().run(); }} isActive={editor.isActive("code")} icon={<lu_1.LuCode />} disabled={!editor.isEditable}/>);
};
exports.default = Code;
