"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormatPersonName = useFormatPersonName;
var utils_1 = require("@carbon/utils");
var react_1 = require("react");
var useSettings_1 = require("./useSettings");
function useFormatPersonName() {
    var lastNameFirst = (0, useSettings_1.useSettings)().lastNameFirst;
    return (0, react_1.useCallback)(function (person) { return (0, utils_1.formatPersonName)(person, lastNameFirst); }, [lastNameFirst]);
}
