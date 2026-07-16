"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSelectContext = void 0;
exports.default = useUserSelectContext;
var react_1 = require("react");
exports.UserSelectContext = (0, react_1.createContext)({});
function useUserSelectContext() {
    var context = (0, react_1.useContext)(exports.UserSelectContext);
    if (context === undefined) {
        throw new Error("useUserSelectContext must be used within a UserSelectContext.Provider");
    }
    return context;
}
