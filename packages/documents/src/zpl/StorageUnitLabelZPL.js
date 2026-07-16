"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStorageUnitLabelZPL = generateStorageUnitLabelZPL;
var utils_1 = require("./utils");
function generateStorageUnitLabelZPL(item, labelSize) {
    var geometry = (0, utils_1.getZplLabelGeometry)(labelSize);
    var heightDots = geometry.heightDots, scale = geometry.scale, margin = geometry.margin;
    var titleFont = Math.round(40 * scale);
    var textY = Math.round((heightDots - titleFont) / 2);
    var zpl = (0, utils_1.zplLabelHeader)(geometry);
    zpl += "^FO".concat(margin, ",").concat(textY, "^A0N,").concat(titleFont, ",").concat(titleFont, "^FD").concat(item.name, "^FS");
    zpl += "^XZ";
    return zpl;
}
