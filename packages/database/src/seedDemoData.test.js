"use strict";
/**
 * Integration test for seedDemoData.
 *
 * Requires a live Postgres connection. Set SEED_TEST_DATABASE_URL to a
 * database that has the Carbon schema applied.  Also requires:
 *   SEED_TEST_COMPANY_ID  — an existing company row
 *   SEED_TEST_USER_ID     — a user that belongs to that company
 *   SEED_TEST_LOCATION_ID — a location that belongs to that company
 *
 * The test cleans all company-scoped rows before and after running the seed,
 * so it is safe to point it at the dev / staging DB as long as the IDs belong
 * to a dedicated test / demo company.
 *
 * Run:  DATABASE_URL=... SEED_TEST_COMPANY_ID=... ... vitest run src/seedDemoData.test.ts
 */
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
var pg_1 = require("pg");
var vitest_1 = require("vitest");
var seedDemoData_1 = require("./seedDemoData");
var DATABASE_URL = process.env.SEED_TEST_DATABASE_URL;
var COMPANY_ID = process.env.SEED_TEST_COMPANY_ID;
var USER_ID = process.env.SEED_TEST_USER_ID;
var LOCATION_ID = process.env.SEED_TEST_LOCATION_ID;
var configured = Boolean(DATABASE_URL) &&
    Boolean(COMPANY_ID) &&
    Boolean(USER_ID) &&
    Boolean(LOCATION_ID);
vitest_1.describe.skipIf(!configured)("seedDemoData integration", function () {
    var pool;
    var client;
    // seedDemoData uses SELECT-first patterns throughout, so it is safe to run on
    // an already-seeded company without any pre-cleanup. The seed will reuse existing
    // rows or skip inserts via ON CONFLICT. Infrastructure tables (unitOfMeasure,
    // sequence, location, warehouse, group, etc.) created by seed_company() must
    // remain intact — do not delete them.
    // No pre-cleanup needed; the test just verifies the idempotent seed produces
    // correct results.
    (0, vitest_1.beforeAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pool = new pg_1.default.Pool({ connectionString: DATABASE_URL });
                    return [4 /*yield*/, pool.connect()];
                case 1:
                    client = _a.sent();
                    return [4 /*yield*/, (0, seedDemoData_1.seedDemoData)(client, {
                            companyId: COMPANY_ID,
                            userId: USER_ID,
                            locationId: LOCATION_ID,
                            language: "en"
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 180000);
    (0, vitest_1.afterAll)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client.release();
                    return [4 /*yield*/, pool.end()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 10000);
    // ── Items ────────────────────────────────────────────────────────────────
    (0, vitest_1.it)("creates ERP part-type items", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.query("SELECT \"readableId\" FROM item WHERE \"companyId\" = $1 AND type = 'Part'", [COMPANY_ID])];
                case 1:
                    res = _a.sent();
                    ids = res.rows.map(function (r) { return r["readableId"]; });
                    (0, vitest_1.expect)(ids).toContain("TSHIRT-001");
                    (0, vitest_1.expect)(ids).toContain("JACKET-001");
                    (0, vitest_1.expect)(ids).toContain("BEARING-6205");
                    (0, vitest_1.expect)(ids).toContain("BRACKET-001");
                    (0, vitest_1.expect)(ids).toContain("SHAFT-ASM-001");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("creates part records for every Part-type item", function () { return __awaiter(void 0, void 0, void 0, function () {
        var items, parts, partIds, _i, _a, readableId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.query("SELECT \"readableId\" FROM item WHERE \"companyId\" = $1 AND type = 'Part'", [COMPANY_ID])];
                case 1:
                    items = _b.sent();
                    return [4 /*yield*/, client.query("SELECT id FROM part WHERE \"companyId\" = $1", [COMPANY_ID])];
                case 2:
                    parts = _b.sent();
                    partIds = new Set(parts.rows.map(function (r) { return r.id; }));
                    for (_i = 0, _a = items.rows; _i < _a.length; _i++) {
                        readableId = _a[_i].readableId;
                        (0, vitest_1.expect)(partIds.has(readableId), "part missing for item ".concat(readableId)).toBe(true);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    // ── Jobs ─────────────────────────────────────────────────────────────────
    (0, vitest_1.it)("creates jobs with operations", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.query("SELECT COUNT(*) FROM \"jobOperation\" jo\n       JOIN job j ON j.id = jo.\"jobId\"\n       WHERE j.\"companyId\" = $1", [COMPANY_ID])];
                case 1:
                    res = _b.sent();
                    (0, vitest_1.expect)(Number((_a = res.rows[0]) === null || _a === void 0 ? void 0 : _a.count)).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("every operation with production has at least one pickup", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, _i, _a, row;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.query("SELECT\n         jo.id AS op_id,\n         COUNT(DISTINCT pq.id) AS prod,\n         COUNT(DISTINCT jop.id) AS pickups\n       FROM \"jobOperation\" jo\n       JOIN job j ON j.id = jo.\"jobId\"\n       LEFT JOIN \"productionQuantity\" pq ON pq.\"jobOperationId\" = jo.id\n       LEFT JOIN \"jobOperationPickup\" jop ON jop.\"jobOperationId\" = jo.id\n       WHERE j.\"companyId\" = $1\n       GROUP BY jo.id\n       HAVING COUNT(DISTINCT pq.id) > 0", [COMPANY_ID])];
                case 1:
                    res = _b.sent();
                    for (_i = 0, _a = res.rows; _i < _a.length; _i++) {
                        row = _a[_i];
                        (0, vitest_1.expect)(Number(row.pickups), "operation ".concat(row.op_id, " has ").concat(row.prod, " production records but no pickups")).toBeGreaterThan(0);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("per-config-param pickup >= production for configurable items", function () { return __awaiter(void 0, void 0, void 0, function () {
        function sumConfig(rows, opId) {
            var _a, _b, _c;
            var totals = {};
            for (var _i = 0, _d = rows.filter(function (x) { return x.op_id === opId; }); _i < _d.length; _i++) {
                var r = _d[_i];
                var config = typeof r.configuration === "string"
                    ? JSON.parse(r.configuration)
                    : r.configuration;
                for (var _e = 0, _f = (_a = config === null || config === void 0 ? void 0 : config.configTable) !== null && _a !== void 0 ? _a : []; _e < _f.length; _e++) {
                    var tableRow = _f[_e];
                    for (var _g = 0, _h = Object.entries(tableRow); _g < _h.length; _g++) {
                        var _j = _h[_g], key = _j[0], val = _j[1];
                        if (key === "color" || key === "configTablePrimaryKeys")
                            continue;
                        var k = "".concat(key, "|").concat((_b = tableRow.color) !== null && _b !== void 0 ? _b : "");
                        totals[k] = ((_c = totals[k]) !== null && _c !== void 0 ? _c : 0) + Number(val);
                    }
                }
            }
            return totals;
        }
        var pickups, productions, prodOpIds, _loop_1, _i, prodOpIds_1, opId;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    return [4 /*yield*/, client.query("SELECT jo.id AS op_id, jo.description, jop.configuration, jop.quantity AS qty, 'pickup' AS type\n       FROM \"jobOperationPickup\" jop\n       JOIN \"jobOperation\" jo ON jo.id = jop.\"jobOperationId\"\n       JOIN job j ON j.id = jo.\"jobId\"\n       WHERE j.\"companyId\" = $1 AND jop.configuration IS NOT NULL", [COMPANY_ID])];
                case 1:
                    pickups = _d.sent();
                    return [4 /*yield*/, client.query("SELECT jo.id AS op_id, jo.description, pq.configuration, pq.quantity AS qty, 'production' AS type\n       FROM \"productionQuantity\" pq\n       JOIN \"jobOperation\" jo ON jo.id = pq.\"jobOperationId\"\n       JOIN job j ON j.id = jo.\"jobId\"\n       WHERE j.\"companyId\" = $1 AND pq.configuration IS NOT NULL", [COMPANY_ID])];
                case 2:
                    productions = _d.sent();
                    prodOpIds = __spreadArray([], new Set(productions.rows.map(function (r) { return r.op_id; })), true);
                    _loop_1 = function (opId) {
                        var pickupTotals = sumConfig(pickups.rows, opId);
                        var prodTotals = sumConfig(productions.rows, opId);
                        var desc = (_b = (_a = productions.rows.find(function (r) { return r.op_id === opId; })) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : opId;
                        for (var _e = 0, _f = Object.entries(prodTotals); _e < _f.length; _e++) {
                            var _g = _f[_e], key = _g[0], prodQty = _g[1];
                            var pickupQty = (_c = pickupTotals[key]) !== null && _c !== void 0 ? _c : 0;
                            (0, vitest_1.expect)(pickupQty, "op \"".concat(desc, "\" config key \"").concat(key, "\": pickup=").concat(pickupQty, " < production=").concat(prodQty)).toBeGreaterThanOrEqual(prodQty);
                        }
                    };
                    for (_i = 0, prodOpIds_1 = prodOpIds; _i < prodOpIds_1.length; _i++) {
                        opId = prodOpIds_1[_i];
                        _loop_1(opId);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("total pickup quantity >= total production quantity for every operation", function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, _i, _a, row;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client.query(
                    // Use correlated subqueries to avoid cross-join inflation when an operation
                    // has multiple pickup or production records.
                    "SELECT\n         jo.id AS op_id,\n         jo.description,\n         COALESCE((SELECT SUM(jop.quantity) FROM \"jobOperationPickup\" jop WHERE jop.\"jobOperationId\" = jo.id), 0) AS pickup_qty,\n         COALESCE((SELECT SUM(pq.quantity)  FROM \"productionQuantity\" pq  WHERE pq.\"jobOperationId\"  = jo.id), 0) AS prod_qty\n       FROM \"jobOperation\" jo\n       JOIN job j ON j.id = jo.\"jobId\"\n       WHERE j.\"companyId\" = $1\n         AND (SELECT COALESCE(SUM(pq.quantity), 0) FROM \"productionQuantity\" pq WHERE pq.\"jobOperationId\" = jo.id) > 0", [COMPANY_ID])];
                case 1:
                    res = _b.sent();
                    for (_i = 0, _a = res.rows; _i < _a.length; _i++) {
                        row = _a[_i];
                        (0, vitest_1.expect)(Number(row.pickup_qty), "op \"".concat(row.description, "\": pickup=").concat(row.pickup_qty, " < production=").concat(row.prod_qty)).toBeGreaterThanOrEqual(Number(row.prod_qty));
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("seeding again is idempotent (same item count, no errors)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var before, after;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, client.query("SELECT COUNT(*) FROM item WHERE \"companyId\" = $1", [COMPANY_ID])];
                case 1:
                    before = _c.sent();
                    return [4 /*yield*/, (0, seedDemoData_1.seedDemoData)(client, {
                            companyId: COMPANY_ID,
                            userId: USER_ID,
                            locationId: LOCATION_ID,
                            language: "en"
                        })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, client.query("SELECT COUNT(*) FROM item WHERE \"companyId\" = $1", [COMPANY_ID])];
                case 3:
                    after = _c.sent();
                    (0, vitest_1.expect)(Number((_a = after.rows[0]) === null || _a === void 0 ? void 0 : _a.count)).toBe(Number((_b = before.rows[0]) === null || _b === void 0 ? void 0 : _b.count));
                    return [2 /*return*/];
            }
        });
    }); }, 120000);
});
