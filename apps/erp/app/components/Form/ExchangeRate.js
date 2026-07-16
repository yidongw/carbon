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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var Form_1 = require("~/components/Form");
var ExchangeRate = function (_a) {
    var onRefresh = _a.onRefresh, _b = _a.inline, inline = _b === void 0 ? false : _b, exchangeRateUpdatedAt = _a.exchangeRateUpdatedAt, value = _a.value, props = __rest(_a, ["onRefresh", "inline", "exchangeRateUpdatedAt", "value"]);
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var formatter = (0, react_2.useMemo)(function () {
        return new Intl.DateTimeFormat(locale, {
            dateStyle: "medium",
            timeStyle: "short"
        });
    }, [locale]);
    var formattedDate = exchangeRateUpdatedAt
        ? formatter.format(new Date(exchangeRateUpdatedAt))
        : "";
    return (<div className="relative">
      <react_1.HStack spacing={0} className="items-end">
        {inline ? (<react_1.VStack spacing={2}>
            <react_1.HStack className="w-full justify-between">
              <span className="text-xs text-muted-foreground">
                <macro_1.Trans>Exchange Rate</macro_1.Trans>
              </span>
              {exchangeRateUpdatedAt && (<react_1.Tooltip>
                  <react_1.TooltipTrigger tabIndex={-1}>
                    <lu_1.LuInfo className="w-4 h-4"/>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent>
                    <macro_1.Trans>Last updated: {formattedDate}</macro_1.Trans>
                  </react_1.TooltipContent>
                </react_1.Tooltip>)}
            </react_1.HStack>
            <react_1.HStack className="w-full justify-between">
              <span>{value}</span>
            </react_1.HStack>
          </react_1.VStack>) : (<Form_1.NumberControlled label={<react_1.HStack spacing={1}>
                <span>
                  <macro_1.Trans>Exchange Rate</macro_1.Trans>
                </span>
                {exchangeRateUpdatedAt && (<react_1.Tooltip>
                    <react_1.TooltipTrigger tabIndex={-1}>
                      <lu_1.LuInfo className="w-4 h-4"/>
                    </react_1.TooltipTrigger>
                    <react_1.TooltipContent>
                      <macro_1.Trans>Last updated: {formattedDate}</macro_1.Trans>
                    </react_1.TooltipContent>
                  </react_1.Tooltip>)}
              </react_1.HStack>} {...props} value={value} isReadOnly className={(0, react_1.cn)("z-10", onRefresh ? "rounded-r-none" : "")}/>)}

        {onRefresh && (<react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Refresh exchange rate"], ["Refresh exchange rate"])))} className="flex-shrink-0 h-10 w-10 px-3 rounded-l-none border-l-0 shadow-sm" icon={<lu_1.LuLoaderCircle />} variant="secondary" size="md" onClick={onRefresh}/>)}
      </react_1.HStack>
    </div>);
};
exports.default = ExchangeRate;
var templateObject_1;
