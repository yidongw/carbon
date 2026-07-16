"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var CollapsibleSidebar_1 = require("./CollapsibleSidebar");
function routeIsActive(routeTo, pathname, search, exact) {
    var routePathname = routeTo.split("?")[0];
    if (exact)
        return pathname === routePathname;
    var matches = pathname === routePathname || pathname.startsWith("".concat(routePathname, "/"));
    return matches && !"".concat(pathname).concat(search).includes("view=");
}
var MobileGroupedNav = function (_a) {
    var groups = _a.groups, _b = _a.exactMatch, exactMatch = _b === void 0 ? false : _b;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var location = (0, hooks_1.useOptimisticLocation)();
    var directGroupNames = [t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Dashboard"], ["Dashboard"]))), t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Manage"], ["Manage"])))];
    return (<div className="w-full flex items-center gap-1 px-2 py-1.5 bg-card border-b border-border overflow-x-auto shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {groups.map(function (group) {
            if (directGroupNames.includes(group.name)) {
                return group.routes.map(function (route) {
                    var isActive = routeIsActive(route.to, location.pathname, location.search, exactMatch);
                    return (<react_1.Button key={route.name} asChild leftIcon={route.icon} variant={isActive ? "active" : "ghost"} size="sm" className="shrink-0">
                <react_router_1.Link to={route.to + (route.q ? "?q=".concat(route.q) : "")} prefetch="intent" replace>
                  {route.name}
                </react_router_1.Link>
              </react_1.Button>);
                });
            }
            if (group.routes.length === 1) {
                var route = group.routes[0];
                var isActive = routeIsActive(route.to, location.pathname, location.search, exactMatch);
                return (<react_1.Button key={route.name} asChild leftIcon={route.icon} variant={isActive ? "active" : "ghost"} size="sm" className="shrink-0">
              <react_router_1.Link to={route.to + (route.q ? "?q=".concat(route.q) : "")} prefetch="intent" replace>
                {route.name}
              </react_router_1.Link>
            </react_1.Button>);
            }
            var isGroupActive = group.routes.some(function (route) {
                return routeIsActive(route.to, location.pathname, location.search, exactMatch);
            });
            return (<react_1.DropdownMenu key={group.name}>
            <react_1.DropdownMenuTrigger className={(0, react_1.cn)((0, react_1.buttonVariants)({ variant: "ghost", size: "sm" }), "shrink-0 gap-1 hover:bg-transparent", isGroupActive
                    ? "font-semibold text-foreground border-b-2 border-foreground/70 rounded-b-none"
                    : "")}>
              {group.name}
              <lu_1.LuChevronDown className="h-3 w-3"/>
            </react_1.DropdownMenuTrigger>
            <react_1.DropdownMenuContent align="end">
              {group.routes.map(function (route) {
                    var isActive = routeIsActive(route.to, location.pathname, location.search, exactMatch);
                    return (<react_1.DropdownMenuItem key={route.name} onSelect={function () {
                            return navigate(route.to + (route.q ? "?q=".concat(route.q) : ""), {
                                replace: true
                            });
                        }} className={(0, react_1.cn)(isActive && "bg-active text-active-foreground")}>
                    {route.icon && <react_1.DropdownMenuIcon icon={route.icon}/>}
                    {route.name}
                  </react_1.DropdownMenuItem>);
                })}
            </react_1.DropdownMenuContent>
          </react_1.DropdownMenu>);
        })}
    </div>);
};
var GroupedContentSidebar = function (_a) {
    var groups = _a.groups, _b = _a.width, width = _b === void 0 ? 240 : _b, _c = _a.exactMatch, exactMatch = _c === void 0 ? false : _c;
    return (<>
      {/* Mobile: horizontal nav bar. md:hidden removes it from flow on desktop (no JS, no flash). */}
      <div className="md:hidden">
        <MobileGroupedNav groups={groups} exactMatch={exactMatch}/>
      </div>
      {/* Desktop: collapsible sidebar. display:contents makes CollapsibleSidebar a direct grid child. */}
      <div className="hidden md:contents">
        <GroupedContentSidebarDesktop groups={groups} width={width} exactMatch={exactMatch}/>
      </div>
    </>);
};
var GroupedContentSidebarDesktop = function (_a) {
    var groups = _a.groups, _b = _a.width, width = _b === void 0 ? 240 : _b, _c = _a.exactMatch, exactMatch = _c === void 0 ? false : _c;
    var t = (0, macro_1.useLingui)().t;
    var location = (0, hooks_1.useOptimisticLocation)();
    var submit = (0, react_router_1.useSubmit)();
    var _d = (0, react_2.useState)(function () {
        return groups.reduce(function (acc, group) {
            group.routes.forEach(function (route) {
                var _a;
                if ((_a = route.views) === null || _a === void 0 ? void 0 : _a.length) {
                    acc[route.name] = true;
                }
            });
            return acc;
        }, {});
    }), expandedViews = _d[0], setExpandedViews = _d[1];
    var _e = (0, react_2.useState)(null), selectedView = _e[0], setSelectedView = _e[1];
    var toggleViews = function (routeName) {
        setExpandedViews(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[routeName] = !prev[routeName], _a)));
        });
    };
    return (<CollapsibleSidebar_1.CollapsibleSidebar width={width}>
      <div className="overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent h-full w-full pb-8">
        <react_1.VStack>
          {groups.map(function (group) { return (<react_1.VStack key={group.name} className="border-b border-border p-2 pb-4 space-y-0.5">
              <h4 className="text-xxs text-foreground/70 uppercase font-light tracking-wide pl-4 py-1">
                {group.name}
              </h4>
              {group.routes.map(function (route) {
                var _a;
                var isActive = routeIsActive(route.to, location.pathname, location.search, exactMatch);
                var hasViews = route.views && route.views.length > 0;
                var isExpanded = expandedViews[route.name];
                if (hasViews && !(route.name in expandedViews)) {
                    setExpandedViews(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), (_a = {}, _a[route.name] = true, _a)));
                    });
                }
                return (<div className="w-full flex flex-col" key={route.name}>
                    <div className="flex items-center gap-x-0.5 relative">
                      <react_1.Button asChild leftIcon={route.icon} variant={isActive ? "active" : "ghost"} className={(0, react_1.cn)("justify-start flex-grow truncate", isActive
                        ? "shadow-none dark:shadow-button-base"
                        : "hover:bg-active hover:text-active-foreground hover:scale-100 focus-visible:scale-100")}>
                        <react_router_1.Link to={route.to + (route.q ? "?q=".concat(route.q) : "")} prefetch="intent">
                          {route.name}
                        </react_router_1.Link>
                      </react_1.Button>
                      {hasViews && (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle views"], ["Toggle views"])))} icon={isExpanded ? <lu_1.LuChevronDown /> : <lu_1.LuChevronRight />} variant="ghost" size="sm" onClick={function () { return toggleViews(route.name); }} className="absolute right-1 flex-shrink-0 text-foreground/70 hover:text-foreground"/>)}
                    </div>
                    {hasViews && isExpanded && (<ViewsReorderGroup views={(_a = route.views) !== null && _a !== void 0 ? _a : []} location={location} onReorder={function (updates) {
                            var formData = new FormData();
                            formData.append("updates", JSON.stringify(updates));
                            submit(formData, {
                                action: path_1.path.to.saveViewOrder,
                                method: "post",
                                navigate: false
                            });
                        }} onDelete={function (view) { return setSelectedView(view); }}/>)}
                  </div>);
            })}
            </react_1.VStack>); })}
        </react_1.VStack>
      </div>
      {selectedView && (<Modals_1.ConfirmDelete isOpen={!!selectedView} action={path_1.path.to.deleteSavedView(selectedView.id)} name={selectedView.name} text={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Are you sure you want to delete the view \"", "\"?"], ["Are you sure you want to delete the view \"", "\"?"])), selectedView.name)} onCancel={function () { return setSelectedView(null); }} onSubmit={function () {
                setSelectedView(null);
            }}/>)}
    </CollapsibleSidebar_1.CollapsibleSidebar>);
};
var ViewsReorderGroup = function (_a) {
    var views = _a.views, location = _a.location, onReorder = _a.onReorder, onDelete = _a.onDelete;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(function () {
        if (views && views[Symbol.iterator]) {
            return __spreadArray([], views, true).sort(function (a, b) { return a.sortOrder - b.sortOrder; });
        }
        return [];
    }), sortedViews = _b[0], setSortedViews = _b[1];
    var viewNames = views
        .map(function (view) { return view.name; })
        .sort()
        .join(",");
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        setSortedViews(__spreadArray([], views, true).sort(function (a, b) { return a.sortOrder - b.sortOrder; }));
    }, [views.length, viewNames]);
    var debouncedOnReorder = (0, react_1.useDebounce)(onReorder, 500, true);
    return (<framer_motion_1.Reorder.Group axis="y" values={sortedViews} onReorder={function (newOrder) {
            var updates = newOrder.map(function (view, index) { return (__assign(__assign({}, view), { sortOrder: index })); });
            setSortedViews(updates);
            debouncedOnReorder(updates);
        }} className="flex flex-col gap-y-0.5 my-0.5">
      {sortedViews.map(function (view) {
            var isViewActive = "".concat(location.pathname).concat(location.search).includes("view=".concat(view.id));
            return (<framer_motion_1.Reorder.Item key={view.to} value={view} className="w-full">
            <div className="group/view flex items-center relative">
              <react_1.Button asChild variant={isViewActive ? "active" : "ghost"} className={(0, react_1.cn)("justify-start text-sm pl-7 pr-7 truncate flex-grow !shadow-none", isViewActive
                    ? "shadow-none border-active-foreground/30 dark:border-none dark:shadow-button-base"
                    : "hover:bg-active hover:text-active-foreground")}>
                <react_router_1.Link to={view.to} prefetch="intent">
                  {view.name}
                </react_router_1.Link>
              </react_1.Button>
              <react_1.IconButton aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Drag handle"], ["Drag handle"])))} icon={<lu_1.LuGripVertical />} variant="ghost" size="sm" className="flex-shrink-0 opacity-0 group-hover/view:opacity-100 absolute left-1"/>
              <react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.IconButton aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Options"], ["Options"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost" size="sm" className="absolute right-1 flex-shrink-0 opacity-0 group-hover/view:opacity-100 data-[state=open]:opacity-100 text-foreground/70 hover:text-foreground"/>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent>
                  <react_1.DropdownMenuItem destructive onSelect={function () { return onDelete(view); }}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                    <macro_1.Trans>Delete View</macro_1.Trans>
                  </react_1.DropdownMenuItem>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>
            </div>
          </framer_motion_1.Reorder.Item>);
        })}
    </framer_motion_1.Reorder.Group>);
};
exports.default = GroupedContentSidebar;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
