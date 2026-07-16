"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOptimisticTheme = useOptimisticTheme;
exports.useTheme = useTheme;
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
function useOptimisticTheme() {
    var fetchers = (0, react_router_1.useFetchers)();
    var themeFetcher = fetchers.find(function (f) { return f.formAction === path_1.path.to.theme; });
    if (themeFetcher && themeFetcher.formData) {
        var theme = { theme: themeFetcher.formData.get("theme") };
        var submission = settings_1.themeValidator.safeParse(theme);
        if (submission.success) {
            return submission.data.theme;
        }
    }
}
function useTheme() {
    var _a;
    var optimisticTheme = useOptimisticTheme();
    var routeData = (0, react_1.useRouteData)(path_1.path.to.root);
    var theme = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.theme) !== null && _a !== void 0 ? _a : "zinc";
    if (optimisticTheme) {
        theme = optimisticTheme;
    }
    return theme;
}
