"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InspectionDocumentForm;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var Form_1 = require("~/components/Form");
var quality_models_1 = require("~/modules/quality/quality.models");
var path_1 = require("~/utils/path");
function InspectionDocumentForm(_a) {
    var initialValues = _a.initialValues, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var isEditing = Boolean(initialValues.id);
    return (<react_1.Drawer open onOpenChange={function (open) { return !open && onClose(); }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={quality_models_1.inspectionDocumentValidator} method="post" action={isEditing
            ? path_1.path.to.inspectionDocument(initialValues.id)
            : path_1.path.to.newInspectionDocument} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing
            ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Edit Inspection Document"], ["Edit Inspection Document"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["New Inspection Document"], ["New Inspection Document"])))}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <react_1.VStack spacing={4}>
              {isEditing && <Form_1.Hidden name="id"/>}
              <Form_1.Item name="partId" type="Part"/>
              <Form_1.Input name="drawingNumber" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Drawing Number"], ["Drawing Number"])))} placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["e.g. DWG-1234"], ["e.g. DWG-1234"])))}/>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.Button variant="ghost" onClick={onClose}>
              {t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Cancel"], ["Cancel"])))}
            </react_1.Button>
            <Form_1.Submit>{isEditing ? t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Save"], ["Save"]))) : t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Create"], ["Create"])))}</Form_1.Submit>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
