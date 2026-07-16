"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bs_1 = require("react-icons/bs");
var ToolbarButton_1 = require("./ToolbarButton");
var UnorderedList = function (_a) {
    var editor = _a.editor;
    return (<ToolbarButton_1.default label="Bullet list" onClick={function () { return editor.chain().focus().toggleBulletList().run(); }} isActive={editor.isActive("bulletList")} icon={<bs_1.BsListUl />} disabled={!editor.isEditable}/>);
};
exports.default = UnorderedList;
