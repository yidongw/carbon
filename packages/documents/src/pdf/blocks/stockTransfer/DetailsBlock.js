"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetailsBlock = DetailsBlock;
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var components_1 = require("../../components");
var tw_1 = require("../tw");
/** Company + transfer metadata (date, id, location, assignee). */
function DetailsBlock(_a) {
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var company = data.company, stockTransfer = data.stockTransfer, location = data.location, locale = data.locale;
    var items = [
        {
            label: "Date",
            value: (stockTransfer === null || stockTransfer === void 0 ? void 0 : stockTransfer.createdAt)
                ? (0, utils_1.formatDate)(stockTransfer.createdAt, undefined, locale)
                : ""
        },
        { label: "Stock Transfer", value: stockTransfer === null || stockTransfer === void 0 ? void 0 : stockTransfer.stockTransferId },
        { label: "Location", value: location === null || location === void 0 ? void 0 : location.name }
    ];
    if (stockTransfer === null || stockTransfer === void 0 ? void 0 : stockTransfer.assignee) {
        items.push({ label: "Assignee", value: stockTransfer.assignee });
    }
    return (<renderer_1.View style={tw("mb-4")}>
      <components_1.Summary company={company} items={items}/>
    </renderer_1.View>);
}
