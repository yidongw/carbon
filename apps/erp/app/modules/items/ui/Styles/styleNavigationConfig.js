"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStyleNavigationKeys = getStyleNavigationKeys;
function getStyleNavigationKeys(_a) {
    var itemTrackingType = _a.itemTrackingType;
    var sharedKeys = ["details", "accounting"];
    var inventoryKeys = itemTrackingType === "Non-Inventory"
        ? []
        : ["planning", "inventory"];
    return __spreadArray(__spreadArray(__spreadArray([], sharedKeys, true), inventoryKeys, true), ["sales"], false);
}
