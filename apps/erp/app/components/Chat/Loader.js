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
exports.Loader = void 0;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var LoaderIcon = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 16 : _b;
    return (<svg height={size} strokeLinejoin="round" style={{ color: "currentcolor" }} viewBox="0 0 16 16" width={size}>
    <title>
      <macro_1.Trans>Loader</macro_1.Trans>
    </title>
    <g clipPath="url(#clip0_2393_1490)">
      <path d="M8 0V4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 16V12" opacity="0.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3.29773 1.52783L5.64887 4.7639" opacity="0.9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12.7023 1.52783L10.3511 4.7639" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12.7023 14.472L10.3511 11.236" opacity="0.4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3.29773 14.472L5.64887 11.236" opacity="0.6" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M15.6085 5.52783L11.8043 6.7639" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M0.391602 10.472L4.19583 9.23598" opacity="0.7" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M15.6085 10.4722L11.8043 9.2361" opacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M0.391602 5.52783L4.19583 6.7639" opacity="0.8" stroke="currentColor" strokeWidth="1.5"/>
    </g>
    <defs>
      <clipPath id="clip0_2393_1490">
        <rect fill="white" height="16" width="16"/>
      </clipPath>
    </defs>
  </svg>);
};
var Loader = function (_a) {
    var className = _a.className, _b = _a.size, size = _b === void 0 ? 16 : _b, props = __rest(_a, ["className", "size"]);
    return (<div className={(0, react_1.cn)("inline-flex animate-spin items-center justify-center", className)} {...props}>
    <LoaderIcon size={size}/>
  </div>);
};
exports.Loader = Loader;
