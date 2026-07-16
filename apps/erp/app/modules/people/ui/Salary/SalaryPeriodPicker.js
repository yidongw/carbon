"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SalaryPeriodPicker;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var salaryDetail_utils_1 = require("./salaryDetail.utils");
function SalaryPeriodPicker(_a) {
    var year = _a.year, month = _a.month, onChange = _a.onChange;
    var t = (0, macro_1.useLingui)().t;
    var prevMonth = function () {
        return month === 1 ? onChange(year - 1, 12) : onChange(year, month - 1);
    };
    var nextMonth = function () {
        return month === 12 ? onChange(year + 1, 1) : onChange(year, month + 1);
    };
    var currentYear = new Date().getFullYear();
    var yearOptions = Array.from({ length: 5 }, function (_, i) { return currentYear - 2 + i; });
    return (<react_1.HStack spacing={2}>
      <react_1.Button size="sm" variant="ghost" onClick={prevMonth} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Previous month"], ["Previous month"])))}>
        <lu_1.LuChevronLeft className="size-4"/>
      </react_1.Button>
      <react_1.Select value={String(month)} onValueChange={function (v) { return onChange(year, Number(v)); }}>
        <react_1.SelectTrigger className="w-36">
          <react_1.SelectValue />
        </react_1.SelectTrigger>
        <react_1.SelectContent>
          {salaryDetail_utils_1.MONTH_NAMES.map(function (name, i) { return (<react_1.SelectItem key={i + 1} value={String(i + 1)}>
              {name}
            </react_1.SelectItem>); })}
        </react_1.SelectContent>
      </react_1.Select>
      <react_1.Select value={String(year)} onValueChange={function (v) { return onChange(Number(v), month); }}>
        <react_1.SelectTrigger className="w-24">
          <react_1.SelectValue />
        </react_1.SelectTrigger>
        <react_1.SelectContent>
          {yearOptions.map(function (y) { return (<react_1.SelectItem key={y} value={String(y)}>
              {y}
            </react_1.SelectItem>); })}
        </react_1.SelectContent>
      </react_1.Select>
      <react_1.Button size="sm" variant="ghost" onClick={nextMonth} aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Next month"], ["Next month"])))}>
        <lu_1.LuChevronRight className="size-4"/>
      </react_1.Button>
    </react_1.HStack>);
}
var templateObject_1, templateObject_2;
