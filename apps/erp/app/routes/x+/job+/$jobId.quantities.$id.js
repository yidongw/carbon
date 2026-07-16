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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.action = action;
exports.default = EditProductionQuantityRoute;
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
var operationType_1 = require("~/modules/production/operationType");
var productionQuantityReport_models_1 = require("~/modules/production/productionQuantityReport.models");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, isOverlay, id, jobId, target, token, redirectParams, query, _c, client, companyId, _d, job, jobOperations, operationOptions, jobConfig, jobIsConfigured, configurationParameters, _e, itemId, base, reportResult, actorContext_1, _f, report, reportError_1, activeLines, actorContext_2, _g, line, lineError, actorContext_3, productionQuantity, actorContext;
        var _h, _j, _k, _l, _m, _o;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    url = new URL(request.url);
                    isOverlay = url.searchParams.get("overlay") === "true";
                    id = params.id, jobId = params.jobId;
                    if (!id)
                        throw (0, auth_1.notFound)("id not found");
                    if (!jobId)
                        throw (0, auth_1.notFound)("jobId not found");
                    if (!isOverlay) {
                        target = overlay_1.overlay.to.editJobProductionQuantity({
                            jobId: jobId,
                            quantityId: id
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
                            view: "production"
                        })];
                case 1:
                    _c = _p.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getJob)(client, jobId),
                            (0, production_1.getJobOperations)(client, jobId)
                        ])];
                case 2:
                    _d = _p.sent(), job = _d[0], jobOperations = _d[1];
                    operationOptions = (_j = (_h = jobOperations.data) === null || _h === void 0 ? void 0 : _h.map(function (operation) {
                        var _a;
                        return ({
                            label: (_a = operation.description) !== null && _a !== void 0 ? _a : "",
                            value: operation.id
                        });
                    })) !== null && _j !== void 0 ? _j : [];
                    jobConfig = (_k = job.data) === null || _k === void 0 ? void 0 : _k.configuration;
                    jobIsConfigured = Array.isArray(jobConfig === null || jobConfig === void 0 ? void 0 : jobConfig.configTable) && jobConfig.configTable.length > 0;
                    if (!(((_l = job.data) === null || _l === void 0 ? void 0 : _l.itemId) && jobIsConfigured)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, items_1.getConfigurationParameters)(client, job.data.itemId, companyId)];
                case 3:
                    _e = (_p.sent())
                        .parameters;
                    return [3 /*break*/, 5];
                case 4:
                    _e = [];
                    _p.label = 5;
                case 5:
                    configurationParameters = _e;
                    itemId = (_o = (_m = job.data) === null || _m === void 0 ? void 0 : _m.itemId) !== null && _o !== void 0 ? _o : null;
                    base = {
                        operationOptions: operationOptions,
                        configurationParameters: configurationParameters.length > 0 ? configurationParameters : null,
                        itemId: itemId
                    };
                    if (!(0, operationType_1.isSupplierQuantityReportId)(id)) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, production_1.getJobOperationSupplierQuantityReport)(client, id, companyId)];
                case 6:
                    reportResult = _p.sent();
                    if (!reportResult.data) {
                        throw (0, auth_1.notFound)("Supplier quantity report not found");
                    }
                    return [4 /*yield*/, (0, production_1.getJobOperationActorContext)(client, reportResult.data.jobOperationId, companyId)];
                case 7:
                    actorContext_1 = _p.sent();
                    return [2 /*return*/, __assign(__assign(__assign({}, base), { mode: "supplier-report", supplierReport: reportResult.data, productionQuantity: null }), actorContext_1)];
                case 8:
                    if (!(0, operationType_1.isProductionQuantityReportId)(id)) return [3 /*break*/, 12];
                    return [4 /*yield*/, client
                            .from("productionQuantityReport")
                            .select("*")
                            .eq("id", id)
                            .eq("companyId", companyId)
                            .single()];
                case 9:
                    _f = _p.sent(), report = _f.data, reportError_1 = _f.error;
                    if (reportError_1 || !report) {
                        throw (0, auth_1.notFound)("Production quantity report not found");
                    }
                    return [4 /*yield*/, client
                            .from("productionQuantity")
                            .select("id, type, quantity, configuration, scrapReasonId, notes")
                            .eq("reportId", id)
                            .eq("companyId", companyId)
                            .is("invalidatedAt", null)];
                case 10:
                    activeLines = (_p.sent()).data;
                    return [4 /*yield*/, (0, production_1.getJobOperationActorContext)(client, report.jobOperationId, companyId)];
                case 11:
                    actorContext_2 = _p.sent();
                    return [2 /*return*/, __assign(__assign(__assign({}, base), { mode: "employee-report", employeeReport: __assign(__assign({}, report), { activeLines: activeLines !== null && activeLines !== void 0 ? activeLines : [] }), productionQuantity: null }), actorContext_2)];
                case 12:
                    if (!(0, operationType_1.isSupplierQuantityLineId)(id)) return [3 /*break*/, 15];
                    return [4 /*yield*/, client
                            .from("jobOperationSupplierQuantity")
                            .select("*, supplierProcess!jobOperationSupplierQuantity_supplierProcessId_fkey(id, supplierId)")
                            .eq("id", id)
                            .eq("companyId", companyId)
                            .single()];
                case 13:
                    _g = _p.sent(), line = _g.data, lineError = _g.error;
                    if (lineError || !line) {
                        throw (0, auth_1.notFound)("Supplier quantity line not found");
                    }
                    return [4 /*yield*/, (0, production_1.getJobOperationActorContext)(client, line.jobOperationId, companyId)];
                case 14:
                    actorContext_3 = _p.sent();
                    return [2 /*return*/, __assign(__assign(__assign({}, base), { mode: "supplier-line", productionQuantity: line }), actorContext_3)];
                case 15: return [4 /*yield*/, (0, production_1.getProductionQuantity)(client, id)];
                case 16:
                    productionQuantity = _p.sent();
                    if (!productionQuantity.data) {
                        throw (0, auth_1.notFound)("Production quantity not found");
                    }
                    return [4 /*yield*/, (0, production_1.getJobOperationActorContext)(client, productionQuantity.data.jobOperationId, companyId)];
                case 17:
                    actorContext = _p.sent();
                    return [2 /*return*/, __assign(__assign(__assign({}, base), { mode: "employee-line", productionQuantity: productionQuantity.data }), actorContext)];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, serviceRole, resolveCanAutoApprove, now, currentYear, currentMonth, jobId, id, viewClient, job, isOverlay, formData_1, validation_1, _d, notes, linesJson, lines_1, mappedLines, canAutoApprove_1, _e, update_1, _f, _g, _h, _j, _k, _l, _m, formData, validation, _o, lineId, rawConfiguration, _employeeId, rest, configuration, isSupplierLine, existing, _p, reportId, _q, _r, linesTable, _s, activeLines, linesError, _t, _u, lines, canAutoApprove, _v, update, _w, _x, _y, _z, _0, _1, _2;
        var _this = this;
        var _3, _4, _5;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_6) {
            switch (_6.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "production"
                        })];
                case 1:
                    _c = _6.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    resolveCanAutoApprove = function (reportId) { return __awaiter(_this, void 0, void 0, function () {
                        var amount, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(reportId != null)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, production_1.computeProductionQuantityReportEarnedAmount)(serviceRole, reportId, companyId)];
                                case 1:
                                    _a = _b.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    _a = 0;
                                    _b.label = 3;
                                case 3:
                                    amount = _a;
                                    return [2 /*return*/, (0, production_1.resolveProductionQuantityCanAutoApprove)(serviceRole, companyId, userId, amount)];
                            }
                        });
                    }); };
                    now = new Date();
                    currentYear = now.getFullYear();
                    currentMonth = now.getMonth() + 1;
                    jobId = params.jobId, id = params.id;
                    if (!jobId)
                        throw (0, auth_1.notFound)("jobId not found");
                    if (!id)
                        throw (0, auth_1.notFound)("id not found");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "production"
                        })];
                case 2:
                    viewClient = (_6.sent()).client;
                    return [4 /*yield*/, (0, production_1.getJob)(viewClient, jobId)];
                case 3:
                    job = _6.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, production_1.isJobLocked)((_3 = job.data) === null || _3 === void 0 ? void 0 : _3.status),
                            redirectTo: path_1.path.to.job(jobId),
                            message: "Cannot modify a locked job. Reopen it first."
                        })];
                case 4:
                    _6.sent();
                    isOverlay = new URL(request.url).searchParams.get("overlay") === "true";
                    if (!((0, operationType_1.isSupplierQuantityReportId)(id) || (0, operationType_1.isProductionQuantityReportId)(id))) return [3 /*break*/, 21];
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData_1 = _6.sent();
                    return [4 /*yield*/, (0, form_1.validator)(production_1.productionQuantityCreateFormValidator).validate(formData_1)];
                case 6:
                    validation_1 = _6.sent();
                    if (validation_1.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation_1.error)];
                    }
                    _d = validation_1.data, notes = _d.notes, linesJson = _d.lines;
                    try {
                        lines_1 = zod_1.z
                            .array(productionQuantityReport_models_1.productionQuantityLineJsonValidator)
                            .parse(JSON.parse(linesJson));
                    }
                    catch (parseError) {
                        console.error(parseError);
                        return [2 /*return*/, (0, form_1.validationError)({
                                fieldErrors: { lines: "Invalid quantity lines" },
                                formId: validation_1.formId
                            }, validation_1.submittedData)];
                    }
                    mappedLines = lines_1.map(function (line) { return (__assign(__assign({}, line), { scrapReasonId: line.type === "Scrap" ? line.scrapReasonId : undefined })); });
                    if (!(0, operationType_1.isProductionQuantityReportId)(id)) return [3 /*break*/, 8];
                    return [4 /*yield*/, resolveCanAutoApprove(id)];
                case 7:
                    _e = _6.sent();
                    return [3 /*break*/, 9];
                case 8:
                    _e = false;
                    _6.label = 9;
                case 9:
                    canAutoApprove_1 = _e;
                    if (!(0, operationType_1.isSupplierQuantityReportId)(id)) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, production_1.replaceJobOperationSupplierQuantityReportLines)(client, {
                            reportId: id,
                            companyId: companyId,
                            userId: userId,
                            notes: (notes === null || notes === void 0 ? void 0 : notes.trim()) ? notes : null,
                            lines: mappedLines
                        })];
                case 10:
                    _f = _6.sent();
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, (0, production_1.replaceProductionQuantityReportLines)(client, {
                        reportId: id,
                        companyId: companyId,
                        userId: userId,
                        notes: (notes === null || notes === void 0 ? void 0 : notes.trim()) ? notes : null,
                        lines: mappedLines,
                        paymentYear: canAutoApprove_1 ? currentYear : null,
                        paymentMonth: canAutoApprove_1 ? currentMonth : null
                    })];
                case 12:
                    _f = _6.sent();
                    _6.label = 13;
                case 13:
                    update_1 = _f;
                    if (!update_1.error) return [3 /*break*/, 15];
                    _g = react_router_1.data;
                    _h = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update_1.error, "Failed to update process completion"))];
                case 14: return [2 /*return*/, _g.apply(void 0, _h.concat([_6.sent()]))];
                case 15:
                    if (!!(0, operationType_1.isSupplierQuantityReportId)(id)) return [3 /*break*/, 17];
                    return [4 /*yield*/, (0, production_1.syncProductionQuantityReportApproval)(serviceRole, {
                            reportId: id,
                            companyId: companyId,
                            userId: userId,
                            canAutoApprove: canAutoApprove_1,
                            paymentYear: canAutoApprove_1 ? currentYear : null,
                            paymentMonth: canAutoApprove_1 ? currentMonth : null
                        })];
                case 16:
                    _6.sent();
                    _6.label = 17;
                case 17:
                    if (!isOverlay) return [3 /*break*/, 19];
                    _j = react_router_1.data;
                    _k = [{ ok: true, jobId: jobId }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated process completion"))];
                case 18: return [2 /*return*/, _j.apply(void 0, _k.concat([_6.sent()]))];
                case 19:
                    _l = react_router_1.redirect;
                    _m = ["".concat(path_1.path.to.jobProductionQuantities(jobId), "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated process completion"))];
                case 20: return [2 /*return*/, _l.apply(void 0, _m.concat([_6.sent()]))];
                case 21: return [4 /*yield*/, request.formData()];
                case 22:
                    formData = _6.sent();
                    return [4 /*yield*/, (0, form_1.validator)(production_1.productionQuantityValidator).validate(formData)];
                case 23:
                    validation = _6.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _o = validation.data, lineId = _o.id, rawConfiguration = _o.configuration, _employeeId = _o.employeeId, rest = __rest(_o, ["id", "configuration", "employeeId"]);
                    if (!lineId)
                        throw new Error("id not found");
                    if (rest.type !== "Scrap") {
                        rest.scrapReasonId = undefined;
                    }
                    if (rawConfiguration) {
                        try {
                            configuration =
                                typeof rawConfiguration === "string"
                                    ? JSON.parse(rawConfiguration)
                                    : rawConfiguration;
                        }
                        catch (parseError) {
                            console.error(parseError);
                        }
                    }
                    isSupplierLine = (0, operationType_1.isSupplierQuantityLineId)(lineId);
                    if (!isSupplierLine) return [3 /*break*/, 25];
                    return [4 /*yield*/, client
                            .from("jobOperationSupplierQuantity")
                            .select("reportId")
                            .eq("id", lineId)
                            .eq("companyId", companyId)
                            .single()];
                case 24:
                    _p = _6.sent();
                    return [3 /*break*/, 27];
                case 25: return [4 /*yield*/, (0, production_1.getProductionQuantity)(client, lineId)];
                case 26:
                    _p = _6.sent();
                    _6.label = 27;
                case 27:
                    existing = _p;
                    reportId = isSupplierLine
                        ? (_4 = existing.data) === null || _4 === void 0 ? void 0 : _4.reportId
                        : (_5 = existing.data) === null || _5 === void 0 ? void 0 : _5.reportId;
                    if (!!reportId) return [3 /*break*/, 29];
                    _q = react_router_1.data;
                    _r = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Quantity report not found"))];
                case 28: return [2 /*return*/, _q.apply(void 0, _r.concat([_6.sent()]))];
                case 29:
                    linesTable = isSupplierLine
                        ? "jobOperationSupplierQuantity"
                        : "productionQuantity";
                    return [4 /*yield*/, client
                            .from(linesTable)
                            .select("id, type, quantity, configuration, scrapReasonId, notes")
                            .eq("reportId", reportId)
                            .eq("companyId", companyId)
                            .is("invalidatedAt", null)];
                case 30:
                    _s = _6.sent(), activeLines = _s.data, linesError = _s.error;
                    if (!linesError) return [3 /*break*/, 32];
                    _t = react_router_1.data;
                    _u = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(linesError, "Failed to load report lines"))];
                case 31: return [2 /*return*/, _t.apply(void 0, _u.concat([_6.sent()]))];
                case 32:
                    lines = (activeLines !== null && activeLines !== void 0 ? activeLines : []).map(function (line) {
                        var _a, _b, _c;
                        return line.id === lineId
                            ? {
                                type: rest.type,
                                quantity: rest.quantity,
                                configuration: configuration,
                                scrapReasonId: rest.scrapReasonId,
                                notes: rest.notes
                            }
                            : {
                                type: line.type,
                                quantity: line.quantity,
                                configuration: (_a = line.configuration) !== null && _a !== void 0 ? _a : undefined,
                                scrapReasonId: (_b = line.scrapReasonId) !== null && _b !== void 0 ? _b : undefined,
                                notes: (_c = line.notes) !== null && _c !== void 0 ? _c : undefined
                            };
                    });
                    if (!!isSupplierLine) return [3 /*break*/, 34];
                    return [4 /*yield*/, resolveCanAutoApprove(reportId)];
                case 33:
                    _v = _6.sent();
                    return [3 /*break*/, 35];
                case 34:
                    _v = false;
                    _6.label = 35;
                case 35:
                    canAutoApprove = _v;
                    if (!isSupplierLine) return [3 /*break*/, 37];
                    return [4 /*yield*/, (0, production_1.replaceJobOperationSupplierQuantityReportLines)(client, {
                            reportId: reportId,
                            companyId: companyId,
                            userId: userId,
                            notes: null,
                            lines: lines
                        })];
                case 36:
                    _w = _6.sent();
                    return [3 /*break*/, 39];
                case 37: return [4 /*yield*/, (0, production_1.replaceProductionQuantityReportLines)(client, {
                        reportId: reportId,
                        companyId: companyId,
                        userId: userId,
                        lines: lines,
                        paymentYear: canAutoApprove ? currentYear : null,
                        paymentMonth: canAutoApprove ? currentMonth : null
                    })];
                case 38:
                    _w = _6.sent();
                    _6.label = 39;
                case 39:
                    update = _w;
                    if (!update.error) return [3 /*break*/, 41];
                    _x = react_router_1.data;
                    _y = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update process completion"))];
                case 40: return [2 /*return*/, _x.apply(void 0, _y.concat([_6.sent()]))];
                case 41:
                    if (!!isSupplierLine) return [3 /*break*/, 43];
                    return [4 /*yield*/, (0, production_1.syncProductionQuantityReportApproval)(serviceRole, {
                            reportId: reportId,
                            companyId: companyId,
                            userId: userId,
                            canAutoApprove: canAutoApprove,
                            paymentYear: canAutoApprove ? currentYear : null,
                            paymentMonth: canAutoApprove ? currentMonth : null
                        })];
                case 42:
                    _6.sent();
                    _6.label = 43;
                case 43:
                    if (!isOverlay) return [3 /*break*/, 45];
                    _z = react_router_1.data;
                    _0 = [{ ok: true, jobId: jobId }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated process completion"))];
                case 44: return [2 /*return*/, _z.apply(void 0, _0.concat([_6.sent()]))];
                case 45:
                    _1 = react_router_1.redirect;
                    _2 = ["".concat(path_1.path.to.jobProductionQuantities(jobId), "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated process completion"))];
                case 46: return [2 /*return*/, _1.apply(void 0, _2.concat([_6.sent()]))];
            }
        });
    });
}
function EditProductionQuantityRoute() {
    return null;
}
