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
exports.getOpenJobs = getOpenJobs;
exports.getTrackedEntitiesByJobMakeMethodIds = getTrackedEntitiesByJobMakeMethodIds;
exports.getJobOperations = getJobOperations;
exports.getJobOperationDependencies = getJobOperationDependencies;
exports.getUpstreamOperations = getUpstreamOperations;
exports.deleteAttributeRecord = deleteAttributeRecord;
exports.finishJobOperation = finishJobOperation;
exports.getActiveJobOperationsByEmployee = getActiveJobOperationsByEmployee;
exports.getActiveJobOperationsByLocation = getActiveJobOperationsByLocation;
exports.getActiveJobCount = getActiveJobCount;
exports.getCustomers = getCustomers;
exports.getFailureModesList = getFailureModesList;
exports.getQualityIssueTypesList = getQualityIssueTypesList;
exports.getFileType = getFileType;
exports.getJobOperationProcedure = getJobOperationProcedure;
exports.getJobAttributesByOperationId = getJobAttributesByOperationId;
exports.getJobByOperationId = getJobByOperationId;
exports.getJobFiles = getJobFiles;
exports.getJobMakeMethod = getJobMakeMethod;
exports.getJobMaterialsByOperationId = getJobMaterialsByOperationId;
exports.getJobOperationsAssignedToEmployee = getJobOperationsAssignedToEmployee;
exports.getJobOperationById = getJobOperationById;
exports.getJobOperationsByWorkCenter = getJobOperationsByWorkCenter;
exports.getJobParametersByOperationId = getJobParametersByOperationId;
exports.getKanbanByJobId = getKanbanByJobId;
exports.getLocationsByCompany = getLocationsByCompany;
exports.getNonConformanceActions = getNonConformanceActions;
exports.getProcessesList = getProcessesList;
exports.getProductionEventsForJobOperation = getProductionEventsForJobOperation;
exports.getProductionQuantitiesForJobOperation = getProductionQuantitiesForJobOperation;
exports.getRecentJobOperationsByEmployee = getRecentJobOperationsByEmployee;
exports.getScrapReasonsList = getScrapReasonsList;
exports.getTrackedEntitiesByMakeMethodId = getTrackedEntitiesByMakeMethodId;
exports.getTrackedEntity = getTrackedEntity;
exports.getTrackedEntitiesByOperationId = getTrackedEntitiesByOperationId;
exports.getTrackedInputs = getTrackedInputs;
exports.getThumbnailPathByItemId = getThumbnailPathByItemId;
exports.getWorkCenter = getWorkCenter;
exports.getWorkCentersByLocation = getWorkCentersByLocation;
exports.getWorkCentersByCompany = getWorkCentersByCompany;
exports.insertAttributeRecord = insertAttributeRecord;
exports.insertReworkQuantity = insertReworkQuantity;
exports.insertProductionQuantity = insertProductionQuantity;
exports.insertScrapQuantity = insertScrapQuantity;
exports.endProductionEvent = endProductionEvent;
exports.endProductionEventsForJobOperation = endProductionEventsForJobOperation;
exports.endProductionEvents = endProductionEvents;
exports.endProductionEventsByWorkCenter = endProductionEventsByWorkCenter;
exports.startProductionEvent = startProductionEvent;
exports.getJobMethodBomIdMap = getJobMethodBomIdMap;
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var nanoid_1 = require("nanoid");
var supabase_1 = require("~/utils/supabase");
var inventory_service_1 = require("./inventory.service");
function getOpenJobs(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobs")
                    .select("id, jobId, status, itemReadableIdWithRevision, name, quantity, quantityComplete, dueDate, deadlineType, assignee, jobMakeMethodId")
                    .eq("companyId", args.companyId)
                    .eq("locationId", args.locationId)
                    .in("status", ["Ready", "In Progress", "Paused"])
                    .order("jobId", { ascending: true })];
        });
    });
}
function getTrackedEntitiesByJobMakeMethodIds(client, jobMakeMethodIds, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
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
                    result = _a.sent();
                    if (!result.data)
                        return [2 /*return*/, {}];
                    return [2 /*return*/, result.data.reduce(function (acc, curr) {
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
function getJobOperations(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperation")
                    .select("*, jobMakeMethod(parentMaterialId, item(readableIdWithRevision))")
                    .eq("jobId", jobId)];
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
function getUpstreamOperations(client, operationId) {
    return __awaiter(this, void 0, void 0, function () {
        var operation, deps, dependsOn, _i, _a, dep, existing, ancestors, queue, current, _b, _c, predecessor;
        var _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobOperation")
                        .select("jobId")
                        .eq("id", operationId)
                        .single()];
                case 1:
                    operation = _g.sent();
                    if (operation.error)
                        return [2 /*return*/, { data: [], error: operation.error }];
                    return [4 /*yield*/, client
                            .from("jobOperationDependency")
                            .select("operationId, dependsOnId")
                            .eq("jobId", operation.data.jobId)];
                case 2:
                    deps = _g.sent();
                    if (deps.error)
                        return [2 /*return*/, { data: [], error: deps.error }];
                    dependsOn = new Map();
                    for (_i = 0, _a = deps.data; _i < _a.length; _i++) {
                        dep = _a[_i];
                        existing = (_d = dependsOn.get(dep.operationId)) !== null && _d !== void 0 ? _d : [];
                        existing.push(dep.dependsOnId);
                        dependsOn.set(dep.operationId, existing);
                    }
                    ancestors = new Set();
                    queue = __spreadArray([], ((_e = dependsOn.get(operationId)) !== null && _e !== void 0 ? _e : []), true);
                    while (queue.length > 0) {
                        current = queue.shift();
                        if (ancestors.has(current))
                            continue;
                        ancestors.add(current);
                        for (_b = 0, _c = (_f = dependsOn.get(current)) !== null && _f !== void 0 ? _f : []; _b < _c.length; _b++) {
                            predecessor = _c[_b];
                            queue.push(predecessor);
                        }
                    }
                    if (ancestors.size === 0)
                        return [2 /*return*/, { data: [], error: null }];
                    return [2 /*return*/, client
                            .from("jobOperation")
                            .select("id, processId, description, order, status, reworkId, jobMakeMethod(item(name))")
                            .in("id", Array.from(ancestors))
                            .order("order", { ascending: true })];
            }
        });
    });
}
function deleteAttributeRecord(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperationStepRecord")
                    .delete()
                    .eq("id", args.id)
                    .eq("companyId", args.companyId)
                    .eq("createdBy", args.userId)];
        });
    });
}
function finishJobOperation(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobOperation")
                        .update({
                        status: "Done",
                        updatedBy: args.userId
                    })
                        .eq("id", args.jobOperationId)];
                case 1:
                    result = _a.sent();
                    if (!result.error) {
                        client
                            .from("productionEvent")
                            .select("id")
                            .eq("jobOperationId", args.jobOperationId)
                            .not("endTime", "is", null)
                            .eq("postedToGL", false)
                            .then(function (unpostedEvents) {
                            var _a;
                            if ((_a = unpostedEvents.data) === null || _a === void 0 ? void 0 : _a.length) {
                                Promise.all(unpostedEvents.data.map(function (event) {
                                    return client.functions.invoke("post-production-event", {
                                        body: {
                                            productionEventId: event.id,
                                            userId: args.userId,
                                            companyId: args.companyId
                                        }
                                    });
                                }));
                            }
                        });
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
function getActiveJobOperationsByEmployee(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_active_job_operations_by_employee", {
                    employee_id: args.employeeId,
                    company_id: args.companyId
                })];
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
function getActiveJobCount(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_active_job_count", {
                    employee_id: args.employeeId,
                    company_id: args.companyId
                })];
        });
    });
}
function getCustomers(client, companyId, customerIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("customer")
                    .select("id, name")
                    .in("id", customerIds)
                    .eq("companyId", companyId)];
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
function getQualityIssueTypesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceType")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getFileType(fileName) {
    var _a, _b;
    var extension = (_b = (_a = fileName.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "";
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) {
        return "Archive";
    }
    if (["pdf"].includes(extension)) {
        return "PDF";
    }
    if (["doc", "docx", "txt", "rtf"].includes(extension)) {
        return "Document";
    }
    if (["ppt", "pptx"].includes(extension)) {
        return "Presentation";
    }
    if (["csv", "xls", "xlsx"].includes(extension)) {
        return "Spreadsheet";
    }
    if (["txt"].includes(extension)) {
        return "Text";
    }
    if (["png", "jpg", "jpeg", "gif", "avif"].includes(extension)) {
        return "Image";
    }
    if (["mp4", "mov", "avi", "wmv", "flv", "mkv"].includes(extension)) {
        return "Video";
    }
    if (["mp3", "wav", "wma", "aac", "ogg", "flac"].includes(extension)) {
        return "Audio";
    }
    return "Other";
}
function getJobOperationProcedure(client, operationId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, attributes, parameters;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("jobOperationStep")
                            .select("*, jobOperationStepRecord(*)")
                            .eq("operationId", operationId),
                        client
                            .from("jobOperationParameter")
                            .select("*")
                            .eq("operationId", operationId)
                    ])];
                case 1:
                    _a = _d.sent(), attributes = _a[0], parameters = _a[1];
                    return [2 /*return*/, {
                            attributes: (_b = attributes.data) !== null && _b !== void 0 ? _b : [],
                            parameters: (_c = parameters.data) !== null && _c !== void 0 ? _c : []
                        }];
            }
        });
    });
}
function getJobAttributesByOperationId(client, operationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperationStep")
                    .select("*, jobOperationStepRecord(*)")
                    .eq("operationId", operationId)];
        });
    });
}
function getJobByOperationId(client, operationId) {
    return __awaiter(this, void 0, void 0, function () {
        var operation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobOperation")
                        .select("jobId")
                        .eq("id", operationId)
                        .single()];
                case 1:
                    operation = _a.sent();
                    if (operation.error)
                        return [2 /*return*/, operation];
                    return [2 /*return*/, client
                            .from("jobs")
                            .select("*, customer(name)")
                            .eq("id", operation.data.jobId)
                            .single()];
            }
        });
    });
}
var getItemFiles = function (client, companyId, items) { return __awaiter(void 0, void 0, void 0, function () {
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
}); };
function getJobFiles(client, companyId, job, items) {
    return __awaiter(this, void 0, void 0, function () {
        var opportunityLine, _a, opportunityLineFiles, jobFiles, itemFiles, _b, jobFiles, itemFiles;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!(job.salesOrderLineId || job.quoteLineId)) return [3 /*break*/, 2];
                    opportunityLine = job.salesOrderLineId || job.quoteLineId;
                    return [4 /*yield*/, Promise.all([
                            client.storage
                                .from("private")
                                .list("".concat(companyId, "/opportunity-line/").concat(opportunityLine)),
                            client.storage.from("private").list("".concat(companyId, "/job/").concat(job.id)),
                            getItemFiles(client, companyId, items)
                        ])];
                case 1:
                    _a = _f.sent(), opportunityLineFiles = _a[0], jobFiles = _a[1], itemFiles = _a[2];
                    // Combine and return both sets of files
                    return [2 /*return*/, __spreadArray(__spreadArray(__spreadArray([], (((_c = opportunityLineFiles.data) === null || _c === void 0 ? void 0 : _c.map(function (f) { return (__assign(__assign({}, f), { bucket: "opportunity-line" })); })) || []), true), (((_d = jobFiles.data) === null || _d === void 0 ? void 0 : _d.map(function (f) { return (__assign(__assign({}, f), { bucket: "job" })); })) || []), true), itemFiles, true)];
                case 2: return [4 /*yield*/, Promise.all([
                        client.storage.from("private").list("".concat(companyId, "/job/").concat(job.id)),
                        getItemFiles(client, companyId, items)
                    ])];
                case 3:
                    _b = _f.sent(), jobFiles = _b[0], itemFiles = _b[1];
                    return [2 /*return*/, __spreadArray(__spreadArray([], (((_e = jobFiles.data) === null || _e === void 0 ? void 0 : _e.map(function (f) { return (__assign(__assign({}, f), { bucket: "job" })); })) || []), true), itemFiles, true)];
            }
        });
    });
}
function getJobMakeMethod(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("jobMakeMethod").select("*").eq("id", id).single()];
        });
    });
}
function getJobMaterialsByOperationId(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var operation, trackedEntityId, requiresSerialTracking, _a, materials, trackedInputs, kittedMakeMethodIds, kittedMaterials, kitParentMap_1, processedKittedMaterials, consumedEntityIds, todayStr, expiredConsumed, _b, expiredConsumedIds, consumedExpiredFor, materialIds, pickedByMaterial, pickedFor;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    operation = args.operation, trackedEntityId = args.trackedEntityId, requiresSerialTracking = args.requiresSerialTracking;
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("jobMaterialWithMakeMethodId")
                                .select("*")
                                .eq("jobMakeMethodId", operation.jobMakeMethodId)
                                .order("itemReadableId", { ascending: true })
                                .order("id", { ascending: true }),
                            getTrackedInputs(client, trackedEntityId)
                        ])];
                case 1:
                    _a = _r.sent(), materials = _a[0], trackedInputs = _a[1];
                    kittedMakeMethodIds = new Set((_d = (_c = materials.data) === null || _c === void 0 ? void 0 : _c.filter(function (m) { return m.kit; }).map(function (m) { return m.jobMaterialMakeMethodId; })) !== null && _d !== void 0 ? _d : []);
                    if (!kittedMakeMethodIds.size) return [3 /*break*/, 3];
                    return [4 /*yield*/, client
                            .from("jobMaterialWithMakeMethodId")
                            .select("*")
                            .in("jobMakeMethodId", Array.from(kittedMakeMethodIds))
                            .neq("methodType", "Make to Order")];
                case 2:
                    kittedMaterials = _r.sent();
                    kitParentMap_1 = new Map();
                    (_e = materials.data) === null || _e === void 0 ? void 0 : _e.forEach(function (material) {
                        if (material.kit && material.jobMaterialMakeMethodId) {
                            kitParentMap_1.set(material.jobMaterialMakeMethodId, material);
                        }
                    });
                    processedKittedMaterials = ((_f = kittedMaterials.data) !== null && _f !== void 0 ? _f : []).map(function (material) {
                        var _a, _b;
                        return (__assign(__assign({}, material), { isKitComponent: true, kitParentId: (_b = (_a = Array.from(kitParentMap_1.entries()).find(function (_a) {
                                var makeMethodId = _a[0];
                                return makeMethodId === material.jobMakeMethodId;
                            })) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.id }));
                    });
                    materials.data = __spreadArray(__spreadArray([], ((_g = materials.data) !== null && _g !== void 0 ? _g : []), true), processedKittedMaterials, true);
                    _r.label = 3;
                case 3:
                    consumedEntityIds = Array.from(new Set(((_h = trackedInputs.data) !== null && _h !== void 0 ? _h : []).map(function (i) { return i.id; }).filter(Boolean)));
                    todayStr = (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString();
                    if (!(consumedEntityIds.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("trackedEntity")
                            .select("id")
                            .in("id", consumedEntityIds)
                            .not("expirationDate", "is", null)
                            .lt("expirationDate", todayStr)];
                case 4:
                    _b = _r.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _b = { data: [] };
                    _r.label = 6;
                case 6:
                    expiredConsumed = _b;
                    expiredConsumedIds = new Set(((_j = expiredConsumed.data) !== null && _j !== void 0 ? _j : []).map(function (r) { return r.id; }));
                    consumedExpiredFor = function (materialId) {
                        var _a;
                        return ((_a = trackedInputs.data) !== null && _a !== void 0 ? _a : []).some(function (input) {
                            var _a;
                            return ((_a = input.activityAttributes) === null || _a === void 0 ? void 0 : _a["Job Material"]) === materialId && expiredConsumedIds.has(input.id);
                        });
                    };
                    materialIds = Array.from(new Set(((_k = materials.data) !== null && _k !== void 0 ? _k : []).map(function (m) { return m.id; }).filter(function (id) { return !!id; })));
                    return [4 /*yield*/, (0, inventory_service_1.getPickedQuantitiesByJobMaterial)(client, materialIds)];
                case 7:
                    pickedByMaterial = _r.sent();
                    pickedFor = function (materialId) {
                        var _a;
                        return (_a = (materialId ? pickedByMaterial[materialId] : undefined)) !== null && _a !== void 0 ? _a : {
                            quantityPicked: 0,
                            quantityToPick: 0
                        };
                    };
                    if (requiresSerialTracking) {
                        return [2 /*return*/, {
                                materials: (_m = (_l = materials.data) === null || _l === void 0 ? void 0 : _l.map(function (material) {
                                    var _a, _b;
                                    var hasExpiredConsumed = consumedExpiredFor(material.id);
                                    var picked = pickedFor(material.id);
                                    if (!material.requiresSerialTracking &&
                                        !material.requiresBatchTracking)
                                        return __assign(__assign(__assign({}, material), { hasExpiredConsumed: hasExpiredConsumed }), picked);
                                    var issuedForTrackedParent = (_b = (_a = trackedInputs.data) === null || _a === void 0 ? void 0 : _a.filter(function (input) {
                                        var _a;
                                        return ((_a = input.activityAttributes) === null || _a === void 0 ? void 0 : _a["Job Material"]) === material.id;
                                    }).reduce(function (acc, input) {
                                        return acc + input.quantity;
                                    }, 0)) !== null && _b !== void 0 ? _b : 0;
                                    return __assign(__assign(__assign({}, material), { quantityIssued: issuedForTrackedParent, hasExpiredConsumed: hasExpiredConsumed }), picked);
                                })) !== null && _m !== void 0 ? _m : [],
                                trackedInputs: (_o = trackedInputs.data) !== null && _o !== void 0 ? _o : []
                            }];
                    }
                    else {
                        return [2 /*return*/, {
                                materials: ((_p = materials.data) !== null && _p !== void 0 ? _p : []).map(function (material) { return (__assign(__assign(__assign({}, material), { hasExpiredConsumed: consumedExpiredFor(material.id) }), pickedFor(material.id))); }),
                                trackedInputs: (_q = trackedInputs.data) !== null && _q !== void 0 ? _q : []
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getJobOperationsAssignedToEmployee(client, employeeId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_assigned_job_operations", {
                    user_id: employeeId,
                    company_id: companyId
                })];
        });
    });
}
function getJobOperationById(client, operationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_job_operation_by_id", {
                    operation_id: operationId
                })];
        });
    });
}
function getJobOperationsByWorkCenter(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var locationId = _b.locationId, workCenterId = _b.workCenterId;
        return __generator(this, function (_c) {
            return [2 /*return*/, client.rpc("get_job_operations_by_work_center", {
                    location_id: locationId,
                    work_center_id: workCenterId
                })];
        });
    });
}
function getJobParametersByOperationId(client, operationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("jobOperationParameter")
                    .select("*")
                    .eq("operationId", operationId)];
        });
    });
}
function getKanbanByJobId(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!jobId)
                return [2 /*return*/, { data: null, error: null }];
            return [2 /*return*/, client.from("kanban").select("*").eq("jobId", jobId).maybeSingle()];
        });
    });
}
function getLocationsByCompany(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("location")
                    .select("*")
                    .eq("companyId", companyId)
                    .order("name", { ascending: true })];
        });
    });
}
function getNonConformanceActions(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.rpc("get_action_tasks_by_item_and_process", {
                        p_item_id: args.itemId,
                        p_process_id: args.processId,
                        p_company_id: args.companyId
                    })];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, ((_a = result.data) !== null && _a !== void 0 ? _a : [])];
            }
        });
    });
}
function getProcessesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("process")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getProductionEventsForJobOperation(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionEvent")
                    .select("*")
                    .eq("jobOperationId", args.operationId)];
        });
    });
}
function getProductionQuantitiesForJobOperation(client, operationId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionQuantity")
                    .select("*, employee:employeeId(id, firstName, lastName, avatarUrl), createdByUser:createdBy(id, firstName, lastName, avatarUrl)")
                    .eq("jobOperationId", operationId)
                    .is("invalidatedAt", null)
                    .order("createdAt", { ascending: false })];
        });
    });
}
function getRecentJobOperationsByEmployee(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.rpc("get_recent_job_operations_by_employee", {
                    employee_id: args.employeeId,
                    company_id: args.companyId
                })];
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
function getTrackedEntity(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("trackedEntity").select("*").eq("id", id).single()];
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
function getTrackedInputs(client, trackedEntityId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, inputs, outputs, inputCounts, outputCounts, includedIds, inputsWithoutCircularReferences;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!trackedEntityId)
                        return [2 /*return*/, { data: [] }];
                    return [4 /*yield*/, Promise.all([
                            client.rpc("get_direct_descendants_of_tracked_entity_strict", {
                                p_tracked_entity_id: trackedEntityId
                            }),
                            client.rpc("get_direct_ancestors_of_tracked_entity_strict", {
                                p_tracked_entity_id: trackedEntityId
                            })
                        ])];
                case 1:
                    _a = _e.sent(), inputs = _a[0], outputs = _a[1];
                    if (outputs.error || outputs.data.length === 0)
                        return [2 /*return*/, inputs];
                    inputCounts = new Map();
                    outputCounts = new Map();
                    // Count occurrences in inputs
                    (_b = inputs.data) === null || _b === void 0 ? void 0 : _b.forEach(function (input) {
                        inputCounts.set(input.id, (inputCounts.get(input.id) || 0) + 1);
                    });
                    // Count occurrences in outputs
                    (_c = outputs.data) === null || _c === void 0 ? void 0 : _c.forEach(function (output) {
                        outputCounts.set(output.id, (outputCounts.get(output.id) || 0) + 1);
                    });
                    includedIds = new Set();
                    inputsWithoutCircularReferences = (_d = inputs.data) === null || _d === void 0 ? void 0 : _d.filter(function (input) {
                        var inputCount = inputCounts.get(input.id) || 0;
                        var outputCount = outputCounts.get(input.id) || 0;
                        // Only include if input count > output count and we haven't included this ID yet
                        if (inputCount > outputCount && !includedIds.has(input.id)) {
                            includedIds.add(input.id);
                            return true;
                        }
                        return false;
                    });
                    return [2 /*return*/, {
                            data: inputsWithoutCircularReferences,
                            error: inputs.error
                        }];
            }
        });
    });
}
function getThumbnailPathByItemId(client, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        var item, thumbnailPath, modelUploadId, modelUpload, modelUploadThumbnailPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("item")
                        .select("thumbnailPath, modelUploadId")
                        .eq("id", itemId)
                        .single()];
                case 1:
                    item = (_a.sent()).data;
                    if (!item)
                        return [2 /*return*/, null];
                    thumbnailPath = item.thumbnailPath, modelUploadId = item.modelUploadId;
                    if (!modelUploadId)
                        return [2 /*return*/, thumbnailPath];
                    return [4 /*yield*/, client
                            .from("modelUpload")
                            .select("thumbnailPath")
                            .eq("id", modelUploadId)
                            .single()];
                case 2:
                    modelUpload = (_a.sent()).data;
                    modelUploadThumbnailPath = modelUpload === null || modelUpload === void 0 ? void 0 : modelUpload.thumbnailPath;
                    if (!thumbnailPath && modelUploadThumbnailPath) {
                        return [2 /*return*/, modelUploadThumbnailPath];
                    }
                    return [2 /*return*/, thumbnailPath];
            }
        });
    });
}
function getWorkCenter(client, workCenterId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("workCentersWithBlockingStatus")
                    .select("id, name, isBlocked, blockingDispatchId, blockingDispatchReadableId")
                    .eq("id", workCenterId)
                    .single()];
        });
    });
}
function getWorkCentersByLocation(client, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, workCentersResult, blockingStatusResult, blockingStatusMap, mergedData;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        client
                            .from("workCenters")
                            .select("*")
                            .eq("locationId", locationId)
                            .eq("active", true)
                            .order("name", { ascending: true }),
                        client
                            .from("workCentersWithBlockingStatus")
                            .select("id, isBlocked, blockingDispatchId, blockingDispatchReadableId")
                            .eq("locationId", locationId)
                            .eq("active", true)
                    ])];
                case 1:
                    _a = _e.sent(), workCentersResult = _a[0], blockingStatusResult = _a[1];
                    if (workCentersResult.error) {
                        return [2 /*return*/, workCentersResult];
                    }
                    blockingStatusMap = new Map((_c = (_b = blockingStatusResult.data) === null || _b === void 0 ? void 0 : _b.map(function (wc) { return [wc.id, wc]; })) !== null && _c !== void 0 ? _c : []);
                    mergedData = (_d = workCentersResult.data) === null || _d === void 0 ? void 0 : _d.map(function (wc) {
                        var _a, _b, _c;
                        var blockingStatus = blockingStatusMap.get(wc.id);
                        return __assign(__assign({}, wc), { isBlocked: (_a = blockingStatus === null || blockingStatus === void 0 ? void 0 : blockingStatus.isBlocked) !== null && _a !== void 0 ? _a : false, blockingDispatchId: (_b = blockingStatus === null || blockingStatus === void 0 ? void 0 : blockingStatus.blockingDispatchId) !== null && _b !== void 0 ? _b : null, blockingDispatchReadableId: (_c = blockingStatus === null || blockingStatus === void 0 ? void 0 : blockingStatus.blockingDispatchReadableId) !== null && _c !== void 0 ? _c : null });
                    });
                    return [2 /*return*/, { data: mergedData, error: null }];
            }
        });
    });
}
function getWorkCentersByCompany(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("workCenter")
                    .select("*")
                    .eq("companyId", companyId)
                    .order("name", { ascending: true })];
        });
    });
}
function insertAttributeRecord(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("jobOperationStepRecord").upsert(data, {
                    onConflict: "jobOperationStepId, index",
                    ignoreDuplicates: false
                })];
        });
    });
}
// Production quantities roll up under a productionQuantityReport: the ERP
// review/approval flow keys off `productionQuantity.reportId`. MES reports a
// single line per submission, so we create the report wrapper here and attach
// the line to it. Without this, MES-reported quantities are orphaned (no
// report) and cannot be reviewed/approved on the ERP side.
function createReportAndQuantity(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, operation, operationError, _b, report, reportError;
        var _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, client
                        .from("jobOperation")
                        .select("jobId")
                        .eq("id", args.jobOperationId)
                        .single()];
                case 1:
                    _a = _h.sent(), operation = _a.data, operationError = _a.error;
                    if (operationError || !(operation === null || operation === void 0 ? void 0 : operation.jobId)) {
                        return [2 /*return*/, {
                                data: null,
                                error: operationError !== null && operationError !== void 0 ? operationError : new Error("Could not resolve job for operation ".concat(args.jobOperationId))
                            }];
                    }
                    return [4 /*yield*/, client
                            .from("productionQuantityReport")
                            .insert({
                            companyId: args.companyId,
                            jobId: operation.jobId,
                            jobOperationId: args.jobOperationId,
                            employeeId: args.employeeId,
                            originalQuantity: args.quantity,
                            notes: (_c = args.notes) !== null && _c !== void 0 ? _c : null,
                            createdBy: args.createdBy
                        })
                            .select("id")
                            .single()];
                case 2:
                    _b = _h.sent(), report = _b.data, reportError = _b.error;
                    if (reportError || !report) {
                        return [2 /*return*/, { data: null, error: reportError }];
                    }
                    return [2 /*return*/, client
                            .from("productionQuantity")
                            .insert((0, supabase_1.sanitize)({
                            companyId: args.companyId,
                            jobOperationId: args.jobOperationId,
                            reportId: report.id,
                            type: args.type,
                            quantity: args.quantity,
                            notes: (_d = args.notes) !== null && _d !== void 0 ? _d : null,
                            scrapReasonId: args.type === "Scrap" ? ((_e = args.scrapReasonId) !== null && _e !== void 0 ? _e : null) : null,
                            employeeId: args.employeeId,
                            createdBy: args.createdBy,
                            paymentYear: (_f = args.paymentYear) !== null && _f !== void 0 ? _f : null,
                            paymentMonth: (_g = args.paymentMonth) !== null && _g !== void 0 ? _g : null
                        }))
                            .select("*")];
            }
        });
    });
}
function insertReworkQuantity(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            return [2 /*return*/, createReportAndQuantity(client, {
                    type: "Rework",
                    companyId: data.companyId,
                    jobOperationId: data.jobOperationId,
                    employeeId: data.employeeId,
                    createdBy: data.createdBy,
                    quantity: data.quantity,
                    notes: (_a = data.notes) !== null && _a !== void 0 ? _a : null
                })];
        });
    });
}
function insertProductionQuantity(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            return [2 /*return*/, createReportAndQuantity(client, {
                    type: "Production",
                    companyId: data.companyId,
                    jobOperationId: data.jobOperationId,
                    employeeId: data.employeeId,
                    createdBy: data.createdBy,
                    quantity: data.quantity,
                    notes: (_a = data.notes) !== null && _a !== void 0 ? _a : null,
                    paymentYear: data.paymentYear,
                    paymentMonth: data.paymentMonth
                })];
        });
    });
}
function insertScrapQuantity(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            return [2 /*return*/, createReportAndQuantity(client, {
                    type: "Scrap",
                    companyId: data.companyId,
                    jobOperationId: data.jobOperationId,
                    employeeId: data.employeeId,
                    createdBy: data.createdBy,
                    quantity: data.quantity,
                    notes: (_a = data.notes) !== null && _a !== void 0 ? _a : null,
                    scrapReasonId: data.scrapReasonId
                })];
        });
    });
}
function endProductionEvent(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionEvent")
                    .update({ endTime: data.endTime, updatedBy: data.employeeId })
                    .eq("id", data.id)
                    .select("*")];
        });
    });
}
function endProductionEventsForJobOperation(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionEvent")
                    .update({ endTime: new Date().toISOString(), updatedBy: args.employeeId })
                    .eq("jobOperationId", args.jobOperationId)
                    .is("endTime", null)
                    .eq("employeeId", args.employeeId)
                    .eq("companyId", args.companyId)];
        });
    });
}
function endProductionEvents(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionEvent")
                    .update({
                    endTime: args.endTime
                })
                    .is("endTime", null)
                    .eq("employeeId", args.employeeId)
                    .eq("companyId", args.companyId)];
        });
    });
}
function endProductionEventsByWorkCenter(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("productionEvent")
                    .update({
                    endTime: args.endTime
                })
                    .is("endTime", null)
                    .eq("workCenterId", args.workCenterId)
                    .eq("companyId", args.companyId)];
        });
    });
}
function startProductionEvent(client, data, trackedEntityId) {
    return __awaiter(this, void 0, void 0, function () {
        var activityId, _a, eventInsert, operation, trackedActivityInsert, trackedActivityOutputInsert;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!trackedEntityId) return [3 /*break*/, 4];
                    activityId = (0, nanoid_1.nanoid)();
                    return [4 /*yield*/, Promise.all([
                            client.from("productionEvent").insert(data).select("id").single(),
                            client
                                .from("jobOperation")
                                .select("*")
                                .eq("id", data.jobOperationId)
                                .single()
                        ])];
                case 1:
                    _a = _f.sent(), eventInsert = _a[0], operation = _a[1];
                    if (eventInsert.error)
                        return [2 /*return*/, eventInsert];
                    if (operation.error)
                        return [2 /*return*/, operation];
                    return [4 /*yield*/, client
                            .from("trackedActivity")
                            .insert({
                            id: activityId,
                            type: "".concat((_b = operation.data) === null || _b === void 0 ? void 0 : _b.description, " (").concat(data.type, ")"),
                            sourceDocument: "Production Event",
                            sourceDocumentId: (_c = eventInsert.data) === null || _c === void 0 ? void 0 : _c.id,
                            attributes: {
                                Job: (_d = operation.data) === null || _d === void 0 ? void 0 : _d.jobId,
                                "Job Operation": data.jobOperationId,
                                "Production Event": (_e = eventInsert.data) === null || _e === void 0 ? void 0 : _e.id,
                                "Work Center": data.workCenterId,
                                Employee: data.employeeId
                            },
                            companyId: data.companyId,
                            createdBy: data.createdBy
                        })
                            .select("id")
                            .single()];
                case 2:
                    trackedActivityInsert = _f.sent();
                    if (trackedActivityInsert.error) {
                        console.error(trackedActivityInsert.error);
                        return [2 /*return*/, trackedActivityInsert];
                    }
                    return [4 /*yield*/, client
                            .from("trackedActivityOutput")
                            .insert({
                            trackedActivityId: activityId,
                            trackedEntityId: trackedEntityId,
                            quantity: 1,
                            companyId: data.companyId,
                            createdBy: data.createdBy
                        })];
                case 3:
                    trackedActivityOutputInsert = _f.sent();
                    if (trackedActivityOutputInsert.error) {
                        console.error(trackedActivityOutputInsert.error);
                        return [2 /*return*/, trackedActivityOutputInsert];
                    }
                    return [2 /*return*/, eventInsert];
                case 4: return [2 /*return*/, client.from("productionEvent").insert(data).select("*")];
            }
        });
    });
}
function arrayToTree(items) {
    var rootItems = [];
    var lookup = {};
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var itemId = item.methodMaterialId;
        var parentId = item.parentMaterialId;
        if (!Object.prototype.hasOwnProperty.call(lookup, itemId)) {
            // @ts-expect-error - building tree incrementally
            lookup[itemId] = { id: itemId, children: [] };
        }
        lookup[itemId].data = item;
        var treeItem = lookup[itemId];
        if (parentId === null || parentId === undefined) {
            rootItems.push(treeItem);
        }
        else {
            if (!Object.prototype.hasOwnProperty.call(lookup, parentId)) {
                // @ts-expect-error - building tree incrementally
                lookup[parentId] = { id: parentId, children: [] };
            }
            lookup[parentId].children.push(treeItem);
        }
    }
    return rootItems;
}
/**
 * Fetches the job method tree and generates BOM IDs.
 * Returns a map of methodMaterialId to hierarchical BOM ID (e.g., "1.2.3").
 */
function getJobMethodBomIdMap(client, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, tree, flatMethods, bomIds, bomIdMap;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.rpc("get_job_method", { jid: jobId })];
                case 1:
                    result = _b.sent();
                    if (result.error || !((_a = result.data) === null || _a === void 0 ? void 0 : _a.length)) {
                        return [2 /*return*/, new Map()];
                    }
                    tree = arrayToTree(result.data);
                    if (tree.length === 0) {
                        return [2 /*return*/, new Map()];
                    }
                    flatMethods = (0, utils_1.flattenTree)(tree[0]);
                    bomIds = (0, utils_1.generateBomIds)(flatMethods);
                    bomIdMap = new Map();
                    flatMethods.forEach(function (node, index) {
                        bomIdMap.set(node.data.methodMaterialId, bomIds[index]);
                    });
                    return [2 /*return*/, bomIdMap];
            }
        });
    });
}
