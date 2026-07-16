"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormatPersonName = useFormatPersonName;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var react_2 = require("react");
var path_1 = require("~/utils/path");
function useFormatPersonName() {
    var _a;
    var routeData = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var lastNameFirst = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.lastNameFirst) !== null && _a !== void 0 ? _a : false;
    return (0, react_2.useCallback)(function (person) { return (0, utils_1.formatPersonName)(person, lastNameFirst); }, [lastNameFirst]);
}
