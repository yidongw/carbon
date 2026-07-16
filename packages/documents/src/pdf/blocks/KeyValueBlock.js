"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyValueBlock = KeyValueBlock;
var renderer_1 = require("@react-pdf/renderer");
var template_1 = require("../../template");
var tw_1 = require("./tw");
/** Extension block — doc-agnostic. Takes only the merge-field `vars`. */
function KeyValueBlock(_a) {
    var _b;
    var block = _a.block, vars = _a.vars;
    var tw = (0, tw_1.useTw)();
    var rows = (_b = block.rows) !== null && _b !== void 0 ? _b : [];
    if (rows.length === 0 && !block.title)
        return null;
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("p-3")}>
        {block.title && (<renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
            {block.title}
          </renderer_1.Text>)}
        <renderer_1.View style={tw("text-[9px] text-gray-800")}>
          {rows.map(function (row, index) { return (<renderer_1.View key={"".concat(row.label, "-").concat(index)} style={tw("flex flex-row mb-0.5")}>
              <renderer_1.Text style={tw("w-1/3 text-gray-600")}>
                {(0, template_1.interpolateString)(row.label, vars)}
              </renderer_1.Text>
              <renderer_1.Text style={tw("w-2/3 text-gray-800")}>
                {(0, template_1.interpolateString)(row.value, vars)}
              </renderer_1.Text>
            </renderer_1.View>); })}
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
