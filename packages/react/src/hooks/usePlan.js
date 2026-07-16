"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePlan = usePlan;
var utils_1 = require("@carbon/utils");
var useRouteData_1 = require("./useRouteData");
function usePlan() {
    var routeData = (0, useRouteData_1.useRouteData)("/x");
    return (0, utils_1.normalizePlanId)(routeData === null || routeData === void 0 ? void 0 : routeData.plan);
}
