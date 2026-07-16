"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lu_1 = require("react-icons/lu");
var ToolbarButton_1 = require("./ToolbarButton");
var CodeBlock = function (_a) {
    var editor = _a.editor;
    return (<ToolbarButton_1.default label="Codeblock" onClick={function () { return editor.chain().focus().toggleCodeBlock().run(); }} isActive={editor.isActive("codeBlock")} icon={<lu_1.LuCodeXml />} disabled={!editor.isEditable}/>);
};
exports.default = CodeBlock;
