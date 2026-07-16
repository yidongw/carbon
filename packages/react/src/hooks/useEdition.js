"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEdition = useEdition;
var utils_1 = require("@carbon/utils");
var useRouteData_1 = require("./useRouteData");
function useEdition() {
    var _a, _b;
    var routeData = (0, useRouteData_1.useRouteData)("/");
    return (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.env) === null || _a === void 0 ? void 0 : _a.CARBON_EDITION) !== null && _b !== void 0 ? _b : utils_1.Edition.Community;
}
