"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var locale_1 = require("@carbon/locale");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var useTheme_1 = require("~/hooks/useTheme");
var dom_1 = require("~/utils/dom");
var path_1 = require("~/utils/path");
var AvatarMenu = function () {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var user = (0, hooks_1.useUser)();
    var formatPersonName = (0, hooks_1.useFormatPersonName)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var name = formatPersonName({
        firstName: user.firstName,
        lastName: user.lastName
    });
    var isOwner = (0, hooks_1.usePermissions)().isOwner;
    var edition = (0, react_1.useEdition)();
    var mode = (0, react_1.useMode)();
    var serverTheme = (0, useTheme_1.useTheme)();
    var nextMode = mode === "dark" ? "light" : "dark";
    var fetcher = (0, react_router_1.useFetcher)();
    var onModeToggle = function () {
        var formData = new FormData();
        formData.append("mode", nextMode);
        (0, dom_1.startModeTransition)(nextMode, function () {
            fetcher.submit(formData, { method: "post", action: path_1.path.to.root });
        });
    };
    var localeFetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var _c = (0, react_2.useState)(null), selectedTheme = _c[0], setSelectedTheme = _c[1];
    var locale = (0, i18n_1.useLocale)().locale;
    var resolvedLocale = (0, locale_1.resolveLanguage)(locale);
    var languageOptions = (0, react_2.useMemo)(function () { return (0, locale_1.getSortedLanguageSelectOptions)(locale); }, [locale]);
    var canSwitchCompany = Boolean((_a = routeData === null || routeData === void 0 ? void 0 : routeData.companies) === null || _a === void 0 ? void 0 : _a.length);
    var onThemeChange = function (t) {
        var newTheme = utils_1.themes.find(function (theme) { return theme.name === t; });
        if (!newTheme)
            return;
        var variables = mode === "dark" ? newTheme.cssVars.dark : newTheme.cssVars.light;
        setSelectedTheme(t);
        var formData = new FormData();
        formData.append("theme", t);
        fetcher.submit(formData, { method: "post", action: path_1.path.to.theme });
        Object.entries(variables).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            document.body.style.setProperty("--".concat(key), value);
        });
    };
    var optimisticTheme = selectedTheme !== null && selectedTheme !== void 0 ? selectedTheme : serverTheme;
    var itarDisclosure = (0, react_1.useDisclosure)();
    return (<>
      <react_1.DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <react_1.DropdownMenuTrigger className="outline-none focus-visible:outline-none">
          <components_1.Avatar path={user.avatarUrl} name={name}/>
        </react_1.DropdownMenuTrigger>
        <react_1.DropdownMenuContent align="end" className="w-64">
          <react_1.DropdownMenuLabel>{t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Signed in as ", ""], ["Signed in as ", ""])), name)}</react_1.DropdownMenuLabel>
          <react_1.DropdownMenuSeparator />
          <react_1.DropdownMenuItem asChild>
            <react_router_1.Link to={path_1.path.to.authenticatedRoot}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuHouse />}/>
              <macro_1.Trans>Dashboard</macro_1.Trans>
            </react_router_1.Link>
          </react_1.DropdownMenuItem>
          <react_1.DropdownMenuSeparator />

          <react_1.DropdownMenuItem asChild>
            <react_router_1.Link to={path_1.path.to.apiIntroduction}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuFileText />}/>
              <macro_1.Trans>API Documentation</macro_1.Trans>
            </react_router_1.Link>
          </react_1.DropdownMenuItem>
          <react_1.DropdownMenuSeparator />
          <react_1.DropdownMenuItem onSelect={function (e) { return e.preventDefault(); }}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-start">
                <react_1.DropdownMenuIcon icon={mode === "dark" ? <lu_1.LuMoon /> : <lu_1.LuSun />}/>
                <macro_1.Trans>Dark Mode</macro_1.Trans>
              </div>
              <div>
                <react_1.Switch checked={mode === "dark"} onCheckedChange={onModeToggle}/>
              </div>
            </div>
          </react_1.DropdownMenuItem>
          <react_1.DropdownMenuSub>
            <react_1.DropdownMenuSubTrigger>
              <react_1.DropdownMenuIcon icon={<lu_1.LuPalette />}/>
              <macro_1.Trans>Theme Color</macro_1.Trans>
            </react_1.DropdownMenuSubTrigger>
            <react_1.DropdownMenuSubContent>
              <react_1.DropdownMenuRadioGroup value={optimisticTheme} onValueChange={onThemeChange}>
                {utils_1.themes.map(function (t) { return (<react_1.DropdownMenuRadioItem key={t.name} value={t.name} onSelect={function (e) { return e.preventDefault(); }} style={{
                "--theme-primary": "hsl(".concat(t === null || t === void 0 ? void 0 : t.activeColor[mode === "dark" ? "dark" : "light"], ")")
            }}>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-2 bg-[var(--theme-primary)]"/>
                      {t.label}
                    </div>
                  </react_1.DropdownMenuRadioItem>); })}
              </react_1.DropdownMenuRadioGroup>
            </react_1.DropdownMenuSubContent>
          </react_1.DropdownMenuSub>
          <react_1.DropdownMenuSeparator />
          <react_1.DropdownMenuSub>
            <react_1.DropdownMenuSubTrigger disabled={localeFetcher.state !== "idle"}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuLanguages />}/>
              <macro_1.Trans>Language</macro_1.Trans>
            </react_1.DropdownMenuSubTrigger>
            <react_1.DropdownMenuSubContent>
              <localeFetcher.Form method="post" action="/api/locale">
                {languageOptions.map(function (opt) { return (<react_1.DropdownMenuItem key={opt.value} asChild>
                    <button type="submit" name="locale" value={opt.value} disabled={localeFetcher.state !== "idle" ||
                opt.value === resolvedLocale} className="flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none focus:bg-accent data-[highlighted]:bg-accent">
                      <span className={opt.value === resolvedLocale
                ? "font-medium"
                : undefined}>
                        {opt.label}
                      </span>
                      {opt.value === resolvedLocale ? (<lu_1.LuCheck className="ml-auto h-4 w-4 shrink-0"/>) : null}
                    </button>
                  </react_1.DropdownMenuItem>); })}
              </localeFetcher.Form>
            </react_1.DropdownMenuSubContent>
          </react_1.DropdownMenuSub>
          <react_1.DropdownMenuSeparator />
          <react_1.DropdownMenuItem asChild>
            <react_router_1.Link to={path_1.path.to.profile}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuUser />}/>
              <macro_1.Trans>Account Settings</macro_1.Trans>
            </react_router_1.Link>
          </react_1.DropdownMenuItem>
          {canSwitchCompany ? (<react_1.DropdownMenuSub>
              <react_1.DropdownMenuSubTrigger>
                <react_1.DropdownMenuIcon icon={<lu_1.LuBuilding2 />}/>
                <macro_1.Trans>Companies</macro_1.Trans>
              </react_1.DropdownMenuSubTrigger>
              <react_1.DropdownMenuSubContent>
                {routeData === null || routeData === void 0 ? void 0 : routeData.companies.map(function (company) {
                var _a;
                var logo = mode === "dark"
                    ? company.logoDarkIcon
                    : company.logoLightIcon;
                var isCurrent = company.companyId === user.company.id;
                return (<react_router_1.Form key={company.companyId} method="post" action={path_1.path.to.companySwitch(company.companyId)}>
                      <react_1.DropdownMenuItem asChild disabled={isCurrent}>
                        <button type="submit" className="flex w-full items-center justify-between">
                          <react_1.HStack>
                            <react_1.Avatar size="xs" name={(_a = company.name) !== null && _a !== void 0 ? _a : undefined} src={logo !== null && logo !== void 0 ? logo : undefined}/>
                            <span className={isCurrent ? "font-medium" : undefined}>
                              {company.name}
                            </span>
                          </react_1.HStack>
                          <react_1.HStack>
                            <react_1.Badge variant="secondary" className="ml-2">
                              {company.employeeType}
                            </react_1.Badge>
                            {isCurrent ? (<lu_1.LuCheck className="h-4 w-4 shrink-0"/>) : null}
                          </react_1.HStack>
                        </button>
                      </react_1.DropdownMenuItem>
                    </react_router_1.Form>);
            })}
              </react_1.DropdownMenuSubContent>
            </react_1.DropdownMenuSub>) : null}

          {edition === utils_1.Edition.Cloud && isOwner() && (<react_1.DropdownMenuItem asChild>
              <react_router_1.Link to={path_1.path.to.billing}>
                <react_1.DropdownMenuIcon icon={<lu_1.LuCreditCard />}/>
                <span>
                  <macro_1.Trans>Manage Subscription</macro_1.Trans>
                </span>
              </react_router_1.Link>
            </react_1.DropdownMenuItem>)}

          <react_1.DropdownMenuSub>
            <react_1.DropdownMenuSubTrigger>
              <react_1.DropdownMenuIcon icon={<lu_1.LuFileText />}/>
              <macro_1.Trans>Terms and Privacy</macro_1.Trans>
            </react_1.DropdownMenuSubTrigger>
            <react_1.DropdownMenuSubContent>
              <react_1.DropdownMenuItem asChild>
                <a href={path_1.path.to.legal.termsAndConditions}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuFileText />}/>
                  <macro_1.Trans>Terms of Service</macro_1.Trans>
                </a>
              </react_1.DropdownMenuItem>
              <react_1.DropdownMenuItem asChild>
                <a href={path_1.path.to.legal.privacyPolicy}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuShieldCheck />}/>
                  <macro_1.Trans>Privacy Policy</macro_1.Trans>
                </a>
              </react_1.DropdownMenuItem>
            </react_1.DropdownMenuSubContent>
          </react_1.DropdownMenuSub>

          <react_1.DropdownMenuSeparator />
          {auth_1.CONTROLLED_ENVIRONMENT && (<react_1.DropdownMenuItem onClick={itarDisclosure.onOpen}>
              <react_1.DropdownMenuIcon icon={<lu_1.LuShieldCheck />}/>
              <macro_1.Trans>About</macro_1.Trans>
            </react_1.DropdownMenuItem>)}
          <react_1.DropdownMenuItem asChild>
            <react_router_1.Form method="post" action={path_1.path.to.logout}>
              <button type="submit" className="w-full h-full flex items-center">
                <react_1.DropdownMenuIcon icon={<lu_1.LuLogOut />}/>
                <span>
                  <macro_1.Trans>Sign Out</macro_1.Trans>
                </span>
              </button>
            </react_router_1.Form>
          </react_1.DropdownMenuItem>
        </react_1.DropdownMenuContent>
      </react_1.DropdownMenu>
      {auth_1.CONTROLLED_ENVIRONMENT && <react_1.ItarDisclosure disclosure={itarDisclosure}/>}
    </>);
};
exports.default = AvatarMenu;
var templateObject_1;
