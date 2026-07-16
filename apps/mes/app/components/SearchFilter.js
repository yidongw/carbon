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
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
var SearchFilter = function (_a) {
    var param = _a.param, size = _a.size, props = __rest(_a, ["param", "size"]);
    var _b = (0, hooks_1.useUrlParams)(), params = _b[0], setParams = _b[1];
    var _c = (0, react_2.useState)(params.get(param) || ""), query = _c[0], setQuery = _c[1];
    var debounceQuery = (0, react_1.useDebounce)(function (q) {
        var _a;
        setParams((_a = {}, _a[param] = q, _a));
    }, 500);
    return (<react_1.InputGroup size={size}>
      <react_1.InputLeftElement>
        <lu_1.LuSearch className="text-muted-foreground w-3.5 h-3.5 mt-[-2px]"/>
      </react_1.InputLeftElement>
      <react_1.Input value={query} onChange={function (e) {
            setQuery(e.target.value);
            debounceQuery(e.target.value);
        }} className="w-[100px] sm:w-[200px] text-sm" {...props}/>
    </react_1.InputGroup>);
};
exports.default = SearchFilter;
