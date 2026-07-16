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
var items_models_1 = require("../../items.models");
var ItemSalePriceForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var company = (0, hooks_1.useUser)().company;
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" validator={items_models_1.itemUnitSalePriceValidator} defaultValues={initialValues}>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Sale Price</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="itemId"/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
            <Form_1.Number name="unitSalePrice" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Unit Sale Price"], ["Unit Sale Price"])))} minValue={0} formatOptions={{
            style: "currency",
            currency: (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD"
        }}/>
            {/* <Currency
          name="currencyCode"
          label={t`Currency`}
          onChange={(newValue) => {
            if (newValue) setCurrency(newValue?.value);
          }}
        />

        <UnitOfMeasure
          name="salesUnitOfMeasureCode"
          label={t`Sales Unit of Measure`}
        />

        <Boolean name="salesBlocked" label={t`Sales Blocked`} />
        <Boolean name="priceIncludesTax" label={t`Price Includes Tax`} />
        <Boolean
          name="allowInvoiceDiscount"
          label={t`Allow Invoice Discount`}
        /> */}
            <Form_1.CustomFormFields table="partUnitSalePrice"/>
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
exports.default = ItemSalePriceForm;
var templateObject_1;
