"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var rx_1 = require("react-icons/rx");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var ThemeForm = function (_a) {
    var _b, _c;
    var defaultValues = _a.theme;
    var mode = (0, react_1.useMode)();
    var fetcher = (0, react_router_1.useFetcher)();
    var onThemeChange = function (t) {
        var variables = mode === "dark" ? t.cssVars.dark : t.cssVars.light;
        Object.entries(variables).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            document.body.style.setProperty("--".concat(key), value);
        });
    };
    var optimisticTheme = (_c = (_b = fetcher === null || fetcher === void 0 ? void 0 : fetcher.formData) === null || _b === void 0 ? void 0 : _b.get("theme")) !== null && _c !== void 0 ? _c : defaultValues.theme;
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_1.Trans>Theme</macro_1.Trans>
        </react_1.CardTitle>
        <react_1.CardDescription>
          <macro_1.Trans>This updates the theme for all users of the application</macro_1.Trans>
        </react_1.CardDescription>
      </react_1.CardHeader>
      <react_1.CardContent>
        <react_1.VStack spacing={4} className="max-w-[520px]">
          <div className="grid grid-cols-3 gap-4">
            {utils_1.themes.map(function (t) {
            var isActive = optimisticTheme === t.name;
            return (<fetcher.Form key={t.name} action={path_1.path.to.theme} method="post" onSubmit={function () { return onThemeChange(t); }}>
                  <input type="hidden" name="theme" value={t.name}/>
                  <react_1.Button key={t.name} variant="secondary" type="submit" className={(0, react_1.cn)("justify-start w-full", isActive && "border-2 border-primary")} style={{
                    "--theme-primary": "hsl(".concat(t === null || t === void 0 ? void 0 : t.activeColor[mode === "dark" ? "dark" : "light"], ")")
                }}>
                    <span className={(0, react_1.cn)("mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[var(--theme-primary)]")}>
                      {isActive && <rx_1.RxCheck className="h-4 w-4 text-white"/>}
                    </span>
                    {t.label}
                  </react_1.Button>
                </fetcher.Form>);
        })}
          </div>
        </react_1.VStack>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = ThemeForm;
