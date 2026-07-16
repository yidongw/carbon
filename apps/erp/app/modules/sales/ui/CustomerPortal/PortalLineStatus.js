"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalLineStatus = PortalLineStatus;
var react_1 = require("@carbon/react");
var JobStatus_1 = require("~/modules/production/ui/Jobs/JobStatus");
var SalesStatus_1 = require("../SalesOrder/SalesStatus");
function getLineStatus(_a) {
    var _b, _c;
    var quantityOrdered = _a.quantityOrdered, quantityShipped = _a.quantityShipped, jobStatus = _a.jobStatus, jobOperations = _a.jobOperations, salesOrderStatus = _a.salesOrderStatus;
    if (["Draft", "Needs Approval", "Completed", "Cancelled", "Invoiced"].includes(salesOrderStatus)) {
        return {
            color: (_b = SalesStatus_1.SALES_STATUS_COLOR_MAP[salesOrderStatus]) !== null && _b !== void 0 ? _b : "gray",
            label: salesOrderStatus
        };
    }
    if (quantityOrdered > 0 && quantityOrdered === quantityShipped) {
        return { color: "blue", label: "Shipped" };
    }
    if (quantityShipped > 0) {
        return { color: "orange", label: "Partially Shipped" };
    }
    if (!jobStatus || ["Draft", "Ready", "Planned"].includes(jobStatus)) {
        return { color: "yellow", label: "Planned" };
    }
    if (["In Progress", "Paused"].includes(jobStatus) ||
        (jobOperations === null || jobOperations === void 0 ? void 0 : jobOperations.some(function (op) { return ["In Progress", "Done"].includes(op.status); }))) {
        return { color: "orange", label: "In Progress" };
    }
    return {
        color: (_c = JobStatus_1.JOB_STATUS_COLOR_MAP[jobStatus]) !== null && _c !== void 0 ? _c : "gray",
        label: jobStatus === "Ready" ? "Released" : jobStatus
    };
}
function PortalLineStatus(props) {
    var _a = getLineStatus(props), color = _a.color, label = _a.label;
    return (<react_1.Status color={color} disableTooltip>
      {label}
    </react_1.Status>);
}
