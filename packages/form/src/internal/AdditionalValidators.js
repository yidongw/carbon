"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdditionalValidatorsContext = void 0;
exports.useAdditionalValidatorsContext = useAdditionalValidatorsContext;
var react_1 = require("react");
exports.AdditionalValidatorsContext = (0, react_1.createContext)(null);
function useAdditionalValidatorsContext() {
    return (0, react_1.useContext)(exports.AdditionalValidatorsContext);
}
