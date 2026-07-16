"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abbreviateOperationUnit = abbreviateOperationUnit;
exports.formatOperationTabSummary = formatOperationTabSummary;
function abbreviateOperationUnit(unit) {
    switch (unit) {
        case "Minutes/Piece":
            return "min/pc";
        case "Hours/Piece":
            return "hr/pc";
        case "Seconds/Piece":
            return "sec/pc";
        case "Total Minutes":
            return "min";
        case "Total Hours":
            return "hr";
        case "Total Seconds":
            return "sec";
        default:
            return (unit !== null && unit !== void 0 ? unit : "")
                .replace("Minutes", "min")
                .replace("Minute", "min")
                .replace("Hours", "hr")
                .replace("Hour", "hr")
                .replace("Seconds", "sec")
                .replace("Second", "sec")
                .replace("Piece", "pc")
                .replace("Total ", "");
    }
}
function formatOperationTabSummary(time, unit) {
    return "".concat(time, " ").concat(abbreviateOperationUnit(unit));
}
