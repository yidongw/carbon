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
Object.defineProperty(exports, "__esModule", { value: true });
var macro_1 = require("@lingui/react/macro");
var datepicker_1 = require("@react-aria/datepicker");
var datepicker_2 = require("@react-stately/datepicker");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var Button_1 = require("../Button");
var HStack_1 = require("../HStack");
var IconButton_1 = require("../IconButton");
var Input_1 = require("../Input");
var Popover_1 = require("../Popover");
var Tooltip_1 = require("../Tooltip");
var Button_2 = require("./components/Button");
var Calendar_1 = require("./components/Calendar");
var DateField_1 = require("./components/DateField");
var DatePicker = function (props) {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var state = (0, datepicker_2.useDatePickerState)(__assign(__assign({}, props), { shouldCloseOnSelect: (_a = props.closeOnSelect) !== null && _a !== void 0 ? _a : false }));
    var ref = (0, react_1.useRef)(null);
    var _b = (0, datepicker_1.useDatePicker)(props, state, ref), groupProps = _b.groupProps, fieldProps = _b.fieldProps, buttonProps = _b.buttonProps, dialogProps = _b.dialogProps, calendarProps = _b.calendarProps;
    return (<Popover_1.Popover open={state.isOpen} onOpenChange={state.setOpen}>
      <div className="relative inline-flex flex-col w-full">
        <HStack_1.HStack className="w-full" spacing={0}>
          {props.inline ? (<>
              {props.isPreviewInline && typeof props.inline !== "boolean" ? (<Popover_1.PopoverTrigger asChild>
                  <Button_1.Button variant="secondary" size="sm" className="gap-1.5" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Open date picker"], ["Open date picker"])))} isDisabled={props.isDisabled} {...buttonProps}>
                    {props.inline}
                    <lu_1.LuCalendarClock />
                  </Button_1.Button>
                </Popover_1.PopoverTrigger>) : (<>
                  <div className="flex-grow">{props.inline}</div>
                  <HStack_1.HStack spacing={0}>
                    {props.helperText && (<Tooltip_1.Tooltip>
                        <Tooltip_1.TooltipTrigger asChild>
                          <IconButton_1.IconButton icon={<lu_1.LuInfo />} variant="ghost" size="sm" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Helper information"], ["Helper information"])))}/>
                        </Tooltip_1.TooltipTrigger>
                        <Tooltip_1.TooltipContent>{props.helperText}</Tooltip_1.TooltipContent>
                      </Tooltip_1.Tooltip>)}
                    <Popover_1.PopoverTrigger asChild>
                      <IconButton_1.IconButton icon={<lu_1.LuCalendarClock />} variant="secondary" size="sm" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Open date picker"], ["Open date picker"])))} isDisabled={props.isDisabled} {...buttonProps}/>
                    </Popover_1.PopoverTrigger>
                  </HStack_1.HStack>
                </>)}
            </>) : (<>
              <Input_1.InputGroup {...groupProps} ref={ref} className="w-full inline-flex" isDisabled={props.isDisabled || props.isReadOnly}>
                <div className="flex w-full px-4 py-2">
                  <DateField_1.default {...fieldProps}/>
                  {state.isInvalid && (<lu_1.LuBan className="!text-destructive-foreground absolute right-[12px] top-[12px]"/>)}
                </div>
                <div className="flex-shrink-0 -mt-px">
                  <Popover_1.PopoverTrigger tabIndex={-1}>
                    <Button_2.FieldButton {...buttonProps} isPressed={state.isOpen}/>
                  </Popover_1.PopoverTrigger>
                </div>
              </Input_1.InputGroup>
            </>)}
        </HStack_1.HStack>
        <Popover_1.PopoverContent align="end" {...dialogProps}>
          <Calendar_1.Calendar {...calendarProps}/>
          <Popover_1.PopoverFooter>
            <Button_1.Button onClick={function () { return state.setValue(null); }} variant="secondary">
              Clear
            </Button_1.Button>
          </Popover_1.PopoverFooter>
        </Popover_1.PopoverContent>
      </div>
    </Popover_1.Popover>);
};
exports.default = DatePicker;
var templateObject_1, templateObject_2, templateObject_3;
