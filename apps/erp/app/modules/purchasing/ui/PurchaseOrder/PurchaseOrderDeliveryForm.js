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
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var PurchaseOrderDeliveryForm = (0, react_2.forwardRef)(function (_a, ref) {
    var _b, _c;
    var initialValues = _a.initialValues, currencyCode = _a.currencyCode, _d = _a.defaultCollapsed, defaultCollapsed = _d === void 0 ? false : _d;
    var orderId = (0, react_router_1.useParams)().orderId;
    if (!orderId) {
        throw new Error("orderId not found");
    }
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.purchaseOrder(orderId));
    var isLocked = (0, purchasing_1.isPurchaseOrderLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.purchaseOrder) === null || _b === void 0 ? void 0 : _b.status);
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var _e = (0, react_2.useState)((_c = initialValues.dropShipment) !== null && _c !== void 0 ? _c : false), dropShip = _e[0], setDropShip = _e[1];
    var _f = (0, react_2.useState)(initialValues.customerId), customer = _f[0], setCustomer = _f[1];
    var _g = (0, react_2.useState)(defaultCollapsed), isCollapsed = _g[0], setIsCollapsed = _g[1];
    var _h = (0, react_2.useState)(initialValues.incoterm || undefined), incoterm = _h[0], setIncoterm = _h[1];
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
    var isSupplier = permissions.is("supplier");
    return (<react_1.Card ref={cardRef} isCollapsible defaultCollapsed={defaultCollapsed} isCollapsed={isCollapsed} onCollapsedChange={setIsCollapsed}>
      <form_1.ValidatedForm method="post" action={path_1.path.to.purchaseOrderDelivery(orderId)} validator={purchasing_1.purchaseOrderDeliveryValidator} defaultValues={initialValues} fetcher={fetcher} isDisabled={isLocked}>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Shipping</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="id"/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
            <Form_1.Number name="supplierShippingCost" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Shipping Cost"], ["Shipping Cost"])))} minValue={0} formatOptions={{
            style: "currency",
            currency: currencyCode
        }} ref={shippingCostRef}/>
            <Form_1.Location name="locationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Delivery Location"], ["Delivery Location"])))} isReadOnly={isSupplier} isClearable/>
            <Form_1.ShippingMethod name="shippingMethodId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Shipping Method"], ["Shipping Method"])))}/>
            <Form_1.Select name="incoterm" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Incoterm"], ["Incoterm"])))} isClearable options={shared_1.incoterms.map(function (i) { return ({ value: i, label: i }); })} onChange={function (v) { return setIncoterm(v === null || v === void 0 ? void 0 : v.value); }}/>
            {incoterm && (<Form_1.Input name="incotermLocation" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Incoterm Location"], ["Incoterm Location"])))}/>)}

            <Form_1.DatePicker name="receiptRequestedDate" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Requested Date"], ["Requested Date"])))}/>
            <Form_1.DatePicker name="receiptPromisedDate" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Promised Date"], ["Promised Date"])))}/>
            <Form_1.DatePicker name="deliveryDate" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Delivery Date"], ["Delivery Date"])))}/>

            <Form_1.Input name="trackingNumber" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Tracking Number"], ["Tracking Number"])))}/>
            <div className="col-span-3">
              <Form_1.Boolean name="dropShipment" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Drop Shipment"], ["Drop Shipment"])))} bordered onChange={setDropShip}/>
            </div>
            {dropShip && (<>
                <Form_1.Customer name="customerId" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Customer"], ["Customer"])))} onChange={function (value) { return setCustomer(value === null || value === void 0 ? void 0 : value.value); }}/>
                <Form_1.CustomerLocation name="customerLocationId" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Location"], ["Location"])))} customer={customer}/>
              </>)}
            <Form_1.CustomFormFields table="purchaseOrderDelivery"/>
          </div>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={!permissions.can("update", "purchasing")}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
});
PurchaseOrderDeliveryForm.displayName = "PurchaseOrderDeliveryForm";
exports.default = PurchaseOrderDeliveryForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
