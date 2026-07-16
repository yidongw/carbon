"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOCUMENT_PDFS = void 0;
var IssuePDF_1 = require("./IssuePDF");
var issue_samples_1 = require("./issue.samples");
var JobTravelerPDF_1 = require("./JobTravelerPDF");
var jobTraveler_samples_1 = require("./jobTraveler.samples");
var PackingSlipPDF_1 = require("./PackingSlipPDF");
var ProductLabelPDF_1 = require("./ProductLabelPDF");
var PurchaseOrderPDF_1 = require("./PurchaseOrderPDF");
var packingSlip_samples_1 = require("./packingSlip.samples");
var purchaseOrder_samples_1 = require("./purchaseOrder.samples");
var QuotePDF_1 = require("./QuotePDF");
var quote_samples_1 = require("./quote.samples");
var SalesInvoicePDF_1 = require("./SalesInvoicePDF");
var SalesOrderPDF_1 = require("./SalesOrderPDF");
var StockTransferPDF_1 = require("./StockTransferPDF");
var salesOrder_samples_1 = require("./salesOrder.samples");
var samples_1 = require("./samples");
var stockTransfer_samples_1 = require("./stockTransfer.samples");
var trackingLabel_samples_1 = require("./trackingLabel.samples");
exports.DOCUMENT_PDFS = {
    salesInvoice: { Component: SalesInvoicePDF_1.default, sample: samples_1.SAMPLE_SALES_INVOICE },
    salesOrder: { Component: SalesOrderPDF_1.default, sample: salesOrder_samples_1.SAMPLE_SALES_ORDER },
    purchaseOrder: {
        Component: PurchaseOrderPDF_1.default,
        sample: purchaseOrder_samples_1.SAMPLE_PURCHASE_ORDER
    },
    quote: { Component: QuotePDF_1.default, sample: quote_samples_1.SAMPLE_QUOTE },
    packingSlip: { Component: PackingSlipPDF_1.default, sample: packingSlip_samples_1.SAMPLE_PACKING_SLIP },
    stockTransfer: {
        Component: StockTransferPDF_1.default,
        sample: stockTransfer_samples_1.SAMPLE_STOCK_TRANSFER
    },
    jobTraveler: {
        Component: JobTravelerPDF_1.default,
        sample: jobTraveler_samples_1.SAMPLE_JOB_TRAVELER
    },
    issue: { Component: IssuePDF_1.default, sample: issue_samples_1.SAMPLE_ISSUE },
    trackingLabel: {
        Component: ProductLabelPDF_1.default,
        sample: trackingLabel_samples_1.SAMPLE_TRACKING_LABEL
    }
};
