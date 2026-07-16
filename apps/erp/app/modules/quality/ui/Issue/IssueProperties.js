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
var Enumerable_1 = require("~/components/Enumerable");
var Form_1 = require("~/components/Form");
var CustomFormInlineFields_1 = require("~/components/Form/CustomFormInlineFields");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var quality_models_1 = require("../../quality.models");
var IssueIcons_1 = require("./IssueIcons");
var IssueProperties = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.issue(id));
    var optimisticAssignment = (0, components_1.useOptimisticAssignment)({
        id: id,
        table: "nonConformance"
    });
    var assignee = optimisticAssignment !== undefined
        ? optimisticAssignment
        : (_a = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _a === void 0 ? void 0 : _a.assignee;
    var isStarted = ((_b = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _b === void 0 ? void 0 : _b.status) !== "Registered";
    var isLocked = (0, quality_models_1.isIssueLocked)((_c = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _c === void 0 ? void 0 : _c.status);
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error.message);
        }
    }, [fetcher.data]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdate = (0, react_2.useCallback)(function (field, value) {
        var _a;
        var formData = new FormData();
        formData.append("ids", id);
        formData.append("field", field);
        formData.append("value", (_a = value === null || value === void 0 ? void 0 : value.toString()) !== null && _a !== void 0 ? _a : "");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdateIssue
        });
    }, [id]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateTags = (0, react_2.useCallback)(function (value) {
        var formData = new FormData();
        formData.append("ids", id);
        formData.append("table", "nonConformance");
        value.forEach(function (v) {
            formData.append("value", v);
        });
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.tags
        });
    }, [id]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateCustomFields = (0, react_2.useCallback)(function (value) {
        var formData = new FormData();
        formData.append("ids", id);
        formData.append("table", "nonConformance");
        formData.append("value", value);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.customFields
        });
    }, [id]);
    var disableStructureUpdate = !permissions.can("delete", "quality") || isStarted || isLocked;
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
            return (0, string_1.copyToClipboard)(window.location.origin + path_1.path.to.issue(id));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy link to issue</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () {
            var _a, _b;
            return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _a === void 0 ? void 0 : _a.nonConformanceId) !== null && _b !== void 0 ? _b : "");
        }}>
                  <lu_1.LuKeySquare className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy issue unique identifier</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () {
            var _a, _b;
            return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _a === void 0 ? void 0 : _a.nonConformanceId) !== null && _b !== void 0 ? _b : "");
        }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy issue number</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <react_1.VStack spacing={1}>
          <span className="text-sm tracking-tight">
            {(_d = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _d === void 0 ? void 0 : _d.nonConformanceId}
          </span>
          <form_1.ValidatedForm defaultValues={{
            name: (_f = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : undefined
        }} validator={zod_1.z.object({
            name: zod_1.z.string()
        })} className="w-full">
            <span className="text-xs text-muted-foreground">
              <form_1.InputControlled label="" name="name" size="sm" inline isReadOnly={isLocked} value={(_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _g === void 0 ? void 0 : _g.name) !== null && _h !== void 0 ? _h : ""} onBlur={function (e) {
            var _a;
            onUpdate("name", (_a = e.target.value) !== null && _a !== void 0 ? _a : null);
        }} className="text-muted-foreground"/>
            </span>
          </form_1.ValidatedForm>
        </react_1.VStack>
      </react_1.VStack>

      <react_1.VStack spacing={2}>
        <h3 className="text-xs text-muted-foreground">
          <macro_1.Trans>Assignee</macro_1.Trans>
        </h3>
        <components_1.Assignee id={id} table="nonConformance" size="sm" value={assignee !== null && assignee !== void 0 ? assignee : ""} isReadOnly={!permissions.can("update", "quality")}/>
      </react_1.VStack>

      <form_1.ValidatedForm defaultValues={{
            nonConformanceTypeId: (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _j === void 0 ? void 0 : _j.nonConformanceTypeId) !== null && _k !== void 0 ? _k : ""
        }} validator={zod_1.z.object({
            nonConformanceTypeId: zod_1.z.string().optional()
        })} className="w-full">
        <form_1.Select options={((_l = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformanceTypes) !== null && _l !== void 0 ? _l : []).map(function (type) { return ({
            value: type.id,
            label: <Enumerable_1.Enumerable value={type.name}/>
        }); })} isReadOnly={disableStructureUpdate} label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Issue Type"], ["Issue Type"])))} name="nonConformanceTypeId" inline={function (value, options) {
            var _a, _b;
            return (<Enumerable_1.Enumerable value={(_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformanceTypes.find(function (t) { return t.id === value; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null}/>);
        }} onChange={function (value) {
            if (value) {
                onUpdate("nonConformanceTypeId", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            source: (_o = (_m = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _m === void 0 ? void 0 : _m.source) !== null && _o !== void 0 ? _o : ""
        }} validator={zod_1.z.object({
            source: zod_1.z.string().optional()
        })} className="w-full">
        <form_1.Select options={quality_models_1.nonConformanceSource.map(function (source) { return ({
            value: source,
            label: (<div className="flex gap-2 items-center">
                {(0, IssueIcons_1.getSourceIcon)(source, false)}
                <span>{source}</span>
              </div>)
        }); })} isReadOnly={disableStructureUpdate} label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Source"], ["Source"])))} name="source" inline={function (value, options) {
            return (<div className="flex gap-2 items-center">
                {(0, IssueIcons_1.getSourceIcon)(value, false)}
                <span>{value}</span>
              </div>);
        }} onChange={function (value) {
            if (value) {
                onUpdate("source", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            priority: (_q = (_p = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _p === void 0 ? void 0 : _p.priority) !== null && _q !== void 0 ? _q : ""
        }} validator={zod_1.z.object({
            priority: zod_1.z.string().optional()
        })} className="w-full">
        <form_1.Select options={quality_models_1.nonConformancePriority.map(function (priority) { return ({
            value: priority,
            label: (<div className="flex gap-2 items-center">
                {(0, IssueIcons_1.getPriorityIcon)(priority, false)}
                <span>{priority}</span>
              </div>)
        }); })} isReadOnly={disableStructureUpdate} label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Priority"], ["Priority"])))} name="priority" inline={function (value, options) {
            return (<div className="flex gap-2 items-center">
                {(0, IssueIcons_1.getPriorityIcon)(value, false)}
                <span>{value}</span>
              </div>);
        }} onChange={function (value) {
            if (value) {
                onUpdate("priority", value.value);
            }
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            requiredActionIds: (_s = (_r = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _r === void 0 ? void 0 : _r.requiredActionIds) !== null && _s !== void 0 ? _s : []
        }} validator={zod_1.z.object({
            requiredActionIds: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
        <form_1.MultiSelect options={((_t = routeData === null || routeData === void 0 ? void 0 : routeData.requiredActions) !== null && _t !== void 0 ? _t : []).map(function (type) { return ({
            value: type.id,
            label: type.name
        }); })} isReadOnly={disableStructureUpdate} label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Required Actions"], ["Required Actions"])))} name="requiredActionIds" inline value={(_v = (_u = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _u === void 0 ? void 0 : _u.requiredActionIds) !== null && _v !== void 0 ? _v : []} onChange={function (value) {
            onUpdate("requiredActionIds", value.map(function (v) { return v.value; }).join(","));
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            approvalRequirements: (_x = (_w = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _w === void 0 ? void 0 : _w.approvalRequirements) !== null && _x !== void 0 ? _x : []
        }} validator={zod_1.z.object({
            approvalRequirements: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
        <form_1.MultiSelect options={quality_models_1.nonConformanceApprovalRequirement.map(function (type) { return ({
            value: type,
            label: type
        }); })} isReadOnly={disableStructureUpdate} label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Approval Requirements"], ["Approval Requirements"])))} name="approvalRequirements" inline onChange={function (value) {
            onUpdate("approvalRequirements", value.map(function (v) { return v.value; }).join(","));
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            openDate: (_z = (_y = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _y === void 0 ? void 0 : _y.openDate) !== null && _z !== void 0 ? _z : ""
        }} validator={zod_1.z.object({
            openDate: zod_1.z.string().min(1, { message: "Open date is required" })
        })} className="w-full">
        <form_1.DatePicker name="openDate" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Open Date"], ["Open Date"])))} inline isDisabled={!permissions.can("update", "quality") || isLocked} onChange={function (date) {
            onUpdate("openDate", date);
        }}/>
      </form_1.ValidatedForm>

      <react_1.VStack spacing={2}>
        <h3 className="text-xs text-muted-foreground">
          <macro_1.Trans>Created By</macro_1.Trans>
        </h3>
        <components_1.EmployeeAvatar employeeId={(_0 = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _0 === void 0 ? void 0 : _0.createdBy} size="xxs"/>
      </react_1.VStack>

      <form_1.ValidatedForm defaultValues={{
            dueDate: (_2 = (_1 = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _1 === void 0 ? void 0 : _1.dueDate) !== null && _2 !== void 0 ? _2 : ""
        }} validator={zod_1.z.object({
            dueDate: zod_1.z.string().min(1, { message: "Due date is required" })
        })} className="w-full">
        <form_1.DatePicker name="dueDate" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Due Date"], ["Due Date"])))} inline isDisabled={!permissions.can("update", "quality") || isLocked} onChange={function (date) {
            onUpdate("dueDate", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            closeDate: (_4 = (_3 = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _3 === void 0 ? void 0 : _3.closeDate) !== null && _4 !== void 0 ? _4 : ""
        }} validator={zod_1.z.object({
            closeDate: zod_1.z.string().min(1, { message: "Close date is required" })
        })} className="w-full">
        <form_1.DatePicker name="closeDate" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Close Date"], ["Close Date"])))} inline isDisabled={!permissions.can("update", "quality") || isLocked} onChange={function (date) {
            onUpdate("closeDate", date);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            tags: (_6 = (_5 = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _5 === void 0 ? void 0 : _5.tags) !== null && _6 !== void 0 ? _6 : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
        <Form_1.Tags availableTags={(_7 = routeData === null || routeData === void 0 ? void 0 : routeData.tags) !== null && _7 !== void 0 ? _7 : []} label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Tags"], ["Tags"])))} name="tags" table="nonConformance" inline onChange={onUpdateTags}/>
      </form_1.ValidatedForm>

      <CustomFormInlineFields_1.default customFields={((_9 = (_8 = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _8 === void 0 ? void 0 : _8.customFields) !== null && _9 !== void 0 ? _9 : {})} table="nonConformance" tags={(_11 = (_10 = routeData === null || routeData === void 0 ? void 0 : routeData.nonConformance) === null || _10 === void 0 ? void 0 : _10.tags) !== null && _11 !== void 0 ? _11 : []} onUpdate={onUpdateCustomFields}/>
    </react_1.VStack>);
};
exports.default = IssueProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
