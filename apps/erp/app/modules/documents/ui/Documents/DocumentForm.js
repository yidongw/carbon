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
var documents_1 = require("~/modules/documents");
var path_1 = require("~/utils/path");
var DocumentForm = function (_a) {
    var initialValues = _a.initialValues, ownerId = _a.ownerId;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(-1); };
    var isDisabled = !permissions.can("update", "documents");
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={documents_1.documentValidator} method="post" action={path_1.path.to.document(initialValues.id)} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>{"".concat(initialValues.name, ".").concat(initialValues.extension)}</react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>
            <Form_1.Hidden name="extension"/>
            <Form_1.Hidden name="type"/>
            <Form_1.Hidden name="size"/>
            <react_1.VStack spacing={4}>
              <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"])))} suffix={".".concat(initialValues.extension)}/>
              <Form_1.TextArea name="description" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Description"], ["Description"])))}/>
              <Form_1.Users alwaysSelected={[ownerId]} name="readGroups" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["View Permissions"], ["View Permissions"])))}/>
              <Form_1.Users alwaysSelected={[ownerId]} name="writeGroups" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Edit Permissions"], ["Edit Permissions"])))}/>
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
exports.default = DocumentForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
