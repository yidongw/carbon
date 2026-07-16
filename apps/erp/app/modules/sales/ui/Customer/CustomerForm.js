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
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var CustomerForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues, _c = _a.type, type = _c === void 0 ? "card" : _c, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var companySettings = (0, hooks_1.useCompanySettings)();
    var showCustomerReadableId = (_b = companySettings === null || companySettings === void 0 ? void 0 : companySettings.showCustomerReadableId) !== null && _b !== void 0 ? _b : false;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b, _c;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            var createdCustomer = Array.isArray(fetcher.data.data)
                ? fetcher.data.data[0]
                : fetcher.data.data;
            react_1.toast.success(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Created customer: ", ""], ["Created customer: ", ""])), (_b = createdCustomer === null || createdCustomer === void 0 ? void 0 : createdCustomer.name) !== null && _b !== void 0 ? _b : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Customer"], ["Customer"])))));
        }
        else if (fetcher.state === "idle" && ((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.error)) {
            react_1.toast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to create customer: ", ""], ["Failed to create customer: ", ""])), fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, t, type]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "sales")
        : !permissions.can("create", "sales");
    return (<div>
      <react_1.ModalCardProvider type={type}>
        <react_1.ModalCard onClose={onClose}>
          <react_1.ModalCardContent size="medium">
            <form_1.ValidatedForm method="post" action={isEditing ? undefined : path_1.path.to.newCustomer} validator={sales_models_1.customerValidator} defaultValues={initialValues} fetcher={fetcher}>
              <react_1.ModalCardHeader>
                <react_1.ModalCardTitle>
                  {isEditing ? (<macro_1.Trans>Customer Overview</macro_1.Trans>) : (<macro_1.Trans>New Customer</macro_1.Trans>)}
                </react_1.ModalCardTitle>
                {!isEditing && (<react_1.ModalCardDescription>
                    <macro_1.Trans>
                      A customer is a business or person who buys your parts or
                      services.
                    </macro_1.Trans>
                  </react_1.ModalCardDescription>)}
              </react_1.ModalCardHeader>
              <react_1.ModalCardBody>
                <Form_1.Hidden name="id"/>
                <Form_1.Hidden name="type" value={type}/>
                <div className={(0, react_1.cn)("grid w-full gap-x-8 gap-y-4", type === "modal"
            ? "grid-cols-1"
            : isEditing
                ? "grid-cols-1 lg:grid-cols-3"
                : "grid-cols-1 md:grid-cols-2")}>
                  {showCustomerReadableId &&
            (isEditing ? (<Form_1.Input name="readableId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Customer ID"], ["Customer ID"])))} isReadOnly helperText={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Customer ID cannot be changed after creation"], ["Customer ID cannot be changed after creation"])))}/>) : (<Form_1.SequenceOrCustomId name="readableId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Customer ID"], ["Customer ID"])))} table="customer"/>))}
                  <Form_1.Input name="name" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Name"], ["Name"])))} autoFocus={!isEditing}/>

                  <Form_1.CustomerStatus name="customerStatusId" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Customer Status"], ["Customer Status"])))} placeholder={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Select Customer Status"], ["Select Customer Status"])))}/>
                  <Form_1.CustomerType name="customerTypeId" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Customer Type"], ["Customer Type"])))} placeholder={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Select Customer Type"], ["Select Customer Type"])))}/>
                  <Form_1.Employee name="accountManagerId" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Account Manager"], ["Account Manager"])))}/>
                  {isEditing && (<>
                      <Form_1.CustomerContact customer={initialValues.id} name="salesContactId" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Sales Contact"], ["Sales Contact"])))}/>
                    </>)}
                  <Form_1.Currency name="currencyCode" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Currency"], ["Currency"])))}/>

                  <Form_1.Number name="taxPercent" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Tax Percent"], ["Tax Percent"])))} minValue={0} maxValue={1} step={0.0001} formatOptions={{
            style: "percent",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }}/>

                  <Form_1.Input name="website" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Website"], ["Website"])))}/>

                  {/* <EmailRecipients name="defaultCc" label="Default CC" /> */}
                  <Form_1.CustomFormFields table="customer"/>
                </div>
              </react_1.ModalCardBody>
              <react_1.ModalCardFooter>
                <react_1.HStack>
                  <Form_1.Submit isDisabled={isDisabled}>
                    <macro_1.Trans>Save</macro_1.Trans>
                  </Form_1.Submit>
                </react_1.HStack>
              </react_1.ModalCardFooter>
            </form_1.ValidatedForm>
          </react_1.ModalCardContent>
        </react_1.ModalCard>
      </react_1.ModalCardProvider>
    </div>);
};
exports.default = CustomerForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16;
