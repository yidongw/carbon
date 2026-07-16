"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNanoStore = useNanoStore;
var react_1 = require("@nanostores/react");
var react_2 = require("react");
function useNanoStore(atom, idbKey) {
    var value = (0, react_1.useStore)(atom);
    var set = (0, react_2.useCallback)(function (value, initial) {
        if (initial === void 0) { initial = false; }
        if (typeof value === "function") {
            atom.set(value(atom.get()));
        }
        else {
            atom.set(value);
        }
    }, [atom]);
    return [value, set];
}
