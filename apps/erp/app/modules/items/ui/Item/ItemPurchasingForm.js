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
var suppliers_1 = require("~/stores/suppliers");
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
var ItemPurchasingForm = function (_a) {
    var _b, _c;
    var initialValues = _a.initialValues, allowedSuppliers = _a.allowedSuppliers;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId)
        throw new Error("itemId not found");
    var suppliers = (0, suppliers_1.useSuppliers)()[0];
    var allowedSuppliersOptions = suppliers === null || suppliers === void 0 ? void 0 : suppliers.reduce(function (acc, supplier) {
        if (allowedSuppliers === null || allowedSuppliers === void 0 ? void 0 : allowedSuppliers.includes(supplier.id)) {
            acc.push({
                label: supplier.name,
                value: supplier.id
            });
        }
        return acc;
    }, []);
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.part(itemId));
    var inventoryCode = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.partSummary) === null || _b === void 0 ? void 0 : _b.unitOfMeasureCode;
    var _d = (0, react_2.useState)((_c = initialValues.purchasingUnitOfMeasureCode) !== null && _c !== void 0 ? _c : null), purchasingCode = _d[0], setPurchasingCode = _d[1];
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" validator={items_models_1.itemPurchasingValidator} defaultValues={initialValues}>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Purchasing</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="itemId"/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
            <form_1.Select name="preferredSupplierId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Preferred Supplier"], ["Preferred Supplier"])))} options={allowedSuppliersOptions} emptyMessage={<div className="flex flex-col items-center justify-center py-5 px-4 text-center">
                  <p className="text-sm font-medium text-foreground mb-1">
                    <macro_1.Trans>No suppliers yet</macro_1.Trans>
                  </p>
                  <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
                    <macro_1.Trans>
                      <react_router_1.Link to="new" className="text-primary font-medium underline decoration-dashed underline-offset-4 hover:decoration-solid">
                        Add a supplier part
                      </react_router_1.Link>{" "}
                      for this item to set a preferred supplier.
                    </macro_1.Trans>
                  </p>
                </div>}/>
            <Form_1.Number name="leadTime" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Lead Time (Days)"], ["Lead Time (Days)"])))}/>
            <Form_1.UnitOfMeasure name="purchasingUnitOfMeasureCode" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Purchasing Unit of Measure"], ["Purchasing Unit of Measure"])))} onChange={function (newValue) {
            if (newValue)
                setPurchasingCode(newValue.value);
        }}/>
            <Form_1.ConversionFactor name="conversionFactor" isReadOnly={!purchasingCode || !inventoryCode} purchasingCode={purchasingCode !== null && purchasingCode !== void 0 ? purchasingCode : undefined} inventoryCode={inventoryCode !== null && inventoryCode !== void 0 ? inventoryCode : undefined}/>
            {/* <Boolean name="purchasingBlocked" label={t`Purchasing Blocked`} /> */}
          </div>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={!permissions.can("update", "parts")}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
};
exports.default = ItemPurchasingForm;
var templateObject_1, templateObject_2, templateObject_3;
