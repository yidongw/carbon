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
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var jobs_1 = require("@carbon/jobs");
var react_router_1 = require("react-router");
var items_1 = require("~/modules/items");
var production_1 = require("~/modules/production");
var configTableOverlay_server_1 = require("~/modules/production/configTableOverlay.server");
var jobConfiguration_1 = require("~/modules/production/jobConfiguration");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function normalizeConfigurationValue(value) {
    var cfg = typeof value === "object" && value !== null && !Array.isArray(value)
        ? value
        : null;
    var configTable = Array.isArray(cfg === null || cfg === void 0 ? void 0 : cfg.configTable)
        ? cfg === null || cfg === void 0 ? void 0 : cfg.configTable
        : [];
    var configTablePrimaryKeys = Array.isArray(cfg === null || cfg === void 0 ? void 0 : cfg.configTablePrimaryKeys)
        ? (cfg === null || cfg === void 0 ? void 0 : cfg.configTablePrimaryKeys).filter(function (k) { return typeof k === "string"; })
        : ["Quantities"];
    return { configTable: configTable, configTablePrimaryKeys: configTablePrimaryKeys };
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, jobId, job, parameters, existingConfig, configTable, initialRows, historyResult, history, styleColors, colorNames, _i, _d, color;
        var _e, _f, _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        bypassRls: true
                    })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId;
                    jobId = params.jobId;
                    if (!jobId)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, (0, production_1.getJob)(client, jobId)];
                case 2:
                    job = _k.sent();
                    if (job.error || !((_e = job.data) === null || _e === void 0 ? void 0 : _e.itemId))
                        return [2 /*return*/, null];
                    return [4 /*yield*/, (0, items_1.getConfigurationParameters)(client, job.data.itemId, companyId)];
                case 3:
                    parameters = (_k.sent()).parameters;
                    if (parameters.length === 0)
                        return [2 /*return*/, null];
                    existingConfig = job.data.configuration;
                    configTable = existingConfig === null || existingConfig === void 0 ? void 0 : existingConfig.configTable;
                    initialRows = Array.isArray(configTable)
                        ? configTable
                        : undefined;
                    return [4 /*yield*/, (0, production_1.getJobConfigurationHistory)(client, jobId, companyId)];
                case 4:
                    historyResult = _k.sent();
                    history = ((_f = historyResult.data) !== null && _f !== void 0 ? _f : []).map(function (entry) {
                        var _a;
                        var createdByUser = Array.isArray(entry.createdByUser)
                            ? entry.createdByUser[0]
                            : entry.createdByUser;
                        return {
                            id: entry.id,
                            quantity: Number(entry.quantity) || 0,
                            configuration: normalizeConfigurationValue(entry.configuration),
                            createdAt: entry.createdAt,
                            createdByName: (_a = createdByUser === null || createdByUser === void 0 ? void 0 : createdByUser.fullName) !== null && _a !== void 0 ? _a : null
                        };
                    });
                    return [4 /*yield*/, (0, items_1.getStyleColorList)(client, companyId)];
                case 5:
                    styleColors = _k.sent();
                    colorNames = {};
                    for (_i = 0, _d = (_g = styleColors.data) !== null && _g !== void 0 ? _g : []; _i < _d.length; _i++) {
                        color = _d[_i];
                        if (color.colorCode) {
                            colorNames[color.colorCode] = (_h = color.colorName) !== null && _h !== void 0 ? _h : color.colorCode;
                        }
                    }
                    return [2 /*return*/, {
                            jobDisplayId: (_j = job.data.jobId) !== null && _j !== void 0 ? _j : null,
                            parameters: parameters,
                            initialRows: initialRows,
                            history: history,
                            colorNames: colorNames
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, jobId, viewClient, job, adjustment, _d, _e, _f, adjustmentTable, hasAdjustment, _g, _h, merged, _j, _k, update, _l, _m, historyInsert, _o, _p, recalcError_1;
        var _q, _r;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "production"
                        })];
                case 1:
                    _c = _s.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    jobId = params.jobId;
                    if (!jobId) {
                        throw (0, auth_1.notFound)("jobId not found");
                    }
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "production"
                        })];
                case 2:
                    viewClient = (_s.sent()).client;
                    return [4 /*yield*/, (0, production_1.getJob)(viewClient, jobId)];
                case 3:
                    job = _s.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, production_1.isJobLocked)((_q = job.data) === null || _q === void 0 ? void 0 : _q.status),
                            redirectTo: path_1.path.to.job(jobId),
                            message: "Cannot modify a locked job. Reopen it first."
                        })];
                case 4:
                    _s.sent();
                    _d = configTableOverlay_server_1.parseConfigurationFormValue;
                    return [4 /*yield*/, request.formData()];
                case 5:
                    adjustment = _d.apply(void 0, [(_s.sent()).get("adjustment")]);
                    if (!!adjustment) return [3 /*break*/, 7];
                    _e = react_router_1.data;
                    _f = [{ ok: false, error: "Invalid adjustment data" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Invalid adjustment data", "Update failed"))];
                case 6: return [2 /*return*/, _e.apply(void 0, _f.concat([_s.sent()]))];
                case 7:
                    adjustmentTable = normalizeConfigurationValue(adjustment);
                    hasAdjustment = adjustmentTable.configTable.some(function (row) {
                        return adjustmentTable.configTablePrimaryKeys.some(function (key) { return (Number(row[key]) || 0) !== 0; });
                    });
                    if (!!hasAdjustment) return [3 /*break*/, 9];
                    _g = react_router_1.data;
                    _h = [{ ok: false, error: "Enter an adjustment before saving" }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("No adjustment entered", "Update failed"))];
                case 8: return [2 /*return*/, _g.apply(void 0, _h.concat([_s.sent()]))];
                case 9:
                    merged = (0, jobConfiguration_1.applyConfigAdjustment)((_r = job.data) === null || _r === void 0 ? void 0 : _r.configuration, adjustment);
                    if (!merged.hasNegative) return [3 /*break*/, 11];
                    _j = react_router_1.data;
                    _k = [{
                            ok: false,
                            error: "Adjustment would make a quantity negative"
                        }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Adjustment would make a quantity negative", "Update failed"))];
                case 10: return [2 /*return*/, _j.apply(void 0, _k.concat([_s.sent()]))];
                case 11: return [4 /*yield*/, client
                        .from("job")
                        .update(__assign(__assign({}, (0, configTableOverlay_server_1.jobConfigurationUpdateFields)(merged.configuration)), { updatedBy: userId, updatedAt: new Date().toISOString() }))
                        .eq("id", jobId)
                        .eq("companyId", companyId)];
                case 12:
                    update = _s.sent();
                    if (!update.error) return [3 /*break*/, 14];
                    _l = react_router_1.data;
                    _m = [{ ok: false, error: update.error.message }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update configuration"))];
                case 13: return [2 /*return*/, _l.apply(void 0, _m.concat([_s.sent()]))];
                case 14: return [4 /*yield*/, client.from("jobConfigurationHistory").insert({
                        jobId: jobId,
                        companyId: companyId,
                        configuration: adjustmentTable,
                        quantity: merged.deltaTotal,
                        createdBy: userId
                    })];
                case 15:
                    historyInsert = _s.sent();
                    if (!historyInsert.error) return [3 /*break*/, 17];
                    _o = react_router_1.data;
                    _p = [{ ok: false, error: historyInsert.error.message }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(historyInsert.error, "Failed to record history"))];
                case 16: return [2 /*return*/, _o.apply(void 0, _p.concat([_s.sent()]))];
                case 17:
                    _s.trys.push([17, 19, , 20]);
                    return [4 /*yield*/, (0, jobs_1.trigger)("recalculate", {
                            type: "jobRequirements",
                            id: jobId,
                            companyId: companyId,
                            userId: userId
                        })];
                case 18:
                    _s.sent();
                    return [3 /*break*/, 20];
                case 19:
                    recalcError_1 = _s.sent();
                    console.error("[job config-table] failed to enqueue recalculate", recalcError_1);
                    return [3 /*break*/, 20];
                case 20: 
                // Toast is shown client-side when the job config overlay closes (translated).
                return [2 /*return*/, (0, react_router_1.data)((0, configTableOverlay_server_1.buildConfigTableActionResponse)(merged.configuration))];
            }
        });
    });
}
