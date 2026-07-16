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
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
var ItemReorderPolicy_1 = require("./ItemReorderPolicy");
var ItemPlanningForm = function (_a) {
    var initialValues = _a.initialValues, locations = _a.locations, type = _a.type;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var locationOptions = locations.map(function (location) { return ({
        label: location.name,
        value: location.id
    }); });
    var _b = (0, react_2.useState)(initialValues.reorderingPolicy), policy = _b[0], setPolicy = _b[1];
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" validator={items_models_1.itemPlanningValidator} defaultValues={initialValues}>
        <react_1.HStack className="w-full justify-between items-start">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Planning</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardAction>
            <react_1.Combobox size="sm" value={initialValues.locationId} options={locationOptions} onChange={function (selected) {
            // hard refresh because initialValues update has no effect otherwise
            window.location.href = window.location.href = getLocationPath(initialValues.itemId, selected, type);
        }}/>
          </react_1.CardAction>
        </react_1.HStack>
        <react_1.CardContent>
          <Form_1.Hidden name="itemId"/>
          <Form_1.Hidden name="locationId"/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
            <Form_1.Select name="reorderingPolicy" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Reordering Policy"], ["Reordering Policy"])))} options={items_models_1.itemReorderingPolicies.map(function (policy) { return ({
            label: <ItemReorderPolicy_1.ItemReorderPolicy reorderingPolicy={policy}/>,
            value: policy
        }); })} onChange={function (selected) {
            // @ts-ignore
            setPolicy((selected === null || selected === void 0 ? void 0 : selected.value) || "Manual Reorder");
        }}/>
            {policy === "Maximum Quantity" && (<>
                <Form_1.Number name="reorderPoint" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Reorder Point"], ["Reorder Point"])))} minValue={0}/>
                <Form_1.Number name="maximumInventoryQuantity" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Maximum Inventory Quantity"], ["Maximum Inventory Quantity"])))} minValue={0}/>
              </>)}

            {policy === "Demand-Based Reorder" && (<>
                <Form_1.Number name="demandAccumulationPeriod" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Accumulation Period (Weeks)"], ["Accumulation Period (Weeks)"])))} minValue={0}/>
                <Form_1.Number name="demandAccumulationSafetyStock" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Safety Stock"], ["Safety Stock"])))} minValue={0}/>
              </>)}
            {policy === "Fixed Reorder Quantity" && (<>
                <Form_1.Number name="reorderPoint" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Reorder Point"], ["Reorder Point"])))} minValue={0}/>
                <Form_1.Number name="reorderQuantity" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Reorder Quantity"], ["Reorder Quantity"])))} minValue={0}/>
              </>)}
            {policy !== "Fixed Reorder Quantity" && (<>
                <Form_1.Number name="orderMultiple" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Order Multiple"], ["Order Multiple"])))} minValue={0}/>
                <Form_1.Number name="minimumOrderQuantity" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Minimum Order Quantity"], ["Minimum Order Quantity"])))} minValue={0}/>
                <Form_1.Number name="maximumOrderQuantity" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Maximum Order Quantity"], ["Maximum Order Quantity"])))} minValue={0}/>
              </>)}
            {/* <Boolean name="critical" label={t`Critical`} /> */}

            <Form_1.CustomFormFields table="itemPlanning"/>
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
exports.default = ItemPlanningForm;
function getLocationPath(itemId, locationId, type) {
    switch (type) {
        case "Part":
            return "".concat(path_1.path.to.partPlanning(itemId), "?location=").concat(locationId);
        case "Material":
            return "".concat(path_1.path.to.materialPlanning(itemId), "?location=").concat(locationId);
        case "Tool":
            return "".concat(path_1.path.to.toolPlanning(itemId), "?location=").concat(locationId);
        case "Consumable":
            return "".concat(path_1.path.to.consumablePlanning(itemId), "?location=").concat(locationId);
        case "Style":
            return "".concat(path_1.path.to.stylePlanning(itemId), "?location=").concat(locationId);
        default:
            throw new Error("Invalid item type: ".concat(type));
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
