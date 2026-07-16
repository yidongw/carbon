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
exports.LabelFieldBlock = LabelFieldBlock;
exports.LabelHeadingBlock = LabelHeadingBlock;
exports.LabelRevisionBlock = LabelRevisionBlock;
exports.LabelQuantityBlock = LabelQuantityBlock;
exports.LabelTrackingBlock = LabelTrackingBlock;
exports.LabelEntityIdBlock = LabelEntityIdBlock;
exports.LabelBarcodeBlock = LabelBarcodeBlock;
exports.LabelLogoBlock = LabelLogoBlock;
var renderer_1 = require("@react-pdf/renderer");
var barcode_1 = require("../../../qr/barcode");
var template_1 = require("../../../template");
var LogoImage_1 = require("../../components/LogoImage");
var tw_1 = require("./tw");
/**
 * A two-column field row: name column (fixed width, so rows align) + value.
 * With no name, the value spans the row (plain text).
 */
function LabelFieldRow(_a) {
    var name = _a.name, value = _a.value, data = _a.data;
    if (!value)
        return null;
    var fontSize = "".concat(data.descriptionFontSize, "pt");
    if (!name) {
        return <renderer_1.Text style={__assign(__assign({}, (0, tw_1.tw)("mb-1")), { fontSize: fontSize })}>{value}</renderer_1.Text>;
    }
    return (<renderer_1.View style={(0, tw_1.tw)("flex flex-row mb-1")}>
      <renderer_1.Text style={{ width: data.labelColWidth, fontSize: fontSize }}>{name}:</renderer_1.Text>
      <renderer_1.Text style={{ flex: 1, fontSize: fontSize }}>{value}</renderer_1.Text>
    </renderer_1.View>);
}
/** A single authored line: `label: value` (or just the value when no label). */
function LabelFieldBlock(_a) {
    var _b;
    var block = _a.block, data = _a.data;
    return (<LabelFieldRow name={block.label || undefined} value={(0, template_1.interpolateString)((_b = block.value) !== null && _b !== void 0 ? _b : "", data.vars)} data={data}/>);
}
/** Item ID — the bold label heading. */
function LabelHeadingBlock(_a) {
    var data = _a.data;
    var item = data.item, titleFontSize = data.titleFontSize;
    if (!item.itemId)
        return null;
    return (<renderer_1.Text style={__assign(__assign({ maxWidth: "100%" }, (0, tw_1.tw)("mb-1")), { fontWeight: "bold", fontSize: "".concat(titleFontSize, "pt"), lineHeight: 1.2 })}>
      {item.itemId}
    </renderer_1.Text>);
}
/** Revision row. */
function LabelRevisionBlock(_a) {
    var block = _a.block, data = _a.data;
    if (!data.item.revision)
        return null;
    return (<LabelFieldRow name={block.label || "Rev"} value={String(data.item.revision)} data={data}/>);
}
/** Quantity row (serial/batch-tracked items only). */
function LabelQuantityBlock(_a) {
    var _b;
    var block = _a.block, data = _a.data;
    if (!["Serial", "Batch"].includes(data.item.trackingType))
        return null;
    return (<LabelFieldRow name={block.label || "Qty"} value={String((_b = data.item.quantity) !== null && _b !== void 0 ? _b : "")} data={data}/>);
}
/** Serial / Batch number row. */
function LabelTrackingBlock(_a) {
    var block = _a.block, data = _a.data;
    var item = data.item;
    if (!item.number)
        return null;
    var defaultName = item.trackingType === "Serial"
        ? "S/N"
        : item.trackingType === "Batch"
            ? "Batch"
            : null;
    if (!defaultName)
        return null;
    return (<LabelFieldRow name={block.label || defaultName} value={String(item.number)} data={data}/>);
}
/** A human-readable identifier line (interpolated value), centered. */
function LabelEntityIdBlock(_a) {
    var _b;
    var block = _a.block, data = _a.data;
    var value = (0, template_1.interpolateString)((_b = block.value) !== null && _b !== void 0 ? _b : "", data.vars);
    if (!value)
        return null;
    return (<renderer_1.Text style={__assign(__assign({}, (0, tw_1.tw)("mt-1 text-center")), { fontSize: "".concat(data.descriptionFontSize - 1, "pt"), width: "100%", flexShrink: 0 })}>
      {value}
    </renderer_1.Text>);
}
/**
 * The scannable code. `right` placement renders square (top-right, like the
 * old QR slot); `full` placement stretches full width (e.g. PDF417).
 */
function LabelBarcodeBlock(_a) {
    var _b, _c, _d;
    var block = _a.block, data = _a.data;
    var value = (0, template_1.interpolateString)((_b = block.value) !== null && _b !== void 0 ? _b : "", data.vars);
    if (!value)
        return null;
    // 2D square codes scale by module (no height, or they distort); linear and
    // stacked codes take a bar/row height.
    var isSquare = block.symbology === "qrcode" || block.symbology === "datamatrix";
    var src = (0, barcode_1.generateBarcode)(value, block.symbology, isSquare ? { scale: 4 } : { height: block.symbology === "pdf417" ? 8 : 12 });
    if (block.placement === "full") {
        // Scale to the label stock so a full-width code never crowds out the text
        // rows (which clip/overlap on short labels). ~32% of the cell height, capped.
        var height = (_c = block.height) !== null && _c !== void 0 ? _c : Math.max(28, Math.min(64, data.labelHeightPt * 0.32));
        return (<renderer_1.View style={__assign(__assign({}, (0, tw_1.tw)("w-full flex items-center mt-1")), { flexShrink: 0 })}>
        <renderer_1.Image src={src} style={{ width: "100%", height: height, objectFit: "contain" }}/>
      </renderer_1.View>);
    }
    var size = (_d = block.height) !== null && _d !== void 0 ? _d : data.qrCodeSize;
    if (block.placement === "center") {
        // Centered square in its own full-width row (e.g. a QR-only small label).
        return (<renderer_1.View style={__assign(__assign({}, (0, tw_1.tw)("w-full flex items-center mt-1")), { flexShrink: 0 })}>
        <renderer_1.Image src={src} style={{ width: size, height: size, objectFit: "contain" }}/>
      </renderer_1.View>);
    }
    return (<renderer_1.View style={(0, tw_1.tw)("flex items-center justify-center mb-1")}>
      <renderer_1.Image src={src} style={{ width: size, height: size, objectFit: "contain" }}/>
    </renderer_1.View>);
}
/** The company logo (color, or the monochrome variant when toggled / for ZPL). */
function LabelLogoBlock(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var block = _a.block, data = _a.data;
    var light = (_b = data.company) === null || _b === void 0 ? void 0 : _b.logoLight;
    var icon = (_c = data.company) === null || _c === void 0 ? void 0 : _c.logoLightIcon;
    // `icon` variant prefers the square logo; `mark` prefers the full logo.
    var companyLogo = block.variant === "icon" ? (icon !== null && icon !== void 0 ? icon : light) : (light !== null && light !== void 0 ? light : icon);
    var src = block.monochrome
        ? ((_g = (_e = (_d = data.logo) === null || _d === void 0 ? void 0 : _d.mono) !== null && _e !== void 0 ? _e : (_f = data.logo) === null || _f === void 0 ? void 0 : _f.color) !== null && _g !== void 0 ? _g : companyLogo)
        : ((_j = (_h = data.logo) === null || _h === void 0 ? void 0 : _h.color) !== null && _j !== void 0 ? _j : companyLogo);
    if (!src)
        return null;
    return (<renderer_1.View style={(0, tw_1.tw)("flex items-end mb-1")}>
      <LogoImage_1.LogoImage src={src} height={(_k = block.height) !== null && _k !== void 0 ? _k : 50} crop={block.crop}/>
    </renderer_1.View>);
}
