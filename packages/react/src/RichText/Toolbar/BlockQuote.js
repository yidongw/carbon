"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lu_1 = require("react-icons/lu");
var ToolbarButton_1 = require("./ToolbarButton");
var BlockQuote = function (_a) {
    var editor = _a.editor;
    return (<ToolbarButton_1.default label="Blockquote" onClick={function () { return editor.chain().focus().toggleBlockquote().run(); }} isActive={editor.isActive("blockquote")} icon={<lu_1.LuQuote />} disabled={!editor.isEditable}/>);
};
exports.default = BlockQuote;
