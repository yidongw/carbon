"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabelPdfGeometry = getLabelPdfGeometry;
/**
 * PDF geometry for a single label page, mirroring the ZPL generators'
 * layout (baseline 2" x 1" at 203dpi) so PDF and ZPL prints look alike.
 * All values are in PDF points (72 per inch); the page is exactly the
 * label size.
 */
var POINTS_PER_DOT = 72 / 203;
function getLabelPdfGeometry(labelSize) {
    var pageWidth = labelSize.width * 72;
    var pageHeight = labelSize.height * 72;
    var wScale = labelSize.width / 2;
    var hScale = labelSize.height / 1;
    var scale = Math.min(wScale, hScale);
    var qrModuleSize = Math.max(2, Math.min(8, Math.round(4 * scale)));
    return {
        pageWidth: pageWidth,
        pageHeight: pageHeight,
        scale: scale,
        margin: 20 * Math.max(scale, 0.8) * POINTS_PER_DOT,
        contentTop: 30 * hScale * POINTS_PER_DOT,
        titleFontSize: 25 * scale * POINTS_PER_DOT,
        descFontSize: 18 * scale * POINTS_PER_DOT,
        smallFontSize: 12 * scale * POINTS_PER_DOT,
        lineGap: 7 * scale * POINTS_PER_DOT,
        bottomOffset: 10 * hScale * POINTS_PER_DOT,
        qrSize: qrModuleSize * 29 * POINTS_PER_DOT
    };
}
