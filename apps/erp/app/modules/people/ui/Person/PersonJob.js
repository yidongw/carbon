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
var Form_1 = require("~/components/Form");
var people_models_1 = require("../../people.models");
var PersonJob = function (_a) {
    var _b;
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, react_2.useState)((_b = initialValues.locationId) !== null && _b !== void 0 ? _b : null), location = _c[0], setLocation = _c[1];
    return (<form_1.ValidatedForm validator={people_models_1.employeeJobValidator} method="post" defaultValues={initialValues}>
      <react_1.Card>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Job</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form_1.Input name="title" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Title"], ["Title"])))}/>
            <Form_1.DatePicker name="startDate" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Start Date"], ["Start Date"])))}/>
            <Form_1.Location name="locationId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Location"], ["Location"])))} onChange={function (l) { var _a; return setLocation((_a = l === null || l === void 0 ? void 0 : l.value) !== null && _a !== void 0 ? _a : null); }}/>
            <Form_1.Shift location={location !== null && location !== void 0 ? location : undefined} name="shiftId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Shift"], ["Shift"])))}/>
            <Form_1.Employee name="managerId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Manager"], ["Manager"])))}/>
            <Form_1.Department name="departmentId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Department"], ["Department"])))}/>
            <Form_1.Hidden name="intent" value="job"/>
            <Form_1.CustomFormFields table="employeeJob"/>
          </div>
          <div>
            <Form_1.Submit>
              <macro_1.Trans>Save</macro_1.Trans>
            </Form_1.Submit>
          </div>
        </react_1.CardContent>
      </react_1.Card>
    </form_1.ValidatedForm>);
};
exports.default = PersonJob;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
