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
exports.Loading = Loading;
var Spinner_1 = require("./Spinner");
var cn_1 = require("./utils/cn");
function Loading(_a) {
    var children = _a.children, isLoading = _a.isLoading, className = _a.className, spinnerClassName = _a.spinnerClassName, props = __rest(_a, ["children", "isLoading", "className", "spinnerClassName"]);
    return isLoading ? (<div className={(0, cn_1.cn)("flex flex-grow h-full w-full items-center justify-center", className)} {...props}>
      <Spinner_1.Spinner className={spinnerClassName !== null && spinnerClassName !== void 0 ? spinnerClassName : "size-8"}/>
    </div>) : (<>{children}</>);
}
