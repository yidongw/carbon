"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppIndexRoute;
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var hooks_1 = require("~/hooks");
function AppIndexRoute() {
    var user = (0, hooks_1.useUser)();
    var locale = (0, i18n_1.useLocale)().locale;
    var date = new Date();
    var formatter = (0, react_2.useMemo)(function () {
        return new Intl.DateTimeFormat(locale, {
            dateStyle: "full",
            timeZone: (0, date_1.getLocalTimeZone)()
        });
    }, [locale]);
    return (<div className="p-8 w-full h-full bg-muted">
      <react_1.Heading size="h3">Hello, {user.firstName}</react_1.Heading>
      <Subheading>{formatter.format(date)}</Subheading>
      <Hr />
    </div>);
}
var Hr = function () { return (<hr className="h-px my-8 bg-black/10 border-0 dark:bg-white/10"/>); };
var Subheading = function (_a) {
    var children = _a.children, className = _a.className;
    return (<p className={(0, react_1.cn)("text-muted-foreground text-base font-light", className)}>
    {children}
  </p>);
};
