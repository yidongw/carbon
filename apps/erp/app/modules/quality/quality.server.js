"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.upsertInboundInspectionSample = upsertInboundInspectionSample;
exports.dispositionInboundInspection = dispositionInboundInspection;
exports.assignEntitiesToIssueItem = assignEntitiesToIssueItem;
exports.closeIssue = closeIssue;
var kysely_1 = require("kysely");
var database_server_1 = require("~/services/database.server");
function errResult(message, blockers) {
    return { data: null, error: __assign({ message: message }, (blockers ? { blockers: blockers } : {})) };
}
// Mirrors the old in-service helper. Terminal states (Passed/Failed/Partial)
// are owned by the disposition path, so the per-sample recompute only flips
// between Pending and In Progress.
function computeLotStatus(samples) {
    var inspected = samples.filter(function (s) { return s.status !== "Pending"; }).length;
    return inspected > 0 ? "In Progress" : "Pending";
}
// -------------------------------------------------------------
// 1. upsertInboundInspectionSample
// -------------------------------------------------------------
// Writes that must stay consistent:
//   - inboundInspectionSample (insert or update)
//   - trackedEntity.status (flip to Available or Rejected)
//   - trackedActivity + trackedActivityInput + trackedActivityOutput
//   - inboundInspection.status (recompute if non-terminal)
function upsertInboundInspectionSample(sample) {
    return __awaiter(this, void 0, void 0, function () {
        var db, nowIso, result, err_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = (0, database_server_1.getDatabaseClient)();
                    nowIso = new Date().toISOString();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var inspection, trackedEntityId, existing, _a, samplePayload, sampleId, updated, inserted, trackedEntityStatus, activity, isTerminal, samples, nextStatus;
                            var _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, trx
                                            .selectFrom("inboundInspection")
                                            .select(["id", "status", "receiptId"])
                                            .where("id", "=", sample.inspectionId)
                                            .where("companyId", "=", sample.companyId)
                                            .executeTakeFirst()];
                                    case 1:
                                        inspection = _c.sent();
                                        if (!inspection)
                                            throw new Error("Inspection not found");
                                        trackedEntityId = sample.trackedEntityId || null;
                                        if (!trackedEntityId) return [3 /*break*/, 3];
                                        return [4 /*yield*/, trx
                                                .selectFrom("inboundInspectionSample")
                                                .select(["id"])
                                                .where("trackedEntityId", "=", trackedEntityId)
                                                .executeTakeFirst()];
                                    case 2:
                                        _a = _c.sent();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        _a = undefined;
                                        _c.label = 4;
                                    case 4:
                                        existing = _a;
                                        samplePayload = {
                                            inboundInspectionId: sample.inspectionId,
                                            trackedEntityId: trackedEntityId,
                                            status: sample.status,
                                            notes: (_b = sample.notes) !== null && _b !== void 0 ? _b : null,
                                            inspectedBy: sample.inspectedBy,
                                            inspectedAt: nowIso,
                                            companyId: sample.companyId
                                        };
                                        if (!existing) return [3 /*break*/, 6];
                                        return [4 /*yield*/, trx
                                                .updateTable("inboundInspectionSample")
                                                .set(__assign(__assign({}, samplePayload), { updatedBy: sample.inspectedBy, updatedAt: nowIso }))
                                                .where("id", "=", existing.id)
                                                .returning(["id"])
                                                .executeTakeFirstOrThrow()];
                                    case 5:
                                        updated = _c.sent();
                                        sampleId = updated.id;
                                        return [3 /*break*/, 8];
                                    case 6: return [4 /*yield*/, trx
                                            .insertInto("inboundInspectionSample")
                                            .values(__assign(__assign({}, samplePayload), { createdBy: sample.inspectedBy }))
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                    case 7:
                                        inserted = _c.sent();
                                        sampleId = inserted.id;
                                        _c.label = 8;
                                    case 8:
                                        if (!trackedEntityId) return [3 /*break*/, 13];
                                        trackedEntityStatus = sample.status === "Passed" ? "Available" : "Rejected";
                                        return [4 /*yield*/, trx
                                                .updateTable("trackedEntity")
                                                .set({ status: trackedEntityStatus })
                                                .where("id", "=", trackedEntityId)
                                                .where("companyId", "=", sample.companyId)
                                                .execute()];
                                    case 9:
                                        _c.sent();
                                        return [4 /*yield*/, trx
                                                .insertInto("trackedActivity")
                                                .values({
                                                type: "Inspect",
                                                sourceDocument: "Inbound Inspection",
                                                sourceDocumentId: sample.inspectionId,
                                                attributes: __assign({ Result: sample.status, Receipt: inspection.receiptId, Inspector: sample.inspectedBy }, (sample.notes ? { Notes: sample.notes } : {})),
                                                companyId: sample.companyId,
                                                createdBy: sample.inspectedBy
                                            })
                                                .returning(["id"])
                                                .executeTakeFirstOrThrow()];
                                    case 10:
                                        activity = _c.sent();
                                        return [4 /*yield*/, trx
                                                .insertInto("trackedActivityInput")
                                                .values({
                                                trackedActivityId: activity.id,
                                                trackedEntityId: trackedEntityId,
                                                quantity: 0,
                                                companyId: sample.companyId,
                                                createdBy: sample.inspectedBy
                                            })
                                                .execute()];
                                    case 11:
                                        _c.sent();
                                        return [4 /*yield*/, trx
                                                .insertInto("trackedActivityOutput")
                                                .values({
                                                trackedActivityId: activity.id,
                                                trackedEntityId: trackedEntityId,
                                                quantity: 0,
                                                companyId: sample.companyId,
                                                createdBy: sample.inspectedBy
                                            })
                                                .execute()];
                                    case 12:
                                        _c.sent();
                                        _c.label = 13;
                                    case 13:
                                        isTerminal = inspection.status === "Passed" ||
                                            inspection.status === "Failed" ||
                                            inspection.status === "Partial";
                                        if (!!isTerminal) return [3 /*break*/, 16];
                                        return [4 /*yield*/, trx
                                                .selectFrom("inboundInspectionSample")
                                                .select(["status"])
                                                .where("inboundInspectionId", "=", sample.inspectionId)
                                                .execute()];
                                    case 14:
                                        samples = _c.sent();
                                        nextStatus = computeLotStatus(samples);
                                        if (!(nextStatus !== inspection.status)) return [3 /*break*/, 16];
                                        return [4 /*yield*/, trx
                                                .updateTable("inboundInspection")
                                                .set({
                                                status: nextStatus,
                                                updatedBy: sample.inspectedBy,
                                                updatedAt: nowIso
                                            })
                                                .where("id", "=", sample.inspectionId)
                                                .execute()];
                                    case 15:
                                        _c.sent();
                                        _c.label = 16;
                                    case 16: return [2 /*return*/, { id: sampleId }];
                                }
                            });
                        }); })];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, { data: result, error: null }];
                case 3:
                    err_1 = _a.sent();
                    return [2 /*return*/, errResult(err_1 instanceof Error ? err_1.message : "Failed to save sample")];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// -------------------------------------------------------------
// 2. dispositionInboundInspection
// -------------------------------------------------------------
// Writes:
//   - trackedEntity.status (bulk flip for Accept/Reject; nothing for Partial)
//   - inboundInspection (status, dispositionedBy/At, notes)
//   - inboundInspectionHistory (1 row for future plan auto-switching)
function dispositionInboundInspection(args) {
    return __awaiter(this, void 0, void 0, function () {
        var db, nowIso, result, err_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = (0, database_server_1.getDatabaseClient)();
                    nowIso = new Date().toISOString();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var inspection, item, receiptLine, lotEntities, existingSamples, sampledIds, allLotIds, unsampledIds, failures, lotStatus, idsToFlip, flipStatus, updated;
                            var _a, _b, _c, _d, _e, _f;
                            return __generator(this, function (_g) {
                                switch (_g.label) {
                                    case 0: return [4 /*yield*/, trx
                                            .selectFrom("inboundInspection")
                                            .select([
                                            "id",
                                            "receiptLineId",
                                            "receiptId",
                                            "itemId",
                                            "status",
                                            "supplierId",
                                            "samplingStandard",
                                            "severity",
                                            "inspectionLevel",
                                            "aql",
                                            "lotSize",
                                            "sampleSize"
                                        ])
                                            .where("id", "=", args.id)
                                            .where("companyId", "=", args.companyId)
                                            .executeTakeFirst()];
                                    case 1:
                                        inspection = _g.sent();
                                        if (!inspection)
                                            throw new Error("Inspection not found");
                                        return [4 /*yield*/, trx
                                                .selectFrom("item")
                                                .select(["itemTrackingType"])
                                                .where("id", "=", inspection.itemId)
                                                .where("companyId", "=", args.companyId)
                                                .executeTakeFirst()];
                                    case 2:
                                        item = _g.sent();
                                        return [4 /*yield*/, trx
                                                .selectFrom("receiptLine")
                                                .select(["locationId"])
                                                .where("id", "=", inspection.receiptLineId)
                                                .where("companyId", "=", args.companyId)
                                                .executeTakeFirst()];
                                    case 3:
                                        receiptLine = _g.sent();
                                        return [4 /*yield*/, trx
                                                .selectFrom("trackedEntity")
                                                .select(["id"])
                                                .where((0, kysely_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["attributes ->> 'Receipt Line'"], ["attributes ->> 'Receipt Line'"]))), "=", inspection.receiptLineId)
                                                .where("companyId", "=", args.companyId)
                                                .execute()];
                                    case 4:
                                        lotEntities = _g.sent();
                                        return [4 /*yield*/, trx
                                                .selectFrom("inboundInspectionSample")
                                                .select(["trackedEntityId", "status"])
                                                .where("inboundInspectionId", "=", args.id)
                                                .execute()];
                                    case 5:
                                        existingSamples = _g.sent();
                                        sampledIds = new Set(existingSamples.map(function (s) { return s.trackedEntityId; }));
                                        allLotIds = lotEntities.map(function (e) { return e.id; });
                                        unsampledIds = allLotIds.filter(function (id) { return !sampledIds.has(id); });
                                        failures = existingSamples.filter(function (s) { return s.status === "Failed"; }).length;
                                        idsToFlip = [];
                                        flipStatus = null;
                                        switch (args.decision) {
                                            case "Accept":
                                                lotStatus = "Passed";
                                                idsToFlip = unsampledIds;
                                                flipStatus = "Available";
                                                break;
                                            case "Reject":
                                                lotStatus = "Failed";
                                                idsToFlip = allLotIds;
                                                flipStatus = "Rejected";
                                                break;
                                            case "Partial":
                                                lotStatus = "Partial";
                                                idsToFlip = [];
                                                flipStatus = null;
                                                break;
                                        }
                                        if (!(flipStatus && idsToFlip.length > 0)) return [3 /*break*/, 7];
                                        return [4 /*yield*/, trx
                                                .updateTable("trackedEntity")
                                                .set({ status: flipStatus })
                                                .where("id", "in", idsToFlip)
                                                .where("companyId", "=", args.companyId)
                                                .execute()];
                                    case 6:
                                        _g.sent();
                                        _g.label = 7;
                                    case 7:
                                        if (!(args.decision === "Reject" &&
                                            inspection.status !== "Failed" &&
                                            (item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Inventory" &&
                                            inspection.lotSize > 0)) return [3 /*break*/, 9];
                                        return [4 /*yield*/, trx
                                                .insertInto("itemLedger")
                                                .values({
                                                itemId: inspection.itemId,
                                                locationId: (_a = receiptLine === null || receiptLine === void 0 ? void 0 : receiptLine.locationId) !== null && _a !== void 0 ? _a : null,
                                                entryType: "Negative Adjmt.",
                                                documentType: "Inbound Inspection",
                                                documentId: inspection.id,
                                                quantity: -inspection.lotSize,
                                                trackedEntityId: null,
                                                companyId: args.companyId,
                                                createdBy: args.dispositionedBy,
                                                comment: "Inbound inspection lot rejected"
                                            })
                                                .execute()];
                                    case 8:
                                        _g.sent();
                                        _g.label = 9;
                                    case 9: return [4 /*yield*/, trx
                                            .updateTable("inboundInspection")
                                            .set({
                                            status: lotStatus,
                                            notes: (_b = args.notes) !== null && _b !== void 0 ? _b : null,
                                            dispositionedBy: args.dispositionedBy,
                                            dispositionedAt: nowIso,
                                            updatedBy: args.dispositionedBy,
                                            updatedAt: nowIso
                                        })
                                            .where("id", "=", args.id)
                                            .where("companyId", "=", args.companyId)
                                            .returning(["id", "status"])
                                            .executeTakeFirstOrThrow()];
                                    case 10:
                                        updated = _g.sent();
                                        return [4 /*yield*/, trx
                                                .insertInto("inboundInspectionHistory")
                                                .values({
                                                inboundInspectionId: args.id,
                                                itemId: inspection.itemId,
                                                supplierId: (_c = inspection.supplierId) !== null && _c !== void 0 ? _c : null,
                                                samplingStandard: inspection.samplingStandard,
                                                severity: (_d = inspection.severity) !== null && _d !== void 0 ? _d : "Normal",
                                                inspectionLevel: (_e = inspection.inspectionLevel) !== null && _e !== void 0 ? _e : null,
                                                aql: (_f = inspection.aql) !== null && _f !== void 0 ? _f : null,
                                                lotSize: inspection.lotSize,
                                                sampleSize: inspection.sampleSize,
                                                defectsFound: failures,
                                                outcome: args.decision === "Accept"
                                                    ? "Accepted"
                                                    : args.decision === "Reject"
                                                        ? "Rejected"
                                                        : "Partial",
                                                companyId: args.companyId,
                                                createdBy: args.dispositionedBy
                                            })
                                                .execute()];
                                    case 11:
                                        _g.sent();
                                        return [2 /*return*/, { id: updated.id, status: updated.status }];
                                }
                            });
                        }); })];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, { data: result, error: null }];
                case 3:
                    err_2 = _a.sent();
                    return [2 /*return*/, errResult(err_2 instanceof Error ? err_2.message : "Failed to disposition inspection")];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// -------------------------------------------------------------
// 3. assignEntitiesToIssueItem
// -------------------------------------------------------------
// Writes:
//   - nonConformanceItemTrackedEntity (delete moved links, re-insert against target)
//   - nonConformanceItem (decrement source qty, increment target qty)
function assignEntitiesToIssueItem(args) {
    return __awaiter(this, void 0, void 0, function () {
        var nonConformanceItemId, targetItemId, assignments, companyId, userId, db, nowIso, entityIds, result, err_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nonConformanceItemId = args.nonConformanceItemId, targetItemId = args.targetItemId, assignments = args.assignments, companyId = args.companyId, userId = args.userId;
                    if (assignments.length === 0) {
                        return [2 /*return*/, errResult("No assignments provided")];
                    }
                    db = (0, database_server_1.getDatabaseClient)();
                    nowIso = new Date().toISOString();
                    entityIds = assignments.map(function (a) { return a.trackedEntityId; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var source, target, existingLinks, existingQty, movingQty;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, trx
                                            .selectFrom("nonConformanceItem")
                                            .select(["id", "nonConformanceId", "quantity"])
                                            .where("id", "=", nonConformanceItemId)
                                            .where("companyId", "=", companyId)
                                            .executeTakeFirst()];
                                    case 1:
                                        source = _c.sent();
                                        if (!source)
                                            throw new Error("Source item association not found");
                                        return [4 /*yield*/, trx
                                                .selectFrom("nonConformanceItem")
                                                .select(["id", "nonConformanceId", "quantity"])
                                                .where("id", "=", targetItemId)
                                                .where("companyId", "=", companyId)
                                                .executeTakeFirst()];
                                    case 2:
                                        target = _c.sent();
                                        if (!target)
                                            throw new Error("Target item association not found");
                                        if (source.nonConformanceId !== target.nonConformanceId) {
                                            throw new Error("Cannot move entities between different NCRs");
                                        }
                                        return [4 /*yield*/, trx
                                                .selectFrom("nonConformanceItemTrackedEntity")
                                                .select(["quantity"])
                                                .where("nonConformanceItemId", "=", nonConformanceItemId)
                                                .where("trackedEntityId", "in", entityIds)
                                                .where("companyId", "=", companyId)
                                                .execute()];
                                    case 3:
                                        existingLinks = _c.sent();
                                        existingQty = existingLinks.reduce(function (acc, l) { var _a; return acc + Number((_a = l.quantity) !== null && _a !== void 0 ? _a : 0); }, 0);
                                        movingQty = assignments.reduce(function (acc, a) { return acc + Number(a.quantity); }, 0);
                                        return [4 /*yield*/, trx
                                                .deleteFrom("nonConformanceItemTrackedEntity")
                                                .where("nonConformanceItemId", "=", nonConformanceItemId)
                                                .where("trackedEntityId", "in", entityIds)
                                                .where("companyId", "=", companyId)
                                                .execute()];
                                    case 4:
                                        _c.sent();
                                        return [4 /*yield*/, trx
                                                .insertInto("nonConformanceItemTrackedEntity")
                                                .values(assignments.map(function (a) { return ({
                                                nonConformanceItemId: targetItemId,
                                                nonConformanceId: target.nonConformanceId,
                                                trackedEntityId: a.trackedEntityId,
                                                quantity: Number(a.quantity),
                                                companyId: companyId,
                                                createdBy: userId
                                            }); }))
                                                .execute()];
                                    case 5:
                                        _c.sent();
                                        return [4 /*yield*/, trx
                                                .updateTable("nonConformanceItem")
                                                .set({
                                                quantity: Math.max(0, Number((_a = source.quantity) !== null && _a !== void 0 ? _a : 0) - existingQty),
                                                updatedBy: userId,
                                                updatedAt: nowIso
                                            })
                                                .where("id", "=", nonConformanceItemId)
                                                .where("companyId", "=", companyId)
                                                .execute()];
                                    case 6:
                                        _c.sent();
                                        return [4 /*yield*/, trx
                                                .updateTable("nonConformanceItem")
                                                .set({
                                                quantity: Number((_b = target.quantity) !== null && _b !== void 0 ? _b : 0) + movingQty,
                                                updatedBy: userId,
                                                updatedAt: nowIso
                                            })
                                                .where("id", "=", targetItemId)
                                                .where("companyId", "=", companyId)
                                                .execute()];
                                    case 7:
                                        _c.sent();
                                        return [2 /*return*/, { moved: assignments.length }];
                                }
                            });
                        }); })];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, { data: result, error: null }];
                case 3:
                    err_3 = _a.sent();
                    return [2 /*return*/, errResult(err_3 instanceof Error ? err_3.message : "Failed to move entities")];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function closeIssue(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var nonConformanceId, companyId, userId, db, planResult, plan, blockers, _i, plan_1, row, sum, _a, _b, link, result, err_4;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    nonConformanceId = args.nonConformanceId, companyId = args.companyId, userId = args.userId;
                    db = (0, database_server_1.getDatabaseClient)();
                    return [4 /*yield*/, client
                            .from("nonConformanceItem")
                            .select("\n        id,\n        itemId,\n        disposition,\n        quantity,\n        links:nonConformanceItemTrackedEntity(\n          id,\n          quantity,\n          trackedEntityId,\n          trackedEntity(\n            id,\n            status\n          )\n        )\n      ")
                            .eq("nonConformanceId", nonConformanceId)
                            .eq("companyId", companyId)
                            .order("createdAt", { ascending: true })];
                case 1:
                    planResult = _c.sent();
                    if (planResult.error || !planResult.data) {
                        return [2 /*return*/, errResult("Failed to load disposition plan")];
                    }
                    plan = planResult.data.map(function (row) {
                        var _a, _b;
                        return ({
                            id: row.id,
                            itemId: row.itemId,
                            disposition: row.disposition,
                            quantity: Number((_a = row.quantity) !== null && _a !== void 0 ? _a : 0),
                            links: ((_b = row.links) !== null && _b !== void 0 ? _b : []).map(function (link) {
                                var _a, _b, _c;
                                return ({
                                    id: link.id,
                                    trackedEntityId: link.trackedEntityId,
                                    quantity: Number((_a = link.quantity) !== null && _a !== void 0 ? _a : 0),
                                    trackedEntityStatus: (_c = (_b = link.trackedEntity) === null || _b === void 0 ? void 0 : _b.status) !== null && _c !== void 0 ? _c : null
                                });
                            })
                        });
                    });
                    blockers = [];
                    for (_i = 0, plan_1 = plan; _i < plan_1.length; _i++) {
                        row = plan_1[_i];
                        if (row.links.length === 0)
                            continue;
                        if (!row.disposition || row.disposition === "Pending") {
                            blockers.push({
                                nonConformanceItemId: row.id,
                                reason: "Disposition is still Pending"
                            });
                            continue;
                        }
                        sum = row.links.reduce(function (acc, l) { return acc + l.quantity; }, 0);
                        if (Math.abs(sum - row.quantity) > 1e-6) {
                            blockers.push({
                                nonConformanceItemId: row.id,
                                reason: "Linked entity quantity (".concat(sum, ") does not match row quantity (").concat(row.quantity, ")")
                            });
                        }
                        for (_a = 0, _b = row.links; _a < _b.length; _a++) {
                            link = _b[_a];
                            if (!link.trackedEntityStatus) {
                                blockers.push({
                                    nonConformanceItemId: row.id,
                                    reason: "Linked tracked entity is missing"
                                });
                            }
                            else if (link.trackedEntityStatus === "Consumed") {
                                blockers.push({
                                    nonConformanceItemId: row.id,
                                    reason: "Tracked entity ".concat(link.trackedEntityId, " is already Consumed")
                                });
                            }
                        }
                    }
                    if (blockers.length > 0) {
                        return [2 /*return*/, errResult("Cannot close: ".concat(blockers.map(function (b) { return b.reason; }).join("; ")), blockers)];
                    }
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(_this, void 0, void 0, function () {
                            var issue, nowIso, today, readableNc, locationId, _loop_1, _i, plan_2, row, updated;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, trx
                                            .selectFrom("nonConformance")
                                            .select(["id", "nonConformanceId", "status", "locationId"])
                                            .where("id", "=", nonConformanceId)
                                            .where("companyId", "=", companyId)
                                            .executeTakeFirst()];
                                    case 1:
                                        issue = _c.sent();
                                        if (!issue)
                                            throw new Error("Issue not found");
                                        if (issue.status === "Closed")
                                            return [2 /*return*/, { id: issue.id }];
                                        nowIso = new Date().toISOString();
                                        today = nowIso.slice(0, 10);
                                        readableNc = (_a = issue.nonConformanceId) !== null && _a !== void 0 ? _a : nonConformanceId;
                                        locationId = issue.locationId;
                                        _loop_1 = function (row) {
                                            var activity, idsToFlip, commentSuffix_1, idsToFlip;
                                            return __generator(this, function (_d) {
                                                switch (_d.label) {
                                                    case 0:
                                                        if (row.links.length === 0)
                                                            return [2 /*return*/, "continue"];
                                                        return [4 /*yield*/, trx
                                                                .insertInto("trackedActivity")
                                                                .values({
                                                                type: "Disposition",
                                                                sourceDocument: "Non-Conformance",
                                                                sourceDocumentId: nonConformanceId,
                                                                sourceDocumentReadableId: readableNc,
                                                                attributes: {
                                                                    "Non-Conformance": nonConformanceId,
                                                                    Disposition: (_b = row.disposition) !== null && _b !== void 0 ? _b : "",
                                                                    Employee: userId
                                                                },
                                                                companyId: companyId,
                                                                createdBy: userId
                                                            })
                                                                .returning(["id"])
                                                                .executeTakeFirstOrThrow()];
                                                    case 1:
                                                        activity = _d.sent();
                                                        return [4 /*yield*/, trx
                                                                .insertInto("trackedActivityInput")
                                                                .values(row.links.map(function (link) { return ({
                                                                trackedActivityId: activity.id,
                                                                trackedEntityId: link.trackedEntityId,
                                                                quantity: link.quantity,
                                                                companyId: companyId,
                                                                createdBy: userId
                                                            }); }))
                                                                .execute()];
                                                    case 2:
                                                        _d.sent();
                                                        if (!(row.disposition === "Use As Is" || row.disposition === "Rework")) return [3 /*break*/, 5];
                                                        idsToFlip = row.links
                                                            .filter(function (l) { return l.trackedEntityStatus !== "Available"; })
                                                            .map(function (l) { return l.trackedEntityId; });
                                                        if (!(idsToFlip.length > 0)) return [3 /*break*/, 4];
                                                        return [4 /*yield*/, trx
                                                                .updateTable("trackedEntity")
                                                                .set({ status: "Available" })
                                                                .where("id", "in", idsToFlip)
                                                                .where("companyId", "=", companyId)
                                                                .execute()];
                                                    case 3:
                                                        _d.sent();
                                                        _d.label = 4;
                                                    case 4: return [2 /*return*/, "continue"];
                                                    case 5:
                                                        if (!(row.disposition === "Scrap" ||
                                                            row.disposition === "Return to Supplier")) return [3 /*break*/, 8];
                                                        commentSuffix_1 = row.disposition === "Scrap" ? "scrap" : "return to supplier";
                                                        return [4 /*yield*/, trx
                                                                .insertInto("itemLedger")
                                                                .values(row.links.map(function (link) { return ({
                                                                itemId: row.itemId,
                                                                locationId: locationId,
                                                                entryType: "Negative Adjmt.",
                                                                documentType: "Non-Conformance",
                                                                documentId: nonConformanceId,
                                                                quantity: -link.quantity,
                                                                trackedEntityId: link.trackedEntityId,
                                                                companyId: companyId,
                                                                createdBy: userId,
                                                                comment: "NC ".concat(readableNc, " ").concat(commentSuffix_1)
                                                            }); }))
                                                                .execute()];
                                                    case 6:
                                                        _d.sent();
                                                        idsToFlip = row.links
                                                            .filter(function (l) { return l.trackedEntityStatus !== "Rejected"; })
                                                            .map(function (l) { return l.trackedEntityId; });
                                                        if (!(idsToFlip.length > 0)) return [3 /*break*/, 8];
                                                        return [4 /*yield*/, trx
                                                                .updateTable("trackedEntity")
                                                                .set({ status: "Rejected" })
                                                                .where("id", "in", idsToFlip)
                                                                .where("companyId", "=", companyId)
                                                                .execute()];
                                                    case 7:
                                                        _d.sent();
                                                        _d.label = 8;
                                                    case 8: return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _i = 0, plan_2 = plan;
                                        _c.label = 2;
                                    case 2:
                                        if (!(_i < plan_2.length)) return [3 /*break*/, 5];
                                        row = plan_2[_i];
                                        return [5 /*yield**/, _loop_1(row)];
                                    case 3:
                                        _c.sent();
                                        _c.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 5: return [4 /*yield*/, trx
                                            .updateTable("nonConformance")
                                            .set({
                                            status: "Closed",
                                            closeDate: today,
                                            updatedBy: userId,
                                            updatedAt: nowIso
                                        })
                                            .where("id", "=", nonConformanceId)
                                            .where("companyId", "=", companyId)
                                            .returning(["id"])
                                            .executeTakeFirstOrThrow()];
                                    case 6:
                                        updated = _c.sent();
                                        return [2 /*return*/, { id: updated.id }];
                                }
                            });
                        }); })];
                case 3:
                    result = _c.sent();
                    return [2 /*return*/, { data: result, error: null }];
                case 4:
                    err_4 = _c.sent();
                    return [2 /*return*/, errResult(err_4 instanceof Error ? err_4.message : "Failed to close NCR")];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var templateObject_1;
