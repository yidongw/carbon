"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryBlock = SummaryBlock;
var renderer_1 = require("@react-pdf/renderer");
var purchase_order_1 = require("../../../utils/purchase-order");
var tw_1 = require("../tw");
function SummaryBlock(_a) {
    var _b, _c, _d;
    var block = _a.block, data = _a.data;
    var tw = (0, tw_1.useTw)();
    var purchaseOrderLines = data.purchaseOrderLines, purchaseOrder = data.purchaseOrder, currencyCode = data.currencyCode, numberFormatter = data.numberFormatter;
    var taxLabel = ((_c = (_b = block.options) === null || _b === void 0 ? void 0 : _b.taxLabel) === null || _c === void 0 ? void 0 : _c.trim()) || "Tax";
    var shippingCost = (_d = purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.supplierShippingCost) !== null && _d !== void 0 ? _d : 0;
    var taxAmount = purchaseOrderLines.reduce(function (acc, line) { var _a; return acc + ((_a = line.supplierTaxAmount) !== null && _a !== void 0 ? _a : 0); }, 0);
    return (<renderer_1.View style={tw("mb-4")}>
      <renderer_1.View style={[
            tw("flex flex-row py-1.5 px-3 text-[9px]"),
            { backgroundColor: "rgba(249, 250, 251, 0.6)" }
        ]}>
        <renderer_1.Text style={tw("w-[87%] text-right pr-3 text-gray-600")}>
          Subtotal ({currencyCode})
        </renderer_1.Text>
        <renderer_1.Text style={tw("w-[13%] text-center text-gray-800")}>
          {numberFormatter.format(purchaseOrderLines.reduce(function (sum, line) {
            if ((line === null || line === void 0 ? void 0 : line.purchaseQuantity) && (line === null || line === void 0 ? void 0 : line.supplierUnitPrice)) {
                return sum + line.purchaseQuantity * line.supplierUnitPrice;
            }
            return sum;
        }, 0))}
        </renderer_1.Text>
      </renderer_1.View>

      {shippingCost > 0 && (<renderer_1.View style={[
                tw("flex flex-row py-1.5 px-3 text-[9px]"),
                { backgroundColor: "rgba(249, 250, 251, 0.6)" }
            ]}>
          <renderer_1.Text style={tw("w-[87%] text-right pr-3 text-gray-600")}>
            Shipping ({currencyCode})
          </renderer_1.Text>
          <renderer_1.Text style={tw("w-[13%] text-center text-gray-800")}>
            {numberFormatter.format(shippingCost)}
          </renderer_1.Text>
        </renderer_1.View>)}

      {taxAmount > 0 && (<renderer_1.View style={[
                tw("flex flex-row py-1.5 px-3 text-[9px]"),
                { backgroundColor: "rgba(249, 250, 251, 0.6)" }
            ]}>
          <renderer_1.Text style={tw("w-[87%] text-right pr-3 text-gray-600")}>
            {taxLabel} ({currencyCode})
          </renderer_1.Text>
          <renderer_1.Text style={tw("w-[13%] text-center text-gray-800")}>
            {numberFormatter.format(taxAmount)}
          </renderer_1.Text>
        </renderer_1.View>)}

      <renderer_1.View style={tw("h-[1px] bg-gray-200")}/>
      <renderer_1.View style={tw("flex flex-row py-2 px-3 text-[9px]")}>
        <renderer_1.Text style={tw("w-[87%] text-right pr-3 text-gray-800 font-bold")}>
          Total ({currencyCode})
        </renderer_1.Text>
        <renderer_1.Text style={tw("w-[13%] text-center text-gray-800 font-bold")}>
          {numberFormatter.format((0, purchase_order_1.getTotal)(purchaseOrderLines) + shippingCost)}
        </renderer_1.Text>
      </renderer_1.View>
    </renderer_1.View>);
}
