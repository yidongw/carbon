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
exports.Spinner = void 0;
var cn_1 = require("./utils/cn");
var Spinner = function (_a) {
    var className = _a.className, _b = _a.size, size = _b === void 0 ? 24 : _b, props = __rest(_a, ["className", "size"]);
    return (<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={(0, cn_1.cn)("animate-spin", className)} {...props}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>);
};
exports.Spinner = Spinner;
