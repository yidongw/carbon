"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedModelTypes = exports.convertKbToString = void 0;
var convertKbToString = function (kb) {
    if (kb < 1024) {
        return "".concat(kb, " KB");
    }
    var mb = kb / 1024;
    if (mb < 1024) {
        return "".concat(mb.toFixed(2), " MB");
    }
    var gb = mb / 1024;
    return "".concat(gb.toFixed(2), " GB");
};
exports.convertKbToString = convertKbToString;
exports.supportedModelTypes = [
    "3dm",
    "3ds",
    "3mf",
    "amf",
    "bim",
    "brep",
    "dae",
    "fbx",
    "fcstd",
    "gltf",
    "ifc",
    "iges",
    "obj",
    "off",
    "ply",
    "step",
    "stl",
    "stp"
];
