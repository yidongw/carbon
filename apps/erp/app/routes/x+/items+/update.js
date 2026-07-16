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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
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
exports.action = action;
var auth_server_1 = require("@carbon/auth/auth.server");
var utils_1 = require("@carbon/utils");
var items_service_1 = require("~/modules/items/items.service");
var settings_1 = require("~/modules/settings");
var database_server_1 = require("~/services/database.server");
/**
 * Maps an inline edit of one of the three interlocked item-level fields
 * (replenishmentSystem, defaultMethodType, sourcingType) to the columns that
 * should be written on the item and the values that should be mirrored down to
 * its method materials. Pure — no DB access — so the relationships between the
 * fields live in one readable place instead of being scattered across branches.
 */
function deriveItemMethodUpdate(field, value) {
    switch (field) {
        case "replenishmentSystem": {
            var replenishmentSystem = value;
            // Picking a concrete replenishment system pins the default method type.
            if (value !== "Buy and Make") {
                var defaultMethodType = value === "Make"
                    ? "Make to Order"
                    : value === "Buy"
                        ? "Purchase to Order"
                        : "Pull from Inventory";
                return {
                    itemUpdate: { replenishmentSystem: replenishmentSystem, defaultMethodType: defaultMethodType },
                    cascade: { methodType: defaultMethodType }
                };
            }
            return { itemUpdate: { replenishmentSystem: replenishmentSystem }, cascade: {} };
        }
        case "defaultMethodType": {
            var defaultMethodType = value;
            // A concrete method type pins the replenishment system to match.
            if (value !== "Pull from Inventory") {
                var replenishmentSystem = value === "Make to Order"
                    ? "Make"
                    : value === "Purchase to Order"
                        ? "Buy"
                        : "Buy and Make";
                return {
                    itemUpdate: { defaultMethodType: defaultMethodType, replenishmentSystem: replenishmentSystem },
                    cascade: { methodType: defaultMethodType }
                };
            }
            return {
                itemUpdate: { defaultMethodType: defaultMethodType },
                cascade: { methodType: defaultMethodType }
            };
        }
        case "sourcingType": {
            var sourcingType = value;
            // Sourcing drives method type: Drop Ship → Purchase to Order, Ship from
            // Inventory → Pull from Inventory, Specified → leave method type as-is.
            var methodType = value === "Drop Ship"
                ? "Purchase to Order"
                : value === "Ship from Inventory"
                    ? "Pull from Inventory"
                    : undefined;
            return {
                itemUpdate: __assign({ sourcingType: sourcingType }, (methodType ? { defaultMethodType: methodType } : {})),
                cascade: { sourcingType: sourcingType, methodType: methodType }
            };
        }
    }
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, items, field, value, _d, newType, result, err_1, _e, itemUpdate, cascade, err_2, settings, name_1, code, materialSubstance, materialForm, materialType, finish, grade, dimension, _f, _g, _h, id, item_1, readableId, _j, materialDetails, relatedItems_1, namingDetails, newMaterialId, newDescription, relatedItemIds_1, itemUpdateResult, updateData, update, e_1_1, materialItems, materialIds, updateData, itemCostUpdates, errors, item, itemData, currentReadableId, relatedItems, relatedItemIds, _k, itemUpdates, partUpdate, templateItemId, templatePartData, templateUpdate, consumableItem, consumableData, currentConsumableId, relatedConsumables, relatedConsumableIds, _l, consumableItemUpdates, consumableUpdate, materialItem, materialData, currentMaterialId, relatedMaterials, relatedMaterialIds, _m, materialItemUpdates, materialUpdate, toolItem, toolData, currentToolId, relatedTools, relatedToolIds, _o, toolItemUpdates, toolUpdate;
        var _p, _q, _r;
        var _this = this;
        var _s, e_1, _t, _u;
        var _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31;
        var request = _b.request;
        return __generator(this, function (_32) {
            switch (_32.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "parts"
                    })];
                case 1:
                    _c = _32.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _32.sent();
                    items = formData.getAll("items");
                    field = formData.get("field");
                    value = formData.get("value");
                    if (typeof field !== "string" || typeof value !== "string") {
                        return [2 /*return*/, { error: { message: "Invalid form data" }, data: null }];
                    }
                    _d = field;
                    switch (_d) {
                        case "itemTrackingType": return [3 /*break*/, 3];
                        case "name": return [3 /*break*/, 9];
                        case "description": return [3 /*break*/, 9];
                        case "unitOfMeasureCode": return [3 /*break*/, 9];
                        case "replenishmentSystem": return [3 /*break*/, 11];
                        case "defaultMethodType": return [3 /*break*/, 11];
                        case "sourcingType": return [3 /*break*/, 11];
                        case "gradeId": return [3 /*break*/, 16];
                        case "dimensionId": return [3 /*break*/, 16];
                        case "finishId": return [3 /*break*/, 16];
                        case "materialFormId": return [3 /*break*/, 16];
                        case "materialSubstanceId": return [3 /*break*/, 16];
                        case "materialTypeId": return [3 /*break*/, 16];
                        case "active": return [3 /*break*/, 49];
                        case "requiresInspection": return [3 /*break*/, 51];
                        case "itemPostingGroupId": return [3 /*break*/, 53];
                        case "partId": return [3 /*break*/, 55];
                        case "templateId": return [3 /*break*/, 59];
                        case "consumableId": return [3 /*break*/, 62];
                        case "materialId": return [3 /*break*/, 66];
                        case "toolId": return [3 /*break*/, 70];
                    }
                    return [3 /*break*/, 74];
                case 3:
                    newType = value;
                    return [4 /*yield*/, client
                            .from("item")
                            .update({
                            itemTrackingType: newType,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .in("id", items)
                            .eq("companyId", companyId)];
                case 4:
                    result = _32.sent();
                    if (result.error)
                        return [2 /*return*/, result];
                    _32.label = 5;
                case 5:
                    _32.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, (0, items_service_1.cascadeItemTrackingType)((0, database_server_1.getDatabaseClient)(), {
                            itemIds: items,
                            companyId: companyId,
                            newType: newType,
                            userId: userId
                        })];
                case 6:
                    _32.sent();
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _32.sent();
                    console.error(err_1);
                    return [2 /*return*/, {
                            error: { message: "Failed to cascade tracking flags" },
                            data: null
                        }];
                case 8: return [2 /*return*/, result];
                case 9: return [4 /*yield*/, client
                        .from("item")
                        .update((_p = {},
                        _p[field] = value,
                        _p.updatedBy = userId,
                        _p.updatedAt = new Date().toISOString(),
                        _p))
                        .in("id", items)
                        .eq("companyId", companyId)];
                case 10: return [2 /*return*/, _32.sent()];
                case 11:
                    _e = deriveItemMethodUpdate(field, value), itemUpdate = _e.itemUpdate, cascade = _e.cascade;
                    _32.label = 12;
                case 12:
                    _32.trys.push([12, 14, , 15]);
                    return [4 /*yield*/, (0, items_service_1.updateItemMethodAndSourcing)((0, database_server_1.getDatabaseClient)(), {
                            itemIds: items,
                            companyId: companyId,
                            userId: userId,
                            itemUpdate: itemUpdate,
                            cascade: cascade
                        })];
                case 13:
                    _32.sent();
                    return [3 /*break*/, 15];
                case 14:
                    err_2 = _32.sent();
                    console.error(err_2);
                    return [2 /*return*/, { error: { message: "Failed to update item" }, data: null }];
                case 15: return [2 /*return*/, { data: null, error: null }];
                case 16: return [4 /*yield*/, (0, settings_1.getCompanySettings)(client, companyId)];
                case 17:
                    settings = _32.sent();
                    if (!((_v = settings.data) === null || _v === void 0 ? void 0 : _v.materialGeneratedIds)) return [3 /*break*/, 46];
                    name_1 = "";
                    code = "";
                    if (!(field === "materialSubstanceId")) return [3 /*break*/, 19];
                    return [4 /*yield*/, client
                            .from("materialSubstance")
                            .select("name, code")
                            .eq("id", value)
                            .single()];
                case 18:
                    materialSubstance = _32.sent();
                    name_1 = (_x = (_w = materialSubstance.data) === null || _w === void 0 ? void 0 : _w.name) !== null && _x !== void 0 ? _x : "";
                    code = (_z = (_y = materialSubstance.data) === null || _y === void 0 ? void 0 : _y.code) !== null && _z !== void 0 ? _z : "";
                    _32.label = 19;
                case 19:
                    if (!(field === "materialFormId")) return [3 /*break*/, 21];
                    return [4 /*yield*/, client
                            .from("materialForm")
                            .select("name, code")
                            .eq("id", value)
                            .single()];
                case 20:
                    materialForm = _32.sent();
                    name_1 = (_1 = (_0 = materialForm.data) === null || _0 === void 0 ? void 0 : _0.name) !== null && _1 !== void 0 ? _1 : "";
                    code = (_3 = (_2 = materialForm.data) === null || _2 === void 0 ? void 0 : _2.code) !== null && _3 !== void 0 ? _3 : "";
                    _32.label = 21;
                case 21:
                    if (!(field === "materialTypeId")) return [3 /*break*/, 23];
                    return [4 /*yield*/, client
                            .from("materialType")
                            .select("name, code")
                            .eq("id", value)
                            .single()];
                case 22:
                    materialType = _32.sent();
                    name_1 = (_5 = (_4 = materialType.data) === null || _4 === void 0 ? void 0 : _4.name) !== null && _5 !== void 0 ? _5 : "";
                    code = (_7 = (_6 = materialType.data) === null || _6 === void 0 ? void 0 : _6.code) !== null && _7 !== void 0 ? _7 : "";
                    _32.label = 23;
                case 23:
                    if (!(field === "finishId")) return [3 /*break*/, 25];
                    return [4 /*yield*/, client
                            .from("materialFinish")
                            .select("name")
                            .eq("id", value)
                            .single()];
                case 24:
                    finish = _32.sent();
                    name_1 = (_9 = (_8 = finish.data) === null || _8 === void 0 ? void 0 : _8.name) !== null && _9 !== void 0 ? _9 : "";
                    _32.label = 25;
                case 25:
                    if (!(field === "gradeId")) return [3 /*break*/, 27];
                    return [4 /*yield*/, client
                            .from("materialGrade")
                            .select("name")
                            .eq("id", value)
                            .single()];
                case 26:
                    grade = _32.sent();
                    name_1 = (_11 = (_10 = grade.data) === null || _10 === void 0 ? void 0 : _10.name) !== null && _11 !== void 0 ? _11 : "";
                    _32.label = 27;
                case 27:
                    if (!(field === "dimensionId")) return [3 /*break*/, 29];
                    return [4 /*yield*/, client
                            .from("materialDimension")
                            .select("name")
                            .eq("id", value)
                            .single()];
                case 28:
                    dimension = _32.sent();
                    name_1 = (_13 = (_12 = dimension.data) === null || _12 === void 0 ? void 0 : _12.name) !== null && _13 !== void 0 ? _13 : "";
                    _32.label = 29;
                case 29:
                    _32.trys.push([29, 39, 40, 45]);
                    _f = true, _g = __asyncValues(items);
                    _32.label = 30;
                case 30: return [4 /*yield*/, _g.next()];
                case 31:
                    if (!(_h = _32.sent(), _s = _h.done, !_s)) return [3 /*break*/, 38];
                    _u = _h.value;
                    _f = false;
                    id = _u;
                    return [4 /*yield*/, client
                            .from("item")
                            .select("readableId")
                            .eq("id", id)
                            .eq("companyId", companyId)
                            .single()];
                case 32:
                    item_1 = _32.sent();
                    readableId = (_14 = item_1.data) === null || _14 === void 0 ? void 0 : _14.readableId;
                    if (!readableId) return [3 /*break*/, 37];
                    return [4 /*yield*/, Promise.all([
                            client
                                .rpc("get_material_naming_details", { readable_id: readableId })
                                .single(),
                            client
                                .from("item")
                                .select("id")
                                .eq("readableId", readableId)
                                .eq("type", "Material")
                                .eq("companyId", companyId)
                        ])];
                case 33:
                    _j = _32.sent(), materialDetails = _j[0], relatedItems_1 = _j[1];
                    if (!materialDetails.data) return [3 /*break*/, 37];
                    namingDetails = materialDetails.data;
                    if (field === "materialSubstanceId") {
                        namingDetails.substance = name_1;
                        namingDetails.substanceCode = code;
                    }
                    if (field === "materialFormId") {
                        namingDetails.shape = name_1;
                        namingDetails.shapeCode = code;
                    }
                    if (field === "materialTypeId") {
                        namingDetails.materialType = name_1;
                        namingDetails.materialTypeCode = code;
                    }
                    if (field === "finishId") {
                        namingDetails.finish = name_1;
                    }
                    if (field === "gradeId") {
                        namingDetails.grade = name_1;
                    }
                    if (field === "dimensionId") {
                        namingDetails.dimensions = name_1;
                    }
                    newMaterialId = (0, utils_1.getMaterialId)(namingDetails);
                    newDescription = (0, utils_1.getMaterialDescription)(namingDetails);
                    relatedItemIds_1 = (_15 = relatedItems_1.data) === null || _15 === void 0 ? void 0 : _15.map(function (item) { return item.id; });
                    if (!relatedItemIds_1) return [3 /*break*/, 35];
                    return [4 /*yield*/, client
                            .from("item")
                            .update({ readableId: newMaterialId, name: newDescription })
                            .in("id", relatedItemIds_1)
                            .eq("companyId", companyId)];
                case 34:
                    itemUpdateResult = _32.sent();
                    if (itemUpdateResult.error) {
                        return [2 /*return*/, itemUpdateResult];
                    }
                    _32.label = 35;
                case 35:
                    updateData = (_q = {},
                        _q[field] = value || null,
                        _q.id = newMaterialId,
                        _q.updatedBy = userId,
                        _q.updatedAt = new Date().toISOString(),
                        _q);
                    // If substance changes, reset finishId, gradeId, and materialTypeId
                    if (field === "materialSubstanceId") {
                        updateData.finishId = null;
                        updateData.gradeId = null;
                        updateData.materialTypeId = null;
                    }
                    // If form changes, reset dimensionId and materialTypeId
                    if (field === "materialFormId") {
                        updateData.dimensionId = null;
                        updateData.materialTypeId = null;
                    }
                    return [4 /*yield*/, client
                            .from("material")
                            .update(updateData)
                            .eq("id", readableId)
                            .eq("companyId", companyId)];
                case 36:
                    update = _32.sent();
                    if (update.error) {
                        return [2 /*return*/, {
                                error: { message: update.error.message },
                                data: null
                            }];
                    }
                    _32.label = 37;
                case 37:
                    _f = true;
                    return [3 /*break*/, 30];
                case 38: return [3 /*break*/, 45];
                case 39:
                    e_1_1 = _32.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 45];
                case 40:
                    _32.trys.push([40, , 43, 44]);
                    if (!(!_f && !_s && (_t = _g.return))) return [3 /*break*/, 42];
                    return [4 /*yield*/, _t.call(_g)];
                case 41:
                    _32.sent();
                    _32.label = 42;
                case 42: return [3 /*break*/, 44];
                case 43:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 44: return [7 /*endfinally*/];
                case 45: return [2 /*return*/, {
                        data: null,
                        error: null
                    }];
                case 46: return [4 /*yield*/, client
                        .from("item")
                        .select("readableId")
                        .in("id", items)
                        .eq("companyId", companyId)];
                case 47:
                    materialItems = _32.sent();
                    materialIds = __spreadArray([], new Set((_17 = (_16 = materialItems.data) === null || _16 === void 0 ? void 0 : _16.map(function (item) { return item.readableId; })) !== null && _17 !== void 0 ? _17 : []), true);
                    if (materialIds.length === 0) {
                        return [2 /*return*/, { error: { message: "No materials found" }, data: null }];
                    }
                    updateData = (_r = {},
                        _r[field] = value || null,
                        _r.updatedBy = userId,
                        _r.updatedAt = new Date().toISOString(),
                        _r);
                    // If substance changes, reset finishId, gradeId, and materialTypeId
                    if (field === "materialSubstanceId") {
                        updateData.finishId = null;
                        updateData.gradeId = null;
                        updateData.materialTypeId = null;
                    }
                    // If form changes, reset dimensionId and materialTypeId
                    if (field === "materialFormId") {
                        updateData.dimensionId = null;
                        updateData.materialTypeId = null;
                    }
                    return [4 /*yield*/, client
                            .from("material")
                            .update(updateData)
                            .in("id", materialIds)
                            .eq("companyId", companyId)];
                case 48: return [2 /*return*/, _32.sent()];
                case 49: return [4 /*yield*/, client
                        .from("item")
                        .update({
                        active: value === "on",
                        updatedBy: userId,
                        updatedAt: new Date().toISOString()
                    })
                        .in("id", items)
                        .eq("companyId", companyId)];
                case 50: return [2 /*return*/, _32.sent()];
                case 51: return [4 /*yield*/, client
                        .from("item")
                        .update({
                        requiresInspection: value === "on",
                        updatedBy: userId,
                        updatedAt: new Date().toISOString()
                    })
                        .in("id", items)
                        .eq("companyId", companyId)];
                case 52: return [2 /*return*/, _32.sent()];
                case 53: return [4 /*yield*/, Promise.all(items.map(function (itemId) { return __awaiter(_this, void 0, void 0, function () {
                        var existingCost;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client
                                        .from("itemCost")
                                        .select("itemId")
                                        .eq("itemId", itemId)
                                        .single()];
                                case 1:
                                    existingCost = _a.sent();
                                    if (existingCost.data) {
                                        // Update existing record
                                        return [2 /*return*/, client
                                                .from("itemCost")
                                                .update({
                                                itemPostingGroupId: value || null,
                                                updatedBy: userId,
                                                updatedAt: new Date().toISOString()
                                            })
                                                .eq("itemId", itemId)];
                                    }
                                    else {
                                        // Create new record
                                        return [2 /*return*/, client.from("itemCost").insert({
                                                itemId: itemId,
                                                itemPostingGroupId: value || null,
                                                costingMethod: "Standard",
                                                standardCost: 0,
                                                unitCost: 0,
                                                costIsAdjusted: false,
                                                companyId: companyId,
                                                createdBy: userId,
                                                updatedBy: userId,
                                                createdAt: new Date().toISOString(),
                                                updatedAt: new Date().toISOString()
                                            })];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
                case 54:
                    itemCostUpdates = _32.sent();
                    errors = itemCostUpdates.filter(function (result) { return result.error; });
                    if (errors.length > 0) {
                        return [2 /*return*/, {
                                error: {
                                    message: ((_18 = errors[0].error) === null || _18 === void 0 ? void 0 : _18.message) || "Failed to update item costs"
                                },
                                data: null
                            }];
                    }
                    return [2 /*return*/, {
                            data: null,
                            error: null
                        }];
                case 55:
                    if (items.length > 1) {
                        return [2 /*return*/, {
                                error: { message: "Cannot update multiple items" },
                                data: null
                            }];
                    }
                    item = items[0];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("readableId, type")
                            .eq("id", item)
                            .eq("type", "Part")
                            .eq("companyId", companyId)
                            .single()];
                case 56:
                    itemData = _32.sent();
                    if (itemData.error) {
                        return [2 /*return*/, itemData];
                    }
                    if (((_19 = itemData.data) === null || _19 === void 0 ? void 0 : _19.type) !== "Part") {
                        return [2 /*return*/, { error: { message: "Item is not a part" }, data: null }];
                    }
                    currentReadableId = (_20 = itemData.data) === null || _20 === void 0 ? void 0 : _20.readableId;
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id")
                            .eq("readableId", currentReadableId)
                            .eq("type", "Part")
                            .eq("companyId", companyId)];
                case 57:
                    relatedItems = _32.sent();
                    if (relatedItems.error) {
                        return [2 /*return*/, relatedItems];
                    }
                    relatedItemIds = (_21 = relatedItems.data) === null || _21 === void 0 ? void 0 : _21.map(function (item) { return item.id; });
                    if (!relatedItemIds) return [3 /*break*/, 59];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("item")
                                .update({
                                readableId: value,
                                updatedBy: userId,
                                updatedAt: new Date().toISOString()
                            })
                                .in("id", relatedItemIds)
                                .eq("companyId", companyId),
                            client
                                .from("part")
                                .update({
                                id: value,
                                updatedBy: userId,
                                updatedAt: new Date().toISOString()
                            })
                                .eq("id", currentReadableId)
                                .eq("companyId", companyId)
                        ])];
                case 58:
                    _k = _32.sent(), itemUpdates = _k[0], partUpdate = _k[1];
                    if (partUpdate.error) {
                        return [2 /*return*/, partUpdate];
                    }
                    return [2 /*return*/, itemUpdates];
                case 59:
                    if (items.length !== 1) {
                        return [2 /*return*/, {
                                error: { message: "Can only update template for one item at a time" },
                                data: null
                            }];
                    }
                    templateItemId = items[0];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("readableId")
                            .eq("id", templateItemId)
                            .eq("companyId", companyId)
                            .single()];
                case 60:
                    templatePartData = _32.sent();
                    if (templatePartData.error || !((_22 = templatePartData.data) === null || _22 === void 0 ? void 0 : _22.readableId)) {
                        return [2 /*return*/, { error: { message: "Item not found" }, data: null }];
                    }
                    return [4 /*yield*/, client
                            .from("part")
                            .update({ templateId: value || null })
                            .eq("id", templatePartData.data.readableId)
                            .eq("companyId", companyId)];
                case 61:
                    templateUpdate = _32.sent();
                    if (templateUpdate.error)
                        return [2 /*return*/, templateUpdate];
                    return [2 /*return*/, { data: null, error: null }];
                case 62:
                    if (items.length > 1) {
                        return [2 /*return*/, {
                                error: { message: "Cannot update multiple items" },
                                data: null
                            }];
                    }
                    consumableItem = items[0];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("readableId, type")
                            .eq("id", consumableItem)
                            .eq("type", "Consumable")
                            .eq("companyId", companyId)
                            .single()];
                case 63:
                    consumableData = _32.sent();
                    if (consumableData.error) {
                        return [2 /*return*/, consumableData];
                    }
                    if (((_23 = consumableData.data) === null || _23 === void 0 ? void 0 : _23.type) !== "Consumable") {
                        return [2 /*return*/, {
                                error: { message: "Item is not a consumable" },
                                data: null
                            }];
                    }
                    currentConsumableId = (_24 = consumableData.data) === null || _24 === void 0 ? void 0 : _24.readableId;
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id")
                            .eq("readableId", currentConsumableId)
                            .eq("type", "Consumable")
                            .eq("companyId", companyId)];
                case 64:
                    relatedConsumables = _32.sent();
                    if (relatedConsumables.error) {
                        return [2 /*return*/, relatedConsumables];
                    }
                    relatedConsumableIds = (_25 = relatedConsumables.data) === null || _25 === void 0 ? void 0 : _25.map(function (item) { return item.id; });
                    if (!relatedConsumableIds) return [3 /*break*/, 66];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("item")
                                .update({
                                readableId: value,
                                updatedBy: userId,
                                updatedAt: new Date().toISOString()
                            })
                                .in("id", relatedConsumableIds)
                                .eq("companyId", companyId),
                            client
                                .from("consumable")
                                .update({
                                id: value,
                                updatedBy: userId,
                                updatedAt: new Date().toISOString()
                            })
                                .eq("id", currentConsumableId)
                                .eq("companyId", companyId)
                        ])];
                case 65:
                    _l = _32.sent(), consumableItemUpdates = _l[0], consumableUpdate = _l[1];
                    if (consumableUpdate.error) {
                        return [2 /*return*/, consumableUpdate];
                    }
                    return [2 /*return*/, consumableItemUpdates];
                case 66:
                    if (items.length > 1) {
                        return [2 /*return*/, {
                                error: { message: "Cannot update multiple items" },
                                data: null
                            }];
                    }
                    materialItem = items[0];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("readableId, type")
                            .eq("id", materialItem)
                            .eq("type", "Material")
                            .eq("companyId", companyId)
                            .single()];
                case 67:
                    materialData = _32.sent();
                    if (materialData.error) {
                        return [2 /*return*/, materialData];
                    }
                    if (((_26 = materialData.data) === null || _26 === void 0 ? void 0 : _26.type) !== "Material") {
                        return [2 /*return*/, {
                                error: { message: "Item is not a material" },
                                data: null
                            }];
                    }
                    currentMaterialId = (_27 = materialData.data) === null || _27 === void 0 ? void 0 : _27.readableId;
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id")
                            .eq("readableId", currentMaterialId)
                            .eq("type", "Material")
                            .eq("companyId", companyId)];
                case 68:
                    relatedMaterials = _32.sent();
                    if (relatedMaterials.error) {
                        return [2 /*return*/, relatedMaterials];
                    }
                    relatedMaterialIds = (_28 = relatedMaterials.data) === null || _28 === void 0 ? void 0 : _28.map(function (item) { return item.id; });
                    if (!relatedMaterialIds) return [3 /*break*/, 70];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("item")
                                .update({
                                readableId: value,
                                updatedBy: userId,
                                updatedAt: new Date().toISOString()
                            })
                                .in("id", relatedMaterialIds)
                                .eq("companyId", companyId),
                            client
                                .from("material")
                                .update({
                                id: value,
                                updatedBy: userId,
                                updatedAt: new Date().toISOString()
                            })
                                .eq("id", currentMaterialId)
                                .eq("companyId", companyId)
                        ])];
                case 69:
                    _m = _32.sent(), materialItemUpdates = _m[0], materialUpdate = _m[1];
                    if (materialUpdate.error) {
                        return [2 /*return*/, materialUpdate];
                    }
                    return [2 /*return*/, materialItemUpdates];
                case 70:
                    if (items.length > 1) {
                        return [2 /*return*/, {
                                error: { message: "Cannot update multiple items" },
                                data: null
                            }];
                    }
                    toolItem = items[0];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("readableId, type")
                            .eq("id", toolItem)
                            .eq("type", "Tool")
                            .eq("companyId", companyId)
                            .single()];
                case 71:
                    toolData = _32.sent();
                    if (toolData.error) {
                        return [2 /*return*/, toolData];
                    }
                    if (((_29 = toolData.data) === null || _29 === void 0 ? void 0 : _29.type) !== "Tool") {
                        return [2 /*return*/, { error: { message: "Item is not a tool" }, data: null }];
                    }
                    currentToolId = (_30 = toolData.data) === null || _30 === void 0 ? void 0 : _30.readableId;
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id")
                            .eq("readableId", currentToolId)
                            .eq("type", "Tool")
                            .eq("companyId", companyId)];
                case 72:
                    relatedTools = _32.sent();
                    if (relatedTools.error) {
                        return [2 /*return*/, relatedTools];
                    }
                    relatedToolIds = (_31 = relatedTools.data) === null || _31 === void 0 ? void 0 : _31.map(function (item) { return item.id; });
                    if (!relatedToolIds) return [3 /*break*/, 74];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("item")
                                .update({
                                readableId: value,
                                updatedBy: userId,
                                updatedAt: new Date().toISOString()
                            })
                                .in("id", relatedToolIds)
                                .eq("companyId", companyId),
                            client
                                .from("tool")
                                .update({
                                id: value,
                                updatedBy: userId,
                                updatedAt: new Date().toISOString()
                            })
                                .eq("id", currentToolId)
                                .eq("companyId", companyId)
                        ])];
                case 73:
                    _o = _32.sent(), toolItemUpdates = _o[0], toolUpdate = _o[1];
                    if (toolUpdate.error) {
                        return [2 /*return*/, toolUpdate];
                    }
                    return [2 /*return*/, toolItemUpdates];
                case 74: return [2 /*return*/, { error: { message: "Invalid field" }, data: null }];
            }
        });
    });
}
