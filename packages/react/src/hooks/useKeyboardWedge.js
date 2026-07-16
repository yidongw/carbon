"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKeyboardWedge = useKeyboardWedge;
var react_1 = require("react");
var react_router_1 = require("react-router");
function useKeyboardWedge(options) {
    var _a, _b, _c;
    var _d = (0, react_1.useState)(""), inputBuffer = _d[0], setInputBuffer = _d[1];
    var navigate = (0, react_router_1.useNavigate)();
    // Default test and callback for backward compatibility
    var defaultTest = function (input) { return input.startsWith("http"); };
    var defaultCallback = function (input) {
        try {
            var url = new URL(input);
            navigate(url.pathname + url.search);
        }
        catch (_a) {
            navigate(input);
        }
    };
    var test = (_a = options === null || options === void 0 ? void 0 : options.test) !== null && _a !== void 0 ? _a : defaultTest;
    var callback = (_b = options === null || options === void 0 ? void 0 : options.callback) !== null && _b !== void 0 ? _b : defaultCallback;
    var active = (_c = options === null || options === void 0 ? void 0 : options.active) !== null && _c !== void 0 ? _c : true;
    (0, react_1.useEffect)(function () {
        if (!active)
            return;
        var handleKeyDown = function (event) {
            // Check if the active element is an input or textarea
            var activeElement = document.activeElement;
            if (activeElement &&
                (activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA")) {
                return;
            }
            if (/^[a-zA-Z0-9\-./:?=&_]$/.test(event.key)) {
                setInputBuffer(function (prev) { return prev + event.key; });
            }
            else if (event.key === "Enter") {
                if (test(inputBuffer)) {
                    event.preventDefault();
                }
                if (test(inputBuffer)) {
                    callback(inputBuffer);
                }
                setInputBuffer("");
            }
            else if (event.key === "Escape") {
                setInputBuffer("");
            }
        };
        var timeoutId = setTimeout(function () {
            setInputBuffer("");
        }, 3000);
        document.addEventListener("keydown", handleKeyDown);
        return function () {
            document.removeEventListener("keydown", handleKeyDown);
            clearTimeout(timeoutId);
        };
    }, [inputBuffer, test, callback, active]);
    return inputBuffer;
}
