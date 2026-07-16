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
var server_ts_1 = require("https://deno.land/std@0.175.0/http/server.ts");
var mod_ts_1 = require("https://deno.land/std@0.205.0/datetime/mod.ts");
var mod_ts_2 = require("https://deno.land/x/nanoid@v3.0.0/mod.ts");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var database_ts_1 = require("../lib/database.ts");
var headers_ts_1 = require("../lib/headers.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var utils_ts_1 = require("../lib/utils.ts");
var get_accounting_period_ts_1 = require("../shared/get-accounting-period.ts");
var get_next_sequence_ts_1 = require("../shared/get-next-sequence.ts");
var get_posting_group_ts_1 = require("../shared/get-posting-group.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var payloadValidator = npm_zod__3_24_1_1.default.object({
    productionEventId: npm_zod__3_24_1_1.default.string(),
    userId: npm_zod__3_24_1_1.default.string(),
    companyId: npm_zod__3_24_1_1.default.string(),
});
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, today, _a, productionEventId_1, userId_1, companyId_1, client, _b, accountingSettings, companyRecord, accountingEnabled, _c, productionEvent, accountDefaults, dimensions, event_1, jobId, workCenter, durationHours, rate, cost, dimensionMap_1, _i, _d, dim, job_1, finishedItemCost_1, _e, journalLineReference, journalLineInserts_1, accountingPeriodId_1, err_1;
    var _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _k.sent();
                today = (0, mod_ts_1.format)(new Date(), "yyyy-MM-dd");
                _k.label = 2;
            case 2:
                _k.trys.push([2, 17, , 18]);
                _a = payloadValidator.parse(payload), productionEventId_1 = _a.productionEventId, userId_1 = _a.userId, companyId_1 = _a.companyId;
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_1, userId_1, { update: "production" })];
            case 3:
                client = _k.sent();
                return [4 /*yield*/, Promise.all([
                        client
                            .from("companySettings")
                            .select("accountingEnabled")
                            .eq("id", companyId_1)
                            .single(),
                        client
                            .from("company")
                            .select("companyGroupId")
                            .eq("id", companyId_1)
                            .single(),
                    ])];
            case 4:
                _b = _k.sent(), accountingSettings = _b[0], companyRecord = _b[1];
                accountingEnabled = (_g = (_f = accountingSettings.data) === null || _f === void 0 ? void 0 : _f.accountingEnabled) !== null && _g !== void 0 ? _g : false;
                if (!accountingEnabled) {
                    return [2 /*return*/, new Response(JSON.stringify({ success: true }), {
                            headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        })];
                }
                if (companyRecord.error)
                    throw new Error("Failed to fetch company");
                return [4 /*yield*/, Promise.all([
                        client
                            .from("productionEvent")
                            .select("*, jobOperation!inner(jobId, processId)")
                            .eq("id", productionEventId_1)
                            .single(),
                        (0, get_posting_group_ts_1.getDefaultPostingGroup)(client, companyId_1),
                        client
                            .from("dimension")
                            .select("id, entityType")
                            .eq("companyGroupId", companyRecord.data.companyGroupId)
                            .eq("active", true)
                            .in("entityType", ["ItemPostingGroup", "Location", "Employee", "WorkCenter", "Process"]),
                    ])];
            case 5:
                _c = _k.sent(), productionEvent = _c[0], accountDefaults = _c[1], dimensions = _c[2];
                if (productionEvent.error)
                    throw new Error("Failed to fetch production event");
                if ((accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.error) || !(accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data)) {
                    throw new Error("Error getting account defaults");
                }
                if (!accountDefaults.data.laborAbsorptionAccount) {
                    throw new Error("laborAbsorptionAccount not configured in account defaults");
                }
                event_1 = productionEvent.data;
                if (!(!event_1.endTime || !event_1.duration || !event_1.workCenterId)) return [3 /*break*/, 7];
                return [4 /*yield*/, client
                        .from("productionEvent")
                        .update({ postedToGL: true })
                        .eq("id", productionEventId_1)];
            case 6:
                _k.sent();
                return [2 /*return*/, new Response(JSON.stringify({ success: true }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 7:
                jobId = event_1.jobOperation.jobId;
                return [4 /*yield*/, client
                        .from("workCenter")
                        .select("laborRate, machineRate")
                        .eq("id", event_1.workCenterId)
                        .single()];
            case 8:
                workCenter = _k.sent();
                if (workCenter.error)
                    throw new Error("Failed to fetch work center ".concat(event_1.workCenterId, ": ").concat(workCenter.error.message));
                durationHours = event_1.duration / 3600;
                rate = event_1.type === "Machine"
                    ? Number((_h = workCenter.data.machineRate) !== null && _h !== void 0 ? _h : 0)
                    : Number((_j = workCenter.data.laborRate) !== null && _j !== void 0 ? _j : 0);
                cost = durationHours * rate;
                if (!(cost <= 0)) return [3 /*break*/, 10];
                return [4 /*yield*/, client
                        .from("productionEvent")
                        .update({ postedToGL: true })
                        .eq("id", productionEventId_1)];
            case 9:
                _k.sent();
                return [2 /*return*/, new Response(JSON.stringify({ success: true }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 10:
                dimensionMap_1 = new Map();
                if (dimensions === null || dimensions === void 0 ? void 0 : dimensions.data) {
                    for (_i = 0, _d = dimensions.data; _i < _d.length; _i++) {
                        dim = _d[_i];
                        if (dim.entityType)
                            dimensionMap_1.set(dim.entityType, dim.id);
                    }
                }
                return [4 /*yield*/, client
                        .from("job")
                        .select("itemId, locationId, jobId")
                        .eq("id", jobId)
                        .single()];
            case 11:
                job_1 = _k.sent();
                if (job_1.error)
                    throw new Error("Failed to fetch job");
                if (!job_1.data.itemId) return [3 /*break*/, 13];
                return [4 /*yield*/, client
                        .from("itemCost")
                        .select("itemPostingGroupId")
                        .eq("itemId", job_1.data.itemId)
                        .eq("companyId", companyId_1)
                        .single()];
            case 12:
                _e = _k.sent();
                return [3 /*break*/, 14];
            case 13:
                _e = null;
                _k.label = 14;
            case 14:
                finishedItemCost_1 = _e;
                journalLineReference = (0, mod_ts_2.nanoid)();
                journalLineInserts_1 = [
                    {
                        accountId: accountDefaults.data.workInProgressAccount,
                        description: "WIP Account",
                        amount: (0, utils_ts_1.debit)("asset", cost),
                        quantity: 1,
                        documentType: "Production Event",
                        documentId: jobId,
                        documentLineReference: utils_ts_1.journalReference.to.job(jobId),
                        journalLineReference: journalLineReference,
                        companyId: companyId_1,
                    },
                    {
                        accountId: accountDefaults.data.laborAbsorptionAccount,
                        description: "Labor/Machine Absorption",
                        amount: (0, utils_ts_1.credit)("expense", cost),
                        quantity: 1,
                        documentType: "Production Event",
                        documentId: jobId,
                        documentLineReference: utils_ts_1.journalReference.to.job(jobId),
                        journalLineReference: journalLineReference,
                        companyId: companyId_1,
                    },
                ];
                return [4 /*yield*/, (0, get_accounting_period_ts_1.getCurrentAccountingPeriod)(client, companyId_1, db)];
            case 15:
                accountingPeriodId_1 = _k.sent();
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var journalEntryId, journalResult, journalLineResults, dimensionInserts_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId_1)];
                                case 1:
                                    journalEntryId = _a.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journal")
                                            .values({
                                            journalEntryId: journalEntryId,
                                            accountingPeriodId: accountingPeriodId_1,
                                            description: "".concat(event_1.type, " Time \u2014 Job ").concat(job_1.data.jobId),
                                            postingDate: today,
                                            companyId: companyId_1,
                                            sourceType: "Production Event",
                                            status: "Posted",
                                            postedAt: new Date().toISOString(),
                                            postedBy: userId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    journalResult = _a.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLine")
                                            .values(journalLineInserts_1.map(function (line) { return (__assign(__assign({}, line), { journalId: journalResult.id })); }))
                                            .returning(["id"])
                                            .execute()];
                                case 3:
                                    journalLineResults = _a.sent();
                                    if (!(dimensionMap_1.size > 0)) return [3 /*break*/, 5];
                                    dimensionInserts_1 = [];
                                    journalLineResults.forEach(function (jl) {
                                        var _a, _b;
                                        if (((_a = finishedItemCost_1 === null || finishedItemCost_1 === void 0 ? void 0 : finishedItemCost_1.data) === null || _a === void 0 ? void 0 : _a.itemPostingGroupId) &&
                                            dimensionMap_1.has("ItemPostingGroup")) {
                                            dimensionInserts_1.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("ItemPostingGroup"),
                                                valueId: finishedItemCost_1.data.itemPostingGroupId,
                                                companyId: companyId_1,
                                            });
                                        }
                                        if (job_1.data.locationId && dimensionMap_1.has("Location")) {
                                            dimensionInserts_1.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("Location"),
                                                valueId: job_1.data.locationId,
                                                companyId: companyId_1,
                                            });
                                        }
                                        if (event_1.employeeId && dimensionMap_1.has("Employee")) {
                                            dimensionInserts_1.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("Employee"),
                                                valueId: event_1.employeeId,
                                                companyId: companyId_1,
                                            });
                                        }
                                        if (event_1.workCenterId && dimensionMap_1.has("WorkCenter")) {
                                            dimensionInserts_1.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("WorkCenter"),
                                                valueId: event_1.workCenterId,
                                                companyId: companyId_1,
                                            });
                                        }
                                        var processId = (_b = event_1.jobOperation) === null || _b === void 0 ? void 0 : _b.processId;
                                        if (processId && dimensionMap_1.has("Process")) {
                                            dimensionInserts_1.push({
                                                journalLineId: jl.id,
                                                dimensionId: dimensionMap_1.get("Process"),
                                                valueId: processId,
                                                companyId: companyId_1,
                                            });
                                        }
                                    });
                                    if (!(dimensionInserts_1.length > 0)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLineDimension")
                                            .values(dimensionInserts_1)
                                            .execute()];
                                case 4:
                                    _a.sent();
                                    _a.label = 5;
                                case 5: return [4 /*yield*/, trx
                                        .updateTable("productionEvent")
                                        .set({ postedToGL: true })
                                        .where("id", "=", productionEventId_1)
                                        .execute()];
                                case 6:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 16:
                _k.sent();
                return [2 /*return*/, new Response(JSON.stringify({ success: true }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 17:
                err_1 = _k.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify({ error: err_1.message }), {
                        status: 500,
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 18: return [2 /*return*/];
        }
    });
}); });
