"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var FixedAssetForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var initialValues = _a.initialValues, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var settings = (0, hooks_1.useSettings)();
    var taxDepreciationEnabled = (_b = settings.assetTaxDepreciationEnabled) !== null && _b !== void 0 ? _b : false;
    var fetcher = (0, react_router_1.useFetcher)();
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "accounting")
        : !permissions.can("create", "accounting");
    var assetClasses = (0, Form_1.useAssetClasses)().assetClasses;
    var _p = (0, react_2.useState)({
        fixedAssetClassId: (_c = initialValues.fixedAssetClassId) !== null && _c !== void 0 ? _c : "",
        depreciationMethod: (_d = initialValues.depreciationMethod) !== null && _d !== void 0 ? _d : "",
        usefulLifeMonths: (_e = initialValues.usefulLifeMonths) !== null && _e !== void 0 ? _e : 60,
        residualValuePercent: (_f = initialValues.residualValuePercent) !== null && _f !== void 0 ? _f : 0,
        assetLifetimeUsage: (_g = initialValues.assetLifetimeUsage) !== null && _g !== void 0 ? _g : 0,
        taxDepreciationMethod: (_h = initialValues.taxDepreciationMethod) !== null && _h !== void 0 ? _h : "",
        taxUsefulLifeMonths: (_j = initialValues.taxUsefulLifeMonths) !== null && _j !== void 0 ? _j : 60,
        taxResidualValuePercent: (_k = initialValues.taxResidualValuePercent) !== null && _k !== void 0 ? _k : 0,
        macrsPropertyClass: (_l = initialValues.macrsPropertyClass) !== null && _l !== void 0 ? _l : "",
        macrsConvention: (_m = initialValues.macrsConvention) !== null && _m !== void 0 ? _m : "Half-Year",
        bonusDepreciationPercent: (_o = initialValues.bonusDepreciationPercent) !== null && _o !== void 0 ? _o : 0
    }), assetData = _p[0], setAssetData = _p[1];
    var onAssetClassChange = function (selected) {
        var _a, _b, _c, _d, _e, _f;
        if (!selected)
            return;
        var assetClass = assetClasses.find(function (c) { return c.id === selected.value; });
        if (!assetClass)
            return;
        setAssetData({
            fixedAssetClassId: assetClass.id,
            depreciationMethod: assetClass.depreciationMethod,
            usefulLifeMonths: assetClass.usefulLifeMonths,
            residualValuePercent: assetClass.residualValuePercent,
            assetLifetimeUsage: 0,
            taxDepreciationMethod: (_a = assetClass.taxDepreciationMethod) !== null && _a !== void 0 ? _a : "",
            taxUsefulLifeMonths: (_b = assetClass.taxUsefulLifeMonths) !== null && _b !== void 0 ? _b : 60,
            taxResidualValuePercent: (_c = assetClass.taxResidualValuePercent) !== null && _c !== void 0 ? _c : 0,
            macrsPropertyClass: (_d = assetClass.macrsPropertyClass) !== null && _d !== void 0 ? _d : "",
            macrsConvention: (_e = assetClass.macrsConvention) !== null && _e !== void 0 ? _e : "Half-Year",
            bonusDepreciationPercent: (_f = assetClass.bonusDepreciationPercent) !== null && _f !== void 0 ? _f : 0
        });
    };
    return (<react_1.ModalDrawerProvider type="drawer">
      <react_1.ModalDrawer open onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={accounting_models_1.fixedAssetValidator} method="post" action={isEditing
            ? path_1.path.to.fixedAssetDetails(initialValues.id)
            : path_1.path.to.newFixedAsset} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? "Edit" : "New"} Fixed Asset
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <react_1.VStack spacing={4}>
                <Form_1.Input name="name" label="Name"/>
                <Form_1.AssetClass name="fixedAssetClassId" label="Asset Class" value={assetData.fixedAssetClassId} onChange={onAssetClassChange}/>
                <Form_1.Input name="description" label="Description"/>
                <Form_1.Input name="serialNumber" label="Serial Number"/>
                <Form_1.SelectControlled name="depreciationMethod" label="Depreciation Method" options={accounting_models_1.depreciationMethods.map(function (m) { return ({
            label: m,
            value: m
        }); })} value={assetData.depreciationMethod} onChange={function (v) {
            if (v)
                setAssetData(function (d) { return (__assign(__assign({}, d), { depreciationMethod: v.value })); });
        }}/>
                <Form_1.NumberControlled name="usefulLifeMonths" label="Useful Life (Months)" minValue={1} value={assetData.usefulLifeMonths} onChange={function (value) {
            return setAssetData(function (d) { return (__assign(__assign({}, d), { usefulLifeMonths: value })); });
        }}/>
                <Form_1.NumberControlled name="residualValuePercent" label="Residual Value %" minValue={0} maxValue={100} value={assetData.residualValuePercent} onChange={function (value) {
            return setAssetData(function (d) { return (__assign(__assign({}, d), { residualValuePercent: value })); });
        }}/>
                {assetData.depreciationMethod === "Units of Production" && (<Form_1.NumberControlled name="assetLifetimeUsage" label="Lifetime Usage (Units)" minValue={0} value={assetData.assetLifetimeUsage} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { assetLifetimeUsage: value })); });
            }}/>)}
                <Form_1.Location name="locationId" label="Location"/>
                {taxDepreciationEnabled && (<>
                    <Form_1.SelectControlled name="taxDepreciationMethod" label="Tax Depreciation Method" placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["None"], ["None"])))} options={accounting_models_1.taxDepreciationMethods.map(function (m) { return ({
                label: m,
                value: m
            }); })} value={assetData.taxDepreciationMethod} onChange={function (v) {
                setAssetData(function (d) {
                    var _a;
                    return (__assign(__assign({}, d), { taxDepreciationMethod: (_a = v === null || v === void 0 ? void 0 : v.value) !== null && _a !== void 0 ? _a : "" }));
                });
            }}/>
                    <div className={assetData.taxDepreciationMethod === "MACRS"
                ? "flex flex-col gap-4 w-full"
                : "hidden"}>
                      <Form_1.SelectControlled name="macrsPropertyClass" label="MACRS Property Class" isOptional={false} options={accounting_models_1.macrsPropertyClasses.map(function (c) { return ({
                label: "".concat(c, "-Year"),
                value: c
            }); })} value={assetData.macrsPropertyClass} onChange={function (v) {
                if (v)
                    setAssetData(function (d) { return (__assign(__assign({}, d), { macrsPropertyClass: v.value })); });
            }}/>
                      <Form_1.SelectControlled name="macrsConvention" label="MACRS Convention" isOptional={false} options={accounting_models_1.macrsConventions.map(function (c) { return ({
                label: c,
                value: c
            }); })} value={assetData.macrsConvention} onChange={function (v) {
                if (v)
                    setAssetData(function (d) { return (__assign(__assign({}, d), { macrsConvention: v.value })); });
            }}/>
                      <Form_1.NumberControlled name="bonusDepreciationPercent" label="Bonus Depreciation %" minValue={0} maxValue={100} value={assetData.bonusDepreciationPercent} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { bonusDepreciationPercent: value })); });
            }}/>
                    </div>
                    <div className={assetData.taxDepreciationMethod === "Straight Line" ||
                assetData.taxDepreciationMethod === "Declining Balance"
                ? "flex flex-col gap-4 w-full"
                : "hidden"}>
                      <Form_1.NumberControlled name="taxUsefulLifeMonths" label="Tax Useful Life (Months)" minValue={1} value={assetData.taxUsefulLifeMonths} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { taxUsefulLifeMonths: value })); });
            }}/>
                      <Form_1.NumberControlled name="taxResidualValuePercent" label="Tax Residual Value %" minValue={0} maxValue={100} value={assetData.taxResidualValuePercent} onChange={function (value) {
                return setAssetData(function (d) { return (__assign(__assign({}, d), { taxResidualValuePercent: value })); });
            }}/>
                    </div>
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
exports.default = FixedAssetForm;
var templateObject_1;
