"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var production_models_1 = require("../../production.models");
var ProductionEventForm = function (_a) {
    var initialValues = _a.initialValues, operationOptions = _a.operationOptions;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(-1); };
    var _b = (0, react_2.useState)((0, date_1.toCalendarDateTime)((0, date_1.parseAbsolute)(initialValues.startTime, (0, date_1.getLocalTimeZone)()))), startTime = _b[0], setStartTime = _b[1];
    var _c = (0, react_2.useState)(initialValues.endTime
        ? (0, date_1.toCalendarDateTime)((0, date_1.parseAbsolute)(initialValues.endTime, (0, date_1.getLocalTimeZone)()))
        : undefined), endTime = _c[0], setEndTime = _c[1];
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "production")
        : !permissions.can("create", "production");
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={production_models_1.productionEventValidator} method="post" defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? "Edit Production Event" : "Create Production Event"}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>

            <react_1.VStack spacing={4}>
              <Form_1.Select name="jobOperationId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Operation"], ["Operation"])))} options={operationOptions !== null && operationOptions !== void 0 ? operationOptions : []}/>
              <Form_1.Employee name="employeeId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Employee"], ["Employee"])))}/>
              <Form_1.WorkCenter name="workCenterId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Work Center"], ["Work Center"])))} processId={initialValues.jobOperationId}/>
              <Form_1.Select name="type" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Event Type"], ["Event Type"])))} options={[
            { label: "Labor", value: "Labor" },
            { label: "Machine", value: "Machine" },
            { label: "Setup", value: "Setup" }
        ]}/>
              <Form_1.DateTimePicker name="startTime" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Start Time"], ["Start Time"])))} maxValue={endTime} onChange={setStartTime}/>
              <Form_1.DateTimePicker name="endTime" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["End Time"], ["End Time"])))} minValue={startTime} onChange={setEndTime}/>
              <form_1.TextArea name="notes" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Notes"], ["Notes"])))}/>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <Form_1.Submit isDisabled={isDisabled}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
              <react_1.Button variant="solid" onClick={onClose}>
                Cancel
              </react_1.Button>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = ProductionEventForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
