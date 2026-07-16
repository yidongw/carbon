"use client";
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
exports.AppSidebar = AppSidebar;
exports.TeamSwitcher = TeamSwitcher;
exports.OperationsNav = OperationsNav;
exports.ToolsNav = ToolsNav;
exports.UserNav = UserNav;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var AdjustInventory_1 = require("./AdjustInventory");
var EndShift_1 = require("./EndShift");
var Suggestion_1 = require("./Suggestion");
var TimeCardButton_1 = require("./TimeCardButton");
function AppSidebar(_a) {
    var activeEvents = _a.activeEvents, activeMaintenanceCount = _a.activeMaintenanceCount, company = _a.company, companies = _a.companies, consoleEnabled = _a.consoleEnabled, consoleMode = _a.consoleMode, location = _a.location, locations = _a.locations, openClockEntry = _a.openClockEntry, pinnedInUser = _a.pinnedInUser, timeCardEnabled = _a.timeCardEnabled, props = __rest(_a, ["activeEvents", "activeMaintenanceCount", "company", "companies", "consoleEnabled", "consoleMode", "location", "locations", "openClockEntry", "pinnedInUser", "timeCardEnabled"]);
    // Match the ERP primary navigation: an icon rail that expands on hover and
    // collapses on leave — no persistent toggle to pin it open.
    var setOpen = (0, react_1.useSidebar)().setOpen;
    return (<react_1.Sidebar collapsible="icon" onMouseEnter={function () { return setOpen(true); }} onMouseLeave={function () { return setOpen(false); }} className="group-data-[state=expanded]:shadow-xl" {...props}>
      <react_1.SidebarHeader>
        <TeamSwitcher company={company}/>
      </react_1.SidebarHeader>
      <react_1.SidebarContent>
        <OperationsNav activeEvents={activeEvents} activeMaintenanceCount={activeMaintenanceCount}/>
        <ToolsNav />
      </react_1.SidebarContent>
      <react_1.SidebarFooter>
        {timeCardEnabled && (<react_1.SidebarMenu>
            <react_2.Suspense fallback={<TimeCardButton_1.TimeCardButton openClockEntry={null}/>}>
              <react_router_1.Await resolve={openClockEntry}>
                {function (resolved) { return (<TimeCardButton_1.TimeCardButton openClockEntry={(resolved === null || resolved === void 0 ? void 0 : resolved.data)
                    ? {
                        id: resolved.data.id,
                        clockIn: resolved.data.clockIn
                    }
                    : null}/>); }}
              </react_router_1.Await>
            </react_2.Suspense>
          </react_1.SidebarMenu>)}
        <UserNav company={company} companies={companies} consoleEnabled={consoleEnabled} consoleMode={consoleMode} location={location} locations={locations} pinnedInUser={pinnedInUser}/>
      </react_1.SidebarFooter>
    </react_1.Sidebar>);
}
function TeamSwitcher(_a) {
    var company = _a.company;
    var mode = (0, react_1.useMode)();
    var companyLogo = mode === "dark" ? company.logoDarkIcon : company.logoLightIcon;
    return (<react_1.SidebarMenu>
      <react_1.SidebarMenuItem>
        <react_1.SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground" asChild>
          <a href={path_1.ERP_URL}>
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-foreground">
              {companyLogo ? (<img src={companyLogo} alt={"".concat(company.name, " logo")} className="h-full w-full rounded object-contain"/>) : (<bs_1.BsFillHexagonFill className="size-6"/>)}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{company.name}</span>
            </div>
          </a>
        </react_1.SidebarMenuButton>
      </react_1.SidebarMenuItem>
    </react_1.SidebarMenu>);
}
function OperationsNav(_a) {
    var activeEvents = _a.activeEvents, activeMaintenanceCount = _a.activeMaintenanceCount;
    var t = (0, macro_1.useLingui)().t;
    var links = [
        {
            title: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Schedule"], ["Schedule"]))),
            icon: lu_1.LuCalendarDays,
            to: path_1.path.to.operations
        },
        {
            title: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Assigned"], ["Assigned"]))),
            icon: lu_1.LuClipboardList,
            to: path_1.path.to.assigned
        },
        {
            title: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Active"], ["Active"]))),
            icon: lu_1.LuActivity,
            label: (activeEvents !== null && activeEvents !== void 0 ? activeEvents : 0).toString(),
            to: path_1.path.to.active
        },
        {
            title: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Recent"], ["Recent"]))),
            icon: lu_1.LuHistory,
            to: path_1.path.to.recent
        },
        {
            title: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Jobs"], ["Jobs"]))),
            icon: lu_1.LuCirclePlay,
            to: path_1.path.to.jobs
        },
        {
            title: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["My Salary"], ["My Salary"]))),
            icon: lu_1.LuBanknote,
            to: path_1.path.to.salary
        },
        {
            title: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Maintenance"], ["Maintenance"]))),
            icon: lu_1.LuWrench,
            label: (activeMaintenanceCount !== null && activeMaintenanceCount !== void 0 ? activeMaintenanceCount : 0).toString(),
            to: path_1.path.to.maintenance
        },
        {
            title: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Picking"], ["Picking"]))),
            icon: lu_1.LuPackageCheck,
            to: path_1.path.to.picking
        }
    ];
    var location = (0, react_router_1.useLocation)();
    var pathname = location.pathname;
    var _b = (0, react_1.useSidebar)(), isMobile = _b.isMobile, setOpenMobile = _b.setOpenMobile;
    return (<react_1.SidebarGroup>
      <react_1.SidebarGroupLabel>
        <macro_1.Trans>Operations</macro_1.Trans>
      </react_1.SidebarGroupLabel>
      <react_1.SidebarMenu>
        {links.map(function (item) {
            var isActive = pathname.includes(item.to) ||
                (pathname.includes("operations") && item.title === "Schedule");
            return (<react_1.SidebarMenuItem key={item.title}>
              <react_1.SidebarMenuButton tooltip={item.title} className={(0, react_1.cn)(item.label &&
                    Number.isInteger(parseInt(item.label)) &&
                    parseInt(item.label) > 0 &&
                    "text-emerald-500")} isActive={isActive} asChild>
                <react_router_1.Link to={item.to} onClick={function () { return isMobile && setOpenMobile(false); }}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {item.label && (<span className="ml-auto text-muted-foreground text-sm">
                      {item.label}
                    </span>)}
                </react_router_1.Link>
              </react_1.SidebarMenuButton>
            </react_1.SidebarMenuItem>);
        })}
      </react_1.SidebarMenu>
    </react_1.SidebarGroup>);
}
function ToolsNav() {
    return (<>
      <react_1.SidebarGroup>
        <react_1.SidebarGroupLabel>
          <macro_1.Trans>Inventory Adjustments</macro_1.Trans>
        </react_1.SidebarGroupLabel>
        <react_1.SidebarMenu>
          <react_1.SidebarMenuItem>
            <AdjustInventory_1.AdjustInventory add={true}/>
          </react_1.SidebarMenuItem>
          <react_1.SidebarMenuItem>
            <AdjustInventory_1.AdjustInventory add={false}/>
          </react_1.SidebarMenuItem>
        </react_1.SidebarMenu>
      </react_1.SidebarGroup>
      <react_1.SidebarGroup>
        <react_1.SidebarGroupLabel>
          <macro_1.Trans>Tools</macro_1.Trans>
        </react_1.SidebarGroupLabel>
        <react_1.SidebarMenu>
          <react_1.SidebarMenuItem>
            <EndShift_1.EndShift />
          </react_1.SidebarMenuItem>

          <react_1.SidebarMenuItem>
            <Suggestion_1.default />
          </react_1.SidebarMenuItem>
        </react_1.SidebarMenu>
      </react_1.SidebarGroup>
    </>);
}
function UserNav(_a) {
    var _b, _c, _d;
    var company = _a.company, companies = _a.companies, consoleEnabled = _a.consoleEnabled, consoleMode = _a.consoleMode, location = _a.location, locations = _a.locations, pinnedInUser = _a.pinnedInUser;
    var t = (0, macro_1.useLingui)().t;
    var user = (0, hooks_1.useUser)();
    var formatPersonName = (0, hooks_1.useFormatPersonName)();
    var stationName = formatPersonName({
        firstName: user.firstName,
        lastName: user.lastName
    });
    var isMobile = (0, react_1.useSidebar)().isMobile;
    var mode = (0, react_1.useMode)();
    var modeSubmitRef = (0, react_2.useRef)(null);
    var consoleSubmitRef = (0, react_2.useRef)(null);
    var fetcher = (0, react_router_1.useFetcher)();
    var updateLocation = function (value) {
        var formData = new FormData();
        formData.append("location", value);
        fetcher.submit(formData, { method: "POST", action: path_1.path.to.location });
    };
    var optimisticLocation = (_c = (_b = fetcher.formData) === null || _b === void 0 ? void 0 : _b.get("location")) !== null && _c !== void 0 ? _c : location;
    var itarDisclosure = (0, react_1.useDisclosure)();
    // useUser().id returns the effective (operator) ID — read the original station user ID directly
    var routeData = (0, react_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var sessionUserId = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.user) === null || _d === void 0 ? void 0 : _d.id;
    var isOperatorPinnedIn = consoleMode &&
        pinnedInUser &&
        sessionUserId &&
        pinnedInUser.userId !== sessionUserId;
    var showingOperator = consoleMode && pinnedInUser;
    var displayName = showingOperator ? pinnedInUser.name : stationName;
    var displayAvatar = showingOperator
        ? pinnedInUser.avatarUrl
        : user.avatarUrl;
    var displaySubtext = showingOperator ? t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Console"], ["Console"]))) : user.email;
    return (<react_1.SidebarMenu>
      <react_1.SidebarMenuItem>
        <react_1.DropdownMenu>
          <react_1.DropdownMenuTrigger asChild>
            <react_1.SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <react_1.Avatar className="h-8 w-8 rounded-lg" src={displayAvatar !== null && displayAvatar !== void 0 ? displayAvatar : undefined} name={displayName}/>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{displayName}</span>
                <span className="truncate text-xs">{displaySubtext}</span>
              </div>
              <lu_1.LuChevronDown className="ml-auto size-4"/>
            </react_1.SidebarMenuButton>
          </react_1.DropdownMenuTrigger>
          <react_1.DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
            {/* Console mode with pinned-in operator: simplified menu */}
            {showingOperator ? (<>
                <react_1.DropdownMenuLabel>{pinnedInUser.name}</react_1.DropdownMenuLabel>
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuItem onSelect={function () {
                fetcher.submit(null, {
                    method: "POST",
                    action: path_1.path.to.consolePinOut
                });
            }}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuUsers />}/>
                  <macro_1.Trans>Switch Operator</macro_1.Trans>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  <macro_1.Trans>Station: {stationName}</macro_1.Trans>
                </react_1.DropdownMenuLabel>
              </>) : (<>
                <react_1.DropdownMenuLabel>
                  <macro_1.Trans>Signed in as {stationName}</macro_1.Trans>
                </react_1.DropdownMenuLabel>
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuItem asChild>
                  <react_router_1.Link to={path_1.path.to.accountSettings}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuUser />}/>
                    <macro_1.Trans>Account Settings</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.DropdownMenuItem>
                <react_1.DropdownMenuSeparator />

                <react_1.DropdownMenuSub>
                  <react_1.DropdownMenuSubTrigger>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuBuilding />}/>
                    <macro_1.Trans>Company</macro_1.Trans>
                  </react_1.DropdownMenuSubTrigger>
                  <react_1.DropdownMenuSubContent>
                    <react_1.DropdownMenuRadioGroup value={company.companyId}>
                      {companies.map(function (c) {
                var _a;
                var logo = mode === "dark" ? c.logoDarkIcon : c.logoLightIcon;
                return (<react_1.DropdownMenuRadioItem key={c.companyId} value={c.companyId} onSelect={function () {
                        var form = new FormData();
                        form.append("companyId", c.companyId);
                        fetcher.submit(form, {
                            method: "post",
                            action: path_1.path.to.switchCompany(c.companyId)
                        });
                    }}>
                            <react_1.HStack>
                              <react_1.Avatar size="xs" name={(_a = c.name) !== null && _a !== void 0 ? _a : undefined} src={logo !== null && logo !== void 0 ? logo : undefined}/>
                              <span>{c.name}</span>
                            </react_1.HStack>
                          </react_1.DropdownMenuRadioItem>);
            })}
                    </react_1.DropdownMenuRadioGroup>
                  </react_1.DropdownMenuSubContent>
                </react_1.DropdownMenuSub>
                <react_1.DropdownMenuSeparator />
                {locations.length > 1 ? (<>
                    <react_1.DropdownMenuSub>
                      <react_1.DropdownMenuSubTrigger>
                        <react_1.DropdownMenuIcon icon={<lu_1.LuMapPin />}/>
                        <macro_1.Trans>Location</macro_1.Trans>
                      </react_1.DropdownMenuSubTrigger>
                      <react_1.DropdownMenuSubContent>
                        <react_1.DropdownMenuRadioGroup value={optimisticLocation}>
                          {locations.map(function (loc) { return (<react_1.DropdownMenuRadioItem key={loc.id} value={loc.id} onSelect={function () {
                        updateLocation(loc.id);
                    }}>
                              {loc.name}
                            </react_1.DropdownMenuRadioItem>); })}
                        </react_1.DropdownMenuRadioGroup>
                      </react_1.DropdownMenuSubContent>
                    </react_1.DropdownMenuSub>
                    <react_1.DropdownMenuSeparator />
                  </>) : null}
              </>)}
            <react_1.DropdownMenuItem onSelect={function (e) { return e.preventDefault(); }}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center justify-start">
                  <react_1.DropdownMenuIcon icon={mode === "dark" ? <lu_1.LuMoon /> : <lu_1.LuSun />}/>
                  <macro_1.Trans>Dark Mode</macro_1.Trans>
                </div>
                <div>
                  <react_1.Switch checked={mode === "dark"} onCheckedChange={function () { var _a; return (_a = modeSubmitRef.current) === null || _a === void 0 ? void 0 : _a.click(); }}/>
                  <fetcher.Form action={path_1.path.to.root} method="post" onSubmit={function () {
            document.body.removeAttribute("style");
        }} className="sr-only">
                    <input type="hidden" name="mode" value={mode === "dark" ? "light" : "dark"}/>
                    <button ref={modeSubmitRef} className="sr-only" type="submit"/>
                  </fetcher.Form>
                </div>
              </div>
            </react_1.DropdownMenuItem>
            {!isOperatorPinnedIn && (<>
                {consoleEnabled && (<react_1.DropdownMenuItem onSelect={function (e) { return e.preventDefault(); }}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center justify-start">
                        <react_1.DropdownMenuIcon icon={<lu_1.LuMonitor />}/>
                        <macro_1.Trans>Console Mode</macro_1.Trans>
                      </div>
                      <div>
                        <react_1.Switch checked={consoleMode} onCheckedChange={function () { var _a; return (_a = consoleSubmitRef.current) === null || _a === void 0 ? void 0 : _a.click(); }}/>
                        <fetcher.Form action={path_1.path.to.consoleToggle} method="post" className="sr-only">
                          <input type="hidden" name="consoleMode" value={consoleMode ? "false" : "true"}/>
                          <button ref={consoleSubmitRef} className="sr-only" type="submit"/>
                        </fetcher.Form>
                      </div>
                    </div>
                  </react_1.DropdownMenuItem>)}
                <react_1.DropdownMenuSeparator />
                {auth_1.CONTROLLED_ENVIRONMENT && (<react_1.DropdownMenuItem onClick={itarDisclosure.onOpen}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuShieldCheck />}/>
                    <macro_1.Trans>About</macro_1.Trans>
                  </react_1.DropdownMenuItem>)}
                <react_1.DropdownMenuItem onSelect={function (e) { return e.preventDefault(); }}>
                  <react_router_1.Form method="post" action={path_1.path.to.logout}>
                    <button type="submit" className="w-full flex items-center">
                      <react_1.DropdownMenuIcon icon={<lu_1.LuLogOut />}/>
                      <span>
                        <macro_1.Trans>Sign Out</macro_1.Trans>
                      </span>
                    </button>
                  </react_router_1.Form>
                </react_1.DropdownMenuItem>
              </>)}
          </react_1.DropdownMenuContent>
        </react_1.DropdownMenu>
      </react_1.SidebarMenuItem>
      {auth_1.CONTROLLED_ENVIRONMENT && <react_1.ItarDisclosure disclosure={itarDisclosure}/>}
    </react_1.SidebarMenu>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
