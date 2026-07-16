"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormStateContext = void 0;
exports.useFormStateContext = useFormStateContext;
var react_1 = require("react");
exports.FormStateContext = (0, react_1.createContext)({
    isDisabled: false,
    isReadOnly: false
});
function useFormStateContext() {
    return (0, react_1.useContext)(exports.FormStateContext);
}
