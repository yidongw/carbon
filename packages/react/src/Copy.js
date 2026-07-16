"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var IconButton_1 = require("./IconButton");
var Tooltip_1 = require("./Tooltip");
var cn_1 = require("./utils/cn");
var dom_1 = require("./utils/dom");
var Copy = function (_a) {
    var text = _a.text, icon = _a.icon, className = _a.className, _b = _a.withTextInTooltip, withTextInTooltip = _b === void 0 ? false : _b, _c = _a.size, size = _c === void 0 ? "sm" : _c;
    var t = (0, macro_1.useLingui)().t;
    var _d = (0, react_1.useState)(false), isCopied = _d[0], setIsCopied = _d[1];
    var handleCopy = function (e) {
        e.stopPropagation();
        (0, dom_1.copyToClipboard)(text);
        setIsCopied(true);
        setTimeout(function () { return setIsCopied(false); }, 1500);
    };
    return (<Tooltip_1.Tooltip>
      <Tooltip_1.TooltipTrigger asChild>
        <IconButton_1.IconButton variant="secondary" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Copy"], ["Copy"])))} icon={isCopied ? <lu_1.LuCheck /> : (icon !== null && icon !== void 0 ? icon : <lu_1.LuCopy />)} size={size} className={(0, cn_1.cn)(isCopied && "text-emerald-500 hover:text-emerald-500", className)} onClick={handleCopy}/>
      </Tooltip_1.TooltipTrigger>
      <Tooltip_1.TooltipContent>
        <span>
          {isCopied
            ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Copied!"], ["Copied!"]))) : withTextInTooltip
            ? text
            : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Copy to clipboard"], ["Copy to clipboard"])))}
        </span>
      </Tooltip_1.TooltipContent>
    </Tooltip_1.Tooltip>);
};
exports.default = Copy;
var templateObject_1, templateObject_2, templateObject_3;
