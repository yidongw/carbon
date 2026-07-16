"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.journalReference = exports.debit = exports.credit = exports.getReadableIdWithRevision = exports.interpolateSequenceDate = void 0;
// used to generate sequences
var interpolateSequenceDate = function (value) {
    // replace all instances of %{year} with the current year
    if (!value)
        return "";
    var result = value;
    if (result.includes("%{")) {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var seconds = date.getSeconds();
        result = result.replace(/%{yyyy}/g, year.toString());
        result = result.replace(/%{yy}/g, year.toString().slice(-2));
        result = result.replace(/%{mm}/g, month.toString().padStart(2, "0"));
        result = result.replace(/%{dd}/g, day.toString().padStart(2, "0"));
        result = result.replace(/%{hh}/g, hours.toString().padStart(2, "0"));
        result = result.replace(/%{ss}/g, seconds.toString().padStart(2, "0"));
    }
    return result;
};
exports.interpolateSequenceDate = interpolateSequenceDate;
var getReadableIdWithRevision = function (readableId, revision) {
    if (revision && revision !== "0") {
        return "".concat(readableId, ".").concat(revision);
    }
    return readableId;
};
exports.getReadableIdWithRevision = getReadableIdWithRevision;
var credit = function (accountType, amount) {
    switch (accountType) {
        case "asset":
        case "expense":
            return -amount;
        case "liability":
        case "equity":
        case "revenue":
            return amount;
        default:
            throw new Error("Invalid account type: ".concat(accountType));
    }
};
exports.credit = credit;
var debit = function (accountType, amount) {
    switch (accountType) {
        case "asset":
        case "expense":
            return amount;
        case "liability":
        case "equity":
        case "revenue":
            return -amount;
        default:
            throw new Error("Invalid account type: ".concat(accountType));
    }
};
exports.debit = debit;
exports.journalReference = {
    to: {
        purchaseInvoice: function (id) { return "purchase-invoice:".concat(id); },
        receipt: function (id) { return "receipt:".concat(id); },
        salesInvoice: function (id) { return "sales-invoice:".concat(id); },
        shipment: function (id) { return "shipment:".concat(id); },
        job: function (id) { return "job:".concat(id); },
        materialIssue: function (id) { return "material-issue:".concat(id); },
    },
};
