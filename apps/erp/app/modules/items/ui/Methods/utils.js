"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathToMakeMethod = getPathToMakeMethod;
var path_1 = require("~/utils/path");
function getPathToMakeMethod(type, id, methodId) {
    switch (type) {
        case "Part":
            return "".concat(path_1.path.to.partDetails(id), "?methodId=").concat(methodId);
        case "Style":
            return "".concat(path_1.path.to.style(id), "?methodId=").concat(methodId);
        case "Tool":
            return "".concat(path_1.path.to.toolDetails(id), "?methodId=").concat(methodId);
        default:
            return "#";
    }
}
