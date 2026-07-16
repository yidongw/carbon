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
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
var ItemStorageFields_1 = require("../Item/ItemStorageFields");
var ItemThumbnailField_1 = require("../Item/ItemThumbnailField");
function startsWithLetter(value) {
    return /^[A-Za-z]/.test(value);
}
var ConsumableForm = function (_a) {
    var _b, _c;
    var initialValues = _a.initialValues, _d = _a.type, type = _d === void 0 ? "card" : _d, onClose = _a.onClose;
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    var fetcher = (0, react_router_1.useFetcher)();
    var t = (0, macro_1.useLingui)().t;
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Created consumable"], ["Created consumable"]))));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to create consumable: ", ""], ["Failed to create consumable: ", ""])), fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, type, t]);
    var _e = (0, hooks_1.useNextItemId)("Consumable"), id = _e.id, onIdChange = _e.onIdChange, loading = _e.loading;
    var permissions = (0, hooks_1.usePermissions)();
    var isEditing = !!initialValues.id;
    // Keep the latest id readable inside async callbacks without re-creating them.
    var idRef = (0, react_2.useRef)(id);
    idRef.current = id;
    // The uploaded image name becomes the default Consumable ID when unset.
    var applyIdFromThumbnail = function (fileName) {
        if (idRef.current)
            return;
        var baseName = fileName.replace(/\.[^/.]+$/, "").trim();
        if (baseName)
            onIdChange(baseName.toUpperCase());
    };
    var _f = (0, react_2.useState)((_c = initialValues.defaultMethodType) !== null && _c !== void 0 ? _c : "Purchase to Order"), defaultMethodType = _f[0], setDefaultMethodType = _f[1];
    var translateItemTrackingType = function (v) {
        return v === "Inventory"
            ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Inventory"], ["Inventory"]))) : v === "Non-Inventory"
            ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Non-Inventory"], ["Non-Inventory"]))) : v === "Serial"
            ? t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Serial"], ["Serial"]))) : t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Batch"], ["Batch"])));
    };
    var itemTrackingTypeOptions = items_models_1.itemTrackingTypes.map(function (itemTrackingType) { return ({
        label: (<span className="flex items-center gap-2">
        <Icons_1.TrackingTypeIcon type={itemTrackingType}/>
        {translateItemTrackingType(itemTrackingType)}
      </span>),
        value: itemTrackingType
    }); });
    return (<react_1.ModalCardProvider type={type}>
      <react_1.ModalCard onClose={onClose}>
        <react_1.ModalCardContent>
          <form_1.ValidatedForm action={isEditing ? undefined : path_1.path.to.newConsumable} method="post" validator={items_models_1.consumableValidator} defaultValues={initialValues} fetcher={fetcher}>
            <react_1.ModalCardHeader>
              <react_1.ModalCardTitle>
                {isEditing ? t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Consumable Details"], ["Consumable Details"]))) : t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["New Consumable"], ["New Consumable"])))}
              </react_1.ModalCardTitle>
              {!isEditing && (<react_1.ModalCardDescription>
                  {t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["A consumable is a physical item used to make a part that can be used across multiple jobs"], ["A consumable is a physical item used to make a part that can be used across multiple jobs"])))}
                </react_1.ModalCardDescription>)}
            </react_1.ModalCardHeader>
            <react_1.ModalCardBody>
              <Form_1.Hidden name="type" value={type}/>
              <Form_1.Hidden name="replenishmentSystem" value="Buy"/>
              {!isEditing && (<ItemThumbnailField_1.default onUpload={applyIdFromThumbnail}/>)}
              <div className={(0, react_1.cn)("grid w-full gap-x-8 gap-y-4", isEditing
            ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2")}>
                {isEditing ? (<Form_1.Input name="id" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Consumable ID"], ["Consumable ID"])))} isReadOnly/>) : (<Form_1.InputControlled name="id" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Consumable ID"], ["Consumable ID"])))} helperText={startsWithLetter(id)
                ? t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Use ... to get the next consumable ID"], ["Use ... to get the next consumable ID"]))) : undefined} value={id} onChange={onIdChange} isDisabled={loading} isUppercase autoFocus/>)}

                <Form_1.Input name="name" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Short Description"], ["Short Description"])))} characterLimit={40}/>
                <Form_1.Select name="itemTrackingType" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Tracking Type"], ["Tracking Type"])))} options={itemTrackingTypeOptions}/>

                <Form_1.DefaultMethodType name="defaultMethodType" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Default Method Type"], ["Default Method Type"])))} replenishmentSystem="Buy" value={defaultMethodType} onChange={function (newValue) { var _a; return setDefaultMethodType((_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Purchase to Order"); }}/>
                <Form_1.UnitOfMeasure name="unitOfMeasureCode" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))}/>
                {!isEditing && (<Form_1.ItemPostingGroup name="postingGroupId" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Item Group"], ["Item Group"])))} isClearable/>)}
                {!isEditing && (<Form_1.Number name="unitCost" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Unit Cost"], ["Unit Cost"])))} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} minValue={0}/>)}

                <ItemStorageFields_1.default />

                <Form_1.CustomFormFields table="consumable" tags={initialValues.tags}/>
              </div>
              <div className="mt-4 w-full">
                <Form_1.TextArea name="description" label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Long Description"], ["Long Description"])))}/>
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
exports.default = ConsumableForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19;
