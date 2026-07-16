"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldBlock = FieldBlock;
var renderer_1 = require("@react-pdf/renderer");
var template_1 = require("../../template");
var tw_1 = require("./tw");
/**
 * Extension block — doc-agnostic. A single line of plain text: an optional
 * bold `label` followed by an interpolated `value`. The simple alternative to
 * rich text when a user just needs one labelled line. Takes only the merge
 * `vars` so any document's registry can reuse it.
 */
function FieldBlock(_a) {
    var _b;
    var block = _a.block, vars = _a.vars;
    var tw = (0, tw_1.useTw)();
    var value = (0, template_1.interpolateString)((_b = block.value) !== null && _b !== void 0 ? _b : "", vars);
    if (!value && !block.label)
        return null;
    return (<renderer_1.View style={tw("flex flex-row mb-2 text-[10px] text-gray-800")}>
      {block.label ? (<>
          <renderer_1.Text style={tw("font-bold mr-1")}>{block.label}:</renderer_1.Text>
          <renderer_1.Text>{value}</renderer_1.Text>
        </>) : (<renderer_1.Text>{value}</renderer_1.Text>)}
    </renderer_1.View>);
}
