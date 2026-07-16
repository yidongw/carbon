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
var useAsyncFetcher_1 = require("~/hooks/useAsyncFetcher");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var CustomerContactForm = function (_a) {
    var customerId = _a.customerId, initialValues = _a.initialValues, _b = _a.open, open = _b === void 0 ? true : _b, _c = _a.type, type = _c === void 0 ? "drawer" : _c, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var tShared = (0, macro_1.useLingui)().t;
    var fetcher = (0, useAsyncFetcher_1.useAsyncFetcher)({
        onStateChange: function (state) {
            if (state === "idle" && fetcher.data && !fetcher.data.success) {
                react_1.toast.error(fetcher.data.message);
            }
        }
    });
    var permissions = (0, hooks_1.usePermissions)();
    var isEditing = !!(initialValues === null || initialValues === void 0 ? void 0 : initialValues.id);
    var isDisabled = isEditing
        ? !permissions.can("update", "sales")
        : !permissions.can("create", "sales");
    return (<react_1.Drawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={sales_models_1.customerContactValidator} method="post" action={isEditing
            ? path_1.path.to.customerContact(customerId, initialValues.id)
            : path_1.path.to.newCustomerContact(customerId)} defaultValues={initialValues} 
    // @ts-expect-error TODO: ValidatedForm types doesn't yet support useAsyncFetcher - @sidwebworks
    fetcher={fetcher} className="flex flex-col h-full" onAfterSubmit={function () {
            if (type === "modal") {
                onClose === null || onClose === void 0 ? void 0 : onClose();
            }
        }}>
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? <macro_1.Trans>Edit</macro_1.Trans> : <macro_1.Trans>New</macro_1.Trans>}{" "}
              <macro_1.Trans>Contact</macro_1.Trans>
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>
            <Form_1.Hidden name="type" value={type}/>
            <Form_1.Hidden name="contactId"/>
            <react_1.VStack spacing={4}>
              <Form_1.Input name="email" label={tShared(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Email"], ["Email"])))}/>
              <Form_1.Input name="firstName" label={tShared(templateObject_2 || (templateObject_2 = __makeTemplateObject(["First Name"], ["First Name"])))}/>
              <Form_1.Input name="lastName" label={tShared(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Last Name"], ["Last Name"])))}/>
              <Form_1.Input name="title" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Title"], ["Title"])))}/>
              <Form_1.PhoneInput name="mobilePhone" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Mobile Phone"], ["Mobile Phone"])))}/>
              <Form_1.PhoneInput name="homePhone" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Home Phone"], ["Home Phone"])))}/>
              <Form_1.PhoneInput name="workPhone" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Work Phone"], ["Work Phone"])))}/>
              <Form_1.PhoneInput name="fax" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Fax"], ["Fax"])))}/>
              <Form_1.CustomerLocation name="customerLocationId" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Location"], ["Location"])))} customer={customerId}/>
              <Form_1.TextArea name="notes" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Notes"], ["Notes"])))}/>
              <Form_1.CustomFormFields table="customerContact"/>
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
exports.default = CustomerContactForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
