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
var PaymentTerm_1 = require("~/components/Form/PaymentTerm");
var hooks_1 = require("~/hooks");
var sales_models_1 = require("../../sales.models");
var CustomerPaymentForm = function (_a) {
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var _b = (0, react_2.useState)(initialValues.invoiceCustomerId), customer = _b[0], setCustomer = _b[1];
    var isDisabled = !permissions.can("update", "sales");
    return (<form_1.ValidatedForm method="post" validator={sales_models_1.customerPaymentValidator} defaultValues={initialValues}>
      <react_1.Card>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Payment Terms</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="customerId"/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
            <Form_1.Customer name="invoiceCustomerId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Invoice Customer"], ["Invoice Customer"])))} onChange={function (value) { return setCustomer(value === null || value === void 0 ? void 0 : value.value); }}/>
            <Form_1.CustomerLocation name="invoiceCustomerLocationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Invoice Location"], ["Invoice Location"])))} customer={customer}/>
            <Form_1.CustomerContact name="invoiceCustomerContactId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Invoice Contact"], ["Invoice Contact"])))} customer={customer}/>

            <PaymentTerm_1.default name="paymentTermId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Payment Term"], ["Payment Term"])))}/>
            <Form_1.CustomFormFields table="customerPayment"/>
          </div>
        </react_1.CardContent>
        <react_1.CardFooter>
          <react_1.HStack>
            <Form_1.Submit isDisabled={isDisabled}>
              <macro_1.Trans>Save</macro_1.Trans>
            </Form_1.Submit>
          </react_1.HStack>
        </react_1.CardFooter>
      </react_1.Card>
    </form_1.ValidatedForm>);
};
exports.default = CustomerPaymentForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
