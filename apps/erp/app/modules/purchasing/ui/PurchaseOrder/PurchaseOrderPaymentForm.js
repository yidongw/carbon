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
var PurchaseOrderPaymentForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues;
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId) {
        throw new Error("orderId not found");
    }
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.purchaseOrder(orderId));
    var isLocked = (0, purchasing_1.isPurchaseOrderLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _b === void 0 ? void 0 : _b.status);
    var fetcher = (0, react_router_1.useFetcher)();
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var _c = (0, react_2.useState)(initialValues.invoiceSupplierId), supplier = _c[0], setSupplier = _c[1];
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" action={path_1.path.to.purchaseOrderPayment(orderId)} validator={purchasing_1.purchaseOrderPaymentValidator} defaultValues={initialValues} fetcher={fetcher} isDisabled={isLocked}>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Payment</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="id"/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
            <Form_1.Supplier name="invoiceSupplierId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Invoice Supplier"], ["Invoice Supplier"])))} onChange={function (value) { return setSupplier(value === null || value === void 0 ? void 0 : value.value); }}/>
            <Form_1.SupplierLocation name="invoiceSupplierLocationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Invoice Location"], ["Invoice Location"])))} supplier={supplier}/>
            <Form_1.SupplierContact name="invoiceSupplierContactId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Invoice Contact"], ["Invoice Contact"])))} supplier={supplier}/>

            <Form_1.PaymentTerm name="paymentTermId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Payment Terms"], ["Payment Terms"])))}/>

            <Form_1.CustomFormFields table="purchaseOrderPayment"/>
          </div>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={!permissions.can("update", "purchasing")}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
};
exports.default = PurchaseOrderPaymentForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
