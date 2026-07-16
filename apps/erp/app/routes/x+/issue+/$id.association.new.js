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
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var form_1 = require("@carbon/form");
var quality_1 = require("~/modules/quality");
var quality_models_1 = require("~/modules/quality/quality.models");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, nonConformanceId, viewClient, issue, formData, validation, _d, type, id, lineId, quantity, _e, itemError, customerError, supplierError, job, jobOperation, purchaseOrder, purchaseOrderLine, salesOrder, salesOrderLine, shipment, shipmentLine, receipt, receiptLine, trackedEntityError, inspection, linkResult, sampledIds, lotEntityIds, receiptLineEntities;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_y) {
            switch (_y.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "quality"
                        })];
                case 1:
                    _c = _y.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    nonConformanceId = params.id;
                    if (!nonConformanceId)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "quality"
                        })];
                case 2:
                    viewClient = (_y.sent()).client;
                    return [4 /*yield*/, (0, quality_1.getIssue)(viewClient, nonConformanceId)];
                case 3:
                    issue = _y.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, quality_1.isIssueLocked)((_f = issue.data) === null || _f === void 0 ? void 0 : _f.status),
                            redirectTo: path_1.path.to.issue(nonConformanceId),
                            message: "Cannot modify a closed issue. Reopen it first."
                        })];
                case 4:
                    _y.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _y.sent();
                    return [4 /*yield*/, (0, form_1.validator)(quality_models_1.issueAssociationValidator).validate(formData)];
                case 6:
                    validation = _y.sent();
                    if (validation.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Invalid form data"
                            }];
                    }
                    _d = validation.data, type = _d.type, id = _d.id, lineId = _d.lineId, quantity = _d.quantity;
                    _e = type;
                    switch (_e) {
                        case "items": return [3 /*break*/, 7];
                        case "customers": return [3 /*break*/, 9];
                        case "suppliers": return [3 /*break*/, 11];
                        case "jobOperations": return [3 /*break*/, 13];
                        case "purchaseOrderLines": return [3 /*break*/, 17];
                        case "salesOrderLines": return [3 /*break*/, 20];
                        case "shipmentLines": return [3 /*break*/, 23];
                        case "receiptLines": return [3 /*break*/, 26];
                        case "trackedEntities": return [3 /*break*/, 29];
                        case "inboundInspections": return [3 /*break*/, 31];
                    }
                    return [3 /*break*/, 37];
                case 7: return [4 /*yield*/, client
                        .from("nonConformanceItem")
                        .insert({
                        itemId: id,
                        nonConformanceId: nonConformanceId,
                        createdBy: userId,
                        companyId: companyId,
                        quantity: quantity !== null && quantity !== void 0 ? quantity : 0
                    })];
                case 8:
                    itemError = (_y.sent()).error;
                    if (itemError) {
                        console.error(itemError);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue item"
                            }];
                    }
                    return [3 /*break*/, 37];
                case 9: return [4 /*yield*/, client
                        .from("nonConformanceCustomer")
                        .insert({
                        customerId: id,
                        nonConformanceId: nonConformanceId,
                        createdBy: userId,
                        companyId: companyId
                    })];
                case 10:
                    customerError = (_y.sent()).error;
                    if (customerError) {
                        console.error(customerError);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue customer"
                            }];
                    }
                    return [3 /*break*/, 37];
                case 11: return [4 /*yield*/, client
                        .from("nonConformanceSupplier")
                        .insert({
                        supplierId: id,
                        nonConformanceId: nonConformanceId,
                        createdBy: userId,
                        companyId: companyId
                    })];
                case 12:
                    supplierError = (_y.sent()).error;
                    if (supplierError) {
                        console.error(supplierError);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue supplier"
                            }];
                    }
                    return [3 /*break*/, 37];
                case 13: return [4 /*yield*/, client
                        .from("job")
                        .select("id, jobId, itemId")
                        .eq("id", id)
                        .single()];
                case 14:
                    job = _y.sent();
                    if (job.error) {
                        console.error(job.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue job operation"
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("nonConformanceJobOperation")
                            .insert({
                            jobOperationId: lineId,
                            jobId: (_g = job.data) === null || _g === void 0 ? void 0 : _g.id,
                            jobReadableId: (_h = job.data) === null || _h === void 0 ? void 0 : _h.jobId,
                            nonConformanceId: nonConformanceId,
                            createdBy: userId,
                            companyId: companyId
                        })];
                case 15:
                    jobOperation = _y.sent();
                    if (jobOperation.error) {
                        console.error(jobOperation.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue job operation"
                            }];
                    }
                    return [4 /*yield*/, autoLinkJobOperationContext(client, {
                            nonConformanceId: nonConformanceId,
                            companyId: companyId,
                            userId: userId,
                            jobItemId: (_k = (_j = job.data) === null || _j === void 0 ? void 0 : _j.itemId) !== null && _k !== void 0 ? _k : null,
                            jobOperationId: lineId
                        })];
                case 16:
                    _y.sent();
                    return [3 /*break*/, 37];
                case 17: return [4 /*yield*/, client
                        .from("purchaseOrder")
                        .select("id, purchaseOrderId")
                        .eq("id", id)
                        .single()];
                case 18:
                    purchaseOrder = _y.sent();
                    if (purchaseOrder.error) {
                        console.error(purchaseOrder.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue purchase order line"
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("nonConformancePurchaseOrderLine")
                            .insert({
                            purchaseOrderLineId: lineId,
                            purchaseOrderId: (_l = purchaseOrder.data) === null || _l === void 0 ? void 0 : _l.id,
                            purchaseOrderReadableId: (_m = purchaseOrder.data) === null || _m === void 0 ? void 0 : _m.purchaseOrderId,
                            nonConformanceId: nonConformanceId,
                            createdBy: userId,
                            companyId: companyId
                        })];
                case 19:
                    purchaseOrderLine = _y.sent();
                    if (purchaseOrderLine.error) {
                        console.error(purchaseOrderLine.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue purchase order line"
                            }];
                    }
                    return [3 /*break*/, 37];
                case 20: return [4 /*yield*/, client
                        .from("salesOrder")
                        .select("id, salesOrderId")
                        .eq("id", id)
                        .single()];
                case 21:
                    salesOrder = _y.sent();
                    if (salesOrder.error) {
                        console.error(salesOrder.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue sales order line"
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("nonConformanceSalesOrderLine")
                            .insert({
                            salesOrderLineId: lineId,
                            salesOrderId: (_o = salesOrder.data) === null || _o === void 0 ? void 0 : _o.id,
                            salesOrderReadableId: (_p = salesOrder.data) === null || _p === void 0 ? void 0 : _p.salesOrderId,
                            nonConformanceId: nonConformanceId,
                            createdBy: userId,
                            companyId: companyId
                        })];
                case 22:
                    salesOrderLine = _y.sent();
                    if (salesOrderLine.error) {
                        console.error(salesOrderLine.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue sales order line"
                            }];
                    }
                    return [3 /*break*/, 37];
                case 23: return [4 /*yield*/, client
                        .from("shipment")
                        .select("id, shipmentId")
                        .eq("id", id)
                        .single()];
                case 24:
                    shipment = _y.sent();
                    if (shipment.error) {
                        console.error(shipment.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue shipment line"
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("nonConformanceShipmentLine")
                            .insert({
                            shipmentLineId: lineId,
                            shipmentId: (_q = shipment.data) === null || _q === void 0 ? void 0 : _q.id,
                            shipmentReadableId: (_r = shipment.data) === null || _r === void 0 ? void 0 : _r.shipmentId,
                            nonConformanceId: nonConformanceId,
                            createdBy: userId,
                            companyId: companyId
                        })];
                case 25:
                    shipmentLine = _y.sent();
                    if (shipmentLine.error) {
                        console.error(shipmentLine.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue shipment line"
                            }];
                    }
                    return [3 /*break*/, 37];
                case 26: return [4 /*yield*/, client
                        .from("receipt")
                        .select("id, receiptId")
                        .eq("id", id)
                        .single()];
                case 27:
                    receipt = _y.sent();
                    if (receipt.error) {
                        console.error(receipt.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue receipt line"
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("nonConformanceReceiptLine")
                            .insert({
                            receiptLineId: lineId,
                            receiptId: (_s = receipt.data) === null || _s === void 0 ? void 0 : _s.id,
                            receiptReadableId: (_t = receipt.data) === null || _t === void 0 ? void 0 : _t.receiptId,
                            nonConformanceId: nonConformanceId,
                            createdBy: userId,
                            companyId: companyId
                        })];
                case 28:
                    receiptLine = _y.sent();
                    if (receiptLine.error) {
                        console.error(receiptLine.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue receipt line"
                            }];
                    }
                    return [3 /*break*/, 37];
                case 29: return [4 /*yield*/, client
                        .from("nonConformanceTrackedEntity")
                        .insert({
                        trackedEntityId: id,
                        nonConformanceId: nonConformanceId,
                        createdBy: userId,
                        companyId: companyId
                    })];
                case 30:
                    trackedEntityError = (_y.sent()).error;
                    if (trackedEntityError) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue tracked entity"
                            }];
                    }
                    return [3 /*break*/, 37];
                case 31: return [4 /*yield*/, client
                        .from("inboundInspection")
                        .select("id, itemId, lotSize, receiptLineId, inboundInspectionSample(trackedEntityId)")
                        .eq("id", id)
                        .single()];
                case 32:
                    inspection = _y.sent();
                    if (inspection.error) {
                        console.error(inspection.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue inbound inspection"
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("nonConformanceInboundInspection")
                            .insert({
                            nonConformanceId: nonConformanceId,
                            inboundInspectionId: inspection.data.id,
                            createdBy: userId,
                            companyId: companyId
                        })];
                case 33:
                    linkResult = _y.sent();
                    if (linkResult.error) {
                        console.error(linkResult.error);
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create issue inbound inspection"
                            }];
                    }
                    sampledIds = ((_u = inspection.data.inboundInspectionSample) !== null && _u !== void 0 ? _u : [])
                        .map(function (s) { return s.trackedEntityId; })
                        .filter(Boolean);
                    lotEntityIds = sampledIds;
                    if (!inspection.data.receiptLineId) return [3 /*break*/, 35];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("id")
                            .eq("attributes ->> Receipt Line", inspection.data.receiptLineId)
                            .eq("companyId", companyId)];
                case 34:
                    receiptLineEntities = _y.sent();
                    lotEntityIds = Array.from(new Set(__spreadArray(__spreadArray([], sampledIds, true), ((_v = receiptLineEntities.data) !== null && _v !== void 0 ? _v : []).map(function (r) { return r.id; }), true)));
                    _y.label = 35;
                case 35: return [4 /*yield*/, autoLinkInboundInspectionContext(client, {
                        nonConformanceId: nonConformanceId,
                        companyId: companyId,
                        userId: userId,
                        itemId: (_w = inspection.data.itemId) !== null && _w !== void 0 ? _w : null,
                        lotSize: Number((_x = inspection.data.lotSize) !== null && _x !== void 0 ? _x : 0),
                        trackedEntityIds: lotEntityIds
                    })];
                case 36:
                    _y.sent();
                    return [3 /*break*/, 37];
                case 37: return [2 /*return*/, {
                        success: true,
                        message: "Association created"
                    }];
            }
        });
    });
}
// Auto-linking helpers: these run after the primary association insert
// succeeds, so their failures are swallowed — they surface context into the
// issue explorer (items, tracked entities) but shouldn't block the user if a
// row already exists or a lookup misses.
function autoLinkJobOperationContext(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var nonConformanceId, companyId, userId, jobItemId, jobOperationId, operation, jobMakeMethodId, entities, trackedEntityIds;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    nonConformanceId = args.nonConformanceId, companyId = args.companyId, userId = args.userId, jobItemId = args.jobItemId, jobOperationId = args.jobOperationId;
                    if (!jobItemId) return [3 /*break*/, 2];
                    return [4 /*yield*/, insertMissingItem(client, {
                            nonConformanceId: nonConformanceId,
                            companyId: companyId,
                            userId: userId,
                            itemId: jobItemId,
                            quantity: 0
                        })];
                case 1:
                    _d.sent();
                    _d.label = 2;
                case 2: return [4 /*yield*/, client
                        .from("jobOperation")
                        .select("jobMakeMethodId")
                        .eq("id", jobOperationId)
                        .single()];
                case 3:
                    operation = _d.sent();
                    jobMakeMethodId = (_b = (_a = operation.data) === null || _a === void 0 ? void 0 : _a.jobMakeMethodId) !== null && _b !== void 0 ? _b : null;
                    if (!jobMakeMethodId)
                        return [2 /*return*/];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("id")
                            .eq("attributes->>Job Make Method", jobMakeMethodId)
                            .eq("companyId", companyId)];
                case 4:
                    entities = _d.sent();
                    trackedEntityIds = ((_c = entities.data) !== null && _c !== void 0 ? _c : []).map(function (e) { return e.id; });
                    return [4 /*yield*/, insertMissingTrackedEntities(client, {
                            nonConformanceId: nonConformanceId,
                            companyId: companyId,
                            userId: userId,
                            trackedEntityIds: trackedEntityIds
                        })];
                case 5:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function autoLinkInboundInspectionContext(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var nonConformanceId, companyId, userId, itemId, lotSize, trackedEntityIds, existing, itemRowId, currentQty, insert, alreadyLinked, alreadyLinkedSet, toLink, entityQuantities, entityQtyById, linkRows, linkInsert, addedQty;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    nonConformanceId = args.nonConformanceId, companyId = args.companyId, userId = args.userId, itemId = args.itemId, lotSize = args.lotSize, trackedEntityIds = args.trackedEntityIds;
                    return [4 /*yield*/, insertMissingTrackedEntities(client, {
                            nonConformanceId: nonConformanceId,
                            companyId: companyId,
                            userId: userId,
                            trackedEntityIds: trackedEntityIds
                        })];
                case 1:
                    _e.sent();
                    if (!itemId)
                        return [2 /*return*/];
                    return [4 /*yield*/, client
                            .from("nonConformanceItem")
                            .select("id, quantity")
                            .eq("nonConformanceId", nonConformanceId)
                            .eq("itemId", itemId)
                            .maybeSingle()];
                case 2:
                    existing = _e.sent();
                    if (!existing.data) return [3 /*break*/, 3];
                    itemRowId = existing.data.id;
                    currentQty = Number((_a = existing.data.quantity) !== null && _a !== void 0 ? _a : 0);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, client
                        .from("nonConformanceItem")
                        .insert({
                        itemId: itemId,
                        nonConformanceId: nonConformanceId,
                        createdBy: userId,
                        companyId: companyId,
                        quantity: 0
                    })
                        .select("id, quantity")
                        .single()];
                case 4:
                    insert = _e.sent();
                    if (insert.error || !insert.data) {
                        console.error(insert.error);
                        return [2 /*return*/];
                    }
                    itemRowId = insert.data.id;
                    currentQty = Number((_b = insert.data.quantity) !== null && _b !== void 0 ? _b : 0);
                    _e.label = 5;
                case 5:
                    if (!(trackedEntityIds.length === 0)) return [3 /*break*/, 8];
                    if (!(currentQty === 0 && lotSize > 0)) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("nonConformanceItem")
                            .update({
                            quantity: lotSize,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", itemRowId)
                            .eq("companyId", companyId)];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7: return [2 /*return*/];
                case 8: return [4 /*yield*/, client
                        .from("nonConformanceItemTrackedEntity")
                        .select("trackedEntityId")
                        .eq("nonConformanceId", nonConformanceId)
                        .in("trackedEntityId", trackedEntityIds)];
                case 9:
                    alreadyLinked = _e.sent();
                    alreadyLinkedSet = new Set(((_c = alreadyLinked.data) !== null && _c !== void 0 ? _c : []).map(function (r) { return r.trackedEntityId; }));
                    toLink = trackedEntityIds.filter(function (id) { return !alreadyLinkedSet.has(id); });
                    if (toLink.length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("id, quantity")
                            .in("id", toLink)
                            .eq("companyId", companyId)];
                case 10:
                    entityQuantities = _e.sent();
                    entityQtyById = new Map(((_d = entityQuantities.data) !== null && _d !== void 0 ? _d : []).map(function (e) { var _a; return [e.id, Number((_a = e.quantity) !== null && _a !== void 0 ? _a : 1)]; }));
                    linkRows = toLink.map(function (trackedEntityId) {
                        var _a;
                        return ({
                            nonConformanceItemId: itemRowId,
                            trackedEntityId: trackedEntityId,
                            quantity: (_a = entityQtyById.get(trackedEntityId)) !== null && _a !== void 0 ? _a : 1,
                            companyId: companyId,
                            createdBy: userId
                        });
                    });
                    return [4 /*yield*/, client
                            .from("nonConformanceItemTrackedEntity")
                            .insert(linkRows)];
                case 11:
                    linkInsert = _e.sent();
                    if (linkInsert.error) {
                        console.error(linkInsert.error);
                        return [2 /*return*/];
                    }
                    addedQty = linkRows.reduce(function (acc, r) { return acc + r.quantity; }, 0);
                    return [4 /*yield*/, client
                            .from("nonConformanceItem")
                            .update({
                            quantity: currentQty + addedQty,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", itemRowId)
                            .eq("companyId", companyId)];
                case 12:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function insertMissingItem(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var nonConformanceId, companyId, userId, itemId, quantity, existing, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nonConformanceId = args.nonConformanceId, companyId = args.companyId, userId = args.userId, itemId = args.itemId, quantity = args.quantity;
                    return [4 /*yield*/, client
                            .from("nonConformanceItem")
                            .select("id")
                            .eq("nonConformanceId", nonConformanceId)
                            .eq("itemId", itemId)
                            .maybeSingle()];
                case 1:
                    existing = _a.sent();
                    if (existing.data)
                        return [2 /*return*/];
                    return [4 /*yield*/, client.from("nonConformanceItem").insert({
                            itemId: itemId,
                            nonConformanceId: nonConformanceId,
                            createdBy: userId,
                            companyId: companyId,
                            quantity: quantity
                        })];
                case 2:
                    result = _a.sent();
                    if (result.error)
                        console.error(result.error);
                    return [2 /*return*/];
            }
        });
    });
}
function insertMissingTrackedEntities(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var nonConformanceId, companyId, userId, trackedEntityIds, existing, already, rows, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    nonConformanceId = args.nonConformanceId, companyId = args.companyId, userId = args.userId, trackedEntityIds = args.trackedEntityIds;
                    if (trackedEntityIds.length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, client
                            .from("nonConformanceTrackedEntity")
                            .select("trackedEntityId")
                            .eq("nonConformanceId", nonConformanceId)
                            .in("trackedEntityId", trackedEntityIds)];
                case 1:
                    existing = _b.sent();
                    already = new Set(((_a = existing.data) !== null && _a !== void 0 ? _a : []).map(function (r) { return r.trackedEntityId; }));
                    rows = trackedEntityIds
                        .filter(function (teId) { return !already.has(teId); })
                        .map(function (trackedEntityId) { return ({
                        nonConformanceId: nonConformanceId,
                        trackedEntityId: trackedEntityId,
                        createdBy: userId,
                        companyId: companyId
                    }); });
                    if (rows.length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, client.from("nonConformanceTrackedEntity").insert(rows)];
                case 2:
                    result = _b.sent();
                    if (result.error)
                        console.error(result.error);
                    return [2 /*return*/];
            }
        });
    });
}
