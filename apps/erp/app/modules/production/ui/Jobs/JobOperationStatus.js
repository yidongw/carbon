"use client";
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobOperationStatus = JobOperationStatus;
exports.JobOperationTags = JobOperationTags;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var Form_1 = require("~/components/Form");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var useTags_1 = require("~/hooks/useTags");
var path_1 = require("~/utils/path");
var production_models_1 = require("../../production.models");
var jobLabels_1 = require("./jobLabels");
function useOptimisticJobStatus(operationId) {
    var _a;
    var fetchers = (0, react_router_1.useFetchers)();
    var pendingUpdate = fetchers.find(function (f) {
        var _a;
        return ((_a = f.formData) === null || _a === void 0 ? void 0 : _a.get("id")) === operationId &&
            f.key === "jobOperation:".concat(operationId);
    });
    return (_a = pendingUpdate === null || pendingUpdate === void 0 ? void 0 : pendingUpdate.formData) === null || _a === void 0 ? void 0 : _a.get("status");
}
function JobOperationStatus(_a) {
    var _b, _c;
    var operation = _a.operation, jobIdProp = _a.jobId, jobProp = _a.job, className = _a.className, onChange = _a.onChange;
    var t = (0, macro_1.useLingui)().t;
    var getJobOperationStatusLabel = (0, jobLabels_1.useJobOperationStatusLabel)();
    var params = (0, react_router_1.useParams)();
    var jobId = (_b = jobIdProp !== null && jobIdProp !== void 0 ? jobIdProp : params.jobId) !== null && _b !== void 0 ? _b : operation.jobId;
    if (!jobId)
        throw new Error("Job ID is required");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.job(jobId));
    var isPaused = ((_c = (jobProp !== null && jobProp !== void 0 ? jobProp : routeData === null || routeData === void 0 ? void 0 : routeData.job)) === null || _c === void 0 ? void 0 : _c.status) === "Paused";
    var submit = (0, react_router_1.useSubmit)();
    var permissions = (0, hooks_1.usePermissions)();
    var optimisticStatus = useOptimisticJobStatus(operation.id);
    var isDisabled = !permissions.can("update", "production");
    var onOperationStatusChange = (0, react_2.useCallback)(function (id, status) {
        onChange === null || onChange === void 0 ? void 0 : onChange(status);
        submit({
            id: id,
            status: status
        }, {
            method: "post",
            action: path_1.path.to.jobOperationStatus,
            navigate: false,
            fetcherKey: "jobOperation:".concat(id)
        });
    }, [submit, onChange]);
    var currentStatus = optimisticStatus || (isPaused ? "Paused" : operation.status);
    return (<react_1.DropdownMenu>
      <react_1.DropdownMenuTrigger asChild>
        <react_1.IconButton size="sm" variant="ghost" className={className} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Change status"], ["Change status"])))} icon={<Icons_1.OperationStatusIcon status={currentStatus}/>} isDisabled={isDisabled}/>
      </react_1.DropdownMenuTrigger>
      {!isDisabled && (<react_1.DropdownMenuContent align="start">
          <react_1.DropdownMenuRadioGroup value={currentStatus} onValueChange={function (status) {
                return onOperationStatusChange(operation.id, status);
            }}>
            {production_models_1.jobOperationStatus.map(function (status) { return (<react_1.DropdownMenuRadioItem key={status} value={status}>
                <react_1.DropdownMenuIcon icon={<Icons_1.OperationStatusIcon status={status}/>}/>
                <span>{getJobOperationStatusLabel(status)}</span>
              </react_1.DropdownMenuRadioItem>); })}
          </react_1.DropdownMenuRadioGroup>
        </react_1.DropdownMenuContent>)}
    </react_1.DropdownMenu>);
}
function JobOperationTags(_a) {
    var _b;
    var operation = _a.operation, availableTags = _a.availableTags;
    var onUpdateTags = (0, useTags_1.useTags)({ id: operation.id, table: "jobOperation" }).onUpdateTags;
    if (!operation.id)
        return null;
    return (<form_1.ValidatedForm defaultValues={{
            tags: (_b = operation.tags) !== null && _b !== void 0 ? _b : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })}>
      <Form_1.Tags availableTags={availableTags} label="" name="tags" table="operation" maxPreview={3} inline onChange={onUpdateTags}/>
    </form_1.ValidatedForm>);
}
var templateObject_1;
