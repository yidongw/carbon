"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCompanySettings = useCompanySettings;
var react_1 = require("@carbon/react");
var path_1 = require("~/utils/path");
function useCompanySettings() {
    var data = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    return data === null || data === void 0 ? void 0 : data.companySettings;
}
