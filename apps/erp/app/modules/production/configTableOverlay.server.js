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
exports.buildConfigTableActionResponse = void 0;
exports.jobConfigurationUpdateFields = jobConfigurationUpdateFields;
exports.parseConfigurationFormValue = parseConfigurationFormValue;
exports.parseInitialConfigurationFromRequest = parseInitialConfigurationFromRequest;
exports.getConfigReferenceSourceForOperation = getConfigReferenceSourceForOperation;
exports.getReportedConfigurationById = getReportedConfigurationById;
exports.resolveJobIdForOperation = resolveJobIdForOperation;
exports.resolveConfigTableReferenceContext = resolveConfigTableReferenceContext;
exports.parseReferenceContextFromRequest = parseReferenceContextFromRequest;
var configParamsTableColumns_1 = require("./configParamsTableColumns");
var configTableOverlay_1 = require("./configTableOverlay");
Object.defineProperty(exports, "buildConfigTableActionResponse", { enumerable: true, get: function () { return configTableOverlay_1.buildConfigTableActionResponse; } });
var jobConfiguration_1 = require("./jobConfiguration");
var production_service_1 = require("./production.service");
/** Persist configuration and keep `job.quantity` in sync with the config table total. */
function jobConfigurationUpdateFields(configuration) {
    return {
        configuration: configuration,
        quantity: (0, jobConfiguration_1.computeJobConfigTableTotal)(configuration)
    };
}
function parseConfigurationFormValue(raw) {
    if (typeof raw !== "string" || !raw)
        return null;
    try {
        var parsed = JSON.parse(raw);
        if (typeof parsed !== "object" ||
            parsed === null ||
            Array.isArray(parsed)) {
            return null;
        }
        return parsed;
    }
    catch (_a) {
        return null;
    }
}
function parseInitialConfigurationFromRequest(request) {
    var raw = new URL(request.url).searchParams.get("configuration");
    if (!raw)
        return undefined;
    try {
        var parsed = JSON.parse(raw);
        if (typeof parsed !== "object" ||
            parsed === null ||
            Array.isArray(parsed)) {
            return undefined;
        }
        var configTable = parsed.configTable;
        return Array.isArray(configTable)
            ? configTable
            : undefined;
    }
    catch (_a) {
        return undefined;
    }
}
function getConfigReferenceSourceForOperation(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var job, jobConfiguration, _c, employeePickups, supplierPickups, reportedConfigurations_1, _d, quantities, pickups, reportedConfigurations, reportedConfigurationsByEmployee, _i, _e, row, pickupsByEmployee, _f, _g, pickup;
        var _h, _j, _k, _l, _m, _o, _p;
        var jobId = _b.jobId, jobOperationId = _b.jobOperationId, companyId = _b.companyId, reportKind = _b.reportKind;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0: return [4 /*yield*/, (0, production_service_1.getJob)(client, jobId)];
                case 1:
                    job = _q.sent();
                    jobConfiguration = (_j = (_h = job.data) === null || _h === void 0 ? void 0 : _h.configuration) !== null && _j !== void 0 ? _j : null;
                    if (!jobConfiguration)
                        return [2 /*return*/, null];
                    if (!jobOperationId) {
                        return [2 /*return*/, { jobConfiguration: jobConfiguration, reportedConfigurations: [] }];
                    }
                    if (!(reportKind === "pickup")) return [3 /*break*/, 3];
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("jobOperationPickup")
                                .select("configuration")
                                .eq("jobOperationId", jobOperationId)
                                .eq("companyId", companyId),
                            client
                                .from("jobOperationSupplierPickup")
                                .select("configuration")
                                .eq("jobOperationId", jobOperationId)
                                .eq("companyId", companyId)
                        ])];
                case 2:
                    _c = _q.sent(), employeePickups = _c[0], supplierPickups = _c[1];
                    reportedConfigurations_1 = __spreadArray(__spreadArray([], ((_k = employeePickups.data) !== null && _k !== void 0 ? _k : []), true), ((_l = supplierPickups.data) !== null && _l !== void 0 ? _l : []), true).map(function (row) { return row.configuration; })
                        .filter(function (config) { return config != null; });
                    return [2 /*return*/, { jobConfiguration: jobConfiguration, reportedConfigurations: reportedConfigurations_1 }];
                case 3: return [4 /*yield*/, Promise.all([
                        client
                            .from("productionQuantity")
                            .select("employeeId, configuration")
                            .eq("jobOperationId", jobOperationId)
                            .eq("companyId", companyId)
                            .eq("type", "Production")
                            .is("invalidatedAt", null),
                        client
                            .from("jobOperationPickup")
                            .select("employeeId, quantity, configuration")
                            .eq("jobOperationId", jobOperationId)
                            .eq("companyId", companyId)
                    ])];
                case 4:
                    _d = _q.sent(), quantities = _d[0], pickups = _d[1];
                    reportedConfigurations = ((_m = quantities.data) !== null && _m !== void 0 ? _m : [])
                        .map(function (row) { return row.configuration; })
                        .filter(function (config) { return config != null; });
                    reportedConfigurationsByEmployee = {};
                    for (_i = 0, _e = (_o = quantities.data) !== null && _o !== void 0 ? _o : []; _i < _e.length; _i++) {
                        row = _e[_i];
                        if (!row.employeeId || row.configuration == null)
                            continue;
                        if (!reportedConfigurationsByEmployee[row.employeeId]) {
                            reportedConfigurationsByEmployee[row.employeeId] = [];
                        }
                        reportedConfigurationsByEmployee[row.employeeId].push(row.configuration);
                    }
                    pickupsByEmployee = {};
                    for (_f = 0, _g = (_p = pickups.data) !== null && _p !== void 0 ? _p : []; _f < _g.length; _f++) {
                        pickup = _g[_f];
                        if (!pickup.employeeId)
                            continue;
                        if (!pickupsByEmployee[pickup.employeeId]) {
                            pickupsByEmployee[pickup.employeeId] = [];
                        }
                        pickupsByEmployee[pickup.employeeId].push({
                            quantity: pickup.quantity,
                            configuration: pickup.configuration
                        });
                    }
                    return [2 /*return*/, {
                            jobConfiguration: jobConfiguration,
                            reportedConfigurations: reportedConfigurations,
                            reportedConfigurationsByEmployee: reportedConfigurationsByEmployee,
                            pickupsByEmployee: pickupsByEmployee
                        }];
            }
        });
    });
}
/**
 * Read a single reported row's saved configuration by record id. Used as the
 * deep-link fallback for the read-only `itemConfigTable` overlay: in-app it
 * gets the config via props, but a pasted URL has only the record id.
 */
function getReportedConfigurationById(client_1, _a) {
    return __awaiter(this, arguments, void 0, function (client, _b) {
        var table, data;
        var _c;
        var recordId = _b.recordId, reportKind = _b.reportKind, companyId = _b.companyId;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    table = reportKind === "pickup" ? "jobOperationPickup" : "productionQuantity";
                    return [4 /*yield*/, client
                            .from(table)
                            .select("configuration")
                            .eq("id", recordId)
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 1:
                    data = (_d.sent()).data;
                    return [2 /*return*/, (_c = data === null || data === void 0 ? void 0 : data.configuration) !== null && _c !== void 0 ? _c : null];
            }
        });
    });
}
function resolveJobIdForOperation(client, companyId, jobOperationId, jobId) {
    return __awaiter(this, void 0, void 0, function () {
        var trimmedJobId, operation;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    trimmedJobId = jobId === null || jobId === void 0 ? void 0 : jobId.trim();
                    if (trimmedJobId)
                        return [2 /*return*/, trimmedJobId];
                    return [4 /*yield*/, client
                            .from("jobOperation")
                            .select("jobId")
                            .eq("id", jobOperationId)
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 1:
                    operation = (_b.sent()).data;
                    return [2 /*return*/, ((_a = operation === null || operation === void 0 ? void 0 : operation.jobId) === null || _a === void 0 ? void 0 : _a.trim()) || undefined];
            }
        });
    });
}
function resolveConfigTableReferenceContext(client, companyId, referenceContext) {
    return __awaiter(this, void 0, void 0, function () {
        var jobOperationId, jobId, source;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    jobOperationId = (_a = referenceContext.jobOperationId) === null || _a === void 0 ? void 0 : _a.trim();
                    if (!jobOperationId) {
                        return [2 /*return*/, referenceContext];
                    }
                    return [4 /*yield*/, resolveJobIdForOperation(client, companyId, jobOperationId, referenceContext.jobId)];
                case 1:
                    jobId = _c.sent();
                    if (!jobId) {
                        return [2 /*return*/, referenceContext];
                    }
                    return [4 /*yield*/, getConfigReferenceSourceForOperation(client, {
                            jobId: jobId,
                            jobOperationId: jobOperationId,
                            companyId: companyId,
                            reportKind: "productionQuantity"
                        })];
                case 2:
                    source = _c.sent();
                    if (!source) {
                        return [2 /*return*/, referenceContext];
                    }
                    return [2 /*return*/, (0, configParamsTableColumns_1.buildJobRemainingReferenceContext)(source, {
                            employeeId: referenceContext.employeeId,
                            siblingLineConfigurations: (_b = referenceContext.siblingLineConfigurations) !== null && _b !== void 0 ? _b : []
                        })];
            }
        });
    });
}
function parseReferenceContextFromRequest(request) {
    var raw = new URL(request.url).searchParams.get("referenceContext");
    if (!raw)
        return undefined;
    try {
        var parsed = JSON.parse(raw);
        if (typeof parsed !== "object" ||
            parsed === null ||
            Array.isArray(parsed)) {
            return undefined;
        }
        var ctx = parsed;
        if (ctx.mode !== "original" && ctx.mode !== "remaining") {
            return undefined;
        }
        var otherLineConfigurations = Array.isArray(ctx.otherLineConfigurations)
            ? ctx.otherLineConfigurations
            : [];
        var jobId = typeof ctx.jobId === "string" ? ctx.jobId : undefined;
        var jobOperationId = typeof ctx.jobOperationId === "string" ? ctx.jobOperationId : undefined;
        if (otherLineConfigurations.length === 0 &&
            ctx.originalConfiguration == null &&
            !((jobId === null || jobId === void 0 ? void 0 : jobId.trim()) && (jobOperationId === null || jobOperationId === void 0 ? void 0 : jobOperationId.trim()))) {
            return undefined;
        }
        return {
            mode: ctx.mode,
            originalConfiguration: ctx.originalConfiguration,
            otherLineConfigurations: otherLineConfigurations,
            employeeId: typeof ctx.employeeId === "string" ? ctx.employeeId : undefined,
            jobId: jobId,
            jobOperationId: jobOperationId,
            siblingLineConfigurations: Array.isArray(ctx.siblingLineConfigurations)
                ? ctx.siblingLineConfigurations
                : undefined
        };
    }
    catch (_a) {
        return undefined;
    }
}
