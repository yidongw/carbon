"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.labelSizes = void 0;
exports.getLabelSizeDimensions = getLabelSizeDimensions;
exports.getLabelSizeLabel = getLabelSizeLabel;
/** Dimensions as `2" x 1"` or `100mm x 50mm` (width x height). */
function getLabelSizeDimensions(size) {
    if (size.metric) {
        var widthMm = Math.round(size.width * 25.4);
        var heightMm = Math.round(size.height * 25.4);
        return "".concat(widthMm, "mm x ").concat(heightMm, "mm");
    }
    return "".concat(size.width, "\" x ").concat(size.height, "\"");
}
/** Display label as `2" x 1"` for thermal sizes or `Avery 5163 4" x 2"` for sheets. */
function getLabelSizeLabel(size) {
    var dimensions = getLabelSizeDimensions(size);
    return size.zpl ? dimensions : "".concat(size.name, " ").concat(dimensions);
}
exports.labelSizes = [
    {
        id: "avery5163",
        name: "Avery 5163",
        width: 4,
        height: 2
    },
    {
        id: "label2x1",
        name: "Label 2x1",
        width: 2,
        height: 1,
        zpl: {
            dpi: 203,
            width: 2,
            height: 1
        }
    },
    {
        id: "label4x2",
        name: "Label 4x2",
        width: 4,
        height: 2,
        zpl: {
            dpi: 203,
            width: 4,
            height: 2
        }
    },
    {
        id: "label100x50mm",
        name: "Label 100x50mm",
        width: 3.937,
        height: 1.969,
        metric: true,
        zpl: {
            dpi: 203,
            width: 3.937,
            height: 1.969
        }
    },
    {
        id: "label50x25mm",
        name: "Label 50x25mm",
        width: 1.969,
        height: 0.984,
        metric: true,
        zpl: {
            dpi: 203,
            width: 1.969,
            height: 0.984
        }
    }
];
