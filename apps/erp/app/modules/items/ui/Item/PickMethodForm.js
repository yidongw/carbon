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
var react_router_1 = require("react-router");
var AuditLog_1 = require("~/components/AuditLog");
var Form_1 = require("~/components/Form");
var StorageUnit_1 = require("~/components/Form/StorageUnit");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
var PickMethodForm = function (_a) {
    var initialValues = _a.initialValues, locations = _a.locations, storageUnits = _a.storageUnits, type = _a.type, itemTrackingType = _a.itemTrackingType, replenishmentSystem = _a.replenishmentSystem, bomHasShelfLifeManagedInput = _a.bomHasShelfLifeManagedInput;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var company = (0, hooks_1.useUser)().company;
    var locationOptions = locations.map(function (location) { return ({
        label: location.name,
        value: location.id
    }); });
    // Serial/Batch items have per-unit tracked entities, so both the pick-order
    // default and the shelf-life policy only apply to them. Fungible tracking
    // types have no lots to order or expire.
    var isTracked = itemTrackingType === "Serial" || itemTrackingType === "Batch";
    var pickOrderOptions = (0, react_1.usePickOrderOptions)();
    var _b = (0, AuditLog_1.useAuditLog)({
        entityType: "itemShelfLife",
        entityId: initialValues.itemId,
        companyId: company.id,
        variant: "dropdown",
        triggerLabel: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Shelf-Life History"], ["Shelf-Life History"]))),
        drawerTitle: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Shelf-Life History"], ["Shelf-Life History"])))
    }), shelfLifeHistoryTrigger = _b.trigger, shelfLifeHistoryDrawer = _b.drawer;
    var _c = (0, AuditLog_1.useAuditLog)({
        entityType: "item",
        entityId: initialValues.itemId,
        companyId: company.id,
        variant: "dropdown",
        triggerLabel: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Inventory History"], ["Inventory History"]))),
        drawerTitle: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Inventory History"], ["Inventory History"])))
    }), inventoryHistoryTrigger = _c.trigger, inventoryHistoryDrawer = _c.drawer;
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" validator={items_models_1.pickMethodWithShelfLifeValidator} defaultValues={initialValues}>
        <react_1.HStack className="w-full justify-between items-start">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Inventory</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>

          <react_1.CardAction>
            <react_1.HStack spacing={2}>
              <react_1.Combobox asButton size="sm" value={initialValues.locationId} options={locationOptions} onChange={function (selected) {
            // hard refresh because initialValues update has no effect otherwise
            window.location.href = getLocationPath(initialValues.itemId, selected, type);
        }}/>
              <react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.IconButton aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Inventory actions"], ["Inventory actions"])))} icon={<lu_1.LuEllipsisVertical />} size="sm" variant="secondary"/>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent align="end">
                  {shelfLifeHistoryTrigger}
                  {inventoryHistoryTrigger}
                  <react_1.DropdownMenuItem asChild>
                    <react_router_1.Link to={path_1.path.to.auditLog}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuSettings />}/>
                      <macro_1.Trans>Open Audit Log</macro_1.Trans>
                    </react_router_1.Link>
                  </react_1.DropdownMenuItem>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>
            </react_1.HStack>
          </react_1.CardAction>
        </react_1.HStack>

        <react_1.CardContent>
          <Form_1.Hidden name="itemId"/>
          <Form_1.Hidden name="locationId"/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
            <StorageUnit_1.default name="defaultStorageUnitId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Default Storage Unit"], ["Default Storage Unit"])))} locationId={initialValues.locationId}/>

            {isTracked && (<Form_1.Select name="sortMethod" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Pick Order"], ["Pick Order"])))} options={pickOrderOptions}/>)}

            {isTracked && (<ShelfLifeFields replenishmentSystem={replenishmentSystem} itemId={initialValues.itemId} bomHasShelfLifeManagedInput={bomHasShelfLifeManagedInput}/>)}

            <Form_1.CustomFormFields table="partInventory"/>
          </div>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={!permissions.can("update", "parts")}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
      {shelfLifeHistoryDrawer}
      {inventoryHistoryDrawer}
    </react_1.Card>);
};
exports.default = PickMethodForm;
var ALL_SHELF_LIFE_MODES = [
    "Fixed Duration",
    "Calculated",
    "Set on Receipt"
];
// The "has shelf life" checkbox is local state. When unchecked, the
// hidden input submits "", which the validator coerces to "NotManaged"
// (items.models.ts) so the service deletes the itemShelfLife row
// (items.service.ts upsertItemShelfLife).
function ShelfLifeFields(_a) {
    var _b;
    var replenishmentSystem = _a.replenishmentSystem, itemId = _a.itemId, bomHasShelfLifeManagedInput = _a.bomHasShelfLifeManagedInput;
    var t = (0, macro_1.useLingui)().t;
    var inventoryShelfLife = (0, hooks_1.useSettings)().inventoryShelfLife;
    var defaultShelfLifeDays = (_b = inventoryShelfLife === null || inventoryShelfLife === void 0 ? void 0 : inventoryShelfLife.defaultShelfLifeDays) !== null && _b !== void 0 ? _b : 7;
    var shelfLifeOptionCopy = {
        "Fixed Duration": {
            title: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Fixed Shelf Life"], ["Fixed Shelf Life"]))),
            icon: <lu_1.LuCalendarClock />,
            description: replenishmentSystem === "Buy"
                ? t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Store a fixed number of days on this item. Expiry start date is set on each batch or serial when it's received."], ["Store a fixed number of days on this item. Expiry start date is set on each batch or serial when it's received."]))) : replenishmentSystem === "Make"
                ? t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Store a fixed number of days on this item. Expiry start date is set on each batch or serial when it's created (or when the trigger process runs, if set)."], ["Store a fixed number of days on this item. Expiry start date is set on each batch or serial when it's created (or when the trigger process runs, if set)."]))) : t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Store a fixed number of days on this item. Expiry start date is set on each batch or serial when it's received or created (or when the trigger process runs, if set)."], ["Store a fixed number of days on this item. Expiry start date is set on each batch or serial when it's received or created (or when the trigger process runs, if set)."])))
        },
        Calculated: {
            title: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Inherit From Materials"], ["Inherit From Materials"]))),
            icon: <lu_1.LuLayers />,
            description: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Take the shortest remaining shelf life across the materials consumed to make this item. Use when the product's expiry depends on its ingredients."], ["Take the shortest remaining shelf life across the materials consumed to make this item. Use when the product's expiry depends on its ingredients."])))
        },
        "Set on Receipt": {
            title: t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Entered At Receipt"], ["Entered At Receipt"]))),
            icon: <lu_1.LuClipboardCheck />,
            description: t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["A user records the expiry date on each batch or serial when the goods are received. Use when suppliers ship lots with different expiry dates."], ["A user records the expiry date on each batch or serial when the goods are received. Use when suppliers ship lots with different expiry dates."])))
        }
    };
    var _c = (0, form_1.useControlField)("shelfLifeMode"), shelfLifeMode = _c[0], setShelfLifeMode = _c[1];
    var _d = (0, form_1.useControlField)("shelfLifeDays"), shelfLifeDays = _d[0], setShelfLifeDays = _d[1];
    var _e = (0, form_1.useControlField)("shelfLifeTriggerProcessId"), shelfLifeTriggerProcessId = _e[0], setShelfLifeTriggerProcessId = _e[1];
    var _f = (0, form_1.useControlField)("shelfLifeCalculateFromBom"), shelfLifeCalculateFromBom = _f[0], setShelfLifeCalculateFromBom = _f[1];
    var availableModes = (0, react_2.useMemo)(function () {
        return ALL_SHELF_LIFE_MODES.filter(function (mode) {
            if (replenishmentSystem === "Make" && mode === "Set on Receipt")
                return false;
            if (replenishmentSystem === "Buy" && mode === "Calculated")
                return false;
            return true;
        });
    }, [replenishmentSystem]);
    var initialHasShelfLife = !!shelfLifeMode && shelfLifeMode !== "NotManaged";
    var _g = (0, react_2.useState)(initialHasShelfLife), hasShelfLife = _g[0], setHasShelfLife = _g[1];
    // If the current mode isn't allowed by the replenishment system, fall
    // back to the first allowed option so the ChoiceCardGroup's controlled
    // value stays valid.
    (0, react_2.useEffect)(function () {
        if (hasShelfLife &&
            shelfLifeMode &&
            shelfLifeMode !== "NotManaged" &&
            !availableModes.includes(shelfLifeMode)) {
            setShelfLifeMode(availableModes[0]);
        }
    }, [availableModes, hasShelfLife, shelfLifeMode, setShelfLifeMode]);
    // Keep the days value consistent with the mode: clear it when the user
    // switches away from Fixed Duration so the validator doesn't reject a
    // stale value on submit.
    (0, react_2.useEffect)(function () {
        if (shelfLifeMode !== "Fixed Duration" && shelfLifeDays !== undefined) {
            setShelfLifeDays(undefined);
        }
    }, [shelfLifeMode, shelfLifeDays, setShelfLifeDays]);
    // Buy-only items can't have a manufacturing trigger process — null it
    // out so a stale value from a prior replenishment setting doesn't persist.
    (0, react_2.useEffect)(function () {
        if (replenishmentSystem === "Buy") {
            setShelfLifeTriggerProcessId(undefined);
            setShelfLifeCalculateFromBom(false);
        }
    }, [
        replenishmentSystem,
        setShelfLifeTriggerProcessId,
        setShelfLifeCalculateFromBom
    ]);
    // Inherit-from-inputs only applies when mode is Fixed Duration. Coerce
    // back to false on a mode swap so the row never carries a stale flag
    // (the table CHECK enforces this server-side, but client-side reset
    // keeps the form submission clean).
    (0, react_2.useEffect)(function () {
        if (shelfLifeMode !== "Fixed Duration") {
            setShelfLifeCalculateFromBom(false);
        }
    }, [shelfLifeMode, setShelfLifeCalculateFromBom]);
    var handleToggle = function (next) {
        setHasShelfLife(next);
        if (next) {
            var current = shelfLifeMode;
            if (!current ||
                current === "NotManaged" ||
                !availableModes.includes(current)) {
                setShelfLifeMode(availableModes[0]);
            }
        }
        else {
            setShelfLifeMode("");
            setShelfLifeDays(undefined);
            setShelfLifeTriggerProcessId(undefined);
            setShelfLifeCalculateFromBom(false);
        }
    };
    var choiceValue = hasShelfLife && shelfLifeMode && shelfLifeMode !== "NotManaged"
        ? shelfLifeMode
        : availableModes[0];
    return (<>
      <react_1.HStack className="lg:col-span-3 justify-between items-center gap-4 border-t border-border pt-4">
        <react_1.VStack spacing={1}>
          <react_1.Label htmlFor="hasShelfLife" className="text-sm cursor-pointer">
            <macro_1.Trans>Shelf-Life</macro_1.Trans>
          </react_1.Label>
          <p className="text-xs text-muted-foreground">
            <macro_1.Trans>Track when batches or serials of this item expire.</macro_1.Trans>
          </p>
        </react_1.VStack>
        <react_1.Switch id="hasShelfLife" checked={hasShelfLife} onCheckedChange={handleToggle}/>
        <input type="hidden" name="shelfLifeMode" value={hasShelfLife ? choiceValue : ""}/>
      </react_1.HStack>

      {hasShelfLife && (<div className="lg:col-span-3">
          <react_1.ChoiceCardGroup value={choiceValue} onChange={setShelfLifeMode} options={availableModes.map(function (mode) { return ({
                value: mode,
                title: shelfLifeOptionCopy[mode].title,
                description: shelfLifeOptionCopy[mode].description,
                icon: shelfLifeOptionCopy[mode].icon
            }); })}/>
        </div>)}

      {hasShelfLife && choiceValue === "Fixed Duration" && (<>
          <Form_1.NumberControlled name="shelfLifeDays" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Shelf Life (Days)"], ["Shelf Life (Days)"])))} minValue={1} value={shelfLifeDays !== null && shelfLifeDays !== void 0 ? shelfLifeDays : defaultShelfLifeDays}/>
          {replenishmentSystem !== "Buy" && (<>
              <Form_1.ShelfLifeStartProcess processName="shelfLifeTriggerProcessId" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Shelf Life Start Process"], ["Shelf Life Start Process"])))} itemId={itemId}/>
              {shelfLifeTriggerProcessId && (<div className="lg:col-span-3">
                  <Form_1.ShelfLifeStartTiming timingName="shelfLifeTriggerTiming" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Start Expiration"], ["Start Expiration"])))}/>
                </div>)}
              {/* Make-only: optional input cap. Output expiry never outlasts
                    the earliest input expiry; falls back to the fixed clock
                    when no input has a date. Mirrors the inventory-settings
                    "Calculate from BOM" copy. */}
              <div className="lg:col-span-3">
                <form_1.Boolean name="shelfLifeCalculateFromBom" label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Calculate from BOM"], ["Calculate from BOM"])))} description={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Output never outlasts its raw materials. Falls back to the fixed duration when no input has an expiry date."], ["Output never outlasts its raw materials. Falls back to the fixed duration when no input has an expiry date."])))} value={!!shelfLifeCalculateFromBom} onChange={function (v) { return setShelfLifeCalculateFromBom(v); }}/>
              </div>
            </>)}
        </>)}

      {hasShelfLife &&
            bomHasShelfLifeManagedInput !== true &&
            (choiceValue === "Calculated" ||
                (choiceValue === "Fixed Duration" &&
                    !!shelfLifeCalculateFromBom &&
                    replenishmentSystem !== "Buy")) && (<div className="lg:col-span-3">
            <react_1.Alert variant="warning">
              <lu_1.LuTriangleAlert className="h-4 w-4"/>
              <react_1.AlertTitle>
                <macro_1.Trans>No BOM input has a shelf-life policy</macro_1.Trans>
              </react_1.AlertTitle>
              <react_1.AlertDescription>
                <macro_1.Trans>
                  This item's bill of materials has no inputs with shelf-life
                  enabled, so no expiry will be calculated from the BOM.
                </macro_1.Trans>
              </react_1.AlertDescription>
            </react_1.Alert>
          </div>)}
    </>);
}
function getLocationPath(itemId, locationId, type) {
    switch (type) {
        case "Part":
            return "".concat(path_1.path.to.partInventory(itemId), "?location=").concat(locationId);
        case "Material":
            return "".concat(path_1.path.to.materialInventory(itemId), "?location=").concat(locationId);
        case "Tool":
            return "".concat(path_1.path.to.toolInventory(itemId), "?location=").concat(locationId);
        case "Consumable":
            return "".concat(path_1.path.to.consumableInventory(itemId), "?location=").concat(locationId);
        case "Style":
            return "".concat(path_1.path.to.styleInventory(itemId), "?location=").concat(locationId);
        default:
            throw new Error("Invalid item type: ".concat(type));
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20;
