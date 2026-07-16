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
var csv_ts_1 = require("https://deno.land/std@0.175.0/encoding/csv.ts");
var server_ts_1 = require("https://deno.land/std@0.175.0/http/server.ts");
var mod_ts_1 = require("https://deno.land/x/nanoid@v3.0.0/mod.ts");
var npm_kysely_0_27_6_1 = require("npm:kysely@0.27.6");
var npm_zod__3_24_1_1 = require("npm:zod@^3.24.1");
var database_ts_1 = require("../lib/database.ts");
var headers_ts_1 = require("../lib/headers.ts");
var supabase_ts_1 = require("../lib/supabase.ts");
var utils_ts_1 = require("../lib/utils.ts");
var classify_import_row_ts_1 = require("./classify-import-row.ts");
var pool = (0, database_ts_1.getConnectionPool)(1);
var db = (0, database_ts_1.getDatabaseClient)(pool);
var importCsvValidator = npm_zod__3_24_1_1.default.object({
    table: npm_zod__3_24_1_1.default.enum([
        "consumable",
        "customer",
        "customerContact",
        "fixture",
        "material",
        "methodMaterial",
        "part",
        "supplier",
        "supplierContact",
        "tool",
        "workCenter",
        "process",
    ]),
    filePath: npm_zod__3_24_1_1.default.string(),
    columnMappings: npm_zod__3_24_1_1.default.record(npm_zod__3_24_1_1.default.string()),
    enumMappings: npm_zod__3_24_1_1.default.record(npm_zod__3_24_1_1.default.record(npm_zod__3_24_1_1.default.string())).optional(),
    companyId: npm_zod__3_24_1_1.default.string(),
    userId: npm_zod__3_24_1_1.default.string(),
});
var EXTERNAL_ID_KEY = "csv";
/**
 * Fallback CSV parser used when std/csv rejects a row-length mismatch.
 * Handles RFC-4180 quoting but tolerates uneven row widths (extra cells
 * dropped, missing cells become "").
 */
function parsePermissiveCsv(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    for (var i = 0; i < text.length; i++) {
        var c = text[i];
        if (inQuotes) {
            if (c === '"') {
                if (text[i + 1] === '"') {
                    field += '"';
                    i++;
                }
                else {
                    inQuotes = false;
                }
            }
            else {
                field += c;
            }
        }
        else if (c === '"') {
            inQuotes = true;
        }
        else if (c === ",") {
            row.push(field);
            field = "";
        }
        else if (c === "\n" || c === "\r") {
            // \r\n: consume the \n that follows
            if (c === "\r" && text[i + 1] === "\n")
                i++;
            row.push(field);
            field = "";
            // Skip blank rows that arise from trailing newlines
            if (row.length > 1 || (row.length === 1 && row[0] !== "")) {
                rows.push(row);
            }
            row = [];
        }
        else {
            field += c;
        }
    }
    if (field !== "" || row.length > 0) {
        row.push(field);
        if (row.length > 1 || (row.length === 1 && row[0] !== "")) {
            rows.push(row);
        }
    }
    if (rows.length === 0)
        return [];
    var headers = rows[0];
    return rows.slice(1).map(function (r) {
        var _a;
        var obj = {};
        for (var i = 0; i < headers.length; i++) {
            obj[headers[i]] = (_a = r[i]) !== null && _a !== void 0 ? _a : "";
        }
        return obj;
    });
}
/**
 * Look up the ids that still exist in the entity table. Done as a typed
 * switch so each Kysely query is fully type-checked — avoids `as any` casts
 * that bypass the generated DB types.
 */
function fetchLiveEntityIds(entityType, ids) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (ids.length === 0)
                        return [2 /*return*/, new Set()];
                    _a = entityType;
                    switch (_a) {
                        case "customer": return [3 /*break*/, 1];
                        case "supplier": return [3 /*break*/, 3];
                        case "item": return [3 /*break*/, 5];
                        case "contact": return [3 /*break*/, 7];
                        case "workCenter": return [3 /*break*/, 9];
                        case "process": return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 13];
                case 1: return [4 /*yield*/, db
                        .selectFrom("customer")
                        .select(["id"])
                        .where("id", "in", ids)
                        .execute()];
                case 2:
                    rows = _b.sent();
                    return [3 /*break*/, 13];
                case 3: return [4 /*yield*/, db
                        .selectFrom("supplier")
                        .select(["id"])
                        .where("id", "in", ids)
                        .execute()];
                case 4:
                    rows = _b.sent();
                    return [3 /*break*/, 13];
                case 5: return [4 /*yield*/, db
                        .selectFrom("item")
                        .select(["id"])
                        .where("id", "in", ids)
                        .execute()];
                case 6:
                    rows = _b.sent();
                    return [3 /*break*/, 13];
                case 7: return [4 /*yield*/, db
                        .selectFrom("contact")
                        .select(["id"])
                        .where("id", "in", ids)
                        .execute()];
                case 8:
                    rows = _b.sent();
                    return [3 /*break*/, 13];
                case 9: return [4 /*yield*/, db
                        .selectFrom("workCenter")
                        .select(["id"])
                        .where("id", "in", ids)
                        .execute()];
                case 10:
                    rows = _b.sent();
                    return [3 /*break*/, 13];
                case 11: return [4 /*yield*/, db
                        .selectFrom("process")
                        .select(["id"])
                        .where("id", "in", ids)
                        .execute()];
                case 12:
                    rows = _b.sent();
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/, new Set(rows.map(function (r) { return r.id; }))];
            }
        });
    });
}
/**
 * Build a name → id map for an entity table, scoped to a company and to the
 * specific names the caller cares about. Used as a fallback dedup key when
 * the CSV's Unique ID has no externalIntegrationMapping row yet (e.g., the
 * entity was created in-app, then a CSV with the same name is imported).
 * Scoping the query to `namesToCheck` avoids a full-table scan on
 * supplier/customer for companies with large rosters.
 */
function getNameMap(entityType, cId, namesToCheck) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (namesToCheck.length === 0)
                        return [2 /*return*/, new Map()];
                    if (!(entityType === "supplier")) return [3 /*break*/, 2];
                    return [4 /*yield*/, db
                            .selectFrom("supplier")
                            .select(["id", "name"])
                            .where("companyId", "=", cId)
                            .where("name", "in", namesToCheck)
                            .execute()];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, db
                        .selectFrom("customer")
                        .select(["id", "name"])
                        .where("companyId", "=", cId)
                        .where("name", "in", namesToCheck)
                        .execute()];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    rows = _a;
                    return [2 /*return*/, new Map(rows.map(function (r) { return [r.name, r.id]; }))];
            }
        });
    });
}
/**
 * Build a map of CSV external IDs → entity IDs from externalIntegrationMapping.
 * Filters orphan mappings (rows whose entityId points at a deleted entity)
 * so re-imports cleanly take the INSERT path instead of failing the
 * subsequent supplierTax/customerTax upsert with a 23503 FK error.
 */
function getCsvExternalIdMap(entityType, cId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, candidates, liveIds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db
                        .selectFrom("externalIntegrationMapping")
                        .select(["externalId", "entityId"])
                        .where("entityType", "=", entityType)
                        .where("integration", "=", EXTERNAL_ID_KEY)
                        .where("companyId", "=", cId)
                        .execute()];
                case 1:
                    result = _a.sent();
                    candidates = result.filter(function (r) {
                        return r.externalId !== null && r.entityId !== null;
                    });
                    if (candidates.length === 0)
                        return [2 /*return*/, new Map()];
                    return [4 /*yield*/, fetchLiveEntityIds(entityType, candidates.map(function (r) { return r.entityId; }))];
                case 2:
                    liveIds = _a.sent();
                    return [2 /*return*/, new Map(candidates
                            .filter(function (r) { return liveIds.has(r.entityId); })
                            .map(function (r) { return [r.externalId, r.entityId]; }))];
            }
        });
    });
}
/**
 * Convert empty-string values to undefined. Kysely drops undefined keys from
 * the INSERT, so the column gets its DB default (NULL). Empty CSV cells would
 * otherwise become literal "" and fail FK or enum constraints.
 */
function nullifyEmptyStrings(obj) {
    var out = {};
    for (var _i = 0, _a = Object.entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        out[k] = v === "" ? undefined : v;
    }
    return out;
}
/**
 * Upsert CSV external ID mappings into the externalIntegrationMapping table.
 * Uses ON CONFLICT to handle re-imports idempotently.
 */
function upsertCsvMappings(trx, entityType, mappings, cId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var valid, now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    valid = mappings.filter(function (m) { return m.externalId; });
                    if (valid.length === 0)
                        return [2 /*return*/];
                    now = new Date().toISOString();
                    return [4 /*yield*/, trx
                            .insertInto("externalIntegrationMapping")
                            .values(valid.map(function (m) { return ({
                            entityType: entityType,
                            entityId: m.entityId,
                            integration: EXTERNAL_ID_KEY,
                            externalId: m.externalId,
                            companyId: cId,
                            allowDuplicateExternalId: false,
                            createdBy: userId,
                            createdAt: now,
                            updatedAt: now,
                        }); }))
                            // On conflict (orphan mapping with same csv id but stale entityId),
                            // repoint entityId to the freshly-inserted entity. The .where() matches
                            // the partial unique index's predicate, required by Postgres for
                            // arbitration on partial indexes (42P10 otherwise).
                            .onConflict(function (oc) {
                            return oc
                                .columns(["integration", "externalId", "entityType", "companyId"])
                                .where("allowDuplicateExternalId", "=", false)
                                .doUpdateSet(function (eb) { return ({
                                entityId: eb.ref("excluded.entityId"),
                                updatedAt: eb.ref("excluded.updatedAt"),
                            }); });
                        })
                            .execute()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function extractPartnerExtensions(record) {
    return {
        locationName: record.locationName,
        addressLine1: record.addressLine1,
        addressLine2: record.addressLine2,
        city: record.city,
        state: record.state,
        postalCode: record.postalCode,
        countryCode: record.countryCode,
        paymentTermId: record.paymentTermId,
        shippingMethodId: record.shippingMethodId,
        incoterm: record.incoterm,
        incotermLocation: record.incotermLocation,
    };
}
function hasAnyAddressField(ext) {
    // Require addressLine1 to recognize a row as having an address. It's the
    // most distinguishing line of a postal address and also doubles as the
    // location-name fallback when `Location Name` is blank — without it,
    // creating a supplierLocation/customerLocation would have no usable label.
    return !!ext.addressLine1;
}
function buildAddressFields(ext) {
    return {
        addressLine1: ext.addressLine1 || null,
        addressLine2: ext.addressLine2 || null,
        city: ext.city || null,
        // The CSV field is `state` (user-facing label "State / Region"); the
        // column was renamed to stateProvince in migration 20240928155702.
        stateProvince: ext.state || null,
        postalCode: ext.postalCode || null,
        // address.countryCode is TEXT storing ISO 3166-1 alpha-2 (e.g., "US"),
        // post-20240928155702_country-codes.
        countryCode: ext.countryCode || null,
    };
}
/**
 * Bulk-load the addressId of each entity's primary (lowest-id) location.
 * Used by the supplier/customer extension UPDATE paths to avoid an N+1
 * SELECT per entity inside the per-row loop. New inserts pass undefined
 * since by construction they have no location yet.
 */
function preloadPrimaryLocationAddressIds(trx, entityType, entityIds) {
    return __awaiter(this, void 0, void 0, function () {
        var rows, _a, map, _i, rows_1, row, key;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (entityIds.length === 0)
                        return [2 /*return*/, new Map()];
                    if (!(entityType === "supplier")) return [3 /*break*/, 2];
                    return [4 /*yield*/, trx
                            .selectFrom("supplierLocation")
                            .select(["supplierId", "id", "addressId"])
                            .where("supplierId", "in", entityIds)
                            .orderBy("id")
                            .execute()];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, trx
                        .selectFrom("customerLocation")
                        .select(["customerId", "id", "addressId"])
                        .where("customerId", "in", entityIds)
                        .orderBy("id")
                        .execute()];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    rows = _a;
                    map = new Map();
                    for (_i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                        row = rows_1[_i];
                        key = entityType === "supplier"
                            ? row.supplierId
                            : row.customerId;
                        if (!map.has(key))
                            map.set(key, row.addressId);
                    }
                    return [2 /*return*/, map];
            }
        });
    });
}
function writeSupplierExtensions(trx, supplierId, ext, companyId, userId, 
// Pre-fetched addressId of the supplier's existing primary location, if
// any. Caller bulk-loads these for the whole batch to avoid an N+1
// SELECT per supplier. undefined means "no existing location → insert".
existingAddressId) {
    return __awaiter(this, void 0, void 0, function () {
        var now, addressFields, inserted, partialUpdate_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = new Date().toISOString();
                    if (!hasAnyAddressField(ext)) return [3 /*break*/, 5];
                    addressFields = buildAddressFields(ext);
                    if (!existingAddressId) return [3 /*break*/, 2];
                    return [4 /*yield*/, trx
                            .updateTable("address")
                            .set(addressFields)
                            .where("id", "=", existingAddressId)
                            .execute()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 2: return [4 /*yield*/, trx
                        .insertInto("address")
                        .values(__assign(__assign({}, addressFields), { companyId: companyId }))
                        .returning(["id"])
                        .executeTakeFirst()];
                case 3:
                    inserted = _a.sent();
                    if (!(inserted === null || inserted === void 0 ? void 0 : inserted.id)) return [3 /*break*/, 5];
                    return [4 /*yield*/, trx
                            .insertInto("supplierLocation")
                            .values({
                            supplierId: supplierId,
                            addressId: inserted.id,
                            // supplierLocation.name is NOT NULL. Prefer the user's
                            // Location Name column; fall back to Address Line 1 so the row
                            // always has a recognizable label.
                            name: ext.locationName || ext.addressLine1,
                        })
                            .execute()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    if (!ext.paymentTermId) return [3 /*break*/, 7];
                    // The sync_create_supplier_entries interceptor creates the supplierPayment
                    // row on supplier INSERT; UPSERT here makes us resilient to edge cases
                    // where that row is somehow missing.
                    return [4 /*yield*/, trx
                            .insertInto("supplierPayment")
                            .values({
                            supplierId: supplierId,
                            paymentTermId: ext.paymentTermId,
                            companyId: companyId,
                            updatedAt: now,
                            updatedBy: userId,
                        })
                            .onConflict(function (oc) {
                            return oc.column("supplierId").doUpdateSet({
                                paymentTermId: ext.paymentTermId,
                                updatedAt: now,
                                updatedBy: userId,
                            });
                        })
                            .execute()];
                case 6:
                    // The sync_create_supplier_entries interceptor creates the supplierPayment
                    // row on supplier INSERT; UPSERT here makes us resilient to edge cases
                    // where that row is somehow missing.
                    _a.sent();
                    _a.label = 7;
                case 7:
                    if (!(ext.shippingMethodId || ext.incoterm || ext.incotermLocation)) return [3 /*break*/, 9];
                    partialUpdate_1 = __assign(__assign(__assign({}, (ext.shippingMethodId
                        ? { shippingMethodId: ext.shippingMethodId }
                        : {})), (ext.incoterm
                        ? {
                            incoterm: ext.incoterm,
                        }
                        : {})), (ext.incotermLocation
                        ? { incotermLocation: ext.incotermLocation }
                        : {}));
                    return [4 /*yield*/, trx
                            .insertInto("supplierShipping")
                            .values(__assign({ supplierId: supplierId, companyId: companyId, updatedAt: now, updatedBy: userId }, partialUpdate_1))
                            .onConflict(function (oc) {
                            return oc.column("supplierId").doUpdateSet(__assign({ updatedAt: now, updatedBy: userId }, partialUpdate_1));
                        })
                            .execute()];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
function writeCustomerExtensions(trx, customerId, ext, companyId, userId, existingAddressId) {
    return __awaiter(this, void 0, void 0, function () {
        var now, addressFields, inserted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = new Date().toISOString();
                    if (!hasAnyAddressField(ext)) return [3 /*break*/, 5];
                    addressFields = buildAddressFields(ext);
                    if (!existingAddressId) return [3 /*break*/, 2];
                    return [4 /*yield*/, trx
                            .updateTable("address")
                            .set(addressFields)
                            .where("id", "=", existingAddressId)
                            .execute()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 2: return [4 /*yield*/, trx
                        .insertInto("address")
                        .values(__assign(__assign({}, addressFields), { companyId: companyId }))
                        .returning(["id"])
                        .executeTakeFirst()];
                case 3:
                    inserted = _a.sent();
                    if (!(inserted === null || inserted === void 0 ? void 0 : inserted.id)) return [3 /*break*/, 5];
                    return [4 /*yield*/, trx
                            .insertInto("customerLocation")
                            .values({
                            customerId: customerId,
                            addressId: inserted.id,
                            // customerLocation.name is NOT NULL. Prefer the user's
                            // Location Name column; fall back to Address Line 1.
                            name: ext.locationName || ext.addressLine1,
                        })
                            .execute()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    if (!ext.paymentTermId) return [3 /*break*/, 7];
                    return [4 /*yield*/, trx
                            .insertInto("customerPayment")
                            .values({
                            customerId: customerId,
                            paymentTermId: ext.paymentTermId,
                            companyId: companyId,
                            updatedAt: now,
                            updatedBy: userId,
                        })
                            .onConflict(function (oc) {
                            return oc.column("customerId").doUpdateSet({
                                paymentTermId: ext.paymentTermId,
                                updatedAt: now,
                                updatedBy: userId,
                            });
                        })
                            .execute()];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
function writeSupplierPartLinks(trx, links, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var itemIds, supplierIds, existing, existingByPair, now, _i, links_1, link, key, existingId, numericMOQ, numericOrderMultiple, numericConversion, numericPrice;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (links.length === 0)
                        return [2 /*return*/];
                    itemIds = __spreadArray([], new Set(links.map(function (l) { return l.itemId; })), true);
                    supplierIds = __spreadArray([], new Set(links.map(function (l) { return l.supplierId; })), true);
                    return [4 /*yield*/, trx
                            .selectFrom("supplierPart")
                            .select(["id", "itemId", "supplierId"])
                            .where("itemId", "in", itemIds)
                            .where("supplierId", "in", supplierIds)
                            .where("companyId", "=", companyId)
                            .execute()];
                case 1:
                    existing = _a.sent();
                    existingByPair = new Map(existing.map(function (e) { return ["".concat(e.itemId, ":").concat(e.supplierId), e.id]; }));
                    now = new Date().toISOString();
                    _i = 0, links_1 = links;
                    _a.label = 2;
                case 2:
                    if (!(_i < links_1.length)) return [3 /*break*/, 7];
                    link = links_1[_i];
                    key = "".concat(link.itemId, ":").concat(link.supplierId);
                    existingId = existingByPair.get(key);
                    numericMOQ = link.minimumOrderQuantity
                        ? Number.parseInt(link.minimumOrderQuantity, 10)
                        : null;
                    numericOrderMultiple = link.orderMultiple
                        ? Number.parseInt(link.orderMultiple, 10)
                        : null;
                    numericConversion = link.conversionFactor
                        ? Number.parseFloat(link.conversionFactor)
                        : 1;
                    numericPrice = link.unitPrice
                        ? Number.parseFloat(link.unitPrice)
                        : null;
                    if (!existingId) return [3 /*break*/, 4];
                    return [4 /*yield*/, trx
                            .updateTable("supplierPart")
                            .set({
                            supplierPartId: link.supplierPartId || null,
                            supplierUnitOfMeasureCode: link.supplierUnitOfMeasureCode || null,
                            minimumOrderQuantity: numericMOQ,
                            orderMultiple: numericOrderMultiple,
                            conversionFactor: numericConversion,
                            unitPrice: numericPrice,
                            updatedAt: now,
                            updatedBy: userId,
                        })
                            .where("id", "=", existingId)
                            .execute()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, trx
                        .insertInto("supplierPart")
                        .values({
                        itemId: link.itemId,
                        supplierId: link.supplierId,
                        supplierPartId: link.supplierPartId || null,
                        supplierUnitOfMeasureCode: link.supplierUnitOfMeasureCode || null,
                        minimumOrderQuantity: numericMOQ,
                        orderMultiple: numericOrderMultiple,
                        conversionFactor: numericConversion,
                        unitPrice: numericPrice,
                        companyId: companyId,
                        createdBy: userId,
                    })
                        .execute()];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Set the item-level purchasing lead time (the "Purchasing" tab field).
// The itemReplenishment row is created by the create_item_related_records
// AFTER INSERT trigger on item (default leadTime 7, per migration
// 20250610000433_demand-planning.sql which renamed purchasingLeadTime →
// leadTime), so within this transaction the row already exists for every
// item we just upserted — we only need to UPDATE it.
function writeItemPurchasingLeadTimes(trx, entries, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var now, _i, entries_1, entry, numericLeadTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (entries.length === 0)
                        return [2 /*return*/];
                    now = new Date().toISOString();
                    _i = 0, entries_1 = entries;
                    _a.label = 1;
                case 1:
                    if (!(_i < entries_1.length)) return [3 /*break*/, 4];
                    entry = entries_1[_i];
                    numericLeadTime = Number.parseInt(entry.leadTime, 10);
                    if (Number.isNaN(numericLeadTime))
                        return [3 /*break*/, 3];
                    return [4 /*yield*/, trx
                            .updateTable("itemReplenishment")
                            .set({
                            leadTime: numericLeadTime,
                            updatedAt: now,
                            updatedBy: userId,
                        })
                            .where("itemId", "=", entry.itemId)
                            .where("companyId", "=", companyId)
                            .execute()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Set the item-level planning order multiple. itemPlanning has one row per
// (item, location) pair, all created by create_item_related_records at item
// insert time (SELECT FROM location WHERE companyId = ...). A single UPDATE
// scoped by itemId + companyId therefore covers every location row for that
// item — matching the "order multiple is unique across every location"
// expectation. Mirrors the same CSV value already written to
// supplierPart.orderMultiple in writeSupplierPartLinks; both are intentionally
// kept in sync at import time even though they're structurally distinct
// fields (supplier case-pack vs MRP preferred multiple).
function writeItemPlanningOrderMultiples(trx, entries, companyId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var now, _i, entries_2, entry, numericOrderMultiple;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (entries.length === 0)
                        return [2 /*return*/];
                    now = new Date().toISOString();
                    _i = 0, entries_2 = entries;
                    _a.label = 1;
                case 1:
                    if (!(_i < entries_2.length)) return [3 /*break*/, 4];
                    entry = entries_2[_i];
                    numericOrderMultiple = Number.parseInt(entry.orderMultiple, 10);
                    if (Number.isNaN(numericOrderMultiple) || numericOrderMultiple < 1)
                        return [3 /*break*/, 3];
                    return [4 /*yield*/, trx
                            .updateTable("itemPlanning")
                            .set({
                            orderMultiple: numericOrderMultiple,
                            updatedAt: now,
                            updatedBy: userId,
                        })
                            .where("itemId", "=", entry.itemId)
                            .where("companyId", "=", companyId)
                            .execute()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function upsertTaxIdentifiers(trx, table, records, cId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (records.length === 0)
                        return [2 /*return*/];
                    now = new Date().toISOString();
                    if (!(table === "customerTax")) return [3 /*break*/, 2];
                    return [4 /*yield*/, trx
                            .insertInto("customerTax")
                            .values(records.map(function (r) {
                            var _a;
                            return ({
                                customerId: r.entityId,
                                taxId: (_a = r.taxId) !== null && _a !== void 0 ? _a : null,
                                companyId: cId,
                                updatedAt: now,
                                updatedBy: userId,
                            });
                        }))
                            .onConflict(function (oc) {
                            return oc.column("customerId").doUpdateSet({
                                taxId: (0, npm_kysely_0_27_6_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["excluded.\"taxId\""], ["excluded.\"taxId\""]))),
                                updatedAt: now,
                                updatedBy: userId,
                            });
                        })
                            .execute()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2: return [4 /*yield*/, trx
                        .insertInto("supplierTax")
                        .values(records.map(function (r) {
                        var _a;
                        return ({
                            supplierId: r.entityId,
                            taxId: (_a = r.taxId) !== null && _a !== void 0 ? _a : null,
                            companyId: cId,
                            updatedAt: now,
                            updatedBy: userId,
                        });
                    }))
                        .onConflict(function (oc) {
                        return oc.column("supplierId").doUpdateSet({
                            taxId: (0, npm_kysely_0_27_6_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["excluded.\"taxId\""], ["excluded.\"taxId\""]))),
                            updatedAt: now,
                            updatedBy: userId,
                        });
                    })
                        .execute()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
(0, server_ts_1.serve)(function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, _a, table_1, filePath, columnMappings_1, _b, enumMappings_1, companyId_1, userId_1, client, csvFile, csvText, _c, _d, _e, parsedCsv, mappedRecords_1, missingEnumKeys_1, summary_1, _f, externalIdMap_1, csvNames, nameMap_1, customerIds_1, namesQueuedForInsert_1, externalIdMap_2, csvNames, nameMap_2, supplierIds_1, namesQueuedForInsert_2, getExternalId_1, externalIdMap_3, readableIds_1, externalContactIdMap_1, externalCustomerIdMap_1, externalContactIdMap_2, externalSupplierIdMap_1, externalIdMap_4, workCenterIds_1, externalIdMap_5, processIds_1, err_1;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0:
                if (req.method === "OPTIONS") {
                    return [2 /*return*/, new Response("ok", { headers: headers_ts_1.corsHeaders })];
                }
                return [4 /*yield*/, req.json()];
            case 1:
                payload = _g.sent();
                _g.label = 2;
            case 2:
                _g.trys.push([2, 34, , 35]);
                _a = importCsvValidator.parse(payload), table_1 = _a.table, filePath = _a.filePath, columnMappings_1 = _a.columnMappings, _b = _a.enumMappings, enumMappings_1 = _b === void 0 ? {} : _b, companyId_1 = _a.companyId, userId_1 = _a.userId;
                console.log({
                    function: "import-csv",
                    table: table_1,
                    filePath: filePath,
                    columnMappings: columnMappings_1,
                    enumMappings: enumMappings_1,
                    companyId: companyId_1,
                    userId: userId_1,
                });
                return [4 /*yield*/, (0, supabase_ts_1.requirePermissions)(req, companyId_1, userId_1, { create: "resources" })];
            case 3:
                client = _g.sent();
                return [4 /*yield*/, client.storage.from("private").download(filePath)];
            case 4:
                csvFile = _g.sent();
                if (!csvFile.data) {
                    throw new Error("Failed to download file");
                }
                _d = (_c = new TextDecoder()).decode;
                _e = Uint8Array.bind;
                return [4 /*yield*/, csvFile.data.arrayBuffer()];
            case 5:
                csvText = _d.apply(_c, [new (_e.apply(Uint8Array, [void 0, _g.sent()]))()]);
                parsedCsv = void 0;
                try {
                    parsedCsv = (0, csv_ts_1.parse)(csvText, {
                        skipFirstRow: true,
                        lazyQuotes: true,
                    });
                }
                catch (_strictErr) {
                    parsedCsv = parsePermissiveCsv(csvText);
                }
                mappedRecords_1 = parsedCsv.map(function (row) {
                    var record = {};
                    for (var _i = 0, _a = Object.entries(columnMappings_1); _i < _a.length; _i++) {
                        var _b = _a[_i], key = _b[0], value = _b[1];
                        if (key in enumMappings_1) {
                            var enumMapping = enumMappings_1[key];
                            var csvValue = row[value];
                            if (csvValue in enumMapping) {
                                record[key] = enumMapping[csvValue];
                            }
                            else {
                                record[key] = enumMapping["Default"];
                            }
                        }
                        else if (value && value !== "N/A") {
                            record[key] = row[value] || "";
                        }
                    }
                    return record;
                });
                missingEnumKeys_1 = Object.keys(enumMappings_1).filter(function (key) { return !(key in mappedRecords_1[0]); });
                if (missingEnumKeys_1.length > 0) {
                    mappedRecords_1 = mappedRecords_1.map(function (record) {
                        var processedRecord = __assign({}, record);
                        missingEnumKeys_1.forEach(function (key) {
                            processedRecord[key] = enumMappings_1[key]["Default"];
                        });
                        return processedRecord;
                    });
                }
                summary_1 = {
                    inserted: 0,
                    updated: 0,
                    errors: [],
                };
                _f = table_1;
                switch (_f) {
                    case "customer": return [3 /*break*/, 6];
                    case "supplier": return [3 /*break*/, 10];
                    case "material": return [3 /*break*/, 14];
                    case "consumable": return [3 /*break*/, 14];
                    case "tool": return [3 /*break*/, 14];
                    case "fixture": return [3 /*break*/, 14];
                    case "part": return [3 /*break*/, 14];
                    case "customerContact": return [3 /*break*/, 17];
                    case "supplierContact": return [3 /*break*/, 21];
                    case "workCenter": return [3 /*break*/, 25];
                    case "process": return [3 /*break*/, 28];
                    case "methodMaterial": return [3 /*break*/, 31];
                }
                return [3 /*break*/, 32];
            case 6: return [4 /*yield*/, getCsvExternalIdMap("customer", companyId_1)];
            case 7:
                externalIdMap_1 = _g.sent();
                csvNames = Array.from(new Set(mappedRecords_1
                    .map(function (r) { return r.name; })
                    .filter(function (n) { return typeof n === "string" && n !== ""; })));
                return [4 /*yield*/, getNameMap("customer", companyId_1, csvNames)];
            case 8:
                nameMap_1 = _g.sent();
                customerIds_1 = new Set();
                namesQueuedForInsert_1 = new Set();
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var customerInserts, customerTaxForInserts, csvIdsForInserts, customerUpdates, customerTaxUpdates, csvIdsForNameMatchedUpdates, extForInserts, extForUpdates, _i, _a, _b, rowIndex, record, ext, id, taxId, _ln, _a1, _a2, _city, _state, _pc, _cc, _pt, _sm, _ic, _icl, rest, matchedByCsvId, decision, inserted, i, _c, customerUpdates_1, update, customerAddressByEntity, _d, extForUpdates_1, _e, entityId, ext;
                        var _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    customerInserts = [];
                                    customerTaxForInserts = [];
                                    csvIdsForInserts = [];
                                    customerUpdates = [];
                                    customerTaxUpdates = [];
                                    csvIdsForNameMatchedUpdates = [];
                                    extForInserts = [];
                                    extForUpdates = [];
                                    for (_i = 0, _a = mappedRecords_1.entries(); _i < _a.length; _i++) {
                                        _b = _a[_i], rowIndex = _b[0], record = _b[1];
                                        ext = extractPartnerExtensions(record);
                                        id = record.id, taxId = record.taxId, _ln = record.locationName, _a1 = record.addressLine1, _a2 = record.addressLine2, _city = record.city, _state = record.state, _pc = record.postalCode, _cc = record.countryCode, _pt = record.paymentTermId, _sm = record.shippingMethodId, _ic = record.incoterm, _icl = record.incotermLocation, rest = __rest(record, ["id", "taxId", "locationName", "addressLine1", "addressLine2", "city", "state", "postalCode", "countryCode", "paymentTermId", "shippingMethodId", "incoterm", "incotermLocation"]);
                                        matchedByCsvId = id ? externalIdMap_1.get(id) : undefined;
                                        decision = (0, classify_import_row_ts_1.classifyImportRow)({
                                            id: id,
                                            name: rest.name,
                                            externalIdMap: externalIdMap_1,
                                            nameMap: nameMap_1,
                                            seenIds: customerIds_1,
                                            seenNames: namesQueuedForInsert_1,
                                        });
                                        if (decision.action === "skip") {
                                            summary_1.errors.push({ row: rowIndex, reason: decision.reason });
                                            continue;
                                        }
                                        if (id)
                                            customerIds_1.add(id);
                                        if (decision.action === "insert")
                                            namesQueuedForInsert_1.add(rest.name);
                                        if (decision.action === "update") {
                                            customerUpdates.push({
                                                id: decision.entityId,
                                                data: __assign(__assign({}, nullifyEmptyStrings(rest)), { updatedAt: new Date().toISOString(), updatedBy: userId_1 }),
                                            });
                                            customerTaxUpdates.push({ entityId: decision.entityId, taxId: taxId });
                                            extForUpdates.push({ entityId: decision.entityId, ext: ext });
                                            // Only attach a CSV->entity mapping when there is a real external id.
                                            if (matchedByCsvId === undefined && id) {
                                                csvIdsForNameMatchedUpdates.push({
                                                    entityId: decision.entityId,
                                                    externalId: id,
                                                });
                                            }
                                        }
                                        else {
                                            customerInserts.push(__assign(__assign({}, nullifyEmptyStrings(rest)), { readableId: id || null, companyId: companyId_1, createdAt: new Date().toISOString(), createdBy: userId_1 }));
                                            customerTaxForInserts.push({ taxId: taxId });
                                            csvIdsForInserts.push(id);
                                            extForInserts.push(ext);
                                        }
                                    }
                                    console.log({
                                        totalRecords: mappedRecords_1.length,
                                        customerInserts: customerInserts.length,
                                        customerUpdates: customerUpdates.length,
                                    });
                                    summary_1.inserted += customerInserts.length;
                                    summary_1.updated += customerUpdates.length;
                                    if (!(customerInserts.length > 0)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, trx
                                            .insertInto(table_1)
                                            .values(customerInserts)
                                            .returning(["id"])
                                            .execute()];
                                case 1:
                                    inserted = _g.sent();
                                    return [4 /*yield*/, upsertCsvMappings(trx, "customer", inserted.map(function (row, i) { return ({
                                            entityId: row.id,
                                            externalId: csvIdsForInserts[i],
                                        }); }), companyId_1, userId_1)];
                                case 2:
                                    _g.sent();
                                    return [4 /*yield*/, upsertTaxIdentifiers(trx, "customerTax", inserted.map(function (row, i) {
                                            var _a;
                                            return ({
                                                entityId: row.id,
                                                taxId: (_a = customerTaxForInserts[i]) === null || _a === void 0 ? void 0 : _a.taxId,
                                            });
                                        }), companyId_1, userId_1)];
                                case 3:
                                    _g.sent();
                                    i = 0;
                                    _g.label = 4;
                                case 4:
                                    if (!(i < inserted.length)) return [3 /*break*/, 7];
                                    // Newly-inserted customers can't have an existing location yet.
                                    return [4 /*yield*/, writeCustomerExtensions(trx, inserted[i].id, (_f = extForInserts[i]) !== null && _f !== void 0 ? _f : {}, companyId_1, userId_1, undefined)];
                                case 5:
                                    // Newly-inserted customers can't have an existing location yet.
                                    _g.sent();
                                    _g.label = 6;
                                case 6:
                                    i++;
                                    return [3 /*break*/, 4];
                                case 7:
                                    if (!(customerUpdates.length > 0)) return [3 /*break*/, 17];
                                    _c = 0, customerUpdates_1 = customerUpdates;
                                    _g.label = 8;
                                case 8:
                                    if (!(_c < customerUpdates_1.length)) return [3 /*break*/, 11];
                                    update = customerUpdates_1[_c];
                                    return [4 /*yield*/, trx
                                            .updateTable(table_1)
                                            .set(update.data)
                                            .where("id", "=", update.id)
                                            .execute()];
                                case 9:
                                    _g.sent();
                                    _g.label = 10;
                                case 10:
                                    _c++;
                                    return [3 /*break*/, 8];
                                case 11: return [4 /*yield*/, upsertTaxIdentifiers(trx, "customerTax", customerTaxUpdates, companyId_1, userId_1)];
                                case 12:
                                    _g.sent();
                                    return [4 /*yield*/, preloadPrimaryLocationAddressIds(trx, "customer", extForUpdates.map(function (u) { return u.entityId; }))];
                                case 13:
                                    customerAddressByEntity = _g.sent();
                                    _d = 0, extForUpdates_1 = extForUpdates;
                                    _g.label = 14;
                                case 14:
                                    if (!(_d < extForUpdates_1.length)) return [3 /*break*/, 17];
                                    _e = extForUpdates_1[_d], entityId = _e.entityId, ext = _e.ext;
                                    return [4 /*yield*/, writeCustomerExtensions(trx, entityId, ext, companyId_1, userId_1, customerAddressByEntity.get(entityId))];
                                case 15:
                                    _g.sent();
                                    _g.label = 16;
                                case 16:
                                    _d++;
                                    return [3 /*break*/, 14];
                                case 17:
                                    if (!(csvIdsForNameMatchedUpdates.length > 0)) return [3 /*break*/, 19];
                                    return [4 /*yield*/, upsertCsvMappings(trx, "customer", csvIdsForNameMatchedUpdates, companyId_1, userId_1)];
                                case 18:
                                    _g.sent();
                                    _g.label = 19;
                                case 19: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 9:
                _g.sent();
                return [3 /*break*/, 33];
            case 10: return [4 /*yield*/, getCsvExternalIdMap("supplier", companyId_1)];
            case 11:
                externalIdMap_2 = _g.sent();
                csvNames = Array.from(new Set(mappedRecords_1
                    .map(function (r) { return r.name; })
                    .filter(function (n) { return typeof n === "string" && n !== ""; })));
                return [4 /*yield*/, getNameMap("supplier", companyId_1, csvNames)];
            case 12:
                nameMap_2 = _g.sent();
                supplierIds_1 = new Set();
                namesQueuedForInsert_2 = new Set();
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var supplierInserts, supplierTaxForInserts, csvIdsForInserts, supplierUpdates, supplierTaxUpdates, csvIdsForNameMatchedUpdates, extForInserts, extForUpdates, _i, _a, _b, rowIndex, record, ext, id, taxId, _ln, _a1, _a2, _city, _state, _pc, _cc, _pt, _sm, _ic, _icl, rest, matchedByCsvId, decision, inserted, i, _c, supplierUpdates_1, update, supplierAddressByEntity, _d, extForUpdates_2, _e, entityId, ext;
                        var _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    supplierInserts = [];
                                    supplierTaxForInserts = [];
                                    csvIdsForInserts = [];
                                    supplierUpdates = [];
                                    supplierTaxUpdates = [];
                                    csvIdsForNameMatchedUpdates = [];
                                    extForInserts = [];
                                    extForUpdates = [];
                                    for (_i = 0, _a = mappedRecords_1.entries(); _i < _a.length; _i++) {
                                        _b = _a[_i], rowIndex = _b[0], record = _b[1];
                                        ext = extractPartnerExtensions(record);
                                        id = record.id, taxId = record.taxId, _ln = record.locationName, _a1 = record.addressLine1, _a2 = record.addressLine2, _city = record.city, _state = record.state, _pc = record.postalCode, _cc = record.countryCode, _pt = record.paymentTermId, _sm = record.shippingMethodId, _ic = record.incoterm, _icl = record.incotermLocation, rest = __rest(record, ["id", "taxId", "locationName", "addressLine1", "addressLine2", "city", "state", "postalCode", "countryCode", "paymentTermId", "shippingMethodId", "incoterm", "incotermLocation"]);
                                        matchedByCsvId = id ? externalIdMap_2.get(id) : undefined;
                                        decision = (0, classify_import_row_ts_1.classifyImportRow)({
                                            id: id,
                                            name: rest.name,
                                            externalIdMap: externalIdMap_2,
                                            nameMap: nameMap_2,
                                            seenIds: supplierIds_1,
                                            seenNames: namesQueuedForInsert_2,
                                        });
                                        if (decision.action === "skip") {
                                            summary_1.errors.push({ row: rowIndex, reason: decision.reason });
                                            continue;
                                        }
                                        if (id)
                                            supplierIds_1.add(id);
                                        if (decision.action === "insert")
                                            namesQueuedForInsert_2.add(rest.name);
                                        if (decision.action === "update") {
                                            supplierUpdates.push({
                                                id: decision.entityId,
                                                data: __assign(__assign({}, nullifyEmptyStrings(rest)), { updatedAt: new Date().toISOString(), updatedBy: userId_1 }),
                                            });
                                            supplierTaxUpdates.push({ entityId: decision.entityId, taxId: taxId });
                                            extForUpdates.push({ entityId: decision.entityId, ext: ext });
                                            // Only attach a CSV->entity mapping when there is a real external id.
                                            if (matchedByCsvId === undefined && id) {
                                                csvIdsForNameMatchedUpdates.push({
                                                    entityId: decision.entityId,
                                                    externalId: id,
                                                });
                                            }
                                        }
                                        else {
                                            supplierInserts.push(__assign(__assign({}, nullifyEmptyStrings(rest)), { readableId: id || null, companyId: companyId_1, createdAt: new Date().toISOString(), createdBy: userId_1 }));
                                            supplierTaxForInserts.push({ taxId: taxId });
                                            csvIdsForInserts.push(id);
                                            extForInserts.push(ext);
                                        }
                                    }
                                    console.log({
                                        totalRecords: mappedRecords_1.length,
                                        supplierInserts: supplierInserts.length,
                                        supplierUpdates: supplierUpdates.length,
                                    });
                                    summary_1.inserted += supplierInserts.length;
                                    summary_1.updated += supplierUpdates.length;
                                    if (!(supplierInserts.length > 0)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, trx
                                            .insertInto(table_1)
                                            .values(supplierInserts)
                                            .returning(["id"])
                                            .execute()];
                                case 1:
                                    inserted = _g.sent();
                                    return [4 /*yield*/, upsertCsvMappings(trx, "supplier", inserted.map(function (row, i) { return ({
                                            entityId: row.id,
                                            externalId: csvIdsForInserts[i],
                                        }); }), companyId_1, userId_1)];
                                case 2:
                                    _g.sent();
                                    return [4 /*yield*/, upsertTaxIdentifiers(trx, "supplierTax", inserted.map(function (row, i) {
                                            var _a;
                                            return ({
                                                entityId: row.id,
                                                taxId: (_a = supplierTaxForInserts[i]) === null || _a === void 0 ? void 0 : _a.taxId,
                                            });
                                        }), companyId_1, userId_1)];
                                case 3:
                                    _g.sent();
                                    i = 0;
                                    _g.label = 4;
                                case 4:
                                    if (!(i < inserted.length)) return [3 /*break*/, 7];
                                    // Newly-inserted suppliers can't have an existing location yet.
                                    return [4 /*yield*/, writeSupplierExtensions(trx, inserted[i].id, (_f = extForInserts[i]) !== null && _f !== void 0 ? _f : {}, companyId_1, userId_1, undefined)];
                                case 5:
                                    // Newly-inserted suppliers can't have an existing location yet.
                                    _g.sent();
                                    _g.label = 6;
                                case 6:
                                    i++;
                                    return [3 /*break*/, 4];
                                case 7:
                                    if (!(supplierUpdates.length > 0)) return [3 /*break*/, 17];
                                    _c = 0, supplierUpdates_1 = supplierUpdates;
                                    _g.label = 8;
                                case 8:
                                    if (!(_c < supplierUpdates_1.length)) return [3 /*break*/, 11];
                                    update = supplierUpdates_1[_c];
                                    return [4 /*yield*/, trx
                                            .updateTable(table_1)
                                            .set(update.data)
                                            .where("id", "=", update.id)
                                            .execute()];
                                case 9:
                                    _g.sent();
                                    _g.label = 10;
                                case 10:
                                    _c++;
                                    return [3 /*break*/, 8];
                                case 11: return [4 /*yield*/, upsertTaxIdentifiers(trx, "supplierTax", supplierTaxUpdates, companyId_1, userId_1)];
                                case 12:
                                    _g.sent();
                                    return [4 /*yield*/, preloadPrimaryLocationAddressIds(trx, "supplier", extForUpdates.map(function (u) { return u.entityId; }))];
                                case 13:
                                    supplierAddressByEntity = _g.sent();
                                    _d = 0, extForUpdates_2 = extForUpdates;
                                    _g.label = 14;
                                case 14:
                                    if (!(_d < extForUpdates_2.length)) return [3 /*break*/, 17];
                                    _e = extForUpdates_2[_d], entityId = _e.entityId, ext = _e.ext;
                                    return [4 /*yield*/, writeSupplierExtensions(trx, entityId, ext, companyId_1, userId_1, supplierAddressByEntity.get(entityId))];
                                case 15:
                                    _g.sent();
                                    _g.label = 16;
                                case 16:
                                    _d++;
                                    return [3 /*break*/, 14];
                                case 17:
                                    if (!(csvIdsForNameMatchedUpdates.length > 0)) return [3 /*break*/, 19];
                                    return [4 /*yield*/, upsertCsvMappings(trx, "supplier", csvIdsForNameMatchedUpdates, companyId_1, userId_1)];
                                case 18:
                                    _g.sent();
                                    _g.label = 19;
                                case 19: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 13:
                _g.sent();
                return [3 /*break*/, 33];
            case 14:
                getExternalId_1 = function (id) {
                    return "".concat(table_1, ":").concat(id);
                };
                return [4 /*yield*/, getCsvExternalIdMap("item", companyId_1)];
            case 15:
                externalIdMap_3 = _g.sent();
                readableIds_1 = new Set();
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var itemInserts, csvIdsForInserts, itemUpdates, materialPartialInserts, materialUpdates, supplierPartForInserts, supplierPartLinks, leadTimeForInserts, purchasingLeadTimes, orderMultipleForInserts, itemPlanningOrderMultiples, itemValidator, materialValidator, _i, mappedRecords_2, record, item, _a, id, rest, readableIdWithRevision, existingEntityId, material, newItem, material, insertedItems, specificInserts, materialInserts, i, sp, leadTime, orderMultiple, currentItems, currentReadableIdMap, _b, itemUpdates_1, update, _c, itemUpdates_2, update, oldReadableId, newReadableId, _d, materialUpdates_1, update;
                        var _e, _f, _g, _h, _j, _k, _l;
                        return __generator(this, function (_m) {
                            switch (_m.label) {
                                case 0:
                                    itemInserts = [];
                                    csvIdsForInserts = [];
                                    itemUpdates = [];
                                    materialPartialInserts = {};
                                    materialUpdates = [];
                                    supplierPartForInserts = [];
                                    supplierPartLinks = [];
                                    leadTimeForInserts = [];
                                    purchasingLeadTimes = [];
                                    orderMultipleForInserts = [];
                                    itemPlanningOrderMultiples = [];
                                    itemValidator = npm_zod__3_24_1_1.default.object({
                                        id: npm_zod__3_24_1_1.default.string(),
                                        readableId: npm_zod__3_24_1_1.default.string(),
                                        revision: npm_zod__3_24_1_1.default.string().optional(),
                                        name: npm_zod__3_24_1_1.default.string(),
                                        description: npm_zod__3_24_1_1.default.string().optional(),
                                        active: npm_zod__3_24_1_1.default.string().optional(),
                                        unitOfMeasureCode: npm_zod__3_24_1_1.default.string().optional(),
                                        replenishmentSystem: npm_zod__3_24_1_1.default
                                            .enum(["Buy", "Make", "Buy and Make"])
                                            .optional(),
                                        defaultMethodType: npm_zod__3_24_1_1.default.enum(["Purchase to Order", "Make to Order", "Pull from Inventory"]).optional(),
                                        itemTrackingType: npm_zod__3_24_1_1.default.enum([
                                            "Inventory",
                                            "Non-Inventory",
                                            "Serial",
                                            "Batch",
                                        ]),
                                    });
                                    materialValidator = itemValidator.extend({
                                        materialSubstanceId: npm_zod__3_24_1_1.default.string().optional(),
                                        materialFormId: npm_zod__3_24_1_1.default.string().optional(),
                                        finishId: npm_zod__3_24_1_1.default.string().optional(),
                                        dimensionId: npm_zod__3_24_1_1.default.string().optional(),
                                        gradeId: npm_zod__3_24_1_1.default.string().optional(),
                                    });
                                    for (_i = 0, mappedRecords_2 = mappedRecords_1; _i < mappedRecords_2.length; _i++) {
                                        record = mappedRecords_2[_i];
                                        item = itemValidator.safeParse(record);
                                        if (!item.success) {
                                            console.error(item.error.message);
                                            continue;
                                        }
                                        _a = item.data, id = _a.id, rest = __rest(_a, ["id"]);
                                        readableIdWithRevision = (0, utils_ts_1.getReadableIdWithRevision)(item.data.readableId, item.data.revision);
                                        if (externalIdMap_3.has(getExternalId_1(id)) &&
                                            !readableIds_1.has(readableIdWithRevision)) {
                                            existingEntityId = externalIdMap_3.get(getExternalId_1(id));
                                            readableIds_1.add(readableIdWithRevision);
                                            itemUpdates.push({
                                                id: existingEntityId,
                                                data: __assign(__assign({}, rest), { revision: (_e = rest.revision) !== null && _e !== void 0 ? _e : "0", active: (_g = ((_f = rest.active) === null || _f === void 0 ? void 0 : _f.toLowerCase()) !== "false") !== null && _g !== void 0 ? _g : true, unitOfMeasureCode: rest.unitOfMeasureCode || undefined, description: rest.description || undefined, replenishmentSystem: rest.replenishmentSystem || undefined, defaultMethodType: rest.defaultMethodType || undefined, updatedAt: new Date().toISOString(), updatedBy: userId_1 }),
                                            });
                                            // Existing item: we already know its id, so the supplierPart
                                            // link can be queued directly.
                                            if (record.supplierId) {
                                                supplierPartLinks.push({
                                                    itemId: existingEntityId,
                                                    supplierId: record.supplierId,
                                                    supplierPartId: record.supplierPartId,
                                                    supplierUnitOfMeasureCode: record.supplierUnitOfMeasureCode,
                                                    minimumOrderQuantity: record.minimumOrderQuantity,
                                                    orderMultiple: record.orderMultiple,
                                                    conversionFactor: record.conversionFactor,
                                                    unitPrice: record.unitPrice,
                                                });
                                            }
                                            if (record.leadTime) {
                                                purchasingLeadTimes.push({
                                                    itemId: existingEntityId,
                                                    leadTime: record.leadTime,
                                                });
                                            }
                                            if (record.orderMultiple) {
                                                itemPlanningOrderMultiples.push({
                                                    itemId: existingEntityId,
                                                    orderMultiple: record.orderMultiple,
                                                });
                                            }
                                            if (table_1 === "material") {
                                                material = materialValidator.safeParse(record);
                                                if (material.success) {
                                                    materialUpdates.push({
                                                        id: material.data.readableId,
                                                        data: {
                                                            materialSubstanceId: material.data.materialSubstanceId || undefined,
                                                            materialFormId: material.data.materialFormId || undefined,
                                                            dimensionId: material.data.dimensionId || undefined,
                                                            gradeId: material.data.gradeId || undefined,
                                                            finishId: material.data.finishId || undefined,
                                                            companyId: companyId_1,
                                                            updatedAt: new Date().toISOString(),
                                                            updatedBy: userId_1,
                                                        },
                                                    });
                                                }
                                            }
                                        }
                                        else if (!readableIds_1.has(readableIdWithRevision)) {
                                            readableIds_1.add(readableIdWithRevision);
                                            newItem = __assign(__assign({}, rest), { replenishmentSystem: (_h = rest.replenishmentSystem) !== null && _h !== void 0 ? _h : "Buy", active: (_k = ((_j = rest.active) === null || _j === void 0 ? void 0 : _j.toLowerCase()) !== "false") !== null && _k !== void 0 ? _k : true, unitOfMeasureCode: rest.unitOfMeasureCode || undefined, description: rest.description || undefined, defaultMethodType: rest.defaultMethodType || undefined, type: capitalize(table_1), companyId: companyId_1, revision: (_l = rest.revision) !== null && _l !== void 0 ? _l : "0", createdAt: new Date().toISOString(), createdBy: userId_1 });
                                            itemInserts.push(newItem);
                                            csvIdsForInserts.push(getExternalId_1(id));
                                            // New item: id will come back from the bulk insert. Capture
                                            // supplier-part data and lead time in parallel arrays so we can
                                            // build the link / lead-time entry once the id is known.
                                            supplierPartForInserts.push({
                                                supplierId: record.supplierId,
                                                supplierPartId: record.supplierPartId,
                                                supplierUnitOfMeasureCode: record.supplierUnitOfMeasureCode,
                                                minimumOrderQuantity: record.minimumOrderQuantity,
                                                orderMultiple: record.orderMultiple,
                                                conversionFactor: record.conversionFactor,
                                                unitPrice: record.unitPrice,
                                            });
                                            leadTimeForInserts.push(record.leadTime);
                                            orderMultipleForInserts.push(record.orderMultiple);
                                            if (table_1 === "material") {
                                                material = materialValidator.safeParse(record);
                                                if (!material.success) {
                                                    console.error(material.error.message);
                                                    continue;
                                                }
                                                if (material.success) {
                                                    materialPartialInserts[material.data.readableId] = __assign(__assign({}, material.data), { id: material.data.readableId, companyId: companyId_1, createdAt: new Date().toISOString(), createdBy: userId_1 });
                                                }
                                            }
                                        }
                                    }
                                    if (!(itemInserts.length > 0)) return [3 /*break*/, 7];
                                    return [4 /*yield*/, trx
                                            .insertInto("item")
                                            .values(itemInserts)
                                            .onConflict(function (oc) {
                                            return oc.constraint("item_unique").doUpdateSet({
                                                updatedAt: new Date().toISOString(),
                                                updatedBy: userId_1,
                                                name: (0, npm_kysely_0_27_6_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["EXCLUDED.\"name\""], ["EXCLUDED.\"name\""]))),
                                                description: (0, npm_kysely_0_27_6_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["EXCLUDED.\"description\""], ["EXCLUDED.\"description\""]))),
                                                active: (0, npm_kysely_0_27_6_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["EXCLUDED.\"active\""], ["EXCLUDED.\"active\""]))),
                                                unitOfMeasureCode: (0, npm_kysely_0_27_6_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["EXCLUDED.\"unitOfMeasureCode\""], ["EXCLUDED.\"unitOfMeasureCode\""]))),
                                                replenishmentSystem: (0, npm_kysely_0_27_6_1.sql)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["EXCLUDED.\"replenishmentSystem\""], ["EXCLUDED.\"replenishmentSystem\""]))),
                                                defaultMethodType: (0, npm_kysely_0_27_6_1.sql)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["EXCLUDED.\"defaultMethodType\""], ["EXCLUDED.\"defaultMethodType\""]))),
                                                itemTrackingType: (0, npm_kysely_0_27_6_1.sql)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["EXCLUDED.\"itemTrackingType\""], ["EXCLUDED.\"itemTrackingType\""]))),
                                            });
                                        })
                                            .returning(["id", "readableId"])
                                            .execute()];
                                case 1:
                                    insertedItems = _m.sent();
                                    return [4 /*yield*/, upsertCsvMappings(trx, "item", insertedItems.map(function (item, i) { return ({
                                            entityId: item.id,
                                            externalId: csvIdsForInserts[i],
                                        }); }), companyId_1, userId_1)];
                                case 2:
                                    _m.sent();
                                    if (!["part", "fixture", "tool", "consumable"].includes(table_1)) return [3 /*break*/, 4];
                                    specificInserts = insertedItems.map(function (item) { return ({
                                        id: item.readableId,
                                        approved: true,
                                        companyId: companyId_1,
                                        createdAt: new Date().toISOString(),
                                        createdBy: userId_1,
                                    }); });
                                    return [4 /*yield*/, trx
                                            .insertInto(table_1)
                                            .values(specificInserts)
                                            .execute()];
                                case 3:
                                    _m.sent();
                                    _m.label = 4;
                                case 4:
                                    if (!(table_1 === "material" &&
                                        Object.keys(materialPartialInserts).length > 0)) return [3 /*break*/, 6];
                                    materialInserts = insertedItems.reduce(function (acc, item) {
                                        var materialData = materialPartialInserts[item.readableId];
                                        if (materialData) {
                                            acc.push({
                                                id: item.readableId,
                                                materialSubstanceId: materialData.materialSubstanceId || undefined,
                                                materialFormId: materialData.materialFormId || undefined,
                                                dimensionId: materialData.dimensionId || undefined,
                                                gradeId: materialData.gradeId || undefined,
                                                finishId: materialData.finishId || undefined,
                                                companyId: companyId_1,
                                                createdAt: new Date().toISOString(),
                                                createdBy: userId_1,
                                            });
                                        }
                                        return acc;
                                    }, []);
                                    return [4 /*yield*/, trx
                                            .insertInto("material")
                                            .values(materialInserts)
                                            .execute()];
                                case 5:
                                    _m.sent();
                                    _m.label = 6;
                                case 6:
                                    // Build supplier-part links and lead-time entries for the items we
                                    // just inserted. supplierPartForInserts / leadTimeForInserts are
                                    // parallel to itemInserts; only rows with a supplier produce a
                                    // link, only rows with a lead time produce a lead-time entry.
                                    for (i = 0; i < insertedItems.length; i++) {
                                        sp = supplierPartForInserts[i];
                                        if ((sp === null || sp === void 0 ? void 0 : sp.supplierId) && insertedItems[i].id) {
                                            supplierPartLinks.push({
                                                itemId: insertedItems[i].id,
                                                supplierId: sp.supplierId,
                                                supplierPartId: sp.supplierPartId,
                                                supplierUnitOfMeasureCode: sp.supplierUnitOfMeasureCode,
                                                minimumOrderQuantity: sp.minimumOrderQuantity,
                                                orderMultiple: sp.orderMultiple,
                                                conversionFactor: sp.conversionFactor,
                                                unitPrice: sp.unitPrice,
                                            });
                                        }
                                        leadTime = leadTimeForInserts[i];
                                        if (leadTime && insertedItems[i].id) {
                                            purchasingLeadTimes.push({
                                                itemId: insertedItems[i].id,
                                                leadTime: leadTime,
                                            });
                                        }
                                        orderMultiple = orderMultipleForInserts[i];
                                        if (orderMultiple && insertedItems[i].id) {
                                            itemPlanningOrderMultiples.push({
                                                itemId: insertedItems[i].id,
                                                orderMultiple: orderMultiple,
                                            });
                                        }
                                    }
                                    _m.label = 7;
                                case 7:
                                    console.log({
                                        totalRecords: mappedRecords_1.length,
                                        itemInserts: itemInserts.length,
                                        itemUpdates: itemUpdates.length,
                                        materialInserts: Object.keys(materialPartialInserts).length,
                                        materialUpdates: materialUpdates.length,
                                    });
                                    if (!(itemUpdates.length > 0)) return [3 /*break*/, 20];
                                    return [4 /*yield*/, trx
                                            .selectFrom("item")
                                            .select(["id", "readableId"])
                                            .where("id", "in", itemUpdates.map(function (u) { return u.id; }))
                                            .execute()];
                                case 8:
                                    currentItems = _m.sent();
                                    currentReadableIdMap = new Map(currentItems.map(function (i) { return [i.id, i.readableId]; }));
                                    _b = 0, itemUpdates_1 = itemUpdates;
                                    _m.label = 9;
                                case 9:
                                    if (!(_b < itemUpdates_1.length)) return [3 /*break*/, 12];
                                    update = itemUpdates_1[_b];
                                    return [4 /*yield*/, trx
                                            .updateTable("item")
                                            .set(update.data)
                                            .where("id", "=", update.id)
                                            .execute()];
                                case 10:
                                    _m.sent();
                                    _m.label = 11;
                                case 11:
                                    _b++;
                                    return [3 /*break*/, 9];
                                case 12:
                                    _c = 0, itemUpdates_2 = itemUpdates;
                                    _m.label = 13;
                                case 13:
                                    if (!(_c < itemUpdates_2.length)) return [3 /*break*/, 16];
                                    update = itemUpdates_2[_c];
                                    oldReadableId = currentReadableIdMap.get(update.id);
                                    newReadableId = update.data.readableId;
                                    if (!(newReadableId &&
                                        oldReadableId &&
                                        oldReadableId !== newReadableId)) return [3 /*break*/, 15];
                                    return [4 /*yield*/, trx
                                            .updateTable(table_1)
                                            .set({ id: newReadableId })
                                            .where("id", "=", oldReadableId)
                                            .where("companyId", "=", companyId_1)
                                            .execute()];
                                case 14:
                                    _m.sent();
                                    _m.label = 15;
                                case 15:
                                    _c++;
                                    return [3 /*break*/, 13];
                                case 16:
                                    if (!(materialUpdates.length > 0)) return [3 /*break*/, 20];
                                    _d = 0, materialUpdates_1 = materialUpdates;
                                    _m.label = 17;
                                case 17:
                                    if (!(_d < materialUpdates_1.length)) return [3 /*break*/, 20];
                                    update = materialUpdates_1[_d];
                                    return [4 /*yield*/, trx
                                            .updateTable("material")
                                            .set(update.data)
                                            .where("id", "=", update.id)
                                            .execute()];
                                case 18:
                                    _m.sent();
                                    _m.label = 19;
                                case 19:
                                    _d++;
                                    return [3 /*break*/, 17];
                                case 20: return [4 /*yield*/, writeSupplierPartLinks(trx, supplierPartLinks, companyId_1, userId_1)];
                                case 21:
                                    _m.sent();
                                    return [4 /*yield*/, writeItemPurchasingLeadTimes(trx, purchasingLeadTimes, companyId_1, userId_1)];
                                case 22:
                                    _m.sent();
                                    return [4 /*yield*/, writeItemPlanningOrderMultiples(trx, itemPlanningOrderMultiples, companyId_1, userId_1)];
                                case 23:
                                    _m.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 16:
                _g.sent();
                return [3 /*break*/, 33];
            case 17: return [4 /*yield*/, getCsvExternalIdMap("contact", companyId_1)];
            case 18:
                externalContactIdMap_1 = _g.sent();
                return [4 /*yield*/, getCsvExternalIdMap("customer", companyId_1)];
            case 19:
                externalCustomerIdMap_1 = _g.sent();
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var contactInserts, csvIdsForContactInserts, contactUpdates, customerContactInserts, isContactValid, _i, _a, _b, rowIndex, record, id, customerId, contactData, existingEntityId, existingCustomerId, contactId, newContact, inserted, _c, contactUpdates_1, update;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    contactInserts = [];
                                    csvIdsForContactInserts = [];
                                    contactUpdates = [];
                                    customerContactInserts = [];
                                    isContactValid = function (record) {
                                        return (typeof record.email === "string" && record.email.trim() !== "");
                                    };
                                    for (_i = 0, _a = mappedRecords_1.entries(); _i < _a.length; _i++) {
                                        _b = _a[_i], rowIndex = _b[0], record = _b[1];
                                        id = record.id, customerId = record.companyId, contactData = __rest(record, ["id", "companyId"]);
                                        if (externalContactIdMap_1.has(id)) {
                                            existingEntityId = externalContactIdMap_1.get(id);
                                            if (isContactValid(contactData)) {
                                                contactUpdates.push({
                                                    id: existingEntityId,
                                                    data: __assign({}, contactData),
                                                });
                                            }
                                        }
                                        else if (isContactValid(contactData) &&
                                            externalCustomerIdMap_1.has(customerId)) {
                                            existingCustomerId = externalCustomerIdMap_1.get(customerId);
                                            contactId = (0, mod_ts_1.nanoid)();
                                            newContact = __assign(__assign({ id: contactId }, contactData), { companyId: companyId_1 });
                                            contactInserts.push(newContact);
                                            csvIdsForContactInserts.push(id);
                                            customerContactInserts.push({
                                                contactId: contactId,
                                                customerId: existingCustomerId,
                                                customFields: {},
                                            });
                                        }
                                        else {
                                            summary_1.errors.push({
                                                row: rowIndex,
                                                reason: isContactValid(contactData)
                                                    ? "No customer found for External Company ID \"".concat(customerId, "\"")
                                                    : "Invalid contact (missing required fields)",
                                            });
                                        }
                                    }
                                    summary_1.inserted += contactInserts.length;
                                    summary_1.updated += contactUpdates.length;
                                    console.log({
                                        totalRecords: mappedRecords_1.length,
                                        contactInserts: contactInserts.length,
                                        contactUpdates: contactUpdates.length,
                                        customerContactInserts: customerContactInserts.length,
                                    });
                                    if (!(contactInserts.length > 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, trx
                                            .insertInto("contact")
                                            .values(contactInserts)
                                            .returning(["id"])
                                            .execute()];
                                case 1:
                                    inserted = _d.sent();
                                    return [4 /*yield*/, upsertCsvMappings(trx, "contact", inserted.map(function (row, i) { return ({
                                            entityId: row.id,
                                            externalId: csvIdsForContactInserts[i],
                                        }); }), companyId_1, userId_1)];
                                case 2:
                                    _d.sent();
                                    _d.label = 3;
                                case 3:
                                    if (!(contactUpdates.length > 0)) return [3 /*break*/, 7];
                                    _c = 0, contactUpdates_1 = contactUpdates;
                                    _d.label = 4;
                                case 4:
                                    if (!(_c < contactUpdates_1.length)) return [3 /*break*/, 7];
                                    update = contactUpdates_1[_c];
                                    return [4 /*yield*/, trx
                                            .updateTable("contact")
                                            .set(update.data)
                                            .where("id", "=", update.id)
                                            .execute()];
                                case 5:
                                    _d.sent();
                                    _d.label = 6;
                                case 6:
                                    _c++;
                                    return [3 /*break*/, 4];
                                case 7:
                                    if (!(customerContactInserts.length > 0)) return [3 /*break*/, 9];
                                    return [4 /*yield*/, trx
                                            .insertInto("customerContact")
                                            .values(customerContactInserts)
                                            .execute()];
                                case 8:
                                    _d.sent();
                                    _d.label = 9;
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 20:
                _g.sent();
                return [3 /*break*/, 33];
            case 21: return [4 /*yield*/, getCsvExternalIdMap("contact", companyId_1)];
            case 22:
                externalContactIdMap_2 = _g.sent();
                return [4 /*yield*/, getCsvExternalIdMap("supplier", companyId_1)];
            case 23:
                externalSupplierIdMap_1 = _g.sent();
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var contactInserts, csvIdsForContactInserts, contactUpdates, supplierContactInserts, isContactValid, _i, _a, _b, rowIndex, record, id, supplierId, contactData, existingEntityId, existingSupplierId, contactId, newContact, inserted, _c, contactUpdates_2, update;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    contactInserts = [];
                                    csvIdsForContactInserts = [];
                                    contactUpdates = [];
                                    supplierContactInserts = [];
                                    isContactValid = function (record) {
                                        return (typeof record.email === "string" && record.email.trim() !== "");
                                    };
                                    for (_i = 0, _a = mappedRecords_1.entries(); _i < _a.length; _i++) {
                                        _b = _a[_i], rowIndex = _b[0], record = _b[1];
                                        id = record.id, supplierId = record.companyId, contactData = __rest(record, ["id", "companyId"]);
                                        if (externalContactIdMap_2.has(id)) {
                                            existingEntityId = externalContactIdMap_2.get(id);
                                            if (isContactValid(contactData)) {
                                                contactUpdates.push({
                                                    id: existingEntityId,
                                                    data: __assign({}, contactData),
                                                });
                                            }
                                        }
                                        else if (isContactValid(contactData) &&
                                            externalSupplierIdMap_1.has(supplierId)) {
                                            existingSupplierId = externalSupplierIdMap_1.get(supplierId);
                                            contactId = (0, mod_ts_1.nanoid)();
                                            newContact = __assign(__assign({ id: contactId }, contactData), { companyId: companyId_1 });
                                            contactInserts.push(newContact);
                                            csvIdsForContactInserts.push(id);
                                            supplierContactInserts.push({
                                                contactId: contactId,
                                                supplierId: existingSupplierId,
                                                customFields: {},
                                            });
                                        }
                                        else {
                                            summary_1.errors.push({
                                                row: rowIndex,
                                                reason: isContactValid(contactData)
                                                    ? "No supplier found for External Company ID \"".concat(supplierId, "\"")
                                                    : "Invalid contact (missing required fields)",
                                            });
                                        }
                                    }
                                    summary_1.inserted += contactInserts.length;
                                    summary_1.updated += contactUpdates.length;
                                    console.log({
                                        totalRecords: mappedRecords_1.length,
                                        contactInserts: contactInserts.length,
                                        contactUpdates: contactUpdates.length,
                                        supplierContactInserts: supplierContactInserts.length,
                                    });
                                    if (!(contactInserts.length > 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, trx
                                            .insertInto("contact")
                                            .values(contactInserts)
                                            .returning(["id"])
                                            .execute()];
                                case 1:
                                    inserted = _d.sent();
                                    return [4 /*yield*/, upsertCsvMappings(trx, "contact", inserted.map(function (row, i) { return ({
                                            entityId: row.id,
                                            externalId: csvIdsForContactInserts[i],
                                        }); }), companyId_1, userId_1)];
                                case 2:
                                    _d.sent();
                                    _d.label = 3;
                                case 3:
                                    if (!(contactUpdates.length > 0)) return [3 /*break*/, 7];
                                    _c = 0, contactUpdates_2 = contactUpdates;
                                    _d.label = 4;
                                case 4:
                                    if (!(_c < contactUpdates_2.length)) return [3 /*break*/, 7];
                                    update = contactUpdates_2[_c];
                                    return [4 /*yield*/, trx
                                            .updateTable("contact")
                                            .set(update.data)
                                            .where("id", "=", update.id)
                                            .execute()];
                                case 5:
                                    _d.sent();
                                    _d.label = 6;
                                case 6:
                                    _c++;
                                    return [3 /*break*/, 4];
                                case 7:
                                    if (!(supplierContactInserts.length > 0)) return [3 /*break*/, 9];
                                    return [4 /*yield*/, trx
                                            .insertInto("supplierContact")
                                            .values(supplierContactInserts)
                                            .execute()];
                                case 8:
                                    _d.sent();
                                    _d.label = 9;
                                case 9: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 24:
                _g.sent();
                return [3 /*break*/, 33];
            case 25: return [4 /*yield*/, getCsvExternalIdMap("workCenter", companyId_1)];
            case 26:
                externalIdMap_4 = _g.sent();
                workCenterIds_1 = new Set();
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var workCenterInserts, csvIdsForInserts, workCenterUpdates, isWorkCenterValid, _i, mappedRecords_3, record, id, rest, existingEntityId, inserted, _a, workCenterUpdates_1, update;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    workCenterInserts = [];
                                    csvIdsForInserts = [];
                                    workCenterUpdates = [];
                                    isWorkCenterValid = function (record) {
                                        return (typeof record.name === "string" &&
                                            record.name.trim() !== "" &&
                                            typeof record.locationId === "string" &&
                                            record.locationId.trim() !== "");
                                    };
                                    for (_i = 0, mappedRecords_3 = mappedRecords_1; _i < mappedRecords_3.length; _i++) {
                                        record = mappedRecords_3[_i];
                                        id = record.id, rest = __rest(record, ["id"]);
                                        if (externalIdMap_4.has(id)) {
                                            existingEntityId = externalIdMap_4.get(id);
                                            if (isWorkCenterValid(rest) && !workCenterIds_1.has(id)) {
                                                workCenterIds_1.add(id);
                                                workCenterUpdates.push({
                                                    id: existingEntityId,
                                                    data: __assign(__assign({}, rest), { laborRate: rest.laborRate ? parseFloat(rest.laborRate) : 0, machineRate: rest.machineRate
                                                            ? parseFloat(rest.machineRate)
                                                            : 0, overheadRate: rest.overheadRate
                                                            ? parseFloat(rest.overheadRate)
                                                            : 0, updatedAt: new Date().toISOString(), updatedBy: userId_1 }),
                                                });
                                            }
                                        }
                                        else if (isWorkCenterValid(rest) && !workCenterIds_1.has(id)) {
                                            workCenterIds_1.add(id);
                                            workCenterInserts.push(__assign(__assign({}, rest), { laborRate: rest.laborRate ? parseFloat(rest.laborRate) : 0, machineRate: rest.machineRate
                                                    ? parseFloat(rest.machineRate)
                                                    : 0, overheadRate: rest.overheadRate
                                                    ? parseFloat(rest.overheadRate)
                                                    : 0, companyId: companyId_1, createdAt: new Date().toISOString(), createdBy: userId_1 }));
                                            csvIdsForInserts.push(id);
                                        }
                                    }
                                    console.log({
                                        totalRecords: mappedRecords_1.length,
                                        workCenterInserts: workCenterInserts.length,
                                        workCenterUpdates: workCenterUpdates.length,
                                    });
                                    if (!(workCenterInserts.length > 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, trx
                                            .insertInto("workCenter")
                                            .values(workCenterInserts)
                                            .returning(["id"])
                                            .execute()];
                                case 1:
                                    inserted = _b.sent();
                                    return [4 /*yield*/, upsertCsvMappings(trx, "workCenter", inserted.map(function (row, i) { return ({
                                            entityId: row.id,
                                            externalId: csvIdsForInserts[i],
                                        }); }), companyId_1, userId_1)];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3:
                                    if (!(workCenterUpdates.length > 0)) return [3 /*break*/, 7];
                                    _a = 0, workCenterUpdates_1 = workCenterUpdates;
                                    _b.label = 4;
                                case 4:
                                    if (!(_a < workCenterUpdates_1.length)) return [3 /*break*/, 7];
                                    update = workCenterUpdates_1[_a];
                                    return [4 /*yield*/, trx
                                            .updateTable("workCenter")
                                            .set(update.data)
                                            .where("id", "=", update.id)
                                            .execute()];
                                case 5:
                                    _b.sent();
                                    _b.label = 6;
                                case 6:
                                    _a++;
                                    return [3 /*break*/, 4];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 27:
                _g.sent();
                return [3 /*break*/, 33];
            case 28: return [4 /*yield*/, getCsvExternalIdMap("process", companyId_1)];
            case 29:
                externalIdMap_5 = _g.sent();
                processIds_1 = new Set();
                return [4 /*yield*/, db.transaction().execute(function (trx) { return __awaiter(void 0, void 0, void 0, function () {
                        var processInserts, csvIdsForInserts, processUpdates, isProcessValid, _i, mappedRecords_4, record, id, rest, existingEntityId, inserted, _a, processUpdates_1, update;
                        var _b, _c, _d, _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    processInserts = [];
                                    csvIdsForInserts = [];
                                    processUpdates = [];
                                    isProcessValid = function (record) {
                                        return (typeof record.name === "string" &&
                                            record.name.trim() !== "" &&
                                            typeof record.processType === "string" &&
                                            (record.processType === "Inside" ||
                                                record.processType === "Outside"));
                                    };
                                    for (_i = 0, mappedRecords_4 = mappedRecords_1; _i < mappedRecords_4.length; _i++) {
                                        record = mappedRecords_4[_i];
                                        id = record.id, rest = __rest(record, ["id"]);
                                        if (externalIdMap_5.has(id)) {
                                            existingEntityId = externalIdMap_5.get(id);
                                            if (isProcessValid(rest) && !processIds_1.has(id)) {
                                                processIds_1.add(id);
                                                processUpdates.push({
                                                    id: existingEntityId,
                                                    data: __assign(__assign({}, rest), { completeAllOnScan: (_c = ((_b = rest.completeAllOnScan) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === "true") !== null && _c !== void 0 ? _c : false, updatedAt: new Date().toISOString(), updatedBy: userId_1 }),
                                                });
                                            }
                                        }
                                        else if (isProcessValid(rest) && !processIds_1.has(id)) {
                                            processIds_1.add(id);
                                            processInserts.push(__assign(__assign({}, rest), { completeAllOnScan: (_e = ((_d = rest.completeAllOnScan) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === "true") !== null && _e !== void 0 ? _e : false, companyId: companyId_1, createdAt: new Date().toISOString(), createdBy: userId_1 }));
                                            csvIdsForInserts.push(id);
                                        }
                                    }
                                    console.log({
                                        totalRecords: mappedRecords_1.length,
                                        processInserts: processInserts.length,
                                        processUpdates: processUpdates.length,
                                    });
                                    if (!(processInserts.length > 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, trx
                                            .insertInto("process")
                                            .values(processInserts)
                                            .returning(["id"])
                                            .execute()];
                                case 1:
                                    inserted = _f.sent();
                                    return [4 /*yield*/, upsertCsvMappings(trx, "process", inserted.map(function (row, i) { return ({
                                            entityId: row.id,
                                            externalId: csvIdsForInserts[i],
                                        }); }), companyId_1, userId_1)];
                                case 2:
                                    _f.sent();
                                    _f.label = 3;
                                case 3:
                                    if (!(processUpdates.length > 0)) return [3 /*break*/, 7];
                                    _a = 0, processUpdates_1 = processUpdates;
                                    _f.label = 4;
                                case 4:
                                    if (!(_a < processUpdates_1.length)) return [3 /*break*/, 7];
                                    update = processUpdates_1[_a];
                                    return [4 /*yield*/, trx
                                            .updateTable("process")
                                            .set(update.data)
                                            .where("id", "=", update.id)
                                            .execute()];
                                case 5:
                                    _f.sent();
                                    _f.label = 6;
                                case 6:
                                    _a++;
                                    return [3 /*break*/, 4];
                                case 7: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 30:
                _g.sent();
                return [3 /*break*/, 33];
            case 31:
                {
                    throw new Error("Not implemented");
                }
                _g.label = 32;
            case 32:
                {
                    throw new Error("Invalid table: ".concat(table_1));
                }
                _g.label = 33;
            case 33: return [2 /*return*/, new Response(JSON.stringify({
                    success: true,
                    inserted: summary_1.inserted,
                    updated: summary_1.updated,
                    skipped: summary_1.errors.length,
                    errors: summary_1.errors,
                }), {
                    headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                    status: 200,
                })];
            case 34:
                err_1 = _g.sent();
                console.error(err_1);
                return [2 /*return*/, new Response(JSON.stringify(err_1), {
                        headers: __assign(__assign({}, headers_ts_1.corsHeaders), { "Content-Type": "application/json" }),
                        status: 500,
                    })];
            case 35: return [2 /*return*/];
        }
    });
}); });
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
