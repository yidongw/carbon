"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStockTransferVars = buildStockTransferVars;
/** Merge-field variable map for a Stock Transfer. */
function buildStockTransferVars(data) {
    var _a, _b, _c, _d;
    var t = data.stockTransfer;
    var str = function (v) { return (v == null ? "" : String(v)); };
    return {
        "transfer.number": str(t === null || t === void 0 ? void 0 : t.stockTransferId),
        "transfer.location": str((_a = data.location) === null || _a === void 0 ? void 0 : _a.name),
        "transfer.assignee": str(t === null || t === void 0 ? void 0 : t.assignee),
        "company.name": str((_b = data.company) === null || _b === void 0 ? void 0 : _b.name),
        "company.city": str((_c = data.company) === null || _c === void 0 ? void 0 : _c.city),
        "company.country": str((_d = data.company) === null || _d === void 0 ? void 0 : _d.countryCode)
    };
}
