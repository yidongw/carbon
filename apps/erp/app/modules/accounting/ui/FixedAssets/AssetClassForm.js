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
var accounting_models_1 = require("../../accounting.models");
var accounting_utils_1 = require("../../accounting.utils");
var AssetClassForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues, taxDepreciationEnabled = _a.taxDepreciationEnabled, _c = _a.type, type = _c === void 0 ? "drawer" : _c, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success("Created asset class");
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error("Failed to create asset class: ".concat(fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, type]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "accounting")
        : !permissions.can("create", "accounting");
    var _d = (0, react_2.useState)((_b = initialValues.taxDepreciationMethod) !== null && _b !== void 0 ? _b : ""), taxMethod = _d[0], setTaxMethod = _d[1];
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={accounting_models_1.fixedAssetClassValidator} method="post" action={isEditing
            ? path_1.path.to.assetClass(initialValues.id)
            : path_1.path.to.newAssetClass} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? "Edit" : "New"} Asset Class
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="type" value={type}/>
              <react_1.VStack spacing={4}>
                <Form_1.Input name="name" label="Name"/>
                <Form_1.Input name="description" label="Description"/>
                <Form_1.Select name="depreciationMethod" label="Depreciation Method" options={accounting_models_1.depreciationMethods.map(function (m) { return ({
            label: m,
            value: m
        }); })}/>
                <Form_1.Number name="usefulLifeMonths" label="Useful Life (Months)" minValue={1}/>
                <Form_1.Number name="residualValuePercent" label="Residual Value %" minValue={0} maxValue={100}/>
                <Form_1.Account name="assetAccountId" label="Asset Account" classes={["Asset"]}/>
                <Form_1.Account name="accumulatedDepreciationAccountId" label="Accumulated Depreciation Account" classes={["Asset"]}/>
                <Form_1.Account name="depreciationExpenseAccountId" label="Depreciation Expense Account" classes={["Expense"]}/>
                <Form_1.Account name="writeOffAccountId" label="Write-Off Account" classes={["Expense"]}/>
                <Form_1.Account name="writeDownAccountId" label="Write-Down Account" classes={["Expense"]}/>
                <Form_1.Account name="disposalAccountId" label="Disposal Account" classes={["Revenue", "Expense"]}/>

                {taxDepreciationEnabled && (<>
                    <div className="border-t pt-4 mt-2 w-full">
                      <h4 className="text-sm font-medium mb-4">
                        Tax Depreciation
                      </h4>
                    </div>
                    <Form_1.Select name="taxDepreciationMethod" label="Tax Method" placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Same as Book"], ["Same as Book"])))} isOptional options={accounting_models_1.taxDepreciationMethods.map(function (m) { return ({
                label: m,
                value: m
            }); })} onChange={function (value) { var _a; return setTaxMethod((_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : ""); }}/>

                    {taxMethod === "MACRS" && (<>
                        <Form_1.Select name="macrsPropertyClass" label="Recovery Period" options={accounting_utils_1.macrsPropertyClasses.map(function (c) { return ({
                    label: "".concat(c, "-Year Property"),
                    value: c
                }); })}/>
                        <Form_1.Select name="macrsConvention" label="Convention" options={accounting_utils_1.macrsConventions.map(function (c) { return ({
                    label: c,
                    value: c
                }); })}/>
                        <Form_1.Number name="bonusDepreciationPercent" label="Bonus Depreciation %" minValue={0} maxValue={100}/>
                      </>)}

                    {(taxMethod === "Straight Line" ||
                taxMethod === "Declining Balance") && (<>
                        <Form_1.Number name="taxUsefulLifeMonths" label="Tax Useful Life (Months)" minValue={1}/>
                        <Form_1.Number name="taxResidualValuePercent" label="Tax Residual Value %" minValue={0} maxValue={100}/>
                      </>)}
                  </>)}
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>Save</Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={function () { return onClose === null || onClose === void 0 ? void 0 : onClose(); }}>
                  Cancel
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = AssetClassForm;
var templateObject_1;
