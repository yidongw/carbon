"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var New = function (_a) {
    var label = _a.label, to = _a.to, _b = _a.variant, variant = _b === void 0 ? "primary" : _b;
    var t = (0, macro_1.useLingui)().t;
    var buttonRef = (0, react_2.useRef)(null);
    (0, react_1.useKeyboardShortcuts)({
        n: function (event) {
            var _a;
            event.stopPropagation();
            (_a = buttonRef.current) === null || _a === void 0 ? void 0 : _a.click();
        }
    });
    return (<react_1.Tooltip>
      <react_1.TooltipTrigger>
        <react_1.Button asChild leftIcon={<lu_1.LuCirclePlus />} variant={variant} ref={buttonRef}>
          <react_router_1.Link to={to} prefetch="intent">
            {label ? "".concat(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Add"], ["Add"]))), " ").concat(label) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Add"], ["Add"])))}
          </react_router_1.Link>
        </react_1.Button>
      </react_1.TooltipTrigger>
      <react_1.TooltipContent>
        <react_1.HStack>
          <react_1.Kbd>N</react_1.Kbd>
        </react_1.HStack>
      </react_1.TooltipContent>
    </react_1.Tooltip>);
};
exports.default = New;
var templateObject_1, templateObject_2;
