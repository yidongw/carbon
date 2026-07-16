"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummaryBlock = SummaryBlock;
var renderer_1 = require("@react-pdf/renderer");
var template_1 = require("../../template");
var sales_invoice_1 = require("../../utils/sales-invoice");
var tw_1 = require("./tw");
function SummaryBlock(_a) {
    var _b;
    var block = _a.block, data = _a.data;
    var tw = (0, tw_1.useTw)();
    var salesInvoiceLines = data.salesInvoiceLines, salesInvoice = data.salesInvoice, salesInvoiceShipment = data.salesInvoiceShipment, currencyCode = data.currencyCode, numberFormatter = data.numberFormatter;
    var opts = __assign(__assign({}, template_1.DEFAULT_SUMMARY_OPTIONS), block.options);
    var taxLabel = ((_b = opts.taxLabel) === null || _b === void 0 ? void 0 : _b.trim()) || template_1.DEFAULT_SUMMARY_OPTIONS.taxLabel;
    return (<renderer_1.View style={tw("mb-4")}>
      <renderer_1.View>
        {/* Subtotal - extended price only */}
        <renderer_1.View style={[
            tw("flex flex-row py-1.5 px-3 text-[9px]"),
            { backgroundColor: "rgba(249, 250, 251, 0.6)" }
        ]}>
          <renderer_1.Text style={tw("w-5/6 text-right pr-3 text-gray-600")}>
            Subtotal ({currencyCode})
          </renderer_1.Text>
          <renderer_1.Text style={tw("w-1/6 text-center text-gray-800")}>
            {numberFormatter.format(salesInvoiceLines.reduce(function (sum, line) { var _a, _b; return sum + ((_a = line.quantity) !== null && _a !== void 0 ? _a : 0) * ((_b = line.convertedUnitPrice) !== null && _b !== void 0 ? _b : 0); }, 0))}
          </renderer_1.Text>
        </renderer_1.View>

        {/* Add-Ons */}
        {salesInvoiceLines.some(function (line) {
            var _a, _b;
            return ((_a = line.convertedAddOnCost) !== null && _a !== void 0 ? _a : 0) > 0 ||
                ((_b = line.convertedNonTaxableAddOnCost) !== null && _b !== void 0 ? _b : 0) > 0;
        }) && (<renderer_1.View style={[
                tw("flex flex-row py-1.5 px-3 text-[9px]"),
                { backgroundColor: "rgba(249, 250, 251, 0.6)" }
            ]}>
            <renderer_1.Text style={tw("w-5/6 text-right pr-3 text-gray-600")}>
              Add-Ons ({currencyCode})
            </renderer_1.Text>
            <renderer_1.Text style={tw("w-1/6 text-center text-gray-800")}>
              {numberFormatter.format(salesInvoiceLines.reduce(function (sum, line) {
                var _a, _b;
                return sum +
                    ((_a = line.convertedAddOnCost) !== null && _a !== void 0 ? _a : 0) +
                    ((_b = line.convertedNonTaxableAddOnCost) !== null && _b !== void 0 ? _b : 0);
            }, 0))}
            </renderer_1.Text>
          </renderer_1.View>)}

        {/* Shipping */}
        {(function () {
            var _a, _b;
            var lineShipping = salesInvoiceLines.reduce(function (sum, line) { var _a; return sum + ((_a = line.convertedShippingCost) !== null && _a !== void 0 ? _a : 0); }, 0);
            var invoiceShipping = ((_a = salesInvoiceShipment === null || salesInvoiceShipment === void 0 ? void 0 : salesInvoiceShipment.shippingCost) !== null && _a !== void 0 ? _a : 0) *
                ((_b = salesInvoice.exchangeRate) !== null && _b !== void 0 ? _b : 1);
            var totalShipping = lineShipping + invoiceShipping;
            return totalShipping > 0 ? (<renderer_1.View style={[
                    tw("flex flex-row py-1.5 px-3 text-[9px]"),
                    { backgroundColor: "rgba(249, 250, 251, 0.6)" }
                ]}>
              <renderer_1.Text style={tw("w-5/6 text-right pr-3 text-gray-600")}>
                Shipping ({currencyCode})
              </renderer_1.Text>
              <renderer_1.Text style={tw("w-1/6 text-center text-gray-800")}>
                {numberFormatter.format(totalShipping)}
              </renderer_1.Text>
            </renderer_1.View>) : null;
        })()}

        {/* Taxes */}
        {salesInvoiceLines.some(function (line) { var _a; return ((_a = line.taxPercent) !== null && _a !== void 0 ? _a : 0) > 0; }) && (<renderer_1.View style={[
                tw("flex flex-row py-1.5 px-3 text-[9px]"),
                { backgroundColor: "rgba(249, 250, 251, 0.6)" }
            ]}>
            <renderer_1.Text style={tw("w-5/6 text-right pr-3 text-gray-600")}>
              {taxLabel} ({currencyCode})
            </renderer_1.Text>
            <renderer_1.Text style={tw("w-1/6 text-center text-gray-800")}>
              {numberFormatter.format(salesInvoiceLines.reduce(function (sum, line) {
                var _a;
                var taxPercent = (_a = line.taxPercent) !== null && _a !== void 0 ? _a : 0;
                return sum + (0, sales_invoice_1.getLineTaxableSubtotal)(line) * taxPercent;
            }, 0))}
            </renderer_1.Text>
          </renderer_1.View>)}

        <renderer_1.View style={tw("h-[1px] bg-gray-200")}/>
        <renderer_1.View style={tw("flex flex-row py-2 px-3 text-[9px]")}>
          <renderer_1.Text style={tw("w-5/6 text-right pr-3 text-gray-800 font-bold")}>
            Total ({currencyCode})
          </renderer_1.Text>
          <renderer_1.Text style={tw("w-1/6 text-center text-gray-800 font-bold")}>
            {numberFormatter.format((0, sales_invoice_1.getTotal)(salesInvoiceLines, salesInvoice, salesInvoiceShipment))}
          </renderer_1.Text>
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
