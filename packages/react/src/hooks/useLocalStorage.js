"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useLocalStorage = function (key, initialValue) {
    var _a = (0, react_1.useState)(initialValue), storedValue = _a[0], setStoredValue = _a[1];
    (0, react_1.useEffect)(function () {
        // Retrieve from localStorage
        var item = window.localStorage.getItem(key);
        if (item) {
            setStoredValue(JSON.parse(item));
        }
    }, [key]);
    var setValue = function (value) {
        // Save state
        var newValue = value instanceof Function ? value(storedValue) : value;
        setStoredValue(newValue);
        // Save to localStorage
        window.localStorage.setItem(key, JSON.stringify(newValue));
    };
    return [storedValue, setValue];
};
exports.default = useLocalStorage;
