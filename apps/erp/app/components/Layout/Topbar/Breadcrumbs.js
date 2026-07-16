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
exports.BreadcrumbHandle = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var bs_1 = require("react-icons/bs");
var io_1 = require("react-icons/io");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var settings_models_1 = require("~/modules/settings/settings.models");
var path_1 = require("~/utils/path");
exports.BreadcrumbHandle = zod_1.z.object({
    breadcrumb: zod_1.z.any(),
    to: zod_1.z.string().optional()
});
var BreadcrumbHandleMatch = zod_1.z.object({
    handle: exports.BreadcrumbHandle
});
var Breadcrumbs = function () {
    var i18n = (0, macro_1.useLingui)().i18n;
    var matches = (0, react_router_1.useMatches)();
    var translateBreadcrumb = function (value) {
        if (typeof value === "object" && value !== null && "id" in value) {
            return i18n._(value);
        }
        if (typeof value === "string")
            return i18n._(value);
        return value;
    };
    var breadcrumbs = matches
        .map(function (m) {
        var _a, _b;
        var result = BreadcrumbHandleMatch.safeParse(m);
        if (!result.success || !result.data.handle.breadcrumb)
            return null;
        return {
            breadcrumb: translateBreadcrumb(typeof result.data.handle.breadcrumb === "function"
                ? result.data.handle.breadcrumb(m.params)
                : result.data.handle.breadcrumb),
            to: (_b = (_a = result.data.handle) === null || _a === void 0 ? void 0 : _a.to) !== null && _b !== void 0 ? _b : m.pathname
        };
    })
        .filter(Boolean);
    var isMobile = (0, react_1.useIsMobile)();
    var displayedBreadcrumbs = isMobile ? breadcrumbs.slice(0, 1) : breadcrumbs;
    var company = (0, hooks_1.useUser)().company;
    var mode = (0, react_1.useMode)();
    var logo = mode === "dark" ? company === null || company === void 0 ? void 0 : company.logoDarkIcon : company === null || company === void 0 ? void 0 : company.logoLightIcon;
    return (<react_1.HStack className="items-center h-full flex -ml-2" spacing={0}>
      <react_1.Button isIcon asChild variant="ghost" size="lg">
        <react_router_1.Link to="/">
          {logo ? (<img src={logo} alt={"".concat(company.name, " logo")} className="w-full h-auto rounded"/>) : (<bs_1.BsFillHexagonFill />)}
        </react_router_1.Link>
      </react_1.Button>

      <components_1.Breadcrumbs className="line-clamp-1">
        {displayedBreadcrumbs.map(function (breadcrumb, i) {
            var _a;
            return (<components_1.BreadcrumbItem key={i}>
            <components_1.BreadcrumbLink isCurrentPage={isMobile || !(breadcrumb === null || breadcrumb === void 0 ? void 0 : breadcrumb.to)} to={isMobile ? "" : ((_a = breadcrumb === null || breadcrumb === void 0 ? void 0 : breadcrumb.to) !== null && _a !== void 0 ? _a : "")}>
              {breadcrumb === null || breadcrumb === void 0 ? void 0 : breadcrumb.breadcrumb}
            </components_1.BreadcrumbLink>
          </components_1.BreadcrumbItem>);
        })}
      </components_1.Breadcrumbs>
    </react_1.HStack>);
};
// biome-ignore lint/correctness/noUnusedVariables: retained from upstream #58 for company switcher
function CompanyBreadcrumb() {
    var t = (0, macro_1.useLingui)().t;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var user = (0, hooks_1.useUser)();
    var hasMultipleCompanies = Boolean((routeData === null || routeData === void 0 ? void 0 : routeData.companies) && (routeData === null || routeData === void 0 ? void 0 : routeData.companies.length) > 1);
    var canCreateCompany = user.admin === true;
    var hasCompanyMenu = canCreateCompany || hasMultipleCompanies;
    var companyForm = (0, react_1.useDisclosure)();
    var mode = (0, react_1.useMode)();
    var companyGroups = (0, react_2.useMemo)(function () {
        var _a, _b;
        var _c;
        if (!(routeData === null || routeData === void 0 ? void 0 : routeData.companies))
            return [];
        var groups = new Map();
        for (var _i = 0, _d = routeData.companies; _i < _d.length; _i++) {
            var c = _d[_i];
            var groupName = (_c = c.companyGroupName) !== null && _c !== void 0 ? _c : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Companies"], ["Companies"])));
            var existing = groups.get(groupName);
            if (existing) {
                existing.companies.push(c);
            }
            else {
                groups.set(groupName, { name: groupName, companies: [c] });
            }
        }
        var result = new Map();
        for (var _e = 0, groups_1 = groups; _e < groups_1.length; _e++) {
            var _f = groups_1[_e], key = _f[0], group = _f[1];
            if (group.companies.length === 1 && key !== "Companies") {
                var existing = result.get("Companies");
                if (existing) {
                    (_a = existing.companies).push.apply(_a, group.companies);
                }
                else {
                    result.set("Companies", {
                        name: "Companies",
                        companies: __spreadArray([], group.companies, true)
                    });
                }
            }
            else {
                var existing = result.get(key);
                if (existing) {
                    (_b = existing.companies).push.apply(_b, group.companies);
                }
                else {
                    result.set(key, group);
                }
            }
        }
        return Array.from(result.values());
    }, [routeData === null || routeData === void 0 ? void 0 : routeData.companies, t]);
    return hasCompanyMenu ? (<>
      <react_1.DropdownMenu>
        <react_1.DropdownMenuTrigger asChild>
          <react_1.Button aria-current="page" variant="ghost" className="px-2 focus-visible:ring-transparent" rightIcon={<lu_1.LuChevronsUpDown />}>
            {routeData === null || routeData === void 0 ? void 0 : routeData.company.name}
          </react_1.Button>
        </react_1.DropdownMenuTrigger>
        <react_1.DropdownMenuContent align="start" className="min-w-[240px]">
          <react_1.ScrollArea className="max-h-[300px]">
            {companyGroups.map(function (group, index) { return (<react_1.DropdownMenuGroup key={group.name}>
                {index > 0 && <react_1.DropdownMenuSeparator />}
                <react_1.DropdownMenuLabel>{group.name}</react_1.DropdownMenuLabel>
                <react_1.DropdownMenuSeparator />
                {group.companies.map(function (c) {
                var _a;
                var logo = mode === "dark" ? c.logoDarkIcon : c.logoLightIcon;
                return (<react_router_1.Form key={c.companyId} method="post" action={path_1.path.to.companySwitch(c.companyId)}>
                      <react_1.DropdownMenuItem className="flex items-center justify-between w-full" asChild>
                        <button type="submit">
                          <react_1.HStack>
                            <react_1.Avatar size="xs" name={(_a = c.name) !== null && _a !== void 0 ? _a : undefined} src={logo !== null && logo !== void 0 ? logo : undefined}/>
                            <span>{c.name}</span>
                          </react_1.HStack>
                          <react_1.Badge variant="secondary" className="ml-2">
                            {c.employeeType}
                          </react_1.Badge>
                        </button>
                      </react_1.DropdownMenuItem>
                    </react_router_1.Form>);
            })}
              </react_1.DropdownMenuGroup>); })}
          </react_1.ScrollArea>

          {canCreateCompany && (<>
              <react_1.DropdownMenuSeparator />
              <react_1.DropdownMenuGroup>
                <react_1.DropdownMenuItem onClick={companyForm.onOpen}>
                  <react_1.DropdownMenuIcon icon={<io_1.IoMdAdd />}/>
                  {t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Add Company"], ["Add Company"])))}
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuGroup>
            </>)}
        </react_1.DropdownMenuContent>
      </react_1.DropdownMenu>
      <react_1.Modal open={companyForm.isOpen} onOpenChange={function (open) {
            if (!open)
                companyForm.onClose();
        }}>
        <react_1.ModalContent>
          <form_1.ValidatedForm action={path_1.path.to.newCompany} validator={settings_models_1.companyValidator} method="post" onSuccess={companyForm.onClose} defaultValues={{
            countryCode: "US",
            baseCurrencyCode: "USD"
        }}>
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                <macro_1.Trans>Let's set up your new company</macro_1.Trans>
              </react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody>
              <react_1.VStack spacing={4}>
                <Form_1.Input autoFocus name="name" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Company Name"], ["Company Name"])))}/>
                <Form_1.AddressAutocomplete variant="grid"/>
                <Form_1.Currency name="baseCurrencyCode" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Base Currency"], ["Base Currency"])))}/>
              </react_1.VStack>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.HStack>
                <Form_1.Submit>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
              </react_1.HStack>
            </react_1.ModalFooter>
          </form_1.ValidatedForm>
        </react_1.ModalContent>
      </react_1.Modal>
    </>) : (<react_1.Button className="pointer-events-none px-2" variant="ghost" aria-current="page">
      {routeData === null || routeData === void 0 ? void 0 : routeData.company.name}
    </react_1.Button>);
}
exports.default = Breadcrumbs;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
