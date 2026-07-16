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
var QuotePaymentForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var _c = (0, react_2.useState)(initialValues.invoiceCustomerId), customer = _c[0], setCustomer = _c[1];
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("quoteId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var isLocked = (0, sales_models_1.isQuoteLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _b === void 0 ? void 0 : _b.status);
    var isEditable = !isLocked;
    var isDisabled = !isEditable || !permissions.can("update", "sales");
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" action={path_1.path.to.quotePayment(initialValues.id)} validator={sales_models_1.quotePaymentValidator} defaultValues={initialValues} fetcher={fetcher} isDisabled={isLocked}>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Payment</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="id"/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
            <Form_1.Customer name="invoiceCustomerId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Invoice Customer"], ["Invoice Customer"])))} onChange={function (value) { return setCustomer(value === null || value === void 0 ? void 0 : value.value); }}/>
            <Form_1.CustomerLocation name="invoiceCustomerLocationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Invoice Location"], ["Invoice Location"])))} customer={customer}/>
            <Form_1.CustomerContact name="invoiceCustomerContactId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Invoice Contact"], ["Invoice Contact"])))} customer={customer}/>

            <Form_1.PaymentTerm name="paymentTermId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Payment Term"], ["Payment Term"])))}/>
          </div>
        </react_1.CardContent>
        <react_1.CardFooter>
          <react_1.HStack>
            <Form_1.Submit isDisabled={isDisabled}>
              <macro_1.Trans>Save</macro_1.Trans>
            </Form_1.Submit>
          </react_1.HStack>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
};
exports.default = QuotePaymentForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
