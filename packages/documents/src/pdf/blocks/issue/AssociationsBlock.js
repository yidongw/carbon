"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociationsBlock = AssociationsBlock;
var renderer_1 = require("@react-pdf/renderer");
var tw_1 = require("../tw");
/** A single labeled association row (label + readable id). */
function Row(_a) {
    var label = _a.label, value = _a.value;
    var tw = (0, tw_1.useTw)();
    var rowStyle = tw("flex flex-row gap-2 text-[10px] py-1 border-b border-gray-200");
    return (<renderer_1.View style={rowStyle}>
      <renderer_1.Text style={tw("w-1/4 font-bold text-gray-600")}>{label}:</renderer_1.Text>
      <renderer_1.Text style={tw("text-gray-800")}>{value}</renderer_1.Text>
    </renderer_1.View>);
}
/** Groups that render as a plain label + documentReadableId, in order. */
var SIMPLE_GROUPS = [
    { key: "customers", label: "Customer" },
    { key: "suppliers", label: "Supplier" },
    { key: "jobOperations", label: "Job Operation" },
    { key: "purchaseOrderLines", label: "Purchase Order" },
    { key: "salesOrderLines", label: "Sales Order" },
    { key: "shipmentLines", label: "Shipment" },
    { key: "receiptLines", label: "Receipt" },
    { key: "trackedEntities", label: "Tracked Entity" }
];
/** Related entities grouped by type. Renders nothing when there are none. */
function AssociationsBlock(_a) {
    var _b;
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var rowStyle = tw("flex flex-row gap-2 text-[10px] py-1 border-b border-gray-200");
    var associations = data.associations;
    if (!associations)
        return null;
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("p-3")}>
        <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
          Associations
        </renderer_1.Text>
        <renderer_1.View style={tw("flex flex-col")}>
          {(_b = associations.items) === null || _b === void 0 ? void 0 : _b.map(function (item) { return (<renderer_1.View key={item.id} style={rowStyle}>
              <renderer_1.Text style={tw("w-1/4 font-bold text-gray-600")}>Item:</renderer_1.Text>
              <renderer_1.Text style={tw("text-gray-800")}>{item.documentReadableId}</renderer_1.Text>
              {item.disposition && (<>
                  <renderer_1.Text style={tw("text-gray-400")}>-</renderer_1.Text>
                  <renderer_1.Text style={tw("text-gray-800")}>{item.disposition}</renderer_1.Text>
                </>)}
              {item.quantity && (<>
                  <renderer_1.Text style={tw("text-gray-400")}>-</renderer_1.Text>
                  <renderer_1.Text style={tw("text-gray-800")}>Qty: {item.quantity}</renderer_1.Text>
                </>)}
            </renderer_1.View>); })}
          {SIMPLE_GROUPS.flatMap(function (_a) {
            var _b;
            var key = _a.key, label = _a.label;
            return ((_b = associations[key]) !== null && _b !== void 0 ? _b : []).map(function (row) { return (<Row key={row.id} label={label} value={row.documentReadableId}/>); });
        })}
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
