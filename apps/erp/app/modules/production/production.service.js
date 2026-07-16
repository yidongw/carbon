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
exports.getPartDocuments = void 0;
exports.convertSalesOrderLinesToJobs = convertSalesOrderLinesToJobs;
exports.calculateJobPriority = calculateJobPriority;
exports.deleteDemandForecasts = deleteDemandForecasts;
exports.deleteDemandProjections = deleteDemandProjections;
exports.deleteJob = deleteJob;
exports.deleteJobMaterial = deleteJobMaterial;
exports.deleteJobOperation = deleteJobOperation;
exports.deleteJobOperationStep = deleteJobOperationStep;
exports.deleteJobOperationParameter = deleteJobOperationParameter;
exports.deleteJobOperationTool = deleteJobOperationTool;
exports.deleteProcedure = deleteProcedure;
exports.deleteProcedureStep = deleteProcedureStep;
exports.deleteProcedureParameter = deleteProcedureParameter;
exports.deleteProductionEvent = deleteProductionEvent;
exports.deleteProductionQuantity = deleteProductionQuantity;
exports.deleteJobOperationSupplierQuantity = deleteJobOperationSupplierQuantity;
exports.getActiveJobOperationByJobId = getActiveJobOperationByJobId;
exports.getActiveJobOperationsByLocation = getActiveJobOperationsByLocation;
exports.getJobsByDateRange = getJobsByDateRange;
exports.getUnscheduledJobs = getUnscheduledJobs;
exports.getActiveProductionEvents = getActiveProductionEvents;
exports.deleteScrapReason = deleteScrapReason;
exports.deleteFailureMode = deleteFailureMode;
exports.deleteMaintenanceDispatch = deleteMaintenanceDispatch;
exports.deleteMaintenanceDispatchComment = deleteMaintenanceDispatchComment;
exports.deleteMaintenanceDispatchEvent = deleteMaintenanceDispatchEvent;
exports.deleteMaintenanceDispatchItem = deleteMaintenanceDispatchItem;
exports.deleteMaintenanceDispatchWorkCenter = deleteMaintenanceDispatchWorkCenter;
exports.deleteMaintenanceSchedule = deleteMaintenanceSchedule;
exports.deleteMaintenanceScheduleItem = deleteMaintenanceScheduleItem;
exports.getDemandForecasts = getDemandForecasts;
exports.getDemandProjections = getDemandProjections;
exports.getJobDocuments = getJobDocuments;
exports.getJobDocumentsWithItemId = getJobDocumentsWithItemId;
exports.getJob = getJob;
exports.getJobConfigurationHistory = getJobConfigurationHistory;
exports.getJobProductionQuantitySummary = getJobProductionQuantitySummary;
exports.getJobByOperationId = getJobByOperationId;
exports.getJobPurchaseOrderLines = getJobPurchaseOrderLines;
exports.getJobs = getJobs;
exports.getJobsBySalesOrderLine = getJobsBySalesOrderLine;
exports.getJobsList = getJobsList;
exports.getJobMakeMethodById = getJobMakeMethodById;
exports.getRootMakeMethod = getRootMakeMethod;
exports.getJobMaterialsWithQuantityOnHand = getJobMaterialsWithQuantityOnHand;
exports.getJobMethodTree = getJobMethodTree;
exports.getJobMethodTreeArray = getJobMethodTreeArray;
exports.getJobMaterial = getJobMaterial;
exports.getJobMaterialsByMethodId = getJobMaterialsByMethodId;
exports.getJobOperation = getJobOperation;
exports.getJobOperationActorContext = getJobOperationActorContext;
exports.validateActorMatchesOperationSupplierRouting = validateActorMatchesOperationSupplierRouting;
exports.assertSupplierQuantityAllowedForOperation = assertSupplierQuantityAllowedForOperation;
exports.getJobOperations = getJobOperations;
exports.getJobOperationDependencies = getJobOperationDependencies;
exports.getJobOperationsAssignedToEmployee = getJobOperationsAssignedToEmployee;
exports.getJobOperationAttachments = getJobOperationAttachments;
exports.getJobOperationsList = getJobOperationsList;
exports.getJobOperationsByMethodId = getJobOperationsByMethodId;
exports.getJobOperationStepRecords = getJobOperationStepRecords;
exports.getOutsideOperationsByJobId = getOutsideOperationsByJobId;
exports.getProcedure = getProcedure;
exports.getProcedureSteps = getProcedureSteps;
exports.getProcedureParameters = getProcedureParameters;
exports.getProcedureVersions = getProcedureVersions;
exports.getProcedures = getProcedures;
exports.getProceduresList = getProceduresList;
exports.getProductionEvent = getProductionEvent;
exports.getProductionEvents = getProductionEvents;
exports.getProductionEventsPage = getProductionEventsPage;
exports.getProductionQuantitiesByOperation = getProductionQuantitiesByOperation;
exports.getProductionQuantitiesPage = getProductionQuantitiesPage;
exports.getProductionEventsByOperations = getProductionEventsByOperations;
exports.getProductionPlanning = getProductionPlanning;
exports.getProductionProjections = getProductionProjections;
exports.getProductionQuantity = getProductionQuantity;
exports.getProductionQuantities = getProductionQuantities;
exports.getProductionDataByOperations = getProductionDataByOperations;
exports.getScrapReasonsList = getScrapReasonsList;
exports.getScrapReason = getScrapReason;
exports.getScrapReasons = getScrapReasons;
exports.getFailureMode = getFailureMode;
exports.getFailureModes = getFailureModes;
exports.getFailureModesList = getFailureModesList;
exports.getMaintenanceDispatch = getMaintenanceDispatch;
exports.getMaintenanceDispatches = getMaintenanceDispatches;
exports.getMaintenanceDispatchComments = getMaintenanceDispatchComments;
exports.getMaintenanceDispatchEvents = getMaintenanceDispatchEvents;
exports.getMaintenanceDispatchItems = getMaintenanceDispatchItems;
exports.getMaintenanceDispatchWorkCenters = getMaintenanceDispatchWorkCenters;
exports.getMaintenanceSchedule = getMaintenanceSchedule;
exports.getMaintenanceSchedules = getMaintenanceSchedules;
exports.getMaintenanceScheduleItems = getMaintenanceScheduleItems;
exports.getTrackedEntityByJobId = getTrackedEntityByJobId;
exports.getTrackedEntitiesByJobMakeMethodIds = getTrackedEntitiesByJobMakeMethodIds;
exports.getItemIdsWithConfigurationParameters = getItemIdsWithConfigurationParameters;
exports.getCurrentProcessByJobIds = getCurrentProcessByJobIds;
exports.getTrackedEntitiesByJobId = getTrackedEntitiesByJobId;
exports.recalculateJobOperationDependencies = recalculateJobOperationDependencies;
exports.recalculateJobRequirements = recalculateJobRequirements;
exports.recalculateJobMakeMethodRequirements = recalculateJobMakeMethodRequirements;
exports.runMRP = runMRP;
exports.updateJobBatchNumber = updateJobBatchNumber;
exports.updateJobStatus = updateJobStatus;
exports.updateJobMaterialOrder = updateJobMaterialOrder;
exports.updateJobOperationOrder = updateJobOperationOrder;
exports.updateJobOperationStepOrder = updateJobOperationStepOrder;
exports.updateKanbanJob = updateKanbanJob;
exports.updateQuoteOperationStepOrder = updateQuoteOperationStepOrder;
exports.updateMethodOperationStepOrder = updateMethodOperationStepOrder;
exports.updateJobOperationStatus = updateJobOperationStatus;
exports.updateJobOperationDueDate = updateJobOperationDueDate;
exports.updateProcedureStepOrder = updateProcedureStepOrder;
exports.upsertProductionEvent = upsertProductionEvent;
exports.updateProductionQuantity = updateProductionQuantity;
exports.upsertProductionQuantity = upsertProductionQuantity;
exports.insertJob = insertJob;
exports.updateJob = updateJob;
exports.upsertJob = upsertJob;
exports.upsertJobMaterial = upsertJobMaterial;
exports.upsertJobOperation = upsertJobOperation;
exports.upsertJobOperationStep = upsertJobOperationStep;
exports.upsertJobOperationParameter = upsertJobOperationParameter;
exports.upsertJobOperationTool = upsertJobOperationTool;
exports.upsertJobMethod = upsertJobMethod;
exports.upsertJobMaterialMakeMethod = upsertJobMaterialMakeMethod;
exports.upsertMakeMethodFromJob = upsertMakeMethodFromJob;
exports.upsertMakeMethodFromJobMethod = upsertMakeMethodFromJobMethod;
exports.upsertProcedure = upsertProcedure;
exports.upsertProcedureStep = upsertProcedureStep;
exports.upsertProcedureParameter = upsertProcedureParameter;
exports.upsertScrapReason = upsertScrapReason;
exports.upsertFailureMode = upsertFailureMode;
exports.upsertMaintenanceDispatch = upsertMaintenanceDispatch;
exports.upsertMaintenanceDispatchComment = upsertMaintenanceDispatchComment;
exports.upsertMaintenanceDispatchEvent = upsertMaintenanceDispatchEvent;
exports.upsertMaintenanceDispatchItem = upsertMaintenanceDispatchItem;
exports.upsertMaintenanceDispatchWorkCenter = upsertMaintenanceDispatchWorkCenter;
exports.upsertMaintenanceSchedule = upsertMaintenanceSchedule;
exports.upsertMaintenanceScheduleItem = upsertMaintenanceScheduleItem;
exports.upsertDemandForecasts = upsertDemandForecasts;
exports.upsertDemandProjections = upsertDemandProjections;
exports.triggerJobSchedule = triggerJobSchedule;
var database_1 = require("@carbon/database");
var date_1 = require("@internationalized/date");
var query_1 = require("~/utils/query");
var supabase_1 = require("~/utils/supabase");
var inventory_1 = require("../inventory");
var people_1 = require("../people");
var operationType_1 = require("./operationType");
function convertSalesOrderLinesToJobs(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var salesOrder, salesOrderLines, lines, opportunity, quoteId, salesOrderId, errors, jobsCreated, _c, lines_1, lines_1_1, line, manufacturing, lotSize, totalQuantity, totalJobs, jobsToCreate, defaultLocation, _d, _e, _f, index, nextSequence, isLastJob, jobQuantity, dueDate, locationId, storageUnitId, scrapPercentage, scrapQuantity, data, priority, createJob, upsertMethod, upsertMethod, e_1_1, e_2_1, skippedLines, skippedLinesStr;
        var _g, e_2, _h, _j, _k, e_1, _l, _m;
        var _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11;
        var orderId = _b.orderId, companyId = _b.companyId, userId = _b.userId;
        return __generator(this, function (_12) {
            switch (_12.label) {
                case 0: return [4 /*yield*/, client
                        .from("salesOrder")
                        .select("*")
                        .eq("id", orderId)
                        .single()];
                case 1:
                    salesOrder = _12.sent();
                    return [4 /*yield*/, client
                            .from("salesOrderLines")
                            .select("*")
                            .eq("salesOrderId", orderId)
                            .order("itemReadableId", { ascending: true })];
                case 2:
                    salesOrderLines = _12.sent();
                    if (companyId !== ((_o = salesOrder.data) === null || _o === void 0 ? void 0 : _o.companyId)) {
                        return [2 /*return*/, { data: null, error: "Company ID mismatch" }];
                    }
                    if (salesOrder.error) {
                        return [2 /*return*/, salesOrder];
                    }
                    if (salesOrderLines.error) {
                        return [2 /*return*/, salesOrderLines];
                    }
                    lines = salesOrderLines.data;
                    if (!lines) {
                        return [2 /*return*/, { data: null, error: "No lines found" }];
                    }
                    return [4 /*yield*/, client
                            .from("opportunity")
                            .select("*, quotes(*), salesOrders(*)")
                            .eq("id", (_q = (_p = salesOrder.data) === null || _p === void 0 ? void 0 : _p.opportunityId) !== null && _q !== void 0 ? _q : "")
                            .single()];
                case 3:
                    opportunity = _12.sent();
                    quoteId = (_s = (_r = opportunity.data) === null || _r === void 0 ? void 0 : _r.quotes[0]) === null || _s === void 0 ? void 0 : _s.id;
                    salesOrderId = (_u = (_t = opportunity.data) === null || _t === void 0 ? void 0 : _t.salesOrders[0]) === null || _u === void 0 ? void 0 : _u.id;
                    errors = [];
                    jobsCreated = 0;
                    _12.label = 4;
                case 4:
                    _12.trys.push([4, 31, 32, 37]);
                    _c = true, lines_1 = __asyncValues(lines);
                    _12.label = 5;
                case 5: return [4 /*yield*/, lines_1.next()];
                case 6:
                    if (!(lines_1_1 = _12.sent(), _g = lines_1_1.done, !_g)) return [3 /*break*/, 30];
                    _j = lines_1_1.value;
                    _c = false;
                    line = _j;
                    if (!(line.methodType === "Make to Order" && line.itemId)) return [3 /*break*/, 29];
                    return [4 /*yield*/, client
                            .from("itemReplenishment")
                            .select("*")
                            .eq("itemId", line.itemId)
                            .eq("companyId", companyId)
                            .single()];
                case 7:
                    manufacturing = _12.sent();
                    lotSize = (_w = (_v = manufacturing.data) === null || _v === void 0 ? void 0 : _v.lotSize) !== null && _w !== void 0 ? _w : 0;
                    totalQuantity = (_x = line.saleQuantity) !== null && _x !== void 0 ? _x : 0;
                    totalJobs = lotSize > 0 ? Math.ceil(totalQuantity / lotSize) : 1;
                    jobsToCreate = Math.max(1, totalJobs);
                    return [4 /*yield*/, client
                            .from("location")
                            .select("id")
                            .eq("companyId", companyId)
                            .limit(1)];
                case 8:
                    defaultLocation = _12.sent();
                    _12.label = 9;
                case 9:
                    _12.trys.push([9, 23, 24, 29]);
                    _d = true, _e = (e_1 = void 0, __asyncValues(Array.from({ length: jobsToCreate }).keys()));
                    _12.label = 10;
                case 10: return [4 /*yield*/, _e.next()];
                case 11:
                    if (!(_f = _12.sent(), _k = _f.done, !_k)) return [3 /*break*/, 22];
                    _m = _f.value;
                    _d = false;
                    index = _m;
                    return [4 /*yield*/, client.rpc("get_next_sequence", {
                            sequence_name: "job",
                            company_id: companyId
                        })];
                case 12:
                    nextSequence = _12.sent();
                    if (!nextSequence.data) {
                        errors.push("Failed to get sequence for line ".concat(line.itemReadableId));
                        return [3 /*break*/, 21];
                    }
                    isLastJob = index === jobsToCreate - 1;
                    jobQuantity = lotSize > 0
                        ? isLastJob
                            ? totalQuantity - lotSize * (jobsToCreate - 1)
                            : lotSize
                        : totalQuantity;
                    dueDate = (_y = line.promisedDate) !== null && _y !== void 0 ? _y : undefined;
                    locationId = (_z = line.locationId) !== null && _z !== void 0 ? _z : (_0 = salesOrder.data) === null || _0 === void 0 ? void 0 : _0.locationId;
                    if (!locationId) {
                        if (defaultLocation.data && defaultLocation.data.length > 0) {
                            locationId = (_2 = (_1 = defaultLocation.data) === null || _1 === void 0 ? void 0 : _1[0]) === null || _2 === void 0 ? void 0 : _2.id;
                        }
                        else {
                            errors.push("No location found for line ".concat(line.itemReadableId));
                            return [3 /*break*/, 21];
                        }
                    }
                    return [4 /*yield*/, (0, inventory_1.getDefaultStorageUnitForJob)(client, line.itemId, locationId, companyId)];
                case 13:
                    storageUnitId = _12.sent();
                    scrapPercentage = (_4 = (_3 = manufacturing.data) === null || _3 === void 0 ? void 0 : _3.scrapPercentage) !== null && _4 !== void 0 ? _4 : 0;
                    scrapQuantity = scrapPercentage > 0 ? Math.ceil(jobQuantity * scrapPercentage) : 0;
                    data = {
                        customerId: (_6 = (_5 = salesOrder.data) === null || _5 === void 0 ? void 0 : _5.customerId) !== null && _6 !== void 0 ? _6 : undefined,
                        deadlineType: "Hard Deadline",
                        dueDate: dueDate,
                        startDate: dueDate
                            ? (0, date_1.parseDate)(dueDate)
                                .subtract({ days: (_8 = (_7 = manufacturing.data) === null || _7 === void 0 ? void 0 : _7.leadTime) !== null && _8 !== void 0 ? _8 : 7 })
                                .toString()
                            : undefined,
                        itemId: line.itemId,
                        locationId: locationId,
                        modelUploadId: (_9 = line.modelUploadId) !== null && _9 !== void 0 ? _9 : undefined,
                        quantity: jobQuantity,
                        quoteId: quoteId !== null && quoteId !== void 0 ? quoteId : undefined,
                        quoteLineId: quoteId ? line.id : undefined,
                        salesOrderId: salesOrderId !== null && salesOrderId !== void 0 ? salesOrderId : undefined,
                        salesOrderLineId: line.id,
                        scrapQuantity: scrapQuantity,
                        storageUnitId: storageUnitId !== null && storageUnitId !== void 0 ? storageUnitId : undefined,
                        unitOfMeasureCode: (_10 = line.unitOfMeasureCode) !== null && _10 !== void 0 ? _10 : "EA"
                    };
                    return [4 /*yield*/, calculateJobPriority(client, {
                            dueDate: (_11 = data.dueDate) !== null && _11 !== void 0 ? _11 : null,
                            deadlineType: data.deadlineType,
                            companyId: companyId,
                            locationId: locationId
                        })];
                case 14:
                    priority = _12.sent();
                    return [4 /*yield*/, client
                            .from("job")
                            .insert(__assign(__assign({}, data), { jobId: nextSequence.data, priority: priority, companyId: companyId, createdBy: userId, updatedBy: userId }))
                            .select("id")
                            .single()];
                case 15:
                    createJob = _12.sent();
                    if (createJob.error) {
                        errors.push("Failed to create job for line ".concat(line.itemReadableId, ": ").concat(createJob.error.message));
                        return [3 /*break*/, 21];
                    }
                    if (!quoteId) return [3 /*break*/, 17];
                    return [4 /*yield*/, client.functions.invoke("get-method", {
                            body: {
                                type: "quoteLineToJob",
                                sourceId: "".concat(quoteId, ":").concat(line.id),
                                targetId: createJob.data.id,
                                companyId: companyId,
                                userId: userId
                            }
                        })];
                case 16:
                    upsertMethod = _12.sent();
                    if (upsertMethod.error) {
                        errors.push("Failed to create method for job ".concat(nextSequence.data, " (Line item ").concat(line.itemReadableId, "): ").concat(upsertMethod.error.message));
                        return [3 /*break*/, 21];
                    }
                    return [3 /*break*/, 19];
                case 17: return [4 /*yield*/, client.functions.invoke("get-method", {
                        body: {
                            type: "itemToJob",
                            sourceId: data.itemId,
                            targetId: createJob.data.id,
                            companyId: companyId,
                            userId: userId
                        }
                    })];
                case 18:
                    upsertMethod = _12.sent();
                    if (upsertMethod.error) {
                        errors.push("Failed to create method for job ".concat(nextSequence.data, " (Line item ").concat(line.itemReadableId, "): ").concat(upsertMethod.error.message));
                        return [3 /*break*/, 21];
                    }
                    _12.label = 19;
                case 19: return [4 /*yield*/, client.functions.invoke("recalculate", {
                        body: {
                            type: "jobRequirements",
                            id: createJob.data.id,
                            companyId: companyId,
                            userId: userId
                        }
                    })];
                case 20:
                    _12.sent();
                    jobsCreated++;
                    _12.label = 21;
                case 21:
                    _d = true;
                    return [3 /*break*/, 10];
                case 22: return [3 /*break*/, 29];
                case 23:
                    e_1_1 = _12.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 29];
                case 24:
                    _12.trys.push([24, , 27, 28]);
                    if (!(!_d && !_k && (_l = _e.return))) return [3 /*break*/, 26];
                    return [4 /*yield*/, _l.call(_e)];
                case 25:
                    _12.sent();
                    _12.label = 26;
                case 26: return [3 /*break*/, 28];
                case 27:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 28: return [7 /*endfinally*/];
                case 29:
                    _c = true;
                    return [3 /*break*/, 5];
                case 30: return [3 /*break*/, 37];
                case 31:
                    e_2_1 = _12.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 37];
                case 32:
                    _12.trys.push([32, , 35, 36]);
                    if (!(!_c && !_g && (_h = lines_1.return))) return [3 /*break*/, 34];
                    return [4 /*yield*/, _h.call(lines_1)];
                case 33:
                    _12.sent();
                    _12.label = 34;
                case 34: return [3 /*break*/, 36];
                case 35:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 36: return [7 /*endfinally*/];
                case 37:
                    if (errors.length > 0) {
                        console.error(errors);
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "Failed to create ".concat(errors.length, " job(s). ").concat(errors.join("; ")),
                                    details: errors.join("; "),
                                    code: "JOB_CREATION_ERROR"
                                }
                            }];
                    }
                    if (jobsCreated === 0) {
                        skippedLines = lines.map(function (l) { return l.itemReadableId; }).filter(Boolean);
                        skippedLinesStr = skippedLines.length > 0
                            ? " (Lines checked: ".concat(skippedLines.join(", "), ")")
                            : "";
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "No jobs were created",
                                    details: "No Make items found on sales order lines".concat(skippedLinesStr),
                                    code: "NO_JOBS_CREATED"
                                }
                            }];
                    }
                    return [2 /*return*/, salesOrder];
            }
        });
    });
}
/**
 * Calculate the priority for a job based on its dueDate and deadlineType.
 * Priority ordering: ASAP > Hard Deadline > Soft Deadline > No Deadline
 *
 * @param client - Supabase client
 * @param params - Job details
 * @returns The calculated priority number
 */
function calculateJobPriority(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        var jobId, dueDate, deadlineType, companyId, locationId, deadlineTypePriority, currentJobPriority, query, existingJobs, insertBeforeIndex, i, existingJobPriority, newPriority, firstPriority, lastPriority, beforePriority, afterPriority;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    jobId = params.jobId, dueDate = params.dueDate, deadlineType = params.deadlineType, companyId = params.companyId, locationId = params.locationId;
                    deadlineTypePriority = {
                        ASAP: 0,
                        "Hard Deadline": 1,
                        "Soft Deadline": 2,
                        "No Deadline": 3
                    };
                    currentJobPriority = deadlineTypePriority[deadlineType];
                    query = client
                        .from("job")
                        .select("id, priority, deadlineType")
                        .eq("companyId", companyId)
                        .eq("locationId", locationId)
                        .order("priority", { ascending: true });
                    if (dueDate) {
                        query = query.eq("dueDate", dueDate);
                    }
                    else {
                        query = query.is("dueDate", null);
                    }
                    // Exclude the current job if we're updating
                    if (jobId) {
                        query = query.neq("id", jobId);
                    }
                    return [4 /*yield*/, query];
                case 1:
                    existingJobs = (_e.sent()).data;
                    if (!existingJobs || existingJobs.length === 0) {
                        // No existing jobs with this due date, start at priority 0
                        return [2 /*return*/, 0];
                    }
                    insertBeforeIndex = existingJobs.length;
                    for (i = 0; i < existingJobs.length; i++) {
                        existingJobPriority = deadlineTypePriority[existingJobs[i].deadlineType];
                        // If the current job has higher priority (lower number) than this existing job,
                        // we should insert before this job
                        if (currentJobPriority < existingJobPriority) {
                            insertBeforeIndex = i;
                            break;
                        }
                    }
                    if (insertBeforeIndex === 0) {
                        firstPriority = (_a = existingJobs[0].priority) !== null && _a !== void 0 ? _a : 0;
                        newPriority = firstPriority > 0 ? firstPriority / 2 : -1;
                    }
                    else if (insertBeforeIndex === existingJobs.length) {
                        lastPriority = (_b = existingJobs[existingJobs.length - 1].priority) !== null && _b !== void 0 ? _b : 0;
                        newPriority = lastPriority + 1;
                    }
                    else {
                        beforePriority = (_c = existingJobs[insertBeforeIndex - 1].priority) !== null && _c !== void 0 ? _c : 0;
                        afterPriority = (_d = existingJobs[insertBeforeIndex].priority) !== null && _d !== void 0 ? _d : 0;
                        newPriority = (beforePriority + afterPriority) / 2;
                    }
                    return [2 /*return*/, newPriority];
            }
        });
    });
}
function deleteDemandForecasts(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        var itemId, locationId, companyId, futurePeriodIds, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    itemId = params.itemId, locationId = params.locationId, companyId = params.companyId, futurePeriodIds = params.futurePeriodIds;
                    return [4 /*yield*/, client
                            .from("demandForecast")
                            .delete()
                            .eq("itemId", itemId)
                            .eq("locationId", locationId)
                            .eq("companyId", companyId)
                            .in("periodId", futurePeriodIds)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, {
                            data: result.data,
                            error: result.error
                        }];
            }
        });
    });
}
function deleteDemandProjections(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        var itemId, locationId, companyId, futurePeriodIds, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    itemId = params.itemId, locationId = params.locationId, companyId = params.companyId, futurePeriodIds = params.futurePeriodIds;
                    return [4 /*yield*/, client
                            .from("demandProjection")
                            .delete()
                            .eq("itemId", itemId)
                            .eq("locationId", locationId)
                            .eq("companyId", companyId)
                            .in("periodId", futurePeriodIds)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, {
                            data: result.data,
                            error: result.error
                        }];
            }
        });
    });
}
function deleteJob(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("job").delete().eq("id", jobId)];
        });
    });
}
function deleteJobMaterial(client, jobMaterialId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("jobMaterial").delete().eq("id", jobMaterialId)];
        });
    });
}
function deleteJobOperation(client, jobOperationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("jobOperation").delete().eq("id", jobOperationId)];
        });
    });
}
function deleteJobOperationStep(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("jobOperationStep").delete().eq("id", id)];
        });
    });
}
function deleteJobOperationParameter(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("jobOperationParameter").delete().eq("id", id)];
        });
    });
}
function deleteJobOperationTool(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("jobOperationTool").delete().eq("id", id)];
        });
    });
}
function deleteProcedure(client, procedureId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("procedure").delete().eq("id", procedureId)];
        });
    });
}
function deleteProcedureStep(client, procedureStepId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("procedureStep")
                    .delete()
                    .eq("id", procedureStepId)
                    .eq("companyId", companyId)];
        });
    });
}
function deleteProcedureParameter(client, procedureParameterId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("procedureParameter")
                    .delete()
                    .eq("id", procedureParameterId)
                    .eq("companyId", companyId)];
        });
    });
}
function deleteProductionEvent(client, productionEventId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("productionEvent").delete().eq("id", productionEventId)];
        });
    });
}
function deleteProductionQuantity(client, productionQuantityId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var invalidateProductionQuantity;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./productionQuantityReport.service"); })];
                case 1:
                    invalidateProductionQuantity = (_a.sent()).invalidateProductionQuantity;
                    return [2 /*return*/, invalidateProductionQuantity(client, {
                            productionQuantityId: productionQuantityId,
                            companyId: args.companyId,
                            userId: args.userId
                        })];
            }
        });
    });
}
function deleteJobOperationSupplierQuantity(client, supplierQuantityId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var invalidateJobOperationSupplierQuantity;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./jobOperationSupplierQuantityReport.service"); })];
                case 1:
                    invalidateJobOperationSupplierQuantity = (_a.sent()).invalidateJobOperationSupplierQuantity;
                    return [2 /*return*/, invalidateJobOperationSupplierQuantity(client, {
                            supplierQuantityId: supplierQuantityId,
                            companyId: args.companyId,
                            userId: args.userId
                        })];
            }
        });
    });
}
function getActiveJobOperationByJobId(client, jobId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var jobMakeMethod, jobOperations;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobMakeMethod")
                        .select("id")
                        .eq("jobId", jobId)
                        .is("parentMaterialId", null)
                        .eq("companyId", companyId)
                        .maybeSingle()];
                case 1:
                    jobMakeMethod = _b.sent();
                    if (jobMakeMethod.error || !jobMakeMethod.data) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("id, setupTime, laborTime, machineTime")
                            .eq("jobMakeMethodId", (_a = jobMakeMethod.data) === null || _a === void 0 ? void 0 : _a.id)
                            .eq("companyId", companyId)
                            .in("status", ["Todo", "Ready", "In Progress", "Waiting", "Paused"])
                            .order("order", { ascending: true })
                            .limit(1)];
                case 2:
                    jobOperations = _b.sent();
                    if (jobOperations.error || !jobOperations.data) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, jobOperations.data[0]];
            }
        });
    });
}
function getActiveJobOperationsByLocation(client_1, locationId_1) {
    return __awaiter(this, arguments, void 0, function (client, locationId, workCenterIds) {
        if (workCenterIds === void 0) { workCenterIds = []; }
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_active_job_operations_by_location", {
                    location_id: locationId,
                    work_center_ids: workCenterIds
                })];
        });
    });
}
function getJobsByDateRange(client, locationId, startDate, endDate) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_jobs_by_date_range", {
                    location_id: locationId,
                    start_date: startDate,
                    end_date: endDate
                })];
        });
    });
}
function getUnscheduledJobs(client, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_unscheduled_jobs", {
                    location_id: locationId
                })];
        });
    });
}
function getActiveProductionEvents(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionEvent")
                    .select("*, ...jobOperation(description, ...job(jobId:id, jobReadableId:jobId, customerId, dueDate, deadlineType, salesOrderLineId, ...salesOrderLine(...salesOrder(salesOrderId:id, salesOrderReadableId:salesOrderId))))")
                    .eq("companyId", companyId)
                    .is("endTime", null)];
        });
    });
}
function deleteScrapReason(client, scrapReasonId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("scrapReason").delete().eq("id", scrapReasonId)];
        });
    });
}
function deleteFailureMode(client, failureModeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceFailureMode").delete().eq("id", failureModeId)];
        });
    });
}
function deleteMaintenanceDispatch(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceDispatch").delete().eq("id", dispatchId)];
        });
    });
}
function deleteMaintenanceDispatchComment(client, commentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceDispatchComment").delete().eq("id", commentId)];
        });
    });
}
function deleteMaintenanceDispatchEvent(client, eventId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceDispatchEvent").delete().eq("id", eventId)];
        });
    });
}
function deleteMaintenanceDispatchItem(client, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceDispatchItem").delete().eq("id", itemId)];
        });
    });
}
function deleteMaintenanceDispatchWorkCenter(client, workCenterId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchWorkCenter")
                    .delete()
                    .eq("id", workCenterId)];
        });
    });
}
function deleteMaintenanceSchedule(client, scheduleId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceSchedule").delete().eq("id", scheduleId)];
        });
    });
}
function deleteMaintenanceScheduleItem(client, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("maintenanceScheduleItem").delete().eq("id", itemId)];
        });
    });
}
function getDemandForecasts(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("demandForecast")
                    .select("*")
                    .eq("itemId", params.itemId)
                    .eq("locationId", params.locationId)
                    .eq("companyId", params.companyId)
                    .in("periodId", params.periodIds)];
        });
    });
}
function getDemandProjections(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("demandProjection")
                    .select("*")
                    .eq("itemId", params.itemId)
                    .eq("locationId", params.locationId)
                    .eq("companyId", params.companyId)
                    .in("periodId", params.periodIds)];
        });
    });
}
function getJobDocuments(client, companyId, job) {
    return __awaiter(this, void 0, void 0, function () {
        var promises, opportunityLine, results, jobFiles, opportunityLineFiles, partsFiles;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    promises = [client.storage.from("private").list("".concat(companyId, "/job/").concat(job.id))];
                    // Add opportunity line files if available
                    if (job.salesOrderLineId || job.quoteLineId) {
                        opportunityLine = job.salesOrderLineId || job.quoteLineId;
                        promises.push(client.storage
                            .from("private")
                            .list("".concat(companyId, "/opportunity-line/").concat(opportunityLine)));
                    }
                    // Add parts files if itemId is available
                    if (job.itemId) {
                        promises.push(client.storage.from("private").list("".concat(companyId, "/parts/").concat(job.itemId)));
                    }
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    results = _d.sent();
                    jobFiles = results[0], opportunityLineFiles = results[1], partsFiles = results[2];
                    // Combine and return all sets of files with their respective buckets
                    return [2 /*return*/, __spreadArray(__spreadArray(__spreadArray([], (((_a = jobFiles.data) === null || _a === void 0 ? void 0 : _a.map(function (f) { return (__assign(__assign({}, f), { bucket: "job" })); })) || []), true), (((_b = opportunityLineFiles === null || opportunityLineFiles === void 0 ? void 0 : opportunityLineFiles.data) === null || _b === void 0 ? void 0 : _b.map(function (f) { return (__assign(__assign({}, f), { bucket: "opportunity-line" })); })) || []), true), (((_c = partsFiles === null || partsFiles === void 0 ? void 0 : partsFiles.data) === null || _c === void 0 ? void 0 : _c.map(function (f) { return (__assign(__assign({}, f), { bucket: "parts" })); })) || []), true)];
            }
        });
    });
}
var getPartDocuments = function (client, companyId) {
    var items = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        items[_i - 2] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var getFile, elems, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    getFile = function (id) { return __awaiter(void 0, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, client.storage
                                        .from("private")
                                        .list("".concat(companyId, "/parts/").concat(id))];
                                case 1:
                                    res = _a.sent();
                                    if (res.error || !res.data)
                                        return [2 /*return*/, null];
                                    return [2 /*return*/, res.data.map(function (f) { return (__assign(__assign({}, f), { bucket: "parts", itemId: id })); })];
                            }
                        });
                    }); };
                    elems = items.map(function (el) { return getFile(el.itemId); });
                    return [4 /*yield*/, Promise.all(elems)];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results.filter(function (f) { return f !== null; }).flat()];
            }
        });
    });
};
exports.getPartDocuments = getPartDocuments;
function getJobDocumentsWithItemId(client, companyId, job, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        var itemFiles, opportunityLine, _a, opportunityLineFiles, jobFiles, jobFiles;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, exports.getPartDocuments)(client, companyId, { itemId: itemId })];
                case 1:
                    itemFiles = _e.sent();
                    if (!(job.salesOrderLineId || job.quoteLineId)) return [3 /*break*/, 3];
                    opportunityLine = job.salesOrderLineId || job.quoteLineId;
                    return [4 /*yield*/, Promise.all([
                            client.storage
                                .from("private")
                                .list("".concat(companyId, "/opportunity-line/").concat(opportunityLine)),
                            client.storage.from("private").list("".concat(companyId, "/job/").concat(job.id))
                        ])];
                case 2:
                    _a = _e.sent(), opportunityLineFiles = _a[0], jobFiles = _a[1];
                    // Combine and return both sets of files
                    return [2 /*return*/, __spreadArray(__spreadArray(__spreadArray([], (((_b = opportunityLineFiles.data) === null || _b === void 0 ? void 0 : _b.map(function (f) { return (__assign(__assign({}, f), { bucket: "opportunity-line" })); })) || []), true), (((_c = jobFiles.data) === null || _c === void 0 ? void 0 : _c.map(function (f) { return (__assign(__assign({}, f), { bucket: "job" })); })) || []), true), itemFiles, true)];
                case 3: return [4 /*yield*/, Promise.all([
                        client.storage.from("private").list("".concat(companyId, "/job/").concat(job.id))
                    ])];
                case 4:
                    jobFiles = (_e.sent())[0];
                    return [2 /*return*/, __spreadArray(__spreadArray([], (((_d = jobFiles.data) === null || _d === void 0 ? void 0 : _d.map(function (f) { return (__assign(__assign({}, f), { bucket: "job" })); })) || []), true), itemFiles, true)];
            }
        });
    });
}
function getJob(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // limit(1) guards against the "jobs" view ever returning more than one row
            // for a job (e.g. a job with duplicate root make methods); .single() still
            // errors on zero rows so a missing/inaccessible job is handled as not-found.
            return [2 /*return*/, client.from("jobs").select("*").eq("id", id).limit(1).single()];
        });
    });
}
function getJobConfigurationHistory(client, jobId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobConfigurationHistory")
                    .select("id, quantity, configuration, createdAt, createdBy,\n       createdByUser:user!jobConfigurationHistory_createdBy_fkey(id, fullName, avatarUrl)")
                    .eq("jobId", jobId)
                    .eq("companyId", companyId)
                    .order("createdAt", { ascending: false })];
        });
    });
}
function getJobProductionQuantitySummary(client, jobId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var operations, operationList, quantities, rowsByOperation, _i, _a, row, existing, summary;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobOperation")
                        .select("id, description, order")
                        .eq("jobId", jobId)
                        .eq("companyId", companyId)];
                case 1:
                    operations = _d.sent();
                    if (operations.error) {
                        return [2 /*return*/, { data: null, error: operations.error }];
                    }
                    operationList = (_b = operations.data) !== null && _b !== void 0 ? _b : [];
                    if (operationList.length === 0) {
                        return [2 /*return*/, { data: [], error: null }];
                    }
                    return [4 /*yield*/, client
                            .from("productionQuantity")
                            .select("jobOperationId, quantity, configuration")
                            .in("jobOperationId", operationList.map(function (operation) { return operation.id; }))
                            .eq("companyId", companyId)
                            .eq("type", "Production")
                            .is("invalidatedAt", null)];
                case 2:
                    quantities = _d.sent();
                    if (quantities.error) {
                        return [2 /*return*/, { data: null, error: quantities.error }];
                    }
                    rowsByOperation = new Map();
                    for (_i = 0, _a = (_c = quantities.data) !== null && _c !== void 0 ? _c : []; _i < _a.length; _i++) {
                        row = _a[_i];
                        if (!row.jobOperationId)
                            continue;
                        existing = rowsByOperation.get(row.jobOperationId);
                        if (existing) {
                            existing.push({
                                quantity: row.quantity,
                                configuration: row.configuration
                            });
                        }
                        else {
                            rowsByOperation.set(row.jobOperationId, [
                                { quantity: row.quantity, configuration: row.configuration }
                            ]);
                        }
                    }
                    summary = operationList
                        .filter(function (operation) { return rowsByOperation.has(operation.id); })
                        .sort(function (a, b) { var _a, _b; return ((_a = a.order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.order) !== null && _b !== void 0 ? _b : 0); })
                        .map(function (operation) {
                        var _a, _b;
                        return ({
                            operationId: operation.id,
                            label: (_a = operation.description) !== null && _a !== void 0 ? _a : "",
                            configurations: ((_b = rowsByOperation.get(operation.id)) !== null && _b !== void 0 ? _b : []).map(function (row) { return row.configuration; })
                        });
                    });
                    return [2 /*return*/, { data: summary, error: null }];
            }
        });
    });
}
function getJobByOperationId(client, operationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperation")
                    .select("...job(id, companyId, customerId)")
                    .eq("id", operationId)
                    .single()];
        });
    });
}
function getJobPurchaseOrderLines(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("purchaseOrderLine")
                    .select("id, itemId, description, purchaseQuantity, quantityReceived, quantityShipped, supplierUnitPrice, unitPrice, taxAmount, shippingCost, purchaseOrder(id, purchaseOrderId, status, supplierId, supplierInteractionId, currencyCode, exchangeRate), jobOperation(id, description, operationQuantity, operationMinimumCost, operationUnitCost)")
                    .eq("jobId", jobId)];
        });
    });
}
function getJobs(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("jobs")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("jobId", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "jobId", ascending: false }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getJobsBySalesOrderLine(client, salesOrderLineId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobs")
                    .select("*")
                    .eq("salesOrderLineId", salesOrderLineId)
                    .order("createdAt", { ascending: true })];
        });
    });
}
function getJobsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "job", "id, jobId", function (query) {
                    return query.eq("companyId", companyId).order("jobId");
                })];
        });
    });
}
function getJobMakeMethodById(client, jobMakeMethodId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobMakeMethod")
                    .select("*, ...item(itemType:type, methodRevision:revision)")
                    .eq("id", jobMakeMethodId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getRootMakeMethod(client, jobId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobMakeMethod")
                    .select("*, ...item(itemType:type, methodRevision:revision)")
                    .eq("jobId", jobId)
                    .is("parentMaterialId", null)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getJobMaterialsWithQuantityOnHand(client, jobId, companyId, locationId, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_job_quantity_on_hand", {
                    job_id: jobId,
                    company_id: companyId,
                    location_id: locationId
                }, {
                    count: "exact"
                })];
        });
    });
}
function getJobMethodTree(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        var items, tree;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getJobMethodTreeArray(client, jobId)];
                case 1:
                    items = _a.sent();
                    if (items.error)
                        return [2 /*return*/, items];
                    tree = getJobMethodTreeArrayToTree(items.data);
                    return [2 /*return*/, {
                            data: tree,
                            error: null
                        }];
            }
        });
    });
}
function getJobMethodTreeArray(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_job_method", {
                    jid: jobId
                })];
        });
    });
}
function getJobMethodTreeArrayToTree(items) {
    // function traverseAndRenameIds(node: JobMethodTreeItem) {
    //   const clone = structuredClone(node);
    //   clone.id = `node-${Math.random().toString(16).slice(2)}`;
    //   clone.children = clone.children.map((n) => traverseAndRenameIds(n));
    //   return clone;
    // }
    var rootItems = [];
    var lookup = {};
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var itemId = item.methodMaterialId;
        var parentId = item.parentMaterialId;
        if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
            // @ts-expect-error
            lookup[itemId] = { id: itemId, children: [] };
        }
        // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
        lookup[itemId]["data"] = item;
        var treeItem = lookup[itemId];
        if (parentId === null || parentId === undefined) {
            rootItems.push(treeItem);
        }
        else {
            if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
                // @ts-expect-error
                lookup[parentId] = { id: parentId, children: [] };
            }
            // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
            lookup[parentId]["children"].push(treeItem);
        }
    }
    return rootItems;
    // return rootItems.map((item) => traverseAndRenameIds(item));
}
function getJobMaterial(client, materialId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobMaterialWithMakeMethodId")
                    .select("*")
                    .eq("id", materialId)
                    .single()];
        });
    });
}
function getJobMaterialsByMethodId(client, jobMakeMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobMaterial")
                    .select("*, item(replenishmentSystem)")
                    .eq("jobMakeMethodId", jobMakeMethodId)
                    .order("order", { ascending: true })];
        });
    });
}
function getJobOperation(client, jobOperationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperation")
                    .select("*")
                    .eq("id", jobOperationId)
                    .single()];
        });
    });
}
/**
 * Returns the routing context loaders need to seed the unified actor field:
 * the operation's `processId` (for SupplierProcess options) and `operationType`
 * (for actor defaulting). Returns nulls for unknown / empty operation ids.
 */
function getJobOperationActorContext(client, jobOperationId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var operation, supplierId, supplierProcess;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!jobOperationId) {
                        return [2 /*return*/, {
                                processId: null,
                                operationType: null,
                                operationSupplierProcessId: null,
                                supplierId: null,
                                assignee: null
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("processId, operationType, operationSupplierProcessId, assignee")
                            .eq("id", jobOperationId)
                            .eq("companyId", companyId)
                            .single()];
                case 1:
                    operation = (_f.sent()).data;
                    supplierId = null;
                    if (!(operation === null || operation === void 0 ? void 0 : operation.operationSupplierProcessId)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("supplierProcess")
                            .select("supplierId")
                            .eq("id", operation.operationSupplierProcessId)
                            .maybeSingle()];
                case 2:
                    supplierProcess = (_f.sent()).data;
                    supplierId = (_a = supplierProcess === null || supplierProcess === void 0 ? void 0 : supplierProcess.supplierId) !== null && _a !== void 0 ? _a : null;
                    _f.label = 3;
                case 3: return [2 /*return*/, {
                        processId: (_b = operation === null || operation === void 0 ? void 0 : operation.processId) !== null && _b !== void 0 ? _b : null,
                        operationType: (_c = operation === null || operation === void 0 ? void 0 : operation.operationType) !== null && _c !== void 0 ? _c : null,
                        operationSupplierProcessId: (_d = operation === null || operation === void 0 ? void 0 : operation.operationSupplierProcessId) !== null && _d !== void 0 ? _d : null,
                        supplierId: supplierId,
                        assignee: (_e = operation === null || operation === void 0 ? void 0 : operation.assignee) !== null && _e !== void 0 ? _e : null
                    }];
            }
        });
    });
}
function validateActorMatchesOperationSupplierRouting(client, jobOperationId, companyId, actor) {
    return __awaiter(this, void 0, void 0, function () {
        var context;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, getJobOperationActorContext(client, jobOperationId, companyId)];
                case 1:
                    context = _c.sent();
                    if (!(0, operationType_1.locksActorToOperationSupplier)(context.operationType, context.operationSupplierProcessId)) {
                        return [2 /*return*/, { error: null }];
                    }
                    if (actor.actorKind !== "supplier" ||
                        ((_a = actor.supplierProcessId) === null || _a === void 0 ? void 0 : _a.trim()) !==
                            ((_b = context.operationSupplierProcessId) === null || _b === void 0 ? void 0 : _b.trim())) {
                        return [2 /*return*/, {
                                error: {
                                    message: "Supplier must match the supplier assigned on the operation details"
                                }
                            }];
                    }
                    return [2 /*return*/, { error: null }];
            }
        });
    });
}
function assertSupplierQuantityAllowedForOperation(client, jobOperationId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var operationType;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getJobOperationActorContext(client, jobOperationId, companyId)];
                case 1:
                    operationType = (_a.sent()).operationType;
                    if (!(0, operationType_1.allowsSupplierQuantityActor)(operationType)) {
                        return [2 /*return*/, {
                                error: {
                                    message: "Supplier quantities cannot be recorded for Inside operations"
                                }
                            }];
                    }
                    return [2 /*return*/, { error: null }];
            }
        });
    });
}
function getJobOperations(client, jobId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("jobOperation")
                .select("*, jobMakeMethod(parentMaterialId, item(readableIdWithRevision))", {
                count: "exact"
            })
                .eq("jobId", jobId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("description", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "description", ascending: true },
                    { column: "order", ascending: true },
                    { column: "createdAt", ascending: false }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getJobOperationDependencies(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperationDependency")
                    .select("operationId, dependsOnId")
                    .eq("jobId", jobId)];
        });
    });
}
function getJobOperationsAssignedToEmployee(client, employeeId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperation")
                    .select("id, description, workCenterId, ...job(jobId:id, jobReadableId:jobId)")
                    .eq("assignee", employeeId)
                    .eq("companyId", companyId)];
        });
    });
}
function getJobOperationAttachments(client, jobOperationIds) {
    return __awaiter(this, void 0, void 0, function () {
        var operationAttributes, attachmentsByOperation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (jobOperationIds.length === 0)
                        return [2 /*return*/, {}];
                    return [4 /*yield*/, client
                            .from("jobOperationStep")
                            .select("*, jobOperationStepRecord(*)")
                            .in("operationId", jobOperationIds)];
                case 1:
                    operationAttributes = (_a.sent()).data;
                    if (!operationAttributes)
                        return [2 /*return*/, {}];
                    attachmentsByOperation = {};
                    operationAttributes.forEach(function (attr) {
                        if (attr.jobOperationStepRecord &&
                            Array.isArray(attr.jobOperationStepRecord)) {
                            attr.jobOperationStepRecord.forEach(function (record) {
                                if (attr.type === "File" && record.value) {
                                    if (!attachmentsByOperation[attr.operationId]) {
                                        attachmentsByOperation[attr.operationId] = [];
                                    }
                                    attachmentsByOperation[attr.operationId].push(record.value);
                                }
                            });
                        }
                    });
                    return [2 /*return*/, attachmentsByOperation];
            }
        });
    });
}
function getJobOperationsList(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperation")
                    .select("id, description, order")
                    .eq("jobId", jobId)
                    .order("order", { ascending: true })];
        });
    });
}
function getJobOperationsByMethodId(client, jobMakeMethodId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperation")
                    .select("*, jobOperationTool(*), jobOperationParameter(*), jobOperationStep(*, jobOperationStepRecord(*))")
                    .eq("jobMakeMethodId", jobMakeMethodId)
                    .order("order", { ascending: true })];
        });
    });
}
function getJobOperationStepRecords(client, jobId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client.rpc("get_job_operation_step_records", {
                p_job_id: jobId
            });
            if (args.search) {
                query = query.or("name.ilike.%".concat(args.search, "%,operationDescription.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "createdAt", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getOutsideOperationsByJobId(client, jobId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperation")
                    .select("id, description")
                    .eq("jobId", jobId)
                    .eq("companyId", companyId)
                    .eq("operationType", "Outside")];
        });
    });
}
function getProcedure(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("procedure")
                    .select("*, procedureStep(*), procedureParameter(*)")
                    .eq("id", id)
                    .single()];
        });
    });
}
function getProcedureSteps(client, procedureId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("procedureStep")
                    .select("*")
                    .eq("procedureId", procedureId)];
        });
    });
}
function getProcedureParameters(client, procedureId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("procedureParameter")
                    .select("*")
                    .eq("procedureId", procedureId)];
        });
    });
}
function getProcedureVersions(client, procedure, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("procedure")
                    .select("*")
                    .eq("name", procedure.name)
                    .eq("companyId", companyId)
                    .neq("version", procedure.version)
                    .order("version", { ascending: false })];
        });
    });
}
function getProcedures(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("procedures")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getProceduresList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "procedure", "id, name, version, processId, status", function (query) {
                    return query
                        .eq("companyId", companyId)
                        .order("name", { ascending: true })
                        .order("version", { ascending: false });
                })];
        });
    });
}
function getProductionEvent(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionEvent")
                    .select("*, jobOperation(description)")
                    .eq("id", id)
                    .single()];
        });
    });
}
function getProductionEvents(client, jobOperationIds, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("productionEvent")
                .select("*, jobOperation(description, jobMakeMethod(parentMaterialId, item(readableIdWithRevision)))", {
                count: "exact"
            })
                .in("jobOperationId", jobOperationIds)
                .order("startTime", { ascending: true });
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("jobOperation.description.ilike.%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "createdAt", ascending: false }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getProductionEventsPage(client_1, jobOperationId_1, companyId_1) {
    return __awaiter(this, arguments, void 0, function (client, jobOperationId, companyId, sortDescending, page) {
        var pageSize, offset, query, _a, data, error, count;
        if (sortDescending === void 0) { sortDescending = false; }
        if (page === void 0) { page = 1; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pageSize = 20;
                    offset = (page - 1) * pageSize;
                    query = client
                        .from("productionEvent")
                        .select("*", { count: "exact" })
                        .eq("jobOperationId", jobOperationId)
                        .eq("companyId", companyId)
                        .order("startTime", { ascending: !sortDescending })
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
function getProductionQuantitiesByOperation(client, jobOperationId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionQuantity")
                    .select("id, configuration, type, quantity")
                    .eq("jobOperationId", jobOperationId)
                    .eq("companyId", companyId)
                    .is("invalidatedAt", null)
                    .order("createdAt", { ascending: false })];
        });
    });
}
function getProductionQuantitiesPage(client_1, jobOperationId_1, companyId_1) {
    return __awaiter(this, arguments, void 0, function (client, jobOperationId, companyId, page) {
        var pageSize, offset, query, _a, data, error, count;
        if (page === void 0) { page = 1; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pageSize = 20;
                    offset = (page - 1) * pageSize;
                    query = client
                        .from("productionQuantity")
                        .select("*, scrapReason(name)", { count: "exact" })
                        .eq("jobOperationId", jobOperationId)
                        .eq("companyId", companyId)
                        .is("invalidatedAt", null)
                        .order("createdAt", { ascending: false })
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
function getProductionEventsByOperations(client, jobOperationIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionEvent")
                    .select("*, jobOperation(description, jobMakeMethod(parentMaterialId, item(readableIdWithRevision)))")
                    .in("jobOperationId", jobOperationIds)
                    .order("startTime", { ascending: true })];
        });
    });
}
function getProductionPlanning(client, locationId, companyId, periods, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client.rpc("get_production_planning", {
                location_id: locationId,
                company_id: companyId,
                periods: periods
            }, {
                count: "exact"
            });
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("name.ilike.%".concat(args.search, "%,readableIdWithRevision.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "quantityToOrder", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getProductionProjections(client, locationId, periods, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client.rpc("get_production_projections", {
                location_id: locationId,
                company_id: companyId,
                periods: periods
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
function getProductionQuantity(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionQuantity")
                    .select("*, jobOperation(description)")
                    .eq("id", id)
                    .single()];
        });
    });
}
function getProductionQuantities(client, jobOperationIds, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (jobOperationIds.length === 0) {
                        return [2 /*return*/, { data: [], count: 0, error: null }];
                    }
                    query = client
                        .from("productionQuantity")
                        .select("*, productionQuantityReport:reportId(id, createdAt), jobOperation(description, job(item(id, readableIdWithRevision)), jobMakeMethod(parentMaterialId, item(id, readableIdWithRevision)))", {
                        count: "exact"
                    })
                        .in("jobOperationId", jobOperationIds)
                        .is("invalidatedAt", null);
                    if (args === null || args === void 0 ? void 0 : args.search) {
                        query = query.or("jobOperation.description.ilike.%".concat(args.search, "%"));
                    }
                    if (args) {
                        query = (0, query_1.setGenericQueryFilters)(query, args, [
                            { column: "createdAt", ascending: false }
                        ]);
                    }
                    return [4 /*yield*/, query];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getProductionDataByOperations(client, jobOperationIds) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, quantities, events, notes;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("productionQuantity")
                            .select("*, productionQuantityReport:reportId(id, createdAt), jobOperation(description, job(item(id, readableIdWithRevision)), jobMakeMethod(parentMaterialId, item(id, readableIdWithRevision)))")
                            .in("jobOperationId", jobOperationIds)
                            .is("invalidatedAt", null),
                        client
                            .from("productionEvent")
                            .select("*, jobOperation(description, jobMakeMethod(parentMaterialId, item(readableIdWithRevision)))")
                            .in("jobOperationId", jobOperationIds),
                        client
                            .from("jobOperationNote")
                            .select("*")
                            .in("jobOperationId", jobOperationIds)
                    ])];
                case 1:
                    _a = _e.sent(), quantities = _a[0], events = _a[1], notes = _a[2];
                    return [2 /*return*/, {
                            quantities: (_b = quantities.data) !== null && _b !== void 0 ? _b : [],
                            events: (_c = events.data) !== null && _c !== void 0 ? _c : [],
                            notes: (_d = notes.data) !== null && _d !== void 0 ? _d : []
                        }];
            }
        });
    });
}
function getScrapReasonsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("scrapReason")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getScrapReason(client, scrapReasonId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("scrapReason")
                    .select("*")
                    .eq("id", scrapReasonId)
                    .single()];
        });
    });
}
function getScrapReasons(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("scrapReason")
                .select("id, name, customFields", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getFailureMode(client, failureModeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceFailureMode")
                    .select("*")
                    .eq("id", failureModeId)
                    .single()];
        });
    });
}
function getFailureModes(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("maintenanceFailureMode")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getFailureModesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceFailureMode")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getMaintenanceDispatch(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatch")
                    .select("*,\n      assignee:user!maintenanceDispatch_assignee_fkey(id, fullName, avatarUrl),\n      suspectedFailureMode:maintenanceFailureMode!maintenanceDispatch_suspectedFailureModeId_fkey(id, name),\n      actualFailureMode:maintenanceFailureMode!maintenanceDispatch_actualFailureModeId_fkey(id, name),\n      schedule:maintenanceSchedule(id, name)")
                    .eq("id", dispatchId)
                    .single()];
        });
    });
}
function getMaintenanceDispatches(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("maintenanceDispatch")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("maintenanceDispatchId", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "createdAt", ascending: false }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getMaintenanceDispatchComments(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchComment")
                    .select("id, comment, createdAt,\n       createdBy:user!maintenanceDispatchComment_createdBy_fkey(id, fullName, avatarUrl)")
                    .eq("maintenanceDispatchId", dispatchId)
                    .order("createdAt", { ascending: false })];
        });
    });
}
function getMaintenanceDispatchEvents(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchEvent")
                    .select("id, startTime, endTime, duration, notes,\n       employee:user!maintenanceDispatchEvent_employeeId_fkey(id, fullName, avatarUrl),\n       workCenter:workCenter!maintenanceDispatchEvent_workCenterId_fkey(id, name)")
                    .eq("maintenanceDispatchId", dispatchId)
                    .order("startTime", { ascending: false })];
        });
    });
}
function getMaintenanceDispatchItems(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchItem")
                    .select("id, itemId, quantity, unitOfMeasureCode, unitCost, totalCost,\n       item:item!maintenanceDispatchItem_itemId_fkey(id, name)")
                    .eq("maintenanceDispatchId", dispatchId)];
        });
    });
}
function getMaintenanceDispatchWorkCenters(client, dispatchId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceDispatchWorkCenter")
                    .select("id, workCenterId,\n       workCenter:workCenter!maintenanceDispatchWorkCenter_workCenterId_fkey(id, name)")
                    .eq("maintenanceDispatchId", dispatchId)];
        });
    });
}
function getMaintenanceSchedule(client, scheduleId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceSchedule")
                    .select("*,\n       workCenter:workCenter!maintenanceSchedule_workCenterId_fkey(id, name)")
                    .eq("id", scheduleId)
                    .single()];
        });
    });
}
function getMaintenanceSchedules(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("maintenanceSchedules")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if ((args === null || args === void 0 ? void 0 : args.active) !== undefined) {
                query = query.eq("active", args.active);
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getMaintenanceScheduleItems(client, scheduleId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("maintenanceScheduleItem")
                    .select("id, quantity, unitOfMeasureCode,\n       item:item!maintenanceScheduleItem_itemId_fkey(id, name)")
                    .eq("maintenanceScheduleId", scheduleId)];
        });
    });
}
function getTrackedEntityByJobId(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        var jobMakeMethod, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobMakeMethod")
                        .select("*")
                        .eq("jobId", jobId)
                        .is("parentMaterialId", null)
                        .single()];
                case 1:
                    jobMakeMethod = _c.sent();
                    if (jobMakeMethod.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: jobMakeMethod.error
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("*")
                            .eq("attributes ->> Job Make Method", jobMakeMethod.data.id)
                            .eq("companyId", jobMakeMethod.data.companyId)
                            .is("attributes ->> Split Entity ID", null)
                            .limit(1)];
                case 2:
                    result = _c.sent();
                    return [2 /*return*/, {
                            data: (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null,
                            error: result.error
                        }];
            }
        });
    });
}
function getTrackedEntitiesByJobMakeMethodIds(client, companyId, jobMakeMethodIds) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (jobMakeMethodIds.length === 0)
                        return [2 /*return*/, {}];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("readableId, attributes")
                            .in("attributes->>Job Make Method", jobMakeMethodIds)
                            .eq("companyId", companyId)];
                case 1:
                    data = (_a.sent()).data;
                    if (!data)
                        return [2 /*return*/, {}];
                    return [2 /*return*/, data.reduce(function (acc, curr) {
                            if (curr.attributes !== null &&
                                typeof curr.attributes === "object" &&
                                "Job Make Method" in curr.attributes &&
                                curr.readableId) {
                                acc[curr.attributes["Job Make Method"]] = curr.readableId;
                            }
                            return acc;
                        }, {})];
            }
        });
    });
}
function getItemIdsWithConfigurationParameters(client, companyId, itemIds) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (itemIds.length === 0)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, client
                            .from("configurationParameter")
                            .select("itemId")
                            .in("itemId", itemIds)
                            .eq("companyId", companyId)];
                case 1:
                    data = (_a.sent()).data;
                    if (!data)
                        return [2 /*return*/, []];
                    return [2 /*return*/, __spreadArray([], new Set(data.map(function (row) { return row.itemId; })), true)];
            }
        });
    });
}
/** Root routing only: first operation by `order` where status is not Done/Canceled. */
function getCurrentProcessByJobIds(client, jobs) {
    return __awaiter(this, void 0, void 0, function () {
        var jobsForQuery, jobIds, ops, metaByJobId, opsByJob, _i, _a, op, list, result, _loop_1, _b, jobsForQuery_1, job;
        var _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    jobsForQuery = jobs.filter(function (job) {
                        return Boolean(job.id);
                    });
                    if (jobsForQuery.length === 0)
                        return [2 /*return*/, {}];
                    jobIds = jobsForQuery.map(function (job) { return job.id; });
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("id, jobId, description, order, status, quantityComplete, quantityScrapped, quantityReworked, jobMakeMethodId")
                            .in("jobId", jobIds)];
                case 1:
                    ops = (_h.sent()).data;
                    metaByJobId = new Map(jobsForQuery.map(function (job) { var _a; return [job.id, (_a = job.jobMakeMethodId) !== null && _a !== void 0 ? _a : null]; }));
                    opsByJob = new Map();
                    for (_i = 0, _a = ops !== null && ops !== void 0 ? ops : []; _i < _a.length; _i++) {
                        op = _a[_i];
                        list = (_c = opsByJob.get(op.jobId)) !== null && _c !== void 0 ? _c : [];
                        list.push(op);
                        opsByJob.set(op.jobId, list);
                    }
                    result = {};
                    _loop_1 = function (job) {
                        var rootMakeMethodId = metaByJobId.get(job.id);
                        var list = (_d = opsByJob.get(job.id)) !== null && _d !== void 0 ? _d : [];
                        if (rootMakeMethodId) {
                            list = list.filter(function (op) { return op.jobMakeMethodId === rootMakeMethodId; });
                        }
                        list.sort(function (a, b) { var _a, _b; return ((_a = a.order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.order) !== null && _b !== void 0 ? _b : 0); });
                        var current = list.find(function (op) { return op.status !== "Done" && op.status !== "Canceled"; });
                        if (!current) {
                            result[job.id] = null;
                            return "continue";
                        }
                        result[job.id] = {
                            operationId: current.id,
                            description: current.description,
                            reportedTotal: ((_e = current.quantityComplete) !== null && _e !== void 0 ? _e : 0) +
                                ((_f = current.quantityScrapped) !== null && _f !== void 0 ? _f : 0) +
                                ((_g = current.quantityReworked) !== null && _g !== void 0 ? _g : 0)
                        };
                    };
                    for (_b = 0, jobsForQuery_1 = jobsForQuery; _b < jobsForQuery_1.length; _b++) {
                        job = jobsForQuery_1[_b];
                        _loop_1(job);
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function getTrackedEntitiesByJobId(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        var jobMakeMethod;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobMakeMethod")
                        .select("*")
                        .eq("jobId", jobId)
                        .is("parentMaterialId", null)
                        .single()];
                case 1:
                    jobMakeMethod = _a.sent();
                    if (jobMakeMethod.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: jobMakeMethod.error
                            }];
                    }
                    return [2 /*return*/, client
                            .from("trackedEntity")
                            .select("*")
                            .eq("attributes ->> Job Make Method", jobMakeMethod.data.id)
                            .eq("companyId", jobMakeMethod.data.companyId)
                            .is("attributes ->> Split Entity ID", null)];
            }
        });
    });
}
/**
 * Reschedule a job using the unified scheduling engine.
 * This recalculates dates, work centers, and priorities for all operations.
 */
function recalculateJobOperationDependencies(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("schedule", {
                    body: {
                        jobId: params.jobId,
                        companyId: params.companyId,
                        userId: params.userId,
                        mode: "reschedule",
                        direction: "backward"
                    }
                })];
        });
    });
}
function recalculateJobRequirements(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("recalculate", {
                    body: __assign({ type: "jobRequirements" }, params)
                })];
        });
    });
}
function recalculateJobMakeMethodRequirements(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("recalculate", {
                    body: __assign({ type: "jobMakeMethodRequirements" }, params)
                })];
        });
    });
}
function runMRP(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("mrp", {
                    body: __assign({}, params)
                })];
        });
    });
}
function updateJobBatchNumber(client, trackedEntityId, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("trackedEntity")
                    .update({
                    readableId: value
                })
                    .eq("id", trackedEntityId)
                    .select("id, readableId")];
        });
    });
}
function updateJobStatus(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        var id, status, assignee, updatedBy;
        return __generator(this, function (_a) {
            id = params.id, status = params.status, assignee = params.assignee, updatedBy = params.updatedBy;
            return [2 /*return*/, client
                    .from("job")
                    .update({
                    status: status,
                    assignee: assignee,
                    updatedBy: updatedBy,
                    updatedAt: new Date().toISOString()
                })
                    .eq("id", id)];
        });
    });
}
function updateJobMaterialOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, order = _a.order, updatedBy = _a.updatedBy;
                return client.from("jobMaterial").update({ order: order, updatedBy: updatedBy }).eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function updateJobOperationOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, order = _a.order, updatedBy = _a.updatedBy;
                return client.from("jobOperation").update({ order: order, updatedBy: updatedBy }).eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function updateJobOperationStepOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                return client
                    .from("jobOperationStep")
                    .update({ sortOrder: sortOrder, updatedBy: updatedBy })
                    .eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function updateKanbanJob(client, params) {
    return __awaiter(this, void 0, void 0, function () {
        var id, jobId, companyId, userId;
        return __generator(this, function (_a) {
            id = params.id, jobId = params.jobId, companyId = params.companyId, userId = params.userId;
            return [2 /*return*/, client
                    .from("kanban")
                    .update({ jobId: jobId, updatedBy: userId, updatedAt: new Date().toISOString() })
                    .eq("id", id)
                    .eq("companyId", companyId)];
        });
    });
}
function updateQuoteOperationStepOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                return client
                    .from("quoteOperationStep")
                    .update({ sortOrder: sortOrder, updatedBy: updatedBy })
                    .eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function updateMethodOperationStepOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                return client
                    .from("methodOperationStep")
                    .update({ sortOrder: sortOrder, updatedBy: updatedBy })
                    .eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function updateJobOperationStatus(client, id, status, updatedBy) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperation")
                    .update({
                    status: status,
                    updatedBy: updatedBy,
                    updatedAt: new Date().toISOString()
                })
                    .eq("id", id)
                    .select()
                    .single()];
        });
    });
}
function updateJobOperationDueDate(client, id, dueDate, updatedBy) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperation")
                    .update({
                    dueDate: dueDate,
                    manuallyScheduled: dueDate !== null,
                    updatedBy: updatedBy,
                    updatedAt: new Date().toISOString()
                })
                    .eq("id", id)
                    .select()
                    .single()];
        });
    });
}
function updateProcedureStepOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                return client.from("procedureStep").update({ sortOrder: sortOrder, updatedBy: updatedBy }).eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function upsertProductionEvent(client, productionEvent) {
    return __awaiter(this, void 0, void 0, function () {
        var id, updatedBy, companyId, updateData;
        return __generator(this, function (_a) {
            if ("createdBy" in productionEvent) {
                return [2 /*return*/, client
                        .from("productionEvent")
                        .insert([productionEvent])
                        .select("id")
                        .single()];
            }
            else {
                id = productionEvent.id, updatedBy = productionEvent.updatedBy, companyId = productionEvent.companyId, updateData = __rest(productionEvent, ["id", "updatedBy", "companyId"]);
                return [2 /*return*/, client
                        .from("productionEvent")
                        .update(__assign(__assign({}, (0, supabase_1.sanitize)(updateData)), { updatedBy: updatedBy, updatedAt: new Date().toISOString() }))
                        .eq("id", id)
                        .eq("companyId", companyId)
                        .select()
                        .single()];
            }
            return [2 /*return*/];
        });
    });
}
function updateProductionQuantity(client, productionQuantity) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, upsertProductionQuantity(client, productionQuantity)];
        });
    });
}
// Dynamic import keeps production.service ↔ productionQuantityReport.service
// edges acyclic.
function syncProductionPayApproval(client, reportId, companyId, approval) {
    return __awaiter(this, void 0, void 0, function () {
        var syncProductionQuantityReportApproval;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./productionQuantityReport.service"); })];
                case 1:
                    syncProductionQuantityReportApproval = (_b.sent()).syncProductionQuantityReportApproval;
                    return [4 /*yield*/, syncProductionQuantityReportApproval((_a = approval.serviceRole) !== null && _a !== void 0 ? _a : client, {
                            reportId: reportId,
                            companyId: companyId,
                            userId: approval.userId,
                            canAutoApprove: approval.canAutoApprove,
                            paymentYear: approval.paymentYear,
                            paymentMonth: approval.paymentMonth
                        })];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function upsertProductionQuantity(client, productionQuantity) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, createProductionQuantityReport, replaceProductionQuantityReportLines, id_1, updatedBy, companyId_1, _employeeId, approval_1, updateData_1, _b, existing, existingError, _c, activeLines, linesError, lines, result_1, updatedLine, companyId, createdBy, employeeId, jobOperationId, approval, rest, _d, operation, operationError, result;
        var _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("./productionQuantityReport.service"); })];
                case 1:
                    _a = _o.sent(), createProductionQuantityReport = _a.createProductionQuantityReport, replaceProductionQuantityReportLines = _a.replaceProductionQuantityReportLines;
                    if (!("updatedBy" in productionQuantity)) return [3 /*break*/, 7];
                    id_1 = productionQuantity.id, updatedBy = productionQuantity.updatedBy, companyId_1 = productionQuantity.companyId, _employeeId = productionQuantity.employeeId, approval_1 = productionQuantity.approval, updateData_1 = __rest(productionQuantity, ["id", "updatedBy", "companyId", "employeeId", "approval"]);
                    return [4 /*yield*/, client
                            .from("productionQuantity")
                            .select("id, reportId, invalidatedAt, type, quantity, configuration, scrapReasonId, notes")
                            .eq("id", id_1)
                            .eq("companyId", companyId_1)
                            .single()];
                case 2:
                    _b = _o.sent(), existing = _b.data, existingError = _b.error;
                    if (existingError || !existing) {
                        return [2 /*return*/, {
                                data: null,
                                error: existingError !== null && existingError !== void 0 ? existingError : new Error("Production quantity not found")
                            }];
                    }
                    if (existing.invalidatedAt) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Cannot update invalidated production quantity")
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("productionQuantity")
                            .select("id, type, quantity, configuration, scrapReasonId, notes")
                            .eq("reportId", existing.reportId)
                            .eq("companyId", companyId_1)
                            .is("invalidatedAt", null)];
                case 3:
                    _c = _o.sent(), activeLines = _c.data, linesError = _c.error;
                    if (linesError) {
                        return [2 /*return*/, { data: null, error: linesError }];
                    }
                    lines = (activeLines !== null && activeLines !== void 0 ? activeLines : []).map(function (line) {
                        var _a, _b, _c;
                        return line.id === id_1
                            ? {
                                type: updateData_1.type,
                                quantity: updateData_1.quantity,
                                configuration: updateData_1.configuration,
                                scrapReasonId: updateData_1.scrapReasonId,
                                notes: updateData_1.notes
                            }
                            : {
                                type: line.type,
                                quantity: line.quantity,
                                configuration: (_a = line.configuration) !== null && _a !== void 0 ? _a : undefined,
                                scrapReasonId: (_b = line.scrapReasonId) !== null && _b !== void 0 ? _b : undefined,
                                notes: (_c = line.notes) !== null && _c !== void 0 ? _c : undefined
                            };
                    });
                    return [4 /*yield*/, replaceProductionQuantityReportLines(client, {
                            reportId: existing.reportId,
                            companyId: companyId_1,
                            userId: updatedBy,
                            lines: lines,
                            paymentYear: (approval_1 === null || approval_1 === void 0 ? void 0 : approval_1.canAutoApprove) ? approval_1.paymentYear : null,
                            paymentMonth: (approval_1 === null || approval_1 === void 0 ? void 0 : approval_1.canAutoApprove) ? approval_1.paymentMonth : null
                        })];
                case 4:
                    result_1 = _o.sent();
                    if (result_1.error) {
                        return [2 /*return*/, { data: null, error: result_1.error }];
                    }
                    if (!approval_1) return [3 /*break*/, 6];
                    return [4 /*yield*/, syncProductionPayApproval(client, existing.reportId, companyId_1, approval_1)];
                case 5:
                    _o.sent();
                    _o.label = 6;
                case 6:
                    updatedLine = (_h = (_f = (_e = result_1.data) === null || _e === void 0 ? void 0 : _e.activeLines.find(function (line) { return line.type === updateData_1.type; })) !== null && _f !== void 0 ? _f : (_g = result_1.data) === null || _g === void 0 ? void 0 : _g.activeLines[0]) !== null && _h !== void 0 ? _h : null;
                    return [2 /*return*/, { data: updatedLine, error: null }];
                case 7:
                    companyId = productionQuantity.companyId, createdBy = productionQuantity.createdBy, employeeId = productionQuantity.employeeId, jobOperationId = productionQuantity.jobOperationId, approval = productionQuantity.approval, rest = __rest(productionQuantity, ["companyId", "createdBy", "employeeId", "jobOperationId", "approval"]);
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("jobId")
                            .eq("id", jobOperationId)
                            .eq("companyId", companyId)
                            .single()];
                case 8:
                    _d = _o.sent(), operation = _d.data, operationError = _d.error;
                    if (operationError || !(operation === null || operation === void 0 ? void 0 : operation.jobId)) {
                        return [2 /*return*/, {
                                data: null,
                                error: operationError !== null && operationError !== void 0 ? operationError : new Error("Job operation not found")
                            }];
                    }
                    return [4 /*yield*/, createProductionQuantityReport(client, {
                            companyId: companyId,
                            jobId: operation.jobId,
                            jobOperationId: jobOperationId,
                            userId: createdBy,
                            employeeId: employeeId,
                            notes: (_j = rest.notes) !== null && _j !== void 0 ? _j : null,
                            lines: [
                                {
                                    type: rest.type,
                                    quantity: rest.quantity,
                                    configuration: rest.configuration,
                                    scrapReasonId: rest.scrapReasonId,
                                    notes: rest.notes
                                }
                            ],
                            paymentYear: (approval === null || approval === void 0 ? void 0 : approval.canAutoApprove) ? approval.paymentYear : null,
                            paymentMonth: (approval === null || approval === void 0 ? void 0 : approval.canAutoApprove) ? approval.paymentMonth : null
                        })];
                case 9:
                    result = _o.sent();
                    if (result.error) {
                        return [2 /*return*/, { data: null, error: result.error }];
                    }
                    if (!(approval && ((_k = result.data) === null || _k === void 0 ? void 0 : _k.id))) return [3 /*break*/, 11];
                    return [4 /*yield*/, syncProductionPayApproval(client, result.data.id, companyId, approval)];
                case 10:
                    _o.sent();
                    _o.label = 11;
                case 11: return [2 /*return*/, {
                        data: (_m = (_l = result.data) === null || _l === void 0 ? void 0 : _l.activeLines[0]) !== null && _m !== void 0 ? _m : null,
                        error: null
                    }];
            }
        });
    });
}
function insertJob(client, input, options) {
    return __awaiter(this, void 0, void 0, function () {
        var jobId, seq, locationId, employeeJob, defaultLocation, replenishment, leadTime, scrapPercentage, dueDate, startDate, deadlineType, priority, _a, storageUnitId, _b, scrapQuantity, job, createdJobId, methodSource, body, error, body, error;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    if (!input.jobId) return [3 /*break*/, 1];
                    jobId = input.jobId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "job",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _v.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_c = seq.error) !== null && _c !== void 0 ? _c : { message: "Failed to generate job sequence" }
                            }];
                    }
                    jobId = seq.data;
                    _v.label = 3;
                case 3:
                    locationId = input.locationId;
                    if (!!locationId) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, people_1.getEmployeeJob)(client, input.createdBy, input.companyId)];
                case 4:
                    employeeJob = _v.sent();
                    locationId = (_e = (_d = employeeJob.data) === null || _d === void 0 ? void 0 : _d.locationId) !== null && _e !== void 0 ? _e : undefined;
                    if (!!locationId) return [3 /*break*/, 6];
                    return [4 /*yield*/, client
                            .from("location")
                            .select("id")
                            .eq("companyId", input.companyId)
                            .limit(1)
                            .single()];
                case 5:
                    defaultLocation = _v.sent();
                    locationId = (_g = (_f = defaultLocation.data) === null || _f === void 0 ? void 0 : _f.id) !== null && _g !== void 0 ? _g : undefined;
                    _v.label = 6;
                case 6:
                    if (!locationId) {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "No location found for job" }
                            }];
                    }
                    _v.label = 7;
                case 7: return [4 /*yield*/, client
                        .from("itemReplenishment")
                        .select("leadTime, scrapPercentage, lotSize")
                        .eq("itemId", input.itemId)
                        .eq("companyId", input.companyId)
                        .maybeSingle()];
                case 8:
                    replenishment = _v.sent();
                    leadTime = (_j = (_h = replenishment.data) === null || _h === void 0 ? void 0 : _h.leadTime) !== null && _j !== void 0 ? _j : 7;
                    scrapPercentage = (_l = (_k = replenishment.data) === null || _k === void 0 ? void 0 : _k.scrapPercentage) !== null && _l !== void 0 ? _l : 0;
                    dueDate = (_m = input.dueDate) !== null && _m !== void 0 ? _m : null;
                    startDate = (_o = input.startDate) !== null && _o !== void 0 ? _o : (dueDate
                        ? (0, date_1.parseDate)(dueDate).subtract({ days: leadTime }).toString()
                        : null);
                    deadlineType = (_p = input.deadlineType) !== null && _p !== void 0 ? _p : (dueDate ? "Hard Deadline" : "No Deadline");
                    if (!((_q = input.priority) !== null && _q !== void 0)) return [3 /*break*/, 9];
                    _a = _q;
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, calculateJobPriority(client, {
                        dueDate: dueDate,
                        deadlineType: deadlineType,
                        companyId: input.companyId,
                        locationId: locationId
                    })];
                case 10:
                    _a = (_v.sent());
                    _v.label = 11;
                case 11:
                    priority = _a;
                    if (!((_r = input.storageUnitId) !== null && _r !== void 0)) return [3 /*break*/, 12];
                    _b = _r;
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, (0, inventory_1.getDefaultStorageUnitForJob)(client, input.itemId, locationId, input.companyId)];
                case 13:
                    _b = (_v.sent());
                    _v.label = 14;
                case 14:
                    storageUnitId = _b;
                    scrapQuantity = scrapPercentage > 0 ? Math.ceil(input.quantity * scrapPercentage) : 0;
                    return [4 /*yield*/, client
                            .from("job")
                            .insert({
                            jobId: jobId,
                            itemId: input.itemId,
                            quantity: input.quantity,
                            scrapQuantity: scrapQuantity,
                            locationId: locationId,
                            dueDate: dueDate,
                            startDate: startDate,
                            deadlineType: deadlineType,
                            priority: priority,
                            status: (_s = input.status) !== null && _s !== void 0 ? _s : "Draft",
                            storageUnitId: storageUnitId,
                            unitOfMeasureCode: (_t = input.unitOfMeasureCode) !== null && _t !== void 0 ? _t : "EA",
                            customerId: input.customerId,
                            salesOrderId: input.salesOrderId,
                            salesOrderLineId: input.salesOrderLineId,
                            quoteId: input.quoteId,
                            quoteLineId: input.quoteLineId,
                            parentJobId: input.parentJobId,
                            modelUploadId: input.modelUploadId,
                            notes: input.notes,
                            customFields: input.customFields,
                            companyId: input.companyId,
                            createdBy: input.createdBy,
                            updatedBy: input.createdBy
                        })
                            .select("id")
                            .single()];
                case 15:
                    job = _v.sent();
                    if (job.error) {
                        return [2 /*return*/, { data: null, error: job.error }];
                    }
                    createdJobId = job.data.id;
                    if (!!(options === null || options === void 0 ? void 0 : options.skipMethod)) return [3 /*break*/, 19];
                    methodSource = (_u = options === null || options === void 0 ? void 0 : options.methodSource) !== null && _u !== void 0 ? _u : (input.quoteId && input.quoteLineId ? "quoteLine" : "item");
                    if (!(methodSource === "quoteLine" && input.quoteId && input.quoteLineId)) return [3 /*break*/, 17];
                    body = {
                        type: "quoteLineToJob",
                        sourceId: "".concat(input.quoteId, ":").concat(input.quoteLineId),
                        targetId: createdJobId,
                        companyId: input.companyId,
                        userId: input.createdBy
                    };
                    if (input.configuration)
                        body.configuration = input.configuration;
                    return [4 /*yield*/, client.functions.invoke("get-method", { body: body })];
                case 16:
                    error = (_v.sent()).error;
                    if (error) {
                        console.error("Failed to copy method from quote line:", error);
                    }
                    return [3 /*break*/, 19];
                case 17:
                    body = {
                        type: "itemToJob",
                        sourceId: input.itemId,
                        targetId: createdJobId,
                        companyId: input.companyId,
                        userId: input.createdBy
                    };
                    if (input.configuration)
                        body.configuration = input.configuration;
                    return [4 /*yield*/, client.functions.invoke("get-method", { body: body })];
                case 18:
                    error = (_v.sent()).error;
                    if (error) {
                        console.error("Failed to copy method from item:", error);
                    }
                    _v.label = 19;
                case 19:
                    if (!!(options === null || options === void 0 ? void 0 : options.skipRecalculate)) return [3 /*break*/, 21];
                    return [4 /*yield*/, client.functions.invoke("recalculate", {
                            body: {
                                type: "jobRequirements",
                                id: createdJobId,
                                companyId: input.companyId,
                                userId: input.createdBy
                            }
                        })];
                case 20:
                    _v.sent();
                    _v.label = 21;
                case 21: return [2 /*return*/, { data: { id: createdJobId, jobId: jobId }, error: null }];
            }
        });
    });
}
function updateJob(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var id, updatedBy, updates, priority, existing;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    id = input.id, updatedBy = input.updatedBy, updates = __rest(input, ["id", "updatedBy"]);
                    priority = updates.priority;
                    if (!((updates.dueDate !== undefined || updates.deadlineType !== undefined) &&
                        priority === undefined)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("job")
                            .select("dueDate, deadlineType, companyId, locationId")
                            .eq("id", id)
                            .single()];
                case 1:
                    existing = _c.sent();
                    if (!existing.data) return [3 /*break*/, 3];
                    return [4 /*yield*/, calculateJobPriority(client, {
                            jobId: id,
                            dueDate: (_a = updates.dueDate) !== null && _a !== void 0 ? _a : existing.data.dueDate,
                            deadlineType: (_b = updates.deadlineType) !== null && _b !== void 0 ? _b : existing.data.deadlineType,
                            companyId: existing.data.companyId,
                            locationId: existing.data.locationId
                        })];
                case 2:
                    priority = _c.sent();
                    _c.label = 3;
                case 3: return [2 /*return*/, client
                        .from("job")
                        .update(__assign(__assign(__assign({}, (0, supabase_1.sanitize)(updates)), (priority !== undefined && { priority: priority })), { updatedBy: updatedBy, updatedAt: new Date().toISOString() }))
                        .eq("id", id)
                        .select("id")
                        .single()];
            }
        });
    });
}
/** @deprecated Use insertJob for new jobs, updateJob for existing jobs */
function upsertJob(client, job, status) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("updatedBy" in job) {
                return [2 /*return*/, client
                        .from("job")
                        .update(__assign(__assign({}, (0, supabase_1.sanitize)(job)), (status && { status: status })))
                        .eq("id", job.id)
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("job")
                        .insert([
                        __assign(__assign({}, job), (status && { status: status }))
                    ])
                        .select("id")
                        .single()];
            }
            return [2 /*return*/];
        });
    });
}
function upsertJobMaterial(client, jobMaterial) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("updatedBy" in jobMaterial) {
                return [2 /*return*/, client
                        .from("jobMaterial")
                        .update((0, supabase_1.sanitize)(jobMaterial))
                        .eq("id", jobMaterial.id)
                        .select("id, methodType")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("jobMaterial")
                    .insert([jobMaterial])
                    .select("id, methodType")
                    .single()];
        });
    });
}
function upsertJobOperation(client, jobOperation) {
    return __awaiter(this, void 0, void 0, function () {
        var operationInsert, operationId, error;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if ("updatedBy" in jobOperation) {
                        return [2 /*return*/, client
                                .from("jobOperation")
                                .update((0, supabase_1.sanitize)(jobOperation))
                                .eq("id", jobOperation.id)
                                .select("id")
                                .single()];
                    }
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .insert([jobOperation])
                            .select("id")
                            .single()];
                case 1:
                    operationInsert = _b.sent();
                    if (operationInsert.error) {
                        return [2 /*return*/, operationInsert];
                    }
                    operationId = (_a = operationInsert.data) === null || _a === void 0 ? void 0 : _a.id;
                    if (!operationId)
                        return [2 /*return*/, operationInsert];
                    if (!jobOperation.procedureId) return [3 /*break*/, 3];
                    return [4 /*yield*/, client.functions.invoke("get-method", {
                            body: {
                                type: "procedureToOperation",
                                sourceId: jobOperation.procedureId,
                                targetId: operationId,
                                companyId: jobOperation.companyId,
                                userId: jobOperation.createdBy
                            }
                        })];
                case 2:
                    error = (_b.sent()).error;
                    if (error) {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "Failed to get procedure" }
                            }];
                    }
                    _b.label = 3;
                case 3: return [2 /*return*/, operationInsert];
            }
        });
    });
}
function upsertJobOperationStep(client, jobOperationStep) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in jobOperationStep) {
                return [2 /*return*/, client
                        .from("jobOperationStep")
                        .insert(jobOperationStep)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("jobOperationStep")
                    .update((0, supabase_1.sanitize)(jobOperationStep))
                    .eq("id", jobOperationStep.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertJobOperationParameter(client, jobOperationParameter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in jobOperationParameter) {
                return [2 /*return*/, client
                        .from("jobOperationParameter")
                        .insert(jobOperationParameter)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("jobOperationParameter")
                    .update((0, supabase_1.sanitize)(jobOperationParameter))
                    .eq("id", jobOperationParameter.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertJobOperationTool(client, jobOperationTool) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in jobOperationTool) {
                return [2 /*return*/, client
                        .from("jobOperationTool")
                        .insert(jobOperationTool)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("jobOperationTool")
                    .update((0, supabase_1.sanitize)(jobOperationTool))
                    .eq("id", jobOperationTool.id)
                    .select("id")
                    .single()];
        });
    });
}
function upsertJobMethod(client, type, jobMethod) {
    return __awaiter(this, void 0, void 0, function () {
        var body, getMethodResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        type: type,
                        sourceId: jobMethod.sourceId,
                        targetId: jobMethod.targetId,
                        companyId: jobMethod.companyId,
                        userId: jobMethod.userId
                    };
                    // Only add configuration if it exists
                    if (jobMethod.configuration !== undefined) {
                        body.configuration = jobMethod.configuration;
                    }
                    // Only add parts if it exists
                    if (jobMethod.parts !== undefined) {
                        body.parts = jobMethod.parts;
                    }
                    return [4 /*yield*/, client.functions.invoke("get-method", {
                            body: body
                        })];
                case 1:
                    getMethodResult = _a.sent();
                    if (getMethodResult.error) {
                        return [2 /*return*/, getMethodResult];
                    }
                    return [2 /*return*/, recalculateJobRequirements(client, {
                            id: jobMethod.targetId,
                            companyId: jobMethod.companyId,
                            userId: jobMethod.userId
                        })];
            }
        });
    });
}
function upsertJobMaterialMakeMethod(client, jobMaterial) {
    return __awaiter(this, void 0, void 0, function () {
        var body, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = {
                        type: "itemToJobMakeMethod",
                        sourceId: jobMaterial.sourceId,
                        targetId: jobMaterial.targetId,
                        companyId: jobMaterial.companyId,
                        userId: jobMaterial.userId
                    };
                    // Only add configuration if it exists
                    if (jobMaterial.configuration !== undefined) {
                        body.configuration = jobMaterial.configuration;
                    }
                    // Only add parts if it exists
                    if (jobMaterial.parts !== undefined) {
                        body.parts = jobMaterial.parts;
                    }
                    return [4 /*yield*/, client.functions.invoke("get-method", {
                            body: body
                        })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "Failed to pull method" }
                            }];
                    }
                    return [2 /*return*/, { data: null, error: null }];
            }
        });
    });
}
function upsertMakeMethodFromJob(client, jobMethod) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.functions.invoke("get-method", {
                    body: {
                        type: "jobToItem",
                        sourceId: jobMethod.sourceId,
                        targetId: jobMethod.targetId,
                        companyId: jobMethod.companyId,
                        userId: jobMethod.userId,
                        parts: jobMethod.parts
                    }
                })];
        });
    });
}
function upsertMakeMethodFromJobMethod(client, jobMethod) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.functions.invoke("get-method", {
                        body: {
                            type: "jobMakeMethodToItem",
                            sourceId: jobMethod.sourceId,
                            targetId: jobMethod.targetId,
                            companyId: jobMethod.companyId,
                            userId: jobMethod.userId,
                            parts: jobMethod.parts
                        }
                    })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "Failed to save method" }
                            }];
                    }
                    return [2 /*return*/, { data: null, error: null }];
            }
        });
    });
}
function upsertProcedure(client, procedure) {
    return __awaiter(this, void 0, void 0, function () {
        var copyFromId, rest, insert, procedure_1, attributes, parameters, workInstruction, _a, updateWorkInstructions, insertAttributes, insertParameters;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    copyFromId = procedure.copyFromId, rest = __rest(procedure, ["copyFromId"]);
                    if ("id" in rest) {
                        return [2 /*return*/, client
                                .from("procedure")
                                .update((0, supabase_1.sanitize)(rest))
                                .eq("id", rest.id)
                                .select("id")
                                .single()];
                    }
                    return [4 /*yield*/, client
                            .from("procedure")
                            .insert([rest])
                            .select("id")
                            .single()];
                case 1:
                    insert = _e.sent();
                    if (insert.error) {
                        return [2 /*return*/, insert];
                    }
                    if (!copyFromId) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("procedure")
                            .select("*, procedureStep(*), procedureParameter(*)")
                            .eq("id", copyFromId)
                            .single()];
                case 2:
                    procedure_1 = _e.sent();
                    if (procedure_1.error) {
                        return [2 /*return*/, procedure_1];
                    }
                    attributes = (_b = procedure_1.data.procedureStep) !== null && _b !== void 0 ? _b : [];
                    parameters = (_c = procedure_1.data.procedureParameter) !== null && _c !== void 0 ? _c : [];
                    workInstruction = ((_d = procedure_1.data.content) !== null && _d !== void 0 ? _d : {});
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("procedure")
                                .update({
                                content: workInstruction
                            })
                                .eq("id", insert.data.id),
                            attributes.length > 0
                                ? client.from("procedureStep").insert(attributes.map(function (attribute) {
                                    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
                                    var id = attribute.id, procedureId = attribute.procedureId, rest = __rest(attribute, ["id", "procedureId"]);
                                    return __assign(__assign({}, rest), { procedureId: insert.data.id, companyId: procedure_1.data.companyId });
                                }))
                                : Promise.resolve({ data: null, error: null }),
                            parameters.length > 0
                                ? client.from("procedureParameter").insert(parameters.map(function (parameter) {
                                    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
                                    var id = parameter.id, procedureId = parameter.procedureId, rest = __rest(parameter, ["id", "procedureId"]);
                                    return __assign(__assign({}, rest), { procedureId: insert.data.id, companyId: procedure_1.data.companyId });
                                }))
                                : Promise.resolve({ data: null, error: null })
                        ])];
                case 3:
                    _a = _e.sent(), updateWorkInstructions = _a[0], insertAttributes = _a[1], insertParameters = _a[2];
                    if (updateWorkInstructions.error) {
                        return [2 /*return*/, updateWorkInstructions];
                    }
                    if (insertAttributes.error) {
                        return [2 /*return*/, insertAttributes];
                    }
                    if (insertParameters.error) {
                        return [2 /*return*/, insertParameters];
                    }
                    _e.label = 4;
                case 4: return [2 /*return*/, insert];
            }
        });
    });
}
function upsertProcedureStep(client, procedureStep) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in procedureStep) {
                return [2 /*return*/, client
                        .from("procedureStep")
                        .update((0, supabase_1.sanitize)(procedureStep))
                        .eq("id", procedureStep.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("procedureStep")
                    .insert([procedureStep])
                    .select("id")
                    .single()];
        });
    });
}
function upsertProcedureParameter(client, procedureParameter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in procedureParameter) {
                return [2 /*return*/, client
                        .from("procedureParameter")
                        .update((0, supabase_1.sanitize)(procedureParameter))
                        .eq("id", procedureParameter.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("procedureParameter")
                    .insert([procedureParameter])
                    .select("id")
                    .single()];
        });
    });
}
function upsertScrapReason(client, scrapReason) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in scrapReason) {
                return [2 /*return*/, client.from("scrapReason").insert([scrapReason]).select("id")];
            }
            else {
                return [2 /*return*/, client
                        .from("scrapReason")
                        .update((0, supabase_1.sanitize)(scrapReason))
                        .eq("id", scrapReason.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertFailureMode(client, failureMode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in failureMode) {
                return [2 /*return*/, client
                        .from("maintenanceFailureMode")
                        .insert([failureMode])
                        .select("id")];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceFailureMode")
                        .update((0, supabase_1.sanitize)(failureMode))
                        .eq("id", failureMode.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertMaintenanceDispatch(client, dispatch) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            if ("createdBy" in dispatch) {
                return [2 /*return*/, client
                        .from("maintenanceDispatch")
                        .insert([
                        __assign(__assign({}, dispatch), { severity: (_a = dispatch.severity) !== null && _a !== void 0 ? _a : "Support Required" })
                    ])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceDispatch")
                        .update((0, supabase_1.sanitize)(dispatch))
                        .eq("id", dispatch.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertMaintenanceDispatchComment(client, comment) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in comment) {
                return [2 /*return*/, client
                        .from("maintenanceDispatchComment")
                        .insert([comment])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceDispatchComment")
                        .update((0, supabase_1.sanitize)(comment))
                        .eq("id", comment.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertMaintenanceDispatchEvent(client, event) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in event) {
                return [2 /*return*/, client
                        .from("maintenanceDispatchEvent")
                        .insert([event])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceDispatchEvent")
                        .update((0, supabase_1.sanitize)(event))
                        .eq("id", event.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertMaintenanceDispatchItem(client, item) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in item) {
                return [2 /*return*/, client
                        .from("maintenanceDispatchItem")
                        .insert([item])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceDispatchItem")
                        .update((0, supabase_1.sanitize)(item))
                        .eq("id", item.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertMaintenanceDispatchWorkCenter(client, workCenter) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in workCenter) {
                return [2 /*return*/, client
                        .from("maintenanceDispatchWorkCenter")
                        .insert([workCenter])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceDispatchWorkCenter")
                        .update((0, supabase_1.sanitize)(workCenter))
                        .eq("id", workCenter.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertMaintenanceSchedule(client, schedule) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in schedule) {
                return [2 /*return*/, client
                        .from("maintenanceSchedule")
                        .insert([schedule])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceSchedule")
                        .update((0, supabase_1.sanitize)(schedule))
                        .eq("id", schedule.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertMaintenanceScheduleItem(client, item) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in item) {
                return [2 /*return*/, client
                        .from("maintenanceScheduleItem")
                        .insert([item])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("maintenanceScheduleItem")
                        .update((0, supabase_1.sanitize)(item))
                        .eq("id", item.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertDemandForecasts(client, forecasts) {
    return __awaiter(this, void 0, void 0, function () {
        var toDelete, toUpsert, promises, _i, toDelete_1, forecast, results, hasError;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    toDelete = forecasts.filter(function (f) { return f.forecastQuantity === 0; });
                    toUpsert = forecasts.filter(function (f) { return f.forecastQuantity > 0; });
                    promises = [];
                    if (toDelete.length > 0) {
                        for (_i = 0, toDelete_1 = toDelete; _i < toDelete_1.length; _i++) {
                            forecast = toDelete_1[_i];
                            promises.push(client
                                .from("demandForecast")
                                .delete()
                                .eq("itemId", forecast.itemId)
                                .eq("locationId", forecast.locationId)
                                .eq("periodId", forecast.periodId)
                                .eq("companyId", forecast.companyId));
                        }
                    }
                    if (toUpsert.length > 0) {
                        promises.push(client.from("demandForecast").upsert(toUpsert.map(function (f) {
                            var _a, _b;
                            return (__assign(__assign({}, f), { updatedBy: (_b = (_a = f.updatedBy) !== null && _a !== void 0 ? _a : f.createdBy) !== null && _b !== void 0 ? _b : "system", updatedAt: new Date().toISOString() }));
                        }), {
                            onConflict: "itemId,locationId,periodId,companyId"
                        }));
                    }
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    results = _b.sent();
                    hasError = results.some(function (r) { return r.error; });
                    return [2 /*return*/, {
                            data: hasError ? null : toUpsert,
                            error: hasError ? (_a = results.find(function (r) { return r.error; })) === null || _a === void 0 ? void 0 : _a.error : null
                        }];
            }
        });
    });
}
function upsertDemandProjections(client, forecasts) {
    return __awaiter(this, void 0, void 0, function () {
        var toDelete, toUpsert, promises, _i, toDelete_2, forecast, results, hasError;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    toDelete = forecasts.filter(function (f) { return f.forecastQuantity === 0; });
                    toUpsert = forecasts.filter(function (f) { return f.forecastQuantity > 0; });
                    promises = [];
                    if (toDelete.length > 0) {
                        for (_i = 0, toDelete_2 = toDelete; _i < toDelete_2.length; _i++) {
                            forecast = toDelete_2[_i];
                            promises.push(client
                                .from("demandProjection")
                                .delete()
                                .eq("itemId", forecast.itemId)
                                .eq("locationId", forecast.locationId)
                                .eq("periodId", forecast.periodId)
                                .eq("companyId", forecast.companyId));
                        }
                    }
                    if (toUpsert.length > 0) {
                        promises.push(client.from("demandProjection").upsert(toUpsert.map(function (f) {
                            var _a, _b;
                            return (__assign(__assign({}, f), { updatedBy: (_b = (_a = f.updatedBy) !== null && _a !== void 0 ? _a : f.createdBy) !== null && _b !== void 0 ? _b : "system", updatedAt: new Date().toISOString() }));
                        }), {
                            onConflict: "itemId,locationId,periodId,companyId"
                        }));
                    }
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    results = _b.sent();
                    hasError = results.some(function (r) { return r.error; });
                    return [2 /*return*/, {
                            data: hasError ? null : toUpsert,
                            error: hasError ? (_a = results.find(function (r) { return r.error; })) === null || _a === void 0 ? void 0 : _a.error : null
                        }];
            }
        });
    });
}
/**
 * Trigger a job scheduling task via Inngest.
 * Supports both initial scheduling and rescheduling.
 */
function triggerJobSchedule(jobId_1, companyId_2, userId_1) {
    return __awaiter(this, arguments, void 0, function (jobId, companyId, userId, mode, direction) {
        var trigger;
        if (mode === void 0) { mode = "reschedule"; }
        if (direction === void 0) { direction = "backward"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("@carbon/jobs"); })];
                case 1:
                    trigger = (_a.sent()).trigger;
                    return [4 /*yield*/, trigger("schedule-job", {
                            jobId: jobId,
                            companyId: companyId,
                            userId: userId,
                            mode: mode,
                            direction: direction
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    });
}
