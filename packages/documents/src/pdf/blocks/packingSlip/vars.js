"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPackingSlipVars = buildPackingSlipVars;
/** Merge-field variable map for a Packing Slip. */
function buildPackingSlipVars(data) {
    var _a, _b, _c, _d;
    var s = data.shipment;
    var a = data.shippingAddress;
    var str = function (v) { return (v == null ? "" : String(v)); };
    return {
        "shipment.number": str(s === null || s === void 0 ? void 0 : s.shipmentId),
        "shipment.trackingNumber": str(s === null || s === void 0 ? void 0 : s.trackingNumber),
        "customer.name": str((_a = data.customer) === null || _a === void 0 ? void 0 : _a.name),
        "customer.addressLine1": str(a === null || a === void 0 ? void 0 : a.addressLine1),
        "customer.city": str(a === null || a === void 0 ? void 0 : a.city),
        "customer.country": str(a === null || a === void 0 ? void 0 : a.countryCode),
        "company.name": str((_b = data.company) === null || _b === void 0 ? void 0 : _b.name),
        "company.city": str((_c = data.company) === null || _c === void 0 ? void 0 : _c.city),
        "company.country": str((_d = data.company) === null || _d === void 0 ? void 0 : _d.countryCode)
    };
}
