"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var items_1 = require("~/modules/items");
var path_1 = require("~/utils/path");
var TemplateForm = function (_a) {
    var initialValues = _a.initialValues, _b = _a.open, open = _b === void 0 ? true : _b, _c = _a.type, type = _c === void 0 ? "drawer" : _c, onClose = _a.onClose;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open={open} onOpenChange={function (nextOpen) {
            if (!nextOpen)
                onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={items_1.templateCreateValidator} method="post" action={"".concat(path_1.path.to.templates, "/new")} defaultValues={initialValues} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>{t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["New Template"], ["New Template"])))}</react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="type" value={type}/>
              <react_1.VStack spacing={4}>
                <Form_1.Input name="name" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Name"], ["Name"])))}/>
                <Form_1.TextArea name="description" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Description"], ["Description"])))}/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={!permissions.can("create", "parts")}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={onClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = TemplateForm;
var templateObject_1, templateObject_2, templateObject_3;
