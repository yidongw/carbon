"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOperatingSystem = exports.OperatingSystemContextProvider = void 0;
var react_1 = require("react");
var Context = (0, react_1.createContext)(null);
var OperatingSystemContextProvider = function (_a) {
    var platform = _a.platform, children = _a.children;
    return <Context.Provider value={{ platform: platform }}>{children}</Context.Provider>;
};
exports.OperatingSystemContextProvider = OperatingSystemContextProvider;
var throwIfNoProvider = function () {
    throw new Error("Please wrap your application in an OperatingSystemContextProvider.");
};
var useOperatingSystem = function () {
    var _a;
    var platform = ((_a = (0, react_1.useContext)(Context)) !== null && _a !== void 0 ? _a : throwIfNoProvider()).platform;
    return { platform: platform };
};
exports.useOperatingSystem = useOperatingSystem;
