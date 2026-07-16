"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.useOptimisticAssignment = useOptimisticAssignment;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var rx_1 = require("react-icons/rx");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var EmployeeAvatar_1 = require("./EmployeeAvatar");
var Assign = (0, react_2.forwardRef)(function (_a, ref) {
    var id = _a.id, table = _a.table, value = _a.value, _b = _a.size, size = _b === void 0 ? "md" : _b, isReadOnly = _a.isReadOnly, placeholder = _a.placeholder, _c = _a.variant, variant = _c === void 0 ? "button" : _c, _d = _a.iconOnly, iconOnly = _d === void 0 ? false : _d, onChange = _a.onChange, className = _a.className, props = __rest(_a, ["id", "table", "value", "size", "isReadOnly", "placeholder", "variant", "iconOnly", "onChange", "className"]);
    var t = (0, macro_1.useLingui)().t;
    var _e = (0, react_2.useState)(false), open = _e[0], setOpen = _e[1];
    var people = (0, stores_1.usePeople)()[0];
    var fetcher = (0, react_router_1.useFetcher)();
    var user = (0, hooks_1.useUser)();
    var formatPersonName = (0, hooks_1.useFormatPersonName)();
    var permissions = (0, hooks_1.usePermissions)();
    var handleChange = function (value) {
        var formData = new FormData();
        formData.append("id", id);
        formData.append("assignee", value);
        formData.append("table", table);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.api.assign
        });
    };
    var options = (0, react_2.useMemo)(function () {
        var _a;
        var base = (_a = people
            .filter(function (person) { return person.id !== user.id; })
            .map(function (person) { return ({
            value: person.id,
            label: formatPersonName({
                firstName: person.firstName,
                lastName: person.lastName,
                fullName: person.name
            })
        }); })) !== null && _a !== void 0 ? _a : [];
        return __spreadArray([
            { value: "", label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Unassigned"], ["Unassigned"]))) },
            {
                value: user.id,
                label: formatPersonName({
                    firstName: user.firstName,
                    lastName: user.lastName
                })
            }
        ], base, true);
    }, [formatPersonName, people, user, t]);
    var assigneeLabel = (0, react_2.useMemo)(function () {
        var _a, _b;
        if (!value)
            return t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Unassigned"], ["Unassigned"])));
        return ((_b = (_a = options.find(function (option) { return option.value === value; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Unassigned"], ["Unassigned"]))));
    }, [options, t, value]);
    return (<react_1.VStack spacing={2}>
        {variant === "inline" && (<span className="text-xs text-muted-foreground">
            <macro_1.Trans>Assignee</macro_1.Trans>
          </span>)}
        <react_1.HStack className="w-full justify-between">
          {variant === "inline" &&
            (value ? (<EmployeeAvatar_1.default size={size === "sm" ? "xxs" : "xs"} employeeId={value !== null && value !== void 0 ? value : null}/>) : (<span className="text-sm">
                <macro_1.Trans>Unassigned</macro_1.Trans>
              </span>))}

          <react_1.Popover open={open} onOpenChange={setOpen}>
            {variant === "button" ? (iconOnly ? (<react_1.Tooltip>
                  <react_1.TooltipTrigger asChild>
                    <react_1.PopoverTrigger asChild>
                      <react_1.IconButton aria-label={"".concat(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Toggle Assignee"], ["Toggle Assignee"]))), ": ").concat(assigneeLabel)} icon={value ? (<EmployeeAvatar_1.default size={size === "sm" ? "xxs" : "xs"} employeeId={value !== null && value !== void 0 ? value : null} withName={false}/>) : (<lu_1.LuUser />)} size={size} variant="secondary" isDisabled={isReadOnly || !permissions.is("employee")} isLoading={fetcher.state !== "idle"}/>
                    </react_1.PopoverTrigger>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent>
                    <span>{assigneeLabel}</span>
                  </react_1.TooltipContent>
                </react_1.Tooltip>) : (<react_1.PopoverTrigger asChild>
                  <button className={(0, react_1.cn)((0, react_1.buttonVariants)({
                variant: "secondary",
                size: size,
                isDisabled: isReadOnly || !permissions.is("employee"),
                isLoading: fetcher.state !== "idle",
                isIcon: false,
                className: className
            }))} role="combobox" aria-expanded={open} aria-controls="assignee-options" ref={ref} onClick={function () { return setOpen(true); }} disabled={isReadOnly} {...props}>
                    {value ? (<EmployeeAvatar_1.default size={size === "sm" ? "xxs" : "xs"} employeeId={value !== null && value !== void 0 ? value : null}/>) : (<div className="flex items-center justify-start gap-2">
                        <lu_1.LuUser className={size === "sm" ? "w-3 h-3" : "w-4 h-4"}/>
                        <span>
                          <macro_1.Trans>Unassigned</macro_1.Trans>
                        </span>
                      </div>)}
                  </button>
                </react_1.PopoverTrigger>)) : (<react_1.PopoverTrigger asChild>
                <react_1.IconButton aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Toggle Assignee"], ["Toggle Assignee"])))} icon={<lu_1.LuSettings2 />} size="sm" variant="secondary" isDisabled={isReadOnly || !permissions.is("employee")}/>
              </react_1.PopoverTrigger>)}
            <react_1.PopoverContent align="start" className="min-w-[var(--radix-popover-trigger-width)] p-0">
              <react_1.Command id="assignee-options">
                <react_1.CommandInput placeholder={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Search..."], ["Search..."])))} className="h-9"/>
                <react_1.CommandEmpty>
                  <macro_1.Trans>No option found.</macro_1.Trans>
                </react_1.CommandEmpty>
                <react_1.CommandGroup>
                  {options.map(function (option) { return (<react_1.CommandItem value={typeof option.label === "string"
                ? option.label
                : undefined} key={option.value} onSelect={function () {
                handleChange(option.value);
                onChange === null || onChange === void 0 ? void 0 : onChange(option.value);
                setOpen(false);
            }}>
                      {option.label}

                      <rx_1.RxCheck className={(0, react_1.cn)("ml-auto h-4 w-4", option.value === value ? "opacity-100" : "opacity-0")}/>
                    </react_1.CommandItem>); })}
                </react_1.CommandGroup>
              </react_1.Command>
            </react_1.PopoverContent>
          </react_1.Popover>
        </react_1.HStack>
      </react_1.VStack>);
});
Assign.displayName = "Assign";
exports.default = Assign;
function useOptimisticAssignment(_a) {
    var id = _a.id, table = _a.table;
    var fetchers = (0, react_router_1.useFetchers)();
    var assignFetcher = fetchers.find(function (f) { return f.formAction === path_1.path.to.api.assign; });
    if (assignFetcher && assignFetcher.formData) {
        if (assignFetcher.formData.get("id") === id &&
            assignFetcher.formData.get("table") === table) {
            return assignFetcher.formData.get("assignee");
        }
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
