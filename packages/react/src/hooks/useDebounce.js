"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useDebounce;
var react_1 = require("react");
/**
 * A function that you call with a debounce delay, the function will only be called after the delay has passed
 *
 * @param fn The function to debounce
 * @param delay In ms
 * @param executeOnUnmount Whether to execute the pending function when component unmounts
 */
function useDebounce(fn, delay, executeOnUnmount) {
    if (executeOnUnmount === void 0) { executeOnUnmount = false; }
    var timeout = (0, react_1.useRef)();
    var argsRef = (0, react_1.useRef)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () {
        return function () {
            if (executeOnUnmount && timeout.current && argsRef.current) {
                clearTimeout(timeout.current);
                fn.apply(void 0, argsRef.current);
            }
            else if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, [executeOnUnmount]);
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
        argsRef.current = args;
        timeout.current = setTimeout(function () {
            fn.apply(void 0, args);
        }, delay);
    };
}
