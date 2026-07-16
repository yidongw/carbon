"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var people_models_1 = require("../../people.models");
var ShiftForm = function (_a) {
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(-1); };
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "people")
        : !permissions.can("create", "people");
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={people_models_1.shiftValidator} method="post" action={isEditing ? path_1.path.to.shift(initialValues.id) : path_1.path.to.newShift} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? <macro_1.Trans>Edit Shift</macro_1.Trans> : <macro_1.Trans>New Shift</macro_1.Trans>}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>
            <react_1.VStack spacing={4}>
              <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Shift Name"], ["Shift Name"])))}/>
              <Form_1.Location name="locationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Location"], ["Location"])))}/>
              <Form_1.TimePicker name="startTime" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Start Time"], ["Start Time"])))}/>
              <Form_1.TimePicker name="endTime" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["End Time"], ["End Time"])))}/>

              <react_1.FormControl>
                <react_1.FormLabel>
                  <macro_1.Trans>Days</macro_1.Trans>
                </react_1.FormLabel>
                <react_1.VStack>
                  <Form_1.Boolean name="monday" description={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Monday"], ["Monday"])))}/>
                  <Form_1.Boolean name="tuesday" description={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Tuesday"], ["Tuesday"])))}/>
                  <Form_1.Boolean name="wednesday" description={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Wednesday"], ["Wednesday"])))}/>
                  <Form_1.Boolean name="thursday" description={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Thursday"], ["Thursday"])))}/>
                  <Form_1.Boolean name="friday" description={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Friday"], ["Friday"])))}/>
                  <Form_1.Boolean name="saturday" description={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Saturday"], ["Saturday"])))}/>
                  <Form_1.Boolean name="sunday" description={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Sunday"], ["Sunday"])))}/>
                </react_1.VStack>
              </react_1.FormControl>
              <Form_1.CustomFormFields table="shift"/>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <Form_1.Submit isDisabled={isDisabled}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
              <react_1.Button size="md" variant="solid" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = ShiftForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
