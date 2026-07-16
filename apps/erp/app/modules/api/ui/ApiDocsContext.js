"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDocsProvider = ApiDocsProvider;
exports.useApiDocsConfig = useApiDocsConfig;
var react_1 = require("react");
var ApiDocsContext = (0, react_1.createContext)(null);
function ApiDocsProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(""), apiUrl = _b[0], setApiUrlState = _b[1];
    var _c = (0, react_1.useState)(""), apiKey = _c[0], setApiKeyState = _c[1];
    var setApiUrl = (0, react_1.useCallback)(function (url) { return setApiUrlState(url); }, []);
    var setApiKey = (0, react_1.useCallback)(function (key) { return setApiKeyState(key); }, []);
    var value = (0, react_1.useMemo)(function () { return ({ apiUrl: apiUrl, apiKey: apiKey, setApiUrl: setApiUrl, setApiKey: setApiKey }); }, [apiUrl, apiKey, setApiUrl, setApiKey]);
    return (<ApiDocsContext.Provider value={value}>{children}</ApiDocsContext.Provider>);
}
function useApiDocsConfig() {
    var ctx = (0, react_1.useContext)(ApiDocsContext);
    if (!ctx) {
        throw new Error("useApiDocsConfig must be used within an ApiDocsProvider");
    }
    return ctx;
}
