"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRouteData = useRouteData;
var react_1 = require("react");
var react_router_1 = require("react-router");
function useRouteData(path) {
    var matchingRoutes = (0, react_router_1.useMatches)();
    var route = (0, react_1.useMemo)(function () { return matchingRoutes.find(function (route) { return route.pathname === path; }); }, [matchingRoutes, path]);
    return (route === null || route === void 0 ? void 0 : route.data) || undefined;
}
