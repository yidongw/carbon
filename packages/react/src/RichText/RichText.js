"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichText = exports.useRichText = void 0;
var extension_color_1 = require("@tiptap/extension-color");
var extension_list_item_1 = require("@tiptap/extension-list-item");
var extension_text_style_1 = require("@tiptap/extension-text-style");
var react_1 = require("@tiptap/react");
var starter_kit_1 = require("@tiptap/starter-kit");
var cn_1 = require("../utils/cn");
var VStack_1 = require("../VStack");
var Toolbar_1 = require("./Toolbar");
var useRichText = function (content) {
    var richText = (0, react_1.useEditor)({
        // Avoid SSR hydration mismatch (Tiptap renders on the client).
        immediatelyRender: false,
        extensions: [
            extension_color_1.Color.configure({ types: [extension_text_style_1.default.name, extension_list_item_1.default.name] }),
            extension_text_style_1.default,
            starter_kit_1.default.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
                }
            })
        ],
        content: content
    });
    return richText;
};
exports.useRichText = useRichText;
var RichText = function (_a) {
    var editor = _a.editor, className = _a.className, props = __rest(_a, ["editor", "className"]);
    if (!editor) {
        return null;
    }
    return (<VStack_1.VStack spacing={0}>
      <Toolbar_1.Toolbar editor={editor}/>
      <react_1.EditorContent editor={editor} className={(0, cn_1.cn)("w-full min-h-[300px] bg-background [&h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:text-lg [&_h3]:font-bold [&_h3]:tracking-tight [&_ul]:list-disc [&_ol]:list-decimal [&_ul], [&_ol]:ml-4 [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-auto [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:ml-4 [&_hr]:border-none [&_hr]:border-b-1 [&_hr]:border-gray-200 [&_hr]:my-4 [&_.ProseMirror]:p-4 [&_.ProseMirror]:h-full [&_.ProseMirror]:outline-none [&_.ProseMirror]:focus:outline-none [&_.ProseMirror]:focus-visible:outline-none [&_.ProseMirror]:focus-visible:border-ring [&_.ProseMirror]:focus-visible:ring-[3px] [&_.ProseMirror]:focus-visible:ring-ring/50", className)} {...props}/>
    </VStack_1.VStack>);
};
exports.RichText = RichText;
