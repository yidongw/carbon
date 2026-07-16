"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lu_1 = require("react-icons/lu");
var ToolbarButton_1 = require("./ToolbarButton");
var OrderedList = function (_a) {
    var editor = _a.editor;
    return (<ToolbarButton_1.default label="Numbered list" onClick={function () { return editor.chain().focus().toggleOrderedList().run(); }} isActive={editor.isActive("orderedList")} icon={<lu_1.LuListOrdered />} disabled={!editor.isEditable}/>);
};
exports.default = OrderedList;
