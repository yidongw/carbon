"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getZplLabelGeometry = getZplLabelGeometry;
exports.zplLabelHeader = zplLabelHeader;
/**
 * Computes label dimensions in printer dots and a scale factor relative to
 * the 2"x1" baseline (406x203 dots at 203dpi).
 */
function getZplLabelGeometry(labelSize) {
    if (!labelSize.zpl) {
        throw new Error("Invalid label size or missing ZPL configuration");
    }
    var _a = labelSize.zpl, width = _a.width, height = _a.height;
    var dpi = labelSize.zpl.dpi || 203;
    var widthDots = Math.round(width * dpi);
    var heightDots = Math.round(height * dpi);
    var wScale = widthDots / 406;
    var hScale = heightDots / 203;
    var scale = Math.min(wScale, hScale);
    var margin = Math.round(20 * Math.max(scale, 0.8));
    return { widthDots: widthDots, heightDots: heightDots, wScale: wScale, hScale: hScale, scale: scale, margin: margin };
}
/** Standard label preamble: start format, set size, no media tracking, UTF-8. */
function zplLabelHeader(_a) {
    var widthDots = _a.widthDots, heightDots = _a.heightDots;
    return "^XA^PW".concat(widthDots, "^LL").concat(heightDots, "^MNW^CI28");
}
