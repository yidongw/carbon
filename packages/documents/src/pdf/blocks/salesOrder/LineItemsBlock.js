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
exports.LineItemsBlock = LineItemsBlock;
var renderer_1 = require("@react-pdf/renderer");
var template_1 = require("../../../template");
var sales_order_1 = require("../../../utils/sales-order");
var components_1 = require("../../components");
var itemText_1 = require("../itemText");
var tw_1 = require("../tw");
function LineItemsBlock(_a) {
    var block = _a.block, data = _a.data;
    var tw = (0, tw_1.useTw)();
    var salesOrderLines = data.salesOrderLines, thumbnails = data.thumbnails, numberFormatter = data.numberFormatter, theme = data.theme;
    var opts = __assign(__assign({}, template_1.DEFAULT_LINE_ITEMS_OPTIONS), block.options);
    var overflow = (0, itemText_1.itemTextOverflowStyle)(opts);
    var rowIndex = 0;
    return (<renderer_1.View>
      {/* Header */}
      <renderer_1.View fixed style={[
            tw("flex flex-row py-2 px-3 text-[9px] font-bold items-center"),
            { backgroundColor: theme.accent, color: theme.accentForeground }
        ]}>
        <renderer_1.Text style={tw("w-1/2")}>Description</renderer_1.Text>
        <renderer_1.Text style={tw("w-1/6 text-center")}>Qty</renderer_1.Text>
        <renderer_1.Text style={tw("w-1/6 text-center")}>Unit Price</renderer_1.Text>
        <renderer_1.Text style={tw("w-1/6 text-center")}>Total</renderer_1.Text>
      </renderer_1.View>

      {salesOrderLines.map(function (line) {
            var _a, _b, _c, _d, _e, _f, _g;
            var isEven = rowIndex % 2 === 0;
            rowIndex++;
            var lineAddOnCost = (_a = line.convertedAddOnCost) !== null && _a !== void 0 ? _a : 0;
            var lineNonTaxableAddOnCost = (_b = line.convertedNonTaxableAddOnCost) !== null && _b !== void 0 ? _b : 0;
            var lineShippingCost = (_c = line.convertedShippingCost) !== null && _c !== void 0 ? _c : 0;
            var lineTaxPercent = (_d = line.taxPercent) !== null && _d !== void 0 ? _d : 0;
            var lineTaxAmount = (0, sales_order_1.getLineTaxableSubtotal)(line) * lineTaxPercent;
            var totalTaxAndFees = lineAddOnCost +
                lineNonTaxableAddOnCost +
                lineShippingCost +
                lineTaxAmount;
            return (<renderer_1.View key={line.id}>
            <renderer_1.View wrap={false} style={[
                    tw("flex flex-row py-2 px-3 border-b border-gray-200 text-[10px]"),
                    {
                        backgroundColor: opts.zebra && !isEven
                            ? "rgba(249, 250, 251, 0.6)"
                            : "transparent"
                    }
                ]}>
              <renderer_1.View style={tw("w-1/2 pr-2")}>
                <renderer_1.Text style={__assign(__assign({}, tw("text-gray-800")), overflow)}>
                  {(0, sales_order_1.getLineDescription)(line)}
                </renderer_1.Text>
                <renderer_1.Text style={__assign(__assign({}, tw("text-[9px] text-gray-600 mt-0.5")), overflow)}>
                  {(0, sales_order_1.getLineDescriptionDetails)(line)}
                </renderer_1.Text>
                {opts.showThumbnails &&
                    thumbnails &&
                    line.id &&
                    line.id in thumbnails &&
                    thumbnails[line.id] && (<renderer_1.View style={tw("mt-1 w-16")}>
                      <renderer_1.Image src={thumbnails[line.id]} style={tw("w-full h-auto")}/>
                    </renderer_1.View>)}
                {line.salesOrderLineType !== "Comment" &&
                    totalTaxAndFees > 0 && (<renderer_1.View style={tw("mt-1")}>
                      <renderer_1.Text style={tw("text-[9px] text-gray-600 font-bold")}>
                        Tax & Fees
                      </renderer_1.Text>
                      {lineShippingCost > 0 && (<renderer_1.Text style={tw("text-[9px] text-gray-600")}>
                          - Shipping
                        </renderer_1.Text>)}
                      {lineAddOnCost > 0 && (<renderer_1.Text style={tw("text-[9px] text-gray-600")}>
                          - Add-On
                        </renderer_1.Text>)}
                      {lineNonTaxableAddOnCost > 0 && (<renderer_1.Text style={tw("text-[9px] text-gray-600")}>
                          - Non-Taxable Add-On
                        </renderer_1.Text>)}
                      {lineTaxPercent > 0 && (<renderer_1.Text style={tw("text-[9px] text-gray-600")}>
                          - Tax ({(lineTaxPercent * 100).toFixed(0)}%)
                        </renderer_1.Text>)}
                    </renderer_1.View>)}
              </renderer_1.View>
              <renderer_1.Text style={tw("w-1/6 text-center text-gray-600")}>
                {line.salesOrderLineType === "Comment"
                    ? ""
                    : "".concat(line.saleQuantity, " ").concat((_e = line.unitOfMeasureCode) !== null && _e !== void 0 ? _e : "EA")}
              </renderer_1.Text>
              <renderer_1.Text style={tw("w-1/6 text-center text-gray-600")}>
                {line.salesOrderLineType === "Comment"
                    ? ""
                    : numberFormatter.format((_f = line.convertedUnitPrice) !== null && _f !== void 0 ? _f : 0)}
              </renderer_1.Text>
              <renderer_1.Text style={tw("w-1/6 text-center text-gray-800 font-medium")}>
                {line.salesOrderLineType === "Comment"
                    ? ""
                    : numberFormatter.format((0, sales_order_1.getLineTotal)(line))}
              </renderer_1.Text>
            </renderer_1.View>
            {Object.keys((_g = line.externalNotes) !== null && _g !== void 0 ? _g : {}).length > 0 && (<renderer_1.View style={tw("px-3 py-2 border-b border-gray-200")}>
                <components_1.Note key={"".concat(line.id, "-notes")} content={line.externalNotes}/>
              </renderer_1.View>)}
          </renderer_1.View>);
        })}
    </renderer_1.View>);
}
