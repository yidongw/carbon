"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.action = action;
exports.default = MaterialInventoryRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var storage_rules_server_1 = require("@carbon/ee/storage-rules.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var react_router_1 = require("react-router");
var StorageUnit_1 = require("~/components/Form/StorageUnit");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var items_1 = require("~/modules/items");
var Item_1 = require("~/modules/items/ui/Item");
var resources_1 = require("~/modules/resources");
var RuleAssignmentsList_1 = require("~/modules/storageRules/ui/RuleAssignmentsList");
var users_server_1 = require("~/modules/users/users.server");
var database_server_1 = require("~/services/database.server");
var stores_1 = require("~/stores");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, itemId, url, searchParams, locationId, userDefaults, _d, _e, locations, _f, _g, materialInventory, insertPickMethod, _h, _j, _k, _l, quantities, _m, _o, itemStorageUnitQuantities, _p, _q, trackedEntityIds, _r, shelfLife, bomHasShelfLifeManagedInput, trackedEntityExpirations, rulesData;
        var _s, _t, _u, _v;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts"
                    })];
                case 1:
                    _c = _w.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    itemId = params.itemId;
                    if (!itemId)
                        throw new Error("Could not find itemId");
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    locationId = searchParams.get("location");
                    if (!!locationId) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, users_server_1.getUserDefaults)(client, userId, companyId)];
                case 2:
                    userDefaults = _w.sent();
                    if (!userDefaults.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.material(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(userDefaults.error, "Failed to load default location"))];
                case 3: throw _d.apply(void 0, _e.concat([_w.sent()]));
                case 4:
                    locationId = (_t = (_s = userDefaults.data) === null || _s === void 0 ? void 0 : _s.locationId) !== null && _t !== void 0 ? _t : null;
                    _w.label = 5;
                case 5:
                    if (!!locationId) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, resources_1.getLocationsList)(client, companyId)];
                case 6:
                    locations = _w.sent();
                    if (!(locations.error || !((_u = locations.data) === null || _u === void 0 ? void 0 : _u.length))) return [3 /*break*/, 8];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.material(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(locations.error, "Failed to load any locations"))];
                case 7: throw _f.apply(void 0, _g.concat([_w.sent()]));
                case 8:
                    locationId = (_v = locations.data) === null || _v === void 0 ? void 0 : _v[0].id;
                    _w.label = 9;
                case 9: return [4 /*yield*/, Promise.all([
                        (0, items_1.getPickMethod)(client, itemId, companyId, locationId)
                    ])];
                case 10:
                    materialInventory = (_w.sent())[0];
                    if (!(materialInventory.error || !materialInventory.data)) return [3 /*break*/, 16];
                    return [4 /*yield*/, (0, items_1.upsertPickMethod)(client, {
                            itemId: itemId,
                            companyId: companyId,
                            locationId: locationId,
                            customFields: {},
                            createdBy: userId
                        })];
                case 11:
                    insertPickMethod = _w.sent();
                    if (!insertPickMethod.error) return [3 /*break*/, 13];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.material(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(insertPickMethod.error, "Failed to insert material inventory"))];
                case 12: throw _h.apply(void 0, _j.concat([_w.sent()]));
                case 13: return [4 /*yield*/, (0, items_1.getPickMethod)(client, itemId, companyId, locationId)];
                case 14:
                    materialInventory = _w.sent();
                    if (!(materialInventory.error || !materialInventory.data)) return [3 /*break*/, 16];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.material(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(materialInventory.error, "Failed to load material inventory"))];
                case 15: throw _k.apply(void 0, _l.concat([_w.sent()]));
                case 16: return [4 /*yield*/, (0, items_1.getItemQuantities)(client, itemId, companyId, locationId)];
                case 17:
                    quantities = _w.sent();
                    if (!quantities.error) return [3 /*break*/, 19];
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.items];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(quantities, "Failed to load material quantities"))];
                case 18: throw _m.apply(void 0, _o.concat([_w.sent()]));
                case 19: return [4 /*yield*/, (0, items_1.getItemStorageUnitQuantities)(client, itemId, companyId, locationId)];
                case 20:
                    itemStorageUnitQuantities = _w.sent();
                    if (!(itemStorageUnitQuantities.error || !itemStorageUnitQuantities.data)) return [3 /*break*/, 22];
                    _p = react_router_1.redirect;
                    _q = [path_1.path.to.items];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(itemStorageUnitQuantities, "Failed to load material quantities"))];
                case 21: throw _p.apply(void 0, _q.concat([_w.sent()]));
                case 22:
                    trackedEntityIds = (0, utils_1.pluckUnique)(itemStorageUnitQuantities.data, function (row) { return row.trackedEntityId; });
                    return [4 /*yield*/, Promise.all([
                            (0, items_1.getItemShelfLife)(client, itemId),
                            (0, items_1.getBomHasShelfLifeManagedInput)(client, itemId, companyId),
                            (0, inventory_1.getTrackedEntityExpirations)(client, trackedEntityIds),
                            (0, storage_rules_server_1.getStorageRulesDataForTarget)(client, {
                                targetType: "item",
                                targetId: itemId,
                                companyId: companyId
                            })
                        ])];
                case 23:
                    _r = _w.sent(), shelfLife = _r[0], bomHasShelfLifeManagedInput = _r[1], trackedEntityExpirations = _r[2], rulesData = _r[3];
                    return [2 /*return*/, {
                            materialInventory: materialInventory.data,
                            itemStorageUnitQuantities: itemStorageUnitQuantities.data,
                            quantities: quantities.data,
                            shelfLife: shelfLife.data,
                            bomHasShelfLifeManagedInput: bomHasShelfLifeManagedInput,
                            trackedEntityExpirations: trackedEntityExpirations,
                            itemId: itemId,
                            locationId: locationId,
                            ruleAssignments: rulesData.assignments,
                            ruleLibrary: rulesData.library
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userId, itemId, formData, validation, _c, shelfLifeMode, shelfLifeDays, shelfLifeTriggerProcessId, shelfLifeTriggerTiming, shelfLifeCalculateFromBom, pickMethodFields, err_1, _d, _e, _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "parts"
                        })];
                case 1:
                    userId = (_h.sent()).userId;
                    itemId = params.itemId;
                    if (!itemId)
                        throw new Error("Could not find itemId");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _h.sent();
                    return [4 /*yield*/, (0, form_1.validator)(items_1.pickMethodWithShelfLifeValidator).validate(formData)];
                case 3:
                    validation = _h.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _c = validation.data, shelfLifeMode = _c.shelfLifeMode, shelfLifeDays = _c.shelfLifeDays, shelfLifeTriggerProcessId = _c.shelfLifeTriggerProcessId, shelfLifeTriggerTiming = _c.shelfLifeTriggerTiming, shelfLifeCalculateFromBom = _c.shelfLifeCalculateFromBom, pickMethodFields = __rest(_c, ["shelfLifeMode", "shelfLifeDays", "shelfLifeTriggerProcessId", "shelfLifeTriggerTiming", "shelfLifeCalculateFromBom"]);
                    _h.label = 4;
                case 4:
                    _h.trys.push([4, 6, , 8]);
                    return [4 /*yield*/, (0, items_1.upsertPickMethodWithShelfLife)((0, database_server_1.getDatabaseClient)(), {
                            itemId: itemId,
                            locationId: pickMethodFields.locationId,
                            defaultStorageUnitId: pickMethodFields.defaultStorageUnitId,
                            sortMethod: pickMethodFields.sortMethod,
                            customFields: (0, form_2.setCustomFields)(formData),
                            userId: userId,
                            shelfLife: {
                                mode: shelfLifeMode,
                                days: shelfLifeDays,
                                triggerProcessId: shelfLifeTriggerProcessId,
                                triggerTiming: shelfLifeTriggerTiming,
                                calculateFromBom: shelfLifeCalculateFromBom
                            }
                        })];
                case 5:
                    _h.sent();
                    return [3 /*break*/, 8];
                case 6:
                    err_1 = _h.sent();
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.material(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(err_1, "Failed to update material inventory"))];
                case 7: throw _d.apply(void 0, _e.concat([_h.sent()]));
                case 8:
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.materialInventoryLocation(itemId, pickMethodFields.locationId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated material inventory"))];
                case 9: throw _f.apply(void 0, _g.concat([_h.sent()]));
            }
        });
    });
}
function MaterialInventoryRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var sharedMaterialsData = (0, hooks_1.useRouteData)(path_1.path.to.materialRoot);
    var _k = (0, react_router_1.useLoaderData)(), materialInventory = _k.materialInventory, itemStorageUnitQuantities = _k.itemStorageUnitQuantities, quantities = _k.quantities, shelfLife = _k.shelfLife, bomHasShelfLifeManagedInput = _k.bomHasShelfLifeManagedInput, trackedEntityExpirations = _k.trackedEntityExpirations, itemId = _k.itemId, ruleAssignments = _k.ruleAssignments, ruleLibrary = _k.ruleLibrary;
    var materialData = (0, hooks_1.useRouteData)(path_1.path.to.material(itemId));
    if (!materialData)
        throw new Error("Could not find material data");
    var itemUnitOfMeasureCode = (_a = materialData === null || materialData === void 0 ? void 0 : materialData.materialSummary) === null || _a === void 0 ? void 0 : _a.unitOfMeasureCode;
    var initialValues = __assign(__assign(__assign({}, materialInventory), { defaultStorageUnitId: (_b = materialInventory.defaultStorageUnitId) !== null && _b !== void 0 ? _b : undefined, shelfLifeMode: shelfLife === null || shelfLife === void 0 ? void 0 : shelfLife.mode, shelfLifeDays: (_c = shelfLife === null || shelfLife === void 0 ? void 0 : shelfLife.days) !== null && _c !== void 0 ? _c : undefined, shelfLifeTriggerProcessId: (_d = shelfLife === null || shelfLife === void 0 ? void 0 : shelfLife.triggerProcessId) !== null && _d !== void 0 ? _d : undefined, shelfLifeTriggerTiming: (_e = shelfLife === null || shelfLife === void 0 ? void 0 : shelfLife.triggerTiming) !== null && _e !== void 0 ? _e : undefined, shelfLifeCalculateFromBom: (_f = shelfLife === null || shelfLife === void 0 ? void 0 : shelfLife.calculateFromBom) !== null && _f !== void 0 ? _f : false }), (0, form_2.getCustomFields)((_g = materialInventory.customFields) !== null && _g !== void 0 ? _g : {}));
    var items = (0, stores_1.useItems)()[0];
    var item = items.find(function (i) { return i.id === itemId; });
    var itemTrackingType = item === null || item === void 0 ? void 0 : item.itemTrackingType;
    var replenishmentSystem = (_h = item === null || item === void 0 ? void 0 : item.replenishmentSystem) !== null && _h !== void 0 ? _h : null;
    var storageUnits = (0, StorageUnit_1.useStorageUnits)(materialInventory === null || materialInventory === void 0 ? void 0 : materialInventory.locationId);
    return (<react_1.VStack spacing={2} className="p-2">
      <Item_1.PickMethodForm key={"".concat(initialValues.itemId, "-").concat(itemTrackingType !== null && itemTrackingType !== void 0 ? itemTrackingType : "Inventory")} initialValues={initialValues} locations={(_j = sharedMaterialsData === null || sharedMaterialsData === void 0 ? void 0 : sharedMaterialsData.locations) !== null && _j !== void 0 ? _j : []} storageUnits={storageUnits.options} type="Material" itemTrackingType={itemTrackingType !== null && itemTrackingType !== void 0 ? itemTrackingType : "Inventory"} replenishmentSystem={replenishmentSystem} bomHasShelfLifeManagedInput={bomHasShelfLifeManagedInput}/>
      <inventory_1.InventoryDetails itemStorageUnitQuantities={itemStorageUnitQuantities} itemUnitOfMeasureCode={itemUnitOfMeasureCode !== null && itemUnitOfMeasureCode !== void 0 ? itemUnitOfMeasureCode : "EA"} itemTrackingType={itemTrackingType !== null && itemTrackingType !== void 0 ? itemTrackingType : "Inventory"} itemShelfLife={shelfLife !== null && shelfLife !== void 0 ? shelfLife : null} trackedEntityExpirations={trackedEntityExpirations} pickMethod={initialValues} quantities={quantities} storageUnits={storageUnits.options}/>
      <RuleAssignmentsList_1.default targetType="item" targetId={itemId} assignments={ruleAssignments} library={ruleLibrary}/>
    </react_1.VStack>);
}
