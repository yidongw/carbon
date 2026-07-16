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
exports.packingSlipBlockRegistry = void 0;
var CustomFieldBlock_1 = require("../CustomFieldBlock");
var extensionRegistry_1 = require("../extensionRegistry");
var DetailsBlock_1 = require("./DetailsBlock");
var HeaderBlock_1 = require("./HeaderBlock");
var LineItemsBlock_1 = require("./LineItemsBlock");
var NotesBlock_1 = require("./NotesBlock");
var PartiesBlock_1 = require("./PartiesBlock");
var TermsBlock_1 = require("./TermsBlock");
/** Block-type → renderer for Packing Slip (fulfillment; no summary/pricing). */
exports.packingSlipBlockRegistry = __assign(__assign({}, extensionRegistry_1.extensionBlocks), { header: function (_a) {
        var data = _a.data;
        return <HeaderBlock_1.HeaderBlock data={data}/>;
    }, parties: function (_a) {
        var data = _a.data;
        return <PartiesBlock_1.PartiesBlock data={data}/>;
    }, notes: function (_a) {
        var data = _a.data;
        return <NotesBlock_1.NotesBlock data={data}/>;
    }, details: function (_a) {
        var data = _a.data;
        return <DetailsBlock_1.DetailsBlock data={data}/>;
    }, lineItems: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "lineItems" ? (<LineItemsBlock_1.LineItemsBlock block={block} data={data}/>) : null;
    }, terms: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "terms" ? <TermsBlock_1.TermsBlock block={block} data={data}/> : null;
    }, customField: function (_a) {
        var _b, _c;
        var block = _a.block, data = _a.data;
        return block.type === "customField" ? (<CustomFieldBlock_1.CustomFieldBlock block={block} customFields={((_c = (_b = data.shipment) === null || _b === void 0 ? void 0 : _b.customFields) !== null && _c !== void 0 ? _c : {})}/>) : null;
    } });
