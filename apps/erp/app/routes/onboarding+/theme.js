"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
exports.loader = loader;
exports.action = action;
exports.default = OnboardingTheme;
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var bi_1 = require("react-icons/bi");
var rx_1 = require("react-icons/rx");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var settings_1 = require("~/modules/settings");
var theme_server_1 = require("~/services/theme.server");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Theme"], ["Theme"]))),
    to: path_1.path.to.theme
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var theme;
        var request = _b.request;
        return __generator(this, function (_c) {
            theme = (0, theme_server_1.getTheme)(request);
            return [2 /*return*/, {
                    theme: theme !== null && theme !== void 0 ? theme : "zinc"
                }];
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var formData, validation, _c, next, theme;
        var request = _b.request;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, request.formData()];
                case 1:
                    formData = _d.sent();
                    return [4 /*yield*/, (0, form_1.validator)(settings_1.themeValidator).validate(formData)];
                case 2:
                    validation = _d.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _c = validation.data, next = _c.next, theme = _c.theme;
                    if (!next)
                        throw new Error("Fatal: next is required");
                    throw (0, react_router_1.redirect)(next, {
                        headers: { "Set-Cookie": (0, theme_server_1.setTheme)(theme) }
                    });
            }
        });
    });
}
function OnboardingTheme() {
    var initialTheme = (0, react_router_1.useLoaderData)().theme;
    var mode = (0, react_1.useMode)();
    var modeFetcher = (0, react_router_1.useFetcher)();
    var _a = (0, react_2.useState)(initialTheme), theme = _a[0], setTheme = _a[1];
    var onThemeChange = function (t) {
        setTheme(t.name);
        var variables = mode === "dark" ? t.cssVars.dark : t.cssVars.light;
        Object.entries(variables).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            document.body.style.setProperty("--".concat(key), value);
        });
        window.dispatchEvent(new CustomEvent("onboarding-theme-change", { detail: t.name }));
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var t = utils_1.themes.find(function (t) { return t.name === theme; });
        if (t) {
            onThemeChange(t);
        }
    }, [mode]);
    var _b = (0, hooks_1.useOnboarding)(), next = _b.next, previous = _b.previous;
    var submit = (0, react_router_1.useSubmit)();
    var onSubmit = function () {
        var formData = new FormData();
        formData.append("theme", theme);
        formData.append("next", next);
        submit(formData, {
            method: "post"
        });
    };
    var transition = (0, react_router_1.useNavigation)();
    var nextRef = (0, react_2.useRef)(null);
    (0, react_1.useKeyboardShortcuts)({
        Enter: function () {
            var _a;
            (_a = nextRef.current) === null || _a === void 0 ? void 0 : _a.click();
        }
    });
    return (<react_1.Card className="max-w-lg">
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_2.Trans>Choose your style</macro_2.Trans>
        </react_1.CardTitle>
        <react_1.CardDescription>
          <macro_2.Trans>
            You can change the UI style any time through the theme setting
          </macro_2.Trans>
        </react_1.CardDescription>
      </react_1.CardHeader>
      <react_1.CardContent>
        <react_1.VStack spacing={4}>
          <react_1.HStack className="w-full justify-between">
            <modeFetcher.Form action={path_1.path.to.root} method="post" onSubmit={function () {
            document.body.removeAttribute("style");
        }} className="w-full">
              <input type="hidden" name="mode" value="light"/>
              <react_1.Button variant="secondary" type="submit" leftIcon={<bi_1.BiSun />} className={(0, react_1.cn)("w-full", mode == "light" && "border-2 border-primary")}>
                <macro_2.Trans>Light</macro_2.Trans>
              </react_1.Button>
            </modeFetcher.Form>
            <modeFetcher.Form action={path_1.path.to.root} method="post" onSubmit={function () {
            document.body.removeAttribute("style");
        }} className="w-full">
              <input type="hidden" name="mode" value="dark"/>
              <react_1.Button variant="secondary" leftIcon={<bi_1.BiMoon />} type="submit" className={(0, react_1.cn)("w-full", mode == "dark" && "border-2 border-primary")}>
                <macro_2.Trans>Dark</macro_2.Trans>
              </react_1.Button>
            </modeFetcher.Form>
          </react_1.HStack>
          <div className="w-full grid grid-cols-3 gap-4">
            {utils_1.themes.map(function (t) {
            var isActive = theme === t.name;
            return (<react_1.Button key={t.name} variant="secondary" onClick={function () { return onThemeChange(t); }} className={(0, react_1.cn)("justify-start", isActive && "border-2 border-primary")} style={{
                    "--theme-primary": "hsl(".concat(t === null || t === void 0 ? void 0 : t.activeColor[mode === "dark" ? "dark" : "light"], ")"),
                    borderColor: "hsl(".concat(t === null || t === void 0 ? void 0 : t.activeColor[mode === "dark" ? "dark" : "light"], ")")
                }}>
                  <span className={(0, react_1.cn)("mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full bg-[var(--theme-primary)]")}>
                    {isActive && <rx_1.RxCheck className="h-4 w-4 text-white"/>}
                  </span>
                  {t.label}
                </react_1.Button>);
        })}
          </div>
        </react_1.VStack>
      </react_1.CardContent>
      <react_1.CardFooter>
        <react_1.HStack>
          {previous && (<react_1.Button variant="solid" isDisabled={!previous} size="md" asChild tabIndex={-1}>
              <react_router_1.Link to={previous} prefetch="intent">
                <macro_2.Trans>Previous</macro_2.Trans>
              </react_router_1.Link>
            </react_1.Button>)}

          <react_1.Button isLoading={transition.state !== "idle"} isDisabled={transition.state !== "idle"} ref={nextRef} onClick={onSubmit}>
            <macro_2.Trans>Next</macro_2.Trans>
          </react_1.Button>
        </react_1.HStack>
      </react_1.CardFooter>
    </react_1.Card>);
}
var templateObject_1;
