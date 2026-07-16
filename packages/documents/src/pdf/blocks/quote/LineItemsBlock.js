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
var quote_1 = require("../../../utils/quote");
var components_1 = require("../../components");
var itemText_1 = require("../itemText");
var tw_1 = require("../tw");
function LineItemsBlock(_a) {
    var block = _a.block, data = _a.data;
    var tw = (0, tw_1.useTw)();
    var quoteLines = data.quoteLines, pricesByLine = data.pricesByLine, hasSinglePricePerLine = data.hasSinglePricePerLine, hasAnyLeadTime = data.hasAnyLeadTime, colWidth = data.colWidth, shouldConvertCurrency = data.shouldConvertCurrency, exchangeRate = data.exchangeRate, numberFormatter = data.numberFormatter, thumbnails = data.thumbnails, theme = data.theme, locale = data.locale;
    var opts = __assign(__assign({}, template_1.DEFAULT_LINE_ITEMS_OPTIONS), block.options);
    var overflow = (0, itemText_1.itemTextOverflowStyle)(opts);
    var rowIndex = 0;
    return (<renderer_1.View>
      {/* Header */}
      <renderer_1.View fixed style={[
            tw("flex flex-row py-2 px-3 text-[9px] font-bold items-center"),
            { backgroundColor: theme.accent, color: theme.accentForeground }
        ]}>
        <renderer_1.View style={tw("w-1/3")}>
          <renderer_1.Text>Description</renderer_1.Text>
        </renderer_1.View>
        <renderer_1.View style={tw("w-2/3 flex flex-row items-center")}>
          <renderer_1.Text style={tw("".concat(colWidth, " text-center pr-3"))}>Qty</renderer_1.Text>
          <renderer_1.Text style={tw("".concat(colWidth, " text-center pr-3"))}>Unit Price</renderer_1.Text>
          {!hasSinglePricePerLine && (<renderer_1.Text style={tw("".concat(colWidth, " text-center pr-3"))}>Tax & Fees</renderer_1.Text>)}
          {hasAnyLeadTime && (<renderer_1.Text style={tw("".concat(colWidth, " text-center pr-3"))}>Lead Time</renderer_1.Text>)}
          <renderer_1.Text style={tw("".concat(colWidth, " text-center"))}>Total</renderer_1.Text>
        </renderer_1.View>
      </renderer_1.View>

      {quoteLines.map(function (line) {
            var _a, _b, _c, _d, _e, _f;
            var unitPriceNumberFormatter = new Intl.NumberFormat(locale, {
                style: "decimal",
                minimumFractionDigits: (_a = line.unitPricePrecision) !== null && _a !== void 0 ? _a : 2,
                maximumFractionDigits: (_b = line.unitPricePrecision) !== null && _b !== void 0 ? _b : 2
            });
            var additionalCharges = (_c = line.additionalCharges) !== null && _c !== void 0 ? _c : {};
            return (<renderer_1.View key={line.id}>
            {line.status !== "No Quote" ? (<>
                {((_d = line.quantity) !== null && _d !== void 0 ? _d : []).map(function (quantity, index) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        var prices = line.id != null ? ((_a = pricesByLine[line.id]) !== null && _a !== void 0 ? _a : []) : [];
                        var price = prices.find(function (p) { return p.quantity === quantity; });
                        var unitPrice = (_b = price === null || price === void 0 ? void 0 : price.convertedUnitPrice) !== null && _b !== void 0 ? _b : 0;
                        var netExtendedPrice = (_c = price === null || price === void 0 ? void 0 : price.convertedNetExtendedPrice) !== null && _c !== void 0 ? _c : 0;
                        var isEven = rowIndex % 2 === 0;
                        rowIndex++;
                        var leadTime = (_d = price === null || price === void 0 ? void 0 : price.leadTime) !== null && _d !== void 0 ? _d : 0;
                        var additionalCharge = Object.values(additionalCharges).reduce(function (acc, charge) {
                            var _a, _b;
                            var amount = (_b = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity]) !== null && _b !== void 0 ? _b : 0;
                            if (shouldConvertCurrency)
                                amount *= exchangeRate;
                            return acc + amount;
                        }, 0);
                        var taxableAdditionalCharge = Object.values(additionalCharges).reduce(function (acc, charge) {
                            var _a, _b;
                            if (charge.taxable === false)
                                return acc;
                            var amount = (_b = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity]) !== null && _b !== void 0 ? _b : 0;
                            if (shouldConvertCurrency)
                                amount *= exchangeRate;
                            return acc + amount;
                        }, 0);
                        var shippingCost = (_e = price === null || price === void 0 ? void 0 : price.convertedShippingCost) !== null && _e !== void 0 ? _e : 0;
                        var taxPercent = (_f = line.taxPercent) !== null && _f !== void 0 ? _f : 0;
                        var taxableBeforeTax = netExtendedPrice + taxableAdditionalCharge + shippingCost;
                        var taxAmount = taxableBeforeTax * taxPercent;
                        var totalTaxAndFees = additionalCharge + shippingCost + taxAmount;
                        var totalPrice = netExtendedPrice + totalTaxAndFees;
                        return (<renderer_1.View key={"".concat(line.id, "-").concat(quantity)} wrap={false} style={[
                                tw("flex flex-row py-2 px-3 border-b border-gray-200 text-[10px]"),
                                {
                                    backgroundColor: opts.zebra && !isEven
                                        ? "rgba(249, 250, 251, 0.6)"
                                        : "transparent"
                                }
                            ]}>
                      <renderer_1.View style={tw("w-1/3 pr-2")}>
                        {index === 0 && (<>
                            <renderer_1.Text style={__assign(__assign({}, tw("text-gray-800")), overflow)}>
                              {(0, quote_1.getLineDescription)(line)}
                            </renderer_1.Text>
                            <renderer_1.Text style={__assign(__assign({}, tw("text-[8px] text-gray-400 mt-0.5")), overflow)}>
                              {(0, quote_1.getLineDescriptionDetails)(line)}
                            </renderer_1.Text>
                            {opts.showThumbnails &&
                                    thumbnails &&
                                    line.id != null &&
                                    line.id in thumbnails && (<renderer_1.View style={tw("mt-2")}>
                                  <renderer_1.Image src={thumbnails[line.id]} style={{ width: 60, height: 60 }}/>
                                </renderer_1.View>)}
                            {totalTaxAndFees > 0 && (<renderer_1.View style={tw("mt-1")}>
                                <renderer_1.Text style={tw("text-[8px] text-gray-400 font-bold")}>
                                  Tax & Fees
                                </renderer_1.Text>
                                {((_g = price === null || price === void 0 ? void 0 : price.convertedShippingCost) !== null && _g !== void 0 ? _g : 0) > 0 && (<renderer_1.Text style={tw("text-[8px] text-gray-400")}>
                                    - Shipping
                                  </renderer_1.Text>)}
                                {Object.values(additionalCharges)
                                        .filter(function (charge) {
                                        var _a, _b;
                                        return charge.description &&
                                            ((_b = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity]) !== null && _b !== void 0 ? _b : 0) > 0;
                                    })
                                        .sort(function (a, b) {
                                        return a.description.localeCompare(b.description);
                                    })
                                        .map(function (charge) { return (<renderer_1.Text key={charge.description} style={tw("text-[8px] text-gray-400")}>
                                      - {charge.description}
                                    </renderer_1.Text>); })}
                                {taxPercent > 0 && (<renderer_1.Text style={tw("text-[8px] text-gray-400")}>
                                    - Tax ({(taxPercent * 100).toFixed(0)}%)
                                  </renderer_1.Text>)}
                              </renderer_1.View>)}
                          </>)}
                      </renderer_1.View>
                      <renderer_1.View style={tw("w-2/3 flex flex-row")}>
                        <renderer_1.Text style={tw("".concat(colWidth, " text-center text-gray-600 pr-3"))}>
                          {quantity} EA
                        </renderer_1.Text>
                        <renderer_1.Text style={tw("".concat(colWidth, " text-center text-gray-600 pr-3"))}>
                          {unitPrice
                                ? unitPriceNumberFormatter.format(unitPrice)
                                : "-"}
                        </renderer_1.Text>
                        {!hasSinglePricePerLine && (<renderer_1.Text style={tw("".concat(colWidth, " text-center text-gray-600 pr-3"))}>
                            {totalTaxAndFees > 0
                                    ? numberFormatter.format(totalTaxAndFees)
                                    : "-"}
                          </renderer_1.Text>)}
                        {hasAnyLeadTime && (<renderer_1.Text style={tw("".concat(colWidth, " text-center text-gray-600 pr-3"))}>
                            {leadTime > 0
                                    ? "".concat(leadTime, " ").concat((0, utils_1.pluralize)(leadTime, "day"))
                                    : "-"}
                          </renderer_1.Text>)}
                        <renderer_1.Text style={tw("".concat(colWidth, " text-center text-gray-800 font-medium"))}>
                          {hasSinglePricePerLine
                                ? netExtendedPrice > 0
                                    ? numberFormatter.format(netExtendedPrice)
                                    : "-"
                                : totalPrice > 0
                                    ? numberFormatter.format(totalPrice)
                                    : "-"}
                        </renderer_1.Text>
                      </renderer_1.View>
                    </renderer_1.View>);
                    })}
                {Object.keys((_e = line.externalNotes) !== null && _e !== void 0 ? _e : {}).length > 0 && (<renderer_1.View style={tw("px-3 py-2 border-b border-gray-200")}>
                    <components_1.Note key={"".concat(line.id, "-notes")} content={line.externalNotes}/>
                  </renderer_1.View>)}
              </>) : (<renderer_1.View wrap={false} style={[
                        tw("flex flex-row py-2 px-3 border-b border-gray-200 text-[10px]"),
                        {
                            backgroundColor: rowIndex++ % 2 !== 0 && opts.zebra
                                ? "rgba(249, 250, 251, 0.6)"
                                : "transparent"
                        }
                    ]}>
                <renderer_1.View style={tw("w-1/3 pr-2")}>
                  <renderer_1.Text style={tw("text-gray-800")}>
                    {(0, quote_1.getLineDescription)(line)}
                  </renderer_1.Text>
                  <renderer_1.Text style={tw("text-[8px] text-gray-400 mt-0.5")}>
                    {(0, quote_1.getLineDescriptionDetails)(line)}
                  </renderer_1.Text>
                </renderer_1.View>
                <renderer_1.View style={tw("w-2/3 flex flex-row")}>
                  <renderer_1.Text style={tw("".concat(colWidth, " text-right text-gray-600 font-bold"))}>
                    No Quote
                  </renderer_1.Text>
                  <renderer_1.View style={tw("flex-1 text-right")}>
                    <renderer_1.Text style={tw("text-gray-400 text-[8px] text-right")}>
                      {(_f = line.noQuoteReason) !== null && _f !== void 0 ? _f : ""}
                    </renderer_1.Text>
                  </renderer_1.View>
                </renderer_1.View>
              </renderer_1.View>)}
          </renderer_1.View>);
        })}
    </renderer_1.View>);
}
