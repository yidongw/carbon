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
exports.postDisposal = postDisposal;
exports.postDepreciationRun = postDepreciationRun;
var utils_1 = require("@carbon/utils");
var string_1 = require("~/utils/string");
function getNextSequence(trx, tableName, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var sequence, prefix, suffix, next, size, step, nextValue, nextSequence, derivedPrefix, derivedSuffix;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, trx
                        .selectFrom("sequence")
                        .selectAll()
                        .where("table", "=", tableName)
                        .where("companyId", "=", companyId)
                        .executeTakeFirstOrThrow()];
                case 1:
                    sequence = _a.sent();
                    prefix = sequence.prefix, suffix = sequence.suffix, next = sequence.next, size = sequence.size, step = sequence.step;
                    if (!Number.isInteger(next))
                        throw new Error("Next is not an integer");
                    if (!Number.isInteger(step))
                        throw new Error("Step is not an integer");
                    if (!Number.isInteger(size))
                        throw new Error("Size is not an integer");
                    nextValue = next + step;
                    nextSequence = nextValue.toString().padStart(size, "0");
                    derivedPrefix = (0, string_1.interpolateSequenceDate)(prefix);
                    derivedSuffix = (0, string_1.interpolateSequenceDate)(suffix);
                    return [4 /*yield*/, trx
                            .updateTable("sequence")
                            .set({ next: nextValue, updatedBy: "system" })
                            .where("table", "=", tableName)
                            .where("companyId", "=", companyId)
                            .execute()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, "".concat(derivedPrefix).concat(nextSequence).concat(derivedSuffix)];
            }
        });
    });
}
function postDisposal(db, args) {
    return __awaiter(this, void 0, void 0, function () {
        var fixedAssetId, fixedAssetReadableId, disposalDate, disposalMethod, acquisitionCost, accumulatedDepreciation, locationId, fixedAssetClassId, assetAccountId, accumulatedDepreciationAccountId, writeOffAccountId, accountingPeriodId, locationDimensionId, assetClassDimensionId, companyId, userId, nbv, now;
        var _this = this;
        return __generator(this, function (_a) {
            fixedAssetId = args.fixedAssetId, fixedAssetReadableId = args.fixedAssetReadableId, disposalDate = args.disposalDate, disposalMethod = args.disposalMethod, acquisitionCost = args.acquisitionCost, accumulatedDepreciation = args.accumulatedDepreciation, locationId = args.locationId, fixedAssetClassId = args.fixedAssetClassId, assetAccountId = args.assetAccountId, accumulatedDepreciationAccountId = args.accumulatedDepreciationAccountId, writeOffAccountId = args.writeOffAccountId, accountingPeriodId = args.accountingPeriodId, locationDimensionId = args.locationDimensionId, assetClassDimensionId = args.assetClassDimensionId, companyId = args.companyId, userId = args.userId;
            nbv = acquisitionCost - accumulatedDepreciation;
            now = new Date().toISOString();
            return [2 /*return*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                    var journalEntryId, journal, journalLines, journalLineResults;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getNextSequence(trx, "journalEntry", companyId)];
                            case 1:
                                journalEntryId = _a.sent();
                                return [4 /*yield*/, trx
                                        .insertInto("journal")
                                        .values({
                                        journalEntryId: journalEntryId,
                                        accountingPeriodId: accountingPeriodId,
                                        companyId: companyId,
                                        description: "Asset Disposal: ".concat(fixedAssetReadableId, " (").concat(disposalMethod, ")"),
                                        postingDate: disposalDate,
                                        sourceType: "Asset Disposal",
                                        status: "Posted",
                                        postedAt: now,
                                        postedBy: userId,
                                        createdBy: userId
                                    })
                                        .returning(["id"])
                                        .executeTakeFirstOrThrow()];
                            case 2:
                                journal = _a.sent();
                                journalLines = [];
                                if (accumulatedDepreciation > 0) {
                                    journalLines.push({
                                        journalId: journal.id,
                                        accountId: accumulatedDepreciationAccountId,
                                        description: "Clear accumulated depreciation",
                                        amount: (0, utils_1.toStoredAmount)(accumulatedDepreciation, 0, "Asset"),
                                        journalLineReference: crypto.randomUUID(),
                                        companyId: companyId
                                    });
                                }
                                if (nbv > 0) {
                                    journalLines.push({
                                        journalId: journal.id,
                                        accountId: writeOffAccountId,
                                        description: "Write-off remaining book value",
                                        amount: (0, utils_1.toStoredAmount)(nbv, 0, "Expense"),
                                        journalLineReference: crypto.randomUUID(),
                                        companyId: companyId
                                    });
                                }
                                journalLines.push({
                                    journalId: journal.id,
                                    accountId: assetAccountId,
                                    description: "Remove asset at cost",
                                    amount: (0, utils_1.toStoredAmount)(0, acquisitionCost, "Asset"),
                                    journalLineReference: crypto.randomUUID(),
                                    companyId: companyId
                                });
                                return [4 /*yield*/, trx
                                        .insertInto("journalLine")
                                        .values(journalLines)
                                        .returning(["id"])
                                        .execute()];
                            case 3:
                                journalLineResults = _a.sent();
                                if (!(locationDimensionId && locationId)) return [3 /*break*/, 5];
                                return [4 /*yield*/, trx
                                        .insertInto("journalLineDimension")
                                        .values(journalLineResults.map(function (jl) { return ({
                                        journalLineId: jl.id,
                                        dimensionId: locationDimensionId,
                                        valueId: locationId,
                                        companyId: companyId
                                    }); }))
                                        .execute()];
                            case 4:
                                _a.sent();
                                _a.label = 5;
                            case 5:
                                if (!(assetClassDimensionId && fixedAssetClassId)) return [3 /*break*/, 7];
                                return [4 /*yield*/, trx
                                        .insertInto("journalLineDimension")
                                        .values(journalLineResults.map(function (jl) { return ({
                                        journalLineId: jl.id,
                                        dimensionId: assetClassDimensionId,
                                        valueId: fixedAssetClassId,
                                        companyId: companyId
                                    }); }))
                                        .execute()];
                            case 6:
                                _a.sent();
                                _a.label = 7;
                            case 7: return [4 /*yield*/, trx
                                    .insertInto("fixedAssetDisposal")
                                    .values({
                                    fixedAssetId: fixedAssetId,
                                    disposalMethod: disposalMethod,
                                    disposalDate: disposalDate,
                                    saleProceeds: 0,
                                    netBookValueAtDisposal: nbv,
                                    gainLoss: -nbv,
                                    journalId: journal.id,
                                    companyId: companyId,
                                    createdBy: userId
                                })
                                    .execute()];
                            case 8:
                                _a.sent();
                                return [4 /*yield*/, trx
                                        .updateTable("fixedAsset")
                                        .set({
                                        status: "Disposed",
                                        disposalDate: disposalDate,
                                        disposalMethod: disposalMethod,
                                        saleProceeds: 0,
                                        updatedBy: userId
                                    })
                                        .where("id", "=", fixedAssetId)
                                        .execute()];
                            case 9:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
function postDepreciationRun(db, args) {
    return __awaiter(this, void 0, void 0, function () {
        var depreciationRunId, depreciationRunReadableId, postingDate, accountingPeriodId, lines, locationDimensionId, assetClassDimensionId, taxEnabled, taxRate, dtlAccountId, dtExpenseAccountId, companyId, userId, now;
        var _this = this;
        return __generator(this, function (_a) {
            depreciationRunId = args.depreciationRunId, depreciationRunReadableId = args.depreciationRunReadableId, postingDate = args.postingDate, accountingPeriodId = args.accountingPeriodId, lines = args.lines, locationDimensionId = args.locationDimensionId, assetClassDimensionId = args.assetClassDimensionId, taxEnabled = args.taxEnabled, taxRate = args.taxRate, dtlAccountId = args.dtlAccountId, dtExpenseAccountId = args.dtExpenseAccountId, companyId = args.companyId, userId = args.userId;
            now = new Date().toISOString();
            return [2 /*return*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                    var _loop_1, _i, lines_1, line, diffByGroup, _a, lines_2, line, bookAmount, taxAmt, diff, locId, classId, key, existing, totalTemporaryDifference, dtlAmount, dtlEntryId, dtlJournal_1, isLiability_1, significantEntries, dtlLineValues, dtlLineResults, dimensionValues, i, g, debitLineId, creditLineId;
                    var _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                _loop_1 = function (line) {
                                    var asset, amount, journalEntryId, journal, journalLineResults, newAccumulated, cost, residualValue, nbv, assetUpdate, taxAmount, currentTax;
                                    return __generator(this, function (_g) {
                                        switch (_g.label) {
                                            case 0:
                                                asset = line.asset;
                                                amount = Number(line.amount);
                                                return [4 /*yield*/, getNextSequence(trx, "journalEntry", companyId)];
                                            case 1:
                                                journalEntryId = _g.sent();
                                                return [4 /*yield*/, trx
                                                        .insertInto("journal")
                                                        .values({
                                                        journalEntryId: journalEntryId,
                                                        accountingPeriodId: accountingPeriodId,
                                                        companyId: companyId,
                                                        description: "Depreciation: ".concat(asset.fixedAssetId),
                                                        postingDate: postingDate,
                                                        sourceType: "Asset Depreciation",
                                                        status: "Posted",
                                                        postedAt: now,
                                                        postedBy: userId,
                                                        createdBy: userId
                                                    })
                                                        .returning(["id"])
                                                        .executeTakeFirstOrThrow()];
                                            case 2:
                                                journal = _g.sent();
                                                return [4 /*yield*/, trx
                                                        .insertInto("journalLine")
                                                        .values([
                                                        {
                                                            journalId: journal.id,
                                                            accountId: asset.depreciationExpenseAccountId,
                                                            description: "Depreciation Expense",
                                                            amount: (0, utils_1.toStoredAmount)(amount, 0, "Expense"),
                                                            journalLineReference: crypto.randomUUID(),
                                                            companyId: companyId
                                                        },
                                                        {
                                                            journalId: journal.id,
                                                            accountId: asset.accumulatedDepreciationAccountId,
                                                            description: "Accumulated Depreciation",
                                                            amount: (0, utils_1.toStoredAmount)(0, amount, "Asset"),
                                                            journalLineReference: crypto.randomUUID(),
                                                            companyId: companyId
                                                        }
                                                    ])
                                                        .returning(["id"])
                                                        .execute()];
                                            case 3:
                                                journalLineResults = _g.sent();
                                                if (!(locationDimensionId && asset.locationId)) return [3 /*break*/, 5];
                                                return [4 /*yield*/, trx
                                                        .insertInto("journalLineDimension")
                                                        .values(journalLineResults.map(function (jl) { return ({
                                                        journalLineId: jl.id,
                                                        dimensionId: locationDimensionId,
                                                        valueId: asset.locationId,
                                                        companyId: companyId
                                                    }); }))
                                                        .execute()];
                                            case 4:
                                                _g.sent();
                                                _g.label = 5;
                                            case 5:
                                                if (!(assetClassDimensionId && asset.fixedAssetClassId)) return [3 /*break*/, 7];
                                                return [4 /*yield*/, trx
                                                        .insertInto("journalLineDimension")
                                                        .values(journalLineResults.map(function (jl) { return ({
                                                        journalLineId: jl.id,
                                                        dimensionId: assetClassDimensionId,
                                                        valueId: asset.fixedAssetClassId,
                                                        companyId: companyId
                                                    }); }))
                                                        .execute()];
                                            case 6:
                                                _g.sent();
                                                _g.label = 7;
                                            case 7: return [4 /*yield*/, trx
                                                    .updateTable("depreciationRunLine")
                                                    .set({ journalId: journal.id })
                                                    .where("id", "=", line.id)
                                                    .execute()];
                                            case 8:
                                                _g.sent();
                                                newAccumulated = Number(asset.accumulatedDepreciation) + amount;
                                                cost = Number(asset.acquisitionCost);
                                                residualValue = cost * (Number(asset.residualValuePercent) / 100);
                                                nbv = cost - newAccumulated;
                                                assetUpdate = {
                                                    accumulatedDepreciation: newAccumulated,
                                                    updatedBy: userId
                                                };
                                                if (nbv <= residualValue + 0.01) {
                                                    assetUpdate.status = "Fully Depreciated";
                                                }
                                                if (taxEnabled) {
                                                    taxAmount = Number((_b = line.taxAmount) !== null && _b !== void 0 ? _b : 0);
                                                    if (taxAmount > 0) {
                                                        currentTax = Number((_c = asset.accumulatedTaxDepreciation) !== null && _c !== void 0 ? _c : 0);
                                                        assetUpdate.accumulatedTaxDepreciation = currentTax + taxAmount;
                                                    }
                                                }
                                                return [4 /*yield*/, trx
                                                        .updateTable("fixedAsset")
                                                        .set(assetUpdate)
                                                        .where("id", "=", line.fixedAssetId)
                                                        .execute()];
                                            case 9:
                                                _g.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                };
                                _i = 0, lines_1 = lines;
                                _f.label = 1;
                            case 1:
                                if (!(_i < lines_1.length)) return [3 /*break*/, 4];
                                line = lines_1[_i];
                                return [5 /*yield**/, _loop_1(line)];
                            case 2:
                                _f.sent();
                                _f.label = 3;
                            case 3:
                                _i++;
                                return [3 /*break*/, 1];
                            case 4:
                                if (!(taxEnabled && taxRate && dtlAccountId && dtExpenseAccountId)) return [3 /*break*/, 9];
                                diffByGroup = new Map();
                                for (_a = 0, lines_2 = lines; _a < lines_2.length; _a++) {
                                    line = lines_2[_a];
                                    bookAmount = Number(line.amount);
                                    taxAmt = Number((_d = line.taxAmount) !== null && _d !== void 0 ? _d : bookAmount);
                                    diff = taxAmt - bookAmount;
                                    locId = (_e = line.asset.locationId) !== null && _e !== void 0 ? _e : null;
                                    classId = line.asset.fixedAssetClassId;
                                    key = "".concat(locId !== null && locId !== void 0 ? locId : "", "|").concat(classId);
                                    existing = diffByGroup.get(key);
                                    if (existing) {
                                        existing.diff += diff;
                                    }
                                    else {
                                        diffByGroup.set(key, {
                                            locationId: locId,
                                            fixedAssetClassId: classId,
                                            diff: diff
                                        });
                                    }
                                }
                                totalTemporaryDifference = __spreadArray([], diffByGroup.values(), true).reduce(function (sum, g) { return sum + g.diff; }, 0);
                                dtlAmount = Math.abs(totalTemporaryDifference * (taxRate / 100));
                                if (!(dtlAmount > 0.01)) return [3 /*break*/, 9];
                                return [4 /*yield*/, getNextSequence(trx, "journalEntry", companyId)];
                            case 5:
                                dtlEntryId = _f.sent();
                                return [4 /*yield*/, trx
                                        .insertInto("journal")
                                        .values({
                                        journalEntryId: dtlEntryId,
                                        accountingPeriodId: accountingPeriodId,
                                        companyId: companyId,
                                        description: "Deferred Tax: Depreciation ".concat(depreciationRunReadableId),
                                        postingDate: postingDate,
                                        sourceType: "Asset Depreciation",
                                        status: "Posted",
                                        postedAt: now,
                                        postedBy: userId,
                                        createdBy: userId
                                    })
                                        .returning(["id"])
                                        .executeTakeFirstOrThrow()];
                            case 6:
                                dtlJournal_1 = _f.sent();
                                isLiability_1 = totalTemporaryDifference > 0;
                                significantEntries = __spreadArray([], diffByGroup.values(), true).filter(function (g) { return Math.abs(g.diff * (taxRate / 100)) > 0.01; });
                                dtlLineValues = significantEntries.flatMap(function (g) {
                                    var locAmount = Math.abs(g.diff * (taxRate / 100));
                                    return [
                                        {
                                            journalId: dtlJournal_1.id,
                                            accountId: isLiability_1 ? dtExpenseAccountId : dtlAccountId,
                                            description: isLiability_1
                                                ? "Deferred Tax Expense"
                                                : "Deferred Tax Liability",
                                            amount: (0, utils_1.toStoredAmount)(locAmount, 0, isLiability_1 ? "Expense" : "Liability"),
                                            journalLineReference: crypto.randomUUID(),
                                            companyId: companyId
                                        },
                                        {
                                            journalId: dtlJournal_1.id,
                                            accountId: isLiability_1 ? dtlAccountId : dtExpenseAccountId,
                                            description: isLiability_1
                                                ? "Deferred Tax Liability"
                                                : "Deferred Tax Benefit",
                                            amount: (0, utils_1.toStoredAmount)(0, locAmount, isLiability_1 ? "Liability" : "Expense"),
                                            journalLineReference: crypto.randomUUID(),
                                            companyId: companyId
                                        }
                                    ];
                                });
                                if (!(dtlLineValues.length > 0)) return [3 /*break*/, 9];
                                return [4 /*yield*/, trx
                                        .insertInto("journalLine")
                                        .values(dtlLineValues)
                                        .returning(["id"])
                                        .execute()];
                            case 7:
                                dtlLineResults = _f.sent();
                                dimensionValues = [];
                                for (i = 0; i < significantEntries.length; i++) {
                                    g = significantEntries[i];
                                    debitLineId = dtlLineResults[i * 2].id;
                                    creditLineId = dtlLineResults[i * 2 + 1].id;
                                    if (locationDimensionId && g.locationId) {
                                        dimensionValues.push({
                                            journalLineId: debitLineId,
                                            dimensionId: locationDimensionId,
                                            valueId: g.locationId,
                                            companyId: companyId
                                        }, {
                                            journalLineId: creditLineId,
                                            dimensionId: locationDimensionId,
                                            valueId: g.locationId,
                                            companyId: companyId
                                        });
                                    }
                                    if (assetClassDimensionId && g.fixedAssetClassId) {
                                        dimensionValues.push({
                                            journalLineId: debitLineId,
                                            dimensionId: assetClassDimensionId,
                                            valueId: g.fixedAssetClassId,
                                            companyId: companyId
                                        }, {
                                            journalLineId: creditLineId,
                                            dimensionId: assetClassDimensionId,
                                            valueId: g.fixedAssetClassId,
                                            companyId: companyId
                                        });
                                    }
                                }
                                if (!(dimensionValues.length > 0)) return [3 /*break*/, 9];
                                return [4 /*yield*/, trx
                                        .insertInto("journalLineDimension")
                                        .values(dimensionValues)
                                        .execute()];
                            case 8:
                                _f.sent();
                                _f.label = 9;
                            case 9: return [4 /*yield*/, trx
                                    .updateTable("depreciationRun")
                                    .set({
                                    status: "Posted",
                                    postedAt: now,
                                    postedBy: userId
                                })
                                    .where("id", "=", depreciationRunId)
                                    .execute()];
                            case 10:
                                _f.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
