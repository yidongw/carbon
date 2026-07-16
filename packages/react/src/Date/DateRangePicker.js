"use strict";
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
var datepicker_1 = require("@react-aria/datepicker");
var datepicker_2 = require("@react-stately/datepicker");
var class_variance_authority_1 = require("class-variance-authority");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var HStack_1 = require("../HStack");
var Input_1 = require("../Input");
var Popover_1 = require("../Popover");
var Button_1 = require("./components/Button");
var DateField_1 = require("./components/DateField");
var RangeCalendar_1 = require("./components/RangeCalendar");
var iconVariants = (0, class_variance_authority_1.cva)("", {
    variants: {
        size: {
            sm: "h-3 w-3",
            md: "h-4 w-4",
            lg: "h-5 w-5"
        }
    },
    defaultVariants: {
        size: "md"
    }
});
var fieldVariants = (0, class_variance_authority_1.cva)("flex w-full", {
    variants: {
        size: {
            sm: "px-2 py-1",
            md: "px-4 py-2",
            lg: "px-6 py-3"
        }
    },
    defaultVariants: {
        size: "md"
    }
});
var DateRangePicker = function (_a) {
    var _b = _a.size, size = _b === void 0 ? "md" : _b, props = __rest(_a, ["size"]);
    var state = (0, datepicker_2.useDateRangePickerState)(__assign(__assign({}, props), { shouldCloseOnSelect: false }));
    var ref = (0, react_1.useRef)(null);
    var _c = (0, datepicker_1.useDateRangePicker)(props, state, ref), groupProps = _c.groupProps, startFieldProps = _c.startFieldProps, endFieldProps = _c.endFieldProps, buttonProps = _c.buttonProps, dialogProps = _c.dialogProps, calendarProps = _c.calendarProps;
    return (<Popover_1.Popover open={state.isOpen} onOpenChange={state.setOpen}>
      <div className="relative inline-flex flex-col w-full">
        <HStack_1.HStack className="w-full" spacing={0}>
          <Input_1.InputGroup {...groupProps} ref={ref} size={size} className="w-full inline-flex rounded-r-none">
            <div className={fieldVariants({ size: size })}>
              <DateField_1.default {...startFieldProps} size={size}/>
              <span aria-hidden="true" className="px-2">
                –
              </span>
              <DateField_1.default {...endFieldProps} size={size}/>
              {state.isInvalid && (<lu_1.LuBan className={"text-destructive-foreground absolute right-[12px] ".concat(iconVariants({ size: size }))}/>)}
            </div>
          </Input_1.InputGroup>

          <Popover_1.PopoverTrigger tabIndex={-1}>
            <Button_1.FieldButton {...buttonProps} isPressed={state.isOpen} size={size}/>
          </Popover_1.PopoverTrigger>
        </HStack_1.HStack>
        <Popover_1.PopoverContent align="end" {...dialogProps}>
          <RangeCalendar_1.RangeCalendar {...calendarProps}/>
        </Popover_1.PopoverContent>
      </div>
    </Popover_1.Popover>);
};
exports.default = DateRangePicker;
