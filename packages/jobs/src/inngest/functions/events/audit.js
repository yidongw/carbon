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
exports.auditFunction = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var audit_config_1 = require("@carbon/database/audit.config");
var utils_1 = require("@carbon/utils");
var zod_1 = require("zod");
var client_1 = require("../../client");
var AuditRecordSchema = zod_1.z.object({
    event: zod_1.z.object({
        table: zod_1.z.string(),
        operation: zod_1.z.enum(["INSERT", "UPDATE", "DELETE", "TRUNCATE"]),
        recordId: zod_1.z.string(),
        new: zod_1.z.record(zod_1.z.any()).nullable(),
        old: zod_1.z.record(zod_1.z.any()).nullable(),
        timestamp: zod_1.z.string()
    }),
    companyId: zod_1.z.string(),
    actorId: zod_1.z.string().nullish(),
    handlerConfig: zod_1.z.record(zod_1.z.any())
});
var AuditPayloadSchema = zod_1.z.object({
    records: zod_1.z.array(AuditRecordSchema)
});
/**
 * Whether a diff key should be excluded from the audit log. Matches both
 * top-level columns (`"embedding"`) and any nested suffix (`"foo.embedding"`)
 * so vector / metadata columns don't leak when they appear inside JSON
 * containers or under createField allowlists.
 */
function isSkippedAuditKey(key) {
    var skip = audit_config_1.auditConfig.skipFields;
    for (var i = 0; i < skip.length; i++) {
        var s = skip[i];
        if (key === s || key.endsWith(".".concat(s)))
            return true;
    }
    return false;
}
/**
 * Compute the diff between old and new record values.
 */
function computeDiff(old, newRecord) {
    var diff = {};
    var allKeys = new Set(__spreadArray(__spreadArray([], Object.keys(old), true), Object.keys(newRecord), true));
    for (var _i = 0, allKeys_1 = allKeys; _i < allKeys_1.length; _i++) {
        var key = allKeys_1[_i];
        if (isSkippedAuditKey(key))
            continue;
        var oldValue = old[key];
        var newValue = newRecord[key];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            if (typeof oldValue === "object" &&
                oldValue !== null &&
                typeof newValue === "object" &&
                newValue !== null &&
                !Array.isArray(oldValue) &&
                !Array.isArray(newValue)) {
                var nestedDiff = computeNestedDiff(oldValue, newValue, key);
                Object.assign(diff, nestedDiff);
            }
            else {
                diff[key] = { old: oldValue, new: newValue };
            }
        }
    }
    return Object.keys(diff).length > 0 ? diff : null;
}
/**
 * Build a diff for INSERT events from an allowlist of columns.
 * Returns null when no fields are configured or none are present on the record.
 * Globally-skipped fields (e.g. `embedding`) are dropped even if listed in
 * `createFields` so vector / metadata noise can't leak into CREATE diffs.
 */
function computeCreateDiff(newRecord, createFields) {
    if (createFields.length === 0)
        return null;
    var diff = {};
    for (var _i = 0, createFields_1 = createFields; _i < createFields_1.length; _i++) {
        var field = createFields_1[_i];
        if (isSkippedAuditKey(field))
            continue;
        if (field in newRecord) {
            diff[field] = { new: newRecord[field] };
        }
    }
    return Object.keys(diff).length > 0 ? diff : null;
}
function computeNestedDiff(old, newRecord, prefix) {
    var diff = {};
    var allKeys = new Set(__spreadArray(__spreadArray([], Object.keys(old), true), Object.keys(newRecord), true));
    for (var _i = 0, allKeys_2 = allKeys; _i < allKeys_2.length; _i++) {
        var key = allKeys_2[_i];
        var fullKey = "".concat(prefix, ".").concat(key);
        if (isSkippedAuditKey(fullKey))
            continue;
        var oldValue = old[key];
        var newValue = newRecord[key];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            diff[fullKey] = { old: oldValue, new: newValue };
        }
    }
    return diff;
}
exports.auditFunction = client_1.inngest.createFunction({
    id: "event-handler-audit",
    retries: 3
}, { event: "carbon/event-audit" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var payload, results, client, byCompany, _loop_1, _i, _c, _d, companyId, records;
    var event = _b.event, step = _b.step;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                payload = AuditPayloadSchema.parse(event.data);
                console.log("Processing ".concat(payload.records.length, " audit log events"));
                results = {
                    inserted: 0,
                    skipped: 0,
                    failed: 0
                };
                client = (0, client_server_1.getCarbonServiceRole)();
                byCompany = (0, utils_1.groupBy)(payload.records, function (r) { return r.companyId; });
                _loop_1 = function (companyId, records) {
                    var companyResult;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                if (!companyId || companyId === "undefined") {
                                    console.log("Skipping ".concat(records.length, " records: missing companyId"));
                                    results.skipped += records.length;
                                    return [2 /*return*/, "continue"];
                                }
                                return [4 /*yield*/, step.run("audit-".concat(companyId), function () { return __awaiter(void 0, void 0, void 0, function () {
                                        var stepResults, company, entries, _i, records_1, record, tableName, actorId, diff, operation, entryActorId, entryMetadata, entityConfigs, entriesCreatedForRecord, _a, entityConfigs_1, entityEntry, entityType, tableConfig, effectiveDiff, recordData, entityId, _b, junction, fk, entityIdColumn, junctionRow, row, error_1, _c, insertedCount, error;
                                        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                                        return __generator(this, function (_q) {
                                            switch (_q.label) {
                                                case 0:
                                                    stepResults = { inserted: 0, skipped: 0, failed: 0 };
                                                    return [4 /*yield*/, client
                                                            .from("company")
                                                            .select("auditLogEnabled")
                                                            .eq("id", companyId)
                                                            .single()];
                                                case 1:
                                                    company = (_q.sent()).data;
                                                    if (!(company === null || company === void 0 ? void 0 : company.auditLogEnabled)) {
                                                        console.log("Skipping ".concat(records.length, " records: audit logging disabled for company ").concat(companyId));
                                                        stepResults.skipped += records.length;
                                                        return [2 /*return*/, stepResults];
                                                    }
                                                    entries = [];
                                                    _i = 0, records_1 = records;
                                                    _q.label = 2;
                                                case 2:
                                                    if (!(_i < records_1.length)) return [3 /*break*/, 13];
                                                    record = records_1[_i];
                                                    tableName = record.event.table;
                                                    if (!(0, audit_config_1.isAuditableTable)(tableName)) {
                                                        console.log("Skipping: table \"".concat(tableName, "\" is not auditable"));
                                                        stepResults.skipped++;
                                                        return [3 /*break*/, 12];
                                                    }
                                                    if (record.event.operation === "TRUNCATE") {
                                                        console.log("Skipping: TRUNCATE on \"".concat(tableName, "\" is not meaningful"));
                                                        stepResults.skipped++;
                                                        return [3 /*break*/, 12];
                                                    }
                                                    _q.label = 3;
                                                case 3:
                                                    _q.trys.push([3, 11, , 12]);
                                                    actorId = (_k = (_h = (_f = (_d = record.actorId) !== null && _d !== void 0 ? _d : (_e = record.event.new) === null || _e === void 0 ? void 0 : _e.updatedBy) !== null && _f !== void 0 ? _f : (_g = record.event.new) === null || _g === void 0 ? void 0 : _g.createdBy) !== null && _h !== void 0 ? _h : (_j = record.event.old) === null || _j === void 0 ? void 0 : _j.updatedBy) !== null && _k !== void 0 ? _k : (_l = record.event.old) === null || _l === void 0 ? void 0 : _l.createdBy;
                                                    diff = null;
                                                    if (record.event.operation === "UPDATE" &&
                                                        record.event.old &&
                                                        record.event.new) {
                                                        diff = computeDiff(record.event.old, record.event.new);
                                                        if (!diff) {
                                                            console.log("Skipping: no meaningful diff for UPDATE on \"".concat(tableName, "\" record ").concat(record.event.recordId));
                                                            stepResults.skipped++;
                                                            return [3 /*break*/, 12];
                                                        }
                                                    }
                                                    operation = record.event
                                                        .operation;
                                                    entryActorId = (_m = actorId) !== null && _m !== void 0 ? _m : null;
                                                    entryMetadata = (_o = record.handlerConfig.metadata) !== null && _o !== void 0 ? _o : null;
                                                    entityConfigs = (0, audit_config_1.getEntityConfigsForTable)(tableName);
                                                    if (entityConfigs.length === 0) {
                                                        console.log("Skipping: no entity config found for table \"".concat(tableName, "\""));
                                                        stepResults.skipped++;
                                                        return [3 /*break*/, 12];
                                                    }
                                                    entriesCreatedForRecord = 0;
                                                    _a = 0, entityConfigs_1 = entityConfigs;
                                                    _q.label = 4;
                                                case 4:
                                                    if (!(_a < entityConfigs_1.length)) return [3 /*break*/, 10];
                                                    entityEntry = entityConfigs_1[_a];
                                                    entityType = entityEntry.entityType, tableConfig = entityEntry.tableConfig;
                                                    if (record.event.operation === "INSERT" &&
                                                        !(0, audit_config_1.isRootTable)(tableConfig)) {
                                                        console.log("Skipping: INSERT on non-root table \"".concat(tableName, "\" for entity \"").concat(entityType, "\""));
                                                        return [3 /*break*/, 9];
                                                    }
                                                    effectiveDiff = record.event.operation === "INSERT" && record.event.new
                                                        ? computeCreateDiff(record.event.new, (0, audit_config_1.getCreateFields)(tableConfig))
                                                        : diff;
                                                    if (!(0, audit_config_1.isRootTable)(tableConfig)) return [3 /*break*/, 5];
                                                    entries.push({
                                                        tableName: tableName,
                                                        entityType: entityType,
                                                        entityId: record.event.recordId,
                                                        recordId: record.event.recordId,
                                                        operation: operation,
                                                        actorId: entryActorId,
                                                        diff: effectiveDiff,
                                                        metadata: entryMetadata,
                                                        createdAt: record.event.timestamp
                                                    });
                                                    entriesCreatedForRecord++;
                                                    return [3 /*break*/, 9];
                                                case 5:
                                                    if (!(0, audit_config_1.isExtensionTable)(tableConfig)) return [3 /*break*/, 6];
                                                    entries.push({
                                                        tableName: tableName,
                                                        entityType: entityType,
                                                        entityId: record.event.recordId,
                                                        recordId: record.event.recordId,
                                                        operation: operation,
                                                        actorId: entryActorId,
                                                        diff: effectiveDiff,
                                                        metadata: entryMetadata,
                                                        createdAt: record.event.timestamp
                                                    });
                                                    entriesCreatedForRecord++;
                                                    return [3 /*break*/, 9];
                                                case 6:
                                                    if (!(0, audit_config_1.isChildTable)(tableConfig)) return [3 /*break*/, 7];
                                                    recordData = (_p = record.event.new) !== null && _p !== void 0 ? _p : record.event.old;
                                                    entityId = recordData === null || recordData === void 0 ? void 0 : recordData[tableConfig.entityIdColumn];
                                                    if (!entityId) {
                                                        console.log("Skipping: could not resolve entity ID from column \"".concat(tableConfig.entityIdColumn, "\" for \"").concat(tableName, "\" record ").concat(record.event.recordId));
                                                        return [3 /*break*/, 9];
                                                    }
                                                    entries.push({
                                                        tableName: tableName,
                                                        entityType: entityType,
                                                        entityId: String(entityId),
                                                        recordId: record.event.recordId,
                                                        operation: operation,
                                                        actorId: entryActorId,
                                                        diff: effectiveDiff,
                                                        metadata: entryMetadata,
                                                        createdAt: record.event.timestamp
                                                    });
                                                    entriesCreatedForRecord++;
                                                    return [3 /*break*/, 9];
                                                case 7:
                                                    if (!(0, audit_config_1.isIndirectTable)(tableConfig)) return [3 /*break*/, 9];
                                                    _b = tableConfig.resolve, junction = _b.junction, fk = _b.fk, entityIdColumn = _b.entityIdColumn;
                                                    return [4 /*yield*/, client
                                                            .from(junction)
                                                            .select(entityIdColumn)
                                                            .eq(fk, record.event.recordId)
                                                            .limit(1)
                                                            .maybeSingle()];
                                                case 8:
                                                    junctionRow = (_q.sent()).data;
                                                    row = junctionRow;
                                                    if (row && row[entityIdColumn]) {
                                                        entries.push({
                                                            tableName: tableName,
                                                            entityType: entityType,
                                                            entityId: String(row[entityIdColumn]),
                                                            recordId: record.event.recordId,
                                                            operation: operation,
                                                            actorId: entryActorId,
                                                            diff: effectiveDiff,
                                                            metadata: entryMetadata
                                                        });
                                                        entriesCreatedForRecord++;
                                                    }
                                                    else {
                                                        console.log("Skipping: no parent entity found via junction \"".concat(junction, "\" for \"").concat(tableName, "\" record ").concat(record.event.recordId, " (entity: ").concat(entityType, ")"));
                                                    }
                                                    _q.label = 9;
                                                case 9:
                                                    _a++;
                                                    return [3 /*break*/, 4];
                                                case 10:
                                                    if (entriesCreatedForRecord === 0) {
                                                        console.log("Skipping: could not resolve any entity for \"".concat(tableName, "\" record ").concat(record.event.recordId));
                                                        stepResults.skipped++;
                                                    }
                                                    return [3 /*break*/, 12];
                                                case 11:
                                                    error_1 = _q.sent();
                                                    console.error("Failed to process audit record:", {
                                                        error: error_1,
                                                        record: record
                                                    });
                                                    stepResults.failed++;
                                                    return [3 /*break*/, 12];
                                                case 12:
                                                    _i++;
                                                    return [3 /*break*/, 2];
                                                case 13: 
                                                // Snapshot FK target display values into each diff before insert.
                                                // Frozen at write time — renames/deletes of the FK target do not
                                                // rewrite history.
                                                return [4 /*yield*/, applyFkSnapshots(client, companyId, entries)];
                                                case 14:
                                                    // Snapshot FK target display values into each diff before insert.
                                                    // Frozen at write time — renames/deletes of the FK target do not
                                                    // rewrite history.
                                                    _q.sent();
                                                    if (!(entries.length > 0)) return [3 /*break*/, 16];
                                                    return [4 /*yield*/, client.rpc("insert_audit_log_batch", {
                                                            p_company_id: companyId,
                                                            p_entries: entries
                                                        })];
                                                case 15:
                                                    _c = _q.sent(), insertedCount = _c.data, error = _c.error;
                                                    if (error) {
                                                        console.error("Failed to insert audit log entries:", { error: error });
                                                        stepResults.failed += entries.length;
                                                    }
                                                    else {
                                                        stepResults.inserted += insertedCount !== null && insertedCount !== void 0 ? insertedCount : entries.length;
                                                    }
                                                    _q.label = 16;
                                                case 16: return [2 /*return*/, stepResults];
                                            }
                                        });
                                    }); })];
                            case 1:
                                companyResult = _f.sent();
                                results.inserted += companyResult.inserted;
                                results.skipped += companyResult.skipped;
                                results.failed += companyResult.failed;
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, _c = Object.entries(byCompany);
                _e.label = 1;
            case 1:
                if (!(_i < _c.length)) return [3 /*break*/, 4];
                _d = _c[_i], companyId = _d[0], records = _d[1];
                return [5 /*yield**/, _loop_1(companyId, records)];
            case 2:
                _e.sent();
                _e.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4:
                console.log("Audit function completed", results);
                return [2 /*return*/, results];
        }
    });
}); });
/**
 * For every entry whose tableConfig declares `snapshotFields`, look up the
 * FK target's display columns and freeze them onto the diff entry under
 * `snapshot.old` / `snapshot.new`. One batched query per target table —
 * proportional to distinct FK targets, not to entries.
 */
function applyFkSnapshots(client, companyId, entries) {
    return __awaiter(this, void 0, void 0, function () {
        var refs, idsByTable, colsByTable, _loop_2, _i, entries_1, entry, lookup, _a, idsByTable_1, _b, table, ids, cols, selectClause, _c, data, error, _d, _e, row, rowId, snapshot, _f, cols_1, col, err_1, pickSnapshot, _g, refs_1, ref, oldVal, newVal, oldSnap, newSnap;
        var _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    refs = [];
                    idsByTable = new Map();
                    colsByTable = new Map();
                    _loop_2 = function (entry) {
                        if (!entry.diff)
                            return "continue";
                        var configs = (0, audit_config_1.getEntityConfigsForTable)(entry.tableName).filter(function (c) { return c.entityType === entry.entityType; });
                        for (var _l = 0, configs_1 = configs; _l < configs_1.length; _l++) {
                            var tableConfig = configs_1[_l].tableConfig;
                            var snapshots = (0, audit_config_1.getSnapshotFields)(tableConfig);
                            for (var _m = 0, snapshots_1 = snapshots; _m < snapshots_1.length; _m++) {
                                var snap = snapshots_1[_m];
                                var change = entry.diff[snap.column];
                                if (!change)
                                    continue;
                                refs.push({
                                    diffEntry: change,
                                    table: snap.table,
                                    displayColumns: snap.displayColumns
                                });
                                var ids = (_h = idsByTable.get(snap.table)) !== null && _h !== void 0 ? _h : new Set();
                                if (typeof change.old === "string")
                                    ids.add(change.old);
                                if (typeof change.new === "string")
                                    ids.add(change.new);
                                idsByTable.set(snap.table, ids);
                                var cols = (_j = colsByTable.get(snap.table)) !== null && _j !== void 0 ? _j : new Set();
                                for (var _o = 0, _p = snap.displayColumns; _o < _p.length; _o++) {
                                    var c = _p[_o];
                                    cols.add(c);
                                }
                                colsByTable.set(snap.table, cols);
                            }
                        }
                    };
                    for (_i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
                        entry = entries_1[_i];
                        _loop_2(entry);
                    }
                    if (refs.length === 0)
                        return [2 /*return*/];
                    lookup = new Map();
                    _a = 0, idsByTable_1 = idsByTable;
                    _k.label = 1;
                case 1:
                    if (!(_a < idsByTable_1.length)) return [3 /*break*/, 6];
                    _b = idsByTable_1[_a], table = _b[0], ids = _b[1];
                    if (ids.size === 0)
                        return [3 /*break*/, 5];
                    cols = colsByTable.get(table);
                    if (!cols || cols.size === 0)
                        return [3 /*break*/, 5];
                    selectClause = __spreadArray(["id"], cols, true).join(", ");
                    _k.label = 2;
                case 2:
                    _k.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, client
                            .from(table)
                            .select(selectClause)
                            .eq("companyId", companyId)
                            .in("id", Array.from(ids))];
                case 3:
                    _c = _k.sent(), data = _c.data, error = _c.error;
                    if (error || !data)
                        return [3 /*break*/, 5];
                    for (_d = 0, _e = data; _d < _e.length; _d++) {
                        row = _e[_d];
                        rowId = row === null || row === void 0 ? void 0 : row.id;
                        if (typeof rowId !== "string")
                            continue;
                        snapshot = {};
                        for (_f = 0, cols_1 = cols; _f < cols_1.length; _f++) {
                            col = cols_1[_f];
                            snapshot[col] = row[col];
                        }
                        lookup.set("".concat(table, "::").concat(rowId), snapshot);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _k.sent();
                    console.error("FK snapshot lookup failed for table \"".concat(table, "\":"), err_1);
                    return [3 /*break*/, 5];
                case 5:
                    _a++;
                    return [3 /*break*/, 1];
                case 6:
                    pickSnapshot = function (fullSnapshot, displayColumns) {
                        if (!fullSnapshot)
                            return undefined;
                        var picked = {};
                        for (var _i = 0, displayColumns_1 = displayColumns; _i < displayColumns_1.length; _i++) {
                            var col = displayColumns_1[_i];
                            if (col in fullSnapshot)
                                picked[col] = fullSnapshot[col];
                        }
                        return Object.keys(picked).length > 0 ? picked : undefined;
                    };
                    for (_g = 0, refs_1 = refs; _g < refs_1.length; _g++) {
                        ref = refs_1[_g];
                        oldVal = ref.diffEntry.old;
                        newVal = ref.diffEntry.new;
                        oldSnap = typeof oldVal === "string"
                            ? pickSnapshot(lookup.get("".concat(ref.table, "::").concat(oldVal)), ref.displayColumns)
                            : undefined;
                        newSnap = typeof newVal === "string"
                            ? pickSnapshot(lookup.get("".concat(ref.table, "::").concat(newVal)), ref.displayColumns)
                            : undefined;
                        if (oldSnap || newSnap) {
                            ref.diffEntry.snapshot = __assign(__assign({}, (oldSnap && { old: oldSnap })), (newSnap && { new: newSnap }));
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
