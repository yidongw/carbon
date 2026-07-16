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
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var items_1 = require("~/stores/items");
var path_1 = require("~/utils/path");
var quality_models_1 = require("../../quality.models");
var IssueIcons_1 = require("./IssueIcons");
var IssueForm = function (_a) {
    var _b, _c;
    var initialValues = _a.initialValues, nonConformanceWorkflows = _a.nonConformanceWorkflows, nonConformanceTypes = _a.nonConformanceTypes, requiredActions = _a.requiredActions;
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var isEditing = initialValues.id !== undefined;
    var _d = (0, react_2.useState)({
        priority: initialValues.priority,
        source: initialValues.source,
        requiredActionIds: (_b = initialValues.requiredActionIds) !== null && _b !== void 0 ? _b : [],
        approvalRequirements: (_c = initialValues.approvalRequirements) !== null && _c !== void 0 ? _c : []
    }), workflow = _d[0], setWorkflow = _d[1];
    var items = (0, items_1.useItems)()[0];
    var onWorkflowChange = function (value) {
        var _a, _b;
        if (value) {
            var selectedWorkflow = nonConformanceWorkflows.find(function (w) { return w.id === value.value; });
            if (selectedWorkflow) {
                setWorkflow({
                    priority: selectedWorkflow.priority,
                    source: selectedWorkflow.source,
                    requiredActionIds: (_a = selectedWorkflow.requiredActionIds) !== null && _a !== void 0 ? _a : [],
                    approvalRequirements: (_b = selectedWorkflow.approvalRequirements) !== null && _b !== void 0 ? _b : []
                });
            }
        }
    };
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" validator={quality_models_1.issueValidator} defaultValues={initialValues} className="w-full">
        <react_1.CardHeader>
          <react_1.CardTitle>{isEditing ? "Issue" : "New Issue"}</react_1.CardTitle>
          {!isEditing && (<react_1.CardDescription>
              <macro_1.Trans>
                A issue record tracks quality issues and their resolution
                process.
              </macro_1.Trans>
            </react_1.CardDescription>)}
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="id"/>
          <Form_1.Hidden name="nonConformanceId"/>
          <Form_1.Hidden name="supplierId"/>
          <Form_1.Hidden name="customerId"/>
          <Form_1.Hidden name="jobId"/>
          <Form_1.Hidden name="jobOperationId"/>
          <Form_1.Hidden name="purchaseOrderId"/>
          <Form_1.Hidden name="purchaseOrderLineId"/>
          <Form_1.Hidden name="salesOrderId"/>
          <Form_1.Hidden name="salesOrderLineId"/>
          <Form_1.Hidden name="shipmentId"/>
          <Form_1.Hidden name="shipmentLineId"/>
          <Form_1.Hidden name="operationSupplierProcessId"/>

          <react_1.VStack spacing={4}>
            <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2">
              <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"])))}/>
              <form_1.Select name="nonConformanceTypeId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Issue Type"], ["Issue Type"])))} options={nonConformanceTypes.map(function (type) { return ({
            label: type.name,
            value: type.id
        }); })}/>
            </div>
            <form_1.TextArea name="description" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Description"], ["Description"])))}/>
            <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2">
              <form_1.CreatableCombobox name="nonConformanceWorkflowId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Workflow"], ["Workflow"])))} options={nonConformanceWorkflows.map(function (workflow) { return ({
            label: workflow.name,
            value: workflow.id
        }); })} onChange={onWorkflowChange} onCreateOption={function () {
            navigate(path_1.path.to.newIssueWorkflow);
        }}/>

              <form_1.MultiSelect name="items" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Items"], ["Items"])))} options={items.map(function (item) { return ({
            label: item.readableIdWithRevision,
            value: item.id,
            helper: item.name
        }); })}/>
            </div>

            <react_1.VStack spacing={4}>
              <form_1.MultiSelect name="requiredActionIds" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Required Actions"], ["Required Actions"])))} options={requiredActions.map(function (action) { return ({
            label: action.name,
            value: action.id
        }); })} value={workflow.requiredActionIds} onChange={function (value) {
            setWorkflow(__assign(__assign({}, workflow), { requiredActionIds: value.map(function (v) { return v.value; }) }));
        }}/>
              <form_1.MultiSelect name="approvalRequirements" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Approval Requirements"], ["Approval Requirements"])))} options={quality_models_1.nonConformanceApprovalRequirement.map(function (requirement) { return ({
            label: requirement,
            value: requirement
        }); })} value={workflow.approvalRequirements} onChange={function (value) {
            setWorkflow(__assign(__assign({}, workflow), { approvalRequirements: value.map(function (v) { return v.value; }) }));
        }}/>
            </react_1.VStack>
            <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2">
              <form_1.SelectControlled name="priority" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Priority"], ["Priority"])))} options={quality_models_1.nonConformancePriority.map(function (priority) { return ({
            label: (<div className="flex gap-2 items-center">
                      {(0, IssueIcons_1.getPriorityIcon)(priority, false)}
                      <span>{priority}</span>
                    </div>),
            value: priority
        }); })} value={workflow.priority} onChange={function (value) {
            var _a;
            setWorkflow(__assign(__assign({}, workflow), { priority: (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : "" }));
        }}/>
              <form_1.SelectControlled name="source" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Source"], ["Source"])))} options={quality_models_1.nonConformanceSource.map(function (source) { return ({
            label: (<div className="flex gap-2 items-center">
                      {(0, IssueIcons_1.getSourceIcon)(source, false)}
                      <span>{source}</span>
                    </div>),
            value: source
        }); })} value={workflow.source} onChange={function (value) {
            var _a;
            setWorkflow(__assign(__assign({}, workflow), { source: (_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : "" }));
        }}/>

              <form_1.DatePicker name="openDate" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Open Date"], ["Open Date"])))}/>
              <Form_1.Location name="locationId" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Location"], ["Location"])))}/>
              <Form_1.CustomFormFields table="nonConformance"/>
            </div>
          </react_1.VStack>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={isEditing
            ? !permissions.can("update", "quality")
            : !permissions.can("create", "quality")}>
            Save
          </Form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
};
exports.default = IssueForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
