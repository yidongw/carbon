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
exports.Count = void 0;
var Badge_1 = require("./Badge");
var Count = function (_a) {
    var count = _a.count, props = __rest(_a, ["count"]);
    var c = count > 99 ? "99+" : count;
    return (<Badge_1.Badge variant="secondary" className="tabular-nums" {...props}>{"".concat(c)}</Badge_1.Badge>);
};
exports.Count = Count;
