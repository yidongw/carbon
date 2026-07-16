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
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var production_models_1 = require("../../production.models");
var ProcedureStatus_1 = require("./ProcedureStatus");
var ProcedureProperties = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var id = (0, react_router_1.useParams)().id;
    var t = (0, macro_1.useLingui)().t;
    if (!id)
        throw new Error("id not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.procedure(id));
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
            action: path_1.path.to.bulkUpdateProcedure
        });
    }, [id]);
    var optimisticAssignment = (0, Assignee_1.useOptimisticAssignment)({
        id: id,
        table: "procedure"
    });
    var assignee = optimisticAssignment !== undefined
        ? optimisticAssignment
        : (_a = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _a === void 0 ? void 0 : _a.assignee;
    var permissions = (0, hooks_1.usePermissions)();
    var onUpdateTags = (0, useTags_1.useTags)({ id: id, table: "procedure" }).onUpdateTags;
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
            return (0, string_1.copyToClipboard)(window.location.origin + path_1.path.to.procedure(id));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy link to procedure</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { var _a, _b; return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ""); }}>
                  <lu_1.LuKeySquare className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy procedure unique identifier</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { var _a, _b; return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""); }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy procedure name</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <span className="text-sm tracking-tight">
          {(_b = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _b === void 0 ? void 0 : _b.name}
        </span>
      </react_1.VStack>

      <Assignee_1.default id={id} table="procedure" value={assignee !== null && assignee !== void 0 ? assignee : ""} variant="inline" isReadOnly={!permissions.can("update", "production")}/>

      <form_1.ValidatedForm defaultValues={{
            status: (_d = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _c === void 0 ? void 0 : _c.status) !== null && _d !== void 0 ? _d : undefined
        }} validator={zod_1.z.object({
            status: zod_1.z.string().min(1, { message: "Status is required" })
        })} className="w-full">
        <span className="text-sm tracking-tight">
          <form_1.Select label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Status"], ["Status"])))} name="status" inline={function (value) { return (<ProcedureStatus_1.default status={value}/>); }} options={production_models_1.procedureStatus.map(function (status) { return ({
            value: status,
            label: <ProcedureStatus_1.default status={status}/>
        }); })} value={(_f = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _e === void 0 ? void 0 : _e.status) !== null && _f !== void 0 ? _f : ""} onChange={function (value) {
            var _a;
            onUpdate("status", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
        </span>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            processId: (_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _g === void 0 ? void 0 : _g.processId) !== null && _h !== void 0 ? _h : undefined
        }} validator={zod_1.z.object({
            processId: zod_1.z.string().min(1, { message: "Process is required" })
        })} className="w-full">
        <Form_1.Process label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Process"], ["Process"])))} name="processId" inline onChange={function (value) {
            var _a;
            onUpdate("processId", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
      </form_1.ValidatedForm>

      <form_1.ValidatedForm defaultValues={{
            tags: (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.procedure) === null || _j === void 0 ? void 0 : _j.tags) !== null && _k !== void 0 ? _k : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
        <Form_1.Tags availableTags={(_l = routeData === null || routeData === void 0 ? void 0 : routeData.tags) !== null && _l !== void 0 ? _l : []} label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Tags"], ["Tags"])))} name="tags" table="procedure" inline onChange={onUpdateTags}/>
      </form_1.ValidatedForm>
    </react_1.VStack>);
};
exports.default = ProcedureProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
