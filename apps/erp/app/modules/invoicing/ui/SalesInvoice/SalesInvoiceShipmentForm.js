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
var invoicing_1 = require("~/modules/invoicing");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var invoicing_models_1 = require("../../invoicing.models");
var SalesInvoiceShipmentForm = (0, react_2.forwardRef)(function (_a, ref) {
    var _b;
    var initialValues = _a.initialValues, currencyCode = _a.currencyCode, _c = _a.defaultCollapsed, defaultCollapsed = _c === void 0 ? false : _c;
    var t = (0, macro_1.useLingui)().t;
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    if (!invoiceId) {
        throw new Error("invoiceId not found");
    }
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.salesInvoice(invoiceId));
    var isLocked = (0, invoicing_models_1.isSalesInvoiceLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.salesInvoice) === null || _b === void 0 ? void 0 : _b.status);
    var isEditable = !isLocked;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var _d = (0, react_2.useState)(defaultCollapsed), isCollapsed = _d[0], setIsCollapsed = _d[1];
    var _e = (0, react_2.useState)(initialValues.incoterm || undefined), incoterm = _e[0], setIncoterm = _e[1];
    var shippingCostRef = (0, react_2.useRef)(null);
    var cardRef = (0, react_2.useRef)(null);
    (0, react_2.useImperativeHandle)(ref, function () { return ({
        focusShippingCost: function () {
            setIsCollapsed(false);
            setTimeout(function () {
                var _a, _b;
                (_a = cardRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
                (_b = shippingCostRef.current) === null || _b === void 0 ? void 0 : _b.focus();
            }, 100);
        }
    }); });
    var isCustomer = permissions.is("customer");
    return (<react_1.Card ref={cardRef} isCollapsible defaultCollapsed={defaultCollapsed} isCollapsed={isCollapsed} onCollapsedChange={setIsCollapsed}>
      <form_1.ValidatedForm method="post" action={path_1.path.to.salesInvoiceShipment(invoiceId)} validator={invoicing_1.salesInvoiceShipmentValidator} defaultValues={initialValues} fetcher={fetcher} isDisabled={isLocked}>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Shipping</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="id"/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
            <Form_1.Number name="shippingCost" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Shipping Cost"], ["Shipping Cost"])))} minValue={0} formatOptions={{
            style: "currency",
            currency: currencyCode
        }} ref={shippingCostRef}/>
            <Form_1.Location name="locationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Shipment Location"], ["Shipment Location"])))} isReadOnly={isCustomer} isClearable/>
            <Form_1.ShippingMethod name="shippingMethodId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Shipping Method"], ["Shipping Method"])))}/>
            <Form_1.Select name="incoterm" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Incoterm"], ["Incoterm"])))} isClearable options={shared_1.incoterms.map(function (i) { return ({ value: i, label: i }); })} onChange={function (v) { return setIncoterm(v === null || v === void 0 ? void 0 : v.value); }}/>
            {incoterm && (<Form_1.Input name="incotermLocation" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Incoterm Location"], ["Incoterm Location"])))}/>)}
            <Form_1.CustomFormFields table="salesInvoiceShipment"/>
          </div>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={!permissions.can("update", "invoicing") || !isEditable}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
});
SalesInvoiceShipmentForm.displayName = "SalesInvoiceShipmentForm";
exports.default = SalesInvoiceShipmentForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
