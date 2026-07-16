"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldConfig = FieldConfig;
exports.LabelBarcodeConfig = LabelBarcodeConfig;
exports.HeaderLogoConfig = HeaderLogoConfig;
exports.LabelLogoConfig = LabelLogoConfig;
exports.LabelEntityIdConfig = LabelEntityIdConfig;
exports.LabelFieldNameConfig = LabelFieldNameConfig;
var template_1 = require("@carbon/documents/template");
var react_1 = require("@carbon/react");
var hooks_1 = require("~/hooks");
var configHelpers_1 = require("./configHelpers");
var context_1 = require("./context");
var LogoCropper_1 = require("./LogoCropper");
var MergeFieldMenu_1 = require("./MergeFieldMenu");
var NumberRow_1 = require("./NumberRow");
var useHeaderConfig_1 = require("./useHeaderConfig");
/**
 * A single authored line. With a `label` it's a key-value; without, plain text.
 * The value is a single-line string (ZPL-safe) and supports merge fields.
 */
function FieldConfig(_a) {
    var _b, _c;
    var block = _a.block;
    var updateBlock = (0, context_1.useDocumentTemplate)().updateBlock;
    var insertField = function (snippet) { var _a; return updateBlock(block.id, { value: ((_a = block.value) !== null && _a !== void 0 ? _a : "") + snippet }); };
    return (<div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <react_1.Label htmlFor="field-label">Label (optional)</react_1.Label>
        <react_1.Input id="field-label" value={(_b = block.label) !== null && _b !== void 0 ? _b : ""} onChange={function (e) { return updateBlock(block.id, { label: e.target.value }); }}/>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <react_1.Label htmlFor="field-value">Value</react_1.Label>
          <MergeFieldMenu_1.MergeFieldMenu onInsert={insertField} label="Insert field"/>
        </div>
        <react_1.Input id="field-value" value={(_c = block.value) !== null && _c !== void 0 ? _c : ""} onChange={function (e) { return updateBlock(block.id, { value: e.target.value }); }}/>
      </div>
    </div>);
}
var BARCODE_SYMBOLOGIES = [
    { value: "pdf417", label: "PDF417" },
    { value: "code128", label: "Code 128" },
    { value: "datamatrix", label: "Data Matrix" },
    { value: "qrcode", label: "QR Code" }
];
/** Symbology + value + height for a barcode block. */
function LabelBarcodeConfig(_a) {
    var _b, _c;
    var block = _a.block;
    var updateBlock = (0, context_1.useDocumentTemplate)().updateBlock;
    var insertField = function (snippet) { var _a; return updateBlock(block.id, { value: ((_a = block.value) !== null && _a !== void 0 ? _a : "") + snippet }); };
    return (<div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <react_1.Label>Type</react_1.Label>
        <react_1.Select value={block.symbology} onValueChange={function (value) {
            return updateBlock(block.id, {
                symbology: value
            });
        }}>
          <react_1.SelectTrigger>
            <react_1.SelectValue />
          </react_1.SelectTrigger>
          <react_1.SelectContent>
            {BARCODE_SYMBOLOGIES.map(function (s) { return (<react_1.SelectItem key={s.value} value={s.value}>
                {s.label}
              </react_1.SelectItem>); })}
          </react_1.SelectContent>
        </react_1.Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <react_1.Label htmlFor="barcode-value">Value</react_1.Label>
          <MergeFieldMenu_1.MergeFieldMenu onInsert={insertField} label="Insert field"/>
        </div>
        <react_1.Input id="barcode-value" value={(_b = block.value) !== null && _b !== void 0 ? _b : ""} onChange={function (e) { return updateBlock(block.id, { value: e.target.value }); }}/>
      </div>
      <div className="flex flex-col gap-1.5">
        <react_1.Label>Placement</react_1.Label>
        <react_1.Select value={block.placement} onValueChange={function (value) {
            return updateBlock(block.id, {
                placement: value
            });
        }}>
          <react_1.SelectTrigger>
            <react_1.SelectValue />
          </react_1.SelectTrigger>
          <react_1.SelectContent>
            <react_1.SelectItem value="right">Top-right</react_1.SelectItem>
            <react_1.SelectItem value="center">Centered</react_1.SelectItem>
            <react_1.SelectItem value="full">Full width</react_1.SelectItem>
          </react_1.SelectContent>
        </react_1.Select>
      </div>
      <NumberRow_1.NumberRow label="Height (pt)" minValue={16} maxValue={300} value={(_c = block.height) !== null && _c !== void 0 ? _c : 56} onChange={function (v) { return updateBlock(block.id, { height: v }); }}/>
    </div>);
}
/**
 * The document header logo, edited inline (no dialog). Edits live in the editor
 * store (`headerConfig`), so the preview reflects them instantly and they
 * persist with the template on Save.
 */
function HeaderLogoConfig() {
    var _a, _b, _c, _d;
    var company = (0, hooks_1.useUser)().company;
    var _e = (0, useHeaderConfig_1.useHeaderConfig)(), section = _e.section, config = _e.config, patch = _e.patch;
    if (!section) {
        return (<p className="text-xs text-muted-foreground">
        The header section isn't available yet — save the template first.
      </p>);
    }
    var variant = (_a = config.logoVariant) !== null && _a !== void 0 ? _a : "mark";
    var src = variant === "icon"
        ? ((_b = company === null || company === void 0 ? void 0 : company.logoLightIcon) !== null && _b !== void 0 ? _b : company === null || company === void 0 ? void 0 : company.logoLight)
        : ((_c = company === null || company === void 0 ? void 0 : company.logoLight) !== null && _c !== void 0 ? _c : company === null || company === void 0 ? void 0 : company.logoLightIcon);
    return (<div className="flex flex-col gap-3">
      {!config.showLogo && (<p className="text-xs text-muted-foreground">
          Logo is hidden — turn it on with the eye toggle in the list.
        </p>)}
      <div className="flex flex-col gap-1.5">
        <react_1.Label>Logo</react_1.Label>
        <react_1.Select value={variant} onValueChange={function (value) {
            // Switching source invalidates the crop aspect.
            return patch({
                logoVariant: value,
                logoCrop: undefined
            });
        }}>
          <react_1.SelectTrigger>
            <react_1.SelectValue />
          </react_1.SelectTrigger>
          <react_1.SelectContent>
            <react_1.SelectItem value="mark">Wordmark</react_1.SelectItem>
            <react_1.SelectItem value="icon">Mark</react_1.SelectItem>
          </react_1.SelectContent>
        </react_1.Select>
      </div>
      {src ? (<LogoCropper_1.LogoCropper src={src} crop={config.logoCrop} onChange={function (crop) { return patch({ logoCrop: crop }); }}/>) : (<p className="text-xs text-muted-foreground">
          No company logo set — upload one in company settings to crop it.
        </p>)}
      <NumberRow_1.NumberRow label="Height (pt)" minValue={16} maxValue={120} value={(_d = config.logoHeight) !== null && _d !== void 0 ? _d : template_1.DEFAULT_HEADER_OPTIONS.logoHeight} onChange={function (v) { return patch({ logoHeight: v }); }}/>
    </div>);
}
/** Company logo: B&W toggle + height. */
function LabelLogoConfig(_a) {
    var _b, _c, _d, _e, _f;
    var block = _a.block;
    var updateBlock = (0, context_1.useDocumentTemplate)().updateBlock;
    var company = (0, hooks_1.useUser)().company;
    var variant = (_b = block.variant) !== null && _b !== void 0 ? _b : "mark";
    var src = variant === "icon"
        ? ((_c = company === null || company === void 0 ? void 0 : company.logoLightIcon) !== null && _c !== void 0 ? _c : company === null || company === void 0 ? void 0 : company.logoLight)
        : ((_d = company === null || company === void 0 ? void 0 : company.logoLight) !== null && _d !== void 0 ? _d : company === null || company === void 0 ? void 0 : company.logoLightIcon);
    return (<div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <react_1.Label>Logo</react_1.Label>
        <react_1.Select value={variant} onValueChange={function (value) {
            // Switching source invalidates the old crop's aspect.
            return updateBlock(block.id, {
                variant: value,
                crop: undefined
            });
        }}>
          <react_1.SelectTrigger>
            <react_1.SelectValue />
          </react_1.SelectTrigger>
          <react_1.SelectContent>
            <react_1.SelectItem value="mark">Wordmark</react_1.SelectItem>
            <react_1.SelectItem value="icon">Mark</react_1.SelectItem>
          </react_1.SelectContent>
        </react_1.Select>
      </div>
      {src ? (<LogoCropper_1.LogoCropper src={src} crop={block.crop} onChange={function (crop) { return updateBlock(block.id, { crop: crop }); }}/>) : (<p className="text-xs text-muted-foreground">
          No company logo set — upload one in company settings to crop it.
        </p>)}
      <configHelpers_1.ToggleRow label="Print in black & white" checked={(_e = block.monochrome) !== null && _e !== void 0 ? _e : false} onChange={function (v) { return updateBlock(block.id, { monochrome: v }); }}/>
      <NumberRow_1.NumberRow label="Height (pt)" minValue={16} maxValue={160} value={(_f = block.height) !== null && _f !== void 0 ? _f : 50} onChange={function (v) { return updateBlock(block.id, { height: v }); }}/>
      <p className="text-xs text-muted-foreground">
        Label printers always print the logo in black & white.
      </p>
    </div>);
}
/** The identifier line: a single interpolated value (merge fields supported). */
function LabelEntityIdConfig(_a) {
    var _b;
    var block = _a.block;
    var updateBlock = (0, context_1.useDocumentTemplate)().updateBlock;
    var insertField = function (snippet) { var _a; return updateBlock(block.id, { value: ((_a = block.value) !== null && _a !== void 0 ? _a : "") + snippet }); };
    return (<div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <react_1.Label htmlFor="identifier-value">Value</react_1.Label>
        <MergeFieldMenu_1.MergeFieldMenu onInsert={insertField} label="Insert field"/>
      </div>
      <react_1.Input id="identifier-value" value={(_b = block.value) !== null && _b !== void 0 ? _b : ""} onChange={function (e) { return updateBlock(block.id, { value: e.target.value }); }}/>
    </div>);
}
var LABEL_FIELD_DEFAULT_NAME = {
    labelRevision: "Rev",
    labelQuantity: "Qty",
    labelTracking: "S/N"
};
/** Edit the printed name (prefix before the value) of a built-in label field. */
function LabelFieldNameConfig(_a) {
    var _b;
    var block = _a.block;
    var updateBlock = (0, context_1.useDocumentTemplate)().updateBlock;
    var placeholder = LABEL_FIELD_DEFAULT_NAME[block.type];
    return (<div className="flex flex-col gap-1.5">
      <react_1.Label htmlFor="label-field-name">Field name</react_1.Label>
      <react_1.Input id="label-field-name" value={(_b = block.label) !== null && _b !== void 0 ? _b : ""} placeholder={placeholder} onChange={function (e) { return updateBlock(block.id, { label: e.target.value }); }}/>
      <p className="text-xs text-muted-foreground">
        Printed before the value, e.g. “{block.label || placeholder}: …”.
      </p>
    </div>);
}
