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
exports.createPurchaseOrdersFromJob = createPurchaseOrdersFromJob;
var utils_1 = require("@carbon/utils");
var purchasing_service_1 = require("~/modules/purchasing/purchasing.service");
var settings_service_1 = require("~/modules/settings/settings.service");
function createPurchaseOrdersFromJob(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, job, jobError, _b, jobOperations, jobOperationsError, outsideOperations, supplierProcessIds, outsideOperationIds, _c, supplierProcessesResult, existingLinesResult, existingJobOperationIds, outsideOperationsBySupplierId, supplierIds, itemIds, _d, items, itemsError, _e, _i, supplierIds_1, supplierId, operations, purchaseOrderId, nextSequence, supplier, purchaseOrder, _loop_1, _f, operations_1, operation, state_1;
        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        return __generator(this, function (_z) {
            switch (_z.label) {
                case 0: return [4 /*yield*/, client
                        .from("job")
                        .select("id, jobId, locationId")
                        .eq("id", args.jobId)
                        .eq("companyId", args.companyId)
                        .single()];
                case 1:
                    _a = _z.sent(), job = _a.data, jobError = _a.error;
                    if (jobError || !job) {
                        return [2 /*return*/, { data: null, error: jobError !== null && jobError !== void 0 ? jobError : new Error("Job not found") }];
                    }
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("*, jobMakeMethod(itemId)")
                            .eq("jobId", args.jobId)
                            .eq("companyId", args.companyId)];
                case 2:
                    _b = _z.sent(), jobOperations = _b.data, jobOperationsError = _b.error;
                    if (jobOperationsError) {
                        return [2 /*return*/, { data: null, error: jobOperationsError }];
                    }
                    outsideOperations = (jobOperations !== null && jobOperations !== void 0 ? jobOperations : []).filter(function (operation) { return operation.operationType === "Outside"; });
                    if (outsideOperations.length === 0) {
                        return [2 /*return*/, { data: { success: true }, error: null }];
                    }
                    supplierProcessIds = __spreadArray([], new Set(outsideOperations
                        .map(function (operation) { return operation.operationSupplierProcessId; })
                        .filter(function (id) { return Boolean(id); })), true);
                    if (supplierProcessIds.length === 0) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Outside operations must have a supplier before releasing the job")
                            }];
                    }
                    outsideOperationIds = outsideOperations.map(function (operation) { return operation.id; });
                    return [4 /*yield*/, Promise.all([
                            client.from("supplierProcess").select("*").in("id", supplierProcessIds),
                            client
                                .from("purchaseOrderLine")
                                .select("jobOperationId")
                                .eq("jobId", args.jobId)
                                .in("jobOperationId", outsideOperationIds)
                        ])];
                case 3:
                    _c = _z.sent(), supplierProcessesResult = _c[0], existingLinesResult = _c[1];
                    if (supplierProcessesResult.error) {
                        return [2 /*return*/, { data: null, error: supplierProcessesResult.error }];
                    }
                    if (existingLinesResult.error) {
                        return [2 /*return*/, { data: null, error: existingLinesResult.error }];
                    }
                    existingJobOperationIds = new Set((_h = (_g = existingLinesResult.data) === null || _g === void 0 ? void 0 : _g.map(function (line) { return line.jobOperationId; }).filter(Boolean)) !== null && _h !== void 0 ? _h : []);
                    outsideOperationsBySupplierId = outsideOperations.reduce(function (acc, operation) {
                        var _a;
                        if (existingJobOperationIds.has(operation.id)) {
                            return acc;
                        }
                        var supplierProcess = (_a = supplierProcessesResult.data) === null || _a === void 0 ? void 0 : _a.find(function (row) { return row.id === operation.operationSupplierProcessId; });
                        if (!supplierProcess) {
                            return acc;
                        }
                        if (!acc[supplierProcess.supplierId]) {
                            acc[supplierProcess.supplierId] = [];
                        }
                        acc[supplierProcess.supplierId].push(operation);
                        return acc;
                    }, {});
                    supplierIds = Object.keys(outsideOperationsBySupplierId);
                    if (supplierIds.length === 0) {
                        return [2 /*return*/, { data: { success: true }, error: null }];
                    }
                    itemIds = __spreadArray([], new Set(outsideOperations
                        .map(function (operation) { var _a; return (_a = operation.jobMakeMethod) === null || _a === void 0 ? void 0 : _a.itemId; })
                        .filter(function (id) { return Boolean(id); })), true);
                    if (!(itemIds.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, client.from("item").select("*").in("id", itemIds)];
                case 4:
                    _e = _z.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _e = { data: [], error: null };
                    _z.label = 6;
                case 6:
                    _d = _e, items = _d.data, itemsError = _d.error;
                    if (itemsError) {
                        return [2 /*return*/, { data: null, error: itemsError }];
                    }
                    _i = 0, supplierIds_1 = supplierIds;
                    _z.label = 7;
                case 7:
                    if (!(_i < supplierIds_1.length)) return [3 /*break*/, 16];
                    supplierId = supplierIds_1[_i];
                    operations = outsideOperationsBySupplierId[supplierId];
                    purchaseOrderId = args.purchaseOrdersBySupplierId[supplierId] === "new"
                        ? undefined
                        : args.purchaseOrdersBySupplierId[supplierId];
                    if (!!purchaseOrderId) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, settings_service_1.getNextSequence)(client, "purchaseOrder", args.companyId)];
                case 8:
                    nextSequence = _z.sent();
                    if (nextSequence.error || !nextSequence.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_j = nextSequence.error) !== null && _j !== void 0 ? _j : new Error("Failed to get PO sequence")
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("supplier")
                            .select("currencyCode")
                            .eq("id", supplierId)
                            .single()];
                case 9:
                    supplier = (_z.sent()).data;
                    return [4 /*yield*/, (0, purchasing_service_1.upsertPurchaseOrder)(client, {
                            purchaseOrderId: nextSequence.data,
                            supplierId: supplierId,
                            companyId: args.companyId,
                            companyGroupId: args.companyGroupId,
                            createdBy: args.userId,
                            purchaseOrderType: "Outside Processing",
                            locationId: (_k = job.locationId) !== null && _k !== void 0 ? _k : "",
                            currencyCode: (_l = supplier === null || supplier === void 0 ? void 0 : supplier.currencyCode) !== null && _l !== void 0 ? _l : "USD",
                            status: "Draft",
                            jobId: job.id,
                            jobReadableId: job.jobId
                        })];
                case 10:
                    purchaseOrder = _z.sent();
                    if (purchaseOrder.error || !((_o = (_m = purchaseOrder.data) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.id)) {
                        return [2 /*return*/, { data: null, error: purchaseOrder.error }];
                    }
                    purchaseOrderId = purchaseOrder.data[0].id;
                    _z.label = 11;
                case 11:
                    _loop_1 = function (operation) {
                        var item, supplierProcess, unitCost, minimumCost, quantity, pricingLines, purchaseOrderLineType, _0, pricingLines_1, pricingLine, line;
                        return __generator(this, function (_1) {
                            switch (_1.label) {
                                case 0:
                                    item = items === null || items === void 0 ? void 0 : items.find(function (row) { var _a; return row.id === ((_a = operation.jobMakeMethod) === null || _a === void 0 ? void 0 : _a.itemId); });
                                    supplierProcess = (_p = supplierProcessesResult.data) === null || _p === void 0 ? void 0 : _p.find(function (row) { return row.id === operation.operationSupplierProcessId; });
                                    if (!item || !supplierProcess) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    unitCost = (_r = (_q = operation.operationUnitCost) !== null && _q !== void 0 ? _q : supplierProcess.unitCost) !== null && _r !== void 0 ? _r : 0;
                                    minimumCost = (_t = (_s = operation.operationMinimumCost) !== null && _s !== void 0 ? _s : supplierProcess.minimumCost) !== null && _t !== void 0 ? _t : 0;
                                    quantity = (_u = operation.operationQuantity) !== null && _u !== void 0 ? _u : 1;
                                    pricingLines = (0, utils_1.calculateOutsideProcessingPurchaseOrderLines)({
                                        quantity: quantity,
                                        unitCost: unitCost,
                                        minimumCost: minimumCost,
                                        minimumCostDescription: "Minimum cost - ".concat((_w = (_v = operation.description) !== null && _v !== void 0 ? _v : item.name) !== null && _w !== void 0 ? _w : "Outside processing")
                                    });
                                    purchaseOrderLineType = (0, utils_1.toPurchaseOrderItemLineType)(item.type);
                                    _0 = 0, pricingLines_1 = pricingLines;
                                    _1.label = 1;
                                case 1:
                                    if (!(_0 < pricingLines_1.length)) return [3 /*break*/, 4];
                                    pricingLine = pricingLines_1[_0];
                                    return [4 /*yield*/, (0, purchasing_service_1.upsertPurchaseOrderLine)(client, {
                                            purchaseOrderId: purchaseOrderId,
                                            purchaseOrderLineType: purchaseOrderLineType,
                                            itemId: item.id,
                                            description: pricingLine.isMinimumCostLine
                                                ? pricingLine.description
                                                : item.name || item.description || undefined,
                                            purchaseQuantity: pricingLine.purchaseQuantity,
                                            purchaseUnitOfMeasureCode: (_x = item.unitOfMeasureCode) !== null && _x !== void 0 ? _x : undefined,
                                            inventoryUnitOfMeasureCode: (_y = item.unitOfMeasureCode) !== null && _y !== void 0 ? _y : undefined,
                                            conversionFactor: 1,
                                            supplierUnitPrice: pricingLine.supplierUnitPrice,
                                            locationId: job.locationId,
                                            jobId: job.id,
                                            jobOperationId: pricingLine.isMinimumCostLine
                                                ? undefined
                                                : operation.id,
                                            companyId: args.companyId,
                                            createdBy: args.userId
                                        })];
                                case 2:
                                    line = _1.sent();
                                    if (line.error) {
                                        return [2 /*return*/, { value: { data: null, error: line.error } }];
                                    }
                                    _1.label = 3;
                                case 3:
                                    _0++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _f = 0, operations_1 = operations;
                    _z.label = 12;
                case 12:
                    if (!(_f < operations_1.length)) return [3 /*break*/, 15];
                    operation = operations_1[_f];
                    return [5 /*yield**/, _loop_1(operation)];
                case 13:
                    state_1 = _z.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _z.label = 14;
                case 14:
                    _f++;
                    return [3 /*break*/, 12];
                case 15:
                    _i++;
                    return [3 /*break*/, 7];
                case 16: return [2 /*return*/, { data: { success: true }, error: null }];
            }
        });
    });
}
