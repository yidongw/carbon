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
var IconButton_1 = require("../../IconButton");
var Tooltip_1 = require("../../Tooltip");
var ToolbarButton = function (_a) {
    var label = _a.label, isActive = _a.isActive, rest = __rest(_a, ["label", "isActive"]);
    return (<Tooltip_1.Tooltip>
      <Tooltip_1.TooltipTrigger asChild>
        <IconButton_1.IconButton variant={isActive ? "solid" : "ghost"} aria-label={label} {...rest}/>
      </Tooltip_1.TooltipTrigger>
      <Tooltip_1.TooltipContent>{label}</Tooltip_1.TooltipContent>
    </Tooltip_1.Tooltip>);
};
exports.default = ToolbarButton;
