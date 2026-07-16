"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSavedViews = useSavedViews;
var react_1 = require("@carbon/react");
var path_1 = require("~/utils/path");
function useSavedViews() {
    var _a;
    var params = (0, react_1.useUrlParams)()[0];
    var view = params.get("view");
    var data = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var savedViews = (data === null || data === void 0 ? void 0 : data.savedViews) && isSavedViews(data.savedViews) ? data.savedViews : [];
    var currentView = (_a = savedViews.find(function (v) { return v.id === view; })) !== null && _a !== void 0 ? _a : null;
    var addSavedViewsToRoutes = function (route) { return (__assign(__assign({}, route), { views: savedViews
            .filter(function (view) { return view.table === route.table; })
            .map(function (view) {
            var _a, _b;
            return (__assign(__assign({}, view), { to: "".concat(route.to, "?view=").concat(view.id).concat(((_a = view.filters) === null || _a === void 0 ? void 0 : _a.length) ? "&filter=".concat(view.filters.join("&filter=")) : "").concat(((_b = view.sorts) === null || _b === void 0 ? void 0 : _b.length) ? "&sort=".concat(view.sorts.join("&sort=")) : "") }));
        }) })); };
    return {
        currentView: currentView,
        hasView: currentView !== null,
        savedViews: savedViews,
        view: view,
        addSavedViewsToRoutes: addSavedViewsToRoutes
    };
}
function isSavedViews(value) {
    return (Array.isArray(value) &&
        value.every(function (view) {
            return Array.isArray(view.columnOrder) &&
                typeof view.columnPinning === "object" &&
                typeof view.columnVisibility === "object" &&
                typeof view.name === "string" &&
                typeof view.table === "string" &&
                typeof view.id === "string" &&
                (view.sorts === undefined || Array.isArray(view.sorts)) &&
                (view.filters === undefined || Array.isArray(view.filters));
        }));
}
