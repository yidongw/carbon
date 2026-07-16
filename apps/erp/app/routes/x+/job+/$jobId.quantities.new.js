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
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, isOverlay, jobId, jobOperationId_1, target, token, redirectParams, query, _c, client, companyId, jobOperationId, _d, job, jobOperations, opContext, seededActor, actorContext, jobConfig, jobIsConfigured, configurationParameters, _e, itemId, jobOption, configReferenceSource, operationOptions, remainingByOperationId, _i, _f, op;
        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_y) {
            switch (_y.label) {
                case 0:
                    url = new URL(request.url);
                    isOverlay = url.searchParams.get("overlay") === "true";
                    jobId = params.jobId;
                    if (!jobId)
                        throw (0, auth_1.notFound)("jobId not found");
                    if (!isOverlay) {
                        jobOperationId_1 = (_g = url.searchParams.get("jobOperationId")) !== null && _g !== void 0 ? _g : "";
                        target = overlay_1.overlay.to.newJobProductionQuantity({
                            jobId: jobId,
                            jobOperationId: jobOperationId_1 || undefined
                        });
                        token = (0, overlay_1.overlayToken)(target);
                        redirectParams = new URLSearchParams();
                        if (token)
                            redirectParams.append(overlay_1.OVERLAY_PARAM, token);
                        query = (0, overlay_1.serializeSearch)(redirectParams);
                        throw (0, react_router_1.redirect)(query
                            ? "".concat(path_1.path.to.jobProductionQuantities(jobId), "?").concat(query)
                            : path_1.path.to.jobProductionQuantities(jobId));
                    }
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "production"
                        })];
                case 1:
                    _c = _y.sent(), client = _c.client, companyId = _c.companyId;
                    jobOperationId = (_h = url.searchParams.get("jobOperationId")) !== null && _h !== void 0 ? _h : "";
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getJob)(client, jobId),
                            (0, production_1.getJobOperations)(client, jobId),
                            (0, production_1.getJobOperationActorContext)(client, jobOperationId, companyId)
                        ])];
                case 2:
                    _d = _y.sent(), job = _d[0], jobOperations = _d[1], opContext = _d[2];
                    seededActor = (0, production_1.seededActorFromOperationContext)(opContext);
                    actorContext = __assign(__assign({}, opContext), { defaultActorKind: (0, production_1.defaultActorKindFromOperationType)(opContext.operationType), seededActor: seededActor, lockActorSelection: seededActor.lockActorSelection });
                    jobConfig = (_j = job.data) === null || _j === void 0 ? void 0 : _j.configuration;
                    jobIsConfigured = Array.isArray(jobConfig === null || jobConfig === void 0 ? void 0 : jobConfig.configTable) && jobConfig.configTable.length > 0;
                    if (!(((_k = job.data) === null || _k === void 0 ? void 0 : _k.itemId) && jobIsConfigured)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, items_1.getConfigurationParameters)(client, job.data.itemId, companyId)];
                case 3:
                    _e = (_y.sent())
                        .parameters;
                    return [3 /*break*/, 5];
                case 4:
                    _e = [];
                    _y.label = 5;
                case 5:
                    configurationParameters = _e;
                    itemId = (_m = (_l = job.data) === null || _l === void 0 ? void 0 : _l.itemId) !== null && _m !== void 0 ? _m : null;
                    jobOption = {
                        label: (_p = (_o = job.data) === null || _o === void 0 ? void 0 : _o.jobId) !== null && _p !== void 0 ? _p : "",
                        value: jobId
                    };
                    return [4 /*yield*/, (0, configTableOverlay_server_1.getConfigReferenceSourceForOperation)(client, {
                            jobId: jobId,
                            jobOperationId: jobOperationId || undefined,
                            companyId: companyId,
                            reportKind: "productionQuantity"
                        })];
                case 6:
                    configReferenceSource = _y.sent();
                    operationOptions = (_r = (_q = jobOperations === null || jobOperations === void 0 ? void 0 : jobOperations.data) === null || _q === void 0 ? void 0 : _q.map(function (operation) {
                        var _a;
                        return ({
                            label: (_a = operation.description) !== null && _a !== void 0 ? _a : "",
                            value: operation.id
                        });
                    })) !== null && _r !== void 0 ? _r : [];
                    remainingByOperationId = {};
                    for (_i = 0, _f = (_s = jobOperations === null || jobOperations === void 0 ? void 0 : jobOperations.data) !== null && _s !== void 0 ? _s : []; _i < _f.length; _i++) {
                        op = _f[_i];
                        if (!op.id)
                            continue;
                        remainingByOperationId[op.id] = Math.max(0, ((_u = (_t = op.targetQuantity) !== null && _t !== void 0 ? _t : op.operationQuantity) !== null && _u !== void 0 ? _u : 0) -
                            ((_v = op.quantityComplete) !== null && _v !== void 0 ? _v : 0) -
                            ((_w = op.quantityScrapped) !== null && _w !== void 0 ? _w : 0) -
                            ((_x = op.quantityReworked) !== null && _x !== void 0 ? _x : 0));
                    }
                    return [2 /*return*/, __assign({ jobId: jobId, jobOption: jobOption, jobOperationId: jobOperationId, operationOptions: operationOptions, remainingByOperationId: remainingByOperationId, configurationParameters: configurationParameters.length > 0 ? configurationParameters : null, configReferenceSource: configReferenceSource, itemId: itemId }, actorContext)];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, serviceRole, canAutoApprove, now, currentYear, currentMonth, jobId, viewClient, job, isOverlay, formData, validation, _d, actorKind, employeeId, supplierProcessId, operationUnitCost, operationMinimumCost, snapshotPricingEdited, notes, linesJson, jobOperationId, routingValidation, lines, mappedLines, operationCheck, _e, _f, reportResult, _g, _h, _j, _k, _l, _m, _o;
        var _p, _q;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "production"
                        })];
                case 1:
                    _c = _r.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, production_1.resolveProductionQuantityCanAutoApprove)(serviceRole, companyId, userId, 0)];
                case 2:
                    canAutoApprove = _r.sent();
                    now = new Date();
                    currentYear = now.getFullYear();
                    currentMonth = now.getMonth() + 1;
                    jobId = params.jobId;
                    if (!jobId) {
                        throw (0, auth_1.notFound)("jobId not found");
                    }
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "production"
                        })];
                case 3:
                    viewClient = (_r.sent()).client;
                    return [4 /*yield*/, (0, production_1.getJob)(viewClient, jobId)];
                case 4:
                    job = _r.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, production_1.isJobLocked)((_p = job.data) === null || _p === void 0 ? void 0 : _p.status),
                            redirectTo: path_1.path.to.job(jobId),
                            message: "Cannot modify a locked job. Reopen it first."
                        })];
                case 5:
                    _r.sent();
                    isOverlay = new URL(request.url).searchParams.get("overlay") === "true";
                    return [4 /*yield*/, request.formData()];
                case 6:
                    formData = _r.sent();
                    return [4 /*yield*/, (0, form_1.validator)(production_1.productionQuantityCreateFormValidator).validate(formData)];
                case 7:
                    validation = _r.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, actorKind = _d.actorKind, employeeId = _d.employeeId, supplierProcessId = _d.supplierProcessId, operationUnitCost = _d.operationUnitCost, operationMinimumCost = _d.operationMinimumCost, snapshotPricingEdited = _d.snapshotPricingEdited, notes = _d.notes, linesJson = _d.lines, jobOperationId = _d.jobOperationId;
                    return [4 /*yield*/, (0, production_1.validateActorMatchesOperationSupplierRouting)(client, jobOperationId, companyId, { actorKind: actorKind, employeeId: employeeId, supplierProcessId: supplierProcessId })];
                case 8:
                    routingValidation = _r.sent();
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
                    catch (parseError) {
                        console.error(parseError);
                        return [2 /*return*/, (0, form_1.validationError)({
                                fieldErrors: { lines: "Invalid quantity lines" },
                                formId: validation.formId
                            }, validation.submittedData)];
                    }
                    mappedLines = lines.map(function (line) { return (__assign(__assign({}, line), { scrapReasonId: line.type === "Scrap" ? line.scrapReasonId : undefined })); });
                    if (!(actorKind === "supplier")) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, production_1.assertSupplierQuantityAllowedForOperation)(client, jobOperationId, companyId)];
                case 9:
                    operationCheck = _r.sent();
                    if (!operationCheck.error) return [3 /*break*/, 11];
                    _e = react_router_1.data;
                    _f = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(operationCheck.error, (_q = operationCheck.error.message) !== null && _q !== void 0 ? _q : "Supplier quantities cannot be recorded for Inside operations"))];
                case 10: return [2 /*return*/, _e.apply(void 0, _f.concat([_r.sent()]))];
                case 11:
                    if (!(actorKind === "supplier")) return [3 /*break*/, 13];
                    return [4 /*yield*/, (0, production_1.createJobOperationSupplierQuantityReport)(client, {
                            companyId: companyId,
                            jobId: jobId,
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
                            snapshotPricingEdited: snapshotPricingEdited === "1"
                        })];
                case 12:
                    _g = _r.sent();
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, (0, production_1.createProductionQuantityReport)(client, {
                        companyId: companyId,
                        jobId: jobId,
                        jobOperationId: jobOperationId,
                        userId: userId,
                        employeeId: (employeeId === null || employeeId === void 0 ? void 0 : employeeId.trim()) ? employeeId : userId,
                        notes: (notes === null || notes === void 0 ? void 0 : notes.trim()) ? notes : null,
                        lines: mappedLines,
                        paymentYear: canAutoApprove ? currentYear : null,
                        paymentMonth: canAutoApprove ? currentMonth : null
                    })];
                case 14:
                    _g = _r.sent();
                    _r.label = 15;
                case 15:
                    reportResult = _g;
                    if (!reportResult.error) return [3 /*break*/, 17];
                    _h = react_router_1.data;
                    _j = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(reportResult.error, reportResult.error.message || "Failed to insert process completion"))];
                case 16: return [2 /*return*/, _h.apply(void 0, _j.concat([_r.sent()]))];
                case 17:
                    if (!isOverlay) return [3 /*break*/, 19];
                    _k = react_router_1.data;
                    _l = [{ ok: true, jobId: jobId }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Process completion created"))];
                case 18: return [2 /*return*/, _k.apply(void 0, _l.concat([_r.sent()]))];
                case 19:
                    _m = react_router_1.redirect;
                    _o = ["".concat(path_1.path.to.jobProductionQuantities(jobId), "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Process completion created"))];
                case 20: return [2 /*return*/, _m.apply(void 0, _o.concat([_r.sent()]))];
            }
        });
    });
}
function NewProductionQuantityRoute() {
    return null;
}
