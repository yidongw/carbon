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
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryAdjustmentValidator = void 0;
exports.getDocumentTemplateConfig = getDocumentTemplateConfig;
exports.getBatchNumbersForItem = getBatchNumbersForItem;
exports.getCompanySettings = getCompanySettings;
exports.getCompany = getCompany;
exports.getSerialNumbersForItem = getSerialNumbersForItem;
exports.getAvailableTrackedEntities = getAvailableTrackedEntities;
exports.getPickOrder = getPickOrder;
exports.getPickingListRecommendations = getPickingListRecommendations;
exports.getPickedQuantitiesByJobMaterial = getPickedQuantitiesByJobMaterial;
exports.insertManualInventoryAdjustment = insertManualInventoryAdjustment;
var auth_1 = require("@carbon/auth");
var template_1 = require("@carbon/documents/template");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
/**
 * Load a stored document template as a `DocumentTemplate | null` to pass to a
 * PDF/ZPL generator (which runs it through `resolveTemplate`). Returns null when
 * nothing is stored, so the output falls back to the type's default.
 */
function getDocumentTemplateConfig(client, companyId, documentType) {
    return __awaiter(this, void 0, void 0, function () {
        var stored;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("documentTemplate")
                        .select("*")
                        .eq("companyId", companyId)
                        .eq("documentType", documentType)
                        .maybeSingle()];
                case 1:
                    stored = _a.sent();
                    return [2 /*return*/, (0, template_1.toDocumentTemplate)(stored.data, documentType)];
            }
        });
    });
}
exports.inventoryAdjustmentValidator = zod_1.z.object({
    itemId: zod_1.z.string().min(1, { message: "Item ID is required" }),
    locationId: zod_1.z.string().min(1, { message: "Location is required" }),
    storageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
    entryType: zod_1.z.enum(["Positive Adjmt.", "Negative Adjmt."]),
    quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(1, { message: "Quantity is required" }))
});
function getBatchNumbersForItem(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var itemIds, item, items;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    itemIds = [args.itemId];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("*")
                            .eq("id", args.itemId)
                            .single()];
                case 1:
                    item = _c.sent();
                    if (!(((_a = item.data) === null || _a === void 0 ? void 0 : _a.type) === "Material")) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id")
                            .eq("readableId", item.data.readableId)
                            .eq("companyId", args.companyId)];
                case 2:
                    items = _c.sent();
                    if ((_b = items.data) === null || _b === void 0 ? void 0 : _b.length) {
                        itemIds = items.data.map(function (item) { return item.id; });
                    }
                    _c.label = 3;
                case 3: 
                // Smart default order: expiring soonest first (FEFO, nulls last), then oldest
                // first (FIFO).
                return [2 /*return*/, client
                        .from("trackedEntity")
                        .select("*")
                        .eq("sourceDocument", "Item")
                        .in("sourceDocumentId", itemIds)
                        .eq("companyId", args.companyId)
                        .gt("quantity", 0)
                        .order("expirationDate", { ascending: true, nullsFirst: false })
                        .order("createdAt", { ascending: true })];
            }
        });
    });
}
function getCompanySettings(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .select("*")
                    .eq("id", companyId)
                    .single()];
        });
    });
}
var PUBLIC_STORAGE_URL_PREFIX = "".concat(auth_1.SUPABASE_URL, "/storage/v1/object/public/public/");
function getCompany(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var company, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("company")
                        .select("*")
                        .eq("id", companyId)
                        .single()];
                case 1:
                    company = _a.sent();
                    if (company.error || !company.data)
                        return [2 /*return*/, company];
                    url = function (p) {
                        return p ? "".concat(PUBLIC_STORAGE_URL_PREFIX).concat(p) : p;
                    };
                    return [2 /*return*/, {
                            data: __assign(__assign({}, company.data), { logoLight: url(company.data.logoLight), logoDark: url(company.data.logoDark), logoLightIcon: url(company.data.logoLightIcon), logoDarkIcon: url(company.data.logoDarkIcon) }),
                            error: null
                        }];
            }
        });
    });
}
function getSerialNumbersForItem(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var itemIds, item, items;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    itemIds = [args.itemId];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("*")
                            .eq("id", args.itemId)
                            .single()];
                case 1:
                    item = _c.sent();
                    if (!(((_a = item.data) === null || _a === void 0 ? void 0 : _a.type) === "Material")) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id")
                            .eq("readableId", item.data.readableId)
                            .eq("companyId", args.companyId)];
                case 2:
                    items = _c.sent();
                    if ((_b = items.data) === null || _b === void 0 ? void 0 : _b.length) {
                        itemIds = items.data.map(function (item) { return item.id; });
                    }
                    _c.label = 3;
                case 3: 
                // Smart default order: expiring soonest first (FEFO, nulls last), then oldest
                // first (FIFO).
                return [2 /*return*/, client
                        .from("trackedEntity")
                        .select("*")
                        .eq("sourceDocument", "Item")
                        .in("sourceDocumentId", itemIds)
                        .eq("companyId", args.companyId)
                        .eq("status", "Available")
                        .gt("quantity", 0)
                        .order("expirationDate", { ascending: true, nullsFirst: false })
                        .order("createdAt", { ascending: true })];
            }
        });
    });
}
/**
 * Available tracked entities for an item at a location, one row per entity, with
 * its bin, on-hand, and FEFO/FIFO order keys — for the shared TrackedEntityPicker.
 * `excludeLineside` drops lineside (work-center) bins; `excludeAllocated` nets out
 * quantities already allocated to other non-cancelled picking lines.
 */
function getAvailableTrackedEntities(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            return [2 /*return*/, client.rpc("get_available_tracked_entities", {
                    p_item_id: args.itemId,
                    p_company_id: args.companyId,
                    p_location_id: args.locationId,
                    p_exclude_lineside: (_a = args.excludeLineside) !== null && _a !== void 0 ? _a : false,
                    p_exclude_allocated: (_b = args.excludeAllocated) !== null && _b !== void 0 ? _b : false,
                    p_exclude_line_id: (_c = args.excludeLineId) !== null && _c !== void 0 ? _c : undefined
                })];
        });
    });
}
/**
 * The configured tracked-entity pick order for an item at a location, used as
 * the picker's default sort. Falls back to "Default" (smart) when unset.
 */
function getPickOrder(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("pickMethod")
                        .select("sortMethod")
                        .eq("itemId", args.itemId)
                        .eq("locationId", args.locationId)
                        .eq("companyId", args.companyId)
                        .maybeSingle()];
                case 1:
                    data = (_b.sent()).data;
                    return [2 /*return*/, (_a = data === null || data === void 0 ? void 0 : data.sortMethod) !== null && _a !== void 0 ? _a : "Default"];
            }
        });
    });
}
/**
 * The recommended tracked entities (serial/batch lots) for each tracked picking
 * line, in pick order — surfaced as at-a-glance subtext before the picker opens.
 * One batched RPC fetches every available lot for every item on the list; we then
 * greedily assign distinct lots to lines in pick order so the same serial is never
 * recommended to two lines, and a batch lot is split across lines by remaining qty.
 * Returns a map of pickingListLineId → recommended lots (empty/partial if short).
 */
function getPickingListRecommendations(client, pickingListId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, linesResult, availableResult, recommendations, poolByItem, _i, _b, row, list, _c, _d, line, trackingType, remaining, pool, picks, lot, take;
        var _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("pickingListLine")
                            .select("id, itemId, quantityToPick, quantityPicked, status, item(itemTrackingType)")
                            .eq("pickingListId", pickingListId)
                            .order("jobOperationId")
                            .order("itemId"),
                        client.rpc("get_picking_list_tracked_available", {
                            p_picking_list_id: pickingListId
                        })
                    ])];
                case 1:
                    _a = _m.sent(), linesResult = _a[0], availableResult = _a[1];
                    recommendations = {};
                    if (linesResult.error || availableResult.error)
                        return [2 /*return*/, recommendations];
                    poolByItem = new Map();
                    for (_i = 0, _b = (_e = availableResult.data) !== null && _e !== void 0 ? _e : []; _i < _b.length; _i++) {
                        row = _b[_i];
                        list = (_f = poolByItem.get(row.itemId)) !== null && _f !== void 0 ? _f : [];
                        list.push({
                            trackedEntityId: row.trackedEntityId,
                            readableId: row.readableId,
                            qty: Number((_g = row.availableQuantity) !== null && _g !== void 0 ? _g : 0)
                        });
                        poolByItem.set(row.itemId, list);
                    }
                    for (_c = 0, _d = (_h = linesResult.data) !== null && _h !== void 0 ? _h : []; _c < _d.length; _c++) {
                        line = _d[_c];
                        trackingType = (_j = line.item) === null || _j === void 0 ? void 0 : _j.itemTrackingType;
                        if (trackingType !== "Serial" && trackingType !== "Batch")
                            continue;
                        remaining = Number((_k = line.quantityToPick) !== null && _k !== void 0 ? _k : 0) - Number((_l = line.quantityPicked) !== null && _l !== void 0 ? _l : 0);
                        if (remaining <= 0)
                            continue;
                        pool = poolByItem.get(line.itemId);
                        if (!(pool === null || pool === void 0 ? void 0 : pool.length))
                            continue;
                        picks = [];
                        while (remaining > 0 && pool.length > 0) {
                            lot = pool[0];
                            picks.push({
                                trackedEntityId: lot.trackedEntityId,
                                readableId: lot.readableId
                            });
                            take = Math.min(lot.qty, remaining);
                            remaining -= take;
                            lot.qty -= take;
                            if (lot.qty <= 0)
                                pool.shift();
                        }
                        recommendations[line.id] = picks;
                    }
                    return [2 /*return*/, recommendations];
            }
        });
    });
}
/**
 * How much of each job material has been picked, summed across every live picking-list
 * line that references it. A job material can legitimately span several picking lists,
 * so we sum per `jobMaterialId`. We only count lines whose parent list is actually being
 * worked ("In Progress"/"Completed"): cancelling or drafting a list does NOT cascade a
 * status down to its lines, so a Cancelled/Draft list would otherwise inflate the
 * to-pick total with stale lines. Picking is optional — materials with no picking
 * activity simply have no entry in the returned map. Never throws (returns {}).
 */
function getPickedQuantitiesByJobMaterial(client, jobMaterialIds) {
    return __awaiter(this, void 0, void 0, function () {
        var picked, _a, data, error, _i, data_1, line, entry;
        var _b, _c, _d;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    picked = {};
                    if (jobMaterialIds.length === 0)
                        return [2 /*return*/, picked];
                    return [4 /*yield*/, client
                            .from("pickingListLine")
                            .select("jobMaterialId, quantityToPick, quantityPicked, pickingList!inner(status)")
                            .in("jobMaterialId", jobMaterialIds)
                            .neq("status", "Cancelled")
                            .in("pickingList.status", ["In Progress", "Completed"])];
                case 1:
                    _a = _f.sent(), data = _a.data, error = _a.error;
                    if (error || !data)
                        return [2 /*return*/, picked];
                    for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                        line = data_1[_i];
                        if (!line.jobMaterialId)
                            continue;
                        entry = ((_b = picked[_e = line.jobMaterialId]) !== null && _b !== void 0 ? _b : (picked[_e] = {
                            quantityPicked: 0,
                            quantityToPick: 0
                        }));
                        entry.quantityPicked += Number((_c = line.quantityPicked) !== null && _c !== void 0 ? _c : 0);
                        entry.quantityToPick += Number((_d = line.quantityToPick) !== null && _d !== void 0 ? _d : 0);
                    }
                    return [2 /*return*/, picked];
            }
        });
    });
}
function insertManualInventoryAdjustment(client, inventoryAdjustment) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Check if it's a negative adjustment and if the quantity is sufficient
            if (inventoryAdjustment.entryType === "Negative Adjmt.") {
                inventoryAdjustment.quantity = -Math.abs(inventoryAdjustment.quantity);
            }
            return [2 /*return*/, client
                    .from("itemLedger")
                    .insert([inventoryAdjustment])
                    .select("*")
                    .single()];
        });
    });
}
