"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var resources_models_1 = require("../../resources.models");
var MaintenanceOeeImpact_1 = require("./MaintenanceOeeImpact");
var MaintenancePriority_1 = require("./MaintenancePriority");
var MaintenanceSeverity_1 = require("./MaintenanceSeverity");
var MaintenanceSource_1 = require("./MaintenanceSource");
var MaintenanceStatus_1 = require("./MaintenanceStatus");
var MaintenanceDispatchProperties = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21;
    var t = (0, macro_1.useLingui)().t;
    var dispatchId = (0, react_router_1.useParams)().dispatchId;
    if (!dispatchId)
        throw new Error("dispatchId not found");
    var permissions = (0, hooks_1.usePermissions)();
    var eventModal = (0, react_1.useDisclosure)();
    var _22 = (0, react_2.useState)(null), selectedEvent = _22[0], setSelectedEvent = _22[1];
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.maintenanceDispatch(dispatchId));
    var optimisticAssignment = (0, components_1.useOptimisticAssignment)({
        id: dispatchId,
        table: "maintenanceDispatch"
    });
    var assignee = optimisticAssignment !== undefined
        ? optimisticAssignment
        : ((_c = (_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _a === void 0 ? void 0 : _a.assignee) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : null);
    var fetcher = (0, react_router_1.useFetcher)();
    var eventFetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error.message);
        }
    }, [fetcher.data]);
    (0, react_2.useEffect)(function () {
        var _a;
        if (eventFetcher.state === "idle" &&
            eventFetcher.data &&
            !eventFetcher.data.error) {
            eventModal.onClose();
            setSelectedEvent(null);
        }
        if ((_a = eventFetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(eventFetcher.data.error.message);
        }
    }, [eventFetcher.state, eventFetcher.data, eventModal]);
    var onUpdate = (0, react_2.useCallback)(function (field, value) {
        var _a;
        var formData = new FormData();
        formData.append("ids", dispatchId);
        formData.append("field", field);
        formData.append("value", (_a = value === null || value === void 0 ? void 0 : value.toString()) !== null && _a !== void 0 ? _a : "");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.maintenanceDispatchUpdate
        });
    }, [dispatchId, fetcher]);
    var isLocked = (0, resources_models_1.isMaintenanceDispatchLocked)((_d = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _d === void 0 ? void 0 : _d.status);
    var _23 = (0, react_2.useState)((_f = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _e === void 0 ? void 0 : _e.oeeImpact) !== null && _f !== void 0 ? _f : "No Impact"), currentOeeImpact = _23[0], setCurrentOeeImpact = _23[1];
    var showFailureModes = currentOeeImpact === "Down" || currentOeeImpact === "Impact";
    return (<react_1.VStack spacing={4} className="w-full min-w-0 bg-card h-full overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent px-4 py-2 text-sm">
      <react_1.VStack spacing={2}>
        <react_1.HStack className="w-full justify-between">
          <h3 className="text-xxs text-foreground/70 uppercase font-light tracking-wide">
            <macro_1.Trans>Properties</macro_1.Trans>
          </h3>
          <react_1.HStack spacing={1}>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Link"], ["Link"])))} size="sm" className="p-1" onClick={function () {
            return (0, string_1.copyToClipboard)(window.location.origin +
                path_1.path.to.maintenanceDispatch(dispatchId));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy link to dispatch</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Copy ID"], ["Copy ID"])))} size="sm" className="p-1" onClick={function () { var _a, _b; return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ""); }}>
                  <lu_1.LuKeySquare className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy dispatch ID</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () {
            var _a, _b;
            return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _a === void 0 ? void 0 : _a.maintenanceDispatchId) !== null && _b !== void 0 ? _b : "");
        }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy dispatch number</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <span className="text-sm tracking-tight">
          {(_g = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _g === void 0 ? void 0 : _g.maintenanceDispatchId}
        </span>
      </react_1.VStack>

      <react_1.VStack spacing={2}>
        <h3 className="text-xs text-muted-foreground">
          <macro_1.Trans>Status</macro_1.Trans>
        </h3>
        <MaintenanceStatus_1.default status={(_h = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _h === void 0 ? void 0 : _h.status}/>
      </react_1.VStack>

      <react_1.VStack spacing={2}>
        <h3 className="text-xs text-muted-foreground">
          <macro_1.Trans>Assignee</macro_1.Trans>
        </h3>
        <components_1.Assignee id={dispatchId} table="maintenanceDispatch" size="sm" value={assignee !== null && assignee !== void 0 ? assignee : ""} isReadOnly={!permissions.can("update", "resources")}/>
      </react_1.VStack>

      <form_1.ValidatedForm defaultValues={{
            locationId: (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _j === void 0 ? void 0 : _j.locationId) !== null && _k !== void 0 ? _k : ""
        }} validator={zod_1.z.object({
            locationId: zod_1.z.string().optional()
        })} className="w-full">
        <Form_1.Location isReadOnly={isLocked || !permissions.can("update", "resources")} label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Location"], ["Location"])))} name="locationId" inline isClearable onChange={function (value) {
            var _a;
            onUpdate("locationId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            workCenterId: (_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _l === void 0 ? void 0 : _l.workCenterId) !== null && _m !== void 0 ? _m : ""
        }} validator={zod_1.z.object({
            workCenterId: zod_1.z.string().optional()
        })} className="w-full">
        <Form_1.WorkCenter isReadOnly={isLocked || !permissions.can("update", "resources")} label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Work Center"], ["Work Center"])))} name="workCenterId" inline isClearable onChange={function (value) {
            var _a;
            onUpdate("workCenterId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            priority: (_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _o === void 0 ? void 0 : _o.priority) !== null && _p !== void 0 ? _p : ""
        }} validator={zod_1.z.object({
            priority: zod_1.z.string().optional()
        })} className="w-full">
        <form_1.Select options={resources_models_1.maintenanceDispatchPriority.map(function (priority) { return ({
            value: priority,
            label: (<div className="flex gap-2 items-center">
                <MaintenancePriority_1.default priority={priority}/>
              </div>)
        }); })} isReadOnly={isLocked || !permissions.can("update", "resources")} label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Priority"], ["Priority"])))} name="priority" inline={function (value) {
            return (<MaintenancePriority_1.default priority={value}/>);
        }} onChange={function (value) {
            if (value) {
                onUpdate("priority", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            severity: (_r = (_q = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _q === void 0 ? void 0 : _q.severity) !== null && _r !== void 0 ? _r : ""
        }} validator={zod_1.z.object({
            severity: zod_1.z.string().optional()
        })} className="w-full">
        <form_1.Select options={resources_models_1.maintenanceSeverity.map(function (severity) { return ({
            value: severity,
            label: severity
        }); })} isReadOnly={isLocked || !permissions.can("update", "resources")} label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Severity"], ["Severity"])))} name="severity" inline={function (value) {
            return (<MaintenanceSeverity_1.default severity={value}/>);
        }} onChange={function (value) {
            if (value) {
                onUpdate("severity", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            source: (_t = (_s = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _s === void 0 ? void 0 : _s.source) !== null && _t !== void 0 ? _t : ""
        }} validator={zod_1.z.object({
            source: zod_1.z.string().optional()
        })} className="w-full">
        <form_1.Select options={resources_models_1.maintenanceSource.map(function (source) { return ({
            value: source,
            label: <MaintenanceSource_1.default source={source}/>
        }); })} isReadOnly={isLocked || !permissions.can("update", "resources")} label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Source"], ["Source"])))} name="source" inline={function (value) {
            return (<MaintenanceSource_1.default source={value}/>);
        }} onChange={function (value) {
            if (value) {
                onUpdate("source", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            procedureId: (_v = (_u = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _u === void 0 ? void 0 : _u.procedureId) !== null && _v !== void 0 ? _v : ""
        }} validator={zod_1.z.object({
            procedureId: zod_1.z.string().optional()
        })} className="w-full">
        <Form_1.Procedure isReadOnly={isLocked || !permissions.can("update", "resources")} label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Procedure"], ["Procedure"])))} name="procedureId" inline={function (value, options) {
            var _a;
            var procedure = options.find(function (o) { return o.value === value; });
            return (_a = procedure === null || procedure === void 0 ? void 0 : procedure.label) !== null && _a !== void 0 ? _a : null;
        }} isClearable onChange={function (value) {
            var _a;
            onUpdate("procedureId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            oeeImpact: (_x = (_w = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _w === void 0 ? void 0 : _w.oeeImpact) !== null && _x !== void 0 ? _x : "No Impact"
        }} validator={zod_1.z.object({
            oeeImpact: zod_1.z.string().optional()
        })} className="w-full">
        <form_1.Select options={resources_models_1.oeeImpact.map(function (impact) { return ({
            value: impact,
            label: <MaintenanceOeeImpact_1.default oeeImpact={impact}/>
        }); })} isReadOnly={isLocked || !permissions.can("update", "resources")} label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["OEE Impact"], ["OEE Impact"])))} name="oeeImpact" inline={function (value) {
            return (<MaintenanceOeeImpact_1.default oeeImpact={value}/>);
        }} onChange={function (value) {
            if (value) {
                setCurrentOeeImpact(value.value);
                onUpdate("oeeImpact", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            plannedStartTime: (_z = (_y = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _y === void 0 ? void 0 : _y.plannedStartTime) !== null && _z !== void 0 ? _z : ""
        }} validator={zod_1.z.object({
            plannedStartTime: zod_1.z.string().optional()
        })} className="w-full">
        <form_1.DateTimePicker name="plannedStartTime" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Planned Start"], ["Planned Start"])))} inline isDisabled={!permissions.can("update", "resources") || isLocked} onChange={function (date) {
            var _a;
            onUpdate("plannedStartTime", (_a = date === null || date === void 0 ? void 0 : date.toString()) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            plannedEndTime: (_1 = (_0 = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _0 === void 0 ? void 0 : _0.plannedEndTime) !== null && _1 !== void 0 ? _1 : ""
        }} validator={zod_1.z.object({
            plannedEndTime: zod_1.z.string().optional()
        })} className="w-full">
        <form_1.DateTimePicker name="plannedEndTime" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Planned End"], ["Planned End"])))} inline isDisabled={!permissions.can("update", "resources") || isLocked} onChange={function (date) {
            var _a;
            onUpdate("plannedEndTime", (_a = date === null || date === void 0 ? void 0 : date.toString()) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            actualStartTime: (_3 = (_2 = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _2 === void 0 ? void 0 : _2.actualStartTime) !== null && _3 !== void 0 ? _3 : ""
        }} validator={zod_1.z.object({
            actualStartTime: zod_1.z.string().optional()
        })} className="w-full">
        <form_1.DateTimePicker name="actualStartTime" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Actual Start"], ["Actual Start"])))} inline isDisabled={!permissions.can("update", "resources") || isLocked} onChange={function (date) {
            var _a;
            onUpdate("actualStartTime", (_a = date === null || date === void 0 ? void 0 : date.toString()) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            actualEndTime: (_5 = (_4 = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _4 === void 0 ? void 0 : _4.actualEndTime) !== null && _5 !== void 0 ? _5 : ""
        }} validator={zod_1.z.object({
            actualEndTime: zod_1.z.string().optional()
        })} className="w-full">
        <form_1.DateTimePicker name="actualEndTime" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Actual End"], ["Actual End"])))} inline isDisabled={!permissions.can("update", "resources") || isLocked} onChange={function (date) {
            var _a;
            onUpdate("actualEndTime", (_a = date === null || date === void 0 ? void 0 : date.toString()) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      {showFailureModes && (<>
          <form_1.ValidatedForm defaultValues={{
                suspectedFailureModeId: (_7 = (_6 = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _6 === void 0 ? void 0 : _6.suspectedFailureModeId) !== null && _7 !== void 0 ? _7 : ""
            }} validator={zod_1.z.object({
                suspectedFailureModeId: zod_1.z.string().optional()
            })} className="w-full">
            <form_1.Select options={((_8 = routeData === null || routeData === void 0 ? void 0 : routeData.failureModes) !== null && _8 !== void 0 ? _8 : []).map(function (mode) { return ({
                value: mode.id,
                label: mode.name
            }); })} isReadOnly={isLocked || !permissions.can("update", "resources")} label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Suspected Failure Mode"], ["Suspected Failure Mode"])))} name="suspectedFailureModeId" inline={function (value) {
                var _a, _b;
                return (<span>
                    {(_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.failureModes.find(function (mode) { return mode.id === value; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""}
                  </span>);
            }} isClearable onChange={function (value) {
                var _a;
                onUpdate("suspectedFailureModeId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
            }}/>
          </form_1.ValidatedForm>

          <form_1.ValidatedForm defaultValues={{
                actualFailureModeId: (_10 = (_9 = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _9 === void 0 ? void 0 : _9.actualFailureModeId) !== null && _10 !== void 0 ? _10 : ""
            }} validator={zod_1.z.object({
                actualFailureModeId: zod_1.z.string().optional()
            })} className="w-full">
            <form_1.Select options={((_11 = routeData === null || routeData === void 0 ? void 0 : routeData.failureModes) !== null && _11 !== void 0 ? _11 : []).map(function (mode) { return ({
                value: mode.id,
                label: mode.name
            }); })} isReadOnly={isLocked || !permissions.can("update", "resources")} label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Actual Failure Mode"], ["Actual Failure Mode"])))} name="actualFailureModeId" inline={function (value) {
                var _a, _b;
                return (<span>
                    {(_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.failureModes.find(function (mode) { return mode.id === value; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""}
                  </span>);
            }} isClearable onChange={function (value) {
                var _a;
                onUpdate("actualFailureModeId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
            }}/>
          </form_1.ValidatedForm>
        </>)}

      <react_1.VStack spacing={2}>
        <h3 className="text-xs text-muted-foreground">
          <macro_1.Trans>Created By</macro_1.Trans>
        </h3>
        <components_1.EmployeeAvatar employeeId={(_12 = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _12 === void 0 ? void 0 : _12.createdBy} size="xxs"/>
      </react_1.VStack>

      {/* Timecard Edit Modal */}
      {eventModal.isOpen && selectedEvent && (<react_1.Modal open={eventModal.isOpen} onOpenChange={function (open) {
                if (!open) {
                    eventModal.onClose();
                    setSelectedEvent(null);
                }
            }}>
          <react_1.ModalContent>
            <form_1.ValidatedForm method="post" action={path_1.path.to.maintenanceDispatchEvents(dispatchId)} validator={resources_models_1.maintenanceDispatchEventValidator} fetcher={eventFetcher} defaultValues={{
                id: selectedEvent.id,
                maintenanceDispatchId: dispatchId,
                employeeId: selectedEvent.employee.id,
                workCenterId: (_15 = (_13 = selectedEvent.workCenter.id) !== null && _13 !== void 0 ? _13 : (_14 = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _14 === void 0 ? void 0 : _14.workCenterId) !== null && _15 !== void 0 ? _15 : "",
                startTime: selectedEvent.startTime,
                endTime: (_16 = selectedEvent.endTime) !== null && _16 !== void 0 ? _16 : ""
            }}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>
                  <macro_1.Trans>Edit Timecard</macro_1.Trans>
                </react_1.ModalTitle>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <react_1.VStack spacing={4}>
                  <react_1.HStack spacing={2}>
                    <components_1.EmployeeAvatar employeeId={selectedEvent.employee.id} size="sm"/>
                    <span className="text-sm font-medium">
                      {(_18 = (_17 = selectedEvent.employee) === null || _17 === void 0 ? void 0 : _17.fullName) !== null && _18 !== void 0 ? _18 : "Unknown"}
                    </span>
                  </react_1.HStack>
                  <form_1.Hidden name="id" value={selectedEvent.id}/>
                  <form_1.Hidden name="maintenanceDispatchId" value={dispatchId}/>
                  <form_1.Hidden name="employeeId" value={selectedEvent.employee.id}/>
                  <form_1.Hidden name="workCenterId" value={(_21 = (_19 = selectedEvent.workCenter.id) !== null && _19 !== void 0 ? _19 : (_20 = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _20 === void 0 ? void 0 : _20.workCenterId) !== null && _21 !== void 0 ? _21 : ""}/>
                  <form_1.DateTimePicker name="startTime" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Start Time"], ["Start Time"])))} isDisabled={!permissions.can("update", "resources")}/>
                  <form_1.DateTimePicker name="endTime" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["End Time"], ["End Time"])))} isDisabled={!permissions.can("update", "resources")}/>
                </react_1.VStack>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button variant="secondary" onClick={function () {
                eventModal.onClose();
                setSelectedEvent(null);
            }}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                <react_1.Button type="submit" isLoading={eventFetcher.state !== "idle"} isDisabled={!permissions.can("update", "resources")}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </react_1.Button>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}
    </react_1.VStack>);
};
exports.default = MaintenanceDispatchProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
