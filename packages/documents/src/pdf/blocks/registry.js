"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesInvoiceBlockRegistry = void 0;
var components_1 = require("../components");
var CustomFieldBlock_1 = require("./CustomFieldBlock");
var HeaderBlock_1 = require("./HeaderBlock");
var KeyValueBlock_1 = require("./KeyValueBlock");
var LineItemsBlock_1 = require("./LineItemsBlock");
var NotesBlock_1 = require("./NotesBlock");
var PartiesBlock_1 = require("./PartiesBlock");
var RichTextBlock_1 = require("./RichTextBlock");
var SharedBlock_1 = require("./SharedBlock");
var SpacerBlock_1 = require("./SpacerBlock");
var SummaryBlock_1 = require("./SummaryBlock");
var TermsBlock_1 = require("./TermsBlock");
/**
 * Maps each block type to its react-pdf renderer. Built-in renderers read
 * from `data`; extension renderers narrow `block` by its discriminant. The
 * driver looks up by `block.type` — an O(1) Map lookup per block.
 */
exports.salesInvoiceBlockRegistry = {
    header: function (_a) {
        var data = _a.data;
        return <HeaderBlock_1.HeaderBlock data={data}/>;
    },
    watermark: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "watermark" ? (<components_1.Watermark src={data.company.logoWatermark} show opacity={block.opacity} placement={block.placement} size={block.size}/>) : null;
    },
    parties: function (_a) {
        var data = _a.data;
        return <PartiesBlock_1.PartiesBlock data={data}/>;
    },
    notes: function (_a) {
        var data = _a.data;
        return <NotesBlock_1.NotesBlock data={data}/>;
    },
    details: function () { return null; },
    lineItems: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "lineItems" ? (<LineItemsBlock_1.LineItemsBlock block={block} data={data}/>) : null;
    },
    summary: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "summary" ? (<SummaryBlock_1.SummaryBlock block={block} data={data}/>) : null;
    },
    terms: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "terms" ? <TermsBlock_1.TermsBlock block={block} data={data}/> : null;
    },
    jobDetails: function () { return null; },
    operations: function () { return null; },
    issueDetails: function () { return null; },
    associations: function () { return null; },
    actionTasks: function () { return null; },
    reviewers: function () { return null; },
    labelHeading: function () { return null; },
    labelRevision: function () { return null; },
    labelQuantity: function () { return null; },
    labelTracking: function () { return null; },
    labelEntityId: function () { return null; },
    richText: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "richText" ? (<RichTextBlock_1.RichTextBlock block={block} vars={data.vars}/>) : null;
    },
    keyValue: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "keyValue" ? (<KeyValueBlock_1.KeyValueBlock block={block} vars={data.vars}/>) : null;
    },
    spacer: function (_a) {
        var block = _a.block;
        return block.type === "spacer" ? <SpacerBlock_1.SpacerBlock block={block}/> : null;
    },
    shared: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "shared" ? (<SharedBlock_1.SharedBlock block={block} sections={data.sections} vars={data.vars}/>) : null;
    },
    labelBarcode: function () { return null; },
    labelLogo: function () { return null; },
    field: function () { return null; },
    customField: function (_a) {
        var _b, _c;
        var block = _a.block, data = _a.data;
        return block.type === "customField" ? (<CustomFieldBlock_1.CustomFieldBlock block={block} customFields={((_c = (_b = data.salesInvoice) === null || _b === void 0 ? void 0 : _b.customFields) !== null && _c !== void 0 ? _c : {})}/>) : null;
    }
};
