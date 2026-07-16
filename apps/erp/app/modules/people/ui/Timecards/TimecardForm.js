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
var path_1 = require("~/utils/path");
var people_models_1 = require("../../people.models");
var TimecardForm = function (_a) {
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(-1); };
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "people")
        : !permissions.can("create", "people");
    var _b = (0, react_2.useState)(initialValues.clockIn
        ? (0, date_1.toCalendarDateTime)((0, date_1.parseAbsolute)(initialValues.clockIn, (0, date_1.getLocalTimeZone)()))
        : (0, date_1.toCalendarDateTime)((0, date_1.now)((0, date_1.getLocalTimeZone)()))), clockIn = _b[0], setClockIn = _b[1];
    var _c = (0, react_2.useState)(initialValues.clockOut
        ? (0, date_1.toCalendarDateTime)((0, date_1.parseAbsolute)(initialValues.clockOut, (0, date_1.getLocalTimeZone)()))
        : undefined), clockOut = _c[0], setClockOut = _c[1];
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={people_models_1.timecardValidator} method="post" action={isEditing
            ? path_1.path.to.timecard(initialValues.id)
            : path_1.path.to.newTimecard} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? (<macro_1.Trans>Edit Timecard</macro_1.Trans>) : (<macro_1.Trans>New Timecard</macro_1.Trans>)}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>
            <react_1.VStack spacing={4}>
              {!isEditing ? (<Form_1.Employee name="employeeId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Employee"], ["Employee"])))}/>) : (<Form_1.Hidden name="employeeId"/>)}
              <Form_1.DateTimePicker name="clockIn" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Clock In"], ["Clock In"])))} maxValue={clockOut} onChange={setClockIn}/>
              <Form_1.DateTimePicker name="clockOut" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Clock Out"], ["Clock Out"])))} minValue={clockIn} onChange={setClockOut}/>
              <form_1.TextArea name="note" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Note"], ["Note"])))}/>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <Form_1.Submit isDisabled={isDisabled}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
              <react_1.Button variant="solid" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = TimecardForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
