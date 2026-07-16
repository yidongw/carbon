"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML = exports.generateHTML = void 0;
var tiptap_1 = require("@carbon/tiptap");
var extension_text_style_1 = require("@tiptap/extension-text-style");
var extension_underline_1 = require("@tiptap/extension-underline");
var react_1 = require("@tiptap/react");
var starter_kit_1 = require("@tiptap/starter-kit");
var dompurify_1 = require("dompurify");
var extensions_1 = require("./Editor/extensions");
var sanitize = dompurify_1.default.sanitize;
var generateHTML = function (content) {
    if (typeof window === "undefined") {
        return "";
    }
    if (!content || !("type" in content)) {
        return "";
    }
    var raw = (0, react_1.generateHTML)(content, __spreadArray(__spreadArray([], extensions_1.defaultExtensions, true), [
        extension_text_style_1.default,
        starter_kit_1.default,
        extension_underline_1.default,
        tiptap_1.Mention.configure({
            HTMLAttributes: {
                class: "mention"
            }
        })
    ], false));
    return sanitize(raw);
};
exports.generateHTML = generateHTML;
var HTML = function (_a) {
    var text = _a.text;
    return (<div className="[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h3]:text-lg [&_h3]:font-bold [&_h3]:tracking-tight [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ml-4 [&_ol]:ml-4 [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-md [&_pre]:overflow-auto [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:pl-4 [&_blockquote]:ml-4 [&_hr]:border-none [&_hr]:border-b-1 [&_hr]:border-gray-200 [&_hr]:my-4">
      <span dangerouslySetInnerHTML={typeof window === "undefined"
            ? { __html: "" }
            : { __html: sanitize(text) }}/>
    </div>);
};
exports.HTML = HTML;
