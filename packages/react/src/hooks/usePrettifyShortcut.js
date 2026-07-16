"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePrettifyShortcut = usePrettifyShortcut;
var utils_1 = require("@carbon/utils");
var OperatingSystem_1 = require("../OperatingSystem");
function usePrettifyShortcut() {
    var platform = (0, OperatingSystem_1.useOperatingSystem)().platform;
    var isMac = platform === "mac";
    return function (input) { return (0, utils_1.prettifyKeyboardShortcut)(input, isMac); };
}
