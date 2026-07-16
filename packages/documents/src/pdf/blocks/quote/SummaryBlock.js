"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteSummaryBlock = QuoteSummaryBlock;
var renderer_1 = require("@react-pdf/renderer");
var tw_1 = require("../tw");
function QuoteSummaryBlock(_a) {
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var ROW = [
        tw("flex flex-row py-1.5 px-3 text-[9px]"),
        { backgroundColor: "rgba(249, 250, 251, 0.6)" }
    ];
    var hasSinglePricePerLine = data.hasSinglePricePerLine, totals = data.totals, currencyCode = data.currencyCode, numberFormatter = data.numberFormatter;
    // The Quote summary only renders when every line has a single price.
    if (!hasSinglePricePerLine)
        return null;
    return (<renderer_1.View style={tw("mb-4")}>
      <renderer_1.View style={ROW}>
        <renderer_1.Text style={tw("w-5/6 text-right pr-3 text-gray-600")}>
          Subtotal ({currencyCode})
        </renderer_1.Text>
        <renderer_1.Text style={tw("w-1/6 text-center text-gray-800")}>
          {numberFormatter.format(totals.subtotal)}
        </renderer_1.Text>
      </renderer_1.View>
      <renderer_1.View style={ROW}>
        <renderer_1.Text style={tw("w-5/6 text-right pr-3 text-gray-600")}>
          Shipping ({currencyCode})
        </renderer_1.Text>
        <renderer_1.Text style={tw("w-1/6 text-center text-gray-800")}>
          {numberFormatter.format(totals.shipping)}
        </renderer_1.Text>
      </renderer_1.View>
      {totals.fees > 0 && (<renderer_1.View style={ROW}>
          <renderer_1.Text style={tw("w-5/6 text-right pr-3 text-gray-600")}>
            Fees ({currencyCode})
          </renderer_1.Text>
          <renderer_1.Text style={tw("w-1/6 text-center text-gray-800")}>
            {numberFormatter.format(totals.fees)}
          </renderer_1.Text>
        </renderer_1.View>)}
      <renderer_1.View style={ROW}>
        <renderer_1.Text style={tw("w-5/6 text-right pr-3 text-gray-600")}>
          Taxes ({currencyCode})
        </renderer_1.Text>
        <renderer_1.Text style={tw("w-1/6 text-center text-gray-800")}>
          {numberFormatter.format(totals.taxes)}
        </renderer_1.Text>
      </renderer_1.View>
      <renderer_1.View style={tw("h-[1px] bg-gray-200")}/>
      <renderer_1.View style={tw("flex flex-row py-2 px-3 text-[9px]")}>
        <renderer_1.Text style={tw("w-5/6 text-right pr-3 text-gray-800 font-bold")}>
          Total ({currencyCode})
        </renderer_1.Text>
        <renderer_1.Text style={tw("w-1/6 text-center text-gray-800 font-bold")}>
          {numberFormatter.format(totals.total)}
        </renderer_1.Text>
      </renderer_1.View>
    </renderer_1.View>);
}
