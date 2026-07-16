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
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var template_1 = require("../../../template");
var purchase_order_1 = require("../../../utils/purchase-order");
var shared_1 = require("../../../utils/shared");
var components_1 = require("../../components");
var itemText_1 = require("../itemText");
var tw_1 = require("../tw");
var INDIRECT_TYPES = new Set([
    "Service",
    "G/L Account",
    "Fixed Asset",
    "Comment"
]);
var isIndirect = function (t) {
    return !!t && INDIRECT_TYPES.has(t);
};
function LineItemsBlock(_a) {
    var block = _a.block, data = _a.data;
    var tw = (0, tw_1.useTw)();
    var purchaseOrder = data.purchaseOrder, purchaseOrderLines = data.purchaseOrderLines, thumbnails = data.thumbnails, numberFormatter = data.numberFormatter, theme = data.theme, locale = data.locale;
    var opts = __assign(__assign({}, template_1.DEFAULT_LINE_ITEMS_OPTIONS), block.options);
    var overflow = (0, itemText_1.itemTextOverflowStyle)(opts);
    var rowIndex = 0;
    return (<renderer_1.View>
      <renderer_1.View fixed style={[
            tw("flex flex-row py-3 px-3 text-[9px] font-bold items-center"),
            { backgroundColor: theme.accent, color: theme.accentForeground }
        ]}>
        <renderer_1.Text style={tw("w-[4%] text-center")}>#</renderer_1.Text>
        <renderer_1.Text style={tw("w-[22%]")}>Description</renderer_1.Text>
        <renderer_1.Text style={tw("w-[8%] text-center")}>Qty</renderer_1.Text>
        <renderer_1.Text style={tw("w-[7%] text-center")}>UOM</renderer_1.Text>
        <renderer_1.View style={tw("w-[10%] items-center")}>
          <renderer_1.Text>Required</renderer_1.Text>
        </renderer_1.View>
        <renderer_1.Text style={tw("w-[12%] text-center")}>Unit Price</renderer_1.Text>
        <renderer_1.Text style={tw("w-[12%] text-center")}>Net Value</renderer_1.Text>
        <renderer_1.Text style={tw("w-[12%] text-center")}>Tax Value</renderer_1.Text>
        <renderer_1.Text style={tw("w-[13%] text-center")}>Total</renderer_1.Text>
      </renderer_1.View>

      {purchaseOrderLines.map(function (line) {
            var _a, _b, _c, _d, _e, _f;
            var isEven = rowIndex % 2 === 0;
            rowIndex++;
            var netValue = ((_a = line.purchaseQuantity) !== null && _a !== void 0 ? _a : 0) * ((_b = line.supplierUnitPrice) !== null && _b !== void 0 ? _b : 0);
            return (<renderer_1.View key={line.id}>
            <renderer_1.View wrap={false} style={[
                    tw("flex flex-col py-2 px-3 border-b border-gray-200 text-[9px]"),
                    {
                        backgroundColor: opts.zebra && !isEven
                            ? "rgba(249, 250, 251, 0.6)"
                            : "transparent"
                    }
                ]}>
              <renderer_1.View style={tw("flex flex-row")}>
                <renderer_1.Text style={tw("w-[4%] text-center text-gray-400")}>
                  {line.purchaseOrderLineType === "Comment" ? "" : rowIndex}
                </renderer_1.Text>
                <renderer_1.View style={tw("w-[22%] pr-2")}>
                  {isIndirect(line.purchaseOrderLineType) ? (<renderer_1.Text style={__assign(__assign({}, tw("text-gray-900")), overflow)}>
                      {(_c = line.description) !== null && _c !== void 0 ? _c : ""}
                    </renderer_1.Text>) : (<>
                      <renderer_1.Text style={__assign(__assign({}, tw("text-gray-900")), overflow)}>
                        {(0, purchase_order_1.getLineDescription)(line)}
                      </renderer_1.Text>
                      <renderer_1.Text style={__assign(__assign({}, tw("text-[7px] text-gray-600 mt-0.5")), overflow)}>
                        {(0, purchase_order_1.getLineDescriptionDetails)(line)}
                      </renderer_1.Text>
                    </>)}
                  {purchaseOrder.purchaseOrderType === "Outside Processing" &&
                    line.jobOperationDescription && (<renderer_1.Text style={tw("text-[7px] text-gray-600 mt-0.5")}>
                        {line.jobOperationDescription}
                      </renderer_1.Text>)}
                  {opts.showThumbnails &&
                    thumbnails &&
                    line.id &&
                    line.id in thumbnails &&
                    thumbnails[line.id] && (<renderer_1.View style={tw("mt-1 w-16")}>
                        <renderer_1.Image src={thumbnails[line.id]} style={tw("w-full h-auto")}/>
                      </renderer_1.View>)}
                </renderer_1.View>
                <renderer_1.Text style={tw("w-[8%] text-center text-gray-600")}>
                  {line.purchaseOrderLineType === "Comment"
                    ? ""
                    : line.purchaseQuantity}
                </renderer_1.Text>
                <renderer_1.Text style={tw("w-[7%] text-center text-gray-600")}>
                  {line.purchaseOrderLineType === "Comment"
                    ? ""
                    : line.purchaseUnitOfMeasureCode}
                </renderer_1.Text>
                <renderer_1.Text style={tw("w-[10%] text-center text-gray-600")}>
                  {line.purchaseOrderLineType === "Comment" ||
                    !line.requiredDate
                    ? ""
                    : (0, utils_1.formatDate)(line.requiredDate, undefined, locale)}
                </renderer_1.Text>
                <renderer_1.Text style={tw("w-[12%] text-center text-gray-600")}>
                  {line.purchaseOrderLineType === "Comment"
                    ? ""
                    : numberFormatter.format((_d = line.supplierUnitPrice) !== null && _d !== void 0 ? _d : 0)}
                </renderer_1.Text>
                <renderer_1.Text style={tw("w-[12%] text-center text-gray-600")}>
                  {line.purchaseOrderLineType === "Comment"
                    ? ""
                    : numberFormatter.format(netValue)}
                </renderer_1.Text>
                <renderer_1.View style={tw("w-[12%]")}>
                  {line.purchaseOrderLineType !== "Comment" && (<renderer_1.View style={tw("flex flex-col items-center")}>
                      <renderer_1.Text style={tw("text-gray-600")}>
                        {numberFormatter.format((_e = line.supplierTaxAmount) !== null && _e !== void 0 ? _e : 0)}
                      </renderer_1.Text>
                      {(0, shared_1.formatTaxPercent)(line.taxPercent) && (<renderer_1.Text style={tw("text-[6px] text-gray-400")}>
                          {(0, shared_1.formatTaxPercent)(line.taxPercent)}
                        </renderer_1.Text>)}
                    </renderer_1.View>)}
                </renderer_1.View>
                <renderer_1.Text style={tw("w-[13%] text-center text-gray-800 font-medium")}>
                  {line.purchaseOrderLineType === "Comment"
                    ? ""
                    : numberFormatter.format((0, purchase_order_1.getLineTotal)(line))}
                </renderer_1.Text>
              </renderer_1.View>
            </renderer_1.View>
            {Object.keys((_f = line.externalNotes) !== null && _f !== void 0 ? _f : {}).length > 0 && (<renderer_1.View style={tw("px-3 py-2 border-b border-gray-200")}>
                <components_1.Note key={"".concat(line.id, "-notes")} content={line.externalNotes}/>
              </renderer_1.View>)}
          </renderer_1.View>);
        })}
    </renderer_1.View>);
}
