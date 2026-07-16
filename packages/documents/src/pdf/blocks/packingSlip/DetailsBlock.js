"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailsBlock = DetailsBlock;
var renderer_1 = require("@react-pdf/renderer");
var tw_1 = require("../tw");
/** Shipping method + Payment terms box. */
function DetailsBlock(_a) {
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var shippingMethod = data.shippingMethod, paymentTerm = data.paymentTerm;
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("flex flex-row")}>
        <renderer_1.View style={tw("w-1/2 p-3 border-r border-gray-200")}>
          <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
            Shipping
          </renderer_1.Text>
          <renderer_1.View style={tw("text-[10px] text-gray-800")}>
            {(shippingMethod === null || shippingMethod === void 0 ? void 0 : shippingMethod.name) && <renderer_1.Text>Method: {shippingMethod.name}</renderer_1.Text>}
          </renderer_1.View>
        </renderer_1.View>
        <renderer_1.View style={tw("w-1/2 p-3")}>
          <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
            Payment
          </renderer_1.Text>
          <renderer_1.View style={tw("text-[10px] text-gray-800")}>
            {(paymentTerm === null || paymentTerm === void 0 ? void 0 : paymentTerm.name) && <renderer_1.Text>Terms: {paymentTerm.name}</renderer_1.Text>}
          </renderer_1.View>
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
