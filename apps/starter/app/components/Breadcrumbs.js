"use strict";
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
exports.BreadcrumbHandle = void 0;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var BreadcrumbsBase = (0, react_2.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, _b = _a.useReactRouter, useReactRouter = _b === void 0 ? true : _b, props = __rest(_a, ["className", "children", "useReactRouter"]);
    var validChildren = (0, react_1.getValidChildren)(children);
    var count = validChildren.length;
    var clones = validChildren.map(function (child, index) {
        return (0, react_2.cloneElement)(child, {
            isFirstChild: index === 0,
            isLastChild: index === count - 1
        });
    });
    return (<nav aria-label="Breadcrumb" ref={ref} className={(0, react_1.cn)("reset flex", className)} {...props}>
      <ol className="inline-flex items-center space-x-1">{clones}</ol>
    </nav>);
});
BreadcrumbsBase.displayName = "BreadcrumbsBase";
var BreadcrumbItem = (0, react_2.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, isFirstChild = _a.isFirstChild, isLastChild = _a.isLastChild, props = __rest(_a, ["className", "children", "isFirstChild", "isLastChild"]);
    return (<li ref={ref} className={(0, react_1.cn)("inline-flex items-center", className)} {...props}>
    {!isFirstChild && <span className="text-muted-foreground">/</span>}
    {children}
  </li>);
});
BreadcrumbItem.displayName = "BreadcrumbItem";
var breadcrumbLinkClassName = function (isCurrentPage, className) {
    return (0, react_1.cn)("inline-flex min-w-0 max-w-full truncate rounded-sm outline-none", "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", isCurrentPage
        ? "font-medium"
        : "text-muted-foreground hover:text-foreground hover:underline", className);
};
var BreadcrumbLink = (0, react_2.forwardRef)(function (_a, ref) {
    var className = _a.className, children = _a.children, isCurrentPage = _a.isCurrentPage, to = _a.to, props = __rest(_a, ["className", "children", "isCurrentPage", "to"]);
    if (isCurrentPage) {
        return (<span aria-current="page" ref={ref} className={breadcrumbLinkClassName(true, className)}>
        {children}
      </span>);
    }
    return (<react_router_1.Link ref={ref} to={to} prefetch="intent" className={breadcrumbLinkClassName(false, className)} {...props}>
      {children}
    </react_router_1.Link>);
});
BreadcrumbLink.displayName = "BreadcrumbLink";
exports.BreadcrumbHandle = zod_1.z.object({
    breadcrumb: zod_1.z.any(),
    to: zod_1.z.string().optional()
});
var BreadcrumbHandleMatch = zod_1.z.object({
    handle: exports.BreadcrumbHandle
});
var Breadcrumbs = function () {
    var matches = (0, react_router_1.useMatches)();
    var breadcrumbs = matches
        .map(function (m) {
        var _a, _b;
        var result = BreadcrumbHandleMatch.safeParse(m);
        if (!result.success || !result.data.handle.breadcrumb)
            return null;
        return {
            breadcrumb: result.data.handle.breadcrumb,
            to: (_b = (_a = result.data.handle) === null || _a === void 0 ? void 0 : _a.to) !== null && _b !== void 0 ? _b : m.pathname
        };
    })
        .filter(Boolean);
    var isMobile = (0, react_1.useIsMobile)();
    return (<react_1.HStack className="items-center h-full -ml-2" spacing={0}>
      <BreadcrumbsBase className="line-clamp-1">
        {!isMobile && <CompanyBreadcrumb />}
        {breadcrumbs.map(function (breadcrumb, i) {
            var _a;
            return (<BreadcrumbItem key={i}>
            <BreadcrumbLink isCurrentPage={!(breadcrumb === null || breadcrumb === void 0 ? void 0 : breadcrumb.to)} to={(_a = breadcrumb === null || breadcrumb === void 0 ? void 0 : breadcrumb.to) !== null && _a !== void 0 ? _a : ""}>
              {breadcrumb === null || breadcrumb === void 0 ? void 0 : breadcrumb.breadcrumb}
            </BreadcrumbLink>
          </BreadcrumbItem>);
        })}
      </BreadcrumbsBase>
    </react_1.HStack>);
};
function CompanyBreadcrumb() {
    var mode = (0, react_1.useMode)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var hasMultipleCompanies = Boolean((routeData === null || routeData === void 0 ? void 0 : routeData.companies) && (routeData === null || routeData === void 0 ? void 0 : routeData.companies.length) > 1);
    var hasCompanyMenu = hasMultipleCompanies;
    var companyGroups = (0, react_2.useMemo)(function () {
        var _a, _b;
        var _c;
        if (!(routeData === null || routeData === void 0 ? void 0 : routeData.companies))
            return [];
        var groups = new Map();
        for (var _i = 0, _d = routeData.companies; _i < _d.length; _i++) {
            var c = _d[_i];
            var groupName = (_c = c.companyGroupName) !== null && _c !== void 0 ? _c : "Companies";
            var existing = groups.get(groupName);
            if (existing) {
                existing.companies.push(c);
            }
            else {
                groups.set(groupName, { name: groupName, companies: [c] });
            }
        }
        // If a group has only one company, move it to "Companies"
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
    }, [routeData === null || routeData === void 0 ? void 0 : routeData.companies]);
    return (<>
      <BreadcrumbItem isFirstChild>
        <BreadcrumbLink to="/">Developers</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        {hasCompanyMenu ? (<>
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
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </>) : (<BreadcrumbLink to="/">{routeData === null || routeData === void 0 ? void 0 : routeData.company.name}</BreadcrumbLink>)}
      </BreadcrumbItem>
    </>);
}
exports.default = Breadcrumbs;
