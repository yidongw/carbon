"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSettings = useSettings;
var react_1 = require("@carbon/react");
var path_1 = require("~/utils/path");
function useSettings() {
    var routeData = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    if (!(routeData === null || routeData === void 0 ? void 0 : routeData.companySettings)) {
        throw new Error("Company settings not found");
    }
    return routeData.companySettings;
}
