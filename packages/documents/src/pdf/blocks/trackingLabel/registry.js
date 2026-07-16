"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackingLabelBlockRegistry = void 0;
var CustomFieldBlock_1 = require("../CustomFieldBlock");
var LabelBlocks_1 = require("./LabelBlocks");
/** Block-type → renderer for a tracking label (per-field elements). */
exports.trackingLabelBlockRegistry = {
    labelHeading: function (_a) {
        var data = _a.data;
        return <LabelBlocks_1.LabelHeadingBlock data={data}/>;
    },
    labelRevision: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "labelRevision" ? (<LabelBlocks_1.LabelRevisionBlock block={block} data={data}/>) : null;
    },
    labelQuantity: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "labelQuantity" ? (<LabelBlocks_1.LabelQuantityBlock block={block} data={data}/>) : null;
    },
    labelTracking: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "labelTracking" ? (<LabelBlocks_1.LabelTrackingBlock block={block} data={data}/>) : null;
    },
    labelEntityId: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "labelEntityId" ? (<LabelBlocks_1.LabelEntityIdBlock block={block} data={data}/>) : null;
    },
    labelBarcode: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "labelBarcode" ? (<LabelBlocks_1.LabelBarcodeBlock block={block} data={data}/>) : null;
    },
    labelLogo: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "labelLogo" ? (<LabelBlocks_1.LabelLogoBlock block={block} data={data}/>) : null;
    },
    header: function () { return null; },
    watermark: function () { return null; },
    parties: function () { return null; },
    notes: function () { return null; },
    details: function () { return null; },
    lineItems: function () { return null; },
    summary: function () { return null; },
    terms: function () { return null; },
    jobDetails: function () { return null; },
    operations: function () { return null; },
    issueDetails: function () { return null; },
    associations: function () { return null; },
    actionTasks: function () { return null; },
    reviewers: function () { return null; },
    // Single-line fields are supported (and mirrored in ZPL). Rich text /
    // key-value lists / spacers / shared sections are not.
    field: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "field" ? (<LabelBlocks_1.LabelFieldBlock block={block} data={data}/>) : null;
    },
    customField: function (_a) {
        var _b;
        var block = _a.block, data = _a.data;
        return block.type === "customField" ? (<CustomFieldBlock_1.CustomFieldBlock block={block} customFields={((_b = data.item.customFields) !== null && _b !== void 0 ? _b : {})}/>) : null;
    },
    richText: function () { return null; },
    keyValue: function () { return null; },
    spacer: function () { return null; },
    shared: function () { return null; }
};
