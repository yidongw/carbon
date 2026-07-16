"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var inventory_1 = require("~/modules/inventory");
var settings_1 = require("~/modules/settings");
/**
 * GET: available tracked lots for a picking line (non-lineside, deduped),
 * smart-ordered for the TrackedEntityPicker. POST: pick/unpick a chosen lot.
 */
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, lineId, lineResult, line, locationId, trackingType, entities, _d, settings, shelfLife, _e;
        var _f;
        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    _c = _s.sent(), client = _c.client, companyId = _c.companyId;
                    lineId = params.lineId;
                    if (!lineId)
                        throw new Response("Not found", { status: 404 });
                    return [4 /*yield*/, client
                            .from("pickingListLine")
                            .select("id, itemId, quantityToPick, quantityPicked, pickingList(locationId), item(itemTrackingType)")
                            .eq("id", lineId)
                            .single()];
                case 2:
                    lineResult = _s.sent();
                    if (lineResult.error || !lineResult.data) {
                        throw new Response("Line not found", { status: 404 });
                    }
                    line = lineResult.data;
                    locationId = (_g = line.pickingList) === null || _g === void 0 ? void 0 : _g.locationId;
                    trackingType = (_j = (_h = line.item) === null || _h === void 0 ? void 0 : _h.itemTrackingType) !== null && _j !== void 0 ? _j : "Batch";
                    if (!locationId) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, inventory_1.getAvailableTrackedEntities)(client, {
                            itemId: line.itemId,
                            companyId: companyId,
                            locationId: locationId,
                            excludeLineside: true,
                            excludeAllocated: true,
                            excludeLineId: lineId
                        })];
                case 3:
                    _d = _s.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _d = { data: [] };
                    _s.label = 5;
                case 5:
                    entities = _d;
                    return [4 /*yield*/, (0, settings_1.getCompanySettings)(client, companyId)];
                case 6:
                    settings = _s.sent();
                    shelfLife = ((_l = (_k = settings.data) === null || _k === void 0 ? void 0 : _k.inventoryShelfLife) !== null && _l !== void 0 ? _l : {});
                    _f = {
                        entities: (_m = entities.data) !== null && _m !== void 0 ? _m : [],
                        trackingType: trackingType,
                        quantityRequired: Math.max(0, Number((_o = line.quantityToPick) !== null && _o !== void 0 ? _o : 0) - Number((_p = line.quantityPicked) !== null && _p !== void 0 ? _p : 0)),
                        nearExpiryWarningDays: (_q = shelfLife.nearExpiryWarningDays) !== null && _q !== void 0 ? _q : 0,
                        expiredEntityPolicy: (_r = shelfLife.expiredEntityPolicy) !== null && _r !== void 0 ? _r : "Warn"
                    };
                    if (!locationId) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, inventory_1.getPickOrder)(client, {
                            itemId: line.itemId,
                            locationId: locationId,
                            companyId: companyId
                        })];
                case 7:
                    _e = _s.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _e = "Default";
                    _s.label = 9;
                case 9: return [2 /*return*/, (_f.defaultOrder = _e,
                        _f)];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var userId, serviceRole, lineId, formData, trackedEntityId, fromStorageUnitId, quantity, unpick, result;
        var _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, { update: "inventory" })];
                case 1:
                    userId = (_e.sent()).userId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    lineId = params.lineId;
                    if (!lineId)
                        return [2 /*return*/, { success: false, message: "Missing line" }];
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _e.sent();
                    trackedEntityId = formData.get("trackedEntityId");
                    fromStorageUnitId = formData.get("fromStorageUnitId") || null;
                    quantity = Number((_c = formData.get("quantity")) !== null && _c !== void 0 ? _c : 0);
                    unpick = formData.get("unpick") === "true";
                    if (!trackedEntityId) {
                        return [2 /*return*/, { success: false, message: "Missing tracked entity" }];
                    }
                    return [4 /*yield*/, (0, inventory_1.setPickingListLineTrackedEntity)(serviceRole, {
                            pickingListLineId: lineId,
                            trackedEntityId: trackedEntityId,
                            fromStorageUnitId: fromStorageUnitId,
                            quantity: quantity,
                            unpick: unpick,
                            userId: userId
                        })];
                case 3:
                    result = _e.sent();
                    if (result.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: typeof result.error === "string"
                                    ? result.error
                                    : ((_d = result.error.message) !== null && _d !== void 0 ? _d : "Failed to pick line")
                            }];
                    }
                    return [2 /*return*/, { success: true, data: result.data }];
            }
        });
    });
}
