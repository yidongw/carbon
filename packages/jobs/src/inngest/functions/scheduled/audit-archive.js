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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditArchiveFunction = void 0;
var node_zlib_1 = require("node:zlib");
var client_server_1 = require("@carbon/auth/client.server");
var audit_config_1 = require("@carbon/database/audit.config");
var client_1 = require("../../client");
function archiveCompanyLogs(client, companyId, cutoffDate) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, records, fetchError, jsonl, gzipped, nowDate, year, month, day, timestamp, archivePath, uploadError, startDate, endDate, archiveError, _b, deletedCount, deleteError;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client.rpc("get_audit_logs_for_archive", {
                        p_company_id: companyId,
                        p_before_date: cutoffDate.toISOString()
                    })];
                case 1:
                    _a = _c.sent(), records = _a.data, fetchError = _a.error;
                    if (fetchError) {
                        throw new Error("Failed to fetch audit logs: ".concat(fetchError.message));
                    }
                    if (!records || records.length === 0) {
                        return [2 /*return*/, { recordsArchived: 0, recordsDeleted: 0 }];
                    }
                    console.log("Archiving ".concat(records.length, " records for company ").concat(companyId));
                    jsonl = records.map(function (r) { return JSON.stringify(r); }).join("\n");
                    gzipped = (0, node_zlib_1.gzipSync)(Buffer.from(jsonl));
                    nowDate = new Date();
                    year = nowDate.getFullYear();
                    month = String(nowDate.getMonth() + 1).padStart(2, "0");
                    day = String(nowDate.getDate()).padStart(2, "0");
                    timestamp = "".concat(year, "-").concat(month, "-").concat(day);
                    archivePath = "audit-logs/".concat(companyId, "/").concat(year, "/").concat(month, "/").concat(timestamp, ".jsonl.gz");
                    return [4 /*yield*/, client.storage
                            .from(audit_config_1.auditConfig.archiveBucket)
                            .upload(archivePath, gzipped, {
                            contentType: "application/gzip",
                            upsert: true
                        })];
                case 2:
                    uploadError = (_c.sent()).error;
                    if (uploadError) {
                        throw new Error("Failed to upload archive: ".concat(uploadError.message));
                    }
                    startDate = records[0].createdAt;
                    endDate = records[records.length - 1].createdAt;
                    return [4 /*yield*/, client.from("auditLogArchive").insert({
                            companyId: companyId,
                            archivePath: archivePath,
                            startDate: startDate.split("T")[0], // Extract date part
                            endDate: endDate.split("T")[0],
                            rowCount: records.length,
                            sizeBytes: gzipped.length
                        })];
                case 3:
                    archiveError = (_c.sent()).error;
                    if (!archiveError) return [3 /*break*/, 5];
                    // Try to clean up uploaded file
                    return [4 /*yield*/, client.storage.from(audit_config_1.auditConfig.archiveBucket).remove([archivePath])];
                case 4:
                    // Try to clean up uploaded file
                    _c.sent();
                    throw new Error("Failed to record archive: ".concat(archiveError.message));
                case 5: return [4 /*yield*/, client.rpc("delete_old_audit_logs", {
                        p_company_id: companyId,
                        p_cutoff_date: cutoffDate.toISOString()
                    })];
                case 6:
                    _b = _c.sent(), deletedCount = _b.data, deleteError = _b.error;
                    if (deleteError) {
                        console.error("Failed to delete archived records for ".concat(companyId), deleteError);
                        // Don't throw - archive was successful, just couldn't clean up
                        return [2 /*return*/, { recordsArchived: records.length, recordsDeleted: 0 }];
                    }
                    return [2 /*return*/, {
                            recordsArchived: records.length,
                            recordsDeleted: deletedCount !== null && deletedCount !== void 0 ? deletedCount : records.length
                        }];
            }
        });
    });
}
exports.auditArchiveFunction = client_1.inngest.createFunction({ id: "audit-log-archive", retries: 2 }, { cron: "0 2 * * *" }, function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var results;
    var step = _b.step;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, step.run("archive-audit-logs", function () { return __awaiter(void 0, void 0, void 0, function () {
                    var client, cutoffDate, _a, companies, companiesError, results, _i, _b, company, archived, error_1;
                    var _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                client = (0, client_server_1.getCarbonServiceRole)();
                                cutoffDate = new Date();
                                cutoffDate.setDate(cutoffDate.getDate() - audit_config_1.auditConfig.retentionDays);
                                console.log("Archiving audit logs older than ".concat(cutoffDate.toISOString()));
                                return [4 /*yield*/, client
                                        .from("company")
                                        .select("id")
                                        .eq("auditLogEnabled", true)];
                            case 1:
                                _a = _d.sent(), companies = _a.data, companiesError = _a.error;
                                if (companiesError) {
                                    console.error("Failed to fetch companies", companiesError);
                                    throw new Error("Failed to fetch companies: ".concat(companiesError.message));
                                }
                                results = {
                                    companiesProcessed: 0,
                                    recordsArchived: 0,
                                    recordsDeleted: 0,
                                    errors: 0
                                };
                                _i = 0, _b = (_c = companies) !== null && _c !== void 0 ? _c : [];
                                _d.label = 2;
                            case 2:
                                if (!(_i < _b.length)) return [3 /*break*/, 7];
                                company = _b[_i];
                                _d.label = 3;
                            case 3:
                                _d.trys.push([3, 5, , 6]);
                                return [4 /*yield*/, archiveCompanyLogs(client, company.id, cutoffDate)];
                            case 4:
                                archived = _d.sent();
                                results.companiesProcessed++;
                                results.recordsArchived += archived.recordsArchived;
                                results.recordsDeleted += archived.recordsDeleted;
                                return [3 /*break*/, 6];
                            case 5:
                                error_1 = _d.sent();
                                console.error("Failed to archive logs for company ".concat(company.id), error_1);
                                results.errors++;
                                return [3 /*break*/, 6];
                            case 6:
                                _i++;
                                return [3 /*break*/, 2];
                            case 7:
                                console.log("Audit log archive task completed", results);
                                return [2 /*return*/, results];
                        }
                    });
                }); })];
            case 1:
                results = _c.sent();
                return [2 /*return*/, results];
        }
    });
}); });
