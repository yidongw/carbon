"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bs_1 = require("react-icons/bs");
var ToolbarButton_1 = require("./ToolbarButton");
var Bold = function (_a) {
    var editor = _a.editor;
    return (<ToolbarButton_1.default label="Bold" onClick={function () { return editor.chain().focus().toggleBold().run(); }} isActive={editor.isActive("bold")} icon={<bs_1.BsTypeBold />} disabled={!editor.isEditable}/>);
};
exports.default = Bold;
