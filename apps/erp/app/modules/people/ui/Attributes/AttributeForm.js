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
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var people_models_1 = require("../../people.models");
var AttributeForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues, dataTypes = _a.dataTypes, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var options = (_b = dataTypes === null || dataTypes === void 0 ? void 0 : dataTypes.map(function (dt) { return ({
        value: dt.id.toString(),
        label: dt.label
    }); })) !== null && _b !== void 0 ? _b : [];
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "people")
        : !permissions.can("create", "people");
    var _c = (0, react_2.useState)(initialValues.attributeDataTypeId === shared_1.DataType.List), isList = _c[0], setIsList = _c[1];
    var onChangeCheckForListType = function (selected) {
        setIsList(selected === null ? false : Number(selected.value) === shared_1.DataType.List);
    };
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={people_models_1.attributeValidator} method="post" action={isEditing
            ? path_1.path.to.attribute(initialValues.id)
            : path_1.path.to.newAttribute} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? (<macro_1.Trans>Edit Attribute</macro_1.Trans>) : (<macro_1.Trans>New Attribute</macro_1.Trans>)}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>
            <react_1.VStack spacing={4}>
              <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"])))}/>
              <Form_1.Hidden name="userAttributeCategoryId"/>

              <Form_1.Select name="attributeDataTypeId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Data Type"], ["Data Type"])))} isReadOnly={isEditing} helperText={isEditing ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Data type cannot be changed"], ["Data type cannot be changed"]))) : undefined} options={options} onChange={onChangeCheckForListType}/>
              {isList && <Form_1.Array name="listOptions" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["List Options"], ["List Options"])))}/>}
              <Form_1.Boolean name="canSelfManage" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Self Managed"], ["Self Managed"])))} description={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Users can update this value for themselves"], ["Users can update this value for themselves"])))}/>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <react_1.Button size="md" variant="solid" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <Form_1.Submit withBlocker={false} isDisabled={isDisabled}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = AttributeForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
