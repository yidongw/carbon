"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIntegrations = useIntegrations;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var path_1 = require("~/utils/path");
function useIntegrations() {
    var _a;
    var list = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var has = (0, react_2.useCallback)(function (id) {
        var _a, _b;
        return (_b = (_a = list === null || list === void 0 ? void 0 : list.integrations.find(function (i) { return i.id === id; })) === null || _a === void 0 ? void 0 : _a.active) !== null && _b !== void 0 ? _b : false;
    }, [list === null || list === void 0 ? void 0 : list.integrations]);
    return {
        list: (_a = list === null || list === void 0 ? void 0 : list.integrations) !== null && _a !== void 0 ? _a : [],
        has: has
    };
}
