"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberInputStepper = exports.NumberInputGroup = exports.NumberInput = exports.NumberIncrementStepper = exports.NumberField = exports.NumberDecrementStepper = void 0;
var react_1 = require("react");
var ReactAria = require("react-aria-components");
var Input_1 = require("./Input");
var cn_1 = require("./utils/cn");
var NumberField = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<ReactAria.NumberField className={(0, cn_1.cn)("w-full", className)} {...props}/>);
};
exports.NumberField = NumberField;
var NumberInputGroup = function (props) {
    return <ReactAria.Group {...props}/>;
};
exports.NumberInputGroup = NumberInputGroup;
var NumberInputStepper = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<div className={(0, cn_1.cn)("absolute right-0 top-0 z-10 m-px flex h-[calc(100%-2px)] w-6 flex-col", className)} {...props}/>);
};
exports.NumberInputStepper = NumberInputStepper;
var NumberInput = (0, react_1.forwardRef)(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var handleFocus = function (input) {
        input.select();
    };
    var internalRef = function (input) {
        if (input && !input.hasAttribute("data-focus-listener")) {
            input.addEventListener("focus", function () { return handleFocus(input); });
            input.setAttribute("data-focus-listener", "true");
            return function () {
                input.removeEventListener("focus", function () { return handleFocus(input); });
                input.removeAttribute("data-focus-listener");
            };
        }
    };
    return (<Input_1.Input ref={function (input) {
            if (typeof ref === "function") {
                ref(input);
            }
            else if (ref) {
                ref.current = input;
            }
            internalRef(input);
        }} isReadOnly={props.isDisabled || props.isReadOnly} className={(0, cn_1.cn)("pr-6", className)} {...props}/>);
});
exports.NumberInput = NumberInput;
NumberInput.displayName = "NumberInput";
var NumberIncrementStepper = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<ReactAria.Button slot="increment" className={(0, cn_1.cn)([
            "flex flex-1 select-none items-center justify-center rounded-tr-md border-l border-border leading-none text-foreground transition-colors duration-100",
            // Pressed
            "pressed:bg-slate-100 dark:pressed:bg-slate-700",
            // Disabled
            "disabled:opacity-40 disabled:cursor-not-allowed"
        ], className)} {...props}/>);
};
exports.NumberIncrementStepper = NumberIncrementStepper;
var NumberDecrementStepper = function (_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    return (<ReactAria.Button slot="decrement" className={(0, cn_1.cn)([
            "flex flex-1 select-none items-center justify-center rounded-br-md border-l border-t border-border leading-none text-foreground transition-colors duration-100",
            // Pressed
            "pressed:bg-slate-100 dark:pressed:bg-slate-700",
            // Disabled
            "disabled:opacity-40 disabled:cursor-not-allowed"
        ], className)} {...props}/>);
};
exports.NumberDecrementStepper = NumberDecrementStepper;
