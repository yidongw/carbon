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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModule = getModule;
var react_1 = require("@carbon/react");
var core_1 = require("@dnd-kit/core");
var sortable_1 = require("@dnd-kit/sortable");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var HiddenModulesPopover_1 = require("./HiddenModulesPopover");
var NavigationEditBar_1 = require("./NavigationEditBar");
var SortableNavItem_1 = require("./SortableNavItem");
var useNavigationEditMode_1 = require("./useNavigationEditMode");
var PrimaryNavigation = function () {
    var navigationPanel = (0, react_1.useDisclosure)();
    var location = (0, hooks_1.useOptimisticLocation)();
    var currentModule = getModule(location.pathname);
    var links = (0, hooks_1.useModules)();
    var settingsModule = (0, hooks_1.useSettingsModule)();
    var matchedModules = (0, react_router_1.useMatches)().reduce(function (acc, match) {
        var handle = match.handle;
        if (handle && typeof handle.module === "string") {
            acc.add(handle.module);
        }
        return acc;
    }, new Set());
    var editMode = (0, useNavigationEditMode_1.useNavigationEditMode)();
    var sensors = (0, core_1.useSensors)((0, core_1.useSensor)(core_1.PointerSensor, { activationConstraint: { distance: 8 } }), (0, core_1.useSensor)(core_1.KeyboardSensor));
    (0, react_2.useEffect)(function () {
        if (!editMode.isEditing)
            return;
        var onKeyDown = function (e) {
            if (e.key === "Escape")
                editMode.cancelEditMode();
        };
        document.addEventListener("keydown", onKeyDown);
        return function () { return document.removeEventListener("keydown", onKeyDown); };
    }, [editMode.isEditing, editMode.cancelEditMode]);
    var isOpen = navigationPanel.isOpen || editMode.isEditing;
    return (<div className="w-14 h-full flex-col z-50 hidden md:flex">
      <nav data-state={isOpen ? "expanded" : "collapsed"} className={(0, react_1.cn)("bg-background py-2 group z-10 h-full w-14 data-[state=expanded]:w-[13rem]", "flex flex-col justify-between data-[state=expanded]:shadow-xl data-[state=expanded]:border-r data-[state=expanded]:border-border", "transition-width duration-200", "hide-scrollbar overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent")} onMouseEnter={editMode.isEditing ? undefined : navigationPanel.onOpen} onMouseLeave={editMode.isEditing ? undefined : navigationPanel.onClose}>
        <react_1.VStack spacing={1} className="flex flex-col justify-between h-full px-2">
          <react_1.VStack spacing={1}>
            {editMode.isEditing ? (<core_1.DndContext sensors={sensors} collisionDetection={core_1.closestCenter} onDragEnd={editMode.handleDragEnd}>
                <sortable_1.SortableContext items={editMode.visibleDraft.map(function (m) { return m.key; })} strategy={sortable_1.verticalListSortingStrategy}>
                  {editMode.visibleDraft.map(function (module) { return (<SortableNavItem_1.SortableNavItem key={module.key} module={module} isOpen={isOpen} onToggleHidden={editMode.toggleHidden}/>); })}
                </sortable_1.SortableContext>
              </core_1.DndContext>) : (links.map(function (link) {
            var m = getModule(link.to);
            var moduleMatches = matchedModules.has(m);
            var isActive = currentModule === m || moduleMatches;
            return (<NavigationIconLink key={link.name} link={link} isActive={isActive} isOpen={isOpen} onClick={navigationPanel.onClose}/>);
        }))}

            {editMode.isEditing && (<HiddenModulesPopover_1.HiddenModulesPopover hiddenModules={editMode.hiddenDraft} onToggleHidden={editMode.toggleHidden}/>)}
          </react_1.VStack>

          <react_1.VStack spacing={1}>
            {settingsModule &&
            !editMode.isEditing &&
            (function () {
                var m = getModule(settingsModule.to);
                var moduleMatches = matchedModules.has(m);
                var isActive = currentModule === m || moduleMatches;
                return (<NavigationIconLink link={settingsModule} isActive={isActive} isOpen={isOpen} onClick={navigationPanel.onClose}/>);
            })()}

            {editMode.isEditing ? (<NavigationEditBar_1.NavigationEditBar isSaving={editMode.isSaving} isDirty={editMode.isDirty} onSave={editMode.save} onCancel={editMode.cancelEditMode}/>) : (<button type="button" onClick={editMode.enterEditMode} className={(0, react_1.cn)("relative", "h-10 w-10 group-data-[state=expanded]:w-full", "flex items-center rounded-md", "group-data-[state=collapsed]:justify-center", "group-data-[state=expanded]:-space-x-2", "font-medium shrink-0 inline-flex select-none", "text-muted-foreground", "hover:bg-accent hover:text-accent-foreground", "transition-[background-color,color,width] duration-100 ease-out", "focus:!outline-none focus:!ring-0 active:!outline-none active:!ring-0", "after:pointer-events-none after:absolute after:-inset-[3px] after:rounded-lg after:border after:border-blue-500 after:opacity-0 after:ring-2 after:ring-blue-500/20 after:transition-opacity focus-visible:after:opacity-100 active:after:opacity-0", "group/item")}>
                <lu_1.LuSettings2 className="absolute left-3 top-3 flex items-center justify-center"/>
                <span className={(0, react_1.cn)("min-w-[128px] text-sm text-left", "absolute left-7 group-data-[state=expanded]:left-12", "opacity-0 group-data-[state=expanded]:opacity-100")}>
                  Customize
                </span>
              </button>)}
          </react_1.VStack>
        </react_1.VStack>
      </nav>
    </div>);
};
var NavigationIconLink = (0, react_2.forwardRef)(function (_a, ref) {
    var link = _a.link, _b = _a.isActive, isActive = _b === void 0 ? false : _b, _c = _a.isOpen, isOpen = _c === void 0 ? false : _c, onClick = _a.onClick, props = __rest(_a, ["link", "isActive", "isOpen", "onClick"]);
    var iconClasses = [
        "absolute left-3 top-3 flex items-center items-center justify-center"
    ];
    var classes = [
        "relative",
        "h-10 w-10 group-data-[state=expanded]:w-full",
        "flex items-center rounded-md",
        "group-data-[state=collapsed]:justify-center",
        "group-data-[state=expanded]:-space-x-2",
        "font-medium shrink-0 inline-flex items-center justify-center select-none",
        "disabled:opacity-50",
        "transition-[background-color,color,width] duration-100 ease-out",
        "focus:!outline-none focus:!ring-0 active:!outline-none active:!ring-0",
        "after:pointer-events-none after:absolute after:-inset-[3px] after:rounded-lg after:border after:border-blue-500 after:opacity-0 after:ring-2 after:ring-blue-500/20 after:transition-opacity focus-visible:after:opacity-100 active:after:opacity-0",
        !isActive && "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-active text-active-foreground dark:shadow-button-base",
        "group/item"
    ];
    return (<react_router_1.Link role="button" aria-current={isActive} ref={ref} to={link.to} {...props} onClick={onClick} className={(0, react_1.cn)(classes, props.className)} prefetch="intent">
      <link.icon className={react_1.cn.apply(void 0, iconClasses)}/>

      <span aria-hidden={isOpen || undefined} className={(0, react_1.cn)("min-w-[128px] text-sm", "absolute left-7 group-data-[state=expanded]:left-12", "opacity-0 group-data-[state=expanded]:opacity-100")}>
        {link.name}
      </span>
    </react_router_1.Link>);
});
NavigationIconLink.displayName = "NavigationIconLink";
exports.default = (0, react_2.memo)(PrimaryNavigation);
function getModule(link) {
    var _a;
    return (_a = link.split("/")) === null || _a === void 0 ? void 0 : _a[2];
}
