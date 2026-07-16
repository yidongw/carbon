"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichTextBlock = RichTextBlock;
var renderer_1 = require("@react-pdf/renderer");
var template_1 = require("../../template");
var components_1 = require("../components");
var tw_1 = require("./tw");
/**
 * Extension block — doc-agnostic. Takes only the merge-field `vars` so any
 * document's registry can reuse it.
 */
function RichTextBlock(_a) {
    var block = _a.block, vars = _a.vars;
    var tw = (0, tw_1.useTw)();
    var hasContent = block.content &&
        typeof block.content === "object" &&
        Array.isArray(block.content.content) &&
        block.content.content.length > 0;
    if (!hasContent && !block.title)
        return null;
    var content = hasContent
        ? (0, template_1.interpolateContent)(block.content, vars)
        : block.content;
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("p-3")}>
        {block.title && (<renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
            {block.title}
          </renderer_1.Text>)}
        {hasContent && (<renderer_1.View style={tw("text-[9px] text-gray-800")}>
            <components_1.Note content={content}/>
          </renderer_1.View>)}
      </renderer_1.View>
    </renderer_1.View>);
}
