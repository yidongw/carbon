"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Youtube = exports.UpdatedImage = exports.TiptapUnderline = exports.TiptapLink = exports.TiptapImage = exports.TextStyle = exports.TaskList = exports.TaskItem = exports.StarterKit = exports.Placeholder = exports.MarkdownExtension = exports.InputRule = exports.ImageResizer = exports.HorizontalRule = exports.HighlightExtension = exports.GlobalDragHandle = exports.CustomKeymap = exports.Color = exports.CodeBlockLowlight = exports.CharacterCount = void 0;
exports.createPlaceholder = createPlaceholder;
var core_1 = require("@tiptap/core");
Object.defineProperty(exports, "InputRule", { enumerable: true, get: function () { return core_1.InputRule; } });
var extension_character_count_1 = require("@tiptap/extension-character-count");
exports.CharacterCount = extension_character_count_1.default;
var extension_code_block_lowlight_1 = require("@tiptap/extension-code-block-lowlight");
exports.CodeBlockLowlight = extension_code_block_lowlight_1.default;
var extension_color_1 = require("@tiptap/extension-color");
Object.defineProperty(exports, "Color", { enumerable: true, get: function () { return extension_color_1.Color; } });
var extension_highlight_1 = require("@tiptap/extension-highlight");
var extension_horizontal_rule_1 = require("@tiptap/extension-horizontal-rule");
var extension_image_1 = require("@tiptap/extension-image");
exports.TiptapImage = extension_image_1.default;
var extension_link_1 = require("@tiptap/extension-link");
exports.TiptapLink = extension_link_1.default;
var extension_placeholder_1 = require("@tiptap/extension-placeholder");
var extension_task_item_1 = require("@tiptap/extension-task-item");
Object.defineProperty(exports, "TaskItem", { enumerable: true, get: function () { return extension_task_item_1.TaskItem; } });
var extension_task_list_1 = require("@tiptap/extension-task-list");
Object.defineProperty(exports, "TaskList", { enumerable: true, get: function () { return extension_task_list_1.TaskList; } });
var extension_text_style_1 = require("@tiptap/extension-text-style");
exports.TextStyle = extension_text_style_1.default;
var extension_underline_1 = require("@tiptap/extension-underline");
exports.TiptapUnderline = extension_underline_1.default;
var extension_youtube_1 = require("@tiptap/extension-youtube");
exports.Youtube = extension_youtube_1.default;
var starter_kit_1 = require("@tiptap/starter-kit");
exports.StarterKit = starter_kit_1.default;
var tiptap_extension_global_drag_handle_1 = require("tiptap-extension-global-drag-handle");
exports.GlobalDragHandle = tiptap_extension_global_drag_handle_1.default;
var tiptap_markdown_1 = require("tiptap-markdown");
var custom_keymap_1 = require("./custom-keymap");
exports.CustomKeymap = custom_keymap_1.default;
var image_resizer_1 = require("./image-resizer");
Object.defineProperty(exports, "ImageResizer", { enumerable: true, get: function () { return image_resizer_1.ImageResizer; } });
var updated_image_1 = require("./updated-image");
exports.UpdatedImage = updated_image_1.default;
var PlaceholderExtension = extension_placeholder_1.default.configure({
    placeholder: function (_a) {
        var node = _a.node;
        if (node.type.name === "heading") {
            return "Heading ".concat(node.attrs.level);
        }
        return "Press '/' for commands";
    },
    includeChildren: true
});
exports.Placeholder = PlaceholderExtension;
function createPlaceholder(text) {
    return extension_placeholder_1.default.configure({
        placeholder: function (_a) {
            var node = _a.node;
            if (node.type.name === "heading") {
                return "Heading ".concat(node.attrs.level);
            }
            return text;
        },
        includeChildren: true
    });
}
var HighlightExtension = extension_highlight_1.default.configure({
    multicolor: true
});
exports.HighlightExtension = HighlightExtension;
var MarkdownExtension = tiptap_markdown_1.Markdown.configure({
    html: false,
    transformCopiedText: true
});
exports.MarkdownExtension = MarkdownExtension;
var Horizontal = extension_horizontal_rule_1.default.extend({
    addInputRules: function () {
        var _this = this;
        return [
            new core_1.InputRule({
                find: /^(?:---|—-|___\s|\*\*\*\s)$/u,
                handler: function (_a) {
                    var state = _a.state, range = _a.range;
                    var attributes = {};
                    var tr = state.tr;
                    var start = range.from;
                    var end = range.to;
                    tr.insert(start - 1, _this.type.create(attributes)).delete(tr.mapping.map(start), tr.mapping.map(end));
                }
            })
        ];
    }
});
exports.HorizontalRule = Horizontal;
__exportStar(require("./ai-highlight"), exports);
__exportStar(require("./mention"), exports);
__exportStar(require("./merge-token-highlight"), exports);
__exportStar(require("./slash-command"), exports);
