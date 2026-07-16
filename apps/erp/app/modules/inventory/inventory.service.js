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
exports.deleteBatchProperty = deleteBatchProperty;
exports.deleteKanban = deleteKanban;
exports.deleteReceipt = deleteReceipt;
exports.deleteReceiptLine = deleteReceiptLine;
exports.deleteStorageUnit = deleteStorageUnit;
exports.deleteStorageUnitCascade = deleteStorageUnitCascade;
exports.deleteShipment = deleteShipment;
exports.deleteShipmentLine = deleteShipmentLine;
exports.deleteShippingMethod = deleteShippingMethod;
exports.deleteStockTransfer = deleteStockTransfer;
exports.deleteStockTransferLine = deleteStockTransferLine;
exports.deleteWarehouseTransfer = deleteWarehouseTransfer;
exports.deleteWarehouseTransferLine = deleteWarehouseTransferLine;
exports.getItemLedgerPage = getItemLedgerPage;
exports.getBatchProperties = getBatchProperties;
exports.getInventoryItems = getInventoryItems;
exports.getInventoryItemsCount = getInventoryItemsCount;
exports.getKanbans = getKanbans;
exports.getKanban = getKanban;
exports.getStockTransfer = getStockTransfer;
exports.getStockTransferLine = getStockTransferLine;
exports.getStockTransferLines = getStockTransferLines;
exports.getStockTransferTracking = getStockTransferTracking;
exports.getStockTransfers = getStockTransfers;
exports.getDefaultStorageUnitOrStorageUnitWithHighestQuantity = getDefaultStorageUnitOrStorageUnitWithHighestQuantity;
exports.getReceipts = getReceipts;
exports.getReceipt = getReceipt;
exports.getReceiptLines = getReceiptLines;
exports.getReceiptTracking = getReceiptTracking;
exports.getReceiptLineTracking = getReceiptLineTracking;
exports.reconcileReceiptSerialEntities = reconcileReceiptSerialEntities;
exports.getReceiptFiles = getReceiptFiles;
exports.getSerialNumbersForItem = getSerialNumbersForItem;
exports.getAvailableTrackedEntities = getAvailableTrackedEntities;
exports.getPickOrder = getPickOrder;
exports.getBatchNumbersForItem = getBatchNumbersForItem;
exports.getStorageUnitsList = getStorageUnitsList;
exports.getStorageUnitsListForLocation = getStorageUnitsListForLocation;
exports.getStorageUnitsTreeForLocation = getStorageUnitsTreeForLocation;
exports.getStorageUnits = getStorageUnits;
exports.getStorageUnit = getStorageUnit;
exports.getEffectiveWorkCenterId = getEffectiveWorkCenterId;
exports.getStorageUnitRoots = getStorageUnitRoots;
exports.getStorageUnitChildren = getStorageUnitChildren;
exports.getStorageUnitSubtrees = getStorageUnitSubtrees;
exports.getStorageUnitParentIdsWithChildren = getStorageUnitParentIdsWithChildren;
exports.searchStorageUnitsWithAncestors = searchStorageUnitsWithAncestors;
exports.getShipments = getShipments;
exports.getShipment = getShipment;
exports.getShipmentLines = getShipmentLines;
exports.getShipmentLinesWithDetails = getShipmentLinesWithDetails;
exports.getShipmentFiles = getShipmentFiles;
exports.getShipmentRelatedItems = getShipmentRelatedItems;
exports.getShipmentTracking = getShipmentTracking;
exports.getShipmentLineTracking = getShipmentLineTracking;
exports.getShippingMethod = getShippingMethod;
exports.getShippingMethods = getShippingMethods;
exports.getShippingMethodsList = getShippingMethodsList;
exports.getShippingTermsList = getShippingTermsList;
exports.getTrackedEntities = getTrackedEntities;
exports.getTrackedEntitiesByMakeMethodId = getTrackedEntitiesByMakeMethodId;
exports.getTrackedEntity = getTrackedEntity;
exports.updateTrackedEntityExpiry = updateTrackedEntityExpiry;
exports.getTrackedEntitiesByOperationId = getTrackedEntitiesByOperationId;
exports.getWarehouseTransfers = getWarehouseTransfers;
exports.getWarehouseTransfer = getWarehouseTransfer;
exports.getWarehouseTransferLine = getWarehouseTransferLine;
exports.getWarehouseTransferLines = getWarehouseTransferLines;
exports.insertManualInventoryAdjustment = insertManualInventoryAdjustment;
exports.updateBatchPropertyOrder = updateBatchPropertyOrder;
exports.updateStockTransferStatus = updateStockTransferStatus;
exports.upsertBatchProperty = upsertBatchProperty;
exports.upsertKanban = upsertKanban;
exports.upsertReceipt = upsertReceipt;
exports.upsertStorageUnit = upsertStorageUnit;
exports.upsertShippingMethod = upsertShippingMethod;
exports.upsertShipment = upsertShipment;
exports.upsertStockTransfer = upsertStockTransfer;
exports.upsertStockTransferLine = upsertStockTransferLine;
exports.upsertStockTransferLines = upsertStockTransferLines;
exports.upsertWarehouseTransfer = upsertWarehouseTransfer;
exports.updateWarehouseTransferStatus = updateWarehouseTransferStatus;
exports.upsertWarehouseTransferLine = upsertWarehouseTransferLine;
exports.getDefaultStorageUnitForJob = getDefaultStorageUnitForJob;
exports.getStorageUnitTree = getStorageUnitTree;
exports.getStorageUnitDescendants = getStorageUnitDescendants;
exports.expandStorageUnitIdsWithDescendants = expandStorageUnitIdsWithDescendants;
exports.getStorageTypeUsage = getStorageTypeUsage;
exports.deleteStorageTypeWithCascade = deleteStorageTypeWithCascade;
exports.getStorageTypes = getStorageTypes;
exports.getStorageType = getStorageType;
exports.getStorageTypesList = getStorageTypesList;
exports.upsertStorageType = upsertStorageType;
exports.getShelfLifeForItems = getShelfLifeForItems;
exports.getTrackedEntityExpirations = getTrackedEntityExpirations;
exports.getPickingLists = getPickingLists;
exports.getPickingList = getPickingList;
exports.getPickingListLines = getPickingListLines;
exports.getPickingListAvailability = getPickingListAvailability;
exports.getPickingListRecommendations = getPickingListRecommendations;
exports.getPickingListLine = getPickingListLine;
exports.getPickingListLineTrackedEntities = getPickingListLineTrackedEntities;
exports.setPickingListLineTrackedEntity = setPickingListLineTrackedEntity;
exports.upsertPickingList = upsertPickingList;
exports.updatePickingListStatus = updatePickingListStatus;
exports.upsertPickingListLine = upsertPickingListLine;
exports.deletePickingList = deletePickingList;
exports.deletePickingListLine = deletePickingListLine;
exports.getPickingSchedule = getPickingSchedule;
exports.generatePickingList = generatePickingList;
exports.pickPickingListLine = pickPickingListLine;
exports.insertStockTransfer = insertStockTransfer;
exports.insertWarehouseTransfer = insertWarehouseTransfer;
exports.updateStockTransfer = updateStockTransfer;
exports.updateWarehouseTransfer = updateWarehouseTransfer;
var database_1 = require("@carbon/database");
var date_1 = require("@internationalized/date");
var nanoid_1 = require("nanoid");
var settings_1 = require("~/modules/settings");
var query_1 = require("~/utils/query");
var supabase_1 = require("~/utils/supabase");
var items_service_1 = require("../items/items.service");
var inventory_models_1 = require("./inventory.models");
function deleteBatchProperty(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("batchProperty").delete().eq("id", id)];
        });
    });
}
function deleteKanban(client, kanbanId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("kanban").delete().eq("id", kanbanId)];
        });
    });
}
function deleteReceipt(client, receiptId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("receipt").delete().eq("id", receiptId)];
        });
    });
}
function deleteReceiptLine(client, receiptLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("receiptLine").delete().eq("id", receiptLineId)];
        });
    });
}
function deleteStorageUnit(client, storageUnitId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("storageUnit").delete().eq("id", storageUnitId)];
        });
    });
}
/**
 * Deletes a storage unit along with every descendant in its subtree.
 *
 * The `storageUnit_parentId_fkey` FK is `ON DELETE RESTRICT`, so you cannot
 * delete a parent while it still has children. Supabase evaluates FK
 * constraints at statement end, so deleting the whole subtree in a single
 * `WHERE id IN (...)` statement is safe - all referencing rows go away in
 * the same transaction.
 *
 * We fetch the subtree via `storageUnits_recursive` (which already returns
 * self + descendants thanks to `ancestorPath @> ARRAY[id]`).
 */
function deleteStorageUnitCascade(client, storageUnitId) {
    return __awaiter(this, void 0, void 0, function () {
        var descendants, ids;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getStorageUnitDescendants(client, storageUnitId)];
                case 1:
                    descendants = _b.sent();
                    if (descendants.error)
                        return [2 /*return*/, descendants];
                    ids = ((_a = descendants.data) !== null && _a !== void 0 ? _a : [])
                        .map(function (row) { return row.id; })
                        .filter(function (id) { return id != null; });
                    // Safety net: fall back to the single-row delete if the view returned
                    // nothing (shouldn't happen — the self row is always in the subtree).
                    if (ids.length === 0) {
                        return [2 /*return*/, client.from("storageUnit").delete().eq("id", storageUnitId)];
                    }
                    return [2 /*return*/, client.from("storageUnit").delete().in("id", ids)];
            }
        });
    });
}
function deleteShipment(client, shipmentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("shipment").delete().eq("id", shipmentId)];
        });
    });
}
function deleteShipmentLine(client, shipmentLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("shipmentLine").delete().eq("id", shipmentLineId)];
        });
    });
}
function deleteShippingMethod(client, shippingMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("shippingMethod")
                    .update({ active: false })
                    .eq("id", shippingMethodId)];
        });
    });
}
function deleteStockTransfer(client, stockTransferId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("stockTransfer").delete().eq("id", stockTransferId)];
        });
    });
}
function deleteStockTransferLine(client, stockTransferLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("stockTransferLine")
                    .delete()
                    .eq("id", stockTransferLineId)];
        });
    });
}
function deleteWarehouseTransfer(client, transferId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("warehouseTransfer").delete().eq("id", transferId)];
        });
    });
}
function deleteWarehouseTransferLine(client, transferLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("warehouseTransferLine").delete().eq("id", transferLineId)];
        });
    });
}
function getItemLedgerPage(client_1, itemId_1, companyId_1, locationId_1) {
    return __awaiter(this, arguments, void 0, function (client, itemId, companyId, locationId, sortDescending, page) {
        var pageSize, offset, query, _a, data, error, count;
        if (sortDescending === void 0) { sortDescending = false; }
        if (page === void 0) { page = 1; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pageSize = 20;
                    offset = (page - 1) * pageSize;
                    query = client
                        .from("itemLedger")
                        .select("*, storageUnit(name)", { count: "exact" })
                        .eq("itemId", itemId)
                        .eq("companyId", companyId)
                        .eq("locationId", locationId)
                        .order("createdAt", { ascending: !sortDescending })
                        .range(offset, offset + pageSize - 1);
                    return [4 /*yield*/, query];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error, count = _a.count;
                    if (error) {
                        return [2 /*return*/, { error: error }];
                    }
                    return [2 /*return*/, {
                            data: data,
                            count: count,
                            page: page,
                            pageSize: pageSize,
                            hasMore: count !== null && offset + pageSize < count
                        }];
            }
        });
    });
}
function getBatchProperties(client, itemIds, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("batchProperty")
                    .select("*")
                    .in("itemId", itemIds)
                    .eq("companyId", companyId)
                    .order("sortOrder")];
        });
    });
}
function getInventoryItems(client, locationId, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client.rpc("get_inventory_quantities", {
                location_id: locationId,
                company_id: companyId
            }, {
                count: "exact"
            });
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("name.ilike.%".concat(args.search, "%,readableIdWithRevision.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "readableIdWithRevision", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getInventoryItemsCount(client, locationId, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("item")
                .select("id", {
                count: "exact"
            })
                .neq("itemTrackingType", "Non-Inventory")
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("name.ilike.%".concat(args.search, "%,readableIdWithRevision.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args);
            return [2 /*return*/, query];
        });
    });
}
function getKanbans(client, locationId, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("kanbans")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .eq("locationId", locationId);
            if (args.search) {
                query = query.or("name.ilike.%".concat(args.search, "%,readableIdWithRevision.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "readableIdWithRevision", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getKanban(client, kanbanId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("kanbans").select("*").eq("id", kanbanId).single()];
        });
    });
}
function getStockTransfer(client, stockTransferId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("stockTransfer")
                    .select("*")
                    .eq("id", stockTransferId)
                    .single()];
        });
    });
}
function getStockTransferLine(client, stockTransferLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("stockTransferLines")
                    .select("*")
                    .eq("id", stockTransferLineId)
                    .single()];
        });
    });
}
function getStockTransferLines(client, stockTransferId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("stockTransferLines")
                    .select("*")
                    .eq("stockTransferId", stockTransferId)
                    .order("itemReadableId", { ascending: true })
                    .order("createdAt", { ascending: true })];
        });
    });
}
function getStockTransferTracking(client, stockTransferId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trackedActivity")
                    .select("attributes, trackedActivityInput(trackedEntityId)")
                    .eq("sourceDocument", "Stock Transfer")
                    .eq("sourceDocumentId", stockTransferId)
                    .eq("companyId", companyId)];
        });
    });
}
function getStockTransfers(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("stockTransfer")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.ilike("stockTransferId", "%".concat(args.search, "%"));
            }
            if (args.locationId) {
                query = query.eq("locationId", args.locationId);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "stockTransferId", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getDefaultStorageUnitOrStorageUnitWithHighestQuantity(client, itemId, locationId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var pickMethod, storageUnits, storageUnitWithHighestQuantity;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client
                        .from("pickMethod")
                        .select("defaultStorageUnitId")
                        .eq("itemId", itemId)
                        .eq("locationId", locationId)
                        .eq("companyId", companyId)
                        .maybeSingle()];
                case 1:
                    pickMethod = _d.sent();
                    if ((_a = pickMethod.data) === null || _a === void 0 ? void 0 : _a.defaultStorageUnitId)
                        return [2 /*return*/, pickMethod.data.defaultStorageUnitId];
                    return [4 /*yield*/, (0, items_service_1.getItemStorageUnitQuantities)(client, itemId, companyId, locationId)];
                case 2:
                    storageUnits = _d.sent();
                    storageUnitWithHighestQuantity = (_b = storageUnits.data) === null || _b === void 0 ? void 0 : _b.reduce(function (acc, curr) {
                        return acc.quantity > curr.quantity
                            ? acc
                            : __assign(__assign({}, curr), { quantity: acc.quantity, storageUnitId: acc.storageUnitId });
                    }, { quantity: 0, storageUnitId: null });
                    return [2 /*return*/, (_c = storageUnitWithHighestQuantity === null || storageUnitWithHighestQuantity === void 0 ? void 0 : storageUnitWithHighestQuantity.storageUnitId) !== null && _c !== void 0 ? _c : null];
            }
        });
    });
}
function getReceipts(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("receipt")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .neq("sourceDocumentId", "");
            if (args.search) {
                query = query.or("receiptId.ilike.%".concat(args.search, "%,sourceDocumentReadableId.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "receiptId", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getReceipt(client, receiptId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("receipt").select("*").eq("id", receiptId).single()];
        });
    });
}
function getReceiptLines(client, receiptId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("receiptLines").select("*").eq("receiptId", receiptId)];
        });
    });
}
function getReceiptTracking(client, receiptId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trackedEntity")
                    .select("*")
                    .eq("attributes ->> Receipt", receiptId)
                    .eq("companyId", companyId)];
        });
    });
}
function getReceiptLineTracking(client, receiptLineId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trackedEntity")
                    .select("*")
                    .eq("attributes ->> Receipt Line", receiptLineId)
                    .eq("companyId", companyId)];
        });
    });
}
/**
 * Deletes stale serial tracked entities for a receipt's serial-tracked lines
 * before posting. Post-receipt flips one serial per index in
 * [0, receivedQuantity) to Available; orphaned (reduced quantity) or duplicate
 * (edited serial) entities would otherwise become phantom Available serials.
 * The keep/delete decision is owned by `reconcileReceiptLineSerials` so it
 * stays in lockstep with the post-time validation in ReceiptPostModal.
 */
function reconcileReceiptSerialEntities(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var serialLines, serialEntities, idsToDelete;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serialLines = args.lines.filter(function (line) { return line.requiresSerialTracking; });
                    if (serialLines.length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("id, attributes, createdAt, readableId")
                            .eq("attributes ->> Receipt", args.receiptId)
                            .eq("companyId", args.companyId)];
                case 1:
                    serialEntities = (_a.sent()).data;
                    idsToDelete = serialLines.flatMap(function (line) {
                        var _a;
                        var entities = (serialEntities !== null && serialEntities !== void 0 ? serialEntities : [])
                            .filter(function (e) {
                            var _a;
                            return ((_a = e.attributes) === null || _a === void 0 ? void 0 : _a["Receipt Line"]) ===
                                line.id;
                        })
                            .map(function (e) {
                            var _a;
                            return ({
                                id: e.id,
                                index: (_a = e.attributes) === null || _a === void 0 ? void 0 : _a["Receipt Line Index"],
                                hasSerial: !!e.readableId,
                                createdAt: e.createdAt
                            });
                        });
                        return (0, inventory_models_1.reconcileReceiptLineSerials)(entities, Number((_a = line.receivedQuantity) !== null && _a !== void 0 ? _a : 0)).surplusEntityIds;
                    });
                    if (!(idsToDelete.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .delete()
                            .in("id", idsToDelete)
                            .eq("companyId", args.companyId)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getReceiptFiles(client, companyId, lineIds) {
    return __awaiter(this, void 0, void 0, function () {
        var promises, results, firstError;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    promises = lineIds.map(function (lineId) {
                        return client.storage
                            .from("private")
                            .list("".concat(companyId, "/inventory/").concat(lineId))
                            .then(function (result) { return (__assign(__assign({}, result), { lineId: lineId })); });
                    });
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    results = _c.sent();
                    firstError = results.find(function (result) { return result.error; });
                    if (firstError) {
                        return [2 /*return*/, {
                                data: [],
                                error: (_b = (_a = firstError.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "Failed to fetch files"
                            }];
                    }
                    // Merge data arrays and add lineId as bucketName
                    return [2 /*return*/, {
                            data: results.flatMap(function (result) {
                                var _a;
                                return ((_a = result.data) !== null && _a !== void 0 ? _a : []).map(function (file) { return (__assign(__assign({}, file), { bucket: result.lineId })); });
                            }),
                            error: null
                        }];
            }
        });
    });
}
function getSerialNumbersForItem(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("trackedEntity")
                .select("*")
                .eq("sourceDocument", "Item")
                .eq("sourceDocumentId", args.itemId)
                .eq("companyId", args.companyId)
                .eq("quantity", 1)
                .order("expirationDate", { ascending: true, nullsFirst: false })
                .order("createdAt", { ascending: true });
            return [2 /*return*/, query];
        });
    });
}
/**
 * Available tracked entities for an item at a location, one row per entity, with
 * its bin, on-hand, and FEFO/FIFO order keys — for the shared TrackedEntityPicker.
 * `excludeLineside` drops lineside (work-center) bins (picking sources from the
 * warehouse). `excludeAllocated` nets out quantities already allocated to other
 * non-cancelled picking lines so the same lot is never recommended twice;
 * `excludeLineId` keeps the current line's own allocation visible.
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
function getBatchNumbersForItem(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trackedEntity")
                    .select("*")
                    .eq("sourceDocument", "Item")
                    .eq("sourceDocumentId", args.itemId)
                    .eq("companyId", args.companyId)
                    .gte("quantity", 1)
                    .order("expirationDate", { ascending: true, nullsFirst: false })
                    .order("createdAt", { ascending: true })];
        });
    });
}
function getStorageUnitsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "storageUnit", "id, name", function (query) {
                    return query.eq("active", true).eq("companyId", companyId).order("name");
                })];
        });
    });
}
function getStorageUnitsListForLocation(client, companyId, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "storageUnit", "id, name", function (query) {
                    return query
                        .eq("active", true)
                        .eq("companyId", companyId)
                        .eq("locationId", locationId)
                        .order("name");
                })];
        });
    });
}
// Tree shape from storageUnits_recursive view: each row has its 1-based depth
// and the full ancestorPath (root → node ids). Sort by ancestorPath so the
// caller can render a flat list that visually nests by depth.
function getStorageUnitsTreeForLocation(client, companyId, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "storageUnits_recursive", "id, name, parentId, depth, ancestorPath", function (query) {
                    return query
                        .eq("active", true)
                        .eq("companyId", companyId)
                        .eq("locationId", locationId);
                })];
        });
    });
}
function getStorageUnits(client, locationId, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("storageUnits_recursive")
                .select("*", { count: "exact" })
                .eq("companyId", companyId)
                .eq("locationId", locationId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            // Default ordering: breadth-first by ancestorPath so parents render before
            // children in the table. Caller-supplied sorts override when provided.
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "ancestorPath", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getStorageUnit(client, storageUnitId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("storageUnit")
                    .select("*")
                    .eq("id", storageUnitId)
                    .single()];
        });
    });
}
function getEffectiveWorkCenterId(client, storageUnitId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_effective_work_center_id", {
                    p_storage_unit_id: storageUnitId
                })];
        });
    });
}
// Roots only (depth = 1). Honors search/filter/pagination so the table can
// paginate top-level storage units while children load lazily on demand.
function getStorageUnitRoots(client, companyId, locationId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("storageUnits_recursive")
                .select("*", { count: "exact" })
                .eq("companyId", companyId)
                .eq("locationId", locationId)
                .eq("depth", 1);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "name", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
// Immediate children of a single parent (one level deep). Used by the lazy
// expand handler in the StorageUnits table.
function getStorageUnitChildren(client, parentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("storageUnits_recursive")
                    .select("*")
                    .eq("parentId", parentId)
                    .order("name")];
        });
    });
}
// Descendants of the given root ids, from just below the roots (depth > 1) down
// to `maxDepth` inclusive. A node is a descendant of a root when that root
// appears in its ancestorPath, so a single `overlaps` query returns the
// subtrees in one round trip. Used to render the tree expanded by default;
// the depth cap keeps very deep trees from loading their entire subtree
// eagerly — anything below `maxDepth` still lazy-loads on demand.
function getStorageUnitSubtrees(client, companyId, locationId, rootIds, maxDepth) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (rootIds.length === 0) {
                return [2 /*return*/, { data: [], error: null }];
            }
            return [2 /*return*/, client
                    .from("storageUnits_recursive")
                    .select("*")
                    .eq("companyId", companyId)
                    .eq("locationId", locationId)
                    .gt("depth", 1)
                    .lte("depth", maxDepth)
                    .overlaps("ancestorPath", rootIds)
                    .order("name")];
        });
    });
}
// Set of storageUnit ids that have at least one child in the given location.
// Drives whether the table renders an expand chevron on a row.
function getStorageUnitParentIdsWithChildren(client, companyId, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error, ids, _i, _b, row;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("storageUnit")
                        .select("parentId")
                        .eq("companyId", companyId)
                        .eq("locationId", locationId)
                        .not("parentId", "is", null)];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error)
                        return [2 /*return*/, { data: [], error: error }];
                    ids = new Set();
                    for (_i = 0, _b = data !== null && data !== void 0 ? data : []; _i < _b.length; _i++) {
                        row = _b[_i];
                        if (row.parentId)
                            ids.add(row.parentId);
                    }
                    return [2 /*return*/, { data: Array.from(ids), error: null }];
            }
        });
    });
}
// Search-mode payload: every storage unit whose name matches `search` PLUS
// every ancestor of each match, so the tree path renders intact. Returns the
// flat ordered row set + the parentIds that should be pre-expanded so that
// matches are visible to the user.
function searchStorageUnitsWithAncestors(client, companyId, locationId, search) {
    return __awaiter(this, void 0, void 0, function () {
        var matches, idsToFetch, expanded, _i, _a, row, _b, _c, ancestorId, _d, _e, ancestorId, rows;
        var _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, client
                        .from("storageUnits_recursive")
                        .select("id, parentId, ancestorPath")
                        .eq("companyId", companyId)
                        .eq("locationId", locationId)
                        .ilike("name", "%".concat(search, "%"))];
                case 1:
                    matches = _k.sent();
                    if (matches.error)
                        return [2 /*return*/, { rows: [], expandedParentIds: [], error: matches.error }];
                    idsToFetch = new Set();
                    expanded = new Set();
                    for (_i = 0, _a = (_f = matches.data) !== null && _f !== void 0 ? _f : []; _i < _a.length; _i++) {
                        row = _a[_i];
                        for (_b = 0, _c = (_g = row.ancestorPath) !== null && _g !== void 0 ? _g : []; _b < _c.length; _b++) {
                            ancestorId = _c[_b];
                            idsToFetch.add(ancestorId);
                        }
                        // Pre-expand every node on the chain except the match itself, so the
                        // match becomes visible. ancestorPath includes the node itself at the end.
                        for (_d = 0, _e = ((_h = row.ancestorPath) !== null && _h !== void 0 ? _h : []).slice(0, -1); _d < _e.length; _d++) {
                            ancestorId = _e[_d];
                            expanded.add(ancestorId);
                        }
                    }
                    if (idsToFetch.size === 0) {
                        return [2 /*return*/, { rows: [], expandedParentIds: [], error: null }];
                    }
                    return [4 /*yield*/, client
                            .from("storageUnits_recursive")
                            .select("*")
                            .eq("companyId", companyId)
                            .eq("locationId", locationId)
                            .in("id", Array.from(idsToFetch))
                            .order("ancestorPath")];
                case 2:
                    rows = _k.sent();
                    if (rows.error)
                        return [2 /*return*/, { rows: [], expandedParentIds: [], error: rows.error }];
                    return [2 /*return*/, {
                            rows: (_j = rows.data) !== null && _j !== void 0 ? _j : [],
                            expandedParentIds: Array.from(expanded),
                            error: null
                        }];
            }
        });
    });
}
function getShipments(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("shipment")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .neq("sourceDocumentId", "");
            if (args.search) {
                query = query.or("shipmentId.ilike.%".concat(args.search, "%,sourceDocumentReadableId.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "shipmentId", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getShipment(client, shipmentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("shipment").select("*").eq("id", shipmentId).single()];
        });
    });
}
function getShipmentLines(client, shipmentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("shipmentLines")
                    .select("*, fulfillment(*, job(*))")
                    .eq("shipmentId", shipmentId)];
        });
    });
}
function getShipmentLinesWithDetails(client, shipmentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("shipmentLines").select("*").eq("shipmentId", shipmentId)];
        });
    });
}
function getShipmentFiles(client, companyId, lineIds) {
    return __awaiter(this, void 0, void 0, function () {
        var promises, results, firstError;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    promises = lineIds.map(function (lineId) {
                        return client.storage
                            .from("private")
                            .list("".concat(companyId, "/inventory/").concat(lineId))
                            .then(function (result) { return (__assign(__assign({}, result), { lineId: lineId })); });
                    });
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    results = _c.sent();
                    firstError = results.find(function (result) { return result.error; });
                    if (firstError) {
                        return [2 /*return*/, {
                                data: [],
                                error: (_b = (_a = firstError.error) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : "Failed to fetch files"
                            }];
                    }
                    // Merge data arrays and add lineId as bucketName
                    return [2 /*return*/, {
                            data: results.flatMap(function (result) {
                                var _a;
                                return ((_a = result.data) !== null && _a !== void 0 ? _a : []).map(function (file) { return (__assign(__assign({}, file), { bucket: result.lineId })); });
                            }),
                            error: null
                        }];
            }
        });
    });
}
function getShipmentRelatedItems(client, shipmentId, sourceDocumentId) {
    return __awaiter(this, void 0, void 0, function () {
        var salesOrder, invoices;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client
                        .from("salesOrder")
                        .select("*")
                        .eq("id", sourceDocumentId)
                        .single()];
                case 1:
                    salesOrder = _d.sent();
                    return [4 /*yield*/, client
                            .from("salesInvoice")
                            .select("*")
                            .or("shipmentId.eq.".concat(shipmentId, ",opportunityId.eq.").concat((_b = (_a = salesOrder.data) === null || _a === void 0 ? void 0 : _a.opportunityId) !== null && _b !== void 0 ? _b : ""))];
                case 2:
                    invoices = _d.sent();
                    return [2 /*return*/, {
                            invoices: (_c = invoices.data) !== null && _c !== void 0 ? _c : []
                        }];
            }
        });
    });
}
function getShipmentTracking(client, shipmentId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trackedEntity")
                    .select("*")
                    .eq("attributes ->> Shipment", shipmentId)
                    .eq("companyId", companyId)];
        });
    });
}
function getShipmentLineTracking(client, shipmentLineId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trackedEntity")
                    .select("*")
                    .eq("attributes ->> Shipment Line", shipmentLineId)
                    .eq("companyId", companyId)];
        });
    });
}
function getShippingMethod(client, shippingMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("shippingMethod")
                    .select("*")
                    .eq("id", shippingMethodId)
                    .single()];
        });
    });
}
function getShippingMethods(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("shippingMethod")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .eq("active", true);
            if (args.search) {
                query = query.or("name.ilike.%".concat(args.search, "%,carrier.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "name", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getShippingMethodsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("shippingMethod")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .eq("active", true)
                    .order("name", { ascending: true })];
        });
    });
}
function getShippingTermsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("shippingTerm")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .eq("active", true)
                    .order("name", { ascending: true })];
        });
    });
}
function getTrackedEntities(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("trackedEntity")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .neq("status", "Reserved");
            if (args.search) {
                query = query.or("id.ilike.%".concat(args.search, "%,sourceDocumentReadableId.ilike.%").concat(args.search, "%,readableId.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "sourceDocumentReadableId", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getTrackedEntitiesByMakeMethodId(client, jobMakeMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trackedEntity")
                    .select("*")
                    .eq("attributes->>Job Make Method", jobMakeMethodId)
                    .order("createdAt", { ascending: true })];
        });
    });
}
function getTrackedEntity(client, trackedEntityId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trackedEntity")
                    .select("*")
                    .eq("id", trackedEntityId)
                    .single()];
        });
    });
}
/**
 * Manual override of a tracked entity's expirationDate. Records the prior
 * value, the new value, and a reason on the entity's `attributes` JSONB
 * under the "expiryOverrides" array so the trace popover can show the
 * provenance later.
 *
 *   attributes.expiryOverrides = [
 *     {
 *       previous: "2026-04-25" | null,
 *       next:     "2026-05-10",
 *       reason:   "Re-tested and re-certified by QC",
 *       userId,
 *       at:       "2026-04-26T10:11:12Z"
 *     },
 *     ...
 *   ]
 */
function updateTrackedEntityExpiry(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, prevAttrs, prevHistory, nextAttrs;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, client
                        .from("trackedEntity")
                        .select("expirationDate, attributes, status")
                        .eq("id", args.trackedEntityId)
                        .single()];
                case 1:
                    existing = _g.sent();
                    if (existing.error)
                        return [2 /*return*/, existing];
                    if (((_a = existing.data) === null || _a === void 0 ? void 0 : _a.status) === "Consumed") {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "Cannot edit expiry of a consumed tracked entity"
                                }
                            }];
                    }
                    prevAttrs = (_c = (_b = existing.data) === null || _b === void 0 ? void 0 : _b.attributes) !== null && _c !== void 0 ? _c : {};
                    prevHistory = Array.isArray(prevAttrs.expiryOverrides)
                        ? prevAttrs.expiryOverrides
                        : [];
                    nextAttrs = __assign(__assign({}, prevAttrs), { expiryOverrides: __spreadArray(__spreadArray([], prevHistory, true), [
                            {
                                previous: (_e = (_d = existing.data) === null || _d === void 0 ? void 0 : _d.expirationDate) !== null && _e !== void 0 ? _e : null,
                                next: args.expirationDate,
                                reason: args.reason,
                                source: (_f = args.source) !== null && _f !== void 0 ? _f : null,
                                userId: args.userId,
                                at: (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString()
                            }
                        ], false) });
                    return [2 /*return*/, client
                            .from("trackedEntity")
                            .update({
                            expirationDate: args.expirationDate,
                            attributes: nextAttrs
                        })
                            .eq("id", args.trackedEntityId)];
            }
        });
    });
}
function getTrackedEntitiesByOperationId(client, operationId) {
    return __awaiter(this, void 0, void 0, function () {
        var jobOperation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobOperation")
                        .select("jobMakeMethodId")
                        .eq("id", operationId)
                        .single()];
                case 1:
                    jobOperation = _a.sent();
                    if (jobOperation.error || !jobOperation.data.jobMakeMethodId)
                        return [2 /*return*/, {
                                data: null,
                                error: jobOperation.error
                            }];
                    return [2 /*return*/, getTrackedEntitiesByMakeMethodId(client, jobOperation.data.jobMakeMethodId)];
            }
        });
    });
}
function getWarehouseTransfers(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("warehouseTransfer")
                .select("*, fromLocation:location!fromLocationId(name), toLocation:location!toLocationId(name)", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("transferId.ilike.%".concat(args.search, "%,reference.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "transferId", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getWarehouseTransfer(client, transferId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("warehouseTransfer")
                    .select("*, fromLocation:location!fromLocationId(*), toLocation:location!toLocationId(*)")
                    .eq("id", transferId)
                    .single()];
        });
    });
}
function getWarehouseTransferLine(client, transferId, lineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("warehouseTransferLine")
                    .select("*, warehouseTransfer(*, fromLocation:location!fromLocationId(name), toLocation:location!toLocationId(name))")
                    .eq("id", lineId)
                    .eq("transferId", transferId)
                    .single()];
        });
    });
}
function getWarehouseTransferLines(client, transferId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("warehouseTransferLine")
                    .select("*, item(*), fromStorageUnit:storageUnit!fromStorageUnitId(name), toStorageUnit:storageUnit!toStorageUnitId(name)")
                    .eq("transferId", transferId)];
        });
    });
}
function insertManualInventoryAdjustment(client, inventoryAdjustment) {
    return __awaiter(this, void 0, void 0, function () {
        var adjustmentType, readableId, originalStorageUnitId, comment, providedExpirationDate, rest, data, resolveExpirationForNewEntity, applyExpirationOverride, storageUnitQuantities, currentQuantity, currentQuantityOnHand, isStorageUnitTransfer, trackedEntityUpdate, expiryOverride, negativeAdjustment, quantityDifference, trackedEntityUpdate, expiryOverride, resolvedQtyRow, resolvedId, resolvedQty, entityUpdate, legacyQty, trackedEntityUpdate, expiryOverride, _a, item, expirationDate, adjustmentStamp, attributes, trackedEntityInsert;
        var _this = this;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    adjustmentType = inventoryAdjustment.adjustmentType, readableId = inventoryAdjustment.readableId, originalStorageUnitId = inventoryAdjustment.originalStorageUnitId, comment = inventoryAdjustment.comment, providedExpirationDate = inventoryAdjustment.expirationDate, rest = __rest(inventoryAdjustment, ["adjustmentType", "readableId", "originalStorageUnitId", "comment", "expirationDate"]);
                    data = __assign(__assign({}, rest), { entryType: adjustmentType === "Set Quantity" ? "Positive Adjmt." : adjustmentType, comment: comment || null });
                    resolveExpirationForNewEntity = function () { return __awaiter(_this, void 0, void 0, function () {
                        var shelfLife;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (providedExpirationDate)
                                        return [2 /*return*/, providedExpirationDate];
                                    return [4 /*yield*/, client
                                            .from("itemShelfLife")
                                            .select("mode, days")
                                            .eq("itemId", inventoryAdjustment.itemId)
                                            .maybeSingle()];
                                case 1:
                                    shelfLife = _b.sent();
                                    if (!shelfLife.error &&
                                        ((_a = shelfLife.data) === null || _a === void 0 ? void 0 : _a.mode) === "Fixed Duration" &&
                                        shelfLife.data.days) {
                                        return [2 /*return*/, (0, date_1.today)((0, date_1.getLocalTimeZone)())
                                                .add({ days: Number(shelfLife.data.days) })
                                                .toString()];
                                    }
                                    return [2 /*return*/, null];
                            }
                        });
                    }); };
                    applyExpirationOverride = function (trackedEntityId) { return __awaiter(_this, void 0, void 0, function () {
                        var current;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!providedExpirationDate)
                                        return [2 /*return*/, null];
                                    return [4 /*yield*/, client
                                            .from("trackedEntity")
                                            .select("expirationDate")
                                            .eq("id", trackedEntityId)
                                            .single()];
                                case 1:
                                    current = _b.sent();
                                    if (!current.error &&
                                        ((_a = current.data) === null || _a === void 0 ? void 0 : _a.expirationDate) === providedExpirationDate)
                                        return [2 /*return*/, null];
                                    return [2 /*return*/, updateTrackedEntityExpiry(client, {
                                            trackedEntityId: trackedEntityId,
                                            expirationDate: providedExpirationDate,
                                            reason: (comment === null || comment === void 0 ? void 0 : comment.trim()) || "Updated via inventory adjustment",
                                            source: "Inventory Adjustment",
                                            userId: data.createdBy
                                        })];
                            }
                        });
                    }); };
                    return [4 /*yield*/, client.rpc("get_item_quantities_by_tracking_id", {
                            item_id: data.itemId,
                            company_id: data.companyId,
                            location_id: data.locationId
                        })];
                case 1:
                    storageUnitQuantities = _l.sent();
                    currentQuantity = inventoryAdjustment.trackedEntityId
                        ? (_b = storageUnitQuantities === null || storageUnitQuantities === void 0 ? void 0 : storageUnitQuantities.data) === null || _b === void 0 ? void 0 : _b.find(function (quantity) {
                            return quantity.trackedEntityId == inventoryAdjustment.trackedEntityId;
                        })
                        : (_c = storageUnitQuantities === null || storageUnitQuantities === void 0 ? void 0 : storageUnitQuantities.data) === null || _c === void 0 ? void 0 : _c.find(
                        // null == undefined - so we use a == instead of === here
                        function (quantity) { return quantity.storageUnitId == data.storageUnitId; });
                    currentQuantityOnHand = (_d = currentQuantity === null || currentQuantity === void 0 ? void 0 : currentQuantity.quantity) !== null && _d !== void 0 ? _d : 0;
                    isStorageUnitTransfer = inventoryAdjustment.trackedEntityId &&
                        originalStorageUnitId &&
                        originalStorageUnitId !== data.storageUnitId;
                    if (!isStorageUnitTransfer) return [3 /*break*/, 7];
                    if (!(readableId !== undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .update({ readableId: readableId })
                            // @ts-expect-error TS2345 - TODO: fix type
                            .eq("id", inventoryAdjustment.trackedEntityId)];
                case 2:
                    trackedEntityUpdate = _l.sent();
                    if (trackedEntityUpdate.error) {
                        return [2 /*return*/, trackedEntityUpdate];
                    }
                    _l.label = 3;
                case 3:
                    if (!inventoryAdjustment.trackedEntityId) return [3 /*break*/, 5];
                    return [4 /*yield*/, applyExpirationOverride(inventoryAdjustment.trackedEntityId)];
                case 4:
                    expiryOverride = _l.sent();
                    if (expiryOverride === null || expiryOverride === void 0 ? void 0 : expiryOverride.error)
                        return [2 /*return*/, expiryOverride];
                    _l.label = 5;
                case 5: return [4 /*yield*/, client
                        .from("itemLedger")
                        .insert([
                        {
                            itemId: data.itemId,
                            locationId: data.locationId,
                            storageUnitId: originalStorageUnitId,
                            trackedEntityId: inventoryAdjustment.trackedEntityId,
                            entryType: "Negative Adjmt.",
                            quantity: -currentQuantityOnHand,
                            companyId: data.companyId,
                            createdBy: data.createdBy,
                            comment: data.comment
                        }
                    ])
                        .select("*")
                        .single()];
                case 6:
                    negativeAdjustment = _l.sent();
                    if (negativeAdjustment.error) {
                        return [2 /*return*/, negativeAdjustment];
                    }
                    // Create positive adjustment at new storage unit
                    return [2 /*return*/, client
                            .from("itemLedger")
                            .insert([
                            {
                                itemId: data.itemId,
                                locationId: data.locationId,
                                storageUnitId: data.storageUnitId,
                                trackedEntityId: inventoryAdjustment.trackedEntityId,
                                entryType: "Positive Adjmt.",
                                quantity: currentQuantityOnHand,
                                companyId: data.companyId,
                                createdBy: data.createdBy,
                                comment: data.comment
                            }
                        ])
                            .select("*")
                            .single()];
                case 7:
                    if (!(adjustmentType === "Set Quantity" && currentQuantity)) return [3 /*break*/, 14];
                    quantityDifference = data.quantity - currentQuantityOnHand;
                    if (!(quantityDifference > 0)) return [3 /*break*/, 8];
                    data.entryType = "Positive Adjmt.";
                    data.quantity = quantityDifference;
                    return [3 /*break*/, 14];
                case 8:
                    if (!(quantityDifference < 0)) return [3 /*break*/, 9];
                    data.entryType = "Negative Adjmt.";
                    data.quantity = -Math.abs(quantityDifference);
                    return [3 /*break*/, 14];
                case 9:
                    if (!(inventoryAdjustment.trackedEntityId && readableId !== undefined)) return [3 /*break*/, 11];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .update({ readableId: readableId })
                            .eq("id", inventoryAdjustment.trackedEntityId)];
                case 10:
                    trackedEntityUpdate = _l.sent();
                    if (trackedEntityUpdate.error)
                        return [2 /*return*/, trackedEntityUpdate];
                    _l.label = 11;
                case 11:
                    if (!inventoryAdjustment.trackedEntityId) return [3 /*break*/, 13];
                    return [4 /*yield*/, applyExpirationOverride(inventoryAdjustment.trackedEntityId)];
                case 12:
                    expiryOverride = _l.sent();
                    if (expiryOverride === null || expiryOverride === void 0 ? void 0 : expiryOverride.error)
                        return [2 /*return*/, expiryOverride];
                    _l.label = 13;
                case 13: return [2 /*return*/, { data: null }];
                case 14:
                    if (!(data.entryType === "Negative Adjmt." &&
                        (readableId || !currentQuantity))) return [3 /*break*/, 17];
                    if (!readableId) return [3 /*break*/, 16];
                    resolvedQtyRow = (_e = storageUnitQuantities === null || storageUnitQuantities === void 0 ? void 0 : storageUnitQuantities.data) === null || _e === void 0 ? void 0 : _e.find(function (q) {
                        var _a;
                        return q.readableId === readableId &&
                            q.trackedEntityId != null &&
                            ((_a = q.quantity) !== null && _a !== void 0 ? _a : 0) > 0;
                    });
                    if (!resolvedQtyRow) {
                        return [2 /*return*/, { error: "Serial number not found" }];
                    }
                    resolvedId = resolvedQtyRow.trackedEntityId;
                    resolvedQty = (_f = resolvedQtyRow.quantity) !== null && _f !== void 0 ? _f : 0;
                    if (data.quantity > resolvedQty) {
                        return [2 /*return*/, { error: "Insufficient quantity for negative adjustment" }];
                    }
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .update({ quantity: resolvedQty - data.quantity, readableId: readableId })
                            .eq("id", resolvedId)];
                case 15:
                    entityUpdate = _l.sent();
                    if (entityUpdate.error)
                        return [2 /*return*/, entityUpdate];
                    return [2 /*return*/, client
                            .from("itemLedger")
                            .insert([
                            __assign(__assign({}, data), { trackedEntityId: resolvedId, quantity: -Math.abs(data.quantity) })
                        ])
                            .select("*")
                            .single()];
                case 16:
                    legacyQty = (_j = (_h = (_g = storageUnitQuantities === null || storageUnitQuantities === void 0 ? void 0 : storageUnitQuantities.data) === null || _g === void 0 ? void 0 : _g.find(function (q) {
                        return q.trackedEntityId == null && q.storageUnitId == data.storageUnitId;
                    })) === null || _h === void 0 ? void 0 : _h.quantity) !== null && _j !== void 0 ? _j : 0;
                    if (data.quantity > legacyQty) {
                        return [2 /*return*/, { error: "Insufficient quantity for negative adjustment" }];
                    }
                    return [2 /*return*/, client
                            .from("itemLedger")
                            .insert([
                            __assign(__assign({}, data), { trackedEntityId: null, quantity: -Math.abs(data.quantity) })
                        ])
                            .select("*")
                            .single()];
                case 17:
                    // Check if it's a negative adjustment and if the quantity is sufficient
                    if (data.entryType === "Negative Adjmt.") {
                        if (data.quantity > currentQuantityOnHand) {
                            return [2 /*return*/, {
                                    error: "Insufficient quantity for negative adjustment"
                                }];
                        }
                        data.quantity = -Math.abs(data.quantity);
                    }
                    if (!inventoryAdjustment.trackedEntityId) return [3 /*break*/, 23];
                    if (!currentQuantity) return [3 /*break*/, 20];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .update({
                            quantity: data.quantity + currentQuantityOnHand,
                            readableId: readableId
                        })
                            .eq("id", inventoryAdjustment.trackedEntityId)];
                case 18:
                    trackedEntityUpdate = _l.sent();
                    if (trackedEntityUpdate.error) {
                        return [2 /*return*/, trackedEntityUpdate];
                    }
                    return [4 /*yield*/, applyExpirationOverride(inventoryAdjustment.trackedEntityId)];
                case 19:
                    expiryOverride = _l.sent();
                    if (expiryOverride === null || expiryOverride === void 0 ? void 0 : expiryOverride.error)
                        return [2 /*return*/, expiryOverride];
                    return [3 /*break*/, 23];
                case 20: return [4 /*yield*/, Promise.all([
                        client.from("item").select("*").eq("id", data.itemId).single(),
                        resolveExpirationForNewEntity()
                    ])];
                case 21:
                    _a = _l.sent(), item = _a[0], expirationDate = _a[1];
                    adjustmentStamp = {
                        userId: data.createdBy,
                        at: (0, date_1.now)((0, date_1.getLocalTimeZone)()).toAbsoluteString(),
                        reason: (comment === null || comment === void 0 ? void 0 : comment.trim()) || "Created via inventory adjustment"
                    };
                    attributes = __assign({ "Inventory Adjustment": adjustmentStamp }, (expirationDate
                        ? {
                            expiryOverrides: [
                                {
                                    previous: null,
                                    next: expirationDate,
                                    reason: adjustmentStamp.reason,
                                    source: "Inventory Adjustment",
                                    userId: adjustmentStamp.userId,
                                    at: adjustmentStamp.at
                                }
                            ]
                        }
                        : {}));
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .insert([
                            {
                                id: inventoryAdjustment.trackedEntityId,
                                sourceDocument: "Item",
                                sourceDocumentId: data.itemId,
                                sourceDocumentReadableId: (_k = item.data) === null || _k === void 0 ? void 0 : _k.readableIdWithRevision,
                                readableId: readableId,
                                quantity: data.quantity,
                                status: "Available",
                                expirationDate: expirationDate,
                                attributes: attributes,
                                companyId: data.companyId,
                                createdBy: data.createdBy
                            }
                        ])
                            .select("*")
                            .single()];
                case 22:
                    trackedEntityInsert = _l.sent();
                    if (trackedEntityInsert.error) {
                        return [2 /*return*/, trackedEntityInsert];
                    }
                    _l.label = 23;
                case 23: return [2 /*return*/, client.from("itemLedger").insert([data]).select("*").single()];
            }
        });
    });
}
function updateBatchPropertyOrder(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("batchProperty").update((0, supabase_1.sanitize)(data)).eq("id", data.id)];
        });
    });
}
function updateStockTransferStatus(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var id, status, assignee, completedAt, updatedBy;
        return __generator(this, function (_a) {
            id = args.id, status = args.status, assignee = args.assignee, completedAt = args.completedAt, updatedBy = args.updatedBy;
            return [2 /*return*/, client
                    .from("stockTransfer")
                    .update({
                    status: status,
                    assignee: assignee,
                    completedAt: completedAt,
                    updatedBy: updatedBy
                })
                    .eq("id", id)];
        });
    });
}
function upsertBatchProperty(client, batchProperty) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, data;
        return __generator(this, function (_a) {
            userId = batchProperty.userId, data = __rest(batchProperty, ["userId"]);
            if (batchProperty.id) {
                return [2 /*return*/, client
                        .from("batchProperty")
                        .update((0, supabase_1.sanitize)(__assign(__assign({}, data), { updatedBy: userId, updatedAt: new Date().toISOString() })))
                        .eq("id", batchProperty.id)];
            }
            return [2 /*return*/, client.from("batchProperty").insert(__assign(__assign({}, data), { createdBy: userId }))];
        });
    });
}
function upsertKanban(client, kanban) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in kanban) {
                return [2 /*return*/, client
                        .from("kanban")
                        .insert(__assign({}, kanban))
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("kanban")
                    .update(__assign(__assign({}, (0, supabase_1.sanitize)(kanban)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                    .eq("id", kanban.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertReceipt(client, receipt) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in receipt) {
                return [2 /*return*/, client.from("receipt").insert([receipt]).select("*").single()];
            }
            return [2 /*return*/, client
                    .from("receipt")
                    .update(__assign(__assign({}, (0, supabase_1.sanitize)(receipt)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                    .eq("id", receipt.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertStorageUnit(client, storageUnit) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in storageUnit) {
                return [2 /*return*/, client
                        .from("storageUnit")
                        .insert(__assign(__assign({}, storageUnit), { id: (0, nanoid_1.nanoid)() }))
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("storageUnit")
                    .update(__assign(__assign({}, (0, supabase_1.sanitize)(storageUnit)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                    .eq("id", storageUnit.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertShippingMethod(client, shippingMethod) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in shippingMethod) {
                return [2 /*return*/, client
                        .from("shippingMethod")
                        .insert([shippingMethod])
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("shippingMethod")
                    .update((0, supabase_1.sanitize)(shippingMethod))
                    .eq("id", shippingMethod.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertShipment(client, shipment) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in shipment) {
                return [2 /*return*/, client.from("shipment").insert([shipment]).select("*").single()];
            }
            return [2 /*return*/, client
                    .from("shipment")
                    .update(__assign(__assign({}, (0, supabase_1.sanitize)(shipment)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                    .eq("id", shipment.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertStockTransfer(client, stockTransfer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in stockTransfer) {
                return [2 /*return*/, client
                        .from("stockTransfer")
                        .insert(__assign(__assign({}, stockTransfer), { status: "Released" }))
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("stockTransfer")
                    .update((0, supabase_1.sanitize)(stockTransfer))
                    .eq("id", stockTransfer.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertStockTransferLine(client, stockTransferLine) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in stockTransferLine) {
                return [2 /*return*/, client
                        .from("stockTransferLine")
                        .insert(stockTransferLine)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("stockTransferLine")
                    .update((0, supabase_1.sanitize)(stockTransferLine))
                    .eq("id", stockTransferLine.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertStockTransferLines(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var lines, stockTransferId, companyId, createdBy;
        return __generator(this, function (_a) {
            lines = args.lines, stockTransferId = args.stockTransferId, companyId = args.companyId, createdBy = args.createdBy;
            return [2 /*return*/, client.from("stockTransferLine").insert(lines.map(function (line) { return (__assign(__assign({}, line), { stockTransferId: stockTransferId, companyId: companyId, createdBy: createdBy })); }))];
        });
    });
}
function upsertWarehouseTransfer(client, transfer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in transfer) {
                return [2 /*return*/, client
                        .from("warehouseTransfer")
                        .insert([transfer])
                        .select("*")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("warehouseTransfer")
                    .update(__assign(__assign({}, (0, supabase_1.sanitize)(transfer)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                    .eq("id", transfer.id)
                    .select("id")
                    .single()];
        });
    });
}
function updateWarehouseTransferStatus(client, transferId, status, updatedBy) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("warehouseTransfer")
                    .update({
                    status: status,
                    updatedBy: updatedBy,
                    updatedAt: new Date().toISOString()
                })
                    .eq("id", transferId)];
        });
    });
}
function upsertWarehouseTransferLine(client, line) {
    return __awaiter(this, void 0, void 0, function () {
        var id, updateData;
        return __generator(this, function (_a) {
            if ("id" in line && line.id) {
                id = line.id, updateData = __rest(line, ["id"]);
                return [2 /*return*/, client
                        .from("warehouseTransferLine")
                        .update(__assign(__assign({}, updateData), { updatedAt: new Date().toISOString() }))
                        .eq("id", id)
                        .select()
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("warehouseTransferLine")
                        .insert(__assign(__assign({}, line), { createdAt: new Date().toISOString() }))
                        .select()
                        .single()];
            }
            return [2 /*return*/];
        });
    });
}
function getDefaultStorageUnitForJob(client, itemId, locationId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var pickMethod, itemStorageUnitQuantities, storageUnitWithHighestQuantity;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("pickMethod")
                        .select("defaultStorageUnitId")
                        .eq("itemId", itemId)
                        .eq("locationId", locationId)
                        .eq("companyId", companyId)
                        .maybeSingle()];
                case 1:
                    pickMethod = _c.sent();
                    if ((_a = pickMethod.data) === null || _a === void 0 ? void 0 : _a.defaultStorageUnitId) {
                        return [2 /*return*/, pickMethod.data.defaultStorageUnitId];
                    }
                    return [4 /*yield*/, (0, items_service_1.getItemStorageUnitQuantities)(client, itemId, companyId, locationId)];
                case 2:
                    itemStorageUnitQuantities = _c.sent();
                    if ((_b = itemStorageUnitQuantities.data) === null || _b === void 0 ? void 0 : _b.length) {
                        storageUnitWithHighestQuantity = itemStorageUnitQuantities.data.reduce(function (max, current) {
                            var _a, _b;
                            return ((_a = current.quantity) !== null && _a !== void 0 ? _a : 0) > ((_b = max.quantity) !== null && _b !== void 0 ? _b : 0) ? current : max;
                        });
                        return [2 /*return*/, storageUnitWithHighestQuantity.storageUnitId];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
// ----------------------------------------------------------------------------
// storageUnit hierarchy helpers (backed by the storageUnits_recursive view
// defined in 20260417000200_storage-unit-nesting-and-type.sql)
// ----------------------------------------------------------------------------
function getStorageUnitTree(client, companyId, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("storageUnits_recursive")
                    .select("id, parentId, locationId, warehouseId, name, active, storageTypeIds, companyId, depth, ancestorPath")
                    .eq("companyId", companyId)
                    .eq("locationId", locationId)
                    .order("ancestorPath")];
        });
    });
}
function getStorageUnitDescendants(client, storageUnitId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("storageUnits_recursive")
                    .select("id, parentId, locationId, warehouseId, name, active, storageTypeIds, companyId, depth, ancestorPath")
                    .contains("ancestorPath", [storageUnitId])];
        });
    });
}
function expandStorageUnitIdsWithDescendants(client, storageUnitIds) {
    return __awaiter(this, void 0, void 0, function () {
        var data, expanded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (storageUnitIds.length === 0)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, client
                            .from("storageUnits_recursive")
                            .select("id")
                            .overlaps("ancestorPath", storageUnitIds)];
                case 1:
                    data = (_a.sent()).data;
                    expanded = new Set(storageUnitIds);
                    (data !== null && data !== void 0 ? data : []).forEach(function (row) {
                        if (row.id)
                            expanded.add(row.id);
                    });
                    return [2 /*return*/, Array.from(expanded)];
            }
        });
    });
}
// ----------------------------------------------------------------------------
// storageType CRUD (mirrors materialType in items.service.ts)
// ----------------------------------------------------------------------------
function getStorageTypeUsage(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("storageUnit")
                    .select("id, name", { count: "exact" })
                    .eq("companyId", companyId)
                    .contains("storageTypeIds", [id])
                    .limit(5)];
        });
    });
}
function deleteStorageTypeWithCascade(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, units, fetchError, _i, _b, unit, next, updateError;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client
                        .from("storageUnit")
                        .select("id, storageTypeIds")
                        .eq("companyId", companyId)
                        .contains("storageTypeIds", [id])];
                case 1:
                    _a = _d.sent(), units = _a.data, fetchError = _a.error;
                    if (fetchError)
                        return [2 /*return*/, { error: fetchError }];
                    _i = 0, _b = units !== null && units !== void 0 ? units : [];
                    _d.label = 2;
                case 2:
                    if (!(_i < _b.length)) return [3 /*break*/, 5];
                    unit = _b[_i];
                    next = ((_c = unit.storageTypeIds) !== null && _c !== void 0 ? _c : []).filter(function (x) { return x !== id; });
                    return [4 /*yield*/, client
                            .from("storageUnit")
                            .update({ storageTypeIds: next })
                            .eq("id", unit.id)];
                case 3:
                    updateError = (_d.sent()).error;
                    if (updateError)
                        return [2 /*return*/, { error: updateError }];
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, client.from("storageType").delete().eq("id", id)];
            }
        });
    });
}
function getStorageTypes(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("storageType")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args !== null && args !== void 0 ? args : {}, [
                { column: "name", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getStorageType(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("storageType").select("*").eq("id", id).single()];
        });
    });
}
function getStorageTypesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "storageType", "id, name", function (query) {
                    return query.eq("companyId", companyId).order("name");
                })];
        });
    });
}
function upsertStorageType(client, storageType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in storageType) {
                return [2 /*return*/, client
                        .from("storageType")
                        .insert(__assign({}, storageType))
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("storageType")
                    .update(__assign(__assign({}, (0, supabase_1.sanitize)(storageType)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                    .eq("id", storageType.id)
                    .select("id")
                    .single()];
        });
    });
}
function getShelfLifeForItems(client, itemIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (itemIds.length === 0)
                return [2 /*return*/, { data: [], error: null }];
            return [2 /*return*/, client
                    .from("itemShelfLife")
                    .select("itemId, mode, days")
                    .in("itemId", itemIds)];
        });
    });
}
/**
 * Map of trackedEntityId → expirationDate (or null) for a set of ids.
 * Used by the inventory adjustment modal to prefill the date picker when
 * editing an existing batch / serial.
 */
function getTrackedEntityExpirations(client, trackedEntityIds) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (trackedEntityIds.length === 0)
                        return [2 /*return*/, {}];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("id, expirationDate")
                            .in("id", trackedEntityIds)];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, ((_a = result.data) !== null && _a !== void 0 ? _a : []).reduce(function (acc, row) {
                            var _a;
                            acc[row.id] = (_a = row.expirationDate) !== null && _a !== void 0 ? _a : null;
                            return acc;
                        }, {})];
            }
        });
    });
}
// ----------------------------------------------------------------------------
// Picking List CRUD
// ----------------------------------------------------------------------------
function getPickingLists(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("pickingLists")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.ilike("pickingListId", "%".concat(args.search, "%"));
            }
            if (args.status) {
                query = query.eq("status", args.status);
            }
            if (args.assignee) {
                query = query.eq("assignee", args.assignee);
            }
            if (args.locationId) {
                query = query.eq("locationId", args.locationId);
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "pickingListId", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getPickingList(client, pickingListId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("pickingList")
                    .select("*, location:location(name), assigneeUser:user!pickingList_assignee_fkey(fullName, avatarUrl)")
                    .eq("id", pickingListId)
                    .single()];
        });
    });
}
function getPickingListLines(client, pickingListId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("pickingListLine")
                    .select("*, item(name, readableId, itemTrackingType), job(jobId), jobOperation(order, processId, workCenterId, process:process(name), workCenter:workCenter(name)), storageUnit:storageUnit!pickingListLine_storageUnitId_fkey(name, locationId), toStorageUnit:storageUnit!pickingListLine_toStorageUnitId_fkey(name, locationId), trackedEntities:pickingListLineTrackedEntity(trackedEntityId, quantity, quantityPicked, trackedEntity(readableId))")
                    .eq("pickingListId", pickingListId)
                    .order("jobOperationId")
                    .order("itemId")];
        });
    });
}
/**
 * Per-line WAREHOUSE (non-lineside, incl. the unassigned/null bin) on-hand for
 * a picking list's items — drives the "No Stock" warning. Returns a map of
 * pickingListLineId → availableQuantity.
 */
function getPickingListAvailability(client, pickingListId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, map, _i, _a, row;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client.rpc("get_picking_list_availability", {
                        p_picking_list_id: pickingListId
                    })];
                case 1:
                    result = _d.sent();
                    map = new Map();
                    for (_i = 0, _a = (_b = result.data) !== null && _b !== void 0 ? _b : []; _i < _a.length; _i++) {
                        row = _a[_i];
                        map.set(row.pickingListLineId, Number((_c = row.availableQuantity) !== null && _c !== void 0 ? _c : 0));
                    }
                    return [2 /*return*/, map];
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
function getPickingListLine(client, lineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("pickingListLine")
                    .select("*, item(name, readableId), job(jobId), jobOperation(order, processId, workCenterId, process:process(name), workCenter:workCenter(name)), storageUnit:storageUnit!pickingListLine_storageUnitId_fkey(name, locationId), toStorageUnit:storageUnit!pickingListLine_toStorageUnitId_fkey(name, locationId), pickingList(pickingListId, status)")
                    .eq("id", lineId)
                    .single()];
        });
    });
}
function getPickingListLineTrackedEntities(client, lineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("pickingListLineTrackedEntity")
                    .select("*, trackedEntity(readableId, quantity, expirationDate)")
                    .eq("pickingListLineId", lineId)];
        });
    });
}
/**
 * Pick (or unpick) a tracked (serial/batch) lot for a picking line. A pick
 * MOVES the chosen lot from its warehouse bin to the line's lineside shelf via
 * the `post-picking` edge function (serial/batch), records it on the line, and
 * points the job material at lineside. `unpick` reverses it.
 */
function setPickingListLineTrackedEntity(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var lineResult, line, pickingList, item, isSerial, isBatch, type, body, result, ctx, message, parsed, _a;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, client
                        .from("pickingListLine")
                        .select("*, pickingList(locationId, companyId, status), item(itemTrackingType)")
                        .eq("id", args.pickingListLineId)
                        .single()];
                case 1:
                    lineResult = _f.sent();
                    if (lineResult.error || !lineResult.data) {
                        return [2 /*return*/, { data: null, error: (_b = lineResult.error) !== null && _b !== void 0 ? _b : "Line not found" }];
                    }
                    line = lineResult.data;
                    pickingList = line.pickingList;
                    item = line.item;
                    if (!pickingList) {
                        return [2 /*return*/, { data: null, error: "Missing related data" }];
                    }
                    if ((0, inventory_models_1.isPickingListLocked)(pickingList.status)) {
                        return [2 /*return*/, {
                                data: null,
                                error: "This picking list is closed. Reopen it to make changes."
                            }];
                    }
                    isSerial = (item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Serial";
                    isBatch = (item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Batch";
                    if (!isSerial && !isBatch) {
                        return [2 /*return*/, { data: null, error: "This line is not a tracked item" }];
                    }
                    if (!args.unpick && !line.toStorageUnitId) {
                        return [2 /*return*/, {
                                data: null,
                                error: "No lineside destination is set for this line"
                            }];
                    }
                    type = args.unpick
                        ? isSerial
                            ? "unpickSerial"
                            : "unpickBatch"
                        : isSerial
                            ? "serial"
                            : "batch";
                    body = {
                        type: type,
                        pickingListId: line.pickingListId,
                        pickingListLineId: line.id,
                        trackedEntityId: args.trackedEntityId,
                        locationId: pickingList.locationId,
                        userId: args.userId,
                        companyId: pickingList.companyId
                    };
                    if (!args.unpick) {
                        body.fromStorageUnitId = (_c = args.fromStorageUnitId) !== null && _c !== void 0 ? _c : null;
                        if (isBatch)
                            body.quantity = Math.max(1, (_d = args.quantity) !== null && _d !== void 0 ? _d : 1);
                    }
                    return [4 /*yield*/, client.functions.invoke("post-picking", { body: body })];
                case 2:
                    result = _f.sent();
                    if (!result.error) return [3 /*break*/, 9];
                    ctx = (_e = result.error) === null || _e === void 0 ? void 0 : _e.context;
                    message = "Failed to pick material";
                    if (!(ctx && typeof ctx.json === "function")) return [3 /*break*/, 7];
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, ctx.clone().json()];
                case 4:
                    parsed = _f.sent();
                    if (parsed === null || parsed === void 0 ? void 0 : parsed.message)
                        message = parsed.message;
                    return [3 /*break*/, 6];
                case 5:
                    _a = _f.sent();
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 8];
                case 7:
                    if (result.error.message) {
                        message = result.error.message;
                    }
                    _f.label = 8;
                case 8: return [2 /*return*/, { data: null, error: message }];
                case 9: return [2 /*return*/, { data: { id: args.pickingListLineId }, error: null }];
            }
        });
    });
}
function upsertPickingList(client, pickingList) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in pickingList) {
                return [2 /*return*/, client
                        .from("pickingList")
                        .insert([pickingList])
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("pickingList")
                    .update(__assign(__assign({}, (0, supabase_1.sanitize)(pickingList)), { updatedAt: new Date().toISOString() }))
                    .eq("id", pickingList.id)
                    .select("id")
                    .single()];
        });
    });
}
function updatePickingListStatus(client, pickingListId, status, updatedBy) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("pickingList")
                    .update({
                    status: status,
                    updatedBy: updatedBy,
                    updatedAt: new Date().toISOString()
                })
                    .eq("id", pickingListId)];
        });
    });
}
function upsertPickingListLine(client, line) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in line) {
                return [2 /*return*/, client.from("pickingListLine").insert([line]).select("id").single()];
            }
            return [2 /*return*/, client
                    .from("pickingListLine")
                    .update(__assign(__assign({}, (0, supabase_1.sanitize)(line)), { updatedAt: new Date().toISOString() }))
                    .eq("id", line.id)
                    .select("id")
                    .single()];
        });
    });
}
function deletePickingList(client, pickingListId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("pickingList").delete().eq("id", pickingListId)];
        });
    });
}
function deletePickingListLine(client, lineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("pickingListLine").delete().eq("id", lineId)];
        });
    });
}
// ----------------------------------------------------------------------------
// Picking List Business Logic
// ----------------------------------------------------------------------------
function getPickingSchedule(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            return [2 /*return*/, client.rpc("get_picking_schedule", {
                    p_location_id: args.locationId,
                    p_company_id: args.companyId,
                    p_search: (_a = args.search) !== null && _a !== void 0 ? _a : undefined
                })];
        });
    });
}
/**
 * On-hand of an item at a location, aggregated per storage unit (bin).
 *
 * `getItemStorageUnitQuantities` can return a row per tracked entity, so we sum
 * to one figure per bin. Computed once per material and reused to (a) decide
 * whether the op's lineside bin is already stocked and (b) resolve a warehouse
 * source by on-hand.
 */
function getItemOnHandByStorageUnit(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var quantities, byUnit, _i, _a, row, unitId, qty;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, items_service_1.getItemStorageUnitQuantities)(client, args.itemId, args.companyId, args.locationId)];
                case 1:
                    quantities = _e.sent();
                    byUnit = new Map();
                    for (_i = 0, _a = (_b = quantities.data) !== null && _b !== void 0 ? _b : []; _i < _a.length; _i++) {
                        row = _a[_i];
                        unitId = row.storageUnitId;
                        if (!unitId)
                            continue;
                        qty = Number((_c = row.quantity) !== null && _c !== void 0 ? _c : 0);
                        byUnit.set(unitId, ((_d = byUnit.get(unitId)) !== null && _d !== void 0 ? _d : 0) + qty);
                    }
                    return [2 /*return*/, byUnit];
            }
        });
    });
}
/**
 * Resolve a WAREHOUSE (non-lineside) source storage unit for a pick by on-hand.
 *
 * Returns the non-lineside storage unit holding the most on-hand of the item at
 * the location, or null when no warehouse stock exists (a shortage — we never
 * source a pick from another work center's lineside bin). A storage unit is
 * "lineside" when it resolves to a work center via `get_effective_work_center_id`.
 */
function resolveWarehouseSource(client, onHandByUnit) {
    return __awaiter(this, void 0, void 0, function () {
        var candidates, _i, candidates_1, storageUnitId, effectiveWc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    candidates = Array.from(onHandByUnit.entries())
                        .filter(function (_a) {
                        var qty = _a[1];
                        return qty > 0;
                    })
                        .sort(function (a, b) { return b[1] - a[1]; });
                    _i = 0, candidates_1 = candidates;
                    _a.label = 1;
                case 1:
                    if (!(_i < candidates_1.length)) return [3 /*break*/, 4];
                    storageUnitId = candidates_1[_i][0];
                    return [4 /*yield*/, client.rpc("get_effective_work_center_id", {
                            p_storage_unit_id: storageUnitId
                        })];
                case 2:
                    effectiveWc = _a.sent();
                    // First non-lineside bin (no work center) with the most on-hand wins.
                    if (!effectiveWc.data)
                        return [2 /*return*/, storageUnitId];
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, null];
            }
        });
    });
}
function generatePickingList(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var sequenceResult, pickingListId, headerInsert, plId, materials, operations, workCenterByOperation, _i, _a, op, linesideByWorkCenter, resolveLineside, lineRows, _b, _c, mat, quantityToIssue, opWorkCenterId, toStorageUnitId, onHandByUnit, materialEffectiveWc, effectiveWc, sourceStorageUnitId, _d, linesInsert;
        var _this = this;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0: return [4 /*yield*/, (0, settings_1.getNextSequence)(client, "pickingList", args.companyId)];
                case 1:
                    sequenceResult = _r.sent();
                    if (sequenceResult.error || !sequenceResult.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_e = sequenceResult.error) !== null && _e !== void 0 ? _e : "Failed to get sequence"
                            }];
                    }
                    pickingListId = sequenceResult.data;
                    return [4 /*yield*/, client
                            .from("pickingList")
                            .insert([
                            {
                                pickingListId: pickingListId,
                                status: "Draft",
                                locationId: args.locationId,
                                assignee: (_f = args.assignee) !== null && _f !== void 0 ? _f : null,
                                dueDate: (_g = args.dueDate) !== null && _g !== void 0 ? _g : null,
                                companyId: args.companyId,
                                createdBy: args.createdBy
                            }
                        ])
                            .select("id, pickingListId")
                            .single()];
                case 2:
                    headerInsert = _r.sent();
                    if (headerInsert.error) {
                        return [2 /*return*/, { data: null, error: headerInsert.error }];
                    }
                    plId = headerInsert.data.id;
                    return [4 /*yield*/, client
                            .from("jobMaterial")
                            .select("id, jobId, jobOperationId, itemId, quantityToIssue, storageUnitId, requiresSerialTracking, requiresBatchTracking")
                            .in("jobOperationId", args.jobOperationIds)
                            .gt("quantityToIssue", 0)];
                case 3:
                    materials = _r.sent();
                    if (!materials.error) return [3 /*break*/, 5];
                    return [4 /*yield*/, client.from("pickingList").delete().eq("id", plId)];
                case 4:
                    _r.sent();
                    return [2 /*return*/, { data: null, error: materials.error }];
                case 5: return [4 /*yield*/, client
                        .from("jobOperation")
                        .select("id, workCenterId")
                        .in("id", args.jobOperationIds)];
                case 6:
                    operations = _r.sent();
                    workCenterByOperation = new Map();
                    for (_i = 0, _a = (_h = operations.data) !== null && _h !== void 0 ? _h : []; _i < _a.length; _i++) {
                        op = _a[_i];
                        workCenterByOperation.set(op.id, (_j = op.workCenterId) !== null && _j !== void 0 ? _j : null);
                    }
                    linesideByWorkCenter = new Map();
                    resolveLineside = function (workCenterId) { return __awaiter(_this, void 0, void 0, function () {
                        var result, linesideId;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (!workCenterId)
                                        return [2 /*return*/, null];
                                    if (linesideByWorkCenter.has(workCenterId)) {
                                        return [2 /*return*/, (_a = linesideByWorkCenter.get(workCenterId)) !== null && _a !== void 0 ? _a : null];
                                    }
                                    return [4 /*yield*/, client.rpc("get_or_create_work_center_lineside", {
                                            p_work_center_id: workCenterId,
                                            p_company_id: args.companyId,
                                            p_user_id: args.createdBy
                                        })];
                                case 1:
                                    result = _c.sent();
                                    linesideId = (_b = result.data) !== null && _b !== void 0 ? _b : null;
                                    linesideByWorkCenter.set(workCenterId, linesideId);
                                    return [2 /*return*/, linesideId];
                            }
                        });
                    }); };
                    lineRows = [];
                    _b = 0, _c = (_k = materials.data) !== null && _k !== void 0 ? _k : [];
                    _r.label = 7;
                case 7:
                    if (!(_b < _c.length)) return [3 /*break*/, 16];
                    mat = _c[_b];
                    quantityToIssue = Number((_l = mat.quantityToIssue) !== null && _l !== void 0 ? _l : 0);
                    if (quantityToIssue <= 0)
                        return [3 /*break*/, 15];
                    opWorkCenterId = mat.jobOperationId
                        ? ((_m = workCenterByOperation.get(mat.jobOperationId)) !== null && _m !== void 0 ? _m : null)
                        : null;
                    return [4 /*yield*/, resolveLineside(opWorkCenterId)];
                case 8:
                    toStorageUnitId = _r.sent();
                    return [4 /*yield*/, getItemOnHandByStorageUnit(client, {
                            itemId: mat.itemId,
                            locationId: args.locationId,
                            companyId: args.companyId
                        })];
                case 9:
                    onHandByUnit = _r.sent();
                    // Skip when the op's lineside bin already stocks enough to cover the issue —
                    // it's already staged here, so there's nothing to pick. We test the ACTUAL
                    // on-hand at that bin, not merely whether the jobMaterial's recorded shelf
                    // points there: a part can be line-stocked at this work center while the
                    // jobMaterial still points at the warehouse (or another line).
                    if (toStorageUnitId &&
                        ((_o = onHandByUnit.get(toStorageUnitId)) !== null && _o !== void 0 ? _o : 0) >= quantityToIssue) {
                        return [3 /*break*/, 15];
                    }
                    materialEffectiveWc = null;
                    if (!mat.storageUnitId) return [3 /*break*/, 11];
                    return [4 /*yield*/, client.rpc("get_effective_work_center_id", {
                            p_storage_unit_id: mat.storageUnitId
                        })];
                case 10:
                    effectiveWc = _r.sent();
                    materialEffectiveWc = (_p = effectiveWc.data) !== null && _p !== void 0 ? _p : null;
                    _r.label = 11;
                case 11:
                    if (!(mat.storageUnitId && !materialEffectiveWc)) return [3 /*break*/, 12];
                    _d = mat.storageUnitId;
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, resolveWarehouseSource(client, onHandByUnit)];
                case 13:
                    _d = _r.sent();
                    _r.label = 14;
                case 14:
                    sourceStorageUnitId = _d;
                    lineRows.push({
                        pickingListId: plId,
                        jobId: mat.jobId,
                        jobMaterialId: mat.id,
                        jobOperationId: mat.jobOperationId,
                        itemId: mat.itemId,
                        quantityToPick: quantityToIssue,
                        storageUnitId: sourceStorageUnitId,
                        toStorageUnitId: toStorageUnitId,
                        companyId: args.companyId,
                        createdBy: args.createdBy
                    });
                    _r.label = 15;
                case 15:
                    _b++;
                    return [3 /*break*/, 7];
                case 16:
                    if (!(lineRows.length === 0)) return [3 /*break*/, 18];
                    return [4 /*yield*/, client.from("pickingList").delete().eq("id", plId)];
                case 17:
                    _r.sent();
                    return [2 /*return*/, {
                            data: null,
                            error: "No materials require picking for the selected operations"
                        }];
                case 18: return [4 /*yield*/, client
                        .from("pickingListLine")
                        .insert(lineRows)
                        .select("id")];
                case 19:
                    linesInsert = _r.sent();
                    if (!(linesInsert.error || !linesInsert.data)) return [3 /*break*/, 21];
                    return [4 /*yield*/, client.from("pickingList").delete().eq("id", plId)];
                case 20:
                    _r.sent(); // cascade cleanup
                    return [2 /*return*/, { data: null, error: (_q = linesInsert.error) !== null && _q !== void 0 ? _q : "Failed to create lines" }];
                case 21: 
                // 9. Return the created picking list
                return [2 /*return*/, {
                        data: {
                            id: plId,
                            pickingListId: pickingListId
                        },
                        error: null
                    }];
            }
        });
    });
}
/**
 * Pick, partial-pick (short), or unpick a picking line. A pick TRANSFERS the
 * material from its warehouse source shelf to the work center's lineside shelf
 * via the `post-picking` edge function (consumption happens later at
 * production). The DELTA between the desired picked quantity and what's already
 * picked is what moves: positive transfers in, negative reverses.
 *   - Pick (full):  quantity = quantityToPick
 *   - Unpick:       quantity = 0
 *   - Short:        quantity = whatever was actually picked, markShort = true
 * Tracked items go through the scan flow and are rejected here.
 */
function pickPickingListLine(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var lineResult, line, pickingList, item, previouslyPicked, target, delta, body, result, ctx, message, parsed, _a, update;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, client
                        .from("pickingListLine")
                        .select("*, pickingList(locationId, companyId, status), item(itemTrackingType)")
                        .eq("id", args.pickingListLineId)
                        .single()];
                case 1:
                    lineResult = _e.sent();
                    if (lineResult.error || !lineResult.data) {
                        return [2 /*return*/, { data: null, error: (_b = lineResult.error) !== null && _b !== void 0 ? _b : "Line not found" }];
                    }
                    line = lineResult.data;
                    pickingList = line.pickingList;
                    item = line.item;
                    if (!pickingList) {
                        return [2 /*return*/, { data: null, error: "Missing related data" }];
                    }
                    if ((0, inventory_models_1.isPickingListLocked)(pickingList.status)) {
                        return [2 /*return*/, {
                                data: null,
                                error: "This picking list is closed. Reopen it to make changes."
                            }];
                    }
                    if ((item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Serial" ||
                        (item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Batch") {
                        return [2 /*return*/, {
                                data: null,
                                error: "Tracked items must be picked via the scan flow"
                            }];
                    }
                    previouslyPicked = Number((_c = line.quantityPicked) !== null && _c !== void 0 ? _c : 0);
                    target = Math.max(0, args.quantity);
                    delta = target - previouslyPicked;
                    if (!(delta !== 0)) return [3 /*break*/, 9];
                    // A null source is allowed: the kitter can pick material the system shows no
                    // stock for (counts are often wrong) — on-hand simply goes negative at the
                    // source until it's reconciled. Only the lineside destination is required.
                    if (delta > 0 && !line.toStorageUnitId) {
                        return [2 /*return*/, {
                                data: null,
                                error: "No lineside destination is set for this line"
                            }];
                    }
                    body = delta > 0
                        ? {
                            type: "inventory",
                            pickingListId: line.pickingListId,
                            pickingListLineId: line.id,
                            quantity: delta,
                            locationId: pickingList.locationId,
                            userId: args.userId,
                            companyId: pickingList.companyId
                        }
                        : {
                            type: "unpickInventory",
                            pickingListId: line.pickingListId,
                            pickingListLineId: line.id,
                            quantity: -delta,
                            locationId: pickingList.locationId,
                            userId: args.userId,
                            companyId: pickingList.companyId
                        };
                    return [4 /*yield*/, client.functions.invoke("post-picking", { body: body })];
                case 2:
                    result = _e.sent();
                    if (!result.error) return [3 /*break*/, 9];
                    ctx = (_d = result.error) === null || _d === void 0 ? void 0 : _d.context;
                    message = "Failed to pick material";
                    if (!(ctx && typeof ctx.json === "function")) return [3 /*break*/, 7];
                    _e.label = 3;
                case 3:
                    _e.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, ctx.clone().json()];
                case 4:
                    parsed = _e.sent();
                    if (parsed === null || parsed === void 0 ? void 0 : parsed.message)
                        message = parsed.message;
                    return [3 /*break*/, 6];
                case 5:
                    _a = _e.sent();
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 8];
                case 7:
                    if (result.error.message) {
                        message = result.error.message;
                    }
                    _e.label = 8;
                case 8: return [2 /*return*/, { data: null, error: message }];
                case 9:
                    if (!args.markShort) return [3 /*break*/, 11];
                    return [4 /*yield*/, client
                            .from("pickingListLine")
                            .update({
                            status: "Short",
                            quantityPicked: target,
                            updatedBy: args.userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", line.id)];
                case 10:
                    update = _e.sent();
                    if (update.error) {
                        return [2 /*return*/, { data: null, error: update.error }];
                    }
                    _e.label = 11;
                case 11: return [2 /*return*/, { data: { id: line.id }, error: null }];
            }
        });
    });
}
function insertStockTransfer(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var locationId, lines, companyId, createdBy, customFields, stockTransferId, sequence, linesWithExpandedSerialTracking, createTransfer, createLines;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    locationId = input.locationId, lines = input.lines, companyId = input.companyId, createdBy = input.createdBy, customFields = input.customFields;
                    stockTransferId = input.stockTransferId;
                    if (!!stockTransferId) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.rpc("get_next_sequence", {
                            sequence_name: "stockTransfer",
                            company_id: companyId
                        })];
                case 1:
                    sequence = _b.sent();
                    if (sequence.error || !sequence.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_a = sequence.error) !== null && _a !== void 0 ? _a : { message: "Failed to get sequence" }
                            }];
                    }
                    stockTransferId = sequence.data;
                    _b.label = 2;
                case 2:
                    linesWithExpandedSerialTracking = lines.reduce(function (acc, line) {
                        if (line.quantity && !Number.isInteger(line.quantity)) {
                            return acc;
                        }
                        if (line.requiresSerialTracking && line.quantity && line.quantity > 1) {
                            acc.push.apply(acc, Array.from({ length: line.quantity }, function () { return (__assign(__assign({}, line), { quantity: 1 })); }));
                        }
                        else {
                            acc.push(line);
                        }
                        return acc;
                    }, []);
                    return [4 /*yield*/, client
                            .from("stockTransfer")
                            .insert({
                            stockTransferId: stockTransferId,
                            locationId: locationId,
                            status: "Released",
                            companyId: companyId,
                            createdBy: createdBy,
                            customFields: customFields
                        })
                            .select("id")
                            .single()];
                case 3:
                    createTransfer = _b.sent();
                    if (createTransfer.error || !createTransfer.data) {
                        return [2 /*return*/, { data: null, error: createTransfer.error }];
                    }
                    return [4 /*yield*/, client.from("stockTransferLine").insert(linesWithExpandedSerialTracking.map(function (line) { return (__assign(__assign({}, line), { stockTransferId: createTransfer.data.id, companyId: companyId, createdBy: createdBy })); }))];
                case 4:
                    createLines = _b.sent();
                    if (!createLines.error) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("stockTransfer")
                            .delete()
                            .eq("id", createTransfer.data.id)];
                case 5:
                    _b.sent();
                    return [2 /*return*/, { data: null, error: createLines.error }];
                case 6: return [2 /*return*/, {
                        data: { id: createTransfer.data.id, stockTransferId: stockTransferId },
                        error: null
                    }];
            }
        });
    });
}
function insertWarehouseTransfer(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var fromLocationId, toLocationId, companyId, createdBy, _a, status, transferDate, expectedReceiptDate, notes, reference, customFields, transferId, sequence, createTransfer;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fromLocationId = input.fromLocationId, toLocationId = input.toLocationId, companyId = input.companyId, createdBy = input.createdBy, _a = input.status, status = _a === void 0 ? "Draft" : _a, transferDate = input.transferDate, expectedReceiptDate = input.expectedReceiptDate, notes = input.notes, reference = input.reference, customFields = input.customFields;
                    transferId = input.transferId;
                    if (!!transferId) return [3 /*break*/, 2];
                    return [4 /*yield*/, client.rpc("get_next_sequence", {
                            sequence_name: "warehouseTransfer",
                            company_id: companyId
                        })];
                case 1:
                    sequence = _c.sent();
                    if (sequence.error || !sequence.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_b = sequence.error) !== null && _b !== void 0 ? _b : { message: "Failed to get sequence" }
                            }];
                    }
                    transferId = sequence.data;
                    _c.label = 2;
                case 2: return [4 /*yield*/, client
                        .from("warehouseTransfer")
                        .insert({
                        transferId: transferId,
                        fromLocationId: fromLocationId,
                        toLocationId: toLocationId,
                        status: status,
                        transferDate: transferDate || null,
                        expectedReceiptDate: expectedReceiptDate || null,
                        notes: notes || null,
                        reference: reference || null,
                        companyId: companyId,
                        createdBy: createdBy,
                        customFields: customFields
                    })
                        .select("id")
                        .single()];
                case 3:
                    createTransfer = _c.sent();
                    if (createTransfer.error || !createTransfer.data) {
                        return [2 /*return*/, { data: null, error: createTransfer.error }];
                    }
                    return [2 /*return*/, {
                            data: { id: createTransfer.data.id, transferId: transferId },
                            error: null
                        }];
            }
        });
    });
}
function updateStockTransfer(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var id, updatedBy, customFields, fields;
        return __generator(this, function (_a) {
            id = input.id, updatedBy = input.updatedBy, customFields = input.customFields, fields = __rest(input, ["id", "updatedBy", "customFields"]);
            return [2 /*return*/, client
                    .from("stockTransfer")
                    .update((0, supabase_1.sanitize)(__assign(__assign({}, fields), { customFields: customFields, updatedBy: updatedBy, updatedAt: new Date().toISOString() })))
                    .eq("id", id)
                    .select("id")
                    .single()];
        });
    });
}
function updateWarehouseTransfer(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var id, updatedBy, customFields, fields;
        return __generator(this, function (_a) {
            id = input.id, updatedBy = input.updatedBy, customFields = input.customFields, fields = __rest(input, ["id", "updatedBy", "customFields"]);
            return [2 /*return*/, client
                    .from("warehouseTransfer")
                    .update((0, supabase_1.sanitize)(__assign(__assign({}, fields), { customFields: customFields, updatedBy: updatedBy, updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() })))
                    .eq("id", id)
                    .select("id")
                    .single()];
        });
    });
}
