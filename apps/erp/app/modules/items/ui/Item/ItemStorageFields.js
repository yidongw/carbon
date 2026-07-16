"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var macro_1 = require("@lingui/react/macro");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var ItemStorageFields = function () {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    // The storage-unit picker is scoped to the signed-in user's default
    // location. Items are company-wide - there's no item.locationId - so we
    // use the user's working warehouse as the context for the pick. The
    // server will derive the pickMethod.locationId from the chosen unit's
    // storageUnit.locationId (which is always set).
    var defaults = (0, hooks_1.useUser)().defaults;
    var userLocationId = (_a = defaults.locationId) !== null && _a !== void 0 ? _a : undefined;
    return (<Form_1.StorageUnit name="defaultStorageUnitId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Default Storage Unit"], ["Default Storage Unit"])))} locationId={userLocationId} disabled={!userLocationId} helperText={userLocationId
            ? undefined
            : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Set your default location in profile settings to pick a storage unit."], ["Set your default location in profile settings to pick a storage unit."])))}/>);
};
exports.default = ItemStorageFields;
var templateObject_1, templateObject_2;
