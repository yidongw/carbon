"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProductLabelZPL = generateProductLabelZPL;
var template_1 = require("../template");
var utils_1 = require("./utils");
/** Merge-field values for a label (kept in sync with buildLabelVars). */
function labelVars(item) {
    var str = function (v) { return (v == null ? "" : String(v)); };
    return {
        "item.id": str(item.itemId),
        "item.revision": str(item.revision),
        "label.quantity": str(item.quantity),
        "label.trackingType": str(item.trackingType),
        "label.number": str(item.number),
        "label.trackedEntityId": str(item.trackedEntityId)
    };
}
/**
 * Map a barcode symbology to its ZPL command for a given dot height. `scale`
 * sizes the QR module so it stays scannable across label stock sizes.
 */
function zplBarcode(symbology, value, heightDots, scale) {
    switch (symbology) {
        case "code128":
            return "^BCN,".concat(heightDots, ",N,N,N^FD").concat(value, "^FS");
        case "datamatrix":
            return "^BXN,".concat(Math.max(3, Math.floor(heightDots / 20)), ",200^FD").concat(value, "^FS");
        case "qrcode": {
            // `MA,` field-data prefix = error-correction level M + Automatic input
            // mode. Module scales with the label rather than a fixed step.
            var module = Math.max(2, Math.min(8, Math.round(4 * scale)));
            return "^BQN,2,".concat(module, "^FDMA,").concat(value, "^FS");
        }
        default: // pdf417
            return "^BY2^B7N,".concat(Math.max(2, Math.floor(heightDots / 20)), ",5,0,0,N^FD").concat(value, "^FS");
    }
}
/**
 * Generate ZPL for a tracked-entity label. Honors the `trackingLabel` template:
 * only visible fields are emitted, and the text fields stack in block order
 * (QR stays top-right, the entity id stays at the bottom — same partitioning as
 * the PDF). Extension/custom blocks are skipped (no ZPL equivalent).
 *
 * Sizing is driven by `getZplLabelGeometry` so margins, fonts and the QR scale
 * continuously with the stock (203dpi, 2"x1" baseline), and the header carries
 * `^MNW` (continuous media) + `^CI28` (UTF-8).
 */
function generateProductLabelZPL(item, labelSize, template, logo) {
    var _a, _b, _c, _d, _e;
    var geometry = (0, utils_1.getZplLabelGeometry)(labelSize);
    var widthDots = geometry.widthDots, heightDots = geometry.heightDots, hScale = geometry.hScale, scale = geometry.scale, margin = geometry.margin;
    var titleFont = Math.round(25 * scale);
    var descFont = Math.round(18 * scale);
    var smallFont = Math.round(12 * scale);
    var headingGap = titleFont + Math.round(10 * hScale);
    var descGap = Math.round(25 * scale);
    // Top-right code slot, scaled to the stock. All dot values are rounded —
    // ZPL coordinates and sizes must be integers.
    var qrModuleSize = Math.max(2, Math.min(8, Math.round(4 * scale)));
    var qrPixelSize = qrModuleSize * 29;
    var qrSlotSize = Math.round(Math.min(heightDots * 0.7, widthDots * 0.3));
    var qrStartX = widthDots - qrSlotSize - margin;
    // Reserve for the bottom entity-id line so flowed barcodes clear it.
    var bottomReserve = smallFont + Math.round(18 * hScale);
    var resolved = (0, template_1.resolveTemplate)("trackingLabel", template !== null && template !== void 0 ? template : null);
    var visibleBlocks = resolved.blocks.filter(function (block) { return block.visible; });
    var vars = labelVars(item);
    var zpl = (0, utils_1.zplLabelHeader)(geometry);
    // Text fields stack from the top, following block order.
    var yPosition = Math.round(30 * hScale);
    var textLine = function (size, text) {
        zpl += "^FO".concat(margin, ",").concat(yPosition, "^A0N,").concat(size, ",").concat(size, "^FD").concat(text, "^FS");
    };
    for (var _i = 0, visibleBlocks_1 = visibleBlocks; _i < visibleBlocks_1.length; _i++) {
        var block = visibleBlocks_1[_i];
        switch (block.type) {
            case "labelHeading":
                if (item.itemId) {
                    textLine(titleFont, item.itemId);
                    yPosition += headingGap;
                }
                break;
            case "labelRevision":
                if (item.revision) {
                    textLine(descFont, "".concat(block.label || "Rev", ": ").concat(item.revision));
                    yPosition += descGap;
                }
                break;
            case "labelQuantity":
                if (["Serial", "Batch"].includes(item.trackingType)) {
                    textLine(descFont, "".concat(block.label || "Qty", ": ").concat(item.quantity));
                    yPosition += descGap;
                }
                break;
            case "labelTracking":
                if (item.number && ["Serial", "Batch"].includes(item.trackingType)) {
                    var defaultName = item.trackingType === "Serial" ? "S/N" : "Batch";
                    textLine(descFont, "".concat(block.label || defaultName, ": ").concat(item.number));
                    yPosition += descGap;
                }
                break;
            case "labelEntityId": {
                // Human-readable identifier text at the bottom (interpolated value).
                var value = (0, template_1.interpolateString)((_a = block.value) !== null && _a !== void 0 ? _a : "", vars);
                if (value) {
                    var idY = heightDots - smallFont - Math.round(10 * hScale);
                    zpl += "^FO".concat(margin, ",").concat(idY, "^A0N,").concat(smallFont, ",").concat(smallFont, "^FD").concat(value, "^FS");
                }
                break;
            }
            case "labelLogo":
                if (logo === null || logo === void 0 ? void 0 : logo.gfa) {
                    // Top-right, like the QR slot.
                    var logoW = (_b = logo.widthDots) !== null && _b !== void 0 ? _b : Math.round(widthDots * 0.3);
                    var logoX = widthDots - logoW - margin;
                    zpl += "^FO".concat(logoX > 0 ? logoX : margin, ",").concat(Math.round(20 * hScale)).concat(logo.gfa, "^FS");
                }
                break;
            case "labelBarcode": {
                var value = (0, template_1.interpolateString)((_c = block.value) !== null && _c !== void 0 ? _c : "", vars);
                if (value) {
                    if (block.placement === "full") {
                        // Full-width band that flows below the text, sized to the space
                        // left between the text and the bottom entity-id line.
                        var gap = Math.round(6 * hScale);
                        var bcY = yPosition + gap;
                        var avail = heightDots - bottomReserve - bcY;
                        var bcHeight = Math.max(20, Math.min(Math.round(110 * scale), avail));
                        zpl += "^FO".concat(margin, ",").concat(bcY);
                        zpl += zplBarcode(block.symbology, value, bcHeight, scale);
                        yPosition = bcY + bcHeight;
                    }
                    else if (block.placement === "center") {
                        // Centered square that flows below the text (e.g. QR-only label).
                        var gap = Math.round(6 * hScale);
                        var bcY = yPosition + gap;
                        var avail = heightDots - bottomReserve - bcY;
                        var bcSize = Math.max(20, Math.min(qrSlotSize, avail));
                        var bcX = Math.max(margin, Math.round((widthDots - bcSize) / 2));
                        zpl += "^FO".concat(bcX, ",").concat(bcY);
                        zpl += zplBarcode(block.symbology, value, bcSize, scale);
                        yPosition = bcY + bcSize;
                    }
                    else {
                        // Top-right slot. QR positions by its real pixel width.
                        var isQr = block.symbology === "qrcode";
                        var bcX = isQr ? widthDots - qrPixelSize - margin : qrStartX;
                        zpl += "^FO".concat(bcX > 0 ? bcX : margin, ",").concat(Math.round(30 * hScale));
                        zpl += zplBarcode(block.symbology, value, Math.round(110 * scale), scale);
                    }
                }
                break;
            }
            case "field": {
                // A single authored line: "label: value" (or just the value).
                var value = (0, template_1.interpolateString)((_d = block.value) !== null && _d !== void 0 ? _d : "", vars);
                var text = block.label ? "".concat(block.label, ": ").concat(value) : value;
                if (text) {
                    textLine(descFont, text);
                    yPosition += descGap;
                }
                break;
            }
            case "customField": {
                var value = (_e = item.customFields) === null || _e === void 0 ? void 0 : _e[block.fieldId];
                if (value != null && value !== "") {
                    textLine(descFont, "".concat(block.label, ": ").concat(value));
                    yPosition += descGap;
                }
                break;
            }
            // Rich text / key-value lists / spacers / shared sections have no
            // single-line ZPL equivalent — skip.
            default:
                break;
        }
    }
    zpl += "^XZ"; // End format
    return zpl;
}
