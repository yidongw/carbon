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
exports.getEntityAuditLog = getEntityAuditLog;
exports.getGlobalAuditLog = getGlobalAuditLog;
exports.insertAuditLogEntries = insertAuditLogEntries;
exports.enableAuditLog = enableAuditLog;
exports.disableAuditLog = disableAuditLog;
exports.isAuditLogEnabled = isAuditLogEnabled;
exports.getAuditLogArchives = getAuditLogArchives;
exports.getArchiveDownloadUrl = getArchiveDownloadUrl;
exports.getAuditLogsForArchive = getAuditLogsForArchive;
exports.deleteOldAuditLogs = deleteOldAuditLogs;
exports.recordAuditLogArchive = recordAuditLogArchive;
exports.syncAuditSubscriptions = syncAuditSubscriptions;
var audit_config_ts_1 = require("./audit.config.ts");
var event_ts_1 = require("./event.ts");
/**
 * Whether an audit-diff key should be hidden from consumers (top-level
 * column or any nested suffix). Mirrors the writer-side filter so legacy
 * rows written before the writer enforced `skipFields` still get scrubbed
 * at read time.
 */
function isSkippedAuditKey(key) {
    var skip = audit_config_ts_1.auditConfig.skipFields;
    for (var i = 0; i < skip.length; i++) {
        var s = skip[i];
        if (key === s || key.endsWith(".".concat(s)))
            return true;
    }
    return false;
}
/**
 * Strip globally-skipped diff keys from each entry. Keeps the entry itself
 * even when every change was filtered — the entry header (timestamp, actor,
 * operation) is still meaningful history; only the noisy column rows
 * (e.g. `embedding` vectors) get suppressed from the diff payload.
 */
function sanitizeAuditEntries(entries) {
    var out = [];
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        if (!entry.diff) {
            out.push(entry);
            continue;
        }
        var next = {};
        for (var _a = 0, _b = Object.entries(entry.diff); _a < _b.length; _a++) {
            var _c = _b[_a], key = _c[0], value = _c[1];
            if (isSkippedAuditKey(key))
                continue;
            next[key] = value;
        }
        out.push(__assign(__assign({}, entry), { diff: next }));
    }
    return out;
}
/**
 * Get audit log entries for a specific entity.
 * Queries by entityType (semantic grouping) so that child table changes
 * (e.g., customerPayment, customerShipping) roll up into the parent entity view.
 */
function getEntityAuditLog(client, companyId, entityType, entityId, options) {
    return __awaiter(this, void 0, void 0, function () {
        var limit, offset, _a, data, error;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    limit = (_b = options === null || options === void 0 ? void 0 : options.limit) !== null && _b !== void 0 ? _b : 50;
                    offset = (_c = options === null || options === void 0 ? void 0 : options.offset) !== null && _c !== void 0 ? _c : 0;
                    return [4 /*yield*/, client.rpc("get_entity_audit_log", {
                            p_company_id: companyId,
                            p_entity_type: entityType,
                            p_entity_id: entityId,
                            p_limit: limit,
                            p_offset: offset,
                            p_record_id: (_d = options === null || options === void 0 ? void 0 : options.recordId) !== null && _d !== void 0 ? _d : null
                        })];
                case 1:
                    _a = _e.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        throw new Error("Failed to fetch audit log: ".concat(error.message));
                    }
                    return [2 /*return*/, sanitizeAuditEntries(data !== null && data !== void 0 ? data : [])];
            }
        });
    });
}
/**
 * Get audit log entries with filters (for global audit log view)
 */
function getGlobalAuditLog(client, companyId, filters) {
    return __awaiter(this, void 0, void 0, function () {
        var limit, offset, _a, data, error, _b, count, countError;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    limit = (_c = filters === null || filters === void 0 ? void 0 : filters.limit) !== null && _c !== void 0 ? _c : 50;
                    offset = (_d = filters === null || filters === void 0 ? void 0 : filters.offset) !== null && _d !== void 0 ? _d : 0;
                    return [4 /*yield*/, client.rpc("get_audit_log", {
                            p_company_id: companyId,
                            p_entity_type: (_e = filters === null || filters === void 0 ? void 0 : filters.entityType) !== null && _e !== void 0 ? _e : null,
                            p_actor_id: (_f = filters === null || filters === void 0 ? void 0 : filters.actorId) !== null && _f !== void 0 ? _f : null,
                            p_operation: (_g = filters === null || filters === void 0 ? void 0 : filters.operation) !== null && _g !== void 0 ? _g : null,
                            p_start_date: (_h = filters === null || filters === void 0 ? void 0 : filters.startDate) !== null && _h !== void 0 ? _h : null,
                            p_end_date: (_j = filters === null || filters === void 0 ? void 0 : filters.endDate) !== null && _j !== void 0 ? _j : null,
                            p_search: (_k = filters === null || filters === void 0 ? void 0 : filters.search) !== null && _k !== void 0 ? _k : null,
                            p_limit: limit,
                            p_offset: offset
                        })];
                case 1:
                    _a = _s.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        throw new Error("Failed to fetch audit log: ".concat(error.message));
                    }
                    return [4 /*yield*/, client.rpc("get_audit_log_count", {
                            p_company_id: companyId,
                            p_entity_type: (_l = filters === null || filters === void 0 ? void 0 : filters.entityType) !== null && _l !== void 0 ? _l : null,
                            p_actor_id: (_m = filters === null || filters === void 0 ? void 0 : filters.actorId) !== null && _m !== void 0 ? _m : null,
                            p_operation: (_o = filters === null || filters === void 0 ? void 0 : filters.operation) !== null && _o !== void 0 ? _o : null,
                            p_start_date: (_p = filters === null || filters === void 0 ? void 0 : filters.startDate) !== null && _p !== void 0 ? _p : null,
                            p_end_date: (_q = filters === null || filters === void 0 ? void 0 : filters.endDate) !== null && _q !== void 0 ? _q : null,
                            p_search: (_r = filters === null || filters === void 0 ? void 0 : filters.search) !== null && _r !== void 0 ? _r : null
                        })];
                case 2:
                    _b = _s.sent(), count = _b.data, countError = _b.error;
                    if (countError) {
                        throw new Error("Failed to fetch audit log count: ".concat(countError.message));
                    }
                    return [2 /*return*/, {
                            data: sanitizeAuditEntries(data !== null && data !== void 0 ? data : []),
                            count: count !== null && count !== void 0 ? count : 0
                        }];
            }
        });
    });
}
/**
 * Insert audit log entries (used by the audit handler task)
 */
function insertAuditLogEntries(client, companyId, entries) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (entries.length === 0)
                        return [2 /*return*/, 0];
                    return [4 /*yield*/, client.rpc("insert_audit_log_batch", {
                            p_company_id: companyId,
                            p_entries: entries
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        throw new Error("Failed to insert audit log entries: ".concat(error.message));
                    }
                    return [2 /*return*/, data !== null && data !== void 0 ? data : 0];
            }
        });
    });
}
/**
 * Enable audit logging for a company
 * Creates the per-company audit log table and event subscriptions
 */
function enableAuditLog(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var createError, updateError, _i, _a, table;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.rpc("create_audit_log_table", {
                        p_company_id: companyId
                    })];
                case 1:
                    createError = (_b.sent()).error;
                    if (createError) {
                        throw new Error("Failed to create audit log table: ".concat(createError.message));
                    }
                    return [4 /*yield*/, client
                            .from("company")
                            .update({ auditLogEnabled: true })
                            .eq("id", companyId)];
                case 2:
                    updateError = (_b.sent()).error;
                    if (updateError) {
                        throw new Error("Failed to enable audit log: ".concat(updateError.message));
                    }
                    _i = 0, _a = (0, audit_config_ts_1.getAuditableTableNames)();
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    table = _a[_i];
                    return [4 /*yield*/, (0, event_ts_1.createEventSystemSubscription)(client, {
                            name: "audit-".concat(table),
                            table: table,
                            companyId: companyId,
                            operations: ["INSERT", "UPDATE", "DELETE"],
                            type: "AUDIT",
                            config: {},
                            filter: {},
                            active: true
                        })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Disable audit logging for a company
 * Removes event subscriptions but keeps existing audit logs
 */
function disableAuditLog(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var updateError, _i, _a, table;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("company")
                        .update({ auditLogEnabled: false })
                        .eq("id", companyId)];
                case 1:
                    updateError = (_b.sent()).error;
                    if (updateError) {
                        throw new Error("Failed to disable audit log: ".concat(updateError.message));
                    }
                    _i = 0, _a = (0, audit_config_ts_1.getAuditableTableNames)();
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    table = _a[_i];
                    return [4 /*yield*/, (0, event_ts_1.deleteEventSystemSubscriptionsByName)(client, companyId, "audit-".concat(table))];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check if audit logging is enabled for a company
 */
function isAuditLogEnabled(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("company")
                        .select("auditLogEnabled")
                        .eq("id", companyId)
                        .maybeSingle()];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        throw new Error("Failed to check audit log status: ".concat(error.message));
                    }
                    return [2 /*return*/, ((_b = data === null || data === void 0 ? void 0 : data.auditLogEnabled) !== null && _b !== void 0 ? _b : false)];
            }
        });
    });
}
/**
 * Get list of archived audit log periods for a company
 */
function getAuditLogArchives(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("auditLogArchive")
                        .select("*")
                        .eq("companyId", companyId)
                        .order("endDate", { ascending: false })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        throw new Error("Failed to fetch audit log archives: ".concat(error.message));
                    }
                    return [2 /*return*/, data];
            }
        });
    });
}
/**
 * Get a signed URL for downloading an archived audit log
 */
function getArchiveDownloadUrl(client, archiveId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, archive, fetchError, _b, data, error;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client
                        .from("auditLogArchive")
                        .select("archivePath")
                        .eq("id", archiveId)
                        .single()];
                case 1:
                    _a = _c.sent(), archive = _a.data, fetchError = _a.error;
                    if (fetchError || !archive) {
                        throw new Error("Archive not found: ".concat(fetchError === null || fetchError === void 0 ? void 0 : fetchError.message));
                    }
                    return [4 /*yield*/, client.storage
                            .from(audit_config_ts_1.auditConfig.archiveBucket)
                            .createSignedUrl(archive.archivePath, 3600)];
                case 2:
                    _b = _c.sent(), data = _b.data, error = _b.error;
                    if (error || !(data === null || data === void 0 ? void 0 : data.signedUrl)) {
                        throw new Error("Failed to generate download URL: ".concat(error === null || error === void 0 ? void 0 : error.message));
                    }
                    return [2 /*return*/, data.signedUrl];
            }
        });
    });
}
/**
 * Get audit logs for archival
 */
function getAuditLogsForArchive(client, companyId, cutoffDate) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.rpc("get_audit_logs_for_archive", {
                        p_company_id: companyId,
                        p_before_date: cutoffDate.toISOString()
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        throw new Error("Failed to get audit logs for archive: ".concat(error.message));
                    }
                    return [2 /*return*/, data !== null && data !== void 0 ? data : []];
            }
        });
    });
}
/**
 * Delete audit log entries older than a certain date
 * Used by the archive task after successful export
 */
function deleteOldAuditLogs(client, companyId, cutoffDate) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.rpc("delete_old_audit_logs", {
                        p_company_id: companyId,
                        p_cutoff_date: cutoffDate.toISOString()
                    })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        throw new Error("Failed to delete old audit logs: ".concat(error.message));
                    }
                    return [2 /*return*/, data !== null && data !== void 0 ? data : 0];
            }
        });
    });
}
/**
 * Record an archive in the tracking table
 */
function recordAuditLogArchive(client, archive) {
    return __awaiter(this, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.from("auditLogArchive").insert(archive)];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        throw new Error("Failed to record audit log archive: ".concat(error.message));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Sync audit subscriptions for a company.
 * Ensures subscriptions exist for all auditable tables defined in the config.
 * This handles the case where new tables are added to the config after a
 * company has already enabled audit logging.
 */
function syncAuditSubscriptions(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var allTables, _a, existing, fetchError, existingNames, _i, allTables_1, table, subName;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    allTables = (0, audit_config_ts_1.getAuditableTableNames)();
                    return [4 /*yield*/, client
                            .from("eventSystemSubscription")
                            .select("name")
                            .eq("companyId", companyId)
                            .eq("handlerType", "AUDIT")];
                case 1:
                    _a = _c.sent(), existing = _a.data, fetchError = _a.error;
                    if (fetchError) {
                        // Table might not exist, silently return
                        return [2 /*return*/];
                    }
                    existingNames = new Set(((_b = existing) !== null && _b !== void 0 ? _b : []).map(function (s) { return s.name; }));
                    _i = 0, allTables_1 = allTables;
                    _c.label = 2;
                case 2:
                    if (!(_i < allTables_1.length)) return [3 /*break*/, 5];
                    table = allTables_1[_i];
                    subName = "audit-".concat(table);
                    if (!!existingNames.has(subName)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, event_ts_1.createEventSystemSubscription)(client, {
                            name: subName,
                            table: table,
                            companyId: companyId,
                            operations: ["INSERT", "UPDATE", "DELETE"],
                            type: "AUDIT",
                            config: {},
                            filter: {},
                            active: true
                        })];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
