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
exports.default = Empty;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
function Empty(_a) {
    var className = _a.className, children = _a.children, props = __rest(_a, ["className", "children"]);
    return (<react_1.VStack className={(0, react_1.cn)("w-full h-full justify-center items-center", className)} {...props}>
      <lu_1.LuCircleDashed className="size-8 text-muted-foreground"/>
      <h3 className="text-xs text-muted-foreground">
        <macro_1.Trans>Looks empty here</macro_1.Trans>&nbsp;&nbsp;👀
      </h3>
      {children}
    </react_1.VStack>);
}
