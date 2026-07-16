"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var ChartOfAccountsTableFilters = function (_a) {
    var search = _a.search, onSearchChange = _a.onSearchChange;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, hooks_1.useUrlParams)(), params = _b[0], setParams = _b[1];
    var permissions = (0, hooks_1.usePermissions)();
    var startDate = params.get("startDate");
    var endDate = params.get("endDate");
    return (<div className="flex px-4 py-3 items-center space-x-4 justify-between bg-card border-b border-border w-full">
      <react_1.HStack>
        <react_1.InputGroup size="sm" className="w-64">
          <react_1.InputLeftElement>
            <lu_1.LuSearch className="h-4 w-4 text-muted-foreground"/>
          </react_1.InputLeftElement>
          <react_1.Input placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search accounts..."], ["Search accounts..."])))} value={search} onChange={function (e) { return onSearchChange(e.target.value); }}/>
        </react_1.InputGroup>
        <react_1.Popover>
          <react_1.PopoverTrigger asChild>
            <react_1.Button variant="secondary" leftIcon={<lu_1.LuCalendarDays />}>
              <macro_1.Trans>Date Range</macro_1.Trans>
            </react_1.Button>
          </react_1.PopoverTrigger>
          <react_1.PopoverContent className="w-[390px]">
            <react_1.PopoverHeader>
              <p className="text-sm">
                <macro_1.Trans>Edit date range</macro_1.Trans>
              </p>
              <p className="text-xs text-muted-foreground">
                <macro_1.Trans>
                  Select date range to filter net change and balance at date
                </macro_1.Trans>
              </p>
            </react_1.PopoverHeader>

            <div className="grid grid-cols-[1fr_3fr] gap-y-2 items-center">
              <p className="text-sm text-muted-foreground">
                <macro_1.Trans>Start Date</macro_1.Trans>
              </p>
              <react_1.DatePicker value={startDate ? (0, date_1.parseDate)(startDate) : null} onChange={function (value) {
            return setParams({ startDate: value === null || value === void 0 ? void 0 : value.toString() });
        }}/>
              <p className="text-sm text-muted-foreground">
                <macro_1.Trans>End Date</macro_1.Trans>
              </p>
              <react_1.DatePicker value={endDate ? (0, date_1.parseDate)(endDate) : null} onChange={function (value) { return setParams({ endDate: value === null || value === void 0 ? void 0 : value.toString() }); }}/>
            </div>
          </react_1.PopoverContent>
        </react_1.Popover>
        {__spreadArray([], params.entries(), true).length > 0 && (<react_1.Button variant="secondary" rightIcon={<lu_1.LuX />} onClick={function () {
                return setParams({
                    startDate: undefined,
                    endDate: undefined
                });
            }}>
            <macro_1.Trans>Reset</macro_1.Trans>
          </react_1.Button>)}
      </react_1.HStack>
      <react_1.HStack>
        {permissions.can("create", "accounting") && (<>
            <components_1.New label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Group"], ["Group"])))} to={"new-group?".concat(params.toString())}/>
            <components_1.New label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Account"], ["Account"])))} to={"new?".concat(params.toString())}/>
          </>)}
      </react_1.HStack>
    </div>);
};
exports.default = ChartOfAccountsTableFilters;
var templateObject_1, templateObject_2, templateObject_3;
