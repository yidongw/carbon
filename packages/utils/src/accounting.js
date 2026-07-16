"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debit = exports.credit = void 0;
exports.toDisplayDebit = toDisplayDebit;
exports.toDisplayCredit = toDisplayCredit;
exports.toStoredAmount = toStoredAmount;
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
function isNaturalDebitAccount(cls) {
    return cls === "Asset" || cls === "Expense";
}
function toDisplayDebit(amount, accountClass) {
    var isDebit = isNaturalDebitAccount(accountClass) ? amount > 0 : amount < 0;
    return isDebit ? Math.abs(amount) : 0;
}
function toDisplayCredit(amount, accountClass) {
    var isCredit = isNaturalDebitAccount(accountClass)
        ? amount < 0
        : amount > 0;
    return isCredit ? Math.abs(amount) : 0;
}
function toStoredAmount(debitAmount, creditAmount, accountClass) {
    var type = accountClass.toLowerCase();
    if (debitAmount > 0)
        return (0, exports.debit)(type, debitAmount);
    return (0, exports.credit)(type, creditAmount);
}
