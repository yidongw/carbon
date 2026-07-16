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
exports.mapBalloonIdsToFeatureIdsForDocument = void 0;
exports.activateGauge = activateGauge;
exports.deactivateGauge = deactivateGauge;
exports.deleteGauge = deleteGauge;
exports.deleteGaugeCalibrationRecord = deleteGaugeCalibrationRecord;
exports.deleteGaugeType = deleteGaugeType;
exports.deleteIssue = deleteIssue;
exports.deleteIssueAssociation = deleteIssueAssociation;
exports.deleteIssueType = deleteIssueType;
exports.deleteIssueWorkflow = deleteIssueWorkflow;
exports.deleteRequiredAction = deleteRequiredAction;
exports.deleteQualityDocument = deleteQualityDocument;
exports.deleteQualityDocumentStep = deleteQualityDocumentStep;
exports.deleteRisk = deleteRisk;
exports.getIssueFromExternalLink = getIssueFromExternalLink;
exports.getGauge = getGauge;
exports.getGauges = getGauges;
exports.getGaugesList = getGaugesList;
exports.getGaugeCalibrationRecord = getGaugeCalibrationRecord;
exports.getGaugeCalibrationRecords = getGaugeCalibrationRecords;
exports.getGaugeCalibrationRecordsByGaugeId = getGaugeCalibrationRecordsByGaugeId;
exports.getGaugeTypesList = getGaugeTypesList;
exports.getGaugeType = getGaugeType;
exports.getGaugeTypes = getGaugeTypes;
exports.getIssue = getIssue;
exports.getIssues = getIssues;
exports.getIssueWorkflow = getIssueWorkflow;
exports.getIssueAction = getIssueAction;
exports.getIssueActionTasks = getIssueActionTasks;
exports.getIssueApprovalTasks = getIssueApprovalTasks;
exports.getIssueItems = getIssueItems;
exports.getIssueAssociations = getIssueAssociations;
exports.getIssueReviewers = getIssueReviewers;
exports.getIssueSuppliers = getIssueSuppliers;
exports.getIssueTasks = getIssueTasks;
exports.getIssueType = getIssueType;
exports.getIssueTypes = getIssueTypes;
exports.getIssueWorkflows = getIssueWorkflows;
exports.getIssueWorkflowsList = getIssueWorkflowsList;
exports.getIssueTypesList = getIssueTypesList;
exports.getQualityActions = getQualityActions;
exports.getQualityDocument = getQualityDocument;
exports.getQualityDocumentSteps = getQualityDocumentSteps;
exports.getQualityDocumentVersions = getQualityDocumentVersions;
exports.getQualityDocuments = getQualityDocuments;
exports.getQualityDocumentsList = getQualityDocumentsList;
exports.getQualityFiles = getQualityFiles;
exports.getRequiredActionsList = getRequiredActionsList;
exports.getRequiredActions = getRequiredActions;
exports.getRequiredAction = getRequiredAction;
exports.getRisk = getRisk;
exports.getRisks = getRisks;
exports.insertIssueReviewer = insertIssueReviewer;
exports.updateIssueActionProcesses = updateIssueActionProcesses;
exports.updateIssueStatus = updateIssueStatus;
exports.updateIssueTaskStatus = updateIssueTaskStatus;
exports.updateIssueTaskContent = updateIssueTaskContent;
exports.updateQualityDocumentStepOrder = updateQualityDocumentStepOrder;
exports.updateRiskStatus = updateRiskStatus;
exports.insertGauge = insertGauge;
exports.updateGauge = updateGauge;
exports.upsertGauge = upsertGauge;
exports.upsertGaugeCalibrationRecord = upsertGaugeCalibrationRecord;
exports.upsertGaugeType = upsertGaugeType;
exports.insertIssue = insertIssue;
exports.updateIssue = updateIssue;
exports.upsertIssue = upsertIssue;
exports.upsertIssueWorkflow = upsertIssueWorkflow;
exports.upsertIssueType = upsertIssueType;
exports.upsertRequiredAction = upsertRequiredAction;
exports.upsertQualityDocument = upsertQualityDocument;
exports.upsertQualityDocumentStep = upsertQualityDocumentStep;
exports.upsertRisk = upsertRisk;
exports.getInspectionDocuments = getInspectionDocuments;
exports.getInspectionDocument = getInspectionDocument;
exports.upsertInspectionDocument = upsertInspectionDocument;
exports.deleteInspectionDocument = deleteInspectionDocument;
exports.getInspectionFeatures = getInspectionFeatures;
exports.getBalloons = getBalloons;
exports.getInspectionPlan = getInspectionPlan;
exports.saveInspectionDocumentAtomic = saveInspectionDocumentAtomic;
exports.getItemSamplingPlan = getItemSamplingPlan;
exports.upsertItemSamplingPlan = upsertItemSamplingPlan;
exports.getInboundInspections = getInboundInspections;
exports.getInboundInspection = getInboundInspection;
exports.getInboundInspectionLotTrackedEntities = getInboundInspectionLotTrackedEntities;
var database_1 = require("@carbon/database");
var date_1 = require("@internationalized/date");
var query_1 = require("~/utils/query");
var supabase_1 = require("~/utils/supabase");
var inspectionDocumentDb_1 = require("./inspectionDocumentDb");
Object.defineProperty(exports, "mapBalloonIdsToFeatureIdsForDocument", { enumerable: true, get: function () { return inspectionDocumentDb_1.mapBalloonIdsToFeatureIdsForDocument; } });
function activateGauge(client, gaugeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("gauges")
                    .update({ gaugeStatus: "Active" })
                    .eq("id", gaugeId)];
        });
    });
}
function deactivateGauge(client, gaugeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("gauges")
                    .update({ gaugeStatus: "Inactive" })
                    .eq("id", gaugeId)];
        });
    });
}
function deleteGauge(client, gaugeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("gauges").delete().eq("id", gaugeId)];
        });
    });
}
function deleteGaugeCalibrationRecord(client, gaugeCalibrationRecordId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("gaugeCalibrationRecord")
                    .delete()
                    .eq("id", gaugeCalibrationRecordId)];
        });
    });
}
function deleteGaugeType(client, gaugeTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("gaugeType").delete().eq("id", gaugeTypeId)];
        });
    });
}
function deleteIssue(client, nonConformanceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("nonConformance").delete().eq("id", nonConformanceId)];
        });
    });
}
function deleteIssueAssociation(client, type, associationId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = type;
                    switch (_a) {
                        case "items": return [3 /*break*/, 1];
                        case "customers": return [3 /*break*/, 3];
                        case "suppliers": return [3 /*break*/, 5];
                        case "jobOperations": return [3 /*break*/, 7];
                        case "purchaseOrderLines": return [3 /*break*/, 9];
                        case "salesOrderLines": return [3 /*break*/, 11];
                        case "shipmentLines": return [3 /*break*/, 13];
                        case "receiptLines": return [3 /*break*/, 15];
                        case "trackedEntities": return [3 /*break*/, 17];
                        case "inboundInspections": return [3 /*break*/, 19];
                    }
                    return [3 /*break*/, 21];
                case 1: return [4 /*yield*/, client
                        .from("nonConformanceItem")
                        .delete()
                        .eq("id", associationId)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: return [4 /*yield*/, client
                        .from("nonConformanceCustomer")
                        .delete()
                        .eq("id", associationId)];
                case 4: return [2 /*return*/, _b.sent()];
                case 5: return [4 /*yield*/, client
                        .from("nonConformanceSupplier")
                        .delete()
                        .eq("id", associationId)];
                case 6: return [2 /*return*/, _b.sent()];
                case 7: return [4 /*yield*/, client
                        .from("nonConformanceJobOperation")
                        .delete()
                        .eq("id", associationId)];
                case 8: return [2 /*return*/, _b.sent()];
                case 9: return [4 /*yield*/, client
                        .from("nonConformancePurchaseOrderLine")
                        .delete()
                        .eq("id", associationId)];
                case 10: return [2 /*return*/, _b.sent()];
                case 11: return [4 /*yield*/, client
                        .from("nonConformanceSalesOrderLine")
                        .delete()
                        .eq("id", associationId)];
                case 12: return [2 /*return*/, _b.sent()];
                case 13: return [4 /*yield*/, client
                        .from("nonConformanceShipmentLine")
                        .delete()
                        .eq("id", associationId)];
                case 14: return [2 /*return*/, _b.sent()];
                case 15: return [4 /*yield*/, client
                        .from("nonConformanceReceiptLine")
                        .delete()
                        .eq("id", associationId)];
                case 16: return [2 /*return*/, _b.sent()];
                case 17: return [4 /*yield*/, client
                        .from("nonConformanceTrackedEntity")
                        .delete()
                        .eq("id", associationId)];
                case 18: return [2 /*return*/, _b.sent()];
                case 19: return [4 /*yield*/, client
                        .from("nonConformanceInboundInspection")
                        .delete()
                        .eq("id", associationId)];
                case 20: return [2 /*return*/, _b.sent()];
                case 21: throw new Error("Invalid type: ".concat(type));
            }
        });
    });
}
function deleteIssueType(client, nonConformanceTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceType")
                    .delete()
                    .eq("id", nonConformanceTypeId)];
        });
    });
}
function deleteIssueWorkflow(client, nonConformanceWorkflowId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceWorkflow")
                    .update({ active: false })
                    .eq("id", nonConformanceWorkflowId)];
        });
    });
}
function deleteRequiredAction(client, requiredActionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceRequiredAction")
                    .delete()
                    .eq("id", requiredActionId)];
        });
    });
}
function deleteQualityDocument(client, qualityDocumentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("qualityDocument").delete().eq("id", qualityDocumentId)];
        });
    });
}
function deleteQualityDocumentStep(client, qualityDocumentStepId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("qualityDocumentStep")
                    .delete()
                    .eq("id", qualityDocumentStepId)
                    .eq("companyId", companyId)];
        });
    });
}
function deleteRisk(client, riskId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("riskRegister").delete().eq("id", riskId)];
        });
    });
}
function getIssueFromExternalLink(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceSupplier")
                    .select("*, nonConformance(*)")
                    .eq("id", id)
                    .single()];
        });
    });
}
function getGauge(client, gaugeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("gauges").select("*").eq("id", gaugeId).single()];
        });
    });
}
function getGauges(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("gauges")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("gaugeId.ilike.%".concat(args.search, "%,description.ilike.%").concat(args.search, "%,modelNumber.ilike.%").concat(args.search, "%,serialNumber.ilike.%").concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "gaugeId", ascending: false }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getGaugesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "gauge", "id, name:gaugeId, description", function (query) {
                    return query.eq("companyId", companyId);
                })];
        });
    });
}
function getGaugeCalibrationRecord(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("gaugeCalibrationRecords")
                    .select("*")
                    .eq("id", id)
                    .single()];
        });
    });
}
function getGaugeCalibrationRecords(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("gaugeCalibrationRecords")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("gaugeId.ilike.%".concat(args.search, "%,description.ilike.%").concat(args.search, "%,modelNumber.ilike.%").concat(args.search, "%,serialNumber.ilike.%").concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "createdAt", ascending: false },
                    { column: "dateCalibrated", ascending: false }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getGaugeCalibrationRecordsByGaugeId(client, gaugeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("gaugeCalibrationRecords")
                    .select("*")
                    .eq("gaugeId", gaugeId)
                    .order("createdAt", { ascending: false })];
        });
    });
}
function getGaugeTypesList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("gaugeType")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getGaugeType(client, gaugeTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("gaugeType").select("*").eq("id", gaugeTypeId).single()];
        });
    });
}
function getGaugeTypes(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("gaugeType")
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
function getIssue(client, nonConformanceId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformance")
                    .select("*")
                    .eq("id", nonConformanceId)
                    .single()];
        });
    });
}
function getIssues(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("issues")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("nonConformanceId.ilike.%".concat(args.search, "%,name.ilike.%").concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "nonConformanceId", ascending: false }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getIssueWorkflow(client, nonConformanceWorkflowId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceWorkflow")
                    .select("*")
                    .eq("id", nonConformanceWorkflowId)
                    .single()];
        });
    });
}
function getIssueAction(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceActionTask")
                    .select("id,notes,nonConformanceId,nonConformance(id,nonConformanceId)")
                    .eq("id", id)
                    .single()];
        });
    });
}
function getIssueActionTasks(client, id, companyId, supplierId) {
    return __awaiter(this, void 0, void 0, function () {
        var query, result, taskIds, linearMappings, jiraMappings, _a, linearData, jiraData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = client
                        .from("nonConformanceActionTask")
                        .select("*, ...nonConformanceRequiredAction(name), nonConformanceActionProcess(processId, ...process(name)), supplier(name)")
                        .eq("nonConformanceId", id)
                        .eq("companyId", companyId);
                    if (supplierId) {
                        query = query.eq("supplierId", supplierId);
                    }
                    return [4 /*yield*/, query];
                case 1:
                    result = _b.sent();
                    if (result.error || !result.data) {
                        return [2 /*return*/, result];
                    }
                    taskIds = result.data.map(function (t) { return t.id; });
                    linearMappings = new Map();
                    jiraMappings = new Map();
                    if (!(taskIds.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("externalIntegrationMapping")
                                .select("entityId, metadata")
                                .eq("entityType", "nonConformanceActionTask")
                                .eq("integration", "linear")
                                .in("entityId", taskIds),
                            client
                                .from("externalIntegrationMapping")
                                .select("entityId, metadata")
                                .eq("entityType", "nonConformanceActionTask")
                                .eq("integration", "jira")
                                .in("entityId", taskIds)
                        ])];
                case 2:
                    _a = _b.sent(), linearData = _a[0].data, jiraData = _a[1].data;
                    linearMappings = new Map((linearData !== null && linearData !== void 0 ? linearData : []).map(function (m) { return [m.entityId, m.metadata]; }));
                    jiraMappings = new Map((jiraData !== null && jiraData !== void 0 ? jiraData : []).map(function (m) { return [m.entityId, m.metadata]; }));
                    _b.label = 3;
                case 3: return [2 /*return*/, __assign(__assign({}, result), { data: result.data.map(function (task) {
                            var _a, _b;
                            return (__assign(__assign({}, task), { linearIssue: (_a = linearMappings.get(task.id)) !== null && _a !== void 0 ? _a : null, jiraIssue: (_b = jiraMappings.get(task.id)) !== null && _b !== void 0 ? _b : null }));
                        }) })];
            }
        });
    });
}
function getIssueApprovalTasks(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceApprovalTask")
                    .select("*")
                    .eq("nonConformanceId", id)
                    .eq("companyId", companyId)
                    .order("approvalType", { ascending: true })];
        });
    });
}
function getIssueItems(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceItem")
                    .select("*, ...item(name)")
                    .eq("nonConformanceId", id)
                    .eq("companyId", companyId)
                    .order("createdAt", { ascending: true })];
        });
    });
}
function getIssueAssociations(client, nonConformanceId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, items, jobOperations, jobsFromSteps, purchaseOrderLines, salesOrderLines, shipmentLines, receiptLines, trackedEntities, customers, suppliers, inboundInspections;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        // Items
                        client
                            .from("nonConformanceItem")
                            .select("\n      id,\n      itemId,\n      disposition,\n      quantity,\n      createdAt,\n      ...item(\n        readableIdWithRevision\n      ),\n      links:nonConformanceItemTrackedEntity(\n        id,\n        quantity,\n        trackedEntityId,\n        trackedEntity(\n          id,\n          readableId,\n          status,\n          quantity,\n          attributes\n        )\n      )\n      ")
                            .eq("nonConformanceId", nonConformanceId)
                            .eq("companyId", companyId)
                            .order("createdAt", { ascending: true }),
                        // Job Operations
                        client
                            .from("nonConformanceJobOperation")
                            .select("\n        id,\n        jobOperationId,\n        jobId,\n        jobReadableId,\n        jobOperation (\n          id,\n          process (\n            name\n          )\n        )\n      ")
                            .eq("nonConformanceId", nonConformanceId)
                            .eq("companyId", companyId),
                        client
                            .from("jobOperationStep")
                            .select("\n        id,\n        nonConformanceActionTask!inner (\n          nonConformanceId\n        ),\n        jobOperation!inner (\n          id,\n          jobId,\n          job!inner (\n            id,\n            jobId\n          ),\n          process (\n            name\n          )\n        )\n      ")
                            .eq("nonConformanceActionTask.nonConformanceId", nonConformanceId)
                            .eq("companyId", companyId),
                        // Purchase Order Lines
                        client
                            .from("nonConformancePurchaseOrderLine")
                            .select("\n        id,\n        purchaseOrderLineId,\n        purchaseOrderId,\n        purchaseOrderReadableId\n      ")
                            .eq("nonConformanceId", nonConformanceId)
                            .eq("companyId", companyId),
                        // Sales Order Lines
                        client
                            .from("nonConformanceSalesOrderLine")
                            .select("\n        id,\n        salesOrderLineId,\n        salesOrderId,\n        salesOrderReadableId\n      ")
                            .eq("nonConformanceId", nonConformanceId)
                            .eq("companyId", companyId),
                        // Shipment Lines
                        client
                            .from("nonConformanceShipmentLine")
                            .select("\n        id,\n        shipmentLineId,\n        shipmentId,\n        shipmentReadableId\n      ")
                            .eq("nonConformanceId", nonConformanceId)
                            .eq("companyId", companyId),
                        // Receipt Lines
                        client
                            .from("nonConformanceReceiptLine")
                            .select("\n        id,\n        receiptLineId,\n        receiptId,\n        receiptReadableId\n      ")
                            .eq("nonConformanceId", nonConformanceId)
                            .eq("companyId", companyId),
                        // Tracked Entities
                        client
                            .from("nonConformanceTrackedEntity")
                            .select("\n        id,\n        trackedEntityId,\n        trackedEntity:trackedEntity (\n          id,\n          readableId\n        )\n      ")
                            .eq("nonConformanceId", nonConformanceId)
                            .eq("companyId", companyId),
                        // Customers
                        client
                            .from("nonConformanceCustomer")
                            .select("\n        id,\n        customerId,\n        customer:customer (\n          id,\n          name\n        )\n      ")
                            .eq("nonConformanceId", nonConformanceId)
                            .eq("companyId", companyId),
                        // Suppliers
                        client
                            .from("nonConformanceSupplier")
                            .select("\n        id,\n        supplierId,\n        supplier:supplier (\n          id,\n          name\n        )\n      ")
                            .eq("nonConformanceId", nonConformanceId)
                            .eq("companyId", companyId),
                        // Inbound Inspections
                        client
                            .from("nonConformanceInboundInspection")
                            .select("\n        id,\n        inboundInspectionId,\n        inboundInspection:inboundInspection (\n          id,\n          inboundInspectionId,\n          itemReadableId,\n          lotSize,\n          status,\n          sampleSize,\n          acceptanceNumber\n        )\n      ")
                            .eq("nonConformanceId", nonConformanceId)
                            .eq("companyId", companyId)
                    ])];
                case 1:
                    _a = _o.sent(), items = _a[0], jobOperations = _a[1], jobsFromSteps = _a[2], purchaseOrderLines = _a[3], salesOrderLines = _a[4], shipmentLines = _a[5], receiptLines = _a[6], trackedEntities = _a[7], customers = _a[8], suppliers = _a[9], inboundInspections = _a[10];
                    return [2 /*return*/, {
                            items: ((_b = items.data) === null || _b === void 0 ? void 0 : _b.map(function (item) {
                                var _a;
                                return ({
                                    type: "items",
                                    id: item.id,
                                    documentId: item.itemId,
                                    documentReadableId: item.readableIdWithRevision || "",
                                    documentLineId: "",
                                    disposition: item.disposition,
                                    quantity: item.quantity,
                                    createdAt: item.createdAt,
                                    links: (_a = item.links) !== null && _a !== void 0 ? _a : []
                                });
                            })) || [],
                            jobOperations: __spreadArray(__spreadArray([], (((_c = jobOperations.data) === null || _c === void 0 ? void 0 : _c.map(function (item) {
                                var _a, _b, _c;
                                return ({
                                    type: "jobOperations",
                                    id: item.id,
                                    documentId: (_a = item.jobId) !== null && _a !== void 0 ? _a : "",
                                    documentLineId: item.jobOperationId,
                                    documentReadableId: "".concat(item.jobReadableId || "", " - ").concat(((_c = (_b = item.jobOperation) === null || _b === void 0 ? void 0 : _b.process) === null || _c === void 0 ? void 0 : _c.name) || "")
                                });
                            })) || []), true), (((_d = jobsFromSteps.data) === null || _d === void 0 ? void 0 : _d.map(function (step) {
                                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                                return ({
                                    type: "jobOperationsInspection",
                                    id: step.id,
                                    documentId: (_c = (_b = (_a = step.jobOperation) === null || _a === void 0 ? void 0 : _a.job) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : "",
                                    documentLineId: (_e = (_d = step.jobOperation) === null || _d === void 0 ? void 0 : _d.id) !== null && _e !== void 0 ? _e : "",
                                    documentReadableId: "".concat(((_g = (_f = step.jobOperation) === null || _f === void 0 ? void 0 : _f.job) === null || _g === void 0 ? void 0 : _g.jobId) || "", " - ").concat(((_j = (_h = step.jobOperation) === null || _h === void 0 ? void 0 : _h.process) === null || _j === void 0 ? void 0 : _j.name) || "")
                                });
                            })) || []), true),
                            purchaseOrderLines: ((_e = purchaseOrderLines.data) === null || _e === void 0 ? void 0 : _e.map(function (item) {
                                var _a;
                                return ({
                                    id: item.id,
                                    type: "purchaseOrderLines",
                                    documentId: (_a = item.purchaseOrderId) !== null && _a !== void 0 ? _a : "",
                                    documentLineId: item.purchaseOrderLineId,
                                    documentReadableId: item.purchaseOrderReadableId || ""
                                });
                            })) || [],
                            salesOrderLines: ((_f = salesOrderLines.data) === null || _f === void 0 ? void 0 : _f.map(function (item) {
                                var _a;
                                return ({
                                    id: item.id,
                                    type: "salesOrderLines",
                                    documentId: (_a = item.salesOrderId) !== null && _a !== void 0 ? _a : "",
                                    documentLineId: item.salesOrderLineId,
                                    documentReadableId: item.salesOrderReadableId || ""
                                });
                            })) || [],
                            shipmentLines: ((_g = shipmentLines.data) === null || _g === void 0 ? void 0 : _g.map(function (item) {
                                var _a;
                                return ({
                                    id: item.id,
                                    type: "shipmentLines",
                                    documentId: (_a = item.shipmentId) !== null && _a !== void 0 ? _a : "",
                                    documentLineId: item.shipmentLineId,
                                    documentReadableId: item.shipmentReadableId || ""
                                });
                            })) || [],
                            receiptLines: ((_h = receiptLines.data) === null || _h === void 0 ? void 0 : _h.map(function (item) {
                                var _a;
                                return ({
                                    id: item.id,
                                    type: "receiptLines",
                                    documentId: (_a = item.receiptId) !== null && _a !== void 0 ? _a : "",
                                    documentLineId: item.receiptLineId,
                                    documentReadableId: item.receiptReadableId || ""
                                });
                            })) || [],
                            trackedEntities: ((_j = trackedEntities.data) === null || _j === void 0 ? void 0 : _j.map(function (item) {
                                var _a, _b, _c, _d;
                                return ({
                                    id: item.id,
                                    type: "trackedEntities",
                                    documentId: (_a = item.trackedEntityId) !== null && _a !== void 0 ? _a : "",
                                    documentLineId: "",
                                    documentReadableId: (_d = (_c = (_b = item.trackedEntity) === null || _b === void 0 ? void 0 : _b.readableId) !== null && _c !== void 0 ? _c : item.trackedEntityId) !== null && _d !== void 0 ? _d : ""
                                });
                            })) || [],
                            customers: ((_k = customers.data) === null || _k === void 0 ? void 0 : _k.map(function (c) {
                                var _a;
                                return ({
                                    id: c.id,
                                    type: "customers",
                                    documentId: (_a = c.customerId) !== null && _a !== void 0 ? _a : "",
                                    documentLineId: "",
                                    documentReadableId: c.customer.name
                                });
                            })) || [],
                            suppliers: ((_l = suppliers.data) === null || _l === void 0 ? void 0 : _l.map(function (item) {
                                var _a;
                                return ({
                                    id: item.id,
                                    type: "suppliers",
                                    documentId: (_a = item.supplierId) !== null && _a !== void 0 ? _a : "",
                                    documentLineId: "",
                                    documentReadableId: item.supplier.name
                                });
                            })) || [],
                            inboundInspections: ((_m = inboundInspections === null || inboundInspections === void 0 ? void 0 : inboundInspections.data) !== null && _m !== void 0 ? _m : []).map(function (link) {
                                var _a, _b, _c, _d, _e, _f, _g;
                                return ({
                                    id: link.id,
                                    type: "inboundInspections",
                                    documentId: (_a = link.inboundInspectionId) !== null && _a !== void 0 ? _a : "",
                                    documentLineId: "",
                                    documentReadableId: (_c = (_b = link.inboundInspection) === null || _b === void 0 ? void 0 : _b.inboundInspectionId) !== null && _c !== void 0 ? _c : "",
                                    quantity: (_e = (_d = link.inboundInspection) === null || _d === void 0 ? void 0 : _d.lotSize) !== null && _e !== void 0 ? _e : 0,
                                    status: (_g = (_f = link.inboundInspection) === null || _f === void 0 ? void 0 : _f.status) !== null && _g !== void 0 ? _g : null
                                });
                            })
                        }];
            }
        });
    });
}
function getIssueReviewers(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceReviewer")
                    .select("*")
                    .eq("nonConformanceId", id)
                    .eq("companyId", companyId)
                    .order("id", { ascending: true })];
        });
    });
}
function getIssueSuppliers(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceSupplier")
                    .select("supplierId, externalLinkId")
                    .eq("nonConformanceId", id)
                    .eq("companyId", companyId)
                    .order("id", { ascending: true })];
        });
    });
}
function getIssueTasks(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, Promise.all([
                    client
                        .from("nonConformanceActionTask")
                        .select("*")
                        .eq("nonConformanceId", id)
                        .eq("companyId", companyId)
                        .order("createdAt", { ascending: true }),
                    client
                        .from("nonConformanceApprovalTask")
                        .select("*")
                        .eq("nonConformanceId", id)
                        .eq("companyId", companyId)
                        .order("approvalType", { ascending: true })
                ])];
        });
    });
}
function getIssueType(client, nonConformanceTypeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceType")
                    .select("*")
                    .eq("id", nonConformanceTypeId)
                    .single()];
        });
    });
}
function getIssueTypes(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("nonConformanceType")
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
function getIssueWorkflows(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("nonConformanceWorkflow")
                .select("*", { count: "exact" })
                .eq("companyId", companyId)
                .eq("active", true);
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
function getIssueWorkflowsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceWorkflow")
                    .select("*")
                    .eq("companyId", companyId)
                    .eq("active", true)
                    .order("name")];
        });
    });
}
function getIssueTypesList(client, companyId) {
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
function getQualityActions(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("qualityActions")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("readableNonConformanceId.ilike.%".concat(args.search, "%,nonConformanceName.ilike.%").concat(args.search, "%,name.ilike.%").concat(args.search, "%,description.ilike.%").concat(args.search, "%"));
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
function getQualityDocument(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("qualityDocument")
                    .select("*, qualityDocumentStep(*)")
                    .eq("id", id)
                    .single()];
        });
    });
}
function getQualityDocumentSteps(client, qualityDocumentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("qualityDocumentStep")
                    .select("*")
                    .eq("qualityDocumentId", qualityDocumentId)];
        });
    });
}
function getQualityDocumentVersions(client, qualityDocument, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("qualityDocument")
                    .select("*")
                    .eq("name", qualityDocument.name)
                    .eq("companyId", companyId)
                    .neq("version", qualityDocument.version)
                    .order("version", { ascending: false })];
        });
    });
}
function getQualityDocuments(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("qualityDocuments")
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
function getQualityDocumentsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, database_1.fetchAllFromTable)(client, "qualityDocument", "id, name, version, processId, status", function (query) {
                    return query
                        .eq("companyId", companyId)
                        .order("name", { ascending: true })
                        .order("version", { ascending: false });
                })];
        });
    });
}
function getQualityFiles(client, id, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.storage
                        .from("private")
                        .list("".concat(companyId, "/quality/").concat(id))];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.data || []];
            }
        });
    });
}
function getRequiredActionsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceRequiredAction")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .eq("active", true)
                    .order("name")];
        });
    });
}
function getRequiredActions(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("nonConformanceRequiredAction")
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
function getRequiredAction(client, requiredActionId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("nonConformanceRequiredAction")
                    .select("*")
                    .eq("id", requiredActionId)
                    .single()];
        });
    });
}
function getRisk(client, riskId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("riskRegister").select("*").eq("id", riskId).single()];
        });
    });
}
function getRisks(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("riskRegisters")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("title.ilike.%".concat(args.search, "%,description.ilike.%").concat(args.search, "%"));
            }
            if ((args === null || args === void 0 ? void 0 : args.status) && args.status.length > 0) {
                query = query.in("status", args.status);
            }
            if ((args === null || args === void 0 ? void 0 : args.source) && args.source.length > 0) {
                query = query.in("source", args.source);
            }
            if ((args === null || args === void 0 ? void 0 : args.assignee) && args.assignee.length > 0) {
                query = query.in("assignee", args.assignee);
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
function insertIssueReviewer(client, reviewer) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("nonConformanceReviewer").insert(reviewer)];
        });
    });
}
function updateIssueActionProcesses(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var actionTaskId, processIds, companyId, createdBy, deleteResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    actionTaskId = args.actionTaskId, processIds = args.processIds, companyId = args.companyId, createdBy = args.createdBy;
                    return [4 /*yield*/, client
                            .from("nonConformanceActionProcess")
                            .delete()
                            .eq("actionTaskId", actionTaskId)];
                case 1:
                    deleteResult = _a.sent();
                    if (deleteResult.error) {
                        return [2 /*return*/, deleteResult];
                    }
                    // Insert new process associations
                    if (processIds.length > 0) {
                        return [2 /*return*/, client.from("nonConformanceActionProcess").insert(processIds.map(function (processId) { return ({
                                actionTaskId: actionTaskId,
                                processId: processId,
                                companyId: companyId,
                                createdBy: createdBy
                            }); }))];
                    }
                    else {
                        return [2 /*return*/, deleteResult];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function updateIssueStatus(client, update) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("nonConformance").update(update).eq("id", update.id)];
        });
    });
}
function updateIssueTaskStatus(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var id, status, type, userId, assignee, table, finalAssignee, updateData;
        return __generator(this, function (_a) {
            id = args.id, status = args.status, type = args.type, userId = args.userId, assignee = args.assignee;
            table = type === "action" || type === "investigation"
                ? "nonConformanceActionTask"
                : type === "review"
                    ? "nonConformanceReviewer"
                    : "nonConformanceApprovalTask";
            finalAssignee = assignee || userId;
            updateData = {
                status: status,
                updatedBy: userId,
                assignee: finalAssignee
            };
            if (status === "Completed") {
                // @ts-expect-error
                updateData.completedDate = new Date().toISOString().split("T")[0];
            }
            return [2 /*return*/, client
                    .from(table)
                    .update(updateData)
                    .eq("id", id)
                    .select("nonConformanceId")
                    .single()];
        });
    });
}
function updateIssueTaskContent(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var id, content, type, table;
        return __generator(this, function (_a) {
            id = args.id, content = args.content, type = args.type;
            table = type === "action"
                ? "nonConformanceActionTask"
                : type === "review"
                    ? "nonConformanceReviewer"
                    : "nonConformanceApprovalTask";
            return [2 /*return*/, client
                    .from(table)
                    .update({ notes: content })
                    .eq("id", id)
                    .select("nonConformanceId")
                    .single()];
        });
    });
}
function updateQualityDocumentStepOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                return client
                    .from("qualityDocumentStep")
                    .update({ sortOrder: sortOrder, updatedBy: updatedBy })
                    .eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
function updateRiskStatus(client, riskId, status) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("riskRegister").update({ status: status }).eq("id", riskId)];
        });
    });
}
function insertGauge(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var gaugeId, seq, gauge;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    if (!input.gaugeId) return [3 /*break*/, 1];
                    gaugeId = input.gaugeId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "gauge",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _m.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_a = seq.error) !== null && _a !== void 0 ? _a : {
                                    message: "Failed to generate gauge sequence"
                                }
                            }];
                    }
                    gaugeId = seq.data;
                    _m.label = 3;
                case 3: return [4 /*yield*/, client
                        .from("gauges")
                        .insert({
                        gaugeId: gaugeId,
                        gaugeTypeId: input.gaugeTypeId,
                        gaugeRole: input.gaugeRole,
                        gaugeCalibrationStatus: input.gaugeCalibrationStatus,
                        supplierId: (_b = input.supplierId) !== null && _b !== void 0 ? _b : null,
                        modelNumber: (_c = input.modelNumber) !== null && _c !== void 0 ? _c : null,
                        serialNumber: (_d = input.serialNumber) !== null && _d !== void 0 ? _d : null,
                        description: (_e = input.description) !== null && _e !== void 0 ? _e : null,
                        dateAcquired: (_f = input.dateAcquired) !== null && _f !== void 0 ? _f : null,
                        lastCalibrationDate: (_g = input.lastCalibrationDate) !== null && _g !== void 0 ? _g : null,
                        nextCalibrationDate: (_h = input.nextCalibrationDate) !== null && _h !== void 0 ? _h : null,
                        locationId: (_j = input.locationId) !== null && _j !== void 0 ? _j : null,
                        storageUnitId: (_k = input.storageUnitId) !== null && _k !== void 0 ? _k : null,
                        calibrationIntervalInMonths: (_l = input.calibrationIntervalInMonths) !== null && _l !== void 0 ? _l : 6,
                        customFields: input.customFields,
                        companyId: input.companyId,
                        createdBy: input.createdBy,
                        updatedBy: input.createdBy
                    })
                        .select("id, gaugeId")
                        .single()];
                case 4:
                    gauge = _m.sent();
                    if (gauge.error)
                        return [2 /*return*/, { data: null, error: gauge.error }];
                    return [2 /*return*/, {
                            data: { id: gauge.data.id, gaugeId: gauge.data.gaugeId },
                            error: null
                        }];
            }
        });
    });
}
function updateGauge(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var id, rest, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = input.id, rest = __rest(input, ["id"]);
                    return [4 /*yield*/, client
                            .from("gauges")
                            .update((0, supabase_1.sanitize)(rest))
                            .eq("id", id)
                            .select("id")
                            .single()];
                case 1:
                    result = _a.sent();
                    if (result.error)
                        return [2 /*return*/, { data: null, error: result.error }];
                    return [2 /*return*/, { data: { id: result.data.id }, error: null }];
            }
        });
    });
}
/** @deprecated Use insertGauge for new gauges, updateGauge for existing gauges */
function upsertGauge(client, gauge) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in gauge) {
                return [2 /*return*/, client.from("gauges").insert([gauge]).select("id, gaugeId").single()];
            }
            else {
                return [2 /*return*/, client.from("gauges").update((0, supabase_1.sanitize)(gauge)).eq("id", gauge.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertGaugeCalibrationRecord(client, gaugeCalibrationRecord) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, gauge, nextCalibrationDate, update, data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = "updatedBy" in gaugeCalibrationRecord
                        ? gaugeCalibrationRecord.updatedBy
                        : gaugeCalibrationRecord.createdBy;
                    return [4 /*yield*/, client
                            .from("gauge")
                            .select("*")
                            .eq("id", gaugeCalibrationRecord.gaugeId)
                            .single()];
                case 1:
                    gauge = _b.sent();
                    if (gauge.error)
                        return [2 /*return*/, gauge];
                    if (!(!((_a = gauge.data) === null || _a === void 0 ? void 0 : _a.lastCalibrationDate) ||
                        (0, date_1.parseDate)(gauge.data.lastCalibrationDate) <=
                            (0, date_1.parseDate)(gaugeCalibrationRecord.dateCalibrated))) return [3 /*break*/, 3];
                    nextCalibrationDate = (0, date_1.parseDate)(gaugeCalibrationRecord.dateCalibrated)
                        .add({
                        months: gauge.data.calibrationIntervalInMonths
                    })
                        .toString();
                    return [4 /*yield*/, client
                            .from("gauge")
                            .update({
                            gaugeCalibrationStatus: gaugeCalibrationRecord.inspectionStatus === "Pass"
                                ? "In-Calibration"
                                : "Out-of-Calibration",
                            lastCalibrationDate: gaugeCalibrationRecord.dateCalibrated,
                            nextCalibrationDate: nextCalibrationDate,
                            // Reset lastCalibrationStatus when gauge passes calibration to allow future notifications
                            lastCalibrationStatus: gaugeCalibrationRecord.inspectionStatus === "Pass"
                                ? "In-Calibration"
                                : gauge.data.lastCalibrationStatus,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", gaugeCalibrationRecord.gaugeId)];
                case 2:
                    update = _b.sent();
                    if (update.error)
                        return [2 /*return*/, update];
                    _b.label = 3;
                case 3:
                    if ("createdBy" in gaugeCalibrationRecord) {
                        data = (0, supabase_1.sanitize)(gaugeCalibrationRecord);
                        if (data.humidity === 0)
                            data.humidity = undefined;
                        if (data.temperature === 0)
                            data.temperature = undefined;
                        return [2 /*return*/, client
                                .from("gaugeCalibrationRecord")
                                .insert([data])
                                .select("id")
                                .single()];
                    }
                    return [2 /*return*/, client
                            .from("gaugeCalibrationRecord")
                            .update((0, supabase_1.sanitize)(__assign(__assign({}, gaugeCalibrationRecord), { updatedBy: userId, updatedAt: new Date().toISOString() })))
                            .eq("id", gaugeCalibrationRecord.id)];
            }
        });
    });
}
function upsertGaugeType(client, gaugeType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in gaugeType) {
                return [2 /*return*/, client.from("gaugeType").insert([gaugeType]).select("id")];
            }
            else {
                return [2 /*return*/, client
                        .from("gaugeType")
                        .update((0, supabase_1.sanitize)(gaugeType))
                        .eq("id", gaugeType.id)];
            }
            return [2 /*return*/];
        });
    });
}
function insertIssue(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var nonConformanceId, seq, items, jobOperationId, customerId, salesOrderLineId, operationSupplierProcessId, data, result, ncrId, itemInsert, jobOperation, job, jobOperationInsert, customerInsert, salesOrderLine, salesOrderLineInsert, operationSupplierProcess, nonConformanceSupplierInsert;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    if (!input.nonConformanceId) return [3 /*break*/, 1];
                    nonConformanceId = input.nonConformanceId;
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, client.rpc("get_next_sequence", {
                        sequence_name: "nonConformance",
                        company_id: input.companyId
                    })];
                case 2:
                    seq = _k.sent();
                    if (seq.error || !seq.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: (_a = seq.error) !== null && _a !== void 0 ? _a : {
                                    message: "Failed to generate nonConformance sequence"
                                }
                            }];
                    }
                    nonConformanceId = seq.data;
                    _k.label = 3;
                case 3:
                    items = input.items, jobOperationId = input.jobOperationId, customerId = input.customerId, salesOrderLineId = input.salesOrderLineId, operationSupplierProcessId = input.operationSupplierProcessId, data = __rest(input, ["items", "jobOperationId", "customerId", "salesOrderLineId", "operationSupplierProcessId"]);
                    return [4 /*yield*/, client
                            .from("nonConformance")
                            .insert({
                            nonConformanceId: nonConformanceId,
                            name: data.name,
                            priority: data.priority,
                            source: data.source,
                            locationId: data.locationId,
                            nonConformanceTypeId: data.nonConformanceTypeId,
                            openDate: data.openDate,
                            description: (_b = data.description) !== null && _b !== void 0 ? _b : null,
                            nonConformanceWorkflowId: (_c = data.nonConformanceWorkflowId) !== null && _c !== void 0 ? _c : null,
                            dueDate: (_d = data.dueDate) !== null && _d !== void 0 ? _d : null,
                            closeDate: (_e = data.closeDate) !== null && _e !== void 0 ? _e : null,
                            quantity: (_f = data.quantity) !== null && _f !== void 0 ? _f : 1,
                            requiredActionIds: (_g = data.requiredActionIds) !== null && _g !== void 0 ? _g : [],
                            approvalRequirements: (_h = data.approvalRequirements) !== null && _h !== void 0 ? _h : [],
                            customFields: data.customFields,
                            companyId: data.companyId,
                            createdBy: data.createdBy
                        })
                            .select("id, nonConformanceId")
                            .single()];
                case 4:
                    result = _k.sent();
                    if (result.error || !result.data) {
                        return [2 /*return*/, { data: null, error: result.error }];
                    }
                    ncrId = result.data.id;
                    if (!(items && items.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, client.from("nonConformanceItem").insert(items.map(function (item) { return ({
                            nonConformanceId: ncrId,
                            itemId: item,
                            companyId: input.companyId,
                            createdBy: input.createdBy
                        }); }))];
                case 5:
                    itemInsert = _k.sent();
                    if (itemInsert.error) {
                        console.error(itemInsert);
                    }
                    _k.label = 6;
                case 6:
                    if (!jobOperationId) return [3 /*break*/, 10];
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("*")
                            .eq("id", jobOperationId)
                            .single()];
                case 7:
                    jobOperation = _k.sent();
                    if (!(jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.data)) return [3 /*break*/, 10];
                    return [4 /*yield*/, client
                            .from("job")
                            .select("*")
                            .eq("id", jobOperation.data.jobId)
                            .single()];
                case 8:
                    job = _k.sent();
                    if (!job.data) return [3 /*break*/, 10];
                    return [4 /*yield*/, client
                            .from("nonConformanceJobOperation")
                            .insert([
                            {
                                jobId: jobOperation.data.jobId,
                                jobOperationId: jobOperationId,
                                nonConformanceId: ncrId,
                                jobReadableId: (_j = job.data) === null || _j === void 0 ? void 0 : _j.jobId,
                                companyId: input.companyId,
                                createdBy: input.createdBy
                            }
                        ])];
                case 9:
                    jobOperationInsert = _k.sent();
                    if (jobOperationInsert.error) {
                        console.error(jobOperationInsert);
                    }
                    _k.label = 10;
                case 10:
                    if (!customerId) return [3 /*break*/, 12];
                    return [4 /*yield*/, client.from("nonConformanceCustomer").insert([
                            {
                                companyId: input.companyId,
                                createdBy: input.createdBy,
                                customerId: customerId,
                                nonConformanceId: ncrId
                            }
                        ])];
                case 11:
                    customerInsert = _k.sent();
                    if (customerInsert.error) {
                        console.error(customerInsert);
                    }
                    _k.label = 12;
                case 12:
                    if (!salesOrderLineId) return [3 /*break*/, 15];
                    return [4 /*yield*/, client
                            .from("salesOrderLine")
                            .select("*, salesOrder(salesOrderId)")
                            .eq("id", salesOrderLineId)
                            .single()];
                case 13:
                    salesOrderLine = _k.sent();
                    if (!salesOrderLine.data) return [3 /*break*/, 15];
                    return [4 /*yield*/, client
                            .from("nonConformanceSalesOrderLine")
                            .insert([
                            {
                                companyId: input.companyId,
                                createdBy: input.createdBy,
                                salesOrderLineId: salesOrderLineId,
                                salesOrderId: salesOrderLine.data.salesOrderId,
                                salesOrderReadableId: salesOrderLine.data.salesOrder.salesOrderId,
                                nonConformanceId: ncrId
                            }
                        ])];
                case 14:
                    salesOrderLineInsert = _k.sent();
                    if (salesOrderLineInsert.error) {
                        console.error(salesOrderLineInsert);
                    }
                    _k.label = 15;
                case 15:
                    if (!operationSupplierProcessId) return [3 /*break*/, 18];
                    return [4 /*yield*/, client
                            .from("supplierProcess")
                            .select("*")
                            .eq("id", operationSupplierProcessId)
                            .single()];
                case 16:
                    operationSupplierProcess = _k.sent();
                    if (!operationSupplierProcess.data) return [3 /*break*/, 18];
                    return [4 /*yield*/, client
                            .from("nonConformanceSupplier")
                            .insert([
                            {
                                companyId: input.companyId,
                                createdBy: input.createdBy,
                                supplierId: operationSupplierProcess.data.supplierId,
                                nonConformanceId: ncrId
                            }
                        ])];
                case 17:
                    nonConformanceSupplierInsert = _k.sent();
                    if (nonConformanceSupplierInsert.error) {
                        console.error(nonConformanceSupplierInsert);
                    }
                    _k.label = 18;
                case 18: return [2 /*return*/, {
                        data: { id: ncrId, nonConformanceId: result.data.nonConformanceId },
                        error: null
                    }];
            }
        });
    });
}
function updateIssue(client, input) {
    return __awaiter(this, void 0, void 0, function () {
        var id, rest, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = input.id, rest = __rest(input, ["id"]);
                    return [4 /*yield*/, client
                            .from("nonConformance")
                            .update((0, supabase_1.sanitize)(rest))
                            .eq("id", id)
                            .select("id")
                            .single()];
                case 1:
                    result = _a.sent();
                    if (result.error)
                        return [2 /*return*/, { data: null, error: result.error }];
                    return [2 /*return*/, { data: { id: result.data.id }, error: null }];
            }
        });
    });
}
/** @deprecated Use insertIssue for new issues, updateIssue for existing issues */
function upsertIssue(client, nonConformance) {
    return __awaiter(this, void 0, void 0, function () {
        var items, jobOperationId, customerId, salesOrderLineId, operationSupplierProcessId, data, result_1, itemInsert, jobOperation, job, jobOperationInsert, customerInsert, salesOrderLine, salesOrderLineInsert, operationSupplierProcess, nonConformanceSupplierInsert, items, data;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!("createdBy" in nonConformance)) return [3 /*break*/, 16];
                    items = nonConformance.items, jobOperationId = nonConformance.jobOperationId, customerId = nonConformance.customerId, salesOrderLineId = nonConformance.salesOrderLineId, operationSupplierProcessId = nonConformance.operationSupplierProcessId, data = __rest(nonConformance, ["items", "jobOperationId", "customerId", "salesOrderLineId", "operationSupplierProcessId"]);
                    return [4 /*yield*/, client
                            .from("nonConformance")
                            .insert([data])
                            .select("id")
                            .single()];
                case 1:
                    result_1 = _c.sent();
                    if (!((_a = result_1.data) === null || _a === void 0 ? void 0 : _a.id)) return [3 /*break*/, 15];
                    if (!(items && items.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, client.from("nonConformanceItem").insert(items.map(function (item) { return ({
                            nonConformanceId: result_1.data.id,
                            itemId: item,
                            companyId: nonConformance.companyId,
                            createdBy: nonConformance.createdBy
                        }); }))];
                case 2:
                    itemInsert = _c.sent();
                    if (itemInsert.error) {
                        console.error(itemInsert);
                    }
                    _c.label = 3;
                case 3:
                    if (!jobOperationId) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("*")
                            .eq("id", jobOperationId)
                            .single()];
                case 4:
                    jobOperation = _c.sent();
                    if (!(jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.data)) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("job")
                            .select("*")
                            .eq("id", jobOperation.data.jobId)
                            .single()];
                case 5:
                    job = _c.sent();
                    if (!job.data) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("nonConformanceJobOperation")
                            .insert([
                            {
                                jobId: jobOperation.data.jobId,
                                jobOperationId: jobOperationId,
                                nonConformanceId: result_1.data.id,
                                jobReadableId: (_b = job.data) === null || _b === void 0 ? void 0 : _b.jobId,
                                companyId: nonConformance.companyId,
                                createdBy: nonConformance.createdBy
                            }
                        ])];
                case 6:
                    jobOperationInsert = _c.sent();
                    if (jobOperationInsert.error) {
                        console.error(jobOperationInsert);
                    }
                    _c.label = 7;
                case 7:
                    if (!customerId) return [3 /*break*/, 9];
                    return [4 /*yield*/, client
                            .from("nonConformanceCustomer")
                            .insert([
                            {
                                companyId: nonConformance.companyId,
                                createdBy: nonConformance.createdBy,
                                customerId: customerId,
                                nonConformanceId: result_1.data.id
                            }
                        ])];
                case 8:
                    customerInsert = _c.sent();
                    if (customerInsert.error) {
                        console.error(customerInsert);
                    }
                    _c.label = 9;
                case 9:
                    if (!salesOrderLineId) return [3 /*break*/, 12];
                    return [4 /*yield*/, client
                            .from("salesOrderLine")
                            .select("*, salesOrder(salesOrderId)")
                            .eq("id", salesOrderLineId)
                            .single()];
                case 10:
                    salesOrderLine = _c.sent();
                    if (!salesOrderLine.data) return [3 /*break*/, 12];
                    return [4 /*yield*/, client
                            .from("nonConformanceSalesOrderLine")
                            .insert([
                            {
                                companyId: nonConformance.companyId,
                                createdBy: nonConformance.createdBy,
                                salesOrderLineId: salesOrderLineId,
                                salesOrderId: salesOrderLine.data.salesOrderId,
                                salesOrderReadableId: salesOrderLine.data.salesOrder.salesOrderId,
                                nonConformanceId: result_1.data.id
                            }
                        ])];
                case 11:
                    salesOrderLineInsert = _c.sent();
                    if (salesOrderLineInsert.error) {
                        console.error(salesOrderLineInsert);
                    }
                    _c.label = 12;
                case 12:
                    if (!operationSupplierProcessId) return [3 /*break*/, 15];
                    return [4 /*yield*/, client
                            .from("supplierProcess")
                            .select("*")
                            .eq("id", operationSupplierProcessId)
                            .single()];
                case 13:
                    operationSupplierProcess = _c.sent();
                    if (!operationSupplierProcess.data) return [3 /*break*/, 15];
                    return [4 /*yield*/, client
                            .from("nonConformanceSupplier")
                            .insert([
                            {
                                companyId: nonConformance.companyId,
                                createdBy: nonConformance.createdBy,
                                supplierId: operationSupplierProcess.data.supplierId,
                                nonConformanceId: result_1.data.id
                            }
                        ])];
                case 14:
                    nonConformanceSupplierInsert = _c.sent();
                    if (nonConformanceSupplierInsert.error) {
                        console.error(nonConformanceSupplierInsert);
                    }
                    _c.label = 15;
                case 15: return [2 /*return*/, result_1];
                case 16:
                    items = nonConformance.items, data = __rest(nonConformance, ["items"]);
                    return [2 /*return*/, client
                            .from("nonConformance")
                            .update((0, supabase_1.sanitize)(data))
                            .eq("id", nonConformance.id)];
            }
        });
    });
}
function upsertIssueWorkflow(client, nonConformanceWorkflow) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in nonConformanceWorkflow) {
                return [2 /*return*/, client
                        .from("nonConformanceWorkflow")
                        .insert([nonConformanceWorkflow])
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("nonConformanceWorkflow")
                        .update((0, supabase_1.sanitize)(nonConformanceWorkflow))
                        .eq("id", nonConformanceWorkflow.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertIssueType(client, nonConformanceType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in nonConformanceType) {
                return [2 /*return*/, client
                        .from("nonConformanceType")
                        .insert([nonConformanceType])
                        .select("id")];
            }
            else {
                return [2 /*return*/, client
                        .from("nonConformanceType")
                        .update((0, supabase_1.sanitize)(nonConformanceType))
                        .eq("id", nonConformanceType.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertRequiredAction(client, requiredAction) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in requiredAction) {
                return [2 /*return*/, client
                        .from("nonConformanceRequiredAction")
                        .insert([requiredAction])
                        .select("id")];
            }
            else {
                return [2 /*return*/, client
                        .from("nonConformanceRequiredAction")
                        .update((0, supabase_1.sanitize)(requiredAction))
                        .eq("id", requiredAction.id)];
            }
            return [2 /*return*/];
        });
    });
}
function upsertQualityDocument(client, qualityDocument) {
    return __awaiter(this, void 0, void 0, function () {
        var copyFromId, rest, insert, qualityDocument_1, steps, workInstruction, _a, updateWorkInstructions, insertSteps;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    copyFromId = qualityDocument.copyFromId, rest = __rest(qualityDocument, ["copyFromId"]);
                    if ("id" in rest) {
                        return [2 /*return*/, client
                                .from("qualityDocument")
                                .update((0, supabase_1.sanitize)(rest))
                                .eq("id", rest.id)
                                .select("id")
                                .single()];
                    }
                    return [4 /*yield*/, client
                            .from("qualityDocument")
                            .insert([rest])
                            .select("id")
                            .single()];
                case 1:
                    insert = _d.sent();
                    if (insert.error) {
                        return [2 /*return*/, insert];
                    }
                    if (!copyFromId) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("qualityDocument")
                            .select("*, qualityDocumentStep(*)")
                            .eq("id", copyFromId)
                            .single()];
                case 2:
                    qualityDocument_1 = _d.sent();
                    if (qualityDocument_1.error) {
                        return [2 /*return*/, qualityDocument_1];
                    }
                    steps = (_b = qualityDocument_1.data.qualityDocumentStep) !== null && _b !== void 0 ? _b : [];
                    workInstruction = ((_c = qualityDocument_1.data.content) !== null && _c !== void 0 ? _c : {});
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("qualityDocument")
                                .update({
                                content: workInstruction,
                                tags: qualityDocument_1.data.tags
                            })
                                .eq("id", insert.data.id),
                            steps.length > 0
                                ? client.from("qualityDocumentStep").insert(steps.map(function (step) {
                                    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
                                    var id = step.id, qualityDocumentId = step.qualityDocumentId, rest = __rest(step, ["id", "qualityDocumentId"]);
                                    return __assign(__assign({}, rest), { qualityDocumentId: insert.data.id, companyId: qualityDocument_1.data.companyId });
                                }))
                                : Promise.resolve({ data: null, error: null })
                        ])];
                case 3:
                    _a = _d.sent(), updateWorkInstructions = _a[0], insertSteps = _a[1];
                    if (updateWorkInstructions.error) {
                        return [2 /*return*/, updateWorkInstructions];
                    }
                    if (insertSteps.error) {
                        return [2 /*return*/, insertSteps];
                    }
                    _d.label = 4;
                case 4: return [2 /*return*/, insert];
            }
        });
    });
}
function upsertQualityDocumentStep(client, qualityDocumentStep) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in qualityDocumentStep) {
                return [2 /*return*/, client
                        .from("qualityDocumentStep")
                        .update((0, supabase_1.sanitize)(qualityDocumentStep))
                        .eq("id", qualityDocumentStep.id)
                        .select("id")
                        .single()];
            }
            return [2 /*return*/, client
                    .from("qualityDocumentStep")
                    .insert([qualityDocumentStep])
                    .select("id")
                    .single()];
        });
    });
}
function upsertRisk(client, risk) {
    return __awaiter(this, void 0, void 0, function () {
        var updatedBy, data;
        return __generator(this, function (_a) {
            if ("id" in risk) {
                updatedBy = risk.updatedBy, data = __rest(risk, ["updatedBy"]);
                return [2 /*return*/, client
                        .from("riskRegister")
                        .update(__assign(__assign({}, (0, supabase_1.sanitize)(data)), { updatedBy: updatedBy, updatedAt: new Date().toISOString() }))
                        .eq("id", risk.id)
                        .select("id")
                        .single()];
            }
            else {
                return [2 /*return*/, client
                        .from("riskRegister")
                        .insert([
                        __assign({}, (0, supabase_1.sanitize)(risk))
                    ])
                        .select("id")
                        .single()];
            }
            return [2 /*return*/];
        });
    });
}
// ─── Inspection Documents ─────────────────────────────────────────────────────
function toStoragePath(pdfUrl) {
    if (!pdfUrl)
        return null;
    var previewPrefix = "/file/preview/private/";
    if (pdfUrl.startsWith(previewPrefix)) {
        return pdfUrl.slice(previewPrefix.length);
    }
    return pdfUrl;
}
function toPreviewUrl(storagePath) {
    if (!storagePath)
        return null;
    return storagePath.startsWith("/file/preview/private/")
        ? storagePath
        : "/file/preview/private/".concat(storagePath);
}
function fileNameFromPath(storagePath) {
    var _a;
    if (!storagePath)
        return "drawing.pdf";
    return (_a = storagePath.split("/").at(-1)) !== null && _a !== void 0 ? _a : "drawing.pdf";
}
function mapInspectionDocument(row) {
    var _a, _b, _c, _d, _e, _f;
    var drawingNumber = (_a = row.drawingNumber) !== null && _a !== void 0 ? _a : null;
    return {
        id: String(row.id),
        name: String((_b = drawingNumber !== null && drawingNumber !== void 0 ? drawingNumber : row.fileName) !== null && _b !== void 0 ? _b : "Untitled Diagram"),
        companyId: String(row.companyId),
        partId: (_c = row.partId) !== null && _c !== void 0 ? _c : null,
        createdBy: String(row.createdBy),
        updatedBy: (_d = row.updatedBy) !== null && _d !== void 0 ? _d : null,
        createdAt: String(row.createdAt),
        updatedAt: (_e = row.updatedAt) !== null && _e !== void 0 ? _e : null,
        content: {
            drawingNumber: drawingNumber,
            pdfUrl: toPreviewUrl((_f = row.storagePath) !== null && _f !== void 0 ? _f : null),
            annotations: [],
            features: []
        }
    };
}
function getInspectionDocuments(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var documentClient, query, result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    documentClient = client;
                    query = documentClient
                        .from("inspectionDocuments")
                        .select("*", { count: "exact" })
                        .eq("companyId", companyId);
                    if (args === null || args === void 0 ? void 0 : args.search) {
                        query = query.or("drawingNumber.ilike.%".concat(args.search, "%,fileName.ilike.%").concat(args.search, "%,partReadableId.ilike.%").concat(args.search, "%"));
                    }
                    if (args) {
                        query = (0, query_1.setGenericQueryFilters)(query, args, [
                            { column: "drawingNumber", ascending: true }
                        ]);
                    }
                    return [4 /*yield*/, query];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, {
                            data: ((_a = result.data) !== null && _a !== void 0 ? _a : []).map(function (row) {
                                return mapInspectionDocument(row);
                            }),
                            count: (_b = result.count) !== null && _b !== void 0 ? _b : 0,
                            error: result.error
                        }];
            }
        });
    });
}
function getInspectionDocument(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        var documentClient, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    documentClient = client;
                    return [4 /*yield*/, documentClient
                            .from("inspectionDocument")
                            .select("*")
                            .eq("id", id)
                            .single()];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, {
                            data: result.data ? mapInspectionDocument(result.data) : null,
                            error: result.error
                        }];
            }
        });
    });
}
function upsertInspectionDocument(client, diagram) {
    return __awaiter(this, void 0, void 0, function () {
        var id, partId, drawingNumber, pdfUrl, pageCount, defaultPageWidth, defaultPageHeight, companyId, createdBy, updatedBy, documentClient, storagePath, existingResult, existing, updatePayload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = diagram.id, partId = diagram.partId, drawingNumber = diagram.drawingNumber, pdfUrl = diagram.pdfUrl, pageCount = diagram.pageCount, defaultPageWidth = diagram.defaultPageWidth, defaultPageHeight = diagram.defaultPageHeight, companyId = diagram.companyId, createdBy = diagram.createdBy, updatedBy = diagram.updatedBy;
                    documentClient = client;
                    storagePath = toStoragePath(pdfUrl);
                    if (!id) return [3 /*break*/, 2];
                    if (!companyId) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "companyId is required to update inspection document"
                                }
                            }];
                    }
                    return [4 /*yield*/, documentClient
                            .from("inspectionDocument")
                            .select("*")
                            .eq("id", id)
                            .single()];
                case 1:
                    existingResult = _b.sent();
                    existing = existingResult.data;
                    if (!existing) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "Inspection document not found"
                                }
                            }];
                    }
                    if (String((_a = existing.companyId) !== null && _a !== void 0 ? _a : "") !== companyId) {
                        return [2 /*return*/, {
                                data: null,
                                error: {
                                    message: "Inspection document does not belong to this company"
                                }
                            }];
                    }
                    updatePayload = {
                        updatedBy: updatedBy !== null && updatedBy !== void 0 ? updatedBy : createdBy,
                        updatedAt: new Date().toISOString()
                    };
                    if (drawingNumber !== undefined) {
                        updatePayload.drawingNumber = drawingNumber !== null && drawingNumber !== void 0 ? drawingNumber : null;
                    }
                    if (partId !== undefined) {
                        updatePayload.partId = partId;
                    }
                    if (storagePath) {
                        updatePayload.storagePath = storagePath;
                        updatePayload.fileName = fileNameFromPath(storagePath);
                    }
                    if (pageCount && pageCount > 0) {
                        updatePayload.pageCount = pageCount;
                    }
                    if (defaultPageWidth && defaultPageWidth > 0) {
                        updatePayload.defaultPageWidth = defaultPageWidth;
                    }
                    if (defaultPageHeight && defaultPageHeight > 0) {
                        updatePayload.defaultPageHeight = defaultPageHeight;
                    }
                    return [2 /*return*/, documentClient
                            .from("inspectionDocument")
                            .update(updatePayload)
                            .eq("id", id)
                            .eq("companyId", companyId)
                            .select("id")
                            .single()];
                case 2:
                    if (!companyId) {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "companyId is required to create inspection document" }
                            }];
                    }
                    return [2 /*return*/, documentClient
                            .from("inspectionDocument")
                            .insert(__assign(__assign(__assign(__assign(__assign({ companyId: companyId, partId: partId, drawingNumber: drawingNumber !== null && drawingNumber !== void 0 ? drawingNumber : null, version: 0 }, (storagePath
                            ? {
                                storagePath: storagePath,
                                fileName: fileNameFromPath(storagePath),
                                uploadedBy: createdBy
                            }
                            : {})), (pageCount && pageCount > 0 ? { pageCount: pageCount } : {})), (defaultPageWidth && defaultPageWidth > 0 ? { defaultPageWidth: defaultPageWidth } : {})), (defaultPageHeight && defaultPageHeight > 0
                            ? { defaultPageHeight: defaultPageHeight }
                            : {})), { createdBy: createdBy }))
                            .select("id")
                            .single()];
            }
        });
    });
}
function deleteInspectionDocument(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        var documentClient, existingResult, storagePath, deleteResult;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    documentClient = client;
                    return [4 /*yield*/, documentClient
                            .from("inspectionDocument")
                            .select("*")
                            .eq("id", id)
                            .single()];
                case 1:
                    existingResult = _b.sent();
                    if (!existingResult.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: { message: "Inspection document not found" }
                            }];
                    }
                    storagePath = (_a = existingResult.data.storagePath) !== null && _a !== void 0 ? _a : null;
                    return [4 /*yield*/, documentClient
                            .from("inspectionDocument")
                            .delete()
                            .eq("id", id)];
                case 2:
                    deleteResult = _b.sent();
                    if (deleteResult.error) {
                        return [2 /*return*/, { data: null, error: deleteResult.error }];
                    }
                    return [2 /*return*/, {
                            data: { storagePath: storagePath },
                            error: null
                        }];
            }
        });
    });
}
function mapInspectionFeature(row) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var balloonIdRaw = (_a = row.balloonId) !== null && _a !== void 0 ? _a : row.balloon_id;
    return {
        id: String(row.id),
        inspectionDocumentId: String(row.inspectionDocumentId),
        companyId: String(row.companyId),
        pageNumber: Number(row.pageNumber),
        label: String(row.label),
        description: (_b = row.description) !== null && _b !== void 0 ? _b : null,
        nominalValue: (_c = row.nominalValue) !== null && _c !== void 0 ? _c : null,
        tolerancePlus: (_d = row.tolerancePlus) !== null && _d !== void 0 ? _d : null,
        toleranceMinus: (_e = row.toleranceMinus) !== null && _e !== void 0 ? _e : null,
        unit: (_f = row.unit) !== null && _f !== void 0 ? _f : null,
        type: (_g = row.type) !== null && _g !== void 0 ? _g : "Measurement",
        balloonId: typeof balloonIdRaw === "string"
            ? balloonIdRaw
            : balloonIdRaw != null
                ? String(balloonIdRaw)
                : null,
        createdBy: String(row.createdBy),
        updatedBy: (_h = row.updatedBy) !== null && _h !== void 0 ? _h : null,
        createdAt: String(row.createdAt),
        updatedAt: (_j = row.updatedAt) !== null && _j !== void 0 ? _j : null
    };
}
function mapBalloon(row) {
    var _a, _b;
    return {
        id: String(row.id),
        inspectionDocumentId: String(row.inspectionDocumentId),
        companyId: String(row.companyId),
        inspectionFeatureId: String(row.inspectionFeatureId),
        pageNumber: Number(row.pageNumber),
        regionX: Number(row.regionX),
        regionY: Number(row.regionY),
        regionWidth: Number(row.regionWidth),
        regionHeight: Number(row.regionHeight),
        xCoordinate: Number(row.xCoordinate),
        yCoordinate: Number(row.yCoordinate),
        createdBy: String(row.createdBy),
        updatedBy: (_a = row.updatedBy) !== null && _a !== void 0 ? _a : null,
        createdAt: String(row.createdAt),
        updatedAt: (_b = row.updatedAt) !== null && _b !== void 0 ? _b : null,
        balloonAnchorId: String(row.id)
    };
}
function getInspectionFeatures(client, inspectionDocumentId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, featuresResult, balloonsResult, balloonByFeatureId;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        getInspectionFeaturesRaw(client, inspectionDocumentId),
                        getBalloons(client, inspectionDocumentId)
                    ])];
                case 1:
                    _a = _d.sent(), featuresResult = _a[0], balloonsResult = _a[1];
                    if (featuresResult.error) {
                        return [2 /*return*/, { data: null, error: featuresResult.error }];
                    }
                    if (balloonsResult.error) {
                        return [2 /*return*/, { data: null, error: balloonsResult.error }];
                    }
                    balloonByFeatureId = new Map(((_b = balloonsResult.data) !== null && _b !== void 0 ? _b : []).map(function (b) { return [b.inspectionFeatureId, b.id]; }));
                    return [2 /*return*/, {
                            data: ((_c = featuresResult.data) !== null && _c !== void 0 ? _c : []).map(function (row) {
                                var _a;
                                return mapInspectionFeature(__assign(__assign({}, row), { balloonId: (_a = balloonByFeatureId.get(String(row.id))) !== null && _a !== void 0 ? _a : null }));
                            }),
                            error: null
                        }];
            }
        });
    });
}
function getInspectionFeaturesRaw(client, inspectionDocumentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, (0, inspectionDocumentDb_1.listInspectionFeatures)(client, inspectionDocumentId)];
        });
    });
}
function getBalloons(client, inspectionDocumentId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, inspectionDocumentDb_1.listBalloons)(client, inspectionDocumentId)];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, {
                            data: ((_a = result.data) !== null && _a !== void 0 ? _a : []).map(function (row) {
                                return mapBalloon(row);
                            }),
                            error: result.error
                        }];
            }
        });
    });
}
function getInspectionPlan(client, inspectionDocumentId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, featuresResult, balloonsResult, balloonByFeatureId;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        getInspectionFeaturesRaw(client, inspectionDocumentId),
                        getBalloons(client, inspectionDocumentId)
                    ])];
                case 1:
                    _a = _d.sent(), featuresResult = _a[0], balloonsResult = _a[1];
                    if (featuresResult.error) {
                        return [2 /*return*/, { data: null, error: featuresResult.error }];
                    }
                    if (balloonsResult.error) {
                        return [2 /*return*/, { data: null, error: balloonsResult.error }];
                    }
                    balloonByFeatureId = new Map(((_b = balloonsResult.data) !== null && _b !== void 0 ? _b : []).map(function (b) { return [b.inspectionFeatureId, b]; }));
                    return [2 /*return*/, {
                            data: ((_c = featuresResult.data) !== null && _c !== void 0 ? _c : []).map(function (row) {
                                var _a, _b;
                                var b = balloonByFeatureId.get(row.id);
                                var featureId = row.id;
                                return {
                                    /** Feature id (primary key for plan rows). */
                                    id: featureId,
                                    featureId: featureId,
                                    /** Balloon id when placed; null for table-only characteristics. */
                                    balloonId: (_a = b === null || b === void 0 ? void 0 : b.id) !== null && _a !== void 0 ? _a : null,
                                    inspectionDocumentId: row.inspectionDocumentId,
                                    pageNumber: (_b = b === null || b === void 0 ? void 0 : b.pageNumber) !== null && _b !== void 0 ? _b : row.pageNumber,
                                    characteristic: row.label,
                                    description: row.description,
                                    nominalValue: row.nominalValue,
                                    tolerancePlus: row.tolerancePlus,
                                    toleranceMinus: row.toleranceMinus,
                                    unit: row.unit,
                                    regionX: b ? b.regionX : null,
                                    regionY: b ? b.regionY : null,
                                    regionWidth: b ? b.regionWidth : null,
                                    regionHeight: b ? b.regionHeight : null,
                                    xCoordinate: b ? b.xCoordinate : null,
                                    yCoordinate: b ? b.yCoordinate : null
                                };
                            }),
                            error: null
                        }];
            }
        });
    });
}
function saveInspectionDocumentAtomic(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            return [2 /*return*/, client.rpc("save_inspection_document_atomic", {
                    p_inspection_document_id: args.inspectionDocumentId,
                    p_company_id: args.companyId,
                    p_user_id: args.userId,
                    p_pdf_url: (_a = args.pdfUrl) !== null && _a !== void 0 ? _a : null,
                    p_page_count: (_b = args.pageCount) !== null && _b !== void 0 ? _b : null,
                    p_default_page_width: (_c = args.defaultPageWidth) !== null && _c !== void 0 ? _c : null,
                    p_default_page_height: (_d = args.defaultPageHeight) !== null && _d !== void 0 ? _d : null,
                    p_features: args.features,
                    p_balloons: args.balloons
                })];
        });
    });
}
// -------------------------------------------------------------
// Inbound Inspections (lot-based)
// -------------------------------------------------------------
function getItemSamplingPlan(client, itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("itemSamplingPlan")
                    .select("*")
                    .eq("itemId", itemId)
                    .eq("companyId", companyId)
                    .maybeSingle()];
        });
    });
}
function upsertItemSamplingPlan(client, plan) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, payload;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, client
                        .from("itemSamplingPlan")
                        .select("itemId")
                        .eq("itemId", plan.itemId)
                        .eq("companyId", plan.companyId)
                        .maybeSingle()];
                case 1:
                    existing = _d.sent();
                    payload = {
                        itemId: plan.itemId,
                        type: plan.type,
                        sampleSize: (_a = plan.sampleSize) !== null && _a !== void 0 ? _a : null,
                        percentage: (_b = plan.percentage) !== null && _b !== void 0 ? _b : null,
                        aql: (_c = plan.aql) !== null && _c !== void 0 ? _c : null,
                        inspectionLevel: plan.inspectionLevel,
                        severity: plan.severity,
                        companyId: plan.companyId
                    };
                    if (existing.data) {
                        return [2 /*return*/, client
                                .from("itemSamplingPlan")
                                .update(__assign(__assign({}, payload), { updatedBy: plan.updatedBy, updatedAt: new Date().toISOString() }))
                                .eq("itemId", plan.itemId)
                                .eq("companyId", plan.companyId)];
                    }
                    return [2 /*return*/, client.from("itemSamplingPlan").insert(__assign(__assign({}, payload), { createdBy: plan.updatedBy }))];
            }
        });
    });
}
function getInboundInspections(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("inboundInspection")
                .select("*, item(readableId, name), receipt(receiptId, supplierId), supplier(name), inboundInspectionSample(status)", { count: "exact" })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("itemReadableId.ilike.%".concat(args.search, "%,notes.ilike.%").concat(args.search, "%"));
            }
            if (args === null || args === void 0 ? void 0 : args.status) {
                // @ts-ignore - status is a valid enum value
                query = query.eq("status", args.status);
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
function getInboundInspection(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("inboundInspection")
                    .select("*, item(readableId, name, type, itemTrackingType), receipt(receiptId, supplierId, createdBy), supplier(name), inboundInspectionSample(*, trackedEntity(id, readableId, attributes, status, sourceDocumentReadableId))")
                    .eq("id", id)
                    .single()];
        });
    });
}
function getInboundInspectionLotTrackedEntities(client, receiptLineId, companyId) {
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
