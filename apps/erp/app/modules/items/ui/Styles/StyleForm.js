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
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var StyleColors_1 = require("~/components/Form/StyleColors");
var StyleSizes_1 = require("~/components/Form/StyleSizes");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
var style_models_1 = require("../../style.models");
var ItemStorageFields_1 = require("../Item/ItemStorageFields");
var ItemThumbnailField_1 = require("../Item/ItemThumbnailField");
function startsWithLetter(value) {
    return /^[A-Za-z]/.test(value);
}
var StyleForm = function (_a) {
    var _b, _c, _d, _e;
    var initialValues = _a.initialValues, _f = _a.type, type = _f === void 0 ? "card" : _f, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Created style"], ["Created style"]))));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to create style: ", ""], ["Failed to create style: ", ""])), fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, type, t]);
    var _g = (0, hooks_1.useNextItemId)("Style"), id = _g.id, onIdChange = _g.onIdChange, loading = _g.loading;
    var permissions = (0, hooks_1.usePermissions)();
    var isEditing = !!initialValues.id;
    var idRef = (0, react_2.useRef)(id);
    idRef.current = id;
    var applyIdFromThumbnail = function (fileName) {
        if (idRef.current)
            return;
        var baseName = fileName.replace(/\.[^/.]+$/, "").trim();
        if (baseName)
            onIdChange(baseName.toUpperCase());
    };
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
    var _h = (0, react_2.useState)((_c = initialValues.replenishmentSystem) !== null && _c !== void 0 ? _c : "Buy"), replenishmentSystem = _h[0], setReplenishmentSystem = _h[1];
    var _j = (0, react_2.useState)((_d = initialValues.defaultMethodType) !== null && _d !== void 0 ? _d : "Pull from Inventory"), defaultMethodType = _j[0], setDefaultMethodType = _j[1];
    var itemReplenishmentSystemOptions = (_e = items_models_1.itemReplenishmentSystems.map(function (itemReplenishmentSystem) { return ({
        label: (<span className="flex items-center gap-2">
          <Icons_1.ReplenishmentSystemIcon type={itemReplenishmentSystem}/>
          {itemReplenishmentSystem === "Buy"
                ? t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Buy"], ["Buy"]))) : itemReplenishmentSystem === "Make"
                ? t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Make"], ["Make"]))) : t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Buy and Make"], ["Buy and Make"])))}
        </span>),
        value: itemReplenishmentSystem
    }); })) !== null && _e !== void 0 ? _e : [];
    return (<react_1.ModalCardProvider type={type}>
      <react_1.ModalCard onClose={onClose}>
        <react_1.ModalCardContent>
          <form_1.ValidatedForm action={isEditing ? undefined : path_1.path.to.newStyle} method="post" validator={style_models_1.styleValidator} defaultValues={initialValues} fetcher={fetcher}>
            <react_1.ModalCardHeader>
              <react_1.ModalCardTitle>
                {isEditing ? (<macro_1.Trans>Style Details</macro_1.Trans>) : (<macro_1.Trans>New Style</macro_1.Trans>)}
              </react_1.ModalCardTitle>
              {!isEditing && (<react_1.ModalCardDescription>
                  <macro_1.Trans>
                    A style contains the information about a garment or footwear
                    item that is cut, bundled, and produced downstream.
                  </macro_1.Trans>
                </react_1.ModalCardDescription>)}
            </react_1.ModalCardHeader>
            <react_1.ModalCardBody>
              <Form_1.Hidden name="type" value={type}/>
              {!isEditing && (<ItemThumbnailField_1.default onUpload={applyIdFromThumbnail}/>)}
              {!isEditing && replenishmentSystem === "Make" && (<Form_1.Hidden name="unitCost" value={initialValues.unitCost}/>)}
              {!isEditing && replenishmentSystem === "Buy" && (<Form_1.Hidden name="lotSize" value={initialValues.lotSize}/>)}
              <div className={(0, react_1.cn)("grid w-full gap-x-8 gap-y-4", isEditing
            ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2")}>
                {isEditing ? (<Form_1.Input name="id" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Style ID"], ["Style ID"])))} isReadOnly/>) : (<Form_1.InputControlled name="id" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Style ID"], ["Style ID"])))} helperText={startsWithLetter(id)
                ? t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Use ... to get the next style ID"], ["Use ... to get the next style ID"]))) : undefined} value={id} onChange={onIdChange} isDisabled={loading} isUppercase/>)}
                <Form_1.Input name="revision" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Revision"], ["Revision"])))} isReadOnly={isEditing}/>
                <Form_1.Input name="name" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Short Description"], ["Short Description"])))} characterLimit={40}/>
                <StyleColors_1.default name="styleColorIds" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Colors"], ["Colors"])))} maxPreview={3}/>
                <StyleSizes_1.default name="styleSizeIds" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Sizes"], ["Sizes"])))} maxPreview={3}/>
                <Form_1.Select name="replenishmentSystem" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Replenishment System"], ["Replenishment System"])))} options={itemReplenishmentSystemOptions} onChange={function (newValue) {
            var _a;
            setReplenishmentSystem((_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Buy");
            if ((newValue === null || newValue === void 0 ? void 0 : newValue.value) === "Buy") {
                setDefaultMethodType("Pull from Inventory");
            }
            else {
                setDefaultMethodType("Make to Order");
            }
        }}/>
                <Form_1.Select name="itemTrackingType" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Tracking Type"], ["Tracking Type"])))} options={itemTrackingTypeOptions}/>
                <Form_1.DefaultMethodType name="defaultMethodType" label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Default Method Type"], ["Default Method Type"])))} replenishmentSystem={replenishmentSystem} value={defaultMethodType} onChange={function (newValue) {
            var _a;
            return setDefaultMethodType((_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Pull from Inventory");
        }}/>
                <Form_1.UnitOfMeasure name="unitOfMeasureCode" label={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))}/>
                {!isEditing && (<Form_1.ItemPostingGroup name="postingGroupId" label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Item Group"], ["Item Group"])))} isClearable/>)}
                {!isEditing && (<Form_1.Template name="templateId" label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Template"], ["Template"])))}/>)}
                {!isEditing && replenishmentSystem !== "Make" && (<Form_1.Number name="unitCost" label={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Unit Cost"], ["Unit Cost"])))} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} minValue={0}/>)}
                {!isEditing && replenishmentSystem !== "Buy" && (<Form_1.Number name="lotSize" label={t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Batch Size"], ["Batch Size"])))} minValue={0}/>)}
                <ItemStorageFields_1.default />
                <Form_1.CustomFormFields table="style" tags={initialValues.tags}/>
              </div>
              <div className="mt-4 w-full">
                <Form_1.TextArea name="description" label={t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Long Description"], ["Long Description"])))}/>
              </div>
            </react_1.ModalCardBody>
            <react_1.ModalCardFooter>
              <Form_1.Submit isLoading={fetcher.state !== "idle"} isDisabled={isEditing
            ? !permissions.can("update", "parts")
            : !permissions.can("create", "parts")}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
            </react_1.ModalCardFooter>
          </form_1.ValidatedForm>
        </react_1.ModalCardContent>
      </react_1.ModalCard>
    </react_1.ModalCardProvider>);
};
exports.default = StyleForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25;
