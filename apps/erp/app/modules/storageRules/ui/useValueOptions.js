"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValueOptions = useValueOptions;
var react_1 = require("react");
var ItemPostingGroup_1 = require("~/components/Form/ItemPostingGroup");
var Location_1 = require("~/components/Form/Location");
var StorageTypes_1 = require("~/components/Form/StorageTypes");
var inventory_models_1 = require("~/modules/inventory/inventory.models");
var items_models_1 = require("~/modules/items/items.models");
var enumOptions = function (arr) {
    return arr.map(function (v) { return ({ value: v, label: v }); });
};
// Module-level constants — stable refs, never re-allocated.
var ITEM_TYPES_OPTIONS = enumOptions(inventory_models_1.itemTypes);
var ITEM_TRACKING_TYPES_OPTIONS = enumOptions(items_models_1.itemTrackingTypes);
var REPLENISHMENT_SYSTEMS_OPTIONS = enumOptions(items_models_1.itemReplenishmentSystems);
function useValueOptions() {
    var locations = (0, Location_1.useLocations)();
    var storageTypes = (0, StorageTypes_1.useStorageTypes)();
    var itemPostingGroups = (0, ItemPostingGroup_1.useItemPostingGroups)();
    return (0, react_1.useMemo)(function () { return ({
        locations: locations,
        storageTypes: storageTypes,
        itemPostingGroups: itemPostingGroups,
        itemTypes: ITEM_TYPES_OPTIONS,
        itemTrackingTypes: ITEM_TRACKING_TYPES_OPTIONS,
        replenishmentSystems: REPLENISHMENT_SYSTEMS_OPTIONS
    }); }, [locations, storageTypes, itemPostingGroups]);
}
