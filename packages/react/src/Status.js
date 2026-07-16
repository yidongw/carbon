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
exports.Status = void 0;
var lu_1 = require("react-icons/lu");
var Badge_1 = require("./Badge");
var Tooltip_1 = require("./Tooltip");
var cn_1 = require("./utils/cn");
var getStatusIcon = function (color) {
    switch (color) {
        case "green":
            return <lu_1.LuCircleCheck />;
        case "orange":
            return <lu_1.LuCircleAlert />;
        case "red":
            return <lu_1.LuCircleSlash />;
        case "yellow":
            return <lu_1.LuClock />;
        case "blue":
            return <lu_1.LuLoaderCircle />;
        case "purple":
            return <lu_1.LuStar />;
        case "gray":
        default:
            return <lu_1.LuCircleDashed />;
    }
};
var Status = function (_a) {
    var _b = _a.color, color = _b === void 0 ? "gray" : _b, children = _a.children, tooltip = _a.tooltip, disableTooltip = _a.disableTooltip, _c = _a.iconOnly, iconOnly = _c === void 0 ? false : _c, className = _a.className, props = __rest(_a, ["color", "children", "tooltip", "disableTooltip", "iconOnly", "className"]);
    var badge = (<Badge_1.Badge variant={color} className={(0, cn_1.cn)("inline-flex items-center gap-1", iconOnly && "px-1.5 shrink-0", className)} {...props}>
      {getStatusIcon(color)}
      {!iconOnly && children}
    </Badge_1.Badge>);
    if (disableTooltip)
        return badge;
    return (<Tooltip_1.Tooltip>
      <Tooltip_1.TooltipTrigger asChild>{badge}</Tooltip_1.TooltipTrigger>
      <Tooltip_1.TooltipContent>
        <span>{tooltip !== null && tooltip !== void 0 ? tooltip : children}</span>
      </Tooltip_1.TooltipContent>
    </Tooltip_1.Tooltip>);
};
exports.Status = Status;
