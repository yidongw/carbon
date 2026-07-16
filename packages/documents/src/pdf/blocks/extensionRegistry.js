"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extensionBlocks = void 0;
var components_1 = require("../components");
var FieldBlock_1 = require("./FieldBlock");
var KeyValueBlock_1 = require("./KeyValueBlock");
var RichTextBlock_1 = require("./RichTextBlock");
var SharedBlock_1 = require("./SharedBlock");
var SpacerBlock_1 = require("./SpacerBlock");
/**
 * The doc-agnostic extension blocks, defined once. Every non-label document
 * registry spreads this in instead of copy-pasting the same five entries — so
 * adding an extension block is a one-line change here, not an edit across every
 * registry. (Tracking labels are text-only and intentionally opt out.)
 */
exports.extensionBlocks = {
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
    field: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "field" ? (<FieldBlock_1.FieldBlock block={block} vars={data.vars}/>) : null;
    },
    watermark: function (_a) {
        var _b;
        var block = _a.block, data = _a.data;
        return block.type === "watermark" ? (<components_1.Watermark src={(_b = data.company) === null || _b === void 0 ? void 0 : _b.logoWatermark} show opacity={block.opacity} placement={block.placement} size={block.size}/>) : null;
    }
};
