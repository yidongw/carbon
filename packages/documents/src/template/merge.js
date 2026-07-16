"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MERGE_FIELDS = void 0;
exports.interpolateString = interpolateString;
exports.interpolateContent = interpolateContent;
exports.mergeToken = mergeToken;
exports.getMergeFields = getMergeFields;
var TOKEN_RE = /\{\s*([\w.]+)\s*\}/g;
/** Replace every `{token}` in a string with its variable value ("" if unknown). */
function interpolateString(text, vars) {
    return text.replace(TOKEN_RE, function (_match, token) { var _a; return (_a = vars[token]) !== null && _a !== void 0 ? _a : ""; });
}
/**
 * Deep-clone a tiptap document, replacing `{token}` inside every text node.
 * Pure — never mutates the input (block state stays as the user authored it).
 */
function interpolateContent(content, vars) {
    var walk = function (node) {
        var next = __assign({}, node);
        if (typeof next.text === "string") {
            next.text = interpolateString(next.text, vars);
        }
        if (Array.isArray(next.content)) {
            next.content = next.content.map(walk);
        }
        return next;
    };
    return walk(content);
}
/** Wrap a token for insertion into authored content. */
function mergeToken(token) {
    return "{".concat(token, "}");
}
var SALES_INVOICE_MERGE_FIELDS = [
    { token: "invoice.number", label: "Invoice Number", group: "Invoice" },
    { token: "invoice.dateIssued", label: "Issue Date", group: "Invoice" },
    { token: "invoice.dateDue", label: "Due Date", group: "Invoice" },
    {
        token: "invoice.customerReference",
        label: "Customer Reference",
        group: "Invoice"
    },
    { token: "invoice.currency", label: "Currency", group: "Invoice" },
    { token: "customer.name", label: "Customer Name", group: "Customer" },
    { token: "customer.addressLine1", label: "Address", group: "Customer" },
    { token: "customer.city", label: "City", group: "Customer" },
    { token: "customer.country", label: "Country", group: "Customer" },
    { token: "company.name", label: "Company Name", group: "Company" },
    { token: "company.city", label: "Company City", group: "Company" },
    { token: "company.country", label: "Company Country", group: "Company" }
];
var SALES_ORDER_MERGE_FIELDS = [
    { token: "order.number", label: "Order Number", group: "Order" },
    { token: "order.date", label: "Order Date", group: "Order" },
    {
        token: "order.customerReference",
        label: "Customer Reference",
        group: "Order"
    },
    { token: "order.currency", label: "Currency", group: "Order" },
    { token: "customer.name", label: "Customer Name", group: "Customer" },
    { token: "customer.addressLine1", label: "Address", group: "Customer" },
    { token: "customer.city", label: "City", group: "Customer" },
    { token: "customer.country", label: "Country", group: "Customer" },
    { token: "company.name", label: "Company Name", group: "Company" },
    { token: "company.city", label: "Company City", group: "Company" },
    { token: "company.country", label: "Company Country", group: "Company" }
];
var PURCHASE_ORDER_MERGE_FIELDS = [
    { token: "order.number", label: "PO Number", group: "Order" },
    { token: "order.date", label: "Order Date", group: "Order" },
    {
        token: "order.supplierReference",
        label: "Supplier Reference",
        group: "Order"
    },
    { token: "order.currency", label: "Currency", group: "Order" },
    { token: "supplier.name", label: "Supplier Name", group: "Supplier" },
    { token: "supplier.addressLine1", label: "Address", group: "Supplier" },
    { token: "supplier.city", label: "City", group: "Supplier" },
    { token: "supplier.country", label: "Country", group: "Supplier" },
    { token: "company.name", label: "Company Name", group: "Company" },
    { token: "company.city", label: "Company City", group: "Company" },
    { token: "company.country", label: "Company Country", group: "Company" }
];
var QUOTE_MERGE_FIELDS = [
    { token: "quote.number", label: "Quote Number", group: "Quote" },
    { token: "quote.expirationDate", label: "Expiration Date", group: "Quote" },
    {
        token: "quote.customerReference",
        label: "Customer Reference",
        group: "Quote"
    },
    { token: "quote.currency", label: "Currency", group: "Quote" },
    { token: "customer.name", label: "Customer Name", group: "Customer" },
    { token: "customer.addressLine1", label: "Address", group: "Customer" },
    { token: "customer.city", label: "City", group: "Customer" },
    { token: "customer.country", label: "Country", group: "Customer" },
    { token: "company.name", label: "Company Name", group: "Company" },
    { token: "company.city", label: "Company City", group: "Company" },
    { token: "company.country", label: "Company Country", group: "Company" }
];
var PACKING_SLIP_MERGE_FIELDS = [
    { token: "shipment.number", label: "Shipment Number", group: "Shipment" },
    {
        token: "shipment.trackingNumber",
        label: "Tracking Number",
        group: "Shipment"
    },
    { token: "customer.name", label: "Customer Name", group: "Customer" },
    { token: "customer.addressLine1", label: "Address", group: "Customer" },
    { token: "customer.city", label: "City", group: "Customer" },
    { token: "customer.country", label: "Country", group: "Customer" },
    { token: "company.name", label: "Company Name", group: "Company" },
    { token: "company.city", label: "Company City", group: "Company" },
    { token: "company.country", label: "Company Country", group: "Company" }
];
var STOCK_TRANSFER_MERGE_FIELDS = [
    { token: "transfer.number", label: "Transfer Number", group: "Transfer" },
    { token: "transfer.location", label: "Location", group: "Transfer" },
    { token: "transfer.assignee", label: "Assignee", group: "Transfer" },
    { token: "company.name", label: "Company Name", group: "Company" },
    { token: "company.city", label: "Company City", group: "Company" },
    { token: "company.country", label: "Company Country", group: "Company" }
];
var JOB_TRAVELER_MERGE_FIELDS = [
    { token: "job.number", label: "Job Number", group: "Job" },
    { token: "job.startDate", label: "Start Date", group: "Job" },
    { token: "job.dueDate", label: "Due Date", group: "Job" },
    { token: "item.readableId", label: "Item ID", group: "Item" },
    { token: "item.name", label: "Item Name", group: "Item" },
    { token: "customer.name", label: "Customer Name", group: "Customer" },
    { token: "company.name", label: "Company Name", group: "Company" },
    { token: "company.city", label: "Company City", group: "Company" },
    { token: "company.country", label: "Company Country", group: "Company" }
];
var ISSUE_MERGE_FIELDS = [
    { token: "issue.number", label: "Issue Number", group: "Issue" },
    { token: "issue.name", label: "Issue Name", group: "Issue" },
    { token: "issue.status", label: "Status", group: "Issue" },
    { token: "issue.openDate", label: "Open Date", group: "Issue" },
    { token: "issue.closeDate", label: "Close Date", group: "Issue" },
    { token: "company.name", label: "Company Name", group: "Company" },
    { token: "company.city", label: "Company City", group: "Company" },
    { token: "company.country", label: "Company Country", group: "Company" }
];
var TRACKING_LABEL_MERGE_FIELDS = [
    { token: "item.id", label: "Item ID", group: "Item" },
    { token: "item.revision", label: "Revision", group: "Item" },
    { token: "label.quantity", label: "Quantity", group: "Label" },
    { token: "label.trackingType", label: "Tracking Type", group: "Label" },
    { token: "label.number", label: "Serial / Batch Number", group: "Label" },
    { token: "label.trackedEntityId", label: "Tracked Entity ID", group: "Label" }
];
/** Catalog of insertable merge fields per document type (editor-facing). */
exports.MERGE_FIELDS = {
    salesInvoice: SALES_INVOICE_MERGE_FIELDS,
    salesOrder: SALES_ORDER_MERGE_FIELDS,
    purchaseOrder: PURCHASE_ORDER_MERGE_FIELDS,
    quote: QUOTE_MERGE_FIELDS,
    packingSlip: PACKING_SLIP_MERGE_FIELDS,
    stockTransfer: STOCK_TRANSFER_MERGE_FIELDS,
    jobTraveler: JOB_TRAVELER_MERGE_FIELDS,
    issue: ISSUE_MERGE_FIELDS,
    trackingLabel: TRACKING_LABEL_MERGE_FIELDS
};
function getMergeFields(documentType) {
    var _a;
    return (_a = exports.MERGE_FIELDS[documentType]) !== null && _a !== void 0 ? _a : [];
}
