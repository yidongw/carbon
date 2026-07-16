"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLineDescription = getLineDescription;
exports.getLineDescriptionDetails = getLineDescriptionDetails;
function getLineDescription(line) {
    var customerPartNumber = line.customerPartId
        ? " (".concat(line.customerPartId, " ").concat(line.customerPartRevision ? "Rev ".concat(line.customerPartRevision) : "", ")")
        : "";
    return (line === null || line === void 0 ? void 0 : line.itemReadableId) + customerPartNumber;
}
function getLineDescriptionDetails(line) {
    return (line === null || line === void 0 ? void 0 : line.description) ? "".concat(line.description) : "";
}
