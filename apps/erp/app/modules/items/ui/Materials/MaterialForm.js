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
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var MaterialDimension_1 = require("~/components/Form/MaterialDimension");
var MaterialFinish_1 = require("~/components/Form/MaterialFinish");
var MaterialGrade_1 = require("~/components/Form/MaterialGrade");
var MaterialType_1 = require("~/components/Form/MaterialType");
var Shape_1 = require("~/components/Form/Shape");
var Substance_1 = require("~/components/Form/Substance");
var hooks_1 = require("~/hooks");
var useSettings_1 = require("~/hooks/useSettings");
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
var ItemStorageFields_1 = require("../Item/ItemStorageFields");
var ItemThumbnailField_1 = require("../Item/ItemThumbnailField");
function startsWithLetter(value) {
    return /^[A-Za-z]/.test(value);
}
var MaterialForm = function (_a) {
    var _b, _c, _d, _e;
    var initialValues = _a.initialValues, _f = _a.type, type = _f === void 0 ? "card" : _f, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var _g = (0, react_2.useState)((_b = initialValues.id) !== null && _b !== void 0 ? _b : ""), materialId = _g[0], setMaterialId = _g[1];
    // Holds the auto-generated material short description (persisted to `name`),
    // composed from the selected substance/grade/shape/dimensions/finish/type.
    var _h = (0, react_2.useState)((_c = initialValues.name) !== null && _c !== void 0 ? _c : ""), generatedName = _h[0], setGeneratedName = _h[1];
    var _j = (0, react_2.useState)({}), properties = _j[0], setProperties = _j[1];
    var _k = (0, react_2.useState)(), substanceId = _k[0], setSubstanceId = _k[1];
    var _l = (0, react_2.useState)(), formId = _l[0], setFormId = _l[1];
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_d = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _d !== void 0 ? _d : "USD";
    var fetcher = (0, react_router_1.useFetcher)();
    var materialTypes = (0, MaterialType_1.useMaterialTypes)(substanceId, formId);
    var substance = (0, Substance_1.useSubstance)();
    var shape = (0, Shape_1.useShape)();
    (0, react_2.useEffect)(function () {
        setMaterialId((0, utils_1.getMaterialId)(properties));
        setGeneratedName((0, utils_1.getMaterialDescription)(properties));
    }, [properties]);
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Created material"], ["Created material"]))));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to create material: ", ""], ["Failed to create material: ", ""])), fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, type, t]);
    var _m = (0, hooks_1.useNextItemId)("Material"), id = _m.id, onIdChange = _m.onIdChange, loading = _m.loading;
    (0, react_2.useEffect)(function () {
        if (id) {
            setMaterialId(id);
        }
    }, [id]);
    var permissions = (0, hooks_1.usePermissions)();
    var companySettings = (0, useSettings_1.useSettings)();
    var useCustomId = companySettings.materialGeneratedIds === false;
    var _o = (0, react_2.useState)((_e = initialValues.defaultMethodType) !== null && _e !== void 0 ? _e : "Purchase to Order"), defaultMethodType = _o[0], setDefaultMethodType = _o[1];
    var translateItemTrackingType = function (v) {
        return v === "Inventory"
            ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Inventory"], ["Inventory"]))) : v === "Non-Inventory"
            ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Non-Inventory"], ["Non-Inventory"]))) : v === "Serial"
            ? t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Serial"], ["Serial"]))) : t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Batch"], ["Batch"])));
    };
    var itemTrackingTypeOptions = items_models_1.itemTrackingTypes.map(function (itemTrackingType) { return ({
        label: (<span className="flex items-center gap-2">
        <components_1.TrackingTypeIcon type={itemTrackingType}/>
        {translateItemTrackingType(itemTrackingType)}
      </span>),
        value: itemTrackingType
    }); });
    return (<react_1.ModalCardProvider type={type}>
      <react_1.ModalCard onClose={onClose}>
        <react_1.ModalCardContent>
          <form_1.ValidatedForm action={path_1.path.to.newMaterial} method="post" validator={useCustomId
            ? items_models_1.materialValidator
            : items_models_1.materialValidatorWithGeneratedIds} defaultValues={initialValues} fetcher={fetcher}>
            <react_1.ModalCardHeader>
              <react_1.ModalCardTitle>
                <macro_1.Trans>New Material</macro_1.Trans>
              </react_1.ModalCardTitle>
              <react_1.ModalCardDescription>
                <macro_1.Trans>
                  A material is a physical item used to make a part that can be
                  used across multiple jobs
                </macro_1.Trans>
              </react_1.ModalCardDescription>
            </react_1.ModalCardHeader>
            <react_1.ModalCardBody>
              <Form_1.Hidden name="type" value={type}/>
              <Form_1.Hidden name="replenishmentSystem" value="Buy"/>
              {!useCustomId && (<>
                  <Form_1.Hidden name="id" value={materialId}/>
                  <Form_1.Hidden name="name" value={generatedName}/>
                </>)}
              <ItemThumbnailField_1.default />
              <div className={(0, react_1.cn)("grid w-full gap-x-8 gap-y-4 items-start", "grid-cols-1 md:grid-cols-2")}>
                {useCustomId && (<>
                    <Form_1.InputControlled name="id" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Material ID"], ["Material ID"])))} helperText={startsWithLetter(id)
                ? t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Use ... to get the next material ID"], ["Use ... to get the next material ID"]))) : undefined} value={id} onChange={onIdChange} isDisabled={loading} isUppercase autoFocus/>

                    <Form_1.InputControlled name="name" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Short Description"], ["Short Description"])))} value={generatedName} onChange={function (value) {
                setGeneratedName(value !== null && value !== void 0 ? value : "");
            }}/>
                  </>)}
                <Substance_1.default name="materialSubstanceId" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Substance"], ["Substance"])))} onChange={function (value) {
            setSubstanceId(value === null || value === void 0 ? void 0 : value.value);
            setProperties(function (prev) {
                var _a, _b, _c;
                return (__assign(__assign({}, prev), { substance: (_a = value === null || value === void 0 ? void 0 : value.label) !== null && _a !== void 0 ? _a : "", substanceCode: (_c = (_b = substance.find(function (s) { return s.value === (value === null || value === void 0 ? void 0 : value.value); })) === null || _b === void 0 ? void 0 : _b.code) !== null && _c !== void 0 ? _c : "" }));
            });
        }}/>
                <MaterialGrade_1.default name="gradeId" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Grade"], ["Grade"])))} substanceId={substanceId} onChange={function (value) {
            setProperties(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), { grade: (_a = value === null || value === void 0 ? void 0 : value.name) !== null && _a !== void 0 ? _a : "" }));
            });
        }}/>
                <Shape_1.default name="materialFormId" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Shape"], ["Shape"])))} onChange={function (value) {
            setFormId(value === null || value === void 0 ? void 0 : value.value);
            setProperties(function (prev) {
                var _a, _b, _c;
                return (__assign(__assign({}, prev), { shape: (_a = value === null || value === void 0 ? void 0 : value.label) !== null && _a !== void 0 ? _a : "", shapeCode: (_c = (_b = shape.find(function (s) { return s.value === (value === null || value === void 0 ? void 0 : value.value); })) === null || _b === void 0 ? void 0 : _b.code) !== null && _c !== void 0 ? _c : "" }));
            });
        }}/>
                <MaterialType_1.default name="materialTypeId" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Type"], ["Type"])))} substanceId={substanceId} formId={formId} onChange={function (value) {
            var _a;
            var code = (_a = materialTypes.find(function (m) { return m.value === (value === null || value === void 0 ? void 0 : value.value); })) === null || _a === void 0 ? void 0 : _a.code;
            setProperties(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), { materialType: (_a = value === null || value === void 0 ? void 0 : value.label) !== null && _a !== void 0 ? _a : "", materialTypeCode: code }));
            });
        }}/>
                <MaterialFinish_1.default name="finishId" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Finish"], ["Finish"])))} substanceId={substanceId} onChange={function (value) {
            setProperties(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), { finish: (_a = value === null || value === void 0 ? void 0 : value.name) !== null && _a !== void 0 ? _a : "" }));
            });
        }}/>
                <MaterialDimension_1.default name="dimensionId" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Dimensions"], ["Dimensions"])))} formId={formId} onChange={function (value) {
            setProperties(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), { dimensions: (_a = value === null || value === void 0 ? void 0 : value.name) !== null && _a !== void 0 ? _a : "" }));
            });
        }}/>

                <Form_1.Select name="itemTrackingType" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Tracking Type"], ["Tracking Type"])))} options={itemTrackingTypeOptions}/>

                <Form_1.DefaultMethodType name="defaultMethodType" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Default Method Type"], ["Default Method Type"])))} replenishmentSystem="Buy" value={defaultMethodType} onChange={function (newValue) { var _a; return setDefaultMethodType((_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Buy"); }}/>
                <Form_1.UnitOfMeasure name="unitOfMeasureCode" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Inventory Unit of Measure"], ["Inventory Unit of Measure"])))}/>

                <Form_1.Number name="unitCost" label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Unit Cost"], ["Unit Cost"])))} formatOptions={{
            style: "currency",
            currency: baseCurrency
        }} minValue={0}/>

                <Form_1.ItemPostingGroup name="postingGroupId" label={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Item Group"], ["Item Group"])))} isClearable/>
                <Form_1.Array name="sizes" label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Sizes"], ["Sizes"])))}/>

                <ItemStorageFields_1.default />

                <Form_1.CustomFormFields table="material" tags={initialValues.tags}/>
              </div>
              <div className="mt-4 w-full">
                <Form_1.TextArea name="description" label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Long Description"], ["Long Description"])))}/>
              </div>
            </react_1.ModalCardBody>
            <react_1.ModalCardFooter>
              <Form_1.Submit isLoading={fetcher.state !== "idle"} isDisabled={!permissions.can("create", "parts")}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
            </react_1.ModalCardFooter>
          </form_1.ValidatedForm>
        </react_1.ModalCardContent>
      </react_1.ModalCard>
    </react_1.ModalCardProvider>);
};
exports.default = MaterialForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22;
