"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOptimisticMode = useOptimisticMode;
exports.useMode = useMode;
var utils_1 = require("@carbon/utils");
var react_router_1 = require("react-router");
var useRouteData_1 = require("./useRouteData");
function useOptimisticMode() {
    var fetchers = (0, react_router_1.useFetchers)();
    var modeFetcher = fetchers.find(function (f) { return f.formAction === "/"; });
    if (modeFetcher && modeFetcher.formData) {
        var mode = { mode: modeFetcher.formData.get("mode") };
        var submission = utils_1.modeValidator.safeParse(mode);
        if (submission.success) {
            return submission.data.mode;
        }
    }
}
function useMode() {
    var _a;
    var optimisticMode = useOptimisticMode();
    var routeData = (0, useRouteData_1.useRouteData)("/");
    var mode = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.mode) !== null && _a !== void 0 ? _a : "light";
    if (optimisticMode && optimisticMode !== "system") {
        mode = optimisticMode;
    }
    return mode;
}
