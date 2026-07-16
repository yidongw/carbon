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
var sales_models_1 = require("../../sales.models");
var CustomerShippingForm = function (_a) {
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var _b = (0, react_2.useState)(initialValues.shippingCustomerId), customer = _b[0], setCustomer = _b[1];
    var _c = (0, react_2.useState)(initialValues.incoterm || undefined), incoterm = _c[0], setIncoterm = _c[1];
    // const shippingTermOptions =
    //   routeData?.shippingTerms?.map((term) => ({
    //     value: term.id,
    //     label: term.name,
    //   })) ?? [];
    var isDisabled = !permissions.can("update", "sales");
    return (<form_1.ValidatedForm method="post" validator={sales_models_1.customerShippingValidator} defaultValues={initialValues}>
      <react_1.Card>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Shipping</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="customerId"/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
            <Form_1.Customer name="shippingCustomerId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Shipping Customer"], ["Shipping Customer"])))} onChange={function (value) { return setCustomer(value === null || value === void 0 ? void 0 : value.value); }}/>
            <Form_1.CustomerLocation name="shippingCustomerLocationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Shipping Location"], ["Shipping Location"])))} customer={customer}/>
            <Form_1.CustomerContact name="shippingCustomerContactId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Shipping Contact"], ["Shipping Contact"])))} customer={customer}/>

            <Form_1.ShippingMethod name="shippingMethodId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Shipping Method"], ["Shipping Method"])))}/>
            <Form_1.Select name="incoterm" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Incoterm"], ["Incoterm"])))} isClearable options={shared_1.incoterms.map(function (i) { return ({ value: i, label: i }); })} onChange={function (v) { return setIncoterm(v === null || v === void 0 ? void 0 : v.value); }}/>
            {incoterm && (<Form_1.Input name="incotermLocation" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Incoterm Location"], ["Incoterm Location"])))}/>)}
            {/* <Select
          name="shippingTermId"
          label="Shipping Term"
          options={shippingTermOptions}
        /> */}
            <Form_1.CustomFormFields table="customerShipping"/>
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
exports.default = CustomerShippingForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
