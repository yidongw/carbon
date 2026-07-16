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
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var purchasing_1 = require("~/modules/purchasing");
var path_1 = require("~/utils/path");
var SupplierContactForm = function (_a) {
    var supplierId = _a.supplierId, initialValues = _a.initialValues, _b = _a.open, open = _b === void 0 ? true : _b, _c = _a.type, type = _c === void 0 ? "drawer" : _c, onClose = _a.onClose;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success("Created supplier contact");
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error("Failed to create supplier contact: ".concat(fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, type]);
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var isEditing = !!(initialValues === null || initialValues === void 0 ? void 0 : initialValues.id);
    var isDisabled = isEditing
        ? !permissions.can("update", "purchasing")
        : !permissions.can("create", "purchasing");
    return (<react_1.Drawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={purchasing_1.supplierContactValidator} method="post" action={isEditing
            ? path_1.path.to.supplierContact(supplierId, initialValues.id)
            : path_1.path.to.newSupplierContact(supplierId)} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>{isEditing ? "Edit" : "New"} Contact</react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>
            <Form_1.Hidden name="type" value={type}/>
            <Form_1.Hidden name="contactId"/>
            <react_1.VStack spacing={4}>
              <Form_1.Input name="email" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Email"], ["Email"])))}/>
              <Form_1.Input name="firstName" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["First Name"], ["First Name"])))}/>
              <Form_1.Input name="lastName" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Last Name"], ["Last Name"])))}/>
              <Form_1.Input name="title" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Title"], ["Title"])))}/>
              <Form_1.PhoneInput name="mobilePhone" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Mobile Phone"], ["Mobile Phone"])))}/>
              <Form_1.PhoneInput name="homePhone" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Home Phone"], ["Home Phone"])))}/>
              <Form_1.PhoneInput name="workPhone" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Work Phone"], ["Work Phone"])))}/>
              <Form_1.PhoneInput name="fax" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Fax"], ["Fax"])))}/>
              <Form_1.SupplierLocation name="supplierLocationId" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Location"], ["Location"])))} supplier={supplierId}/>
              <Form_1.TextArea name="notes" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Notes"], ["Notes"])))}/>
              <Form_1.CustomFormFields table="supplierContact"/>
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
exports.default = SupplierContactForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
