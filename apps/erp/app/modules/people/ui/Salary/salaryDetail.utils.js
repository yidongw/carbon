"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnitCost = exports.getProcessName = exports.getJobReadableId = exports.getJobOperationDescription = exports.getItemReadableIdWithRevision = exports.getItemName = exports.getEarned = exports.formatDateTime = exports.MONTH_NAMES = void 0;
exports.getEmployeeName = getEmployeeName;
exports.getSalaryPaymentStatus = getSalaryPaymentStatus;
exports.statusVariant = statusVariant;
exports.MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
var productionQuantityDisplay_utils_1 = require("~/modules/production/productionQuantityDisplay.utils");
Object.defineProperty(exports, "formatDateTime", { enumerable: true, get: function () { return productionQuantityDisplay_utils_1.formatDateTime; } });
Object.defineProperty(exports, "getEarned", { enumerable: true, get: function () { return productionQuantityDisplay_utils_1.getEarned; } });
Object.defineProperty(exports, "getItemName", { enumerable: true, get: function () { return productionQuantityDisplay_utils_1.getItemName; } });
Object.defineProperty(exports, "getItemReadableIdWithRevision", { enumerable: true, get: function () { return productionQuantityDisplay_utils_1.getItemReadableIdWithRevision; } });
Object.defineProperty(exports, "getJobOperationDescription", { enumerable: true, get: function () { return productionQuantityDisplay_utils_1.getJobOperationDescription; } });
Object.defineProperty(exports, "getJobReadableId", { enumerable: true, get: function () { return productionQuantityDisplay_utils_1.getJobReadableId; } });
Object.defineProperty(exports, "getProcessName", { enumerable: true, get: function () { return productionQuantityDisplay_utils_1.getProcessName; } });
Object.defineProperty(exports, "getUnitCost", { enumerable: true, get: function () { return productionQuantityDisplay_utils_1.getUnitCost; } });
/** Builds a display name from name parts, returning a fallback when empty. */
function getEmployeeName(parts, fallback) {
    var _a, _b, _c;
    if (fallback === void 0) { fallback = "—"; }
    if (!parts)
        return fallback;
    var full = (_a = parts.fullName) === null || _a === void 0 ? void 0 : _a.trim();
    if (full)
        return full;
    var combined = "".concat((_b = parts.firstName) !== null && _b !== void 0 ? _b : "", " ").concat((_c = parts.lastName) !== null && _c !== void 0 ? _c : "").trim();
    return combined || fallback;
}
/** Payment status derived from totals (ignores legacy Draft/Approved values). */
function getSalaryPaymentStatus(totalEarned, totalPaid) {
    var earned = totalEarned !== null && totalEarned !== void 0 ? totalEarned : 0;
    var paid = totalPaid !== null && totalPaid !== void 0 ? totalPaid : 0;
    if (paid > 0 && earned > 0 && paid >= earned)
        return "Paid";
    if (paid > 0)
        return "Partially Paid";
    return "Unpaid";
}
function statusVariant(status) {
    switch (status) {
        case "Paid":
            return "green";
        case "Partially Paid":
            return "yellow";
        case "Unpaid":
        default:
            return "secondary";
    }
}
