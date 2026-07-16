"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.FormLabel = void 0;
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var cn_1 = require("../utils/cn");
var FormControl_1 = require("./FormControl");
exports.FormLabel = (0, react_1.forwardRef)(function (props, ref) {
    var _a;
    var className = props.className, children = props.children, _b = props.isConfigured, isConfigured = _b === void 0 ? false : _b, _c = props.isOptional, isOptional = _c === void 0 ? false : _c, onConfigure = props.onConfigure, rest = __rest(props, ["className", "children", "isConfigured", "isOptional", "onConfigure"]);
    var t = (0, macro_1.useLingui)().t;
    var field = (0, FormControl_1.useFormControlContext)();
    var labelProps = (_a = field === null || field === void 0 ? void 0 : field.getLabelProps(rest, ref)) !== null && _a !== void 0 ? _a : __assign({ ref: ref }, rest);
    return (<label {...labelProps} ref={ref} className="flex items-center justify-between">
      <span className={(0, cn_1.cn)("text-xs font-medium text-muted-foreground", className)}>
        {children}
      </span>
      {(isOptional || onConfigure) && (<div className="flex items-center gap-1">
          {isOptional && (<span className="text-muted-foreground text-xxs">
              <macro_1.Trans>Optional</macro_1.Trans>
            </span>)}
          {onConfigure && (<lu_1.LuSquareFunction aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Configure"], ["Configure"])))} role="button" onClick={onConfigure} className={(0, cn_1.cn)("size-4", isConfigured
                    ? "text-emerald-500"
                    : "opacity-50 hover:opacity-100")}/>)}
        </div>)}
    </label>);
});
exports.FormLabel.displayName = "FormLabel";
var templateObject_1;
