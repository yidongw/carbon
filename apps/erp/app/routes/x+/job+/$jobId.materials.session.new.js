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
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var date_1 = require("@internationalized/date");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var inventory_1 = require("~/modules/inventory");
var production_1 = require("~/modules/production");
var shared_server_1 = require("~/modules/shared/shared.server");
var path_1 = require("~/utils/path");
var jobMaterialsSessionValidator = zod_1.z.object({
    jobId: zod_1.z.string(),
    items: zod_1.z.string().transform(function (str, ctx) {
        try {
            var parsed = JSON.parse(str);
            var itemsSchema = zod_1.z.array(zod_1.z.object({
                id: zod_1.z.string(), // Job material ID
                itemId: zod_1.z.string(), // Actual item ID
                itemReadableId: zod_1.z.string(),
                description: zod_1.z.string(),
                action: zod_1.z.enum(["order", "transfer"]),
                quantity: zod_1.z.number().optional(),
                requiresSerialTracking: zod_1.z.boolean(),
                requiresBatchTracking: zod_1.z.boolean(),
                storageUnitId: zod_1.z.string().nullable().optional()
            }));
            return itemsSchema.parse(parsed);
            // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
        }
        catch (error) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "Invalid JSON format for items"
            });
            return zod_1.z.NEVER;
        }
    })
});
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, jobId, formData, validation, _d, _e, sessionItems, startDate, _f, jobResult, itemReplenishments, _g, _h, itemReplenishmentsMap, job, locationId, jobStartDate, _j, _k, endDate, weeksToProject, periods, transferItems, orderItems, hasTransfer, hasPurchaseOrder, hasJobs, transferLines, _loop_1, _l, transferItems_1, transferItems_1_1, e_1_1, linesWithExpandedSerialTracking, createStockTransfer, _m, _o, buyItems, makeItems, supplierParts, itemsBySupplier, _loop_2, _i, buyItems_1, item, purchasePlanningItems, findPeriodId, _p, _q, _r, supplierId, supplierItems, _s, supplierItems_1, _t, item, supplier, replenishment, jobStartDateParsed, leadTime, purchaseOrderDueDate, purchaseOrderStartDate, periodId, orders, purchasePlanningPayload, purchasePlanningUrl, result, responseData, errorText, productionPlanningUrl, productionPlanningItems, productionPlanningPayload, result, data_1, createdItems, successMessage, _u, _v;
        var _w, e_1, _x, _y;
        var _z, _0, _1;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_2) {
            switch (_2.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "production"
                    })];
                case 1:
                    _c = _2.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    jobId = params.jobId;
                    if (!jobId)
                        throw new Error("Job ID is required");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _2.sent();
                    return [4 /*yield*/, (0, form_1.validator)(jobMaterialsSessionValidator).validate(formData)];
                case 3:
                    validation = _2.sent();
                    if (!validation.error) return [3 /*break*/, 5];
                    _d = react_router_1.data;
                    _e = [{ success: false, message: "Invalid session data" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(validation.error, "Invalid session data"))];
                case 4: return [2 /*return*/, _d.apply(void 0, _e.concat([_2.sent()]))];
                case 5:
                    sessionItems = validation.data.items;
                    startDate = (0, date_1.startOfWeek)((0, date_1.today)((0, date_1.getLocalTimeZone)()), "en-US");
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getJob)(client, jobId),
                            client
                                .from("itemReplenishment")
                                .select("itemId, leadTime, lotSize, manufacturingBlocked, purchasingBlocked, preferredSupplierId, requiresConfiguration, scrapPercentage, ...item(replenishmentSystem)")
                                .in("itemId", sessionItems.map(function (item) { return item.itemId; }))
                                .eq("companyId", companyId)
                        ])];
                case 6:
                    _f = _2.sent(), jobResult = _f[0], itemReplenishments = _f[1];
                    if (!(jobResult.error || !jobResult.data)) return [3 /*break*/, 8];
                    _g = react_router_1.data;
                    _h = [{ success: false, message: "Failed to get job information" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(jobResult.error, "Failed to get job information"))];
                case 7: return [2 /*return*/, _g.apply(void 0, _h.concat([_2.sent()]))];
                case 8:
                    itemReplenishmentsMap = new Map((_0 = (_z = itemReplenishments.data) === null || _z === void 0 ? void 0 : _z.map(function (item) { return [item.itemId, item]; })) !== null && _0 !== void 0 ? _0 : []);
                    job = jobResult.data;
                    locationId = job.locationId;
                    jobStartDate = job.startDate;
                    if (!!locationId) return [3 /*break*/, 10];
                    _j = react_router_1.data;
                    _k = [{ success: false, message: "Job location is required" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Job location is required", "Invalid job configuration"))];
                case 9: return [2 /*return*/, _j.apply(void 0, _k.concat([_2.sent()]))];
                case 10:
                    endDate = jobStartDate
                        ? new Date(String(jobStartDate))
                        : new Date(startDate.add({ weeks: 8 }).toString());
                    weeksToProject = Math.max(1, Math.ceil((endDate.getTime() - new Date(startDate.toString()).getTime()) /
                        (7 * 24 * 60 * 60 * 1000)));
                    return [4 /*yield*/, (0, shared_server_1.getOrCreatePeriods)((0, date_1.today)((0, date_1.getLocalTimeZone)()), weeksToProject)];
                case 11:
                    periods = _2.sent();
                    transferItems = sessionItems.filter(function (item) { return item.action === "transfer"; });
                    orderItems = sessionItems.filter(function (item) { return item.action === "order"; });
                    hasTransfer = false;
                    hasPurchaseOrder = false;
                    hasJobs = false;
                    if (!(transferItems.length > 0)) return [3 /*break*/, 28];
                    transferLines = [];
                    _2.label = 12;
                case 12:
                    _2.trys.push([12, 18, 19, 24]);
                    _loop_1 = function () {
                        var item, _3, availableSources, sourcesError, validSources, remainingQuantity, _4, validSources_1, source, availableQuantity, transferQuantity, transferLine;
                        return __generator(this, function (_5) {
                            switch (_5.label) {
                                case 0:
                                    _y = transferItems_1_1.value;
                                    _l = false;
                                    item = _y;
                                    if (!item.storageUnitId || !item.quantity || !item.id) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    return [4 /*yield*/, client.rpc("get_item_storage_unit_requirements_by_location_and_item", {
                                            company_id: companyId,
                                            location_id: locationId,
                                            item_id: item.itemId
                                        })];
                                case 1:
                                    _3 = _5.sent(), availableSources = _3.data, sourcesError = _3.error;
                                    if (sourcesError) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    validSources = (availableSources === null || availableSources === void 0 ? void 0 : availableSources.filter(function (source) {
                                        return source.storageUnitId !== item.storageUnitId &&
                                            source.quantityOnHandInStorageUnit >
                                                source.quantityRequiredByStorageUnit;
                                    })) || [];
                                    if (validSources.length === 0) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    // Sort sources by available quantity (descending) to prioritize storage units with more stock
                                    validSources.sort(function (a, b) {
                                        var aAvailable = a.quantityOnHandInStorageUnit - a.quantityRequiredByStorageUnit;
                                        var bAvailable = b.quantityOnHandInStorageUnit - b.quantityRequiredByStorageUnit;
                                        return bAvailable - aAvailable;
                                    });
                                    remainingQuantity = item.quantity;
                                    for (_4 = 0, validSources_1 = validSources; _4 < validSources_1.length; _4++) {
                                        source = validSources_1[_4];
                                        if (remainingQuantity <= 0)
                                            break;
                                        availableQuantity = source.quantityOnHandInStorageUnit -
                                            source.quantityRequiredByStorageUnit;
                                        transferQuantity = Math.min(remainingQuantity, availableQuantity);
                                        if (transferQuantity > 0) {
                                            transferLine = {
                                                itemId: item.itemId, // Use the actual item ID, not the job material ID
                                                fromStorageUnitId: source.storageUnitId,
                                                toStorageUnitId: item.storageUnitId,
                                                quantity: transferQuantity,
                                                requiresSerialTracking: item.requiresSerialTracking,
                                                requiresBatchTracking: item.requiresBatchTracking
                                            };
                                            transferLines.push(transferLine);
                                            remainingQuantity -= transferQuantity;
                                        }
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _l = true, transferItems_1 = __asyncValues(transferItems);
                    _2.label = 13;
                case 13: return [4 /*yield*/, transferItems_1.next()];
                case 14:
                    if (!(transferItems_1_1 = _2.sent(), _w = transferItems_1_1.done, !_w)) return [3 /*break*/, 17];
                    return [5 /*yield**/, _loop_1()];
                case 15:
                    _2.sent();
                    _2.label = 16;
                case 16:
                    _l = true;
                    return [3 /*break*/, 13];
                case 17: return [3 /*break*/, 24];
                case 18:
                    e_1_1 = _2.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 24];
                case 19:
                    _2.trys.push([19, , 22, 23]);
                    if (!(!_l && !_w && (_x = transferItems_1.return))) return [3 /*break*/, 21];
                    return [4 /*yield*/, _x.call(transferItems_1)];
                case 20:
                    _2.sent();
                    _2.label = 21;
                case 21: return [3 /*break*/, 23];
                case 22:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 23: return [7 /*endfinally*/];
                case 24:
                    linesWithExpandedSerialTracking = transferLines.reduce(function (acc, line) {
                        // If quantity contains a decimal, ignore the line (as per requirements)
                        if (line.quantity && !Number.isInteger(line.quantity)) {
                            return acc;
                        }
                        // If item requires serial tracking and quantity is a whole number > 1
                        if (line.requiresSerialTracking && line.quantity && line.quantity > 1) {
                            // Break out into multiple lines with quantity 1
                            acc.push.apply(acc, Array.from({ length: line.quantity }, function () { return (__assign(__assign({}, line), { quantity: 1 })); }));
                        }
                        else {
                            acc.push(line);
                        }
                        return acc;
                    }, []);
                    if (!(linesWithExpandedSerialTracking.length > 0)) return [3 /*break*/, 28];
                    return [4 /*yield*/, (0, inventory_1.insertStockTransfer)(client, {
                            locationId: locationId,
                            lines: linesWithExpandedSerialTracking,
                            companyId: companyId,
                            createdBy: userId
                        })];
                case 25:
                    createStockTransfer = _2.sent();
                    if (!(createStockTransfer.error || !createStockTransfer.data)) return [3 /*break*/, 27];
                    _m = react_router_1.data;
                    _o = [{ success: false, message: "Failed to create stock transfer" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createStockTransfer.error, "Failed to create stock transfer"))];
                case 26: return [2 /*return*/, _m.apply(void 0, _o.concat([_2.sent()]))];
                case 27:
                    hasTransfer = true;
                    _2.label = 28;
                case 28:
                    if (!(orderItems.length > 0)) return [3 /*break*/, 38];
                    buyItems = orderItems.filter(function (item) {
                        var _a, _b;
                        return ((_a = itemReplenishmentsMap.get(item.itemId)) === null || _a === void 0 ? void 0 : _a.replenishmentSystem) === "Buy" ||
                            ((_b = itemReplenishmentsMap.get(item.itemId)) === null || _b === void 0 ? void 0 : _b.replenishmentSystem) ===
                                "Buy and Make";
                    });
                    makeItems = orderItems.filter(function (item) { var _a; return ((_a = itemReplenishmentsMap.get(item.itemId)) === null || _a === void 0 ? void 0 : _a.replenishmentSystem) === "Make"; });
                    if (!(buyItems.length > 0)) return [3 /*break*/, 35];
                    return [4 /*yield*/, client
                            .from("supplierPart")
                            .select("*")
                            .in("itemId", buyItems.map(function (item) { return item.itemId; }))
                            .eq("companyId", companyId)];
                case 29:
                    supplierParts = _2.sent();
                    if (!supplierParts.error) return [3 /*break*/, 30];
                    console.error(supplierParts.error);
                    return [3 /*break*/, 35];
                case 30:
                    itemsBySupplier = new Map();
                    _loop_2 = function (item) {
                        var replenishment = itemReplenishmentsMap.get(item.itemId);
                        // Find preferred supplier or first available supplier
                        var itemSupplierParts = ((_1 = supplierParts.data) === null || _1 === void 0 ? void 0 : _1.filter(function (sp) { return sp.itemId === item.itemId; })) || [];
                        var selectedSupplier = null;
                        // First try to find preferred supplier
                        if (replenishment === null || replenishment === void 0 ? void 0 : replenishment.preferredSupplierId) {
                            selectedSupplier = itemSupplierParts.find(function (sp) { return sp.supplierId === replenishment.preferredSupplierId; });
                        }
                        // If no preferred supplier found, take the first one
                        if (!selectedSupplier && itemSupplierParts.length > 0) {
                            selectedSupplier = itemSupplierParts[0];
                        }
                        if (!selectedSupplier) {
                            console.error("[Purchase Orders] No supplier found for item ".concat(item.itemId));
                            return "continue";
                        }
                        // Group by supplier
                        if (!itemsBySupplier.has(selectedSupplier.supplierId)) {
                            itemsBySupplier.set(selectedSupplier.supplierId, []);
                        }
                        itemsBySupplier.get(selectedSupplier.supplierId).push({
                            item: item,
                            supplier: selectedSupplier,
                            replenishment: replenishment
                        });
                    };
                    // First pass: assign suppliers to each item
                    for (_i = 0, buyItems_1 = buyItems; _i < buyItems_1.length; _i++) {
                        item = buyItems_1[_i];
                        _loop_2(item);
                    }
                    purchasePlanningItems = [];
                    findPeriodId = function (dueDate) {
                        var _a;
                        var dueDateParsed = (0, date_1.parseDate)(dueDate);
                        var period = periods === null || periods === void 0 ? void 0 : periods.find(function (p) {
                            var startDate = (0, date_1.parseDate)(p.startDate);
                            var endDate = (0, date_1.parseDate)(p.endDate);
                            return dueDateParsed >= startDate && dueDateParsed <= endDate;
                        });
                        if (!period) {
                            if (periods && periods.length > 0) {
                                var firstPeriod = periods[0];
                                var lastPeriod = periods[periods.length - 1];
                                var firstStartDate = (0, date_1.parseDate)(firstPeriod.startDate);
                                var lastEndDate = (0, date_1.parseDate)(lastPeriod.endDate);
                                if (dueDateParsed < firstStartDate) {
                                    return firstPeriod.id;
                                }
                                else if (dueDateParsed > lastEndDate) {
                                    return lastPeriod.id;
                                }
                            }
                            return ((_a = periods === null || periods === void 0 ? void 0 : periods[0]) === null || _a === void 0 ? void 0 : _a.id) || "";
                        }
                        return period.id;
                    };
                    for (_p = 0, _q = itemsBySupplier.entries(); _p < _q.length; _p++) {
                        _r = _q[_p], supplierId = _r[0], supplierItems = _r[1];
                        // Create one planning item per actual item
                        for (_s = 0, supplierItems_1 = supplierItems; _s < supplierItems_1.length; _s++) {
                            _t = supplierItems_1[_s], item = _t.item, supplier = _t.supplier, replenishment = _t.replenishment;
                            jobStartDateParsed = jobStartDate
                                ? (0, date_1.parseDate)(jobStartDate)
                                : (0, date_1.today)((0, date_1.getLocalTimeZone)());
                            leadTime = (replenishment === null || replenishment === void 0 ? void 0 : replenishment.leadTime) || 0;
                            purchaseOrderDueDate = jobStartDateParsed.toString();
                            purchaseOrderStartDate = jobStartDateParsed
                                .subtract({ days: leadTime })
                                .toString();
                            periodId = findPeriodId(purchaseOrderDueDate);
                            orders = [
                                {
                                    quantity: Math.max(item.quantity || 0, 1),
                                    dueDate: purchaseOrderDueDate,
                                    startDate: purchaseOrderStartDate,
                                    periodId: periodId,
                                    supplierId: supplierId,
                                    unitPrice: supplier.unitPrice || 0,
                                    unitOfMeasureCode: supplier.supplierUnitOfMeasureCode || "EA",
                                    description: item.description
                                }
                            ];
                            purchasePlanningItems.push({
                                id: item.itemId,
                                orders: orders
                            });
                        }
                    }
                    if (!(purchasePlanningItems.length > 0)) return [3 /*break*/, 35];
                    purchasePlanningPayload = {
                        action: "order",
                        items: purchasePlanningItems,
                        locationId: locationId
                    };
                    purchasePlanningUrl = "".concat(new URL(request.url).origin).concat(path_1.path.to.bulkUpdatePurchasingPlanning);
                    return [4 /*yield*/, fetch(purchasePlanningUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: request.headers.get("Authorization") || "",
                                Cookie: request.headers.get("Cookie") || ""
                            },
                            body: JSON.stringify(purchasePlanningPayload)
                        })];
                case 31:
                    result = _2.sent();
                    if (!result.ok) return [3 /*break*/, 33];
                    return [4 /*yield*/, result.json()];
                case 32:
                    responseData = _2.sent();
                    if (responseData === null || responseData === void 0 ? void 0 : responseData.success) {
                        hasPurchaseOrder = true;
                    }
                    else {
                        console.error("[Purchase Orders] API returned success: false", responseData);
                    }
                    return [3 /*break*/, 35];
                case 33: return [4 /*yield*/, result.text()];
                case 34:
                    errorText = _2.sent();
                    console.error("[Purchase Orders] API call failed:", {
                        status: result.status,
                        statusText: result.statusText,
                        error: errorText
                    });
                    _2.label = 35;
                case 35:
                    if (!(makeItems.length > 0)) return [3 /*break*/, 38];
                    productionPlanningUrl = "".concat(new URL(request.url).origin).concat(path_1.path.to.bulkUpdateProductionPlanning);
                    productionPlanningItems = makeItems.map(function (item) {
                        var _a;
                        var replenishment = itemReplenishmentsMap.get(item.itemId);
                        var lotSize = (_a = replenishment === null || replenishment === void 0 ? void 0 : replenishment.lotSize) !== null && _a !== void 0 ? _a : 0;
                        var requiredQuantity = item.quantity || 0;
                        // Calculate orders based on lot size chunking
                        var orders = [];
                        // Calculate dates: due date = job start date, start date = due date - lead time
                        var jobStartDateParsed = jobStartDate
                            ? (0, date_1.parseDate)(jobStartDate)
                            : (0, date_1.today)((0, date_1.getLocalTimeZone)());
                        var leadTime = (replenishment === null || replenishment === void 0 ? void 0 : replenishment.leadTime) || 0;
                        var productionOrderDueDate = jobStartDateParsed.toString();
                        var productionOrderStartDate = jobStartDateParsed
                            .subtract({ days: leadTime })
                            .toString();
                        // Find the correct period based on the production order due date
                        var findPeriodId = function (dueDate) {
                            var _a;
                            var dueDateParsed = (0, date_1.parseDate)(dueDate);
                            var period = periods === null || periods === void 0 ? void 0 : periods.find(function (p) {
                                var startDate = (0, date_1.parseDate)(p.startDate);
                                var endDate = (0, date_1.parseDate)(p.endDate);
                                return dueDateParsed >= startDate && dueDateParsed <= endDate;
                            });
                            // If no matching period found, use the first period if due date is before it,
                            // or the last period if due date is after all periods
                            if (!period) {
                                if (periods && periods.length > 0) {
                                    var firstPeriod = periods[0];
                                    var lastPeriod = periods[periods.length - 1];
                                    var firstStartDate = (0, date_1.parseDate)(firstPeriod.startDate);
                                    var lastEndDate = (0, date_1.parseDate)(lastPeriod.endDate);
                                    if (dueDateParsed < firstStartDate) {
                                        return firstPeriod.id;
                                    }
                                    else if (dueDateParsed > lastEndDate) {
                                        return lastPeriod.id;
                                    }
                                }
                                return ((_a = periods === null || periods === void 0 ? void 0 : periods[0]) === null || _a === void 0 ? void 0 : _a.id) || "";
                            }
                            return period.id;
                        };
                        var periodId = findPeriodId(productionOrderDueDate);
                        if (lotSize === 0) {
                            // If lot size is 0, order the exact required quantity
                            var orderQuantity = Math.max(requiredQuantity, 1); // At least 1 if no quantity specified
                            orders.push({
                                quantity: orderQuantity,
                                dueDate: productionOrderDueDate,
                                startDate: productionOrderStartDate,
                                isASAP: startDate.compare((0, date_1.today)((0, date_1.getLocalTimeZone)())) < 0,
                                periodId: periodId
                            });
                        }
                        else {
                            // If lot size > 0, use lot size chunking
                            if (requiredQuantity <= 0) {
                                // If no quantity required, create one order with lot size
                                orders.push({
                                    quantity: lotSize,
                                    dueDate: productionOrderDueDate,
                                    startDate: productionOrderStartDate,
                                    isASAP: false,
                                    periodId: periodId
                                });
                            }
                            else if (requiredQuantity <= lotSize) {
                                // If required quantity is less than or equal to lot size, order the lot size
                                orders.push({
                                    quantity: lotSize,
                                    dueDate: productionOrderDueDate,
                                    startDate: productionOrderStartDate,
                                    isASAP: false,
                                    periodId: periodId
                                });
                            }
                            else {
                                // If required quantity is greater than lot size, create multiple orders
                                var numberOfOrders = Math.ceil(requiredQuantity / lotSize);
                                for (var i = 0; i < numberOfOrders; i++) {
                                    orders.push({
                                        quantity: lotSize,
                                        dueDate: productionOrderDueDate,
                                        startDate: productionOrderStartDate,
                                        isASAP: false,
                                        periodId: periodId
                                    });
                                }
                            }
                        }
                        return {
                            id: item.itemId,
                            orders: orders
                        };
                    });
                    productionPlanningPayload = {
                        action: "order",
                        items: productionPlanningItems,
                        locationId: locationId
                    };
                    return [4 /*yield*/, fetch(productionPlanningUrl, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: request.headers.get("Authorization") || "",
                                Cookie: request.headers.get("Cookie") || ""
                            },
                            body: JSON.stringify(productionPlanningPayload)
                        })];
                case 36:
                    result = _2.sent();
                    return [4 /*yield*/, result.json()];
                case 37:
                    data_1 = _2.sent();
                    if (data_1 === null || data_1 === void 0 ? void 0 : data_1.success) {
                        hasJobs = true;
                    }
                    _2.label = 38;
                case 38:
                    createdItems = [];
                    if (hasTransfer)
                        createdItems.push("stock transfer");
                    if (hasPurchaseOrder)
                        createdItems.push("purchase order(s)");
                    if (hasJobs)
                        createdItems.push("job(s)");
                    successMessage = createdItems.length > 0
                        ? "Successfully created ".concat(createdItems.join(", "))
                        : "Session processed successfully, but without any transfers or orders";
                    _u = react_router_1.data;
                    _v = [{ success: true, message: successMessage }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)(successMessage))];
                case 39: return [2 /*return*/, _u.apply(void 0, _v.concat([_2.sent()]))];
            }
        });
    });
}
