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
var server_ts_1 = require("https://deno.land/std@0.175.0/http/server.ts");
var date_1 = require("npm:@internationalized/date");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var database_ts_1 = require("../lib/database.ts");
var nanoid_ts_1 = require("https://deno.land/x/nanoid@v3.0.0/nanoid.ts");
var headers_ts_1 = require("../lib/headers.ts");
var storage_units_ts_1 = require("../lib/storage-units.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var utils_ts_1 = require("../lib/utils.ts");
var get_accounting_period_ts_1 = require("../shared/get-accounting-period.ts");
var get_next_sequence_ts_1 = require("../shared/get-next-sequence.ts");
var get_posting_group_ts_1 = require("../shared/get-posting-group.ts");
var calculate_cogs_ts_1 = require("../shared/calculate-cogs.ts");
/**
 * Resolve the company's expired-entity policy from companySettings JSONB.
 * Defaults to 'Block' when the row or key is absent so the safe behavior
 * is the default.
 */
function getExpiredEntityPolicy(trx, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var row, blob;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, trx
                        .selectFrom("companySettings")
                        .select("inventoryShelfLife")
                        .where("id", "=", companyId)
                        .executeTakeFirst()];
                case 1:
                    row = _c.sent();
                    blob = ((_a = row === null || row === void 0 ? void 0 : row.inventoryShelfLife) !== null && _a !== void 0 ? _a : null);
                    return [2 /*return*/, (_b = blob === null || blob === void 0 ? void 0 : blob.expiredEntityPolicy) !== null && _b !== void 0 ? _b : "Block"];
            }
        });
    });
}
/**
 * Apply the policy to a list of trackedEntity rows about to be consumed.
 * Returns:
 *   { ok: true }                 - no expiries, or warn-only with no expired
 *   { ok: true, warning }        - warn-only, with expired ids in the message
 *   { ok: false, reason }        - block (or block-without-override), caller
 *                                  should raise an error and refuse the op
 *
 * Caller is responsible for the override flow:
 *   - In 'BlockWithOverride' mode, if the request payload supplies
 *     overrideExpired=true + overrideReason, treat the result as ok and
 *     emit an audit-log row.
 */
function checkExpiredEntities(entities, policy, override) {
    var todayLocal = (0, date_1.today)((0, date_1.getLocalTimeZone)());
    var expired = entities.filter(function (e) {
        if (!e.expirationDate)
            return false;
        try {
            return (0, date_1.parseDate)(e.expirationDate).compare(todayLocal) < 0;
        }
        catch (_a) {
            return false;
        }
    });
    if (expired.length === 0)
        return { ok: true };
    var ids = expired.map(function (e) { return e.id; }).join(", ");
    if (policy === "Warn") {
        return {
            ok: true,
            warning: "Consumed ".concat(expired.length, " expired tracked entit").concat(expired.length === 1 ? "y" : "ies", ": ").concat(ids),
        };
    }
    if (policy === "BlockWithOverride" &&
        override.allowed &&
        override.reason &&
        override.reason.trim().length > 0) {
        return { ok: true };
    }
    return {
        ok: false,
        reason: "Cannot consume expired tracked entit".concat(expired.length === 1 ? "y" : "ies", ": ").concat(ids),
    };
}
function issueJobOperationMaterials(trx_1, _a) {
    return __awaiter(this, arguments, void 0, function (trx, _b) {
        var materialsToIssue, kittedChildren, jobMakeMethodIdsOfKittedChildren, materialsToIssueFromKittedChildren, jobId, _c, job, items, itemIdIsTracked, itemLedgerInserts, _d, materialsToIssue_1, materialsToIssue_1_1, material, quantityToIssue, proposedStorageUnitId, pickMethod, currentStorageUnitQuantity, allStorageUnitQuantities, finalStorageUnitId, currentQuantity, bestStorageUnit, isTracked, e_1_1, _i, itemLedgerInserts_1, ledger, journalLineInserts, journalLineDimensionsMeta_1, jobForLocation, consumedItemIds, consumedItemCosts, _e, consumedPostingGroupMap, _f, itemLedgerInserts_2, ledger, materialQuantity, cogsResult, journalLineReference, i, accountingPeriodId, journalEntryId, journalResult_1, journalLineResults, dimensionInserts_1;
        var _g, e_1, _h, _j;
        var _k, _l, _m, _o, _p, _q;
        var jobOperationId = _b.jobOperationId, quantity = _b.quantity, companyId = _b.companyId, userId = _b.userId, accountingEnabled = _b.accountingEnabled, accountDefaults = _b.accountDefaults, dimensionMap = _b.dimensionMap, client = _b.client, db = _b.db;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0: return [4 /*yield*/, trx
                        .selectFrom("jobMaterial")
                        .where("jobOperationId", "=", jobOperationId)
                        .where("itemType", "in", ["Material", "Part", "Consumable"])
                        .where("methodType", "!=", "Make to Order")
                        .where("estimatedQuantity", ">", 0)
                        .where("requiresBatchTracking", "=", false)
                        .where("requiresSerialTracking", "=", false)
                        .selectAll()
                        .execute()];
                case 1:
                    materialsToIssue = _r.sent();
                    return [4 /*yield*/, trx
                            .selectFrom("jobMaterialWithMakeMethodId")
                            .where("jobOperationId", "=", jobOperationId)
                            .where("itemType", "in", ["Material", "Part", "Consumable"])
                            .where("methodType", "=", "Make to Order")
                            .where("kit", "=", true)
                            .selectAll()
                            .execute()];
                case 2:
                    kittedChildren = _r.sent();
                    jobMakeMethodIdsOfKittedChildren = kittedChildren.map(function (kittedChild) { return kittedChild.jobMaterialMakeMethodId; });
                    if (!(jobMakeMethodIdsOfKittedChildren.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, trx
                            .selectFrom("jobMaterial")
                            .where("jobMakeMethodId", "in", jobMakeMethodIdsOfKittedChildren)
                            .where("itemType", "in", ["Material", "Part", "Consumable"])
                            .where("methodType", "!=", "Make to Order")
                            .where("estimatedQuantity", ">", 0)
                            .where("requiresBatchTracking", "=", false)
                            .where("requiresSerialTracking", "=", false)
                            .selectAll()
                            .execute()];
                case 3:
                    materialsToIssueFromKittedChildren = _r.sent();
                    materialsToIssue.push.apply(materialsToIssue, materialsToIssueFromKittedChildren);
                    _r.label = 4;
                case 4:
                    if (materialsToIssue.length === 0)
                        return [2 /*return*/];
                    jobId = materialsToIssue[0].jobId;
                    return [4 /*yield*/, Promise.all([
                            trx
                                .selectFrom("job")
                                .where("id", "=", jobId)
                                .select(["locationId", "jobId"])
                                .executeTakeFirst(),
                            trx
                                .selectFrom("item")
                                .where("id", "in", materialsToIssue.map(function (material) { return material.itemId; }))
                                .select(["id", "item.itemTrackingType"])
                                .execute(),
                        ])];
                case 5:
                    _c = _r.sent(), job = _c[0], items = _c[1];
                    if (!(job === null || job === void 0 ? void 0 : job.locationId)) {
                        throw new Error("Job location is required");
                    }
                    itemIdIsTracked = new Map(items.map(function (item) { return [item.id, item.itemTrackingType === "Inventory"]; }));
                    itemLedgerInserts = [];
                    _r.label = 6;
                case 6:
                    _r.trys.push([6, 20, 21, 26]);
                    _d = true, materialsToIssue_1 = __asyncValues(materialsToIssue);
                    _r.label = 7;
                case 7: return [4 /*yield*/, materialsToIssue_1.next()];
                case 8:
                    if (!(materialsToIssue_1_1 = _r.sent(), _g = materialsToIssue_1_1.done, !_g)) return [3 /*break*/, 19];
                    _j = materialsToIssue_1_1.value;
                    _d = false;
                    material = _j;
                    quantityToIssue = Number(material.quantity) * quantity;
                    proposedStorageUnitId = material.storageUnitId;
                    if (!!proposedStorageUnitId) return [3 /*break*/, 14];
                    if (!material.defaultStorageUnit) return [3 /*break*/, 12];
                    return [4 /*yield*/, trx
                            .selectFrom("pickMethod")
                            .where("itemId", "=", material.itemId)
                            .where("locationId", "=", job.locationId)
                            .where("companyId", "=", companyId)
                            .select("defaultStorageUnitId")
                            .executeTakeFirst()];
                case 9:
                    pickMethod = _r.sent();
                    proposedStorageUnitId = pickMethod === null || pickMethod === void 0 ? void 0 : pickMethod.defaultStorageUnitId;
                    if (!!proposedStorageUnitId) return [3 /*break*/, 11];
                    return [4 /*yield*/, (0, storage_units_ts_1.getStorageUnitWithHighestQuantity)(trx, material.itemId, job.locationId)];
                case 10:
                    proposedStorageUnitId = _r.sent();
                    _r.label = 11;
                case 11: return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, (0, storage_units_ts_1.getStorageUnitWithHighestQuantity)(trx, material.itemId, job.locationId)];
                case 13:
                    proposedStorageUnitId = _r.sent();
                    _r.label = 14;
                case 14: return [4 /*yield*/, trx
                        .selectFrom("itemLedger")
                        .select(function (eb) { return eb.fn.sum("quantity").as("quantity"); })
                        .where("itemId", "=", material.itemId)
                        .where("locationId", "=", job.locationId)
                        .where("storageUnitId", "=", proposedStorageUnitId !== null && proposedStorageUnitId !== void 0 ? proposedStorageUnitId : "")
                        .executeTakeFirst()];
                case 15:
                    currentStorageUnitQuantity = _r.sent();
                    return [4 /*yield*/, trx
                            .selectFrom("itemLedger")
                            .select([
                            "storageUnitId",
                            function (eb) { return eb.fn.sum("quantity").as("quantity"); },
                        ])
                            .where("itemId", "=", material.itemId)
                            .where("locationId", "=", job.locationId)
                            .groupBy("storageUnitId")
                            .having(function (eb) { return eb.fn.sum("quantity"); }, ">", 0)
                            .execute()];
                case 16:
                    allStorageUnitQuantities = _r.sent();
                    finalStorageUnitId = proposedStorageUnitId;
                    currentQuantity = Number((_k = currentStorageUnitQuantity === null || currentStorageUnitQuantity === void 0 ? void 0 : currentStorageUnitQuantity.quantity) !== null && _k !== void 0 ? _k : 0);
                    if (currentQuantity < quantityToIssue &&
                        allStorageUnitQuantities.length > 0) {
                        bestStorageUnit = allStorageUnitQuantities.reduce(function (best, current) {
                            return Number(current.quantity) > Number(best.quantity) ? current : best;
                        });
                        finalStorageUnitId = (_l = bestStorageUnit.storageUnitId) !== null && _l !== void 0 ? _l : null;
                    }
                    isTracked = itemIdIsTracked.get(material.itemId);
                    if (isTracked) {
                        itemLedgerInserts.push({
                            entryType: "Consumption",
                            documentType: "Job Consumption",
                            documentId: jobId,
                            documentLineId: jobOperationId,
                            companyId: companyId,
                            itemId: material.itemId,
                            quantity: -quantityToIssue,
                            locationId: job.locationId,
                            storageUnitId: finalStorageUnitId,
                            createdBy: userId,
                        });
                    }
                    return [4 /*yield*/, trx
                            .updateTable("jobMaterial")
                            .set({
                            quantityIssued: ((_m = Number(material.quantityIssued)) !== null && _m !== void 0 ? _m : 0) + quantityToIssue,
                        })
                            .where("id", "=", material.id)
                            .execute()];
                case 17:
                    _r.sent();
                    _r.label = 18;
                case 18:
                    _d = true;
                    return [3 /*break*/, 7];
                case 19: return [3 /*break*/, 26];
                case 20:
                    e_1_1 = _r.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 26];
                case 21:
                    _r.trys.push([21, , 24, 25]);
                    if (!(!_d && !_g && (_h = materialsToIssue_1.return))) return [3 /*break*/, 23];
                    return [4 /*yield*/, _h.call(materialsToIssue_1)];
                case 22:
                    _r.sent();
                    _r.label = 23;
                case 23: return [3 /*break*/, 25];
                case 24:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 25: return [7 /*endfinally*/];
                case 26:
                    if (!(itemLedgerInserts.length > 0)) return [3 /*break*/, 31];
                    return [4 /*yield*/, trx.insertInto("itemLedger").values(itemLedgerInserts).execute()];
                case 27:
                    _r.sent();
                    _i = 0, itemLedgerInserts_1 = itemLedgerInserts;
                    _r.label = 28;
                case 28:
                    if (!(_i < itemLedgerInserts_1.length)) return [3 /*break*/, 31];
                    ledger = itemLedgerInserts_1[_i];
                    return [4 /*yield*/, (0, storage_units_ts_1.updatePickMethodDefaultStorageUnitIfNeeded)(trx, ledger.itemId, ledger.locationId, ledger.storageUnitId, companyId, userId)];
                case 29:
                    _r.sent();
                    _r.label = 30;
                case 30:
                    _i++;
                    return [3 /*break*/, 28];
                case 31:
                    if (!(accountingEnabled && (accountDefaults === null || accountDefaults === void 0 ? void 0 : accountDefaults.data) && itemLedgerInserts.length > 0)) return [3 /*break*/, 46];
                    journalLineInserts = [];
                    journalLineDimensionsMeta_1 = [];
                    return [4 /*yield*/, trx
                            .selectFrom("job")
                            .where("id", "=", jobId)
                            .select(["locationId"])
                            .executeTakeFirst()];
                case 32:
                    jobForLocation = _r.sent();
                    consumedItemIds = __spreadArray([], new Set(itemLedgerInserts.map(function (l) { return l.itemId; })), true);
                    if (!(consumedItemIds.length > 0)) return [3 /*break*/, 34];
                    return [4 /*yield*/, trx
                            .selectFrom("itemCost")
                            .where("itemId", "in", consumedItemIds)
                            .where("companyId", "=", companyId)
                            .select(["itemId", "itemPostingGroupId"])
                            .execute()];
                case 33:
                    _e = _r.sent();
                    return [3 /*break*/, 35];
                case 34:
                    _e = [];
                    _r.label = 35;
                case 35:
                    consumedItemCosts = _e;
                    consumedPostingGroupMap = new Map(consumedItemCosts.map(function (ic) { return [ic.itemId, ic.itemPostingGroupId]; }));
                    _f = 0, itemLedgerInserts_2 = itemLedgerInserts;
                    _r.label = 36;
                case 36:
                    if (!(_f < itemLedgerInserts_2.length)) return [3 /*break*/, 40];
                    ledger = itemLedgerInserts_2[_f];
                    materialQuantity = Math.abs(Number(ledger.quantity));
                    if (materialQuantity === 0)
                        return [3 /*break*/, 39];
                    return [4 /*yield*/, (0, calculate_cogs_ts_1.calculateCOGS)(trx, {
                            itemId: ledger.itemId,
                            quantity: materialQuantity,
                            companyId: companyId,
                        })];
                case 37:
                    cogsResult = _r.sent();
                    journalLineReference = (0, nanoid_ts_1.nanoid)();
                    journalLineInserts.push({
                        accountId: accountDefaults.data.workInProgressAccount,
                        description: "WIP Account",
                        amount: (0, utils_ts_1.debit)("asset", cogsResult.totalCost),
                        quantity: materialQuantity,
                        documentType: "Job Consumption",
                        documentId: jobId,
                        documentLineReference: utils_ts_1.journalReference.to.materialIssue(jobOperationId),
                        journalLineReference: journalLineReference,
                        companyId: companyId,
                    });
                    journalLineInserts.push({
                        accountId: accountDefaults.data.inventoryAccount,
                        description: "Inventory Account",
                        amount: (0, utils_ts_1.credit)("asset", cogsResult.totalCost),
                        quantity: materialQuantity,
                        documentType: "Job Consumption",
                        documentId: jobId,
                        documentLineReference: utils_ts_1.journalReference.to.materialIssue(jobOperationId),
                        journalLineReference: journalLineReference,
                        companyId: companyId,
                    });
                    return [4 /*yield*/, trx
                            .insertInto("costLedger")
                            .values({
                            itemLedgerType: "Consumption",
                            costLedgerType: "Direct Cost",
                            adjustment: false,
                            documentType: "Job Consumption",
                            documentId: jobId,
                            itemId: ledger.itemId,
                            quantity: -materialQuantity,
                            cost: -cogsResult.totalCost,
                            remainingQuantity: 0,
                            companyId: companyId,
                        })
                            .execute()];
                case 38:
                    _r.sent();
                    for (i = 0; i < 2; i++) {
                        journalLineDimensionsMeta_1.push({
                            itemPostingGroupId: (_o = consumedPostingGroupMap.get(ledger.itemId)) !== null && _o !== void 0 ? _o : null,
                            locationId: (_p = jobForLocation === null || jobForLocation === void 0 ? void 0 : jobForLocation.locationId) !== null && _p !== void 0 ? _p : null,
                        });
                    }
                    _r.label = 39;
                case 39:
                    _f++;
                    return [3 /*break*/, 36];
                case 40:
                    if (!(journalLineInserts.length > 0)) return [3 /*break*/, 46];
                    return [4 /*yield*/, (0, get_accounting_period_ts_1.getCurrentAccountingPeriod)(client, companyId, db)];
                case 41:
                    accountingPeriodId = _r.sent();
                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId)];
                case 42:
                    journalEntryId = _r.sent();
                    return [4 /*yield*/, trx
                            .insertInto("journal")
                            .values({
                            journalEntryId: journalEntryId,
                            accountingPeriodId: accountingPeriodId,
                            description: "Material Issue to Job ".concat((_q = job === null || job === void 0 ? void 0 : job.jobId) !== null && _q !== void 0 ? _q : jobId),
                            postingDate: new Date().toISOString().slice(0, 10),
                            companyId: companyId,
                            sourceType: "Job Consumption",
                            status: "Posted",
                            postedAt: new Date().toISOString(),
                            postedBy: userId,
                            createdBy: userId,
                        })
                            .returning(["id"])
                            .executeTakeFirstOrThrow()];
                case 43:
                    journalResult_1 = _r.sent();
                    return [4 /*yield*/, trx
                            .insertInto("journalLine")
                            .values(journalLineInserts.map(function (line) { return (__assign(__assign({}, line), { journalId: journalResult_1.id })); }))
                            .returning(["id"])
                            .execute()];
                case 44:
                    journalLineResults = _r.sent();
                    if (!(dimensionMap.size > 0)) return [3 /*break*/, 46];
                    dimensionInserts_1 = [];
                    journalLineResults.forEach(function (jl, index) {
                        var meta = journalLineDimensionsMeta_1[index];
                        if (!meta)
                            return;
                        if (meta.itemPostingGroupId && dimensionMap.has("ItemPostingGroup")) {
                            dimensionInserts_1.push({
                                journalLineId: jl.id,
                                dimensionId: dimensionMap.get("ItemPostingGroup"),
                                valueId: meta.itemPostingGroupId,
                                companyId: companyId,
                            });
                        }
                        if (meta.locationId && dimensionMap.has("Location")) {
                            dimensionInserts_1.push({
                                journalLineId: jl.id,
                                dimensionId: dimensionMap.get("Location"),
                                valueId: meta.locationId,
                                companyId: companyId,
                            });
                        }
                    });
                    if (!(dimensionInserts_1.length > 0)) return [3 /*break*/, 46];
                    return [4 /*yield*/, trx
                            .insertInto("journalLineDimension")
                            .values(dimensionInserts_1)
                            .execute()];
                case 45:
                    _r.sent();
                    _r.label = 46;
                case 46: return [2 /*return*/];
            }
        });
    });
}
function createMaterialWipEntries(trx, args) {
    return __awaiter(this, void 0, void 0, function () {
        var consumptionLedgers, jobId, operationId, description, wipAccount, inventoryAccount, dimensionMap, jobLocationId, client, db, companyId, userId, journalLineInserts, journalLineDimensionsMeta, uniqueItemIds, consumedItemCosts, _a, consumedPostingGroupMap, _i, consumptionLedgers_1, ledger, ledgerQty, absQty, isConsumption, cost, cogsResult, itemCost, jlRef, i, accountingPeriodId, journalEntryId, journalResult, journalLineResults, dimensionInserts_2;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    consumptionLedgers = args.consumptionLedgers, jobId = args.jobId, operationId = args.operationId, description = args.description, wipAccount = args.wipAccount, inventoryAccount = args.inventoryAccount, dimensionMap = args.dimensionMap, jobLocationId = args.jobLocationId, client = args.client, db = args.db, companyId = args.companyId, userId = args.userId;
                    journalLineInserts = [];
                    journalLineDimensionsMeta = [];
                    uniqueItemIds = __spreadArray([], new Set(consumptionLedgers.map(function (l) { return l.itemId; })), true);
                    if (!(uniqueItemIds.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, trx
                            .selectFrom("itemCost")
                            .where("itemId", "in", uniqueItemIds)
                            .where("companyId", "=", companyId)
                            .select(["itemId", "itemPostingGroupId"])
                            .execute()];
                case 1:
                    _a = _d.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = [];
                    _d.label = 3;
                case 3:
                    consumedItemCosts = _a;
                    consumedPostingGroupMap = new Map(consumedItemCosts.map(function (ic) { return [ic.itemId, ic.itemPostingGroupId]; }));
                    _i = 0, consumptionLedgers_1 = consumptionLedgers;
                    _d.label = 4;
                case 4:
                    if (!(_i < consumptionLedgers_1.length)) return [3 /*break*/, 11];
                    ledger = consumptionLedgers_1[_i];
                    ledgerQty = Number(ledger.quantity);
                    if (ledgerQty === 0)
                        return [3 /*break*/, 10];
                    absQty = Math.abs(ledgerQty);
                    isConsumption = ledgerQty < 0;
                    cost = void 0;
                    if (!isConsumption) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, calculate_cogs_ts_1.calculateCOGS)(trx, {
                            itemId: ledger.itemId,
                            quantity: absQty,
                            companyId: companyId,
                        })];
                case 5:
                    cogsResult = _d.sent();
                    cost = cogsResult.totalCost;
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, trx
                        .selectFrom("itemCost")
                        .where("itemId", "=", ledger.itemId)
                        .where("companyId", "=", companyId)
                        .select("unitCost")
                        .executeTakeFirst()];
                case 7:
                    itemCost = _d.sent();
                    cost = absQty * Number((_b = itemCost === null || itemCost === void 0 ? void 0 : itemCost.unitCost) !== null && _b !== void 0 ? _b : 0);
                    _d.label = 8;
                case 8:
                    if (cost <= 0)
                        return [3 /*break*/, 10];
                    jlRef = (0, nanoid_ts_1.nanoid)();
                    if (isConsumption) {
                        journalLineInserts.push({
                            accountId: wipAccount,
                            description: "WIP Account",
                            amount: (0, utils_ts_1.debit)("asset", cost),
                            quantity: absQty,
                            documentType: "Job Consumption",
                            documentId: jobId,
                            documentLineReference: utils_ts_1.journalReference.to.materialIssue(operationId),
                            journalLineReference: jlRef,
                            companyId: companyId,
                        }, {
                            accountId: inventoryAccount,
                            description: "Inventory Account",
                            amount: (0, utils_ts_1.credit)("asset", cost),
                            quantity: absQty,
                            documentType: "Job Consumption",
                            documentId: jobId,
                            documentLineReference: utils_ts_1.journalReference.to.materialIssue(operationId),
                            journalLineReference: jlRef,
                            companyId: companyId,
                        });
                    }
                    else {
                        journalLineInserts.push({
                            accountId: inventoryAccount,
                            description: "Inventory Account",
                            amount: (0, utils_ts_1.debit)("asset", cost),
                            quantity: absQty,
                            documentType: "Job Consumption",
                            documentId: jobId,
                            documentLineReference: utils_ts_1.journalReference.to.materialIssue(operationId),
                            journalLineReference: jlRef,
                            companyId: companyId,
                        }, {
                            accountId: wipAccount,
                            description: "WIP Account",
                            amount: (0, utils_ts_1.credit)("asset", cost),
                            quantity: absQty,
                            documentType: "Job Consumption",
                            documentId: jobId,
                            documentLineReference: utils_ts_1.journalReference.to.materialIssue(operationId),
                            journalLineReference: jlRef,
                            companyId: companyId,
                        });
                    }
                    return [4 /*yield*/, trx
                            .insertInto("costLedger")
                            .values({
                            itemLedgerType: "Consumption",
                            costLedgerType: "Direct Cost",
                            adjustment: false,
                            documentType: "Job Consumption",
                            documentId: jobId,
                            itemId: ledger.itemId,
                            quantity: isConsumption ? -absQty : absQty,
                            cost: isConsumption ? -cost : cost,
                            remainingQuantity: 0,
                            companyId: companyId,
                        })
                            .execute()];
                case 9:
                    _d.sent();
                    for (i = 0; i < 2; i++) {
                        journalLineDimensionsMeta.push({
                            itemPostingGroupId: (_c = consumedPostingGroupMap.get(ledger.itemId)) !== null && _c !== void 0 ? _c : null,
                            locationId: jobLocationId,
                        });
                    }
                    _d.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 4];
                case 11:
                    if (journalLineInserts.length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, get_accounting_period_ts_1.getCurrentAccountingPeriod)(client, companyId, db)];
                case 12:
                    accountingPeriodId = _d.sent();
                    return [4 /*yield*/, (0, get_next_sequence_ts_1.getNextSequence)(trx, "journalEntry", companyId)];
                case 13:
                    journalEntryId = _d.sent();
                    return [4 /*yield*/, trx
                            .insertInto("journal")
                            .values({
                            journalEntryId: journalEntryId,
                            accountingPeriodId: accountingPeriodId,
                            description: description,
                            postingDate: new Date().toISOString().slice(0, 10),
                            companyId: companyId,
                            sourceType: "Job Consumption",
                            status: "Posted",
                            postedAt: new Date().toISOString(),
                            postedBy: userId,
                            createdBy: userId,
                        })
                            .returning(["id"])
                            .executeTakeFirstOrThrow()];
                case 14:
                    journalResult = _d.sent();
                    return [4 /*yield*/, trx
                            .insertInto("journalLine")
                            .values(journalLineInserts.map(function (line) { return (__assign(__assign({}, line), { journalId: journalResult.id })); }))
                            .returning(["id"])
                            .execute()];
                case 15:
                    journalLineResults = _d.sent();
                    if (!(dimensionMap.size > 0)) return [3 /*break*/, 17];
                    dimensionInserts_2 = [];
                    journalLineResults.forEach(function (jl, index) {
                        var meta = journalLineDimensionsMeta[index];
                        if (!meta)
                            return;
                        if (meta.itemPostingGroupId && dimensionMap.has("ItemPostingGroup")) {
                            dimensionInserts_2.push({
                                journalLineId: jl.id,
                                dimensionId: dimensionMap.get("ItemPostingGroup"),
                                valueId: meta.itemPostingGroupId,
                                companyId: companyId,
                            });
                        }
                        if (meta.locationId && dimensionMap.has("Location")) {
                            dimensionInserts_2.push({
                                journalLineId: jl.id,
                                dimensionId: dimensionMap.get("Location"),
                                valueId: meta.locationId,
                                companyId: companyId,
                            });
                        }
                    });
                    if (!(dimensionInserts_2.length > 0)) return [3 /*break*/, 17];
                    return [4 /*yield*/, trx
                            .insertInto("journalLineDimension")
                            .values(dimensionInserts_2)
                            .execute()];
                case 16:
                    _d.sent();
                    _d.label = 17;
                case 17: return [2 /*return*/];
            }
        });
    });
}
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var payloadValidator = npm_zod__3_24_1_1.z.discriminatedUnion("type", [
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("convertEntity"),
        trackedEntityId: npm_zod__3_24_1_1.z.string(),
        newRevision: npm_zod__3_24_1_1.z.string(),
        quantity: npm_zod__3_24_1_1.z.number().positive().default(1),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("jobCompleteMakeToOrder"),
        jobId: npm_zod__3_24_1_1.z.string(),
        quantityComplete: npm_zod__3_24_1_1.z.number(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("jobOperation"),
        quantity: npm_zod__3_24_1_1.z.number(),
        id: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("jobOperationBatchComplete"),
        trackedEntityId: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
        quantity: npm_zod__3_24_1_1.z.number(),
        jobOperationId: npm_zod__3_24_1_1.z.string(),
        notes: npm_zod__3_24_1_1.z.string().optional(),
        laborProductionEventId: npm_zod__3_24_1_1.z.string().optional(),
        machineProductionEventId: npm_zod__3_24_1_1.z.string().optional(),
        setupProductionEventId: npm_zod__3_24_1_1.z.string().optional(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("jobOperationSerialComplete"),
        trackedEntityId: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
        quantity: npm_zod__3_24_1_1.z.number(),
        jobOperationId: npm_zod__3_24_1_1.z.string(),
        notes: npm_zod__3_24_1_1.z.string().optional(),
        laborProductionEventId: npm_zod__3_24_1_1.z.string().optional(),
        machineProductionEventId: npm_zod__3_24_1_1.z.string().optional(),
        setupProductionEventId: npm_zod__3_24_1_1.z.string().optional(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("partToOperation"),
        id: npm_zod__3_24_1_1.z.string(),
        itemId: npm_zod__3_24_1_1.z.string(),
        quantity: npm_zod__3_24_1_1.z.number(),
        adjustmentType: npm_zod__3_24_1_1.z.enum([
            "Set Quantity",
            "Positive Adjmt.",
            "Negative Adjmt.",
        ]),
        materialId: npm_zod__3_24_1_1.z.string().optional(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("scrapTrackedEntity"),
        trackedEntityId: npm_zod__3_24_1_1.z.string(),
        materialId: npm_zod__3_24_1_1.z.string(),
        parentTrackedEntityId: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("trackedEntitiesToOperation"),
        materialId: npm_zod__3_24_1_1.z.string().optional(),
        jobOperationId: npm_zod__3_24_1_1.z.string().optional(),
        itemId: npm_zod__3_24_1_1.z.string().optional(),
        parentTrackedEntityId: npm_zod__3_24_1_1.z.string(),
        children: npm_zod__3_24_1_1.z.array(npm_zod__3_24_1_1.z.object({
            trackedEntityId: npm_zod__3_24_1_1.z.string(),
            quantity: npm_zod__3_24_1_1.z.number(),
        })),
        overrideExpired: npm_zod__3_24_1_1.z.boolean().optional(),
        overrideReason: npm_zod__3_24_1_1.z.string().optional(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("unconsumeTrackedEntities"),
        materialId: npm_zod__3_24_1_1.z.string(),
        parentTrackedEntityId: npm_zod__3_24_1_1.z.string(),
        children: npm_zod__3_24_1_1.z.array(npm_zod__3_24_1_1.z.object({
            trackedEntityId: npm_zod__3_24_1_1.z.string(),
            quantity: npm_zod__3_24_1_1.z.number(),
        })),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("maintenanceDispatchInventory"),
        maintenanceDispatchId: npm_zod__3_24_1_1.z.string(),
        itemId: npm_zod__3_24_1_1.z.string(),
        unitOfMeasureCode: npm_zod__3_24_1_1.z.string(),
        quantity: npm_zod__3_24_1_1.z.number(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("maintenanceDispatchTrackedEntities"),
        maintenanceDispatchId: npm_zod__3_24_1_1.z.string(),
        itemId: npm_zod__3_24_1_1.z.string(),
        unitOfMeasureCode: npm_zod__3_24_1_1.z.string(),
        children: npm_zod__3_24_1_1.z.array(npm_zod__3_24_1_1.z.object({
            trackedEntityId: npm_zod__3_24_1_1.z.string(),
            quantity: npm_zod__3_24_1_1.z.number(),
        })),
        overrideExpired: npm_zod__3_24_1_1.z.boolean().optional(),
        overrideReason: npm_zod__3_24_1_1.z.string().optional(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("maintenanceDispatchUnconsume"),
        maintenanceDispatchItemId: npm_zod__3_24_1_1.z.string(),
        children: npm_zod__3_24_1_1.z.array(npm_zod__3_24_1_1.z.object({
            trackedEntityId: npm_zod__3_24_1_1.z.string(),
            quantity: npm_zod__3_24_1_1.z.number(),
        })),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
    npm_zod__3_24_1_1.z.object({
        type: npm_zod__3_24_1_1.z.literal("maintenanceDispatchUnissue"),
        maintenanceDispatchItemId: npm_zod__3_24_1_1.z.string(),
        companyId: npm_zod__3_24_1_1.z.string(),
        userId: npm_zod__3_24_1_1.z.string(),
    }),
]);
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, validatedPayload, itemLedgerInserts_3, _a, id_1, companyId_1, quantity_1, userId_1, client_1, _b, accountingSettings, companyRecord, accountingEnabled_1, accountDefaults_1, _c, dimensions, _d, dimensionMap_1, _i, _e, dim, trackedEntityId_1, companyId_2, userId_2, row_1, client_2, _f, jobOperation, productionQuantities_1, _g, accountingSettingsBatch, companyRecordBatch, accountingEnabledBatch_1, accountDefaultsBatch_1, _h, dimensionsBatch, _j, dimensionMapBatch_1, _k, _l, dim, trackedEntityId_2, companyId_3, userId_3, row_2, client_3, jobOperation_1, trackedEntities_1, relatedTrackedEntities_1, _m, accountingSettingsSerial, companyRecordSerial, accountingEnabledSerial_1, accountDefaultsSerial_1, _o, dimensionsSerial, _p, dimensionMapSerial_1, _q, _r, dim, newEntityId_1, id_2, companyId_4, userId_4, itemId_1, quantity_2, materialId_1, adjustmentType_1, client_4, _s, accountingSettings, companyRecord, accountingEnabled_2, accountDefaults_2, _t, dimensions, _u, dimensionMap_2, _v, _w, dim, trackedEntityId_3, materialId_2, parentTrackedEntityId_1, companyId_5, userId_5, client_5, _x, trackedEntity_1, jobMaterial_1, _y, accountingSettingsScrap, companyRecordScrap, accountingEnabledScrap_1, accountDefaultsScrap_1, _z, dimensionsScrap, _0, dimensionMapScrap_1, _1, _2, dim, materialId_3, jobOperationId_1, itemId_2, parentTrackedEntityId_2, children_1, overrideExpired_1, overrideReason_1, companyId_6, userId_6, client_6, _3, accountingSettingsTracked, companyRecordTracked, accountingEnabledTracked_1, accountDefaultsTracked_1, _4, dimensionsTracked, _5, dimensionMapTracked_1, _6, _7, dim, expiredWarning_1, splitEntities, materialId_4, parentTrackedEntityId_3, children_2, companyId_7, userId_7, clientUnconsume_1, _8, accountingSettingsUnconsume, companyRecordUnconsume, accountingEnabledUnconsume_1, accountDefaultsUnconsume_1, _9, dimensionsUnconsume, _10, dimensionMapUnconsume_1, _11, _12, dim, trackedEntityId_4, newRevision_1, quantity_3, companyId_8, userId_8, convertedEntity, maintenanceDispatchId_1, itemId_3, unitOfMeasureCode_1, quantity_4, companyId_9, userId_9, maintenanceDispatchId_2, itemId_4, unitOfMeasureCode_2, children_3, overrideExpired_2, overrideReason_2, companyId_10, userId_10, expiredWarning_2, splitEntities, maintenanceDispatchItemId_1, children_4, companyId_11, userId_11, maintenanceDispatchItemId_2, companyId_12, userId_12, err_1, message;
    var _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26;
    return __generator(this, function (_27) {
        switch (_27.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _27.sent();
                console.log({ payload: payload });
                _27.label = 2;
            case 2:
                _27.trys.push([2, 88, , 89]);
                validatedPayload = payloadValidator.parse(payload);
                console.log(__assign({ function: "issue" }, validatedPayload));
                itemLedgerInserts_3 = [];
                _a = validatedPayload.type;
                switch (_a) {
                    case "jobOperation": return [3 /*break*/, 3];
                    case "jobOperationBatchComplete": return [3 /*break*/, 13];
                    case "jobOperationSerialComplete": return [3 /*break*/, 24];
                    case "partToOperation": return [3 /*break*/, 36];
                    case "scrapTrackedEntity": return [3 /*break*/, 46];
                    case "trackedEntitiesToOperation": return [3 /*break*/, 57];
                    case "unconsumeTrackedEntities": return [3 /*break*/, 67];
                    case "convertEntity": return [3 /*break*/, 77];
                    case "maintenanceDispatchInventory": return [3 /*break*/, 79];
                    case "maintenanceDispatchTrackedEntities": return [3 /*break*/, 81];
                    case "maintenanceDispatchUnconsume": return [3 /*break*/, 83];
                    case "maintenanceDispatchUnissue": return [3 /*break*/, 85];
                }
                return [3 /*break*/, 87];
            case 3:
                id_1 = validatedPayload.id, companyId_1 = validatedPayload.companyId, quantity_1 = validatedPayload.quantity, userId_1 = validatedPayload.userId;
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_1, userId_1, { update: "production" })];
            case 4:
                client_1 = _27.sent();
                return [4 /*yield*/, Promise.all([
                        client_1
                            .from("companySettings")
                            .select("accountingEnabled")
                            .eq("id", companyId_1)
                            .single(),
                        client_1.from("company").select("companyGroupId").eq("id", companyId_1).single(),
                    ])];
            case 5:
                _b = _27.sent(), accountingSettings = _b[0], companyRecord = _b[1];
                if (companyRecord.error)
                    throw new Error("Failed to fetch company");
                accountingEnabled_1 = (_14 = (_13 = accountingSettings.data) === null || _13 === void 0 ? void 0 : _13.accountingEnabled) !== null && _14 !== void 0 ? _14 : false;
                if (!accountingEnabled_1) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, get_posting_group_ts_1.getDefaultPostingGroup)(client_1, companyId_1)];
            case 6:
                _c = _27.sent();
                return [3 /*break*/, 8];
            case 7:
                _c = null;
                _27.label = 8;
            case 8:
                accountDefaults_1 = _c;
                if (accountingEnabled_1 && ((accountDefaults_1 === null || accountDefaults_1 === void 0 ? void 0 : accountDefaults_1.error) || !(accountDefaults_1 === null || accountDefaults_1 === void 0 ? void 0 : accountDefaults_1.data))) {
                    throw new Error("Error getting account defaults");
                }
                if (!accountingEnabled_1) return [3 /*break*/, 10];
                return [4 /*yield*/, client_1
                        .from("dimension")
                        .select("id, entityType")
                        .eq("companyGroupId", companyRecord.data.companyGroupId)
                        .eq("active", true)
                        .in("entityType", ["ItemPostingGroup", "Location"])];
            case 9:
                _d = _27.sent();
                return [3 /*break*/, 11];
            case 10:
                _d = null;
                _27.label = 11;
            case 11:
                dimensions = _d;
                dimensionMap_1 = new Map();
                if (dimensions === null || dimensions === void 0 ? void 0 : dimensions.data) {
                    for (_i = 0, _e = dimensions.data; _i < _e.length; _i++) {
                        dim = _e[_i];
                        if (dim.entityType)
                            dimensionMap_1.set(dim.entityType, dim.id);
                    }
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, issueJobOperationMaterials(trx, {
                                        jobOperationId: id_1,
                                        quantity: quantity_1,
                                        companyId: companyId_1,
                                        userId: userId_1,
                                        accountingEnabled: accountingEnabled_1,
                                        accountDefaults: (accountDefaults_1 === null || accountDefaults_1 === void 0 ? void 0 : accountDefaults_1.data) ? accountDefaults_1 : null,
                                        dimensionMap: dimensionMap_1,
                                        client: client_1,
                                        db: db,
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 12:
                _27.sent();
                return [3 /*break*/, 87];
            case 13:
                trackedEntityId_1 = validatedPayload.trackedEntityId, companyId_2 = validatedPayload.companyId, userId_2 = validatedPayload.userId, row_1 = __rest(validatedPayload, ["trackedEntityId", "companyId", "userId"]);
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_2, userId_2, { update: "production" })];
            case 14:
                client_2 = _27.sent();
                return [4 /*yield*/, Promise.all([
                        client_2
                            .from("jobOperation")
                            .select("*")
                            .eq("id", row_1.jobOperationId)
                            .single(),
                        client_2
                            .from("productionQuantity")
                            .select("*")
                            .eq("jobOperationId", row_1.jobOperationId)
                            .eq("type", "Production"),
                    ])];
            case 15:
                _f = _27.sent(), jobOperation = _f[0], productionQuantities_1 = _f[1];
                if (!jobOperation.data || !jobOperation.data.jobMakeMethodId) {
                    throw new Error("Job operation not found");
                }
                return [4 /*yield*/, Promise.all([
                        client_2
                            .from("companySettings")
                            .select("accountingEnabled")
                            .eq("id", companyId_2)
                            .single(),
                        client_2.from("company").select("companyGroupId").eq("id", companyId_2).single(),
                    ])];
            case 16:
                _g = _27.sent(), accountingSettingsBatch = _g[0], companyRecordBatch = _g[1];
                if (companyRecordBatch.error)
                    throw new Error("Failed to fetch company");
                accountingEnabledBatch_1 = (_16 = (_15 = accountingSettingsBatch.data) === null || _15 === void 0 ? void 0 : _15.accountingEnabled) !== null && _16 !== void 0 ? _16 : false;
                if (!accountingEnabledBatch_1) return [3 /*break*/, 18];
                return [4 /*yield*/, (0, get_posting_group_ts_1.getDefaultPostingGroup)(client_2, companyId_2)];
            case 17:
                _h = _27.sent();
                return [3 /*break*/, 19];
            case 18:
                _h = null;
                _27.label = 19;
            case 19:
                accountDefaultsBatch_1 = _h;
                if (accountingEnabledBatch_1 && ((accountDefaultsBatch_1 === null || accountDefaultsBatch_1 === void 0 ? void 0 : accountDefaultsBatch_1.error) || !(accountDefaultsBatch_1 === null || accountDefaultsBatch_1 === void 0 ? void 0 : accountDefaultsBatch_1.data))) {
                    throw new Error("Error getting account defaults");
                }
                if (!accountingEnabledBatch_1) return [3 /*break*/, 21];
                return [4 /*yield*/, client_2
                        .from("dimension")
                        .select("id, entityType")
                        .eq("companyGroupId", companyRecordBatch.data.companyGroupId)
                        .eq("active", true)
                        .in("entityType", ["ItemPostingGroup", "Location"])];
            case 20:
                _j = _27.sent();
                return [3 /*break*/, 22];
            case 21:
                _j = null;
                _27.label = 22;
            case 22:
                dimensionsBatch = _j;
                dimensionMapBatch_1 = new Map();
                if (dimensionsBatch === null || dimensionsBatch === void 0 ? void 0 : dimensionsBatch.data) {
                    for (_k = 0, _l = dimensionsBatch.data; _k < _l.length; _k++) {
                        dim = _l[_k];
                        if (dim.entityType)
                            dimensionMapBatch_1.set(dim.entityType, dim.id);
                    }
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var trackedEntity, activityId, previousProductionQuantities;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, trx
                                        .insertInto("productionQuantity")
                                        .values(__assign(__assign({}, row_1), { type: "Production", companyId: companyId_2, createdBy: userId_2 }))
                                        .executeTakeFirst()];
                                case 1:
                                    _c.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .where("id", "=", trackedEntityId_1)
                                            .selectAll()
                                            .executeTakeFirst()];
                                case 2:
                                    trackedEntity = _c.sent();
                                    if (!trackedEntity) {
                                        throw new Error("Tracked entity not found");
                                    }
                                    if (!(trackedEntity.status !== "Consumed")) return [3 /*break*/, 6];
                                    activityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: activityId,
                                            type: "Produce",
                                            sourceDocument: "Job Operation",
                                            sourceDocumentId: row_1.jobOperationId,
                                            attributes: {
                                                "Job Operation": row_1.jobOperationId,
                                                Employee: userId_2,
                                                Quantity: row_1.quantity,
                                            },
                                            companyId: companyId_2,
                                            createdBy: userId_2,
                                        })
                                            .execute()];
                                case 3:
                                    _c.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityOutput")
                                            .values({
                                            trackedActivityId: activityId,
                                            trackedEntityId: trackedEntityId_1,
                                            quantity: row_1.quantity,
                                            companyId: companyId_2,
                                            createdBy: userId_2,
                                        })
                                            .execute()];
                                case 4:
                                    _c.sent();
                                    previousProductionQuantities = (_b = (_a = productionQuantities_1 === null || productionQuantities_1 === void 0 ? void 0 : productionQuantities_1.data) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, curr) {
                                        var quantity = Number(curr.quantity);
                                        return acc + quantity;
                                    }, 0)) !== null && _b !== void 0 ? _b : 0;
                                    // Update the current trackedEntity to Complete
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set({
                                            status: "Available",
                                            quantity: previousProductionQuantities + row_1.quantity,
                                        })
                                            .where("id", "=", trackedEntityId_1)
                                            .execute()];
                                case 5:
                                    // Update the current trackedEntity to Complete
                                    _c.sent();
                                    _c.label = 6;
                                case 6: return [4 /*yield*/, issueJobOperationMaterials(trx, {
                                        jobOperationId: row_1.jobOperationId,
                                        quantity: row_1.quantity,
                                        companyId: companyId_2,
                                        userId: userId_2,
                                        accountingEnabled: accountingEnabledBatch_1,
                                        accountDefaults: (accountDefaultsBatch_1 === null || accountDefaultsBatch_1 === void 0 ? void 0 : accountDefaultsBatch_1.data) ? accountDefaultsBatch_1 : null,
                                        dimensionMap: dimensionMapBatch_1,
                                        client: client_2,
                                        db: db,
                                    })];
                                case 7:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 23:
                _27.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        success: true,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 200,
                    })];
            case 24:
                trackedEntityId_2 = validatedPayload.trackedEntityId, companyId_3 = validatedPayload.companyId, userId_3 = validatedPayload.userId, row_2 = __rest(validatedPayload, ["trackedEntityId", "companyId", "userId"]);
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_3, userId_3, { update: "production" })];
            case 25:
                client_3 = _27.sent();
                return [4 /*yield*/, client_3
                        .from("jobOperation")
                        .select("*")
                        .eq("id", row_2.jobOperationId)
                        .single()];
            case 26:
                jobOperation_1 = _27.sent();
                if (!jobOperation_1.data || !jobOperation_1.data.jobMakeMethodId) {
                    throw new Error("Job operation not found");
                }
                return [4 /*yield*/, client_3
                        .from("trackedEntity")
                        .select("*")
                        .eq("attributes->>Job Make Method", jobOperation_1.data.jobMakeMethodId)
                        .order("createdAt", { ascending: true })];
            case 27:
                trackedEntities_1 = _27.sent();
                if (!trackedEntities_1.data || trackedEntities_1.data.length === 0) {
                    throw new Error("Tracked entities not found");
                }
                relatedTrackedEntities_1 = trackedEntities_1.data.filter(function (trackedEntity) {
                    return "Operation ".concat(row_2.jobOperationId) in
                        trackedEntity.attributes;
                });
                return [4 /*yield*/, Promise.all([
                        client_3
                            .from("companySettings")
                            .select("accountingEnabled")
                            .eq("id", companyId_3)
                            .single(),
                        client_3.from("company").select("companyGroupId").eq("id", companyId_3).single(),
                    ])];
            case 28:
                _m = _27.sent(), accountingSettingsSerial = _m[0], companyRecordSerial = _m[1];
                if (companyRecordSerial.error)
                    throw new Error("Failed to fetch company");
                accountingEnabledSerial_1 = (_18 = (_17 = accountingSettingsSerial.data) === null || _17 === void 0 ? void 0 : _17.accountingEnabled) !== null && _18 !== void 0 ? _18 : false;
                if (!accountingEnabledSerial_1) return [3 /*break*/, 30];
                return [4 /*yield*/, (0, get_posting_group_ts_1.getDefaultPostingGroup)(client_3, companyId_3)];
            case 29:
                _o = _27.sent();
                return [3 /*break*/, 31];
            case 30:
                _o = null;
                _27.label = 31;
            case 31:
                accountDefaultsSerial_1 = _o;
                if (accountingEnabledSerial_1 && ((accountDefaultsSerial_1 === null || accountDefaultsSerial_1 === void 0 ? void 0 : accountDefaultsSerial_1.error) || !(accountDefaultsSerial_1 === null || accountDefaultsSerial_1 === void 0 ? void 0 : accountDefaultsSerial_1.data))) {
                    throw new Error("Error getting account defaults");
                }
                if (!accountingEnabledSerial_1) return [3 /*break*/, 33];
                return [4 /*yield*/, client_3
                        .from("dimension")
                        .select("id, entityType")
                        .eq("companyGroupId", companyRecordSerial.data.companyGroupId)
                        .eq("active", true)
                        .in("entityType", ["ItemPostingGroup", "Location"])];
            case 32:
                _p = _27.sent();
                return [3 /*break*/, 34];
            case 33:
                _p = null;
                _27.label = 34;
            case 34:
                dimensionsSerial = _p;
                dimensionMapSerial_1 = new Map();
                if (dimensionsSerial === null || dimensionsSerial === void 0 ? void 0 : dimensionsSerial.data) {
                    for (_q = 0, _r = dimensionsSerial.data; _q < _r.length; _q++) {
                        dim = _r[_q];
                        if (dim.entityType)
                            dimensionMapSerial_1.set(dim.entityType, dim.id);
                    }
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var trackedEntity, activityId, newTrackedEntityResult;
                        var _a;
                        var _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, trx
                                        .insertInto("productionQuantity")
                                        .values(__assign(__assign({}, row_2), { type: "Production", companyId: companyId_3, createdBy: userId_3 }))
                                        .executeTakeFirst()];
                                case 1:
                                    _e.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .where("id", "=", trackedEntityId_2)
                                            .selectAll()
                                            .executeTakeFirst()];
                                case 2:
                                    trackedEntity = _e.sent();
                                    if (!trackedEntity) {
                                        throw new Error("Tracked entity not found");
                                    }
                                    if (!(trackedEntity.status !== "Consumed")) return [3 /*break*/, 6];
                                    activityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: activityId,
                                            type: "Complete",
                                            sourceDocument: "Job Operation",
                                            sourceDocumentId: row_2.jobOperationId,
                                            attributes: {
                                                "Job Operation": row_2.jobOperationId,
                                                Employee: userId_3,
                                            },
                                            companyId: companyId_3,
                                            createdBy: userId_3,
                                        })
                                            .execute()];
                                case 3:
                                    _e.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityOutput")
                                            .values({
                                            trackedActivityId: activityId,
                                            trackedEntityId: trackedEntityId_2,
                                            quantity: 1,
                                            companyId: companyId_3,
                                            createdBy: userId_3,
                                        })
                                            .execute()];
                                case 4:
                                    _e.sent();
                                    return [4 /*yield*/, trx
                                            .updateTable("trackedEntity")
                                            .set({
                                            status: "Available",
                                            quantity: 1,
                                            attributes: __assign(__assign({}, trackedEntity.attributes), (_a = {}, _a["Operation ".concat(row_2.jobOperationId)] = relatedTrackedEntities_1.length + 1, _a)),
                                        })
                                            .where("id", "=", trackedEntityId_2)
                                            .execute()];
                                case 5:
                                    _e.sent();
                                    _e.label = 6;
                                case 6:
                                    if (!(trackedEntities_1.data.length <
                                        ((_b = jobOperation_1.data.operationQuantity) !== null && _b !== void 0 ? _b : 0))) return [3 /*break*/, 8];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedEntity")
                                            .values({
                                            sourceDocument: trackedEntity.sourceDocument,
                                            sourceDocumentId: trackedEntity.sourceDocumentId,
                                            sourceDocumentReadableId: trackedEntity.sourceDocumentReadableId,
                                            quantity: 1,
                                            status: "Reserved",
                                            attributes: trackedEntity.attributes,
                                            itemId: (_c = trackedEntity.itemId) !== null && _c !== void 0 ? _c : null,
                                            expirationDate: (_d = trackedEntity.expirationDate) !== null && _d !== void 0 ? _d : null,
                                            companyId: companyId_3,
                                            createdBy: userId_3,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirst()];
                                case 7:
                                    newTrackedEntityResult = _e.sent();
                                    newEntityId_1 = newTrackedEntityResult === null || newTrackedEntityResult === void 0 ? void 0 : newTrackedEntityResult.id;
                                    _e.label = 8;
                                case 8: return [4 /*yield*/, issueJobOperationMaterials(trx, {
                                        jobOperationId: row_2.jobOperationId,
                                        quantity: row_2.quantity,
                                        companyId: companyId_3,
                                        userId: userId_3,
                                        accountingEnabled: accountingEnabledSerial_1,
                                        accountDefaults: (accountDefaultsSerial_1 === null || accountDefaultsSerial_1 === void 0 ? void 0 : accountDefaultsSerial_1.data) ? accountDefaultsSerial_1 : null,
                                        dimensionMap: dimensionMapSerial_1,
                                        client: client_3,
                                        db: db,
                                    })];
                                case 9:
                                    _e.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 35:
                _27.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        success: true,
                        newTrackedEntityId: newEntityId_1,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 200,
                    })];
            case 36:
                id_2 = validatedPayload.id, companyId_4 = validatedPayload.companyId, userId_4 = validatedPayload.userId, itemId_1 = validatedPayload.itemId, quantity_2 = validatedPayload.quantity, materialId_1 = validatedPayload.materialId, adjustmentType_1 = validatedPayload.adjustmentType;
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_4, userId_4, { update: "production" })];
            case 37:
                client_4 = _27.sent();
                return [4 /*yield*/, Promise.all([
                        client_4
                            .from("companySettings")
                            .select("accountingEnabled")
                            .eq("id", companyId_4)
                            .single(),
                        client_4.from("company").select("companyGroupId").eq("id", companyId_4).single(),
                    ])];
            case 38:
                _s = _27.sent(), accountingSettings = _s[0], companyRecord = _s[1];
                if (companyRecord.error)
                    throw new Error("Failed to fetch company");
                accountingEnabled_2 = (_20 = (_19 = accountingSettings.data) === null || _19 === void 0 ? void 0 : _19.accountingEnabled) !== null && _20 !== void 0 ? _20 : false;
                if (!accountingEnabled_2) return [3 /*break*/, 40];
                return [4 /*yield*/, (0, get_posting_group_ts_1.getDefaultPostingGroup)(client_4, companyId_4)];
            case 39:
                _t = _27.sent();
                return [3 /*break*/, 41];
            case 40:
                _t = null;
                _27.label = 41;
            case 41:
                accountDefaults_2 = _t;
                if (accountingEnabled_2 && ((accountDefaults_2 === null || accountDefaults_2 === void 0 ? void 0 : accountDefaults_2.error) || !(accountDefaults_2 === null || accountDefaults_2 === void 0 ? void 0 : accountDefaults_2.data))) {
                    throw new Error("Error getting account defaults");
                }
                if (!accountingEnabled_2) return [3 /*break*/, 43];
                return [4 /*yield*/, client_4
                        .from("dimension")
                        .select("id, entityType")
                        .eq("companyGroupId", companyRecord.data.companyGroupId)
                        .eq("active", true)
                        .in("entityType", ["ItemPostingGroup", "Location"])];
            case 42:
                _u = _27.sent();
                return [3 /*break*/, 44];
            case 43:
                _u = null;
                _27.label = 44;
            case 44:
                dimensions = _u;
                dimensionMap_2 = new Map();
                if (dimensions === null || dimensions === void 0 ? void 0 : dimensions.data) {
                    for (_v = 0, _w = dimensions.data; _v < _w.length; _v++) {
                        dim = _w[_v];
                        if (dim.entityType)
                            dimensionMap_2.set(dim.entityType, dim.id);
                    }
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var jobOperation, _a, job, item, material, storageUnitId, pickMethod, quantityToIssue, _i, itemLedgerInserts_4, ledger, storageUnitId, pickMethod, _b, itemCost, _c, itemLedgerInserts_5, ledger, jobOperation_2, jobRecord, _d;
                        var _e, _f, _g, _h, _j, _k;
                        return __generator(this, function (_l) {
                            switch (_l.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("jobOperation")
                                        .where("id", "=", id_2)
                                        .select(["jobId", "jobMakeMethodId"])
                                        .executeTakeFirst()];
                                case 1:
                                    jobOperation = _l.sent();
                                    return [4 /*yield*/, Promise.all([
                                            trx
                                                .selectFrom("job")
                                                .where("id", "=", jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.jobId)
                                                .select("locationId")
                                                .executeTakeFirst(),
                                            trx
                                                .selectFrom("item")
                                                .where("id", "=", itemId_1)
                                                .select([
                                                "id",
                                                "itemTrackingType",
                                                "name",
                                                "readableIdWithRevision",
                                                "type",
                                            ])
                                                .executeTakeFirst(),
                                        ])];
                                case 2:
                                    _a = _l.sent(), job = _a[0], item = _a[1];
                                    if (!materialId_1) return [3 /*break*/, 15];
                                    return [4 /*yield*/, trx
                                            .selectFrom("jobMaterial")
                                            .where("id", "=", materialId_1)
                                            .selectAll()
                                            .executeTakeFirst()];
                                case 3:
                                    material = _l.sent();
                                    storageUnitId = void 0;
                                    if (!(material === null || material === void 0 ? void 0 : material.storageUnitId)) return [3 /*break*/, 4];
                                    storageUnitId = material.storageUnitId;
                                    return [3 /*break*/, 8];
                                case 4:
                                    if (!(material === null || material === void 0 ? void 0 : material.defaultStorageUnit)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, trx
                                            .selectFrom("pickMethod")
                                            .where("itemId", "=", itemId_1)
                                            .where("locationId", "=", job === null || job === void 0 ? void 0 : job.locationId)
                                            .select("defaultStorageUnitId")
                                            .executeTakeFirst()];
                                case 5:
                                    pickMethod = _l.sent();
                                    storageUnitId = pickMethod === null || pickMethod === void 0 ? void 0 : pickMethod.defaultStorageUnitId;
                                    return [3 /*break*/, 8];
                                case 6: return [4 /*yield*/, (0, storage_units_ts_1.getStorageUnitWithHighestQuantity)(trx, itemId_1, job === null || job === void 0 ? void 0 : job.locationId)];
                                case 7:
                                    storageUnitId = _l.sent();
                                    _l.label = 8;
                                case 8:
                                    quantityToIssue = adjustmentType_1 === "Positive Adjmt."
                                        ? Number(quantity_2)
                                        : adjustmentType_1 === "Negative Adjmt."
                                            ? Number(quantity_2)
                                            : Number(quantity_2) - Number(material === null || material === void 0 ? void 0 : material.quantityIssued);
                                    if ((material === null || material === void 0 ? void 0 : material.methodType) !== "Make to Order" &&
                                        (item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Inventory") {
                                        itemLedgerInserts_3.push({
                                            entryType: "Consumption",
                                            documentType: "Job Consumption",
                                            documentId: material === null || material === void 0 ? void 0 : material.jobId,
                                            documentLineId: id_2,
                                            companyId: companyId_4,
                                            itemId: material === null || material === void 0 ? void 0 : material.itemId,
                                            locationId: job === null || job === void 0 ? void 0 : job.locationId,
                                            storageUnitId: storageUnitId,
                                            quantity: adjustmentType_1 === "Positive Adjmt."
                                                ? Number(quantityToIssue)
                                                : -Number(quantityToIssue),
                                            createdBy: userId_4,
                                        });
                                    }
                                    return [4 /*yield*/, trx
                                            .updateTable("jobMaterial")
                                            .set({
                                            quantityIssued: ((_e = Number(material === null || material === void 0 ? void 0 : material.quantityIssued)) !== null && _e !== void 0 ? _e : 0) +
                                                Number(quantityToIssue),
                                        })
                                            .where("id", "=", materialId_1)
                                            .execute()];
                                case 9:
                                    _l.sent();
                                    if (!(itemLedgerInserts_3.length > 0)) return [3 /*break*/, 14];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts_3)
                                            .execute()];
                                case 10:
                                    _l.sent();
                                    _i = 0, itemLedgerInserts_4 = itemLedgerInserts_3;
                                    _l.label = 11;
                                case 11:
                                    if (!(_i < itemLedgerInserts_4.length)) return [3 /*break*/, 14];
                                    ledger = itemLedgerInserts_4[_i];
                                    return [4 /*yield*/, (0, storage_units_ts_1.updatePickMethodDefaultStorageUnitIfNeeded)(trx, ledger.itemId, ledger.locationId, ledger.storageUnitId, companyId_4, userId_4)];
                                case 12:
                                    _l.sent();
                                    _l.label = 13;
                                case 13:
                                    _i++;
                                    return [3 /*break*/, 11];
                                case 14: return [3 /*break*/, 27];
                                case 15:
                                    storageUnitId = void 0;
                                    if (!((item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Inventory")) return [3 /*break*/, 20];
                                    return [4 /*yield*/, trx
                                            .selectFrom("pickMethod")
                                            .where("itemId", "=", itemId_1)
                                            .where("locationId", "=", job === null || job === void 0 ? void 0 : job.locationId)
                                            .select("defaultStorageUnitId")
                                            .executeTakeFirst()];
                                case 16:
                                    pickMethod = _l.sent();
                                    if (!((_f = pickMethod === null || pickMethod === void 0 ? void 0 : pickMethod.defaultStorageUnitId) !== null && _f !== void 0)) return [3 /*break*/, 17];
                                    _b = _f;
                                    return [3 /*break*/, 19];
                                case 17: return [4 /*yield*/, (0, storage_units_ts_1.getStorageUnitWithHighestQuantity)(trx, itemId_1, job === null || job === void 0 ? void 0 : job.locationId)];
                                case 18:
                                    _b = (_l.sent());
                                    _l.label = 19;
                                case 19:
                                    storageUnitId = _b;
                                    itemLedgerInserts_3.push({
                                        entryType: "Consumption",
                                        documentType: "Job Consumption",
                                        documentId: jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.jobId,
                                        documentLineId: id_2,
                                        companyId: companyId_4,
                                        itemId: itemId_1,
                                        quantity: adjustmentType_1 === "Positive Adjmt."
                                            ? Number(quantity_2)
                                            : -Number(quantity_2),
                                        locationId: job === null || job === void 0 ? void 0 : job.locationId,
                                        storageUnitId: storageUnitId,
                                        createdBy: userId_4,
                                    });
                                    _l.label = 20;
                                case 20: return [4 /*yield*/, trx
                                        .selectFrom("itemCost")
                                        .where("itemId", "=", itemId_1)
                                        .select("unitCost")
                                        .executeTakeFirst()];
                                case 21:
                                    itemCost = _l.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("jobMaterial")
                                            .values({
                                            companyId: companyId_4,
                                            createdBy: userId_4,
                                            description: (_g = item === null || item === void 0 ? void 0 : item.name) !== null && _g !== void 0 ? _g : "",
                                            estimatedQuantity: 0,
                                            itemId: itemId_1,
                                            itemType: (_h = item === null || item === void 0 ? void 0 : item.type) !== null && _h !== void 0 ? _h : "Part",
                                            jobId: jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.jobId,
                                            jobMakeMethodId: jobOperation === null || jobOperation === void 0 ? void 0 : jobOperation.jobMakeMethodId,
                                            jobOperationId: id_2,
                                            storageUnitId: storageUnitId !== null && storageUnitId !== void 0 ? storageUnitId : undefined,
                                            methodType: "Pull from Inventory",
                                            quantity: 0,
                                            quantityIssued: Number(quantity_2 !== null && quantity_2 !== void 0 ? quantity_2 : 0),
                                            unitCost: (_j = itemCost === null || itemCost === void 0 ? void 0 : itemCost.unitCost) !== null && _j !== void 0 ? _j : 0,
                                        })
                                            .executeTakeFirst()];
                                case 22:
                                    _l.sent();
                                    if (!(itemLedgerInserts_3.length > 0)) return [3 /*break*/, 27];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts_3)
                                            .execute()];
                                case 23:
                                    _l.sent();
                                    _c = 0, itemLedgerInserts_5 = itemLedgerInserts_3;
                                    _l.label = 24;
                                case 24:
                                    if (!(_c < itemLedgerInserts_5.length)) return [3 /*break*/, 27];
                                    ledger = itemLedgerInserts_5[_c];
                                    return [4 /*yield*/, (0, storage_units_ts_1.updatePickMethodDefaultStorageUnitIfNeeded)(trx, ledger.itemId, ledger.locationId, ledger.storageUnitId, companyId_4, userId_4)];
                                case 25:
                                    _l.sent();
                                    _l.label = 26;
                                case 26:
                                    _c++;
                                    return [3 /*break*/, 24];
                                case 27:
                                    if (!(accountingEnabled_2 && (accountDefaults_2 === null || accountDefaults_2 === void 0 ? void 0 : accountDefaults_2.data) && itemLedgerInserts_3.length > 0)) return [3 /*break*/, 33];
                                    return [4 /*yield*/, trx
                                            .selectFrom("jobOperation")
                                            .where("id", "=", id_2)
                                            .select(["jobId"])
                                            .executeTakeFirst()];
                                case 28:
                                    jobOperation_2 = _l.sent();
                                    if (!(jobOperation_2 === null || jobOperation_2 === void 0 ? void 0 : jobOperation_2.jobId)) return [3 /*break*/, 30];
                                    return [4 /*yield*/, trx
                                            .selectFrom("job")
                                            .where("id", "=", jobOperation_2.jobId)
                                            .select(["itemId", "locationId"])
                                            .executeTakeFirst()];
                                case 29:
                                    _d = _l.sent();
                                    return [3 /*break*/, 31];
                                case 30:
                                    _d = null;
                                    _l.label = 31;
                                case 31:
                                    jobRecord = _d;
                                    return [4 /*yield*/, createMaterialWipEntries(trx, {
                                            consumptionLedgers: itemLedgerInserts_3.map(function (l) { return ({
                                                itemId: l.itemId,
                                                quantity: Number(l.quantity),
                                            }); }),
                                            jobId: jobOperation_2 === null || jobOperation_2 === void 0 ? void 0 : jobOperation_2.jobId,
                                            operationId: id_2,
                                            description: "Manual Material Issue",
                                            wipAccount: accountDefaults_2.data.workInProgressAccount,
                                            inventoryAccount: accountDefaults_2.data.inventoryAccount,
                                            dimensionMap: dimensionMap_2,
                                            jobLocationId: (_k = jobRecord === null || jobRecord === void 0 ? void 0 : jobRecord.locationId) !== null && _k !== void 0 ? _k : null,
                                            client: client_4,
                                            db: db,
                                            companyId: companyId_4,
                                            userId: userId_4,
                                        })];
                                case 32:
                                    _l.sent();
                                    _l.label = 33;
                                case 33: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 45:
                _27.sent();
                return [3 /*break*/, 87];
            case 46:
                trackedEntityId_3 = validatedPayload.trackedEntityId, materialId_2 = validatedPayload.materialId, parentTrackedEntityId_1 = validatedPayload.parentTrackedEntityId, companyId_5 = validatedPayload.companyId, userId_5 = validatedPayload.userId;
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_5, userId_5, { update: "production" })];
            case 47:
                client_5 = _27.sent();
                return [4 /*yield*/, Promise.all([
                        client_5
                            .from("trackedEntity")
                            .select("*")
                            .eq("id", trackedEntityId_3)
                            .single(),
                        client_5.from("jobMaterial").select("*").eq("id", materialId_2).single(),
                    ])];
            case 48:
                _x = _27.sent(), trackedEntity_1 = _x[0], jobMaterial_1 = _x[1];
                if (!trackedEntity_1.data) {
                    throw new Error("Tracked entity not found");
                }
                if (!jobMaterial_1.data) {
                    throw new Error("Job material not found");
                }
                return [4 /*yield*/, Promise.all([
                        client_5
                            .from("companySettings")
                            .select("accountingEnabled")
                            .eq("id", companyId_5)
                            .single(),
                        client_5.from("company").select("companyGroupId").eq("id", companyId_5).single(),
                    ])];
            case 49:
                _y = _27.sent(), accountingSettingsScrap = _y[0], companyRecordScrap = _y[1];
                if (companyRecordScrap.error)
                    throw new Error("Failed to fetch company");
                accountingEnabledScrap_1 = (_22 = (_21 = accountingSettingsScrap.data) === null || _21 === void 0 ? void 0 : _21.accountingEnabled) !== null && _22 !== void 0 ? _22 : false;
                if (!accountingEnabledScrap_1) return [3 /*break*/, 51];
                return [4 /*yield*/, (0, get_posting_group_ts_1.getDefaultPostingGroup)(client_5, companyId_5)];
            case 50:
                _z = _27.sent();
                return [3 /*break*/, 52];
            case 51:
                _z = null;
                _27.label = 52;
            case 52:
                accountDefaultsScrap_1 = _z;
                if (accountingEnabledScrap_1 && ((accountDefaultsScrap_1 === null || accountDefaultsScrap_1 === void 0 ? void 0 : accountDefaultsScrap_1.error) || !(accountDefaultsScrap_1 === null || accountDefaultsScrap_1 === void 0 ? void 0 : accountDefaultsScrap_1.data))) {
                    throw new Error("Error getting account defaults");
                }
                if (!accountingEnabledScrap_1) return [3 /*break*/, 54];
                return [4 /*yield*/, client_5
                        .from("dimension")
                        .select("id, entityType")
                        .eq("companyGroupId", companyRecordScrap.data.companyGroupId)
                        .eq("active", true)
                        .in("entityType", ["ItemPostingGroup", "Location"])];
            case 53:
                _0 = _27.sent();
                return [3 /*break*/, 55];
            case 54:
                _0 = null;
                _27.label = 55;
            case 55:
                dimensionsScrap = _0;
                dimensionMapScrap_1 = new Map();
                if (dimensionsScrap === null || dimensionsScrap === void 0 ? void 0 : dimensionsScrap.data) {
                    for (_1 = 0, _2 = dimensionsScrap.data; _1 < _2.length; _1++) {
                        dim = _2[_1];
                        if (dim.entityType)
                            dimensionMapScrap_1.set(dim.entityType, dim.id);
                    }
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var entity, material, quantity, itemLedger, job, item, activityId, currentQuantityIssued, newQuantityIssued;
                        var _a, _b, _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    entity = trackedEntity_1.data;
                                    material = jobMaterial_1.data;
                                    quantity = Number(entity.quantity);
                                    return [4 /*yield*/, trx
                                            .selectFrom("itemLedger")
                                            .where("trackedEntityId", "=", trackedEntityId_3)
                                            .orderBy("createdAt", "desc")
                                            .selectAll()
                                            .executeTakeFirst()];
                                case 1:
                                    itemLedger = _e.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("job")
                                            .select(["id", "locationId", "itemId"])
                                            .where("id", "=", material.jobId)
                                            .executeTakeFirst()];
                                case 2:
                                    job = _e.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("item")
                                            .where("id", "=", material.itemId)
                                            .select(["readableIdWithRevision"])
                                            .executeTakeFirst()];
                                case 3:
                                    item = _e.sent();
                                    activityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: activityId,
                                            type: "Consume",
                                            sourceDocument: "Job Material",
                                            sourceDocumentId: materialId_2,
                                            sourceDocumentReadableId: (_a = item === null || item === void 0 ? void 0 : item.readableIdWithRevision) !== null && _a !== void 0 ? _a : "",
                                            attributes: {
                                                Job: job === null || job === void 0 ? void 0 : job.id,
                                                "Job Make Method": material.jobMakeMethodId,
                                                "Job Material": material.id,
                                                Employee: userId_5,
                                                Scrapped: true,
                                            },
                                            companyId: companyId_5,
                                            createdBy: userId_5,
                                        })
                                            .execute()];
                                case 4:
                                    _e.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: activityId,
                                            trackedEntityId: trackedEntityId_3,
                                            quantity: quantity,
                                            companyId: companyId_5,
                                            createdBy: userId_5,
                                        })
                                            .execute()];
                                case 5:
                                    _e.sent();
                                    if (!parentTrackedEntityId_1) return [3 /*break*/, 7];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityOutput")
                                            .values({
                                            trackedActivityId: activityId,
                                            trackedEntityId: parentTrackedEntityId_1,
                                            quantity: quantity,
                                            companyId: companyId_5,
                                            createdBy: userId_5,
                                        })
                                            .execute()];
                                case 6:
                                    _e.sent();
                                    _e.label = 7;
                                case 7: return [4 /*yield*/, trx
                                        .updateTable("trackedEntity")
                                        .set({
                                        status: "Consumed",
                                    })
                                        .where("id", "=", trackedEntityId_3)
                                        .execute()];
                                case 8:
                                    _e.sent();
                                    if (!(material.methodType !== "Make to Order")) return [3 /*break*/, 11];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values({
                                            entryType: "Consumption",
                                            documentType: "Job Consumption",
                                            documentId: job === null || job === void 0 ? void 0 : job.id,
                                            companyId: companyId_5,
                                            itemId: entity.sourceDocumentId,
                                            quantity: -quantity,
                                            locationId: (_b = job === null || job === void 0 ? void 0 : job.locationId) !== null && _b !== void 0 ? _b : itemLedger === null || itemLedger === void 0 ? void 0 : itemLedger.locationId,
                                            storageUnitId: itemLedger === null || itemLedger === void 0 ? void 0 : itemLedger.storageUnitId,
                                            trackedEntityId: trackedEntityId_3,
                                            createdBy: userId_5,
                                        })
                                            .execute()];
                                case 9:
                                    _e.sent();
                                    if (!(accountingEnabledScrap_1 && (accountDefaultsScrap_1 === null || accountDefaultsScrap_1 === void 0 ? void 0 : accountDefaultsScrap_1.data))) return [3 /*break*/, 11];
                                    return [4 /*yield*/, createMaterialWipEntries(trx, {
                                            consumptionLedgers: [{ itemId: entity.sourceDocumentId, quantity: -quantity }],
                                            jobId: job === null || job === void 0 ? void 0 : job.id,
                                            operationId: material.jobOperationId,
                                            description: "Scrap \u2014 ".concat((_c = item === null || item === void 0 ? void 0 : item.readableIdWithRevision) !== null && _c !== void 0 ? _c : ""),
                                            wipAccount: accountDefaultsScrap_1.data.workInProgressAccount,
                                            inventoryAccount: accountDefaultsScrap_1.data.inventoryAccount,
                                            dimensionMap: dimensionMapScrap_1,
                                            jobLocationId: (_d = job === null || job === void 0 ? void 0 : job.locationId) !== null && _d !== void 0 ? _d : null,
                                            client: client_5,
                                            db: db,
                                            companyId: companyId_5,
                                            userId: userId_5,
                                        })];
                                case 10:
                                    _e.sent();
                                    _e.label = 11;
                                case 11:
                                    currentQuantityIssued = Number(material.quantityIssued) || 0;
                                    newQuantityIssued = currentQuantityIssued + quantity;
                                    return [4 /*yield*/, trx
                                            .updateTable("jobMaterial")
                                            .set({
                                            quantityIssued: newQuantityIssued,
                                        })
                                            .where("id", "=", materialId_2)
                                            .execute()];
                                case 12:
                                    _e.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 56:
                _27.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        success: true,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 200,
                    })];
            case 57:
                materialId_3 = validatedPayload.materialId, jobOperationId_1 = validatedPayload.jobOperationId, itemId_2 = validatedPayload.itemId, parentTrackedEntityId_2 = validatedPayload.parentTrackedEntityId, children_1 = validatedPayload.children, overrideExpired_1 = validatedPayload.overrideExpired, overrideReason_1 = validatedPayload.overrideReason, companyId_6 = validatedPayload.companyId, userId_6 = validatedPayload.userId;
                if (!parentTrackedEntityId_2) {
                    throw new Error("Parent ID is required");
                }
                if (children_1.length === 0) {
                    throw new Error("Children are required");
                }
                // Either materialId or (jobOperationId + itemId) must be provided
                if (!materialId_3 && (!jobOperationId_1 || !itemId_2)) {
                    throw new Error("Either materialId or both jobOperationId and itemId must be provided");
                }
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_6, userId_6, { update: "production" })];
            case 58:
                client_6 = _27.sent();
                return [4 /*yield*/, Promise.all([
                        client_6
                            .from("companySettings")
                            .select("accountingEnabled")
                            .eq("id", companyId_6)
                            .single(),
                        client_6.from("company").select("companyGroupId").eq("id", companyId_6).single(),
                    ])];
            case 59:
                _3 = _27.sent(), accountingSettingsTracked = _3[0], companyRecordTracked = _3[1];
                if (companyRecordTracked.error)
                    throw new Error("Failed to fetch company");
                accountingEnabledTracked_1 = (_24 = (_23 = accountingSettingsTracked.data) === null || _23 === void 0 ? void 0 : _23.accountingEnabled) !== null && _24 !== void 0 ? _24 : false;
                if (!accountingEnabledTracked_1) return [3 /*break*/, 61];
                return [4 /*yield*/, (0, get_posting_group_ts_1.getDefaultPostingGroup)(client_6, companyId_6)];
            case 60:
                _4 = _27.sent();
                return [3 /*break*/, 62];
            case 61:
                _4 = null;
                _27.label = 62;
            case 62:
                accountDefaultsTracked_1 = _4;
                if (accountingEnabledTracked_1 && ((accountDefaultsTracked_1 === null || accountDefaultsTracked_1 === void 0 ? void 0 : accountDefaultsTracked_1.error) || !(accountDefaultsTracked_1 === null || accountDefaultsTracked_1 === void 0 ? void 0 : accountDefaultsTracked_1.data))) {
                    throw new Error("Error getting account defaults");
                }
                if (!accountingEnabledTracked_1) return [3 /*break*/, 64];
                return [4 /*yield*/, client_6
                        .from("dimension")
                        .select("id, entityType")
                        .eq("companyGroupId", companyRecordTracked.data.companyGroupId)
                        .eq("active", true)
                        .in("entityType", ["ItemPostingGroup", "Location"])];
            case 63:
                _5 = _27.sent();
                return [3 /*break*/, 65];
            case 64:
                _5 = null;
                _27.label = 65;
            case 65:
                dimensionsTracked = _5;
                dimensionMapTracked_1 = new Map();
                if (dimensionsTracked === null || dimensionsTracked === void 0 ? void 0 : dimensionsTracked.data) {
                    for (_6 = 0, _7 = dimensionsTracked.data; _6 < _7.length; _6++) {
                        dim = _7[_6];
                        if (dim.entityType)
                            dimensionMapTracked_1.set(dim.entityType, dim.id);
                    }
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var trackedEntities, itemLedgers, expiredPolicy, expiredCheck, jobMaterial, actualMaterialId, firstTrackedEntity, totalChildQuantity_1, itemCost, newJobMaterial, jobOperation, item_1, totalChildQuantity_2, itemCost, newJobMaterial, item, job, parentTrackedEntity, activityId, itemLedgerInserts, trackedActivityInputs, splitEntities, _loop_1, _i, children_5, child, _a, itemLedgerInserts_6, ledger, consumptionEntries, totalChildQuantity, currentQuantityIssued, newQuantityIssued;
                        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
                        return __generator(this, function (_v) {
                            switch (_v.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("trackedEntity")
                                        .where("id", "in", children_1.map(function (child) { return child.trackedEntityId; }))
                                        .selectAll()
                                        .execute()];
                                case 1:
                                    trackedEntities = _v.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("itemLedger")
                                            .where("trackedEntityId", "in", __spreadArray([], children_1.map(function (child) { return child.trackedEntityId; }), true))
                                            .orderBy("createdBy", "desc")
                                            .selectAll()
                                            .execute()];
                                case 2:
                                    itemLedgers = _v.sent();
                                    if (trackedEntities.length !== children_1.length) {
                                        throw new Error("Tracked entities not found");
                                    }
                                    if (trackedEntities.some(function (entity) { return entity.status !== "Available"; })) {
                                        throw new Error("Tracked entities are not available");
                                    }
                                    return [4 /*yield*/, getExpiredEntityPolicy(trx, companyId_6)];
                                case 3:
                                    expiredPolicy = _v.sent();
                                    expiredCheck = checkExpiredEntities(trackedEntities.map(function (e) { return ({
                                        id: e.id,
                                        expirationDate: e.expirationDate,
                                    }); }), expiredPolicy, { allowed: !!overrideExpired_1, reason: overrideReason_1 !== null && overrideReason_1 !== void 0 ? overrideReason_1 : null });
                                    if (!expiredCheck.ok) {
                                        throw new Error(expiredCheck.reason);
                                    }
                                    if (expiredCheck.warning) {
                                        expiredWarning_1 = expiredCheck.warning;
                                    }
                                    actualMaterialId = materialId_3;
                                    firstTrackedEntity = trackedEntities[0];
                                    if (!materialId_3) return [3 /*break*/, 9];
                                    return [4 /*yield*/, trx
                                            .selectFrom("jobMaterial")
                                            .where("id", "=", materialId_3)
                                            .selectAll()
                                            .executeTakeFirst()];
                                case 4:
                                    // Existing behavior: fetch the jobMaterial
                                    jobMaterial = _v.sent();
                                    if (!(firstTrackedEntity &&
                                        jobMaterial &&
                                        firstTrackedEntity.sourceDocumentId !== jobMaterial.itemId)) return [3 /*break*/, 8];
                                    totalChildQuantity_1 = children_1.reduce(function (sum, child) {
                                        return sum + Number(child.quantity);
                                    }, 0);
                                    return [4 /*yield*/, trx
                                            .selectFrom("itemCost")
                                            .where("itemId", "=", firstTrackedEntity.sourceDocumentId)
                                            .select("unitCost")
                                            .executeTakeFirst()];
                                case 5:
                                    itemCost = _v.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("jobMaterial")
                                            .values({
                                            companyId: companyId_6,
                                            createdBy: userId_6,
                                            description: (_b = firstTrackedEntity.sourceDocumentReadableId) !== null && _b !== void 0 ? _b : "",
                                            estimatedQuantity: 0,
                                            itemId: firstTrackedEntity.sourceDocumentId,
                                            jobId: jobMaterial.jobId,
                                            jobMakeMethodId: jobMaterial.jobMakeMethodId,
                                            jobOperationId: jobMaterial.jobOperationId,
                                            itemType: jobMaterial.itemType,
                                            methodType: jobMaterial.methodType,
                                            quantity: 0,
                                            quantityIssued: totalChildQuantity_1,
                                            requiresBatchTracking: jobMaterial.requiresBatchTracking,
                                            requiresSerialTracking: jobMaterial.requiresSerialTracking,
                                            unitCost: (_c = itemCost === null || itemCost === void 0 ? void 0 : itemCost.unitCost) !== null && _c !== void 0 ? _c : 0,
                                        })
                                            .returning("id")
                                            .executeTakeFirstOrThrow()];
                                case 6:
                                    newJobMaterial = _v.sent();
                                    actualMaterialId = newJobMaterial.id;
                                    return [4 /*yield*/, trx
                                            .selectFrom("jobMaterial")
                                            .where("id", "=", actualMaterialId)
                                            .selectAll()
                                            .executeTakeFirstOrThrow()];
                                case 7:
                                    // Fetch the newly created jobMaterial
                                    jobMaterial = _v.sent();
                                    _v.label = 8;
                                case 8: return [3 /*break*/, 15];
                                case 9:
                                    if (!(jobOperationId_1 && itemId_2)) return [3 /*break*/, 15];
                                    return [4 /*yield*/, trx
                                            .selectFrom("jobOperation")
                                            .where("id", "=", jobOperationId_1)
                                            .select(["jobId", "jobMakeMethodId"])
                                            .executeTakeFirst()];
                                case 10:
                                    jobOperation = _v.sent();
                                    if (!jobOperation) {
                                        throw new Error("Job operation not found");
                                    }
                                    return [4 /*yield*/, trx
                                            .selectFrom("item")
                                            .where("id", "=", itemId_2)
                                            .select(["name", "type", "itemTrackingType", "defaultMethodType"])
                                            .executeTakeFirst()];
                                case 11:
                                    item_1 = _v.sent();
                                    if (!item_1) {
                                        throw new Error("Item not found");
                                    }
                                    totalChildQuantity_2 = children_1.reduce(function (sum, child) {
                                        return sum + Number(child.quantity);
                                    }, 0);
                                    return [4 /*yield*/, trx
                                            .selectFrom("itemCost")
                                            .where("itemId", "=", itemId_2)
                                            .select("unitCost")
                                            .executeTakeFirst()];
                                case 12:
                                    itemCost = _v.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("jobMaterial")
                                            .values({
                                            companyId: companyId_6,
                                            createdBy: userId_6,
                                            description: (_d = item_1.name) !== null && _d !== void 0 ? _d : "",
                                            estimatedQuantity: 0,
                                            itemId: itemId_2,
                                            jobId: jobOperation.jobId,
                                            jobMakeMethodId: jobOperation.jobMakeMethodId,
                                            jobOperationId: jobOperationId_1,
                                            itemType: (_e = item_1.type) !== null && _e !== void 0 ? _e : "Part",
                                            methodType: (_f = item_1.defaultMethodType) !== null && _f !== void 0 ? _f : "Pull from Inventory",
                                            quantity: 0,
                                            quantityIssued: totalChildQuantity_2,
                                            requiresBatchTracking: item_1.itemTrackingType === "Batch",
                                            requiresSerialTracking: item_1.itemTrackingType === "Serial",
                                            unitCost: (_g = itemCost === null || itemCost === void 0 ? void 0 : itemCost.unitCost) !== null && _g !== void 0 ? _g : 0,
                                        })
                                            .returning("id")
                                            .executeTakeFirstOrThrow()];
                                case 13:
                                    newJobMaterial = _v.sent();
                                    actualMaterialId = newJobMaterial.id;
                                    return [4 /*yield*/, trx
                                            .selectFrom("jobMaterial")
                                            .where("id", "=", actualMaterialId)
                                            .selectAll()
                                            .executeTakeFirstOrThrow()];
                                case 14:
                                    // Fetch the newly created jobMaterial
                                    jobMaterial = _v.sent();
                                    _v.label = 15;
                                case 15:
                                    if (!jobMaterial) {
                                        throw new Error("Job material not found");
                                    }
                                    return [4 /*yield*/, trx
                                            .selectFrom("item")
                                            .where("id", "=", jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.itemId)
                                            .select(["readableIdWithRevision"])
                                            .executeTakeFirst()];
                                case 16:
                                    item = _v.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("job")
                                            .select(["id", "locationId"])
                                            .where("id", "=", jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.jobId)
                                            .executeTakeFirst()];
                                case 17:
                                    job = _v.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .where("id", "=", parentTrackedEntityId_2)
                                            .select([
                                            "id",
                                            "sourceDocumentId",
                                            "quantity",
                                            "attributes",
                                            "status",
                                        ])
                                            .executeTakeFirst()];
                                case 18:
                                    parentTrackedEntity = _v.sent();
                                    if (!parentTrackedEntity) {
                                        throw new Error("Parent tracked entity not found");
                                    }
                                    activityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: activityId,
                                            type: "Consume",
                                            sourceDocument: "Job Material",
                                            sourceDocumentId: actualMaterialId,
                                            sourceDocumentReadableId: (_h = item === null || item === void 0 ? void 0 : item.readableIdWithRevision) !== null && _h !== void 0 ? _h : "",
                                            attributes: {
                                                Job: job === null || job === void 0 ? void 0 : job.id,
                                                "Job Make Method": jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.jobMakeMethodId,
                                                "Job Material": jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.id,
                                                Employee: userId_6,
                                            },
                                            companyId: companyId_6,
                                            createdBy: userId_6,
                                        })
                                            .execute()];
                                case 19:
                                    _v.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityOutput")
                                            .values({
                                            trackedActivityId: activityId,
                                            trackedEntityId: parentTrackedEntityId_2,
                                            quantity: parentTrackedEntity.quantity,
                                            companyId: companyId_6,
                                            createdBy: userId_6,
                                        })
                                            .execute()];
                                case 20:
                                    _v.sent();
                                    itemLedgerInserts = [];
                                    trackedActivityInputs = [];
                                    splitEntities = [];
                                    _loop_1 = function (child) {
                                        var trackedEntity, trackedEntityId, quantity, remainingQuantity, newTrackedEntityId, splitActivityId;
                                        return __generator(this, function (_w) {
                                            switch (_w.label) {
                                                case 0:
                                                    trackedEntity = trackedEntities.find(function (entity) { return entity.id === child.trackedEntityId; });
                                                    if (!trackedEntity) {
                                                        throw new Error("Tracked entity not found");
                                                    }
                                                    trackedEntityId = child.trackedEntityId, quantity = child.quantity;
                                                    if (!(Number(trackedEntity.quantity) !== quantity)) return [3 /*break*/, 6];
                                                    remainingQuantity = Number(trackedEntity.quantity) - quantity;
                                                    newTrackedEntityId = (0, nanoid_ts_1.nanoid)();
                                                    console.log("Split quantities:", {
                                                        childQuantity: Number(trackedEntity.quantity),
                                                        availableQuantity: quantity,
                                                        remainingQuantity: remainingQuantity,
                                                    });
                                                    // Track split entity for return
                                                    splitEntities.push({
                                                        originalId: trackedEntityId,
                                                        newId: newTrackedEntityId,
                                                        readableId: (_j = trackedEntity.sourceDocumentReadableId) !== null && _j !== void 0 ? _j : "",
                                                        quantity: remainingQuantity,
                                                    });
                                                    splitActivityId = (0, nanoid_ts_1.nanoid)();
                                                    return [4 /*yield*/, trx
                                                            .insertInto("trackedActivity")
                                                            .values({
                                                            id: splitActivityId,
                                                            type: "Split",
                                                            sourceDocument: "Job Material",
                                                            sourceDocumentId: actualMaterialId,
                                                            attributes: {
                                                                "Original Quantity": Number(trackedEntity.quantity),
                                                                "Consumed Quantity": quantity,
                                                                "Remaining Quantity": remainingQuantity,
                                                                "Split Entity ID": newTrackedEntityId,
                                                            },
                                                            companyId: companyId_6,
                                                            createdBy: userId_6,
                                                        })
                                                            .execute()];
                                                case 1:
                                                    _w.sent();
                                                    // Record original entity as input
                                                    return [4 /*yield*/, trx
                                                            .insertInto("trackedActivityInput")
                                                            .values({
                                                            trackedActivityId: splitActivityId,
                                                            trackedEntityId: trackedEntity.id,
                                                            quantity: Number(trackedEntity.quantity),
                                                            companyId: companyId_6,
                                                            createdBy: userId_6,
                                                        })
                                                            .execute()];
                                                case 2:
                                                    // Record original entity as input
                                                    _w.sent();
                                                    // Create new tracked entity for remaining quantity
                                                    return [4 /*yield*/, trx
                                                            .insertInto("trackedEntity")
                                                            .values({
                                                            id: newTrackedEntityId,
                                                            readableId: trackedEntity.readableId,
                                                            sourceDocumentId: trackedEntity.sourceDocumentId,
                                                            sourceDocument: "Item",
                                                            sourceDocumentReadableId: trackedEntity.sourceDocumentReadableId,
                                                            quantity: remainingQuantity,
                                                            status: (_k = trackedEntity.status) !== null && _k !== void 0 ? _k : "Available",
                                                            attributes: trackedEntity.attributes,
                                                            itemId: (_l = trackedEntity.itemId) !== null && _l !== void 0 ? _l : trackedEntity.sourceDocumentId,
                                                            expirationDate: (_m = trackedEntity.expirationDate) !== null && _m !== void 0 ? _m : null,
                                                            companyId: companyId_6,
                                                            createdBy: userId_6,
                                                        })
                                                            .execute()];
                                                case 3:
                                                    // Create new tracked entity for remaining quantity
                                                    _w.sent();
                                                    // Update original entity attributes with split reference
                                                    return [4 /*yield*/, trx
                                                            .updateTable("trackedEntity")
                                                            .set({
                                                            quantity: quantity,
                                                            attributes: __assign(__assign({}, ((_o = trackedEntity.attributes) !== null && _o !== void 0 ? _o : {})), { "Split Entity ID": newTrackedEntityId }),
                                                        })
                                                            .where("id", "=", trackedEntityId)
                                                            .execute()];
                                                case 4:
                                                    // Update original entity attributes with split reference
                                                    _w.sent();
                                                    // Record outputs from split
                                                    return [4 /*yield*/, trx
                                                            .insertInto("trackedActivityOutput")
                                                            .values([
                                                            {
                                                                trackedActivityId: splitActivityId,
                                                                trackedEntityId: newTrackedEntityId,
                                                                quantity: remainingQuantity,
                                                                companyId: companyId_6,
                                                                createdBy: userId_6,
                                                            },
                                                            {
                                                                trackedActivityId: splitActivityId,
                                                                trackedEntityId: trackedEntity.id,
                                                                quantity: quantity,
                                                                companyId: companyId_6,
                                                                createdBy: userId_6,
                                                            },
                                                        ])
                                                            .execute()];
                                                case 5:
                                                    // Record outputs from split
                                                    _w.sent();
                                                    // Create item ledger entries for split
                                                    console.log("Item ledger split entries:", {
                                                        parentQuantity: -Number(trackedEntity.quantity),
                                                        quantity: quantity,
                                                        remainingQuantity: remainingQuantity,
                                                    });
                                                    if ((jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.methodType) !== "Make to Order") {
                                                        itemLedgerInserts.push({
                                                            entryType: "Negative Adjmt.",
                                                            documentType: "Batch Split",
                                                            documentId: splitActivityId,
                                                            companyId: companyId_6,
                                                            itemId: trackedEntity.sourceDocumentId,
                                                            quantity: -Number(trackedEntity.quantity),
                                                            locationId: job === null || job === void 0 ? void 0 : job.locationId,
                                                            storageUnitId: (_p = itemLedgers.find(function (itemLedger) {
                                                                return itemLedger.trackedEntityId === trackedEntityId;
                                                            })) === null || _p === void 0 ? void 0 : _p.storageUnitId,
                                                            trackedEntityId: trackedEntity.id,
                                                            createdBy: userId_6,
                                                        }, {
                                                            entryType: "Positive Adjmt.",
                                                            documentType: "Batch Split",
                                                            documentId: splitActivityId,
                                                            companyId: companyId_6,
                                                            itemId: trackedEntity.sourceDocumentId,
                                                            quantity: quantity,
                                                            locationId: job === null || job === void 0 ? void 0 : job.locationId,
                                                            storageUnitId: (_q = itemLedgers.find(function (itemLedger) {
                                                                return itemLedger.trackedEntityId === trackedEntityId;
                                                            })) === null || _q === void 0 ? void 0 : _q.storageUnitId,
                                                            trackedEntityId: trackedEntity.id,
                                                            createdBy: userId_6,
                                                        }, {
                                                            entryType: "Positive Adjmt.",
                                                            documentType: "Batch Split",
                                                            documentId: splitActivityId,
                                                            companyId: companyId_6,
                                                            itemId: trackedEntity.sourceDocumentId,
                                                            quantity: remainingQuantity,
                                                            locationId: job === null || job === void 0 ? void 0 : job.locationId,
                                                            storageUnitId: (_r = itemLedgers.find(function (itemLedger) {
                                                                return itemLedger.trackedEntityId === trackedEntityId;
                                                            })) === null || _r === void 0 ? void 0 : _r.storageUnitId,
                                                            trackedEntityId: newTrackedEntityId,
                                                            createdBy: userId_6,
                                                        });
                                                    }
                                                    _w.label = 6;
                                                case 6: 
                                                // Update tracked entity status to consumed
                                                return [4 /*yield*/, trx
                                                        .updateTable("trackedEntity")
                                                        .set({
                                                        status: "Consumed",
                                                    })
                                                        .where("id", "=", trackedEntityId)
                                                        .execute()];
                                                case 7:
                                                    // Update tracked entity status to consumed
                                                    _w.sent();
                                                    trackedActivityInputs.push({
                                                        trackedActivityId: activityId,
                                                        trackedEntityId: trackedEntityId,
                                                        quantity: quantity,
                                                        companyId: companyId_6,
                                                        createdBy: userId_6,
                                                    });
                                                    if ((jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.methodType) !== "Make to Order") {
                                                        itemLedgerInserts.push({
                                                            entryType: "Consumption",
                                                            documentType: "Job Consumption",
                                                            documentId: job === null || job === void 0 ? void 0 : job.id,
                                                            companyId: companyId_6,
                                                            itemId: trackedEntity.sourceDocumentId,
                                                            quantity: -quantity,
                                                            locationId: job === null || job === void 0 ? void 0 : job.locationId,
                                                            storageUnitId: (_s = itemLedgers.find(function (itemLedger) { return itemLedger.trackedEntityId === trackedEntityId; })) === null || _s === void 0 ? void 0 : _s.storageUnitId,
                                                            trackedEntityId: trackedEntityId,
                                                            createdBy: userId_6,
                                                        });
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, children_5 = children_1;
                                    _v.label = 21;
                                case 21:
                                    if (!(_i < children_5.length)) return [3 /*break*/, 24];
                                    child = children_5[_i];
                                    return [5 /*yield**/, _loop_1(child)];
                                case 22:
                                    _v.sent();
                                    _v.label = 23;
                                case 23:
                                    _i++;
                                    return [3 /*break*/, 21];
                                case 24:
                                    if (!(trackedActivityInputs.length > 0)) return [3 /*break*/, 26];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values(trackedActivityInputs)
                                            .execute()];
                                case 25:
                                    _v.sent();
                                    _v.label = 26;
                                case 26:
                                    if (!(itemLedgerInserts.length > 0)) return [3 /*break*/, 31];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts)
                                            .execute()];
                                case 27:
                                    _v.sent();
                                    _a = 0, itemLedgerInserts_6 = itemLedgerInserts;
                                    _v.label = 28;
                                case 28:
                                    if (!(_a < itemLedgerInserts_6.length)) return [3 /*break*/, 31];
                                    ledger = itemLedgerInserts_6[_a];
                                    return [4 /*yield*/, (0, storage_units_ts_1.updatePickMethodDefaultStorageUnitIfNeeded)(trx, ledger.itemId, ledger.locationId, ledger.storageUnitId, companyId_6, userId_6)];
                                case 29:
                                    _v.sent();
                                    _v.label = 30;
                                case 30:
                                    _a++;
                                    return [3 /*break*/, 28];
                                case 31:
                                    if (!(accountingEnabledTracked_1 && (accountDefaultsTracked_1 === null || accountDefaultsTracked_1 === void 0 ? void 0 : accountDefaultsTracked_1.data) && itemLedgerInserts.length > 0)) return [3 /*break*/, 33];
                                    consumptionEntries = itemLedgerInserts
                                        .filter(function (l) { return l.entryType === "Consumption"; })
                                        .map(function (l) { return ({ itemId: l.itemId, quantity: Number(l.quantity) }); });
                                    if (!(consumptionEntries.length > 0)) return [3 /*break*/, 33];
                                    return [4 /*yield*/, createMaterialWipEntries(trx, {
                                            consumptionLedgers: consumptionEntries,
                                            jobId: job === null || job === void 0 ? void 0 : job.id,
                                            operationId: (_t = jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.jobOperationId) !== null && _t !== void 0 ? _t : actualMaterialId,
                                            description: "Tracked Entity Material Issue",
                                            wipAccount: accountDefaultsTracked_1.data.workInProgressAccount,
                                            inventoryAccount: accountDefaultsTracked_1.data.inventoryAccount,
                                            dimensionMap: dimensionMapTracked_1,
                                            jobLocationId: (_u = job === null || job === void 0 ? void 0 : job.locationId) !== null && _u !== void 0 ? _u : null,
                                            client: client_6,
                                            db: db,
                                            companyId: companyId_6,
                                            userId: userId_6,
                                        })];
                                case 32:
                                    _v.sent();
                                    _v.label = 33;
                                case 33:
                                    totalChildQuantity = children_1.reduce(function (sum, child) {
                                        return sum + Number(child.quantity);
                                    }, 0);
                                    if (!(actualMaterialId === materialId_3)) return [3 /*break*/, 35];
                                    currentQuantityIssued = Number(jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.quantityIssued) || 0;
                                    newQuantityIssued = currentQuantityIssued + totalChildQuantity;
                                    return [4 /*yield*/, trx
                                            .updateTable("jobMaterial")
                                            .set({
                                            quantityIssued: newQuantityIssued,
                                        })
                                            .where("id", "=", actualMaterialId)
                                            .execute()];
                                case 34:
                                    _v.sent();
                                    console.log("Job material quantity updated:", {
                                        materialId: actualMaterialId,
                                        newQuantityIssued: newQuantityIssued,
                                    });
                                    _v.label = 35;
                                case 35: return [2 /*return*/, splitEntities];
                            }
                        });
                    }); })];
            case 66:
                splitEntities = _27.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        success: true,
                        splitEntities: splitEntities,
                        warning: expiredWarning_1,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 200,
                    })];
            case 67:
                materialId_4 = validatedPayload.materialId, parentTrackedEntityId_3 = validatedPayload.parentTrackedEntityId, children_2 = validatedPayload.children, companyId_7 = validatedPayload.companyId, userId_7 = validatedPayload.userId;
                if (!parentTrackedEntityId_3) {
                    throw new Error("Parent ID is required");
                }
                if (children_2.length === 0) {
                    throw new Error("Children are required");
                }
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_7, userId_7, { update: "production" })];
            case 68:
                clientUnconsume_1 = _27.sent();
                return [4 /*yield*/, Promise.all([
                        clientUnconsume_1
                            .from("companySettings")
                            .select("accountingEnabled")
                            .eq("id", companyId_7)
                            .single(),
                        clientUnconsume_1.from("company").select("companyGroupId").eq("id", companyId_7).single(),
                    ])];
            case 69:
                _8 = _27.sent(), accountingSettingsUnconsume = _8[0], companyRecordUnconsume = _8[1];
                if (companyRecordUnconsume.error)
                    throw new Error("Failed to fetch company");
                accountingEnabledUnconsume_1 = (_26 = (_25 = accountingSettingsUnconsume.data) === null || _25 === void 0 ? void 0 : _25.accountingEnabled) !== null && _26 !== void 0 ? _26 : false;
                if (!accountingEnabledUnconsume_1) return [3 /*break*/, 71];
                return [4 /*yield*/, (0, get_posting_group_ts_1.getDefaultPostingGroup)(clientUnconsume_1, companyId_7)];
            case 70:
                _9 = _27.sent();
                return [3 /*break*/, 72];
            case 71:
                _9 = null;
                _27.label = 72;
            case 72:
                accountDefaultsUnconsume_1 = _9;
                if (accountingEnabledUnconsume_1 && ((accountDefaultsUnconsume_1 === null || accountDefaultsUnconsume_1 === void 0 ? void 0 : accountDefaultsUnconsume_1.error) || !(accountDefaultsUnconsume_1 === null || accountDefaultsUnconsume_1 === void 0 ? void 0 : accountDefaultsUnconsume_1.data))) {
                    throw new Error("Error getting account defaults");
                }
                if (!accountingEnabledUnconsume_1) return [3 /*break*/, 74];
                return [4 /*yield*/, clientUnconsume_1
                        .from("dimension")
                        .select("id, entityType")
                        .eq("companyGroupId", companyRecordUnconsume.data.companyGroupId)
                        .eq("active", true)
                        .in("entityType", ["ItemPostingGroup", "Location"])];
            case 73:
                _10 = _27.sent();
                return [3 /*break*/, 75];
            case 74:
                _10 = null;
                _27.label = 75;
            case 75:
                dimensionsUnconsume = _10;
                dimensionMapUnconsume_1 = new Map();
                if (dimensionsUnconsume === null || dimensionsUnconsume === void 0 ? void 0 : dimensionsUnconsume.data) {
                    for (_11 = 0, _12 = dimensionsUnconsume.data; _11 < _12.length; _11++) {
                        dim = _12[_11];
                        if (dim.entityType)
                            dimensionMapUnconsume_1.set(dim.entityType, dim.id);
                    }
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var trackedEntities, itemLedgers, jobMaterial, item, job, parentTrackedEntity, activityId, itemLedgerInserts, trackedActivityOutputs, _loop_2, _i, children_6, child, _a, itemLedgerInserts_7, ledger, returnEntries, totalChildQuantity, currentQuantityIssued, newQuantityIssued;
                        var _b, _c, _d, _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("trackedEntity")
                                        .where("id", "in", children_2.map(function (child) { return child.trackedEntityId; }))
                                        .selectAll()
                                        .execute()];
                                case 1:
                                    trackedEntities = _f.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("itemLedger")
                                            .where("trackedEntityId", "in", __spreadArray([], children_2.map(function (child) { return child.trackedEntityId; }), true))
                                            .orderBy("createdBy", "desc")
                                            .selectAll()
                                            .execute()];
                                case 2:
                                    itemLedgers = _f.sent();
                                    if (trackedEntities.length !== children_2.length) {
                                        throw new Error("Tracked entities not found");
                                    }
                                    if (trackedEntities.some(function (entity) { return entity.status !== "Consumed"; })) {
                                        throw new Error("Tracked entities must be in Consumed status to unconsume");
                                    }
                                    return [4 /*yield*/, trx
                                            .selectFrom("jobMaterial")
                                            .where("id", "=", materialId_4)
                                            .selectAll()
                                            .executeTakeFirst()];
                                case 3:
                                    jobMaterial = _f.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("item")
                                            .where("id", "=", jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.itemId)
                                            .select(["readableIdWithRevision"])
                                            .executeTakeFirst()];
                                case 4:
                                    item = _f.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("job")
                                            .select(["id", "locationId"])
                                            .where("id", "=", jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.jobId)
                                            .executeTakeFirst()];
                                case 5:
                                    job = _f.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .where("id", "=", parentTrackedEntityId_3)
                                            .select([
                                            "id",
                                            "sourceDocumentId",
                                            "quantity",
                                            "attributes",
                                            "status",
                                        ])
                                            .executeTakeFirst()];
                                case 6:
                                    parentTrackedEntity = _f.sent();
                                    if (!parentTrackedEntity) {
                                        throw new Error("Parent tracked entity not found");
                                    }
                                    activityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: activityId,
                                            type: "Unconsume",
                                            sourceDocument: "Job Material",
                                            sourceDocumentId: materialId_4,
                                            sourceDocumentReadableId: (_b = item === null || item === void 0 ? void 0 : item.readableIdWithRevision) !== null && _b !== void 0 ? _b : "",
                                            attributes: {
                                                Job: job === null || job === void 0 ? void 0 : job.id,
                                                "Job Make Method": jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.jobMakeMethodId,
                                                "Job Material": jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.id,
                                                Employee: userId_7,
                                            },
                                            companyId: companyId_7,
                                            createdBy: userId_7,
                                        })
                                            .execute()];
                                case 7:
                                    _f.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: activityId,
                                            trackedEntityId: parentTrackedEntityId_3,
                                            quantity: parentTrackedEntity.quantity,
                                            companyId: companyId_7,
                                            createdBy: userId_7,
                                        })
                                            .execute()];
                                case 8:
                                    _f.sent();
                                    itemLedgerInserts = [];
                                    trackedActivityOutputs = [];
                                    _loop_2 = function (child) {
                                        var trackedEntity, trackedEntityId, quantity;
                                        return __generator(this, function (_g) {
                                            switch (_g.label) {
                                                case 0:
                                                    trackedEntity = trackedEntities.find(function (entity) { return entity.id === child.trackedEntityId; });
                                                    if (!trackedEntity) {
                                                        throw new Error("Tracked entity not found");
                                                    }
                                                    trackedEntityId = child.trackedEntityId, quantity = child.quantity;
                                                    // Update tracked entity status back to Available
                                                    return [4 /*yield*/, trx
                                                            .updateTable("trackedEntity")
                                                            .set({
                                                            status: "Available",
                                                        })
                                                            .where("id", "=", trackedEntityId)
                                                            .execute()];
                                                case 1:
                                                    // Update tracked entity status back to Available
                                                    _g.sent();
                                                    trackedActivityOutputs.push({
                                                        trackedActivityId: activityId,
                                                        trackedEntityId: trackedEntityId,
                                                        quantity: quantity,
                                                        companyId: companyId_7,
                                                        createdBy: userId_7,
                                                    });
                                                    if ((jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.methodType) !== "Make to Order") {
                                                        itemLedgerInserts.push({
                                                            entryType: "Consumption",
                                                            documentType: "Job Consumption",
                                                            documentId: job === null || job === void 0 ? void 0 : job.id,
                                                            companyId: companyId_7,
                                                            itemId: trackedEntity.sourceDocumentId,
                                                            quantity: quantity,
                                                            locationId: job === null || job === void 0 ? void 0 : job.locationId,
                                                            storageUnitId: (_c = itemLedgers.find(function (itemLedger) { return itemLedger.trackedEntityId === trackedEntityId; })) === null || _c === void 0 ? void 0 : _c.storageUnitId,
                                                            trackedEntityId: trackedEntityId,
                                                            createdBy: userId_7,
                                                        });
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, children_6 = children_2;
                                    _f.label = 9;
                                case 9:
                                    if (!(_i < children_6.length)) return [3 /*break*/, 12];
                                    child = children_6[_i];
                                    return [5 /*yield**/, _loop_2(child)];
                                case 10:
                                    _f.sent();
                                    _f.label = 11;
                                case 11:
                                    _i++;
                                    return [3 /*break*/, 9];
                                case 12:
                                    if (!(trackedActivityOutputs.length > 0)) return [3 /*break*/, 14];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityOutput")
                                            .values(trackedActivityOutputs)
                                            .execute()];
                                case 13:
                                    _f.sent();
                                    _f.label = 14;
                                case 14:
                                    if (!(itemLedgerInserts.length > 0)) return [3 /*break*/, 21];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts)
                                            .execute()];
                                case 15:
                                    _f.sent();
                                    _a = 0, itemLedgerInserts_7 = itemLedgerInserts;
                                    _f.label = 16;
                                case 16:
                                    if (!(_a < itemLedgerInserts_7.length)) return [3 /*break*/, 19];
                                    ledger = itemLedgerInserts_7[_a];
                                    return [4 /*yield*/, (0, storage_units_ts_1.updatePickMethodDefaultStorageUnitIfNeeded)(trx, ledger.itemId, ledger.locationId, ledger.storageUnitId, companyId_7, userId_7)];
                                case 17:
                                    _f.sent();
                                    _f.label = 18;
                                case 18:
                                    _a++;
                                    return [3 /*break*/, 16];
                                case 19:
                                    if (!(accountingEnabledUnconsume_1 && (accountDefaultsUnconsume_1 === null || accountDefaultsUnconsume_1 === void 0 ? void 0 : accountDefaultsUnconsume_1.data))) return [3 /*break*/, 21];
                                    returnEntries = itemLedgerInserts.map(function (l) { return ({
                                        itemId: l.itemId,
                                        quantity: Number(l.quantity),
                                    }); });
                                    return [4 /*yield*/, createMaterialWipEntries(trx, {
                                            consumptionLedgers: returnEntries,
                                            jobId: job === null || job === void 0 ? void 0 : job.id,
                                            operationId: (_d = jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.jobOperationId) !== null && _d !== void 0 ? _d : materialId_4,
                                            description: "Unconsume Material Return",
                                            wipAccount: accountDefaultsUnconsume_1.data.workInProgressAccount,
                                            inventoryAccount: accountDefaultsUnconsume_1.data.inventoryAccount,
                                            dimensionMap: dimensionMapUnconsume_1,
                                            jobLocationId: (_e = job === null || job === void 0 ? void 0 : job.locationId) !== null && _e !== void 0 ? _e : null,
                                            client: clientUnconsume_1,
                                            db: db,
                                            companyId: companyId_7,
                                            userId: userId_7,
                                        })];
                                case 20:
                                    _f.sent();
                                    _f.label = 21;
                                case 21:
                                    totalChildQuantity = children_2.reduce(function (sum, child) {
                                        return sum + Number(child.quantity);
                                    }, 0);
                                    currentQuantityIssued = Number(jobMaterial === null || jobMaterial === void 0 ? void 0 : jobMaterial.quantityIssued) || 0;
                                    newQuantityIssued = currentQuantityIssued - totalChildQuantity;
                                    return [4 /*yield*/, trx
                                            .updateTable("jobMaterial")
                                            .set({
                                            quantityIssued: newQuantityIssued,
                                        })
                                            .where("id", "=", materialId_4)
                                            .execute()];
                                case 22:
                                    _f.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 76:
                _27.sent();
                return [3 /*break*/, 87];
            case 77:
                trackedEntityId_4 = validatedPayload.trackedEntityId, newRevision_1 = validatedPayload.newRevision, quantity_3 = validatedPayload.quantity, companyId_8 = validatedPayload.companyId, userId_8 = validatedPayload.userId;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var trackedEntity, oldItem, newItem, baseItem, insertedItem, oldItemCost, oldQuantity, oldUnitCost, totalValue, newUnitCost, conversionActivityId, existingLedger, oldQuantity, ledgerEntries, updatedItem;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("trackedEntity")
                                        .where("id", "=", trackedEntityId_4)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    trackedEntity = _c.sent();
                                    if (!trackedEntity.sourceDocumentId) {
                                        throw new Error("Tracked entity has no source document");
                                    }
                                    return [4 /*yield*/, trx
                                            .selectFrom("item")
                                            .where("id", "=", trackedEntity.sourceDocumentId)
                                            .select(["id", "readableId", "revision"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    oldItem = _c.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("item")
                                            .where("readableId", "=", oldItem.readableId)
                                            .where("revision", "=", newRevision_1)
                                            .where("companyId", "=", companyId_8)
                                            .select(["id", "readableId", "revision", "readableIdWithRevision"])
                                            .executeTakeFirst()];
                                case 3:
                                    newItem = _c.sent();
                                    if (!!newItem) return [3 /*break*/, 7];
                                    return [4 /*yield*/, trx
                                            .selectFrom("item")
                                            .where("id", "=", oldItem.id)
                                            .selectAll()
                                            .executeTakeFirstOrThrow()];
                                case 4:
                                    baseItem = _c.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("item")
                                            .values({
                                            readableId: oldItem.readableId,
                                            revision: newRevision_1,
                                            type: baseItem.type,
                                            active: baseItem.active,
                                            name: baseItem.name,
                                            description: baseItem.description,
                                            itemTrackingType: baseItem.itemTrackingType,
                                            replenishmentSystem: baseItem.replenishmentSystem,
                                            defaultMethodType: baseItem.defaultMethodType,
                                            unitOfMeasureCode: baseItem.unitOfMeasureCode,
                                            modelUploadId: baseItem.modelUploadId,
                                            companyId: companyId_8,
                                            createdBy: userId_8,
                                        })
                                            .returning([
                                            "id",
                                            "readableId",
                                            "revision",
                                            "readableIdWithRevision",
                                        ])
                                            .executeTakeFirstOrThrow()];
                                case 5:
                                    insertedItem = _c.sent();
                                    newItem = insertedItem;
                                    if (!(baseItem.type === "Part")) return [3 /*break*/, 7];
                                    return [4 /*yield*/, trx
                                            .insertInto("part")
                                            .values({
                                            id: oldItem.readableId,
                                            companyId: companyId_8,
                                            createdBy: userId_8,
                                        })
                                            .onConflict(function (oc) { return oc.columns(["id", "companyId"]).doNothing(); })
                                            .execute()];
                                case 6:
                                    _c.sent();
                                    _c.label = 7;
                                case 7:
                                    if (!oldItem.id) return [3 /*break*/, 10];
                                    return [4 /*yield*/, trx
                                            .selectFrom("itemCost")
                                            .where("itemId", "=", oldItem.id)
                                            .select(["unitCost"])
                                            .executeTakeFirst()];
                                case 8:
                                    oldItemCost = _c.sent();
                                    oldQuantity = Number(trackedEntity.quantity);
                                    oldUnitCost = Number((_a = oldItemCost === null || oldItemCost === void 0 ? void 0 : oldItemCost.unitCost) !== null && _a !== void 0 ? _a : 0);
                                    totalValue = oldQuantity * oldUnitCost;
                                    newUnitCost = totalValue / quantity_3;
                                    if (!(newItem === null || newItem === void 0 ? void 0 : newItem.id)) return [3 /*break*/, 10];
                                    return [4 /*yield*/, trx
                                            .updateTable("itemCost")
                                            .set({
                                            unitCost: newUnitCost,
                                            costIsAdjusted: true,
                                        })
                                            .where("itemId", "=", newItem.id)
                                            .execute()];
                                case 9:
                                    _c.sent();
                                    _c.label = 10;
                                case 10:
                                    conversionActivityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: conversionActivityId,
                                            type: "Convert",
                                            sourceDocument: "Revision Conversion",
                                            attributes: {
                                                "Old Revision": oldItem.revision,
                                                "New Revision": newRevision_1,
                                                "Old Item ID": oldItem.id,
                                                "New Item ID": newItem.id,
                                            },
                                            companyId: companyId_8,
                                            createdBy: userId_8,
                                        })
                                            .execute()];
                                case 11:
                                    _c.sent();
                                    if (!trackedEntity.id) return [3 /*break*/, 13];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values({
                                            trackedActivityId: conversionActivityId,
                                            trackedEntityId: trackedEntity.id,
                                            quantity: trackedEntity.quantity,
                                            companyId: companyId_8,
                                            createdBy: userId_8,
                                        })
                                            .execute()];
                                case 12:
                                    _c.sent();
                                    _c.label = 13;
                                case 13: 
                                // Update tracked entity to new revision
                                return [4 /*yield*/, trx
                                        .updateTable("trackedEntity")
                                        .set({
                                        sourceDocumentId: newItem.id,
                                        sourceDocumentReadableId: newItem.readableIdWithRevision,
                                        quantity: quantity_3,
                                    })
                                        .where("id", "=", trackedEntityId_4)
                                        .execute()];
                                case 14:
                                    // Update tracked entity to new revision
                                    _c.sent();
                                    if (!trackedEntity.id) return [3 /*break*/, 16];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityOutput")
                                            .values({
                                            trackedActivityId: conversionActivityId,
                                            trackedEntityId: trackedEntity.id,
                                            quantity: quantity_3,
                                            companyId: companyId_8,
                                            createdBy: userId_8,
                                        })
                                            .execute()];
                                case 15:
                                    _c.sent();
                                    _c.label = 16;
                                case 16: return [4 /*yield*/, trx
                                        .selectFrom("itemLedger")
                                        .where("trackedEntityId", "=", trackedEntityId_4)
                                        .select(["locationId", "storageUnitId"])
                                        .orderBy("createdAt", "desc")
                                        .executeTakeFirst()];
                                case 17:
                                    existingLedger = _c.sent();
                                    if (!(oldItem.id && (newItem === null || newItem === void 0 ? void 0 : newItem.id))) return [3 /*break*/, 19];
                                    oldQuantity = Number(trackedEntity.quantity);
                                    ledgerEntries = [
                                        // Remove old revision quantity
                                        {
                                            entryType: "Negative Adjmt.",
                                            documentType: "Batch Split",
                                            documentId: conversionActivityId,
                                            companyId: companyId_8,
                                            itemId: oldItem.id,
                                            quantity: -oldQuantity,
                                            locationId: existingLedger === null || existingLedger === void 0 ? void 0 : existingLedger.locationId,
                                            storageUnitId: existingLedger === null || existingLedger === void 0 ? void 0 : existingLedger.storageUnitId,
                                            trackedEntityId: trackedEntityId_4,
                                            createdBy: userId_8,
                                        },
                                        // Add new revision quantity
                                        {
                                            entryType: "Positive Adjmt.",
                                            documentType: "Batch Split",
                                            documentId: conversionActivityId,
                                            companyId: companyId_8,
                                            itemId: newItem.id,
                                            quantity: quantity_3,
                                            locationId: existingLedger === null || existingLedger === void 0 ? void 0 : existingLedger.locationId,
                                            storageUnitId: existingLedger === null || existingLedger === void 0 ? void 0 : existingLedger.storageUnitId,
                                            trackedEntityId: trackedEntityId_4,
                                            createdBy: userId_8,
                                        },
                                    ];
                                    return [4 /*yield*/, trx.insertInto("itemLedger").values(ledgerEntries).execute()];
                                case 18:
                                    _c.sent();
                                    _c.label = 19;
                                case 19:
                                    console.log("Entity converted:", {
                                        trackedEntityId: trackedEntityId_4,
                                        oldRevision: oldItem.revision,
                                        newRevision: newRevision_1,
                                        oldItemId: oldItem.id,
                                        newItemId: newItem.id,
                                    });
                                    return [4 /*yield*/, trx
                                            .selectFrom("item")
                                            .where("id", "=", newItem.id)
                                            .select(["readableIdWithRevision"])
                                            .executeTakeFirst()];
                                case 20:
                                    updatedItem = _c.sent();
                                    return [2 /*return*/, {
                                            trackedEntityId: trackedEntityId_4,
                                            readableId: (_b = updatedItem === null || updatedItem === void 0 ? void 0 : updatedItem.readableIdWithRevision) !== null && _b !== void 0 ? _b : oldItem.readableId,
                                            quantity: quantity_3,
                                        }];
                            }
                        });
                    }); })];
            case 78:
                convertedEntity = _27.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        success: true,
                        message: "Entity converted successfully",
                        convertedEntity: convertedEntity,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 200,
                    })];
            case 79:
                maintenanceDispatchId_1 = validatedPayload.maintenanceDispatchId, itemId_3 = validatedPayload.itemId, unitOfMeasureCode_1 = validatedPayload.unitOfMeasureCode, quantity_4 = validatedPayload.quantity, companyId_9 = validatedPayload.companyId, userId_9 = validatedPayload.userId;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var dispatch, locationId, item, dispatchItem, storageUnitId, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("maintenanceDispatch")
                                        .where("id", "=", maintenanceDispatchId_1)
                                        .select(["id", "maintenanceDispatchId", "workCenterId", "locationId"])
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    dispatch = _b.sent();
                                    locationId = dispatch.locationId;
                                    return [4 /*yield*/, trx
                                            .selectFrom("item")
                                            .where("id", "=", itemId_3)
                                            .select(["id", "itemTrackingType"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    item = _b.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("maintenanceDispatchItem")
                                            .values({
                                            maintenanceDispatchId: maintenanceDispatchId_1,
                                            itemId: itemId_3,
                                            unitOfMeasureCode: unitOfMeasureCode_1,
                                            quantity: quantity_4,
                                            companyId: companyId_9,
                                            createdBy: userId_9,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 3:
                                    dispatchItem = _b.sent();
                                    if (!(item.itemTrackingType !== "Serial" && item.itemTrackingType !== "Batch")) return [3 /*break*/, 9];
                                    if (!locationId) return [3 /*break*/, 5];
                                    return [4 /*yield*/, (0, storage_units_ts_1.getStorageUnitWithHighestQuantity)(trx, itemId_3, locationId)];
                                case 4:
                                    _a = _b.sent();
                                    return [3 /*break*/, 6];
                                case 5:
                                    _a = null;
                                    _b.label = 6;
                                case 6:
                                    storageUnitId = _a;
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values({
                                            entryType: "Consumption",
                                            documentType: "Maintenance Consumption",
                                            documentId: dispatch.id,
                                            documentLineId: dispatchItem.id,
                                            companyId: companyId_9,
                                            itemId: itemId_3,
                                            quantity: -quantity_4,
                                            locationId: locationId,
                                            storageUnitId: storageUnitId,
                                            createdBy: userId_9,
                                        })
                                            .execute()];
                                case 7:
                                    _b.sent();
                                    if (!locationId) return [3 /*break*/, 9];
                                    return [4 /*yield*/, (0, storage_units_ts_1.updatePickMethodDefaultStorageUnitIfNeeded)(trx, itemId_3, locationId, storageUnitId, companyId_9, userId_9)];
                                case 8:
                                    _b.sent();
                                    _b.label = 9;
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 80:
                _27.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        success: true,
                        message: "Material issued successfully",
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 200,
                    })];
            case 81:
                maintenanceDispatchId_2 = validatedPayload.maintenanceDispatchId, itemId_4 = validatedPayload.itemId, unitOfMeasureCode_2 = validatedPayload.unitOfMeasureCode, children_3 = validatedPayload.children, overrideExpired_2 = validatedPayload.overrideExpired, overrideReason_2 = validatedPayload.overrideReason, companyId_10 = validatedPayload.companyId, userId_10 = validatedPayload.userId;
                if (children_3.length === 0) {
                    throw new Error("At least one tracked entity is required");
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var dispatch, locationId, totalQuantity, dispatchItem, trackedEntities, itemLedgers, expiredPolicy, expiredCheck, item, maintenanceDispatchItemId, activityId, itemLedgerInserts, trackedActivityInputs, junctionInserts, splitEntities, _loop_3, _i, children_7, child, _a, itemLedgerInserts_8, ledger;
                        var _b, _c, _d, _e, _f, _g;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("maintenanceDispatch")
                                        .where("id", "=", maintenanceDispatchId_2)
                                        .select(["id", "maintenanceDispatchId", "workCenterId", "locationId"])
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    dispatch = _h.sent();
                                    locationId = dispatch.locationId;
                                    totalQuantity = children_3.reduce(function (sum, child) { return sum + Number(child.quantity); }, 0);
                                    return [4 /*yield*/, trx
                                            .insertInto("maintenanceDispatchItem")
                                            .values({
                                            maintenanceDispatchId: maintenanceDispatchId_2,
                                            itemId: itemId_4,
                                            unitOfMeasureCode: unitOfMeasureCode_2,
                                            quantity: totalQuantity,
                                            companyId: companyId_10,
                                            createdBy: userId_10,
                                        })
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    dispatchItem = _h.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .where("id", "in", children_3.map(function (child) { return child.trackedEntityId; }))
                                            .selectAll()
                                            .execute()];
                                case 3:
                                    trackedEntities = _h.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("itemLedger")
                                            .where("trackedEntityId", "in", children_3.map(function (child) { return child.trackedEntityId; }))
                                            .orderBy("createdAt", "desc")
                                            .selectAll()
                                            .execute()];
                                case 4:
                                    itemLedgers = _h.sent();
                                    if (trackedEntities.length !== children_3.length) {
                                        throw new Error("Some tracked entities not found");
                                    }
                                    if (trackedEntities.some(function (entity) { return entity.status !== "Available"; })) {
                                        throw new Error("Some tracked entities are not available");
                                    }
                                    return [4 /*yield*/, getExpiredEntityPolicy(trx, companyId_10)];
                                case 5:
                                    expiredPolicy = _h.sent();
                                    expiredCheck = checkExpiredEntities(trackedEntities.map(function (e) { return ({
                                        id: e.id,
                                        expirationDate: e.expirationDate,
                                    }); }), expiredPolicy, { allowed: !!overrideExpired_2, reason: overrideReason_2 !== null && overrideReason_2 !== void 0 ? overrideReason_2 : null });
                                    if (!expiredCheck.ok) {
                                        throw new Error(expiredCheck.reason);
                                    }
                                    if (expiredCheck.warning) {
                                        expiredWarning_2 = expiredCheck.warning;
                                    }
                                    return [4 /*yield*/, trx
                                            .selectFrom("item")
                                            .where("id", "=", itemId_4)
                                            .select(["id", "readableIdWithRevision"])
                                            .executeTakeFirstOrThrow()];
                                case 6:
                                    item = _h.sent();
                                    maintenanceDispatchItemId = dispatchItem.id;
                                    activityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: activityId,
                                            type: "Consume",
                                            sourceDocument: "Maintenance Dispatch Item",
                                            sourceDocumentId: maintenanceDispatchItemId,
                                            sourceDocumentReadableId: (_b = item.readableIdWithRevision) !== null && _b !== void 0 ? _b : "",
                                            attributes: {
                                                "Maintenance Dispatch": dispatch.maintenanceDispatchId,
                                                "Maintenance Dispatch Item": dispatchItem.id,
                                                Employee: userId_10,
                                            },
                                            companyId: companyId_10,
                                            createdBy: userId_10,
                                        })
                                            .execute()];
                                case 7:
                                    _h.sent();
                                    itemLedgerInserts = [];
                                    trackedActivityInputs = [];
                                    junctionInserts = [];
                                    splitEntities = [];
                                    _loop_3 = function (child) {
                                        var trackedEntity, trackedEntityId, quantity, remainingQuantity, newTrackedEntityId, splitActivityId, existingLedger_1, existingLedger;
                                        return __generator(this, function (_j) {
                                            switch (_j.label) {
                                                case 0:
                                                    trackedEntity = trackedEntities.find(function (entity) { return entity.id === child.trackedEntityId; });
                                                    if (!trackedEntity) {
                                                        throw new Error("Tracked entity not found");
                                                    }
                                                    trackedEntityId = child.trackedEntityId, quantity = child.quantity;
                                                    if (!(Number(trackedEntity.quantity) !== quantity)) return [3 /*break*/, 6];
                                                    remainingQuantity = Number(trackedEntity.quantity) - quantity;
                                                    newTrackedEntityId = (0, nanoid_ts_1.nanoid)();
                                                    // Track split entity for return
                                                    splitEntities.push({
                                                        originalId: trackedEntityId,
                                                        newId: newTrackedEntityId,
                                                        readableId: (_c = trackedEntity.sourceDocumentReadableId) !== null && _c !== void 0 ? _c : "",
                                                        quantity: remainingQuantity,
                                                    });
                                                    splitActivityId = (0, nanoid_ts_1.nanoid)();
                                                    return [4 /*yield*/, trx
                                                            .insertInto("trackedActivity")
                                                            .values({
                                                            id: splitActivityId,
                                                            type: "Split",
                                                            sourceDocument: "Maintenance Dispatch Item",
                                                            sourceDocumentId: maintenanceDispatchItemId,
                                                            attributes: {
                                                                "Original Quantity": Number(trackedEntity.quantity),
                                                                "Consumed Quantity": quantity,
                                                                "Remaining Quantity": remainingQuantity,
                                                                "Split Entity ID": newTrackedEntityId,
                                                            },
                                                            companyId: companyId_10,
                                                            createdBy: userId_10,
                                                        })
                                                            .execute()];
                                                case 1:
                                                    _j.sent();
                                                    // Record original entity as input
                                                    return [4 /*yield*/, trx
                                                            .insertInto("trackedActivityInput")
                                                            .values({
                                                            trackedActivityId: splitActivityId,
                                                            trackedEntityId: trackedEntity.id,
                                                            quantity: Number(trackedEntity.quantity),
                                                            companyId: companyId_10,
                                                            createdBy: userId_10,
                                                        })
                                                            .execute()];
                                                case 2:
                                                    // Record original entity as input
                                                    _j.sent();
                                                    // Create new tracked entity for remaining quantity
                                                    return [4 /*yield*/, trx
                                                            .insertInto("trackedEntity")
                                                            .values({
                                                            id: newTrackedEntityId,
                                                            readableId: trackedEntity.readableId,
                                                            sourceDocumentId: trackedEntity.sourceDocumentId,
                                                            sourceDocument: "Item",
                                                            sourceDocumentReadableId: trackedEntity.sourceDocumentReadableId,
                                                            quantity: remainingQuantity,
                                                            status: (_d = trackedEntity.status) !== null && _d !== void 0 ? _d : "Available",
                                                            attributes: trackedEntity.attributes,
                                                            itemId: (_e = trackedEntity.itemId) !== null && _e !== void 0 ? _e : trackedEntity.sourceDocumentId,
                                                            expirationDate: (_f = trackedEntity.expirationDate) !== null && _f !== void 0 ? _f : null,
                                                            companyId: companyId_10,
                                                            createdBy: userId_10,
                                                        })
                                                            .execute()];
                                                case 3:
                                                    // Create new tracked entity for remaining quantity
                                                    _j.sent();
                                                    // Update original entity quantity
                                                    return [4 /*yield*/, trx
                                                            .updateTable("trackedEntity")
                                                            .set({
                                                            quantity: quantity,
                                                            attributes: __assign(__assign({}, ((_g = trackedEntity.attributes) !== null && _g !== void 0 ? _g : {})), { "Split Entity ID": newTrackedEntityId }),
                                                        })
                                                            .where("id", "=", trackedEntityId)
                                                            .execute()];
                                                case 4:
                                                    // Update original entity quantity
                                                    _j.sent();
                                                    // Record outputs from split
                                                    return [4 /*yield*/, trx
                                                            .insertInto("trackedActivityOutput")
                                                            .values([
                                                            {
                                                                trackedActivityId: splitActivityId,
                                                                trackedEntityId: newTrackedEntityId,
                                                                quantity: remainingQuantity,
                                                                companyId: companyId_10,
                                                                createdBy: userId_10,
                                                            },
                                                            {
                                                                trackedActivityId: splitActivityId,
                                                                trackedEntityId: trackedEntity.id,
                                                                quantity: quantity,
                                                                companyId: companyId_10,
                                                                createdBy: userId_10,
                                                            },
                                                        ])
                                                            .execute()];
                                                case 5:
                                                    // Record outputs from split
                                                    _j.sent();
                                                    existingLedger_1 = itemLedgers.find(function (l) { return l.trackedEntityId === trackedEntityId; });
                                                    itemLedgerInserts.push({
                                                        entryType: "Negative Adjmt.",
                                                        documentType: "Batch Split",
                                                        documentId: splitActivityId,
                                                        companyId: companyId_10,
                                                        itemId: trackedEntity.sourceDocumentId,
                                                        quantity: -Number(trackedEntity.quantity),
                                                        locationId: locationId,
                                                        storageUnitId: existingLedger_1 === null || existingLedger_1 === void 0 ? void 0 : existingLedger_1.storageUnitId,
                                                        trackedEntityId: trackedEntity.id,
                                                        createdBy: userId_10,
                                                    }, {
                                                        entryType: "Positive Adjmt.",
                                                        documentType: "Batch Split",
                                                        documentId: splitActivityId,
                                                        companyId: companyId_10,
                                                        itemId: trackedEntity.sourceDocumentId,
                                                        quantity: quantity,
                                                        locationId: locationId,
                                                        storageUnitId: existingLedger_1 === null || existingLedger_1 === void 0 ? void 0 : existingLedger_1.storageUnitId,
                                                        trackedEntityId: trackedEntity.id,
                                                        createdBy: userId_10,
                                                    }, {
                                                        entryType: "Positive Adjmt.",
                                                        documentType: "Batch Split",
                                                        documentId: splitActivityId,
                                                        companyId: companyId_10,
                                                        itemId: trackedEntity.sourceDocumentId,
                                                        quantity: remainingQuantity,
                                                        locationId: locationId,
                                                        storageUnitId: existingLedger_1 === null || existingLedger_1 === void 0 ? void 0 : existingLedger_1.storageUnitId,
                                                        trackedEntityId: newTrackedEntityId,
                                                        createdBy: userId_10,
                                                    });
                                                    _j.label = 6;
                                                case 6: 
                                                // Update tracked entity status to consumed
                                                return [4 /*yield*/, trx
                                                        .updateTable("trackedEntity")
                                                        .set({
                                                        status: "Consumed",
                                                    })
                                                        .where("id", "=", trackedEntityId)
                                                        .execute()];
                                                case 7:
                                                    // Update tracked entity status to consumed
                                                    _j.sent();
                                                    trackedActivityInputs.push({
                                                        trackedActivityId: activityId,
                                                        trackedEntityId: trackedEntityId,
                                                        quantity: quantity,
                                                        companyId: companyId_10,
                                                        createdBy: userId_10,
                                                    });
                                                    // Add junction table entry
                                                    junctionInserts.push({
                                                        maintenanceDispatchItemId: maintenanceDispatchItemId,
                                                        trackedEntityId: trackedEntityId,
                                                        quantity: quantity,
                                                        companyId: companyId_10,
                                                        createdBy: userId_10,
                                                    });
                                                    existingLedger = itemLedgers.find(function (l) { return l.trackedEntityId === trackedEntityId; });
                                                    itemLedgerInserts.push({
                                                        entryType: "Consumption",
                                                        documentType: "Maintenance Consumption",
                                                        documentId: dispatch.id,
                                                        documentLineId: maintenanceDispatchItemId,
                                                        companyId: companyId_10,
                                                        itemId: trackedEntity.sourceDocumentId,
                                                        quantity: -quantity,
                                                        locationId: locationId,
                                                        storageUnitId: existingLedger === null || existingLedger === void 0 ? void 0 : existingLedger.storageUnitId,
                                                        trackedEntityId: trackedEntityId,
                                                        createdBy: userId_10,
                                                    });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, children_7 = children_3;
                                    _h.label = 8;
                                case 8:
                                    if (!(_i < children_7.length)) return [3 /*break*/, 11];
                                    child = children_7[_i];
                                    return [5 /*yield**/, _loop_3(child)];
                                case 9:
                                    _h.sent();
                                    _h.label = 10;
                                case 10:
                                    _i++;
                                    return [3 /*break*/, 8];
                                case 11:
                                    if (!(trackedActivityInputs.length > 0)) return [3 /*break*/, 13];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityInput")
                                            .values(trackedActivityInputs)
                                            .execute()];
                                case 12:
                                    _h.sent();
                                    _h.label = 13;
                                case 13:
                                    if (!(junctionInserts.length > 0)) return [3 /*break*/, 15];
                                    return [4 /*yield*/, trx
                                            .insertInto("maintenanceDispatchItemTrackedEntity")
                                            .values(junctionInserts)
                                            .execute()];
                                case 14:
                                    _h.sent();
                                    _h.label = 15;
                                case 15:
                                    if (!(itemLedgerInserts.length > 0)) return [3 /*break*/, 20];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts)
                                            .execute()];
                                case 16:
                                    _h.sent();
                                    _a = 0, itemLedgerInserts_8 = itemLedgerInserts;
                                    _h.label = 17;
                                case 17:
                                    if (!(_a < itemLedgerInserts_8.length)) return [3 /*break*/, 20];
                                    ledger = itemLedgerInserts_8[_a];
                                    return [4 /*yield*/, (0, storage_units_ts_1.updatePickMethodDefaultStorageUnitIfNeeded)(trx, ledger.itemId, ledger.locationId, ledger.storageUnitId, companyId_10, userId_10)];
                                case 18:
                                    _h.sent();
                                    _h.label = 19;
                                case 19:
                                    _a++;
                                    return [3 /*break*/, 17];
                                case 20: return [2 /*return*/, splitEntities];
                            }
                        });
                    }); })];
            case 82:
                splitEntities = _27.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        success: true,
                        message: "Material issued successfully",
                        splitEntities: splitEntities,
                        warning: expiredWarning_2,
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 200,
                    })];
            case 83:
                maintenanceDispatchItemId_1 = validatedPayload.maintenanceDispatchItemId, children_4 = validatedPayload.children, companyId_11 = validatedPayload.companyId, userId_11 = validatedPayload.userId;
                if (children_4.length === 0) {
                    throw new Error("At least one tracked entity is required");
                }
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var dispatchItem, dispatch, locationId, trackedEntities, itemLedgers, item, activityId, itemLedgerInserts, trackedActivityOutputs, _loop_4, _i, children_8, child, _a, itemLedgerInserts_9, ledger, totalChildQuantity, currentQuantity, newQuantity;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("maintenanceDispatchItem")
                                        .where("id", "=", maintenanceDispatchItemId_1)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    dispatchItem = _c.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("maintenanceDispatch")
                                            .where("id", "=", dispatchItem.maintenanceDispatchId)
                                            .select(["id", "maintenanceDispatchId", "workCenterId", "locationId"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    dispatch = _c.sent();
                                    locationId = dispatch.locationId;
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .where("id", "in", children_4.map(function (child) { return child.trackedEntityId; }))
                                            .selectAll()
                                            .execute()];
                                case 3:
                                    trackedEntities = _c.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("itemLedger")
                                            .where("trackedEntityId", "in", children_4.map(function (child) { return child.trackedEntityId; }))
                                            .orderBy("createdAt", "desc")
                                            .selectAll()
                                            .execute()];
                                case 4:
                                    itemLedgers = _c.sent();
                                    if (trackedEntities.length !== children_4.length) {
                                        throw new Error("Some tracked entities not found");
                                    }
                                    if (trackedEntities.some(function (entity) { return entity.status !== "Consumed"; })) {
                                        throw new Error("Some tracked entities are not in consumed status");
                                    }
                                    return [4 /*yield*/, trx
                                            .selectFrom("item")
                                            .where("id", "=", dispatchItem.itemId)
                                            .select(["id", "readableIdWithRevision"])
                                            .executeTakeFirstOrThrow()];
                                case 5:
                                    item = _c.sent();
                                    activityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: activityId,
                                            type: "Unconsume",
                                            sourceDocument: "Maintenance Dispatch Item",
                                            sourceDocumentId: maintenanceDispatchItemId_1,
                                            sourceDocumentReadableId: (_b = item.readableIdWithRevision) !== null && _b !== void 0 ? _b : "",
                                            attributes: {
                                                "Maintenance Dispatch": dispatch.maintenanceDispatchId,
                                                "Maintenance Dispatch Item": dispatchItem.id,
                                                Employee: userId_11,
                                            },
                                            companyId: companyId_11,
                                            createdBy: userId_11,
                                        })
                                            .execute()];
                                case 6:
                                    _c.sent();
                                    itemLedgerInserts = [];
                                    trackedActivityOutputs = [];
                                    _loop_4 = function (child) {
                                        var trackedEntity, trackedEntityId, quantity, existingLedger;
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    trackedEntity = trackedEntities.find(function (entity) { return entity.id === child.trackedEntityId; });
                                                    if (!trackedEntity) {
                                                        throw new Error("Tracked entity not found");
                                                    }
                                                    trackedEntityId = child.trackedEntityId, quantity = child.quantity;
                                                    // Update tracked entity status back to Available
                                                    return [4 /*yield*/, trx
                                                            .updateTable("trackedEntity")
                                                            .set({
                                                            status: "Available",
                                                        })
                                                            .where("id", "=", trackedEntityId)
                                                            .execute()];
                                                case 1:
                                                    // Update tracked entity status back to Available
                                                    _d.sent();
                                                    trackedActivityOutputs.push({
                                                        trackedActivityId: activityId,
                                                        trackedEntityId: trackedEntityId,
                                                        quantity: quantity,
                                                        companyId: companyId_11,
                                                        createdBy: userId_11,
                                                    });
                                                    // Remove from junction table
                                                    return [4 /*yield*/, trx
                                                            .deleteFrom("maintenanceDispatchItemTrackedEntity")
                                                            .where("maintenanceDispatchItemId", "=", maintenanceDispatchItemId_1)
                                                            .where("trackedEntityId", "=", trackedEntityId)
                                                            .execute()];
                                                case 2:
                                                    // Remove from junction table
                                                    _d.sent();
                                                    existingLedger = itemLedgers.find(function (l) { return l.trackedEntityId === trackedEntityId; });
                                                    itemLedgerInserts.push({
                                                        entryType: "Consumption",
                                                        documentType: "Maintenance Consumption",
                                                        documentId: dispatch.id,
                                                        documentLineId: maintenanceDispatchItemId_1,
                                                        companyId: companyId_11,
                                                        itemId: trackedEntity.sourceDocumentId,
                                                        quantity: quantity, // Positive to return to inventory
                                                        locationId: locationId,
                                                        storageUnitId: existingLedger === null || existingLedger === void 0 ? void 0 : existingLedger.storageUnitId,
                                                        trackedEntityId: trackedEntityId,
                                                        createdBy: userId_11,
                                                    });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, children_8 = children_4;
                                    _c.label = 7;
                                case 7:
                                    if (!(_i < children_8.length)) return [3 /*break*/, 10];
                                    child = children_8[_i];
                                    return [5 /*yield**/, _loop_4(child)];
                                case 8:
                                    _c.sent();
                                    _c.label = 9;
                                case 9:
                                    _i++;
                                    return [3 /*break*/, 7];
                                case 10:
                                    if (!(trackedActivityOutputs.length > 0)) return [3 /*break*/, 12];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityOutput")
                                            .values(trackedActivityOutputs)
                                            .execute()];
                                case 11:
                                    _c.sent();
                                    _c.label = 12;
                                case 12:
                                    if (!(itemLedgerInserts.length > 0)) return [3 /*break*/, 17];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts)
                                            .execute()];
                                case 13:
                                    _c.sent();
                                    _a = 0, itemLedgerInserts_9 = itemLedgerInserts;
                                    _c.label = 14;
                                case 14:
                                    if (!(_a < itemLedgerInserts_9.length)) return [3 /*break*/, 17];
                                    ledger = itemLedgerInserts_9[_a];
                                    return [4 /*yield*/, (0, storage_units_ts_1.updatePickMethodDefaultStorageUnitIfNeeded)(trx, ledger.itemId, ledger.locationId, ledger.storageUnitId, companyId_11, userId_11)];
                                case 15:
                                    _c.sent();
                                    _c.label = 16;
                                case 16:
                                    _a++;
                                    return [3 /*break*/, 14];
                                case 17:
                                    totalChildQuantity = children_4.reduce(function (sum, child) {
                                        return sum + Number(child.quantity);
                                    }, 0);
                                    currentQuantity = Number(dispatchItem.quantity) || 0;
                                    newQuantity = Math.max(0, currentQuantity - totalChildQuantity);
                                    return [4 /*yield*/, trx
                                            .updateTable("maintenanceDispatchItem")
                                            .set({
                                            quantity: newQuantity,
                                            updatedBy: userId_11,
                                            updatedAt: new Date().toISOString(),
                                        })
                                            .where("id", "=", maintenanceDispatchItemId_1)
                                            .execute()];
                                case 18:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 84:
                _27.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        success: true,
                        message: "Material unconsumed successfully",
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 200,
                    })];
            case 85:
                maintenanceDispatchItemId_2 = validatedPayload.maintenanceDispatchItemId, companyId_12 = validatedPayload.companyId, userId_12 = validatedPayload.userId;
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var dispatchItem, dispatch, locationId, item, trackedEntityJunctions, trackedEntityIds, trackedEntities, itemLedgers, activityId, itemLedgerInserts_10, trackedActivityOutputs, _loop_5, _i, trackedEntityJunctions_1, junction, quantity, originalLedger;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, trx
                                        .selectFrom("maintenanceDispatchItem")
                                        .where("id", "=", maintenanceDispatchItemId_2)
                                        .selectAll()
                                        .executeTakeFirstOrThrow()];
                                case 1:
                                    dispatchItem = _b.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("maintenanceDispatch")
                                            .where("id", "=", dispatchItem.maintenanceDispatchId)
                                            .select(["id", "maintenanceDispatchId", "workCenterId", "locationId"])
                                            .executeTakeFirstOrThrow()];
                                case 2:
                                    dispatch = _b.sent();
                                    locationId = dispatch.locationId;
                                    return [4 /*yield*/, trx
                                            .selectFrom("item")
                                            .where("id", "=", dispatchItem.itemId)
                                            .select(["id", "itemTrackingType", "readableIdWithRevision"])
                                            .executeTakeFirstOrThrow()];
                                case 3:
                                    item = _b.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("maintenanceDispatchItemTrackedEntity")
                                            .where("maintenanceDispatchItemId", "=", maintenanceDispatchItemId_2)
                                            .selectAll()
                                            .execute()];
                                case 4:
                                    trackedEntityJunctions = _b.sent();
                                    if (!(trackedEntityJunctions.length > 0)) return [3 /*break*/, 17];
                                    trackedEntityIds = trackedEntityJunctions.map(function (j) { return j.trackedEntityId; });
                                    return [4 /*yield*/, trx
                                            .selectFrom("trackedEntity")
                                            .where("id", "in", trackedEntityIds)
                                            .selectAll()
                                            .execute()];
                                case 5:
                                    trackedEntities = _b.sent();
                                    return [4 /*yield*/, trx
                                            .selectFrom("itemLedger")
                                            .where("trackedEntityId", "in", trackedEntityIds)
                                            .orderBy("createdAt", "desc")
                                            .selectAll()
                                            .execute()];
                                case 6:
                                    itemLedgers = _b.sent();
                                    activityId = (0, nanoid_ts_1.nanoid)();
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivity")
                                            .values({
                                            id: activityId,
                                            type: "Unconsume",
                                            sourceDocument: "Maintenance Dispatch Item",
                                            sourceDocumentId: maintenanceDispatchItemId_2,
                                            sourceDocumentReadableId: (_a = item.readableIdWithRevision) !== null && _a !== void 0 ? _a : "",
                                            attributes: {
                                                "Maintenance Dispatch": dispatch.maintenanceDispatchId,
                                                "Maintenance Dispatch Item": dispatchItem.id,
                                                Employee: userId_12,
                                            },
                                            companyId: companyId_12,
                                            createdBy: userId_12,
                                        })
                                            .execute()];
                                case 7:
                                    _b.sent();
                                    itemLedgerInserts_10 = [];
                                    trackedActivityOutputs = [];
                                    _loop_5 = function (junction) {
                                        var trackedEntity, quantity, existingLedger;
                                        return __generator(this, function (_c) {
                                            switch (_c.label) {
                                                case 0:
                                                    trackedEntity = trackedEntities.find(function (e) { return e.id === junction.trackedEntityId; });
                                                    if (!trackedEntity)
                                                        return [2 /*return*/, "continue"];
                                                    quantity = Number(junction.quantity);
                                                    // Update tracked entity status back to Available
                                                    return [4 /*yield*/, trx
                                                            .updateTable("trackedEntity")
                                                            .set({ status: "Available" })
                                                            .where("id", "=", junction.trackedEntityId)
                                                            .execute()];
                                                case 1:
                                                    // Update tracked entity status back to Available
                                                    _c.sent();
                                                    trackedActivityOutputs.push({
                                                        trackedActivityId: activityId,
                                                        trackedEntityId: junction.trackedEntityId,
                                                        quantity: quantity,
                                                        companyId: companyId_12,
                                                        createdBy: userId_12,
                                                    });
                                                    existingLedger = itemLedgers.find(function (l) { return l.trackedEntityId === junction.trackedEntityId; });
                                                    itemLedgerInserts_10.push({
                                                        entryType: "Consumption",
                                                        documentType: "Maintenance Consumption",
                                                        documentId: dispatch.id,
                                                        documentLineId: maintenanceDispatchItemId_2,
                                                        companyId: companyId_12,
                                                        itemId: trackedEntity.sourceDocumentId,
                                                        quantity: quantity, // Positive to return to inventory
                                                        locationId: locationId,
                                                        storageUnitId: existingLedger === null || existingLedger === void 0 ? void 0 : existingLedger.storageUnitId,
                                                        trackedEntityId: junction.trackedEntityId,
                                                        createdBy: userId_12,
                                                    });
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _i = 0, trackedEntityJunctions_1 = trackedEntityJunctions;
                                    _b.label = 8;
                                case 8:
                                    if (!(_i < trackedEntityJunctions_1.length)) return [3 /*break*/, 11];
                                    junction = trackedEntityJunctions_1[_i];
                                    return [5 /*yield**/, _loop_5(junction)];
                                case 9:
                                    _b.sent();
                                    _b.label = 10;
                                case 10:
                                    _i++;
                                    return [3 /*break*/, 8];
                                case 11: 
                                // Delete junction entries
                                return [4 /*yield*/, trx
                                        .deleteFrom("maintenanceDispatchItemTrackedEntity")
                                        .where("maintenanceDispatchItemId", "=", maintenanceDispatchItemId_2)
                                        .execute()];
                                case 12:
                                    // Delete junction entries
                                    _b.sent();
                                    if (!(trackedActivityOutputs.length > 0)) return [3 /*break*/, 14];
                                    return [4 /*yield*/, trx
                                            .insertInto("trackedActivityOutput")
                                            .values(trackedActivityOutputs)
                                            .execute()];
                                case 13:
                                    _b.sent();
                                    _b.label = 14;
                                case 14:
                                    if (!(itemLedgerInserts_10.length > 0)) return [3 /*break*/, 16];
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values(itemLedgerInserts_10)
                                            .execute()];
                                case 15:
                                    _b.sent();
                                    _b.label = 16;
                                case 16: return [3 /*break*/, 20];
                                case 17:
                                    if (!(item.itemTrackingType !== "Serial" &&
                                        item.itemTrackingType !== "Batch")) return [3 /*break*/, 20];
                                    quantity = Number(dispatchItem.quantity);
                                    if (!(quantity > 0)) return [3 /*break*/, 20];
                                    return [4 /*yield*/, trx
                                            .selectFrom("itemLedger")
                                            .where("documentLineId", "=", maintenanceDispatchItemId_2)
                                            .where("documentType", "=", "Maintenance Consumption")
                                            .orderBy("createdAt", "desc")
                                            .selectAll()
                                            .executeTakeFirst()];
                                case 18:
                                    originalLedger = _b.sent();
                                    return [4 /*yield*/, trx
                                            .insertInto("itemLedger")
                                            .values({
                                            entryType: "Consumption",
                                            documentType: "Maintenance Consumption",
                                            documentId: dispatch.id,
                                            documentLineId: maintenanceDispatchItemId_2,
                                            companyId: companyId_12,
                                            itemId: dispatchItem.itemId,
                                            quantity: quantity, // Positive to return to inventory
                                            locationId: locationId,
                                            storageUnitId: originalLedger === null || originalLedger === void 0 ? void 0 : originalLedger.storageUnitId,
                                            createdBy: userId_12,
                                        })
                                            .execute()];
                                case 19:
                                    _b.sent();
                                    _b.label = 20;
                                case 20: 
                                // Delete the dispatch item
                                return [4 /*yield*/, trx
                                        .deleteFrom("maintenanceDispatchItem")
                                        .where("id", "=", maintenanceDispatchItemId_2)
                                        .execute()];
                                case 21:
                                    // Delete the dispatch item
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 86:
                _27.sent();
                return [2 /*return*/, new Response(JSON.stringify({
                        success: true,
                        message: "Item unissued and removed successfully",
                    }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 200,
                    })];
            case 87: return [2 /*return*/, new Response(JSON.stringify({
                    success: true,
                    message: "x",
                }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 200,
                })];
            case 88:
                err_1 = _27.sent();
                console.error(err_1);
                message = err_1 instanceof Error
                    ? err_1.message
                    : typeof err_1 === "string"
                        ? err_1
                        : "Unexpected error";
                return [2 /*return*/, new Response(JSON.stringify({ success: false, message: message }), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 400,
                    })];
            case 89: return [2 /*return*/];
        }
    });
}); });
