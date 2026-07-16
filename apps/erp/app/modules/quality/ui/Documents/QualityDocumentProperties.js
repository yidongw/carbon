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
var quality_models_1 = require("../../quality.models");
var QualityDocumentStatus_1 = require("./QualityDocumentStatus");
function getStatusHelperText(hasPending, isArchived, canReopen) {
    if (!hasPending)
        return undefined;
    if (isArchived) {
        return canReopen
            ? "Reactivation is pending approval. Use Approve or Reject above, or set to Draft to withdraw."
            : "Reactivation is pending approval. Use Approve or Reject above.";
    }
    return canReopen
        ? "Active is unavailable while an approval is pending. Use Approve or Reject above, or set to Archived or Draft to withdraw."
        : "Active is unavailable while an approval is pending. You can set to Archived to cancel the request.";
}
var QualityDocumentProperties = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.qualityDocument(id));
    var hasPendingApproval = !!(routeData === null || routeData === void 0 ? void 0 : routeData.approvalRequest);
    var canReopen = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.canReopen) !== null && _a !== void 0 ? _a : true;
    var currentStatus = (_c = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _b === void 0 ? void 0 : _b.status) !== null && _c !== void 0 ? _c : null;
    var isArchived = currentStatus === "Archived";
    var statusOptions = hasPendingApproval
        ? quality_models_1.qualityDocumentStatus.filter(function (s) { return s !== "Active" && (s !== "Draft" || canReopen); })
        : quality_models_1.qualityDocumentStatus;
    var statusValue = currentStatus && statusOptions.includes(currentStatus)
        ? currentStatus
        : statusOptions[0];
    var statusHelperText = getStatusHelperText(hasPendingApproval, isArchived, canReopen);
    var fetcher = (0, react_router_1.useFetcher)();
    var onUpdate = (0, react_2.useCallback)(function (field, value) {
        var _a;
        var formData = new FormData();
        formData.append("ids", id);
        formData.append("field", field);
        formData.append("value", (_a = value === null || value === void 0 ? void 0 : value.toString()) !== null && _a !== void 0 ? _a : "");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.bulkUpdateQualityDocument
        });
    }, [id, fetcher]);
    var optimisticAssignment = (0, Assignee_1.useOptimisticAssignment)({
        id: id,
        table: "qualityDocument"
    });
    var assignee = optimisticAssignment !== undefined
        ? optimisticAssignment
        : (_d = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _d === void 0 ? void 0 : _d.assignee;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var onUpdateTags = (0, useTags_1.useTags)({ id: id, table: "qualityDocument" }).onUpdateTags;
    var availableTags = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.tags) !== null && _e !== void 0 ? _e : [];
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
            return (0, string_1.copyToClipboard)(window.location.origin + path_1.path.to.qualityDocument(id));
        }}>
                  <lu_1.LuLink className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy link to document</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { var _a, _b; return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : ""); }}>
                  <lu_1.LuKeySquare className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy document unique identifier</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
            <react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <react_1.Button variant="ghost" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Copy"], ["Copy"])))} size="sm" className="p-1" onClick={function () { var _a, _b; return (0, string_1.copyToClipboard)((_b = (_a = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""); }}>
                  <lu_1.LuCopy className="w-3 h-3"/>
                </react_1.Button>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                <span>
                  <macro_1.Trans>Copy document name</macro_1.Trans>
                </span>
              </react_1.TooltipContent>
            </react_1.Tooltip>
          </react_1.HStack>
        </react_1.HStack>
        <span className="text-sm tracking-tight">
          {(_f = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _f === void 0 ? void 0 : _f.name}
        </span>
      </react_1.VStack>

      <Assignee_1.default id={id} table="qualityDocument" value={assignee !== null && assignee !== void 0 ? assignee : ""} variant="inline" isReadOnly={!permissions.can("update", "quality")}/>

      <form_1.ValidatedForm key={"status-form-".concat(id, "-").concat(currentStatus !== null && currentStatus !== void 0 ? currentStatus : "unknown")} defaultValues={{
            status: statusValue !== null && statusValue !== void 0 ? statusValue : undefined
        }} validator={zod_1.z.object({
            status: zod_1.z.string().min(1, { message: "Status is required" })
        })} className="w-full">
        <span className="text-sm tracking-tight">
          <form_1.Select label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Status"], ["Status"])))} name="status" helperText={statusHelperText} inline={function (value) { return (<QualityDocumentStatus_1.default status={value}/>); }} options={statusOptions.map(function (status) { return ({
            value: status,
            label: <QualityDocumentStatus_1.default status={status}/>
        }); })} value={statusValue !== null && statusValue !== void 0 ? statusValue : ""} onChange={function (value) {
            var _a;
            onUpdate("status", (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
        }}/>
        </span>
      </form_1.ValidatedForm>
      <form_1.ValidatedForm defaultValues={{
            tags: (_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.document) === null || _g === void 0 ? void 0 : _g.tags) !== null && _h !== void 0 ? _h : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
        <Form_1.Tags label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Tags"], ["Tags"])))} name="tags" table="qualityDocument" availableTags={availableTags} onChange={function (value) { return onUpdateTags(value); }} inline/>
      </form_1.ValidatedForm>
    </react_1.VStack>);
};
exports.default = QualityDocumentProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
