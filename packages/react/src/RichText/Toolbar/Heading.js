"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadingThree = exports.HeadingTwo = exports.HeadingOne = void 0;
var lu_1 = require("react-icons/lu");
var ToolbarButton_1 = require("./ToolbarButton");
var HeadingOne = function (_a) {
    var editor = _a.editor;
    return (<ToolbarButton_1.default label="Heading 1" onClick={function () { return editor.chain().focus().toggleHeading({ level: 1 }).run(); }} isActive={editor.isActive("heading", { level: 1 })} icon={<lu_1.LuHeading1 />} disabled={!editor.isEditable}/>);
};
exports.HeadingOne = HeadingOne;
var HeadingTwo = function (_a) {
    var editor = _a.editor;
    return (<ToolbarButton_1.default label="Heading 2" onClick={function () { return editor.chain().focus().toggleHeading({ level: 2 }).run(); }} isActive={editor.isActive("heading", { level: 2 })} icon={<lu_1.LuHeading2 />} disabled={!editor.isEditable}/>);
};
exports.HeadingTwo = HeadingTwo;
var HeadingThree = function (_a) {
    var editor = _a.editor;
    return (<ToolbarButton_1.default label="Heading 3" onClick={function () { return editor.chain().focus().toggleHeading({ level: 3 }).run(); }} isActive={editor.isActive("heading", { level: 3 })} icon={<lu_1.LuHeading3 />} disabled={!editor.isEditable}/>);
};
exports.HeadingThree = HeadingThree;
