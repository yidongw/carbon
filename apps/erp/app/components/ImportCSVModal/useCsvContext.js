"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportCsvContext = void 0;
exports.useCsvContext = useCsvContext;
var react_1 = require("react");
exports.ImportCsvContext = (0, react_1.createContext)(null);
function useCsvContext() {
    var context = (0, react_1.useContext)(exports.ImportCsvContext);
    if (!context)
        throw new Error("useCsvContext must be used within an ImportCsvContext.Provider");
    return context;
}
