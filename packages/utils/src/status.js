"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasIncompleteJobs = exports.getSalesOrderJobStatus = exports.getPurchaseOrderStatus = exports.getSalesOrderStatus = void 0;
var getSalesOrderStatus = function (lines) {
    var allInvoiced = lines.every(function (line) { return line.salesOrderLineType === "Comment" || line.invoicedComplete; });
    var allShipped = lines.every(function (line) { return line.salesOrderLineType === "Comment" || line.sentComplete; });
    var status = "To Ship and Invoice";
    if (allInvoiced && allShipped) {
        status = "Completed";
    }
    else if (allShipped) {
        status = "To Invoice";
    }
    else if (allInvoiced) {
        status = "To Ship";
    }
    return { status: status, allInvoiced: allInvoiced, allShipped: allShipped };
};
exports.getSalesOrderStatus = getSalesOrderStatus;
var getPurchaseOrderStatus = function (lines) {
    var allInvoices = lines.every(function (line) { return line.purchaseOrderLineType === "Comment" || line.invoicedComplete; });
    var allLinesReceived = lines.every(function (line) {
        return line.purchaseOrderLineType === "Comment" ||
            line.purchaseOrderLineType === "G/L Account" ||
            line.receivedComplete;
    });
    var status = "To Receive and Invoice";
    if (allInvoices && allLinesReceived) {
        status = "Completed";
    }
    else if (allInvoices) {
        status = "To Receive";
    }
    else if (allLinesReceived) {
        status = "To Invoice";
    }
    return { status: status, allInvoices: allInvoices, allLinesReceived: allLinesReceived };
};
exports.getPurchaseOrderStatus = getPurchaseOrderStatus;
var getSalesOrderJobStatus = function (jobs, line) {
    var _a, _b, _c;
    var filteredJobs = (_a = jobs === null || jobs === void 0 ? void 0 : jobs.filter(function (j) { return j.salesOrderLineId === line.id; })) !== null && _a !== void 0 ? _a : [];
    var isMade = line.methodType === "Make to Order";
    var saleQuantity = (_b = line.saleQuantity) !== null && _b !== void 0 ? _b : 0;
    var totalProduction = filteredJobs.reduce(function (acc, job) { var _a; return acc + ((_a = job.productionQuantity) !== null && _a !== void 0 ? _a : 0); }, 0);
    var totalCompleted = filteredJobs.reduce(function (acc, job) { return acc + job.quantityComplete; }, 0);
    var totalReleased = filteredJobs.reduce(function (acc, job) {
        var _a;
        if (job.status !== "Planned" && job.status !== "Draft") {
            return acc + ((_a = job.productionQuantity) !== null && _a !== void 0 ? _a : 0);
        }
        return acc;
    }, 0);
    var hasEnoughJobsToCoverQuantity = totalProduction >= saleQuantity;
    var hasEnoughCompletedToCoverQuantity = totalCompleted >= saleQuantity;
    var hasAnyQuantityReleased = totalReleased > 0;
    var isCompleted = hasEnoughJobsToCoverQuantity && hasEnoughCompletedToCoverQuantity;
    var quantitySent = (_c = line.quantitySent) !== null && _c !== void 0 ? _c : 0;
    var isPartiallyShipped = quantitySent > 0 && quantitySent < saleQuantity;
    var jobVariant;
    var jobLabel;
    if (isCompleted && line.sentComplete) {
        jobLabel = "Shipped";
        jobVariant = "green";
    }
    else if (isCompleted) {
        jobLabel = "Completed";
        jobVariant = "green";
    }
    else if (isPartiallyShipped) {
        jobLabel = "Partially Shipped";
        jobVariant = "orange";
    }
    else if (isMade && filteredJobs.length === 0) {
        jobLabel = "Requires Jobs";
        jobVariant = "red";
    }
    else if (hasAnyQuantityReleased) {
        jobLabel = "In Progress";
        jobVariant = "orange";
    }
    else {
        jobLabel = "Planned";
        jobVariant = "orange";
    }
    return { jobVariant: jobVariant, jobLabel: jobLabel, jobs: filteredJobs };
};
exports.getSalesOrderJobStatus = getSalesOrderJobStatus;
/**
 * Checks if a Sales Order has incomplete jobs.
 * Returns true if any "Make" line item has incomplete jobs.
 * A job is considered complete when quantityComplete >= saleQuantity for that line.
 */
var hasIncompleteJobs = function (salesOrder) {
    var _a, _b, _c;
    var jobs = (_a = salesOrder.jobs) !== null && _a !== void 0 ? _a : [];
    var lines = (_b = salesOrder.lines) !== null && _b !== void 0 ? _b : [];
    var makeLines = lines.filter(function (line) { return line.methodType === "Make to Order"; });
    if (makeLines.length === 0) {
        return false;
    }
    var _loop_1 = function (line) {
        var lineJobs = jobs.filter(function (job) { return job.salesOrderLineId === line.id; });
        if (lineJobs.length === 0) {
            return { value: true };
        }
        var totalCompleted = lineJobs.reduce(function (acc, job) { var _a; return acc + ((_a = job.quantityComplete) !== null && _a !== void 0 ? _a : 0); }, 0);
        if (totalCompleted < ((_c = line.saleQuantity) !== null && _c !== void 0 ? _c : 0)) {
            return { value: true };
        }
    };
    for (var _i = 0, makeLines_1 = makeLines; _i < makeLines_1.length; _i++) {
        var line = makeLines_1[_i];
        var state_1 = _loop_1(line);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return false;
};
exports.hasIncompleteJobs = hasIncompleteJobs;
