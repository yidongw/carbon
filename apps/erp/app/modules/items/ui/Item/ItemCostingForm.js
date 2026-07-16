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
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var items_1 = require("~/stores/items");
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
var ItemCostingForm = function (_a) {
    var _b, _c;
    var initialValues = _a.initialValues;
    var items = (0, items_1.useItems)()[0];
    var item = items.find(function (item) { return item.id === initialValues.itemId; });
    var replenishmentSystem = (_b = item === null || item === void 0 ? void 0 : item.replenishmentSystem) !== null && _b !== void 0 ? _b : "Buy";
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_c = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _c !== void 0 ? _c : "USD";
    var recalculateModal = (0, react_1.useDisclosure)();
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" validator={items_models_1.itemCostValidator} defaultValues={initialValues} key={"".concat(initialValues.itemId, "-").concat(initialValues.unitCost)}>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Costing & Posting</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="itemId"/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full items-start">
            <Form_1.ItemPostingGroup name="itemPostingGroupId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Item Group"], ["Item Group"])))} helperText={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Used to categorize items for reporting and analysis"], ["Used to categorize items for reporting and analysis"])))} isClearable/>
            <Form_1.Select name="costingMethod" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Costing Method"], ["Costing Method"])))} options={items_models_1.itemCostingMethods.map(function (method) { return ({
            label: method,
            value: method
        }); })}/>

            <Form_1.Number name="unitCost" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Unit Cost"], ["Unit Cost"])))} formatOptions={{
            style: "currency",
            currency: baseCurrency
        }} helperText={replenishmentSystem === "Make"
            ? undefined
            : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Weighted average cost over last year calculated when the invoice is posted"], ["Weighted average cost over last year calculated when the invoice is posted"])))}/>

            {/* <Boolean name="costIsAdjusted" label={t`Cost Is Adjusted`} /> */}
            <Form_1.CustomFormFields table="partCost"/>
          </div>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={!permissions.can("update", "parts")}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
          {replenishmentSystem === "Make" && (<react_1.Button variant="secondary" onClick={recalculateModal.onOpen}>
              <macro_1.Trans>Recalculate</macro_1.Trans>
            </react_1.Button>)}
        </react_1.CardFooter>
      </form_1.ValidatedForm>
      {recalculateModal.isOpen && (<Modals_1.Confirm action={path_1.path.to.api.itemCostRecalculate(initialValues.itemId)} title={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Recalculate Unit Cost"], ["Recalculate Unit Cost"])))} text={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["This will recalculate the unit cost from the active make method's bill of materials and processes using the batch size. The current cost will be overwritten. Do you want to continue?"], ["This will recalculate the unit cost from the active make method's bill of materials and processes using the batch size. The current cost will be overwritten. Do you want to continue?"])))} confirmText={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Recalculate"], ["Recalculate"])))} isOpen={recalculateModal.isOpen} onCancel={recalculateModal.onClose} onSubmit={recalculateModal.onClose}/>)}
    </react_1.Card>);
};
exports.default = ItemCostingForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
