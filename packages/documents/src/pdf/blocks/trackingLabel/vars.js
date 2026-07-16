"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLabelVars = buildLabelVars;
/** Merge-field variable map for a tracking label. */
function buildLabelVars(item, company) {
    var str = function (v) { return (v == null ? "" : String(v)); };
    return {
        "item.id": str(item === null || item === void 0 ? void 0 : item.itemId),
        "item.revision": str(item === null || item === void 0 ? void 0 : item.revision),
        "label.quantity": str(item === null || item === void 0 ? void 0 : item.quantity),
        "label.trackingType": str(item === null || item === void 0 ? void 0 : item.trackingType),
        "label.number": str(item === null || item === void 0 ? void 0 : item.number),
        "label.trackedEntityId": str(item === null || item === void 0 ? void 0 : item.trackedEntityId),
        "company.name": str(company === null || company === void 0 ? void 0 : company.name),
        "company.city": str(company === null || company === void 0 ? void 0 : company.city),
        "company.country": str(company === null || company === void 0 ? void 0 : company.countryCode)
    };
}
