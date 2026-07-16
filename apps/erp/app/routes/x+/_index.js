"use strict";
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
exports.default = AppIndexRoute;
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Greeting_1 = require("~/components/Greeting");
var hooks_1 = require("~/hooks");
function AppIndexRoute() {
    var modules = (0, hooks_1.useModules)();
    var settingsModule = (0, hooks_1.useSettingsModule)();
    var allModules = (0, react_2.useMemo)(function () { return (settingsModule ? __spreadArray(__spreadArray([], modules, true), [settingsModule], false) : modules); }, [modules, settingsModule]);
    var locale = (0, i18n_1.useLocale)().locale;
    var date = new Date();
    var formatter = (0, react_2.useMemo)(function () {
        return new Intl.DateTimeFormat(locale, {
            dateStyle: "full",
            timeZone: (0, date_1.getLocalTimeZone)()
        });
    }, [locale]);
    return (<div className="p-8 w-full h-full bg-muted">
      <Greeting_1.Greeting size="h3"/>
      <Subheading>{formatter.format(date)}</Subheading>
      <Hr />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-6 mb-8">
        {allModules.map(function (module) { return (<ModuleCard key={module.key} module={module}/>); })}
      </div>
    </div>);
}
var Hr = function () { return (<hr className="h-px my-8 bg-black/10 border-0 dark:bg-white/10"/>); };
var Subheading = function (_a) {
    var children = _a.children, className = _a.className;
    return (<p className={(0, react_1.cn)("text-muted-foreground text-base font-light", className)}>
    {children}
  </p>);
};
var ModuleCard = function (_a) {
    var module = _a.module;
    return (<react_router_1.Link to={module.to} prefetch="intent" className="flex flex-row gap-4 items-center px-6 py-4 shadow-button-base bg-gradient-to-bl from-card from-50% to-background rounded-lg group ring-2 ring-transparent hover:ring-white/10 cursor-pointer hover:scale-105 transition-all duration-300">
    <div className="p-3 rounded-lg border shrink-0">
      <module.icon className="text-2xl"/>
    </div>
    <span className="text-sm border border-border rounded-full py-1 px-4 group-hover:bg-accent font-medium tracking-tight">
      {module.name}
    </span>
  </react_router_1.Link>);
};
