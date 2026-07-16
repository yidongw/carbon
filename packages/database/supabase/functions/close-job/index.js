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
    jobId: npm_zod__3_24_1_1.default.string(),
    userId: npm_zod__3_24_1_1.default.string(),
    companyId: npm_zod__3_24_1_1.default.string(),
});
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, today, _a, jobId_1, userId_1, companyId_1, client_1, _b, accountingSettings, companyRecord, accountingEnabled, accountDefaults_1, err_1;
    var _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _e.sent();
                today = (0, mod_ts_1.format)(new Date(), "yyyy-MM-dd");
                _e.label = 2;
            case 2:
                _e.trys.push([2, 7, , 8]);
                _a = payloadValidator.parse(payload), jobId_1 = _a.jobId, userId_1 = _a.userId, companyId_1 = _a.companyId;
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_1, userId_1, { update: "production" })];
            case 3:
                client_1 = _e.sent();
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("companySettings")
                            .select("accountingEnabled")
                            .eq("id", companyId_1)
                            .single(),
                        client_1
                            .from("company")
                            .select("companyGroupId")
                            .eq("id", companyId_1)
                            .single(),
                    ])];
            case 4:
                _b = _e.sent(), accountingSettings = _b[0], companyRecord = _b[1];
                accountingEnabled = (_d = (_c = accountingSettings.data) === null || _c === void 0 ? void 0 : _c.accountingEnabled) !== null && _d !== void 0 ? _d : false;
                if (!accountingEnabled) {
                    return [2 /*return*/, new Response(JSON.stringify({ success: true }), {
                            headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        })];
                }
                if (companyRecord.error)
                    throw new Error("Failed to fetch company");
                return [4 /*yield*/, (0, get_posting_group_ts_1.getDefaultPostingGroup)(client_1, companyId_1)];
            case 5:
                accountDefaults_1 = _e.sent();
                if ((accountDefaults_1 === null || accountDefaults_1 === void 0 ? void 0 : accountDefaults_1.error) || !(accountDefaults_1 === null || accountDefaults_1 === void 0 ? void 0 : accountDefaults_1.data)) {
                    throw new Error("Error getting account defaults");
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var wipBalance, remainingWip, job, journalLineReference, journalLineInserts, accountingPeriodId, journalEntryId, journalResult;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("journalLine")
                                        .innerJoin("journal", "journal.id", "journalLine.journalId")
                                        .select(function (eb) { return eb.fn.sum("journalLine.amount").as("balance"); })
                                        .where("journalLine.accountId", "=", accountDefaults_1.data.workInProgressAccount)
                                        .where("journalLine.documentId", "=", jobId_1)
                                        .where("journal.companyId", "=", companyId_1)
                                        .executeTakeFirst()];
                                case 1:
                                    wipBalance = _b.sent();
                                    remainingWip = Number((_a = wipBalance === null || wipBalance === void 0 ? void 0 : wipBalance.balance) !== null && _a !== void 0 ? _a : 0);
                                    if (Math.abs(remainingWip) < 0.01)
                                        return [2 /*return*/];
                                    return [4 /*yield*/, trx
                                            .selectFrom("job")
                                            .where("id", "=", jobId_1)
                                            .select(["jobId"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    job = _b.sent();
                                    journalLineReference = (0, mod_ts_2.nanoid)();
                                    journalLineInserts = [
                                        {
                                            accountId: accountDefaults_1.data.materialVarianceAccount,
                                            description: "Production Variance",
                                            amount: (0, utils_ts_1.debit)("expense", Math.abs(remainingWip)),
                                            quantity: 0,
                                            documentType: "Job Close",
                                            documentId: jobId_1,
                                            documentLineReference: utils_ts_1.journalReference.to.job(jobId_1),
                                            journalLineReference: journalLineReference,
                                            companyId: companyId_1,
                                        },
                                        {
                                            accountId: accountDefaults_1.data.workInProgressAccount,
                                            description: "WIP Account",
                                            amount: (0, utils_ts_1.credit)("asset", Math.abs(remainingWip)),
                                            quantity: 0,
                                            documentType: "Job Close",
                                            documentId: jobId_1,
                                            documentLineReference: utils_ts_1.journalReference.to.job(jobId_1),
                                            journalLineReference: journalLineReference,
                                            companyId: companyId_1,
                                        },
                                    ];
                                    return [4 /*yield*/, (0, get_accounting_period_ts_1.getCurrentAccountingPeriod)(client_1, companyId_1, db)];
                                case 3:
                                    accountingPeriodId = _b.sent();
                                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId_1)];
                                case 4:
                                    journalEntryId = _b.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journal")
                                            .values({
                                            journalEntryId: journalEntryId,
                                            accountingPeriodId: accountingPeriodId,
                                            description: "Job Close Variance ".concat(job.jobId),
                                            postingDate: today,
                                            companyId: companyId_1,
                                            sourceType: "Job Close",
                                            status: "Posted",
                                            postedAt: new Date().toISOString(),
                                            postedBy: userId_1,
                                            createdBy: userId_1,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 5:
                                    journalResult = _b.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("journalLine")
                                            .values(journalLineInserts.map(function (line) { return (__assign(__assign({}, line), { journalId: journalResult.id })); }))
                                            .execute()];
                                case 6:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 6:
                _e.sent();
                return [2 /*return*/, new Response(JSON.stringify({ success: true }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 7:
                err_1 = _e.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify({ error: err_1.message }), {
                        status: 500,
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    })];
            case 8: return [2 /*return*/];
        }
    });
}); });
