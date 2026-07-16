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
var Assignee_1 = require("~/components/Assignee");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var useTags_1 = require("~/hooks/useTags");
var resources_1 = require("~/modules/resources");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var TrainingStatus_1 = require("./TrainingStatus");
var TrainingProperties = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    var t = (0, macro_1.useLingui)().t;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.training(id));
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
            action: path_1.path.to.bulkUpdateTraining
        });
    }, [id]);
    var optimisticAssignment = (0, Assignee_1.useOptimisticAssignment)({
        id: id,
        table: "training"
    });
    var assignee = optimisticAssignment !== undefined
        ? optimisticAssignment
        : (_a = routeData === null || routeData === void 0 ? void 0 : routeData.training) === null || _a === void 0 ? void 0 : _a.assignee;
    var permissions = (0, hooks_1.usePermissions)();
    var onUpdateTags = (0, useTags_1.useTags)({ id: id, table: "training" }).onUpdateTags;
    var availableTags = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.tags) !== null && _b !== void 0 ? _b : [];
    return (<react_1.VStack spacing={4} className="w-[450px] bg-card h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent border-l border-border px-4 py-2 text-sm">
      <react_1.VStack spacing={2}>
        <react_1.HStack className="w-full justify-between">
          <h3 className="text-xxs text-foreground/70 uppercase font-light tracking-wide">
            <macro_1.Trans>Properties</macro_1.Trans>
          </h3>
          <react_1.HStack spacing={1}>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Link"], ["Link"])))} size="sm" className="p-1" onClick={function () {
            return (0, string_1.copyToClipboard)(window.location.origin + path_1.path.to.training(id));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy link to training</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { var _a, _b; return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.training) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ""); }}>
                  <lu_1.LuKeySquare className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy training unique identifier</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { var _a, _b; return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.training) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""); }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy training name</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <span className="text-sm tracking-tight">
          {(_c = routeData === null || routeData === void 0 ? void 0 : routeData.training) === null || _c === void 0 ? void 0 : _c.name}
        </span>
      </react_1.VStack>

      <Assignee_1.default id={id} table="training" value={assignee !== null && assignee !== void 0 ? assignee : ""} variant="inline" isReadOnly={!permissions.can("update", "resources")}/>

      <form_1.ValidatedForm defaultValues={{
            status: (_e = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.training) === null || _d === void 0 ? void 0 : _d.status) !== null && _e !== void 0 ? _e : undefined
        }} validator={zod_1.z.object({
            status: zod_1.z.string().min(1, { message: "Status is required" })
        })} className="w-full">
        <span className="text-sm tracking-tight">
          <form_1.Select label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Status"], ["Status"])))} name="status" inline={function (value) { return (<TrainingStatus_1.default status={value}/>); }} options={resources_1.trainingStatus.map(function (status) { return ({
            value: status,
            label: <TrainingStatus_1.default status={status}/>
        }); })} value={(_g = (_f = routeData === null || routeData === void 0 ? void 0 : routeData.training) === null || _f === void 0 ? void 0 : _f.status) !== null && _g !== void 0 ? _g : ""} onChange={function (value) {
            var _a;
            onUpdate("status", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
        </span>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            type: (_j = (_h = routeData === null || routeData === void 0 ? void 0 : routeData.training) === null || _h === void 0 ? void 0 : _h.type) !== null && _j !== void 0 ? _j : undefined
        }} validator={zod_1.z.object({
            type: zod_1.z.string().min(1, { message: "Type is required" })
        })} className="w-full">
        <span className="text-sm tracking-tight">
          <form_1.Select label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Type"], ["Type"])))} name="type" inline={function (value) { return (<react_1.Badge variant={value === "Mandatory" ? "default" : "secondary"}>
                {value}
              </react_1.Badge>); }} options={resources_1.trainingType.map(function (t) { return ({
            value: t,
            label: (<react_1.Badge variant={t === "Mandatory" ? "default" : "secondary"}>
                  {t}
                </react_1.Badge>)
        }); })} value={(_l = (_k = routeData === null || routeData === void 0 ? void 0 : routeData.training) === null || _k === void 0 ? void 0 : _k.type) !== null && _l !== void 0 ? _l : ""} onChange={function (value) {
            var _a;
            onUpdate("type", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
        </span>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            frequency: (_o = (_m = routeData === null || routeData === void 0 ? void 0 : routeData.training) === null || _m === void 0 ? void 0 : _m.frequency) !== null && _o !== void 0 ? _o : undefined
        }} validator={zod_1.z.object({
            frequency: zod_1.z.string().min(1, { message: "Frequency is required" })
        })} className="w-full">
        <span className="text-sm tracking-tight">
          <form_1.Select label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Frequency"], ["Frequency"])))} name="frequency" inline={function (value) { return <react_1.Badge variant="secondary">{value}</react_1.Badge>; }} options={resources_1.trainingFrequency.map(function (f) { return ({
            value: f,
            label: <react_1.Badge variant="secondary">{f}</react_1.Badge>
        }); })} value={(_q = (_p = routeData === null || routeData === void 0 ? void 0 : routeData.training) === null || _p === void 0 ? void 0 : _p.frequency) !== null && _q !== void 0 ? _q : ""} onChange={function (value) {
            var _a;
            onUpdate("frequency", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
        </span>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            estimatedDuration: (_s = (_r = routeData === null || routeData === void 0 ? void 0 : routeData.training) === null || _r === void 0 ? void 0 : _r.estimatedDuration) !== null && _s !== void 0 ? _s : undefined
        }} validator={zod_1.z.object({
            estimatedDuration: zod_1.z.string()
        })} className="w-full -mt-2">
        <span className="text-xs text-muted-foreground">
          <Form_1.InputControlled label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Estimated Duration"], ["Estimated Duration"])))} name="estimatedDuration" inline placeholder="45m" size="sm" value={(_u = (_t = routeData === null || routeData === void 0 ? void 0 : routeData.training) === null || _t === void 0 ? void 0 : _t.estimatedDuration) !== null && _u !== void 0 ? _u : ""} onBlur={function (e) {
            var _a;
            onUpdate("estimatedDuration", (_a = e.target.value) !== null && _a !== void 0 ? _a : null);
        }} className="text-muted-foreground"/>
        </span>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            tags: (_w = (_v = routeData === null || routeData === void 0 ? void 0 : routeData.training) === null || _v === void 0 ? void 0 : _v.tags) !== null && _w !== void 0 ? _w : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
        <Form_1.Tags label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Tags"], ["Tags"])))} name="tags" table="training" availableTags={availableTags} onChange={function (value) { return onUpdateTags(value); }} inline/>
      </form_1.ValidatedForm>
    </react_1.VStack>);
};
exports.default = TrainingProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
