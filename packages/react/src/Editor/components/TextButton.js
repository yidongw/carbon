"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextButtons = void 0;
var tiptap_1 = require("@carbon/tiptap");
var bs_1 = require("react-icons/bs");
var IconButton_1 = require("../../IconButton");
var TextButtons = function () {
    var editor = (0, tiptap_1.useEditor)().editor;
    if (!editor)
        return null;
    var items = [
        {
            name: "bold",
            isActive: function (editor) { return editor.isActive("bold"); },
            command: function (editor) { return editor.chain().focus().toggleBold().run(); },
            icon: bs_1.BsTypeBold
        },
        {
            name: "italic",
            isActive: function (editor) { return editor.isActive("italic"); },
            command: function (editor) { return editor.chain().focus().toggleItalic().run(); },
            icon: bs_1.BsTypeItalic
        },
        {
            name: "underline",
            isActive: function (editor) { return editor.isActive("underline"); },
            command: function (editor) { return editor.chain().focus().toggleUnderline().run(); },
            icon: bs_1.BsTypeUnderline
        },
        {
            name: "strike",
            isActive: function (editor) { return editor.isActive("strike"); },
            command: function (editor) { return editor.chain().focus().toggleStrike().run(); },
            icon: bs_1.BsTypeStrikethrough
        },
        {
            name: "code",
            isActive: function (editor) { return editor.isActive("code"); },
            command: function (editor) { return editor.chain().focus().toggleCode().run(); },
            icon: bs_1.BsCodeSlash
        }
    ];
    return (<div className="flex">
      {items.map(function (item, index) { return (<tiptap_1.EditorBubbleItem key={index} onSelect={function (editor) {
                item.command(editor);
            }}>
          <IconButton_1.IconButton aria-label={item.name} icon={<item.icon />} variant={item.isActive(editor) ? "active" : "ghost"}/>
        </tiptap_1.EditorBubbleItem>); })}
    </div>);
};
exports.TextButtons = TextButtons;
