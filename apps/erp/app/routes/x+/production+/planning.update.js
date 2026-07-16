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
exports.action = action;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var production_1 = require("~/modules/production");
var itemsValidator = zod_1.z
    .object({
    id: zod_1.z.string(),
    orders: zod_1.z.array(production_1.productionOrderValidator)
})
    .array();
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, _d, items, action, locationId, _e, parsedItems, errorMessages, itemsToOrder, allJobIds, allSupplyForecasts_2, processedItems, errors, _loop_1, _i, itemsToOrder_1, item, forecastMap, _f, allSupplyForecasts_1, forecast, key, existing, uniqueSupplyForecasts, insertForecasts, errorMsg, _g, allJobIds_1, jobId, message, error_1;
        var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        var request = _b.request;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "production",
                        role: "employee",
                        bypassRls: true
                    })];
                case 1:
                    _c = _t.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.json()];
                case 2:
                    _d = _t.sent(), items = _d.items, action = _d.action, locationId = _d.locationId;
                    if (typeof locationId !== "string") {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Location ID is required and must be a valid string"
                            }, { status: 500 })];
                    }
                    if (typeof action !== "string") {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Action parameter is required and must be a valid string"
                            }, { status: 500 })];
                    }
                    _e = action;
                    switch (_e) {
                        case "order": return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 16];
                case 3:
                    parsedItems = itemsValidator.safeParse(items);
                    if (!parsedItems.success) {
                        errorMessages = parsedItems.error.errors.map(function (error) {
                            var path = error.path;
                            var field = path[path.length - 1];
                            // Create more readable error messages based on the field and context
                            if (field === "orders" && path.length === 2) {
                                return "No orders provided for item";
                            }
                            if (field === "quantity") {
                                return "Invalid quantity specified";
                            }
                            if (field === "periodId") {
                                return "No period specified";
                            }
                            if (field === "startDate") {
                                return "Invalid start date";
                            }
                            if (field === "dueDate") {
                                return "Invalid due date";
                            }
                            // Fallback to original message for unhandled cases
                            return error.message;
                        });
                        console.error("Validation errors:", parsedItems.error.errors);
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Validation failed: ".concat(errorMessages.join(", ")),
                                errors: errorMessages
                            }, { status: 500 })];
                    }
                    itemsToOrder = parsedItems.data;
                    if (itemsToOrder.length === 0) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "No items were provided to create production orders"
                            }, { status: 500 })];
                    }
                    _t.label = 4;
                case 4:
                    _t.trys.push([4, 15, , 16]);
                    allJobIds = [];
                    allSupplyForecasts_2 = [];
                    processedItems = 0;
                    errors = [];
                    _loop_1 = function (item) {
                        var orders, jobIds, supplyForecastByPeriod, manufacturing, errorMsg, errorMsg, errorMsg, itemProcessed, _u, orders_1, order, createJob, errorMsg, id, errorMsg, upsertMethod, errorMsg, updateScrapPercentage, updateScrapQuantity, updateJob, errorMsg, periodId;
                        return __generator(this, function (_v) {
                            switch (_v.label) {
                                case 0:
                                    orders = item.orders;
                                    jobIds = [];
                                    supplyForecastByPeriod = {};
                                    return [4 /*yield*/, client
                                            .from("itemReplenishment")
                                            .select("manufacturingBlocked, scrapPercentage, requiresConfiguration")
                                            .eq("itemId", item.id)
                                            .single()];
                                case 1:
                                    manufacturing = _v.sent();
                                    if (manufacturing.error) {
                                        errorMsg = "Failed to retrieve manufacturing data for item ".concat(item.id, ": ").concat(manufacturing.error.message);
                                        console.error(errorMsg);
                                        errors.push(errorMsg);
                                        return [2 /*return*/, "continue"];
                                    }
                                    if ((_h = manufacturing.data) === null || _h === void 0 ? void 0 : _h.manufacturingBlocked) {
                                        errorMsg = "Manufacturing is blocked for item ".concat(item.id);
                                        console.warn(errorMsg);
                                        errors.push(errorMsg);
                                        return [2 /*return*/, "continue"];
                                    }
                                    if ((_j = manufacturing.data) === null || _j === void 0 ? void 0 : _j.requiresConfiguration) {
                                        errorMsg = "Manufacturing requires configuration for item ".concat(item.id);
                                        console.warn(errorMsg);
                                        errors.push(errorMsg);
                                        return [2 /*return*/, "continue"];
                                    }
                                    itemProcessed = false;
                                    _u = 0, orders_1 = orders;
                                    _v.label = 2;
                                case 2:
                                    if (!(_u < orders_1.length)) return [3 /*break*/, 9];
                                    order = orders_1[_u];
                                    if (!!order.existingId) return [3 /*break*/, 5];
                                    return [4 /*yield*/, (0, production_1.insertJob)(client, {
                                            itemId: item.id,
                                            quantity: order.quantity,
                                            startDate: (_k = order.startDate) !== null && _k !== void 0 ? _k : undefined,
                                            dueDate: (_l = order.dueDate) !== null && _l !== void 0 ? _l : undefined,
                                            deadlineType: order.isASAP ? "ASAP" : "Soft Deadline",
                                            status: "Planned",
                                            locationId: locationId,
                                            companyId: companyId,
                                            createdBy: userId,
                                            unitOfMeasureCode: "EA"
                                        }, { skipMethod: true, skipRecalculate: true })];
                                case 3:
                                    createJob = _v.sent();
                                    if (createJob.error) {
                                        errorMsg = "Failed to create job for item ".concat(item.id, ": ").concat(createJob.error.message);
                                        console.error(errorMsg);
                                        errors.push(errorMsg);
                                        return [3 /*break*/, 8];
                                    }
                                    id = (_m = createJob.data) === null || _m === void 0 ? void 0 : _m.id;
                                    if (!id) {
                                        errorMsg = "Job was not returned after creation for item ".concat(item.id);
                                        console.error(errorMsg);
                                        errors.push(errorMsg);
                                        return [3 /*break*/, 8];
                                    }
                                    return [4 /*yield*/, (0, production_1.upsertJobMethod)(client, "itemToJob", {
                                            sourceId: item.id,
                                            targetId: id,
                                            companyId: companyId,
                                            userId: userId
                                        })];
                                case 4:
                                    upsertMethod = _v.sent();
                                    if (upsertMethod.error) {
                                        errorMsg = "Failed to create job method for item ".concat(item.id, ": ").concat(upsertMethod.error.message);
                                        console.error(errorMsg);
                                        errors.push(errorMsg);
                                        return [3 /*break*/, 8];
                                    }
                                    jobIds.push(id);
                                    itemProcessed = true;
                                    return [3 /*break*/, 7];
                                case 5:
                                    // Update existing job
                                    jobIds.push(order.existingId);
                                    updateScrapPercentage = (_p = (_o = manufacturing.data) === null || _o === void 0 ? void 0 : _o.scrapPercentage) !== null && _p !== void 0 ? _p : 0;
                                    updateScrapQuantity = updateScrapPercentage > 0
                                        ? Math.ceil(order.quantity * (updateScrapPercentage / 100))
                                        : 0;
                                    return [4 /*yield*/, client
                                            .from("job")
                                            .update({
                                            dueDate: (_q = order.dueDate) !== null && _q !== void 0 ? _q : undefined,
                                            deadlineType: order.isASAP ? "ASAP" : "Soft Deadline",
                                            quantity: order.quantity,
                                            scrapQuantity: updateScrapQuantity,
                                            startDate: (_r = order.startDate) !== null && _r !== void 0 ? _r : undefined,
                                            status: "Planned",
                                            updatedAt: new Date().toISOString(),
                                            updatedBy: userId
                                        })
                                            .eq("id", order.existingId)];
                                case 6:
                                    updateJob = _v.sent();
                                    if (updateJob.error) {
                                        errorMsg = "Failed to update job ".concat(order.existingId, " for item ").concat(item.id, ": ").concat(updateJob.error.message);
                                        console.error(errorMsg);
                                        errors.push(errorMsg);
                                        return [3 /*break*/, 8];
                                    }
                                    itemProcessed = true;
                                    _v.label = 7;
                                case 7:
                                    periodId = order.periodId;
                                    supplyForecastByPeriod[periodId] =
                                        (supplyForecastByPeriod[periodId] || 0) +
                                            (order.quantity - ((_s = order.existingQuantity) !== null && _s !== void 0 ? _s : 0));
                                    _v.label = 8;
                                case 8:
                                    _u++;
                                    return [3 /*break*/, 2];
                                case 9:
                                    if (itemProcessed) {
                                        processedItems++;
                                        // Add job IDs to the overall list
                                        allJobIds.push.apply(allJobIds, jobIds);
                                        // Add supply forecasts for this item
                                        Object.entries(supplyForecastByPeriod).forEach(function (_a) {
                                            var periodId = _a[0], quantity = _a[1];
                                            allSupplyForecasts_2.push({
                                                itemId: item.id,
                                                locationId: locationId,
                                                sourceType: "Production Order",
                                                forecastQuantity: quantity,
                                                periodId: periodId,
                                                companyId: companyId,
                                                createdBy: userId,
                                                updatedBy: userId
                                            });
                                        });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, itemsToOrder_1 = itemsToOrder;
                    _t.label = 5;
                case 5:
                    if (!(_i < itemsToOrder_1.length)) return [3 /*break*/, 8];
                    item = itemsToOrder_1[_i];
                    return [5 /*yield**/, _loop_1(item)];
                case 6:
                    _t.sent();
                    _t.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    if (!(allSupplyForecasts_2.length > 0)) return [3 /*break*/, 10];
                    forecastMap = new Map();
                    for (_f = 0, allSupplyForecasts_1 = allSupplyForecasts_2; _f < allSupplyForecasts_1.length; _f++) {
                        forecast = allSupplyForecasts_1[_f];
                        key = "".concat(forecast.itemId, "-").concat(forecast.locationId, "-").concat(forecast.periodId);
                        existing = forecastMap.get(key);
                        if (existing) {
                            // Combine quantities for the same key
                            existing.forecastQuantity += forecast.forecastQuantity;
                        }
                        else {
                            forecastMap.set(key, __assign({}, forecast));
                        }
                    }
                    uniqueSupplyForecasts = Array.from(forecastMap.values());
                    return [4 /*yield*/, client
                            .from("supplyForecast")
                            .upsert(uniqueSupplyForecasts, {
                            onConflict: "itemId,locationId,periodId",
                            ignoreDuplicates: false
                        })];
                case 9:
                    insertForecasts = _t.sent();
                    if (insertForecasts.error) {
                        errorMsg = "Failed to insert supply forecasts: ".concat(insertForecasts.error.message);
                        console.error(errorMsg);
                        errors.push(errorMsg);
                    }
                    _t.label = 10;
                case 10:
                    if (!(allJobIds.length > 0)) return [3 /*break*/, 14];
                    _g = 0, allJobIds_1 = allJobIds;
                    _t.label = 11;
                case 11:
                    if (!(_g < allJobIds_1.length)) return [3 /*break*/, 14];
                    jobId = allJobIds_1[_g];
                    return [4 /*yield*/, (0, production_1.recalculateJobRequirements)(client, {
                            id: jobId,
                            companyId: companyId,
                            userId: userId
                        })];
                case 12:
                    _t.sent();
                    _t.label = 13;
                case 13:
                    _g++;
                    return [3 /*break*/, 11];
                case 14:
                    if (errors.length > 0 && processedItems === 0) {
                        return [2 /*return*/, (0, react_router_1.data)({
                                success: false,
                                message: "Failed to process any items. Errors: ".concat(errors
                                    .slice(0, 3)
                                    .join("; ")).concat(errors.length > 3 ? " and ".concat(errors.length - 3, " more...") : ""),
                                errors: errors
                            }, { status: 500 })];
                    }
                    message = processedItems === itemsToOrder.length
                        ? "Successfully processed all ".concat(processedItems, " items with ").concat(allJobIds.length, " jobs")
                        : "Processed ".concat(processedItems, " of ").concat(itemsToOrder.length, " items. ").concat(errors.length, " errors occurred: ").concat(errors.slice(0, 2).join("; ")).concat(errors.length > 2 ? "..." : "");
                    return [2 /*return*/, {
                            success: processedItems > 0,
                            message: message,
                            processedItems: processedItems,
                            totalItems: itemsToOrder.length,
                            errors: errors.length > 0 ? errors : undefined
                        }];
                case 15:
                    error_1 = _t.sent();
                    console.error("Unexpected error processing production orders:", error_1);
                    return [2 /*return*/, (0, react_router_1.data)({
                            success: false,
                            message: "Unexpected error occurred while processing production orders: ".concat(error_1 instanceof Error ? error_1.message : "Unknown error")
                        }, { status: 500 })];
                case 16: return [2 /*return*/, (0, react_router_1.data)({
                        success: false,
                        message: "Unknown action '".concat(action, "'. Expected action: 'order'")
                    }, { status: 500 })];
            }
        });
    });
}
