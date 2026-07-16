"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCarbon = exports.setCarbonHmrStore = exports.CarbonContext = void 0;
var react_1 = require("react");
var zustand_1 = require("zustand");
exports.CarbonContext = (0, react_1.createContext)(null);
var __hmrStore = null;
var setCarbonHmrStore = function (store) {
    __hmrStore = store;
};
exports.setCarbonHmrStore = setCarbonHmrStore;
var useCarbon = function () {
    var store = (0, react_1.useContext)(exports.CarbonContext);
    if (!store && __hmrStore) {
        store = __hmrStore;
    }
    if (!store) {
        throw new Error("useCarbon must be used within a CarbonProvider");
    }
    return (0, zustand_1.useStore)(store);
};
exports.useCarbon = useCarbon;
