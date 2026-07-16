"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFieldBlock = CustomFieldBlock;
var renderer_1 = require("@react-pdf/renderer");
var tw_1 = require("./tw");
function formatValue(raw) {
    if (raw === "on" || raw === true)
        return "Yes";
    if (raw === "off" || raw === false)
        return "No";
    if (raw == null)
        return "—";
    return String(raw);
}
/** Extension block — doc-agnostic. Takes the record's `customFields` map. */
function CustomFieldBlock(_a) {
    var block = _a.block, customFields = _a.customFields;
    var tw = (0, tw_1.useTw)();
    var value = formatValue(customFields[block.fieldId]);
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("flex flex-row p-3 text-[9px]")}>
        <renderer_1.Text style={tw("w-1/3 text-gray-600")}>{block.label || "—"}</renderer_1.Text>
        <renderer_1.Text style={tw("w-2/3 text-gray-800")}>{value}</renderer_1.Text>
      </renderer_1.View>
    </renderer_1.View>);
}
