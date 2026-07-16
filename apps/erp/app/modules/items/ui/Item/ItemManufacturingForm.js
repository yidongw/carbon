"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var items_models_1 = require("../../items.models");
var ItemManufacturingForm = function (_a) {
    var initialValues = _a.initialValues, _b = _a.withConfiguration, withConfiguration = _b === void 0 ? true : _b;
    var fetcher = (0, react_router_1.useFetcher)();
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId)
        throw new Error("Could not find itemId");
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" validator={items_models_1.itemManufacturingValidator} defaultValues={initialValues} fetcher={fetcher}>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Manufacturing</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="intent" value="manufacturing"/>
          <Form_1.Hidden name="itemId"/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
            <Form_1.Number name="lotSize" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Batch Size"], ["Batch Size"])))}/>
            <Form_1.Number name="scrapPercentage" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Scrap Percent"], ["Scrap Percent"])))} formatOptions={{
            style: "percent"
        }}/>
            <Form_1.Number name="leadTime" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Lead Time (Days)"], ["Lead Time (Days)"])))}/>
            {/* <Boolean
          name="manufacturingBlocked"
          label={t`Manufacturing Blocked`}
        /> */}

            {withConfiguration && (<Form_1.Boolean name="requiresConfiguration" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Configured"], ["Configured"])))} bordered description={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Part is configured for manufacturing"], ["Part is configured for manufacturing"])))} className="col-span-3"/>)}
            <Form_1.CustomFormFields table="partReplenishment"/>
          </div>
        </react_1.CardContent>
        <react_1.CardFooter className="flex justify-between">
          <Form_1.Submit withBlocker={false} isDisabled={!permissions.can("update", "parts")}>
            Save
          </Form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
};
exports.default = ItemManufacturingForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
