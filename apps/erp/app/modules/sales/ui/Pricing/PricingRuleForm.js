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
var lu_1 = require("react-icons/lu");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var sales_models_1 = require("../../sales.models");
var PricingRuleForm = function (_a) {
    var _b, _c;
    var initialValues = _a.initialValues, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var _d = (0, react_2.useState)((_b = initialValues.amountType) !== null && _b !== void 0 ? _b : "Percentage"), amountType = _d[0], setAmountType = _d[1];
    var _e = (0, react_2.useState)(function () {
        if (initialValues.customerIds && initialValues.customerIds.length > 0)
            return "customer";
        if (initialValues.customerTypeIds &&
            initialValues.customerTypeIds.length > 0)
            return "customerType";
        return "all";
    }), customerScope = _e[0], setCustomerScope = _e[1];
    var _f = (0, react_2.useState)(function () {
        if (initialValues.itemIds && initialValues.itemIds.length > 0)
            return "item";
        if (initialValues.itemPostingGroupId)
            return "group";
        return "all";
    }), itemScope = _f[0], setItemScope = _f[1];
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "sales")
        : !permissions.can("create", "sales");
    return (<react_1.ModalDrawerProvider type="drawer">
      <react_1.ModalDrawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={sales_models_1.pricingRuleValidator} method="post" defaultValues={initialValues} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Edit Pricing Rule"], ["Edit Pricing Rule"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["New Pricing Rule"], ["New Pricing Rule"])))}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <react_1.VStack spacing={4}>
                <Form_1.Input name="name" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Name"], ["Name"])))}/>
                <Form_1.Select name="ruleType" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Rule Type"], ["Rule Type"])))} options={sales_models_1.pricingRuleTypes.map(function (rt) { return ({
            label: rt,
            value: rt
        }); })}/>
                <Form_1.Select name="amountType" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Amount Type"], ["Amount Type"])))} options={sales_models_1.pricingRuleAmountTypes.map(function (at) { return ({
            label: at,
            value: at
        }); })} onChange={function (v) {
            if (v)
                setAmountType(v.value);
        }}/>

                {amountType === "Percentage" ? (<Form_1.Number name="amount" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Amount"], ["Amount"])))} minValue={0} maxValue={1} step={0.01} formatOptions={{
                style: "percent",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }}/>) : (<Form_1.Number name="amount" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Amount"], ["Amount"])))} minValue={0} formatOptions={{
                style: "currency",
                currency: (_c = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _c !== void 0 ? _c : "USD"
            }}/>)}

                <Form_1.Boolean name="active" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Active"], ["Active"])))}/>

                <p className="text-sm font-medium text-muted-foreground pt-2">
                  {t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Scope"], ["Scope"])))}
                </p>

                <react_1.ChoiceCardGroup label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Customer Scope"], ["Customer Scope"])))} value={customerScope} onChange={setCustomerScope} options={[
            {
                value: "all",
                title: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["All Customers"], ["All Customers"]))),
                description: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Rule applies to every customer."], ["Rule applies to every customer."]))),
                icon: <lu_1.LuUsersRound />
            },
            {
                value: "customer",
                title: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Specific Customers"], ["Specific Customers"]))),
                description: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Target one or more customers."], ["Target one or more customers."]))),
                icon: <lu_1.LuSquareUser />
            },
            {
                value: "customerType",
                title: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Customer Type"], ["Customer Type"]))),
                description: t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Target customers by type."], ["Target customers by type."]))),
                icon: <lu_1.LuUsers />
            }
        ]}/>

                <ClearArrayField name="customerIds" active={customerScope === "customer"}/>
                <ClearArrayField name="customerTypeIds" active={customerScope === "customerType"}/>

                {customerScope === "customer" && (<Form_1.Customers name="customerIds" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Customers"], ["Customers"])))} placeholder={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Select customers"], ["Select customers"])))}/>)}
                {customerScope === "customerType" && (<Form_1.CustomerTypes name="customerTypeIds" label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Customer Types"], ["Customer Types"])))} placeholder={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Select customer types"], ["Select customer types"])))}/>)}

                <react_1.ChoiceCardGroup label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Item Scope"], ["Item Scope"])))} value={itemScope} onChange={setItemScope} options={[
            {
                value: "all",
                title: t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["All Items"], ["All Items"]))),
                description: t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Rule applies to every item."], ["Rule applies to every item."]))),
                icon: <lu_1.LuLayers />
            },
            {
                value: "item",
                title: t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Specific Items"], ["Specific Items"]))),
                description: t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Target one or more items."], ["Target one or more items."]))),
                icon: <lu_1.LuPackage />
            },
            {
                value: "group",
                title: t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Item Group"], ["Item Group"]))),
                description: t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Target an item group."], ["Target an item group."]))),
                icon: <lu_1.LuBoxes />
            }
        ]}/>

                <ClearArrayField name="itemIds" active={itemScope === "item"}/>

                {itemScope === "item" && (<Form_1.Items name="itemIds" label={t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Items"], ["Items"])))} placeholder={t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Select items"], ["Select items"])))}/>)}
                {itemScope === "group" && (<Form_1.ItemPostingGroup name="itemPostingGroupId" label={t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["Item Group"], ["Item Group"])))}/>)}
                {itemScope !== "group" && (<Form_1.Hidden name="itemPostingGroupId" value=""/>)}

                <p className="text-sm font-medium text-muted-foreground pt-2">
                  {t(templateObject_31 || (templateObject_31 = __makeTemplateObject(["Optional"], ["Optional"])))}
                </p>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <Form_1.DatePicker name="validFrom" label={t(templateObject_32 || (templateObject_32 = __makeTemplateObject(["Valid From"], ["Valid From"])))}/>
                  <Form_1.DatePicker name="validTo" label={t(templateObject_33 || (templateObject_33 = __makeTemplateObject(["Valid To"], ["Valid To"])))}/>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <Form_1.Number name="minQuantity" label={t(templateObject_34 || (templateObject_34 = __makeTemplateObject(["Min Qty"], ["Min Qty"])))}/>
                  <Form_1.Number name="maxQuantity" label={t(templateObject_35 || (templateObject_35 = __makeTemplateObject(["Max Qty"], ["Max Qty"])))}/>
                </div>

                <Form_1.Number name="priority" label={t(templateObject_36 || (templateObject_36 = __makeTemplateObject(["Priority"], ["Priority"])))} helperText={t(templateObject_37 || (templateObject_37 = __makeTemplateObject(["Higher priority wins ties and applies first for markups"], ["Higher priority wins ties and applies first for markups"])))} minValue={0} step={1}/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>Save</Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={onClose}>
                  Cancel
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
/**
 * Clears a controlled array field when it should be inactive.
 * Must be rendered inside a ValidatedForm.
 */
function ClearArrayField(_a) {
    var name = _a.name, active = _a.active;
    var _b = (0, form_1.useControlField)(name), setValue = _b[1];
    (0, react_2.useEffect)(function () {
        if (!active) {
            setValue([]);
        }
    }, [active, setValue]);
    return null;
}
exports.default = PricingRuleForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31, templateObject_32, templateObject_33, templateObject_34, templateObject_35, templateObject_36, templateObject_37;
