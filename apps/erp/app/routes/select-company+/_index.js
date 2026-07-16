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
exports.loader = loader;
exports.default = SelectCompany;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, employeeCompanies, _d, _e, redirectTo;
        var _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _j.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, (0, settings_1.getEmployeeCompanies)(client, userId)];
                case 2:
                    employeeCompanies = _j.sent();
                    if (!employeeCompanies.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(employeeCompanies.error, "Failed to get companies"))];
                case 3: throw _d.apply(void 0, _e.concat([_j.sent()]));
                case 4:
                    // Single-company (or none) users have nothing to pick — go straight in.
                    if (((_g = (_f = employeeCompanies.data) === null || _f === void 0 ? void 0 : _f.length) !== null && _g !== void 0 ? _g : 0) <= 1) {
                        throw (0, react_router_1.redirect)(path_1.path.to.authenticatedRoot);
                    }
                    redirectTo = new URL(request.url).searchParams.get("redirectTo");
                    return [2 /*return*/, { companies: (_h = employeeCompanies.data) !== null && _h !== void 0 ? _h : [], redirectTo: redirectTo }];
            }
        });
    });
}
function SelectCompany() {
    var t = (0, macro_1.useLingui)().t;
    var mode = (0, react_1.useMode)();
    var navigation = (0, react_router_1.useNavigation)();
    var _a = (0, react_router_1.useLoaderData)(), companies = _a.companies, redirectTo = _a.redirectTo;
    var isBusy = navigation.state !== "idle";
    var companiesLabel = t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Companies"], ["Companies"])));
    var groups = (0, react_2.useMemo)(function () {
        var _a;
        var _b;
        // Group by company group, then fold any single-company group into the
        // generic "Companies" bucket — mirrors the top-bar CompanySwitcher.
        var byGroup = new Map();
        for (var _i = 0, companies_1 = companies; _i < companies_1.length; _i++) {
            var c = companies_1[_i];
            var name_1 = (_b = c.companyGroupName) !== null && _b !== void 0 ? _b : companiesLabel;
            var existing = byGroup.get(name_1);
            if (existing)
                existing.companies.push(c);
            else
                byGroup.set(name_1, { name: name_1, companies: [c] });
        }
        var result = new Map();
        for (var _c = 0, byGroup_1 = byGroup; _c < byGroup_1.length; _c++) {
            var _d = byGroup_1[_c], name_2 = _d[0], group = _d[1];
            var target = group.companies.length === 1 && name_2 !== companiesLabel
                ? companiesLabel
                : name_2;
            var existing = result.get(target);
            if (existing)
                (_a = existing.companies).push.apply(_a, group.companies);
            else
                result.set(target, { name: target, companies: __spreadArray([], group.companies, true) });
        }
        return Array.from(result.values());
    }, [companies, companiesLabel]);
    return (<div className="w-full max-w-[26rem] overflow-hidden rounded-2xl bg-card text-card-foreground shadow-2xl ring-1 ring-black/5 antialiased dark:ring-white/10">
      <div className="flex flex-col items-center gap-4 px-8 pb-6 pt-9">
        <img src={auth_1.CONTROLLED_ENVIRONMENT ? "/flag.png" : "/carbon-mark-light.svg"} alt="Carbon Logo" className={(0, react_1.cn)("w-10 dark:hidden", auth_1.CONTROLLED_ENVIRONMENT && "grayscale")}/>
        <img src={auth_1.CONTROLLED_ENVIRONMENT ? "/flag.png" : "/carbon-mark-dark.svg"} alt="Carbon Logo" className={(0, react_1.cn)("hidden w-10 dark:block", auth_1.CONTROLLED_ENVIRONMENT && "grayscale")}/>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-lg font-semibold tracking-tight">
            <macro_1.Trans>Choose a company</macro_1.Trans>
          </h1>
          <p className="text-pretty text-sm text-muted-foreground">
            <macro_1.Trans>
              You belong to more than one company. Pick where to work.
            </macro_1.Trans>
          </p>
        </div>
      </div>

      <react_1.ScrollArea className="max-h-[24rem] px-3">
        <div className="flex flex-col gap-1 pb-2">
          {groups.map(function (group, index) {
            var showLabel = group.name !== companiesLabel && group.companies.length > 1;
            return (<div key={group.name} className={(0, react_1.cn)("flex flex-col", index > 0 && "pt-2")}>
                {showLabel && (<div className="px-3 pb-1 pt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {group.name}
                  </div>)}
                {group.companies.map(function (c) {
                    var _a;
                    var logo = mode === "dark" ? c.logoDarkIcon : c.logoLightIcon;
                    var switchAction = path_1.path.to.companySwitch(c.companyId);
                    var isSubmitting = isBusy && navigation.formAction === switchAction;
                    return (<react_router_1.Form key={c.companyId} method="post" action={switchAction}>
                      {redirectTo && (<input type="hidden" name="redirectTo" value={redirectTo}/>)}
                      <button type="submit" disabled={isBusy} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-accent focus-visible:bg-accent focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60">
                        <react_1.Avatar size="md" name={(_a = c.name) !== null && _a !== void 0 ? _a : undefined} src={logo !== null && logo !== void 0 ? logo : undefined} className="shrink-0 outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10"/>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="truncate text-sm font-medium">
                            {c.name}
                          </p>
                          {c.employeeType && (<p className="truncate text-xs text-muted-foreground">
                              {c.employeeType}
                            </p>)}
                        </div>
                        {isSubmitting ? (<lu_1.LuLoaderCircle className="size-4 shrink-0 animate-spin text-muted-foreground"/>) : (<lu_1.LuChevronRight className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5"/>)}
                      </button>
                    </react_router_1.Form>);
                })}
              </div>);
        })}
        </div>
      </react_1.ScrollArea>

      <div className="border-t border-black/5 px-8 py-4 dark:border-white/10">
        <react_router_1.Form method="post" action={path_1.path.to.logout}>
          <p className="text-center text-xs text-muted-foreground">
            <macro_1.Trans>Not you?</macro_1.Trans>{" "}
            <button type="submit" className="font-medium text-foreground hover:underline">
              <macro_1.Trans>Sign Out</macro_1.Trans>
            </button>
          </p>
        </react_router_1.Form>
      </div>
    </div>);
}
var templateObject_1;
