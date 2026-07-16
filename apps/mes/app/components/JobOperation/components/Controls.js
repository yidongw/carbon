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
exports.Controls = Controls;
exports.Times = Times;
exports.ButtonWithTooltip = ButtonWithTooltip;
exports.IconButtonWithTooltip = IconButtonWithTooltip;
exports.WorkTypeToggle = WorkTypeToggle;
exports.StartStopButton = StartStopButton;
exports.PauseButton = PauseButton;
exports.PlayButton = PlayButton;
exports.FloatingActionMenu = FloatingActionMenu;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var framer_motion_1 = require("framer-motion");
var react_2 = require("react");
var fa6_1 = require("react-icons/fa6");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var models_1 = require("~/services/models");
var path_1 = require("~/utils/path");
function Controls(_a) {
    var children = _a.children, className = _a.className;
    return (<div className={(0, react_1.cn)("flex flex-col relative z-[40] md:absolute p-2 md:top-[calc(var(--header-height)*2-2px)] md:right-0 w-full md:w-[var(--controls-width)] md:min-h-[180px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:border-l border-y md:rounded-bl-lg", className)}>
      {children}
    </div>);
}
function Times(_a) {
    var children = _a.children, className = _a.className;
    return (<react_1.TooltipProvider>
      <div className={(0, react_1.cn)("flex flex-col md:absolute p-2 bottom-2 md:left-1/2 md:transform md:-translate-x-1/2 w-full md:w-[calc(100%-2rem)] z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b md:border md:rounded-lg", className)}>
        {children}
      </div>
    </react_1.TooltipProvider>);
}
function ButtonWithTooltip(_a) {
    var tooltip = _a.tooltip, children = _a.children, props = __rest(_a, ["tooltip", "children"]);
    return (<react_1.Tooltip>
      <react_1.TooltipTrigger>
        <button {...props}>{children}</button>
      </react_1.TooltipTrigger>
      <react_1.TooltipContent side="top">{tooltip}</react_1.TooltipContent>
    </react_1.Tooltip>);
}
function IconButtonWithTooltip(_a) {
    var icon = _a.icon, tooltip = _a.tooltip, disabled = _a.disabled, variant = _a.variant, props = __rest(_a, ["icon", "tooltip", "disabled", "variant"]);
    return (<ButtonWithTooltip {...props} tooltip={tooltip} disabled={disabled} className={(0, react_1.cn)("size-16 text-xl md:text-lg md:size-[8dvh] flex flex-row items-center gap-2 justify-center bg-accent rounded-full shadow-lg hover:cursor-pointer hover:shadow-xl hover:accent hover:scale-105 transition-all disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-30 text-accent-foreground group-hover:text-accent-foreground/80", variant === "success" &&
            "bg-emerald-500 !text-white hover:bg-emerald-600 hover:text-white", variant === "destructive" &&
            "bg-red-500 !text-white hover:bg-red-600 hover:text-white")}>
      {icon}
    </ButtonWithTooltip>);
}
function WorkTypeToggle(_a) {
    var active = _a.active, operation = _a.operation, value = _a.value, onChange = _a.onChange, className = _a.className;
    var t = (0, macro_1.useLingui)().t;
    var count = (0, react_2.useMemo)(function () {
        var count = 0;
        if (operation.setupDuration > 0) {
            count++;
        }
        if (operation.laborDuration > 0) {
            count++;
        }
        if (operation.machineDuration > 0) {
            count++;
        }
        return count;
    }, [
        operation.laborDuration,
        operation.machineDuration,
        operation.setupDuration
    ]);
    return (<react_1.ToggleGroup value={value} type="single" onValueChange={onChange} disabled={!!value && count <= 1} className={(0, react_1.cn)("grid w-full", count <= 1 && "grid-cols-1", count === 2 && "grid-cols-2 py-2", count === 3 && "grid-cols-3 py-2", className)}>
      {operation.setupDuration > 0 && (<react_1.ToggleGroupItem className="flex flex-col items-center relative justify-center text-center h-14 w-full" value="Setup" size="lg" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Toggle setup"], ["Toggle setup"])))}>
          <lu_1.LuTimer className="size-6 pt-1"/>
          <span className="text-xxs">
            <macro_1.Trans>Setup</macro_1.Trans>
          </span>
          {active.setup && (<span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full"/>)}
        </react_1.ToggleGroupItem>)}
      {operation.laborDuration > 0 && (<react_1.ToggleGroupItem className="flex flex-col items-center relative justify-center text-center h-14 w-full" value="Labor" size="lg" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Toggle labor"], ["Toggle labor"])))}>
          <lu_1.LuHardHat className="size-6 pt-1"/>
          <span className="text-xxs">
            <macro_1.Trans>Labor</macro_1.Trans>
          </span>
          {active.labor && (<span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full"/>)}
        </react_1.ToggleGroupItem>)}
      {operation.machineDuration > 0 && (<react_1.ToggleGroupItem className="flex flex-col items-center relative justify-center text-center h-14 w-full" value="Machine" size="lg" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Toggle machine"], ["Toggle machine"])))}>
          <lu_1.LuHammer className="size-6 pt-1"/>
          <span className="text-xxs">
            <macro_1.Trans>Machine</macro_1.Trans>
          </span>
          {active.machine && (<span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full"/>)}
        </react_1.ToggleGroupItem>)}
    </react_1.ToggleGroup>);
}
var startStopFormId = "start-stop-form";
function StartStopButton(_a) {
    var _b, _c;
    var className = _a.className, job = _a.job, operation = _a.operation, eventType = _a.eventType, setupProductionEvent = _a.setupProductionEvent, laborProductionEvent = _a.laborProductionEvent, machineProductionEvent = _a.machineProductionEvent, isTrackedActivity = _a.isTrackedActivity, trackedEntityId = _a.trackedEntityId, props = __rest(_a, ["className", "job", "operation", "eventType", "setupProductionEvent", "laborProductionEvent", "machineProductionEvent", "isTrackedActivity", "trackedEntityId"]);
    var fetcher = (0, react_router_1.useFetcher)();
    var isActive = (0, react_2.useMemo)(function () {
        var _a, _b, _c, _d;
        if (((_a = fetcher.formData) === null || _a === void 0 ? void 0 : _a.get("action")) === "End") {
            return false;
        }
        if (eventType === "Setup") {
            return ((((_b = fetcher.formData) === null || _b === void 0 ? void 0 : _b.get("action")) === "Start" &&
                fetcher.formData.get("type") === "Setup") ||
                !!setupProductionEvent);
        }
        if (eventType === "Labor") {
            return ((((_c = fetcher.formData) === null || _c === void 0 ? void 0 : _c.get("action")) === "Start" &&
                fetcher.formData.get("type") === "Labor") ||
                !!laborProductionEvent);
        }
        return ((((_d = fetcher.formData) === null || _d === void 0 ? void 0 : _d.get("action")) === "Start" &&
            fetcher.formData.get("type") === "Machine") ||
            !!machineProductionEvent);
    }, [
        eventType,
        setupProductionEvent,
        laborProductionEvent,
        machineProductionEvent,
        fetcher.formData
    ]);
    var id = (0, react_2.useMemo)(function () {
        if (eventType === "Setup") {
            return setupProductionEvent === null || setupProductionEvent === void 0 ? void 0 : setupProductionEvent.id;
        }
        if (eventType === "Labor") {
            return laborProductionEvent === null || laborProductionEvent === void 0 ? void 0 : laborProductionEvent.id;
        }
        return machineProductionEvent === null || machineProductionEvent === void 0 ? void 0 : machineProductionEvent.id;
    }, [
        eventType,
        setupProductionEvent,
        laborProductionEvent,
        machineProductionEvent
    ]);
    return (<form_1.ValidatedForm id={startStopFormId} action={path_1.path.to.productionEvent} method="post" validator={models_1.productionEventValidator} defaultValues={{
            id: id,
            jobOperationId: operation.id,
            timezone: (0, date_1.getLocalTimeZone)(),
            action: isActive ? "End" : "Start",
            type: eventType,
            workCenterId: (_b = operation.workCenterId) !== null && _b !== void 0 ? _b : undefined
        }} fetcher={fetcher}>
      <form_1.Hidden name="id" value={id}/>
      {isTrackedActivity && (<form_1.Hidden name="trackedEntityId" value={trackedEntityId}/>)}
      <form_1.Hidden name="jobOperationId" value={operation.id}/>
      <form_1.Hidden name="timezone"/>

      <form_1.Hidden name="action" value={isActive ? "End" : "Start"}/>
      <form_1.Hidden name="type" value={eventType}/>
      <form_1.Hidden name="workCenterId" value={(_c = operation.workCenterId) !== null && _c !== void 0 ? _c : undefined}/>
      {isActive ? (<PauseButton disabled={fetcher.state !== "idle"} type="submit"/>) : (<PlayButton disabled={fetcher.state !== "idle"} type="submit"/>)}
    </form_1.ValidatedForm>);
}
function PauseButton(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var t = (0, macro_1.useLingui)().t;
    return (<ButtonWithTooltip {...props} tooltip={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Pause"], ["Pause"])))} className="group size-24 tall:size-32 flex flex-row items-center gap-2 justify-center bg-red-500 rounded-full shadow-lg hover:cursor-pointer hover:drop-shadow-xl hover:bg-red-600 hover:scale-105 transition-all text-accent disabled:bg-muted disabled:text-muted-foreground/80 text-4xl border-b-4 border-red-700 active:border-b-0 active:translate-y-1 disabled:bg-gray-500 disabled:hover:bg-gray-600 disabled:border-gray-700 disabled:text-white">
      <fa6_1.FaPause className="group-hover:scale-110"/>
    </ButtonWithTooltip>);
}
function PlayButton(_a) {
    var className = _a.className, props = __rest(_a, ["className"]);
    var t = (0, macro_1.useLingui)().t;
    return (<ButtonWithTooltip {...props} tooltip={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Start"], ["Start"])))} className="group size-24 tall:size-32 flex flex-row items-center gap-2 justify-center bg-emerald-500 rounded-full shadow-lg hover:cursor-pointer hover:drop-shadow-xl hover:bg-emerald-600 hover:scale-105 transition-all text-accent disabled:bg-muted disabled:text-muted-foreground/80 text-4xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 disabled:bg-gray-500 disabled:hover:bg-gray-600 disabled:border-gray-700 disabled:text-white">
      <fa6_1.FaPlay className="group-hover:scale-110"/>
    </ButtonWithTooltip>);
}
function FloatingActionMenu(_a) {
    var items = _a.items;
    var _b = (0, react_2.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var toggle = (0, react_2.useCallback)(function () { return setIsOpen(function (prev) { return !prev; }); }, []);
    return (<div className="relative flex flex-col items-center">
      <framer_motion_1.AnimatePresence initial={false}>
        {isOpen && (<framer_motion_1.motion.div className="flex flex-row md:flex-col items-center gap-2 mb-2" initial="closed" animate="open" exit="closed" variants={{
                open: { transition: { staggerChildren: 0.06 } },
                closed: {
                    transition: { staggerChildren: 0.03, staggerDirection: -1 }
                }
            }}>
            {items.map(function (item) { return (<framer_motion_1.motion.div key={item.label} variants={{
                    open: { opacity: 1, scale: 1, filter: "blur(0px)" },
                    closed: { opacity: 0, scale: 0.25, filter: "blur(4px)" }
                }} transition={{ type: "spring", duration: 0.3, bounce: 0 }}>
                <IconButtonWithTooltip icon={item.icon} tooltip={item.label} disabled={item.disabled} variant={item.variant} onClick={function () {
                    item.onClick();
                    setIsOpen(false);
                }}/>
              </framer_motion_1.motion.div>); })}
          </framer_motion_1.motion.div>)}
      </framer_motion_1.AnimatePresence>
      <button type="button" onClick={toggle} className={(0, react_1.cn)("size-16 text-xl md:text-lg md:size-[8dvh] flex items-center justify-center rounded-full shadow-lg transition-[transform,background-color] duration-200 active:scale-[0.96]", isOpen
            ? "bg-muted-foreground text-background"
            : "bg-accent text-accent-foreground hover:bg-accent/80")}>
        <framer_motion_1.AnimatePresence mode="wait" initial={false}>
          {isOpen ? (<framer_motion_1.motion.span key="close" initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }} transition={{ type: "spring", duration: 0.3, bounce: 0 }} className="flex items-center justify-center">
              <lu_1.LuX className="size-5"/>
            </framer_motion_1.motion.span>) : (<framer_motion_1.motion.span key="menu" initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }} transition={{ type: "spring", duration: 0.3, bounce: 0 }} className="flex items-center justify-center">
              <lu_1.LuEllipsisVertical className="size-5"/>
            </framer_motion_1.motion.span>)}
        </framer_motion_1.AnimatePresence>
      </button>
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
