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
exports.loader = loader;
exports.action = action;
exports.default = NewProductionQuantityRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var overlay_1 = require("~/components/Overlay/overlay");
var items_1 = require("~/modules/items");
var production_1 = require("~/modules/production");
var configTableOverlay_server_1 = require("~/modules/production/configTableOverlay.server");
var productionQuantityReport_models_1 = require("~/modules/production/productionQuantityReport.models");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, isOverlay, jobId_1, jobOperationId_1, target, token, redirectParams, query, _c, client, companyId, jobId, jobOperationId, lockOperation, jobs, itemIds, itemReadableIdById, items, _i, _d, item, jobOperations, opContext, itemId, configurationParameters, configReferenceSource, _e, job, operations, bundle, params, seededActor, actorContext, jobOptions, operationOptions, remainingByOperationId, _f, _g, op;
        var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
        var request = _b.request;
        return __generator(this, function (_1) {
            switch (_1.label) {
                case 0:
                    url = new URL(request.url);
                    isOverlay = url.searchParams.get("overlay") === "true";
                    if (!isOverlay) {
                        jobId_1 = (_h = url.searchParams.get("jobId")) !== null && _h !== void 0 ? _h : "";
                        jobOperationId_1 = (_j = url.searchParams.get("jobOperationId")) !== null && _j !== void 0 ? _j : "";
                        target = overlay_1.overlay.to.newProductionQuantity({
                            jobId: jobId_1 || undefined,
                            jobOperationId: jobOperationId_1 || undefined
                        });
                        token = (0, overlay_1.overlayToken)(target);
                        redirectParams = new URLSearchParams();
                        if (token)
                            redirectParams.append(overlay_1.OVERLAY_PARAM, token);
                        query = (0, overlay_1.serializeSearch)(redirectParams);
                        throw (0, react_router_1.redirect)(query
                            ? "".concat(path_1.path.to.productionQuantities, "?").concat(query)
                            : path_1.path.to.productionQuantities);
                    }
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "production",
                            role: "employee",
                            bypassRls: true
                        })];
                case 1:
                    _c = _1.sent(), client = _c.client, companyId = _c.companyId;
                    jobId = (_k = url.searchParams.get("jobId")) !== null && _k !== void 0 ? _k : "";
                    jobOperationId = (_l = url.searchParams.get("jobOperationId")) !== null && _l !== void 0 ? _l : "";
                    lockOperation = url.searchParams.get("lockOperation") === "true";
                    return [4 /*yield*/, (0, production_1.getJobs)(client, companyId, {
                            search: null,
                            limit: 1000,
                            offset: 0,
                            sorts: [{ sortBy: "jobId", sortAsc: false }],
                            filters: []
                        })];
                case 2:
                    jobs = _1.sent();
                    if (jobs.error) {
                        throw (0, auth_1.error)(jobs.error, "Failed to fetch jobs");
                    }
                    itemIds = __spreadArray([], new Set(((_m = jobs.data) !== null && _m !== void 0 ? _m : []).map(function (j) { return j.itemId; }).filter(Boolean)), true);
                    itemReadableIdById = new Map();
                    if (!(itemIds.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id, readableIdWithRevision")
                            .in("id", itemIds)];
                case 3:
                    items = _1.sent();
                    for (_i = 0, _d = (_o = items.data) !== null && _o !== void 0 ? _o : []; _i < _d.length; _i++) {
                        item = _d[_i];
                        if (item.readableIdWithRevision) {
                            itemReadableIdById.set(item.id, item.readableIdWithRevision);
                        }
                    }
                    _1.label = 4;
                case 4:
                    jobOperations = null;
                    opContext = null;
                    itemId = null;
                    configurationParameters = null;
                    configReferenceSource = null;
                    if (!jobId) return [3 /*break*/, 8];
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getJob)(client, jobId),
                            (0, production_1.getJobOperations)(client, jobId)
                        ])];
                case 5:
                    _e = _1.sent(), job = _e[0], operations = _e[1];
                    if (job.error) {
                        throw (0, auth_1.error)(job.error, "Failed to fetch job");
                    }
                    if (operations.error) {
                        throw (0, auth_1.error)(operations.error, "Failed to fetch job operations");
                    }
                    jobOperations = (_p = operations.data) !== null && _p !== void 0 ? _p : [];
                    itemId = (_r = (_q = job.data) === null || _q === void 0 ? void 0 : _q.itemId) !== null && _r !== void 0 ? _r : null;
                    return [4 /*yield*/, client
                            .from("bundleWorkOrder")
                            .select("id")
                            .eq("jobId", jobId)
                            .maybeSingle()];
                case 6:
                    bundle = _1.sent();
                    if (!(itemId && !bundle.data)) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, items_1.getConfigurationParameters)(client, itemId, companyId)];
                case 7:
                    params = _1.sent();
                    configurationParameters = params.parameters;
                    _1.label = 8;
                case 8:
                    if (!jobOperationId) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, production_1.getJobOperationActorContext)(client, jobOperationId, companyId)];
                case 9:
                    opContext = _1.sent();
                    if (!jobId) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, configTableOverlay_server_1.getConfigReferenceSourceForOperation)(client, {
                            jobId: jobId,
                            jobOperationId: jobOperationId,
                            companyId: companyId,
                            reportKind: "productionQuantity"
                        })];
                case 10:
                    configReferenceSource = _1.sent();
                    _1.label = 11;
                case 11:
                    seededActor = opContext
                        ? (0, production_1.seededActorFromOperationContext)(opContext)
                        : null;
                    actorContext = opContext
                        ? __assign(__assign({}, opContext), { defaultActorKind: (0, production_1.defaultActorKindFromOperationType)(opContext.operationType), seededActor: seededActor, lockActorSelection: (_s = seededActor === null || seededActor === void 0 ? void 0 : seededActor.lockActorSelection) !== null && _s !== void 0 ? _s : false }) : {
                        defaultActorKind: "employee",
                        seededActor: null,
                        operationType: null,
                        processId: null,
                        lockActorSelection: false,
                        supplierId: undefined
                    };
                    jobOptions = (_u = (_t = jobs.data) === null || _t === void 0 ? void 0 : _t.map(function (job) {
                        var _a;
                        var itemReadableId = job.itemId
                            ? itemReadableIdById.get(job.itemId)
                            : undefined;
                        return {
                            label: itemReadableId
                                ? "".concat(job.jobId, " (").concat(itemReadableId, ")")
                                : ((_a = job.jobId) !== null && _a !== void 0 ? _a : ""),
                            value: job.id
                        };
                    })) !== null && _u !== void 0 ? _u : [];
                    operationOptions = (_v = jobOperations === null || jobOperations === void 0 ? void 0 : jobOperations.map(function (operation) {
                        var _a;
                        return ({
                            label: (_a = operation.description) !== null && _a !== void 0 ? _a : "",
                            value: operation.id
                        });
                    })) !== null && _v !== void 0 ? _v : [];
                    remainingByOperationId = {};
                    for (_f = 0, _g = jobOperations !== null && jobOperations !== void 0 ? jobOperations : []; _f < _g.length; _f++) {
                        op = _g[_f];
                        if (!op.id)
                            continue;
                        remainingByOperationId[op.id] = Math.max(0, ((_x = (_w = op.targetQuantity) !== null && _w !== void 0 ? _w : op.operationQuantity) !== null && _x !== void 0 ? _x : 0) -
                            ((_y = op.quantityComplete) !== null && _y !== void 0 ? _y : 0) -
                            ((_z = op.quantityScrapped) !== null && _z !== void 0 ? _z : 0) -
                            ((_0 = op.quantityReworked) !== null && _0 !== void 0 ? _0 : 0));
                    }
                    return [2 /*return*/, __assign({ jobId: jobId, jobOperationId: jobOperationId, jobOptions: jobOptions, operationOptions: operationOptions, itemId: itemId, remainingByOperationId: remainingByOperationId, 
                            // Lock job + operation when the caller seeds a specific operation to report
                            // (e.g. a Master Work Order's cutting operation).
                            lockJobSelection: lockOperation && Boolean(jobId), lockOperationSelection: lockOperation && Boolean(jobOperationId), configurationParameters: configurationParameters && configurationParameters.length > 0
                                ? configurationParameters
                                : null, configReferenceSource: configReferenceSource }, actorContext)];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, serviceRole, canAutoApprove, now, currentYear, currentMonth, formData, isOverlay, validation, _d, actorKind, employeeId, supplierProcessId, operationUnitCost, operationMinimumCost, snapshotPricingEdited, notes, linesJson, jobOperationId, routingValidation, lines, mappedLines, _e, operation, operationError, _f, _g, result, _h, _j, _k, _l, _m, _o, _p;
        var request = _b.request;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "production"
                        })];
                case 1:
                    _c = _q.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, production_1.resolveProductionQuantityCanAutoApprove)(serviceRole, companyId, userId, 0)];
                case 2:
                    canAutoApprove = _q.sent();
                    now = new Date();
                    currentYear = now.getFullYear();
                    currentMonth = now.getMonth() + 1;
                    return [4 /*yield*/, request.formData()];
                case 3:
                    formData = _q.sent();
                    isOverlay = new URL(request.url).searchParams.get("overlay") === "true";
                    return [4 /*yield*/, (0, form_1.validator)(production_1.productionQuantityCreateFormValidator).validate(formData)];
                case 4:
                    validation = _q.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, actorKind = _d.actorKind, employeeId = _d.employeeId, supplierProcessId = _d.supplierProcessId, operationUnitCost = _d.operationUnitCost, operationMinimumCost = _d.operationMinimumCost, snapshotPricingEdited = _d.snapshotPricingEdited, notes = _d.notes, linesJson = _d.lines, jobOperationId = _d.jobOperationId;
                    return [4 /*yield*/, (0, production_1.validateActorMatchesOperationSupplierRouting)(client, jobOperationId, companyId, {
                            actorKind: actorKind,
                            employeeId: employeeId,
                            supplierProcessId: supplierProcessId
                        })];
                case 5:
                    routingValidation = _q.sent();
                    if (routingValidation.error) {
                        return [2 /*return*/, (0, form_1.validationError)({
                                fieldErrors: {
                                    supplierProcessId: routingValidation.error.message
                                },
                                formId: validation.formId
                            }, validation.submittedData)];
                    }
                    try {
                        lines = zod_1.z
                            .array(productionQuantityReport_models_1.productionQuantityLineJsonValidator)
                            .parse(JSON.parse(linesJson));
                    }
                    catch (_r) {
                        return [2 /*return*/, (0, form_1.validationError)({
                                fieldErrors: { lines: "Invalid quantity lines" },
                                formId: validation.formId
                            }, validation.submittedData)];
                    }
                    mappedLines = lines.map(function (line) { return (__assign(__assign({}, line), { scrapReasonId: line.type === "Scrap" ? line.scrapReasonId : undefined })); });
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("jobId")
                            .eq("id", jobOperationId)
                            .eq("companyId", companyId)
                            .single()];
                case 6:
                    _e = _q.sent(), operation = _e.data, operationError = _e.error;
                    if (!(operationError || !(operation === null || operation === void 0 ? void 0 : operation.jobId))) return [3 /*break*/, 8];
                    _f = react_router_1.data;
                    _g = [validation.submittedData];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(operationError, "Job operation not found"))];
                case 7: return [2 /*return*/, _f.apply(void 0, _g.concat([_q.sent()]))];
                case 8:
                    if (!(actorKind === "supplier")) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, production_1.createJobOperationSupplierQuantityReport)(client, {
                            companyId: companyId,
                            jobId: operation.jobId,
                            jobOperationId: jobOperationId,
                            supplierProcessId: supplierProcessId,
                            userId: userId,
                            notes: (notes === null || notes === void 0 ? void 0 : notes.trim()) ? notes : null,
                            lines: mappedLines,
                            snapshotPricing: operationUnitCost != null
                                ? {
                                    operationUnitCost: operationUnitCost,
                                    operationMinimumCost: operationMinimumCost !== null && operationMinimumCost !== void 0 ? operationMinimumCost : 0
                                }
                                : undefined,
                            snapshotPricingEdited: snapshotPricingEdited === "true"
                        })];
                case 9:
                    _h = _q.sent();
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, (0, production_1.createProductionQuantityReport)(client, {
                        companyId: companyId,
                        jobId: operation.jobId,
                        jobOperationId: jobOperationId,
                        userId: userId,
                        employeeId: (employeeId === null || employeeId === void 0 ? void 0 : employeeId.trim()) ? employeeId : userId,
                        notes: (notes === null || notes === void 0 ? void 0 : notes.trim()) ? notes : null,
                        lines: mappedLines,
                        paymentYear: canAutoApprove ? currentYear : null,
                        paymentMonth: canAutoApprove ? currentMonth : null
                    })];
                case 11:
                    _h = _q.sent();
                    _q.label = 12;
                case 12:
                    result = _h;
                    if (!result.error) return [3 /*break*/, 14];
                    _j = react_router_1.data;
                    _k = [validation.submittedData];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, result.error.message || "Failed to create process completion"))];
                case 13: return [2 /*return*/, _j.apply(void 0, _k.concat([_q.sent()]))];
                case 14:
                    if (!(actorKind !== "supplier")) return [3 /*break*/, 16];
                    return [4 /*yield*/, (0, production_1.recordBundleProductionReport)(client, {
                            jobId: operation.jobId,
                            companyId: companyId,
                            createdBy: userId,
                            lines: mappedLines
                        })];
                case 15:
                    _q.sent();
                    _q.label = 16;
                case 16:
                    if (!isOverlay) return [3 /*break*/, 18];
                    _l = react_router_1.data;
                    _m = [{ ok: true }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Process completion created"))];
                case 17: return [2 /*return*/, _l.apply(void 0, _m.concat([_q.sent()]))];
                case 18:
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.productionQuantities];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Process completion created"))];
                case 19: return [2 /*return*/, _o.apply(void 0, _p.concat([_q.sent()]))];
            }
        });
    });
}
function NewProductionQuantityRoute() {
    return null;
}
