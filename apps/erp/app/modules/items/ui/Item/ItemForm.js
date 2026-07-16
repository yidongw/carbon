"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkToItemDetails = getLinkToItemDetails;
exports.getLinkToItemManufacturing = getLinkToItemManufacturing;
exports.getLinkToItemPlanning = getLinkToItemPlanning;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var items_models_1 = require("../../items.models");
function getLabel(type) {
    return (0, string_1.capitalize)(type);
}
var ItemForm = function (_a) {
    var _b, _c, _d, _e;
    var initialValues = _a.initialValues, type = _a.type;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var translateItemTrackingType = function (v) {
        return v === "Inventory"
            ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Inventory"], ["Inventory"]))) : v === "Non-Inventory"
            ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Non-Inventory"], ["Non-Inventory"]))) : v === "Serial"
            ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Serial"], ["Serial"]))) : t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Batch"], ["Batch"])));
    };
    var itemTrackingTypeOptions = items_models_1.itemTrackingTypes.map(function (itemTrackingType) { return ({
        label: (<span className="flex items-center gap-2">
        <components_1.TrackingTypeIcon type={itemTrackingType}/>
        {translateItemTrackingType(itemTrackingType)}
      </span>),
        value: itemTrackingType
    }); });
    var _f = (0, react_2.useState)((_b = initialValues.replenishmentSystem) !== null && _b !== void 0 ? _b : "Buy"), replenishmentSystem = _f[0], setReplenishmentSystem = _f[1];
    var _g = (0, react_2.useState)((_c = initialValues.defaultMethodType) !== null && _c !== void 0 ? _c : "Purchase to Order"), defaultMethodType = _g[0], setDefaultMethodType = _g[1];
    var itemReplenishmentSystemOptions = (_d = items_models_1.itemReplenishmentSystems.map(function (itemReplenishmentSystem) { return ({
        label: (<span className="flex items-center gap-2">
          <Icons_1.ReplenishmentSystemIcon type={itemReplenishmentSystem}/>
          {itemReplenishmentSystem === "Buy"
                ? t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Buy"], ["Buy"]))) : itemReplenishmentSystem === "Make"
                ? t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Make"], ["Make"]))) : t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Buy and Make"], ["Buy and Make"])))}
        </span>),
        value: itemReplenishmentSystem
    }); })) !== null && _d !== void 0 ? _d : [];
    return (<react_1.Card>
      <form_1.ValidatedForm action={path_1.path.to.api.item(type)} method="post" validator={items_models_1.itemValidator} defaultValues={initialValues} fetcher={fetcher}>
        <react_1.HStack className="w-full justify-between">
          <react_1.CardHeader>
            <react_1.CardTitle className="line-clamp-2">{initialValues.name}</react_1.CardTitle>
            <react_1.CardDescription className="flex items-center gap-2">
              {initialValues.readableId}
              <react_1.Copy text={(_e = initialValues.readableId) !== null && _e !== void 0 ? _e : ""}/>
            </react_1.CardDescription>
          </react_1.CardHeader>
          <react_1.CardAction>
            <react_1.DropdownMenu>
              <react_1.DropdownMenuTrigger asChild>
                <react_1.IconButton variant="secondary" icon={<lu_1.LuEllipsisVertical />} aria-label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Open menu"], ["Open menu"])))}/>
              </react_1.DropdownMenuTrigger>
              <react_1.DropdownMenuContent align="end">
                <react_1.DropdownMenuItem asChild>
                  {/* @ts-ignore */}
                  <react_router_1.Link to={getLinkToItemDetails(type, initialValues.id)}>
                    <macro_1.Trans>View Item Master</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.DropdownMenuItem>
              </react_1.DropdownMenuContent>
            </react_1.DropdownMenu>
          </react_1.CardAction>
        </react_1.HStack>
        <react_1.CardContent>
          <Form_1.Hidden name="id"/>
          <Form_1.Hidden name="type"/>
          <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 md:grid-cols-3">
            <Form_1.Input isReadOnly name="readableId" label={"".concat(getLabel(type), " ID")}/>

            <Form_1.Input name="name" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Short Description"], ["Short Description"])))} characterLimit={40}/>
            <Form_1.Select name="itemTrackingType" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Tracking Type"], ["Tracking Type"])))} options={itemTrackingTypeOptions}/>

            <Form_1.Select name="replenishmentSystem" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Replenishment System"], ["Replenishment System"])))} options={itemReplenishmentSystemOptions} onChange={function (newValue) {
            var _a;
            setReplenishmentSystem((_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Buy");
            if ((newValue === null || newValue === void 0 ? void 0 : newValue.value) === "Buy") {
                setDefaultMethodType("Buy");
            }
            else {
                setDefaultMethodType("Make");
            }
        }}/>
            <Form_1.DefaultMethodType name="defaultMethodType" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Default Method Type"], ["Default Method Type"])))} replenishmentSystem={replenishmentSystem} value={defaultMethodType} onChange={function (newValue) { var _a; return setDefaultMethodType((_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Buy"); }}/>
            <Form_1.UnitOfMeasure name="unitOfMeasureCode" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))}/>

            <Form_1.Boolean name="active" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Active"], ["Active"])))}/>
          </div>
          <div className="mt-4 w-full">
            <Form_1.TextArea name="description" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Long Description"], ["Long Description"])))}/>
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
exports.default = ItemForm;
function getLinkToItemDetails(type, id) {
    switch (type) {
        case "Part":
            return path_1.path.to.partDetails(id);
        case "Style":
            return path_1.path.to.style(id);
        case "Material":
            return path_1.path.to.materialDetails(id);
        case "Tool":
            return path_1.path.to.toolDetails(id);
        case "Consumable":
            return path_1.path.to.consumableDetails(id);
        // case "Service":
        //   return path.to.serviceDetails(id);
        default:
            throw new Error("Invalid type");
    }
}
function getLinkToItemManufacturing(type, id) {
    switch (type) {
        case "Part":
            return path_1.path.to.partDetails(id);
        case "Tool":
            return path_1.path.to.toolDetails(id);
        default:
            return getLinkToItemDetails(type, id);
    }
}
function getLinkToItemPlanning(type, id) {
    switch (type) {
        case "Part":
            return path_1.path.to.partPlanning(id);
        case "Material":
            return path_1.path.to.materialPlanning(id);
        case "Tool":
            return path_1.path.to.toolPlanning(id);
        case "Consumable":
            return path_1.path.to.consumablePlanning(id);
        // case "Service":
        //   return path.to.serviceDetails(id);
        default:
            throw new Error("Invalid type");
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15;
