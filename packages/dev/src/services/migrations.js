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
exports.waitForTcp = waitForTcp;
exports.waitForPostgres = waitForPostgres;
exports.waitForStorageReady = waitForStorageReady;
exports.applyBootstrapSql = applyBootstrapSql;
exports.applyMigrations = applyMigrations;
exports.ensureSmokeTestUser = ensureSmokeTestUser;
var node_fs_1 = require("node:fs");
var promises_1 = require("node:timers/promises");
var prompts_1 = require("@clack/prompts");
var execa_1 = require("execa");
var pathe_1 = require("pathe");
var pg_1 = require("pg");
var helpers_js_1 = require("../helpers.js");
// ---------------------------------------------------------------------------
// Readiness gates
// ---------------------------------------------------------------------------
// Block until each tcp:<port> accepts on 127.0.0.1. `onProgress` fires once
// per port as it opens — caller streams these into a spinner subtitle so a
// stuck service (e.g. inngest pulling its container) is visible instead of a
// 60s silent hang.
function waitForTcp(targets_1) {
    return __awaiter(this, arguments, void 0, function (targets, opts) {
        var ports, total, opened;
        var _this = this;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ports = targets.map(function (t) {
                        var m = t.match(/^tcp:(\d+)$/);
                        if (!m)
                            throw new Error("waitForTcp: bad target \"".concat(t, "\" (expected tcp:<port>)"));
                        return Number(m[1]);
                    });
                    total = ports.length;
                    opened = 0;
                    return [4 /*yield*/, Promise.all(ports.map(function (p) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, (0, helpers_js_1.waitForPort)(p, 60000)];
                                    case 1:
                                        _b.sent();
                                        opened += 1;
                                        (_a = opts.onProgress) === null || _a === void 0 ? void 0 : _a.call(opts, "tcp:".concat(p, " open (").concat(opened, "/").concat(total, ")"));
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Block until postgres accepts queries (TCP-open ≠ ready — init scripts run
// after the port opens).
function waitForPostgres(port_1) {
    return __awaiter(this, arguments, void 0, function (port, timeoutMs) {
        var deadline, _a;
        if (timeoutMs === void 0) { timeoutMs = 60000; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    deadline = Date.now() + timeoutMs;
                    _b.label = 1;
                case 1:
                    if (!(Date.now() < deadline)) return [3 /*break*/, 7];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, withClient(port, function (c) { return c.query("SELECT 1"); })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
                case 4:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, (0, promises_1.setTimeout)(1000)];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 1];
                case 7: throw new Error("postgres did not accept queries within ".concat(timeoutMs, "ms"));
            }
        });
    });
}
/**
 * Block until supabase storage-api has bootstrapped `storage.buckets`. Probes
 * for 30s first; if missing, invokes `onHeal` (re-apply init.sql + restart
 * dependent services) then polls again with a 150s budget.
 *
 * The heal path recovers worktrees whose pgdata volume predates the current
 * init.sql — Docker only runs init scripts on a fresh data dir, so role
 * passwords drift and storage-api auth-fails forever otherwise.
 */
function waitForStorageReady(port_1) {
    return __awaiter(this, arguments, void 0, function (port, opts) {
        var start, elapsed, _a;
        var _b, _c, _d, _e;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    start = Date.now();
                    elapsed = function () { return Math.floor((Date.now() - start) / 1000); };
                    (_b = opts.onProgress) === null || _b === void 0 ? void 0 : _b.call(opts, "waiting for storage.buckets");
                    return [4 /*yield*/, pollBuckets(port, start + 30000)];
                case 1:
                    if (_f.sent()) {
                        (_c = opts.onProgress) === null || _c === void 0 ? void 0 : _c.call(opts, "storage.buckets ready (".concat(elapsed(), "s)"));
                        return [2 /*return*/];
                    }
                    if (!opts.onHeal) return [3 /*break*/, 3];
                    (_d = opts.onProgress) === null || _d === void 0 ? void 0 : _d.call(opts, "storage stuck — running heal");
                    return [4 /*yield*/, opts.onHeal()];
                case 2:
                    _f.sent();
                    _f.label = 3;
                case 3: return [4 /*yield*/, pollBuckets(port, start + 180000)];
                case 4:
                    if (_f.sent()) {
                        (_e = opts.onProgress) === null || _e === void 0 ? void 0 : _e.call(opts, "storage.buckets ready (".concat(elapsed(), "s)"));
                        return [2 /*return*/];
                    }
                    if (!opts.onTimeout) return [3 /*break*/, 8];
                    _f.label = 5;
                case 5:
                    _f.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, opts.onTimeout()];
                case 6:
                    _f.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _a = _f.sent();
                    return [3 /*break*/, 8];
                case 8: throw new Error("storage.buckets did not appear within 180s");
            }
        });
    });
}
// Re-apply `packages/dev/docker/init.sql` as the cluster superuser role.
// Docker's `docker-entrypoint-initdb.d` only runs on a fresh pgdata volume —
// a worktree with a pre-existing volume from before init.sql evolved keeps the
// old role passwords forever, so storage-api / gotrue / postgrest auth-fail on
// every boot. Re-applying is idempotent (`ALTER USER ... PASSWORD`, `CREATE
// SCHEMA IF NOT EXISTS`).
//
// Connect as `supabase_admin` (not `postgres`): current supabase/postgres
// images treat `supabase_admin` as a reserved role; only a superuser may
// `ALTER` it, and the host TCP `postgres` role is no longer sufficient.
function applyBootstrapSql(root, port) {
    return __awaiter(this, void 0, void 0, function () {
        var sql;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sql = (0, node_fs_1.readFileSync)((0, pathe_1.join)(root, "packages/dev/docker/init.sql"), "utf8");
                    return [4 /*yield*/, withClient(port, function (c) { return c.query(sql); }, {
                            user: "supabase_admin",
                            password: "postgres"
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ---------------------------------------------------------------------------
// Schema migrations
// ---------------------------------------------------------------------------
// --include-all: supabase bootstrap inserts a sentinel into schema_migrations
// that makes earlier-timestamp migrations look "out of order" without it.
// Returns `applied: true` when at least one migration ran — callers gate
// type/swagger regen on this so a re-run against an up-to-date DB stays cheap.
//
// Use `supabase_admin`, not `postgres`: current supabase/postgres images mark
// `session_authorization=postgres` as non-superuser (`is_superuser=off`), so
// the CLI cannot INSERT migration bookkeeping rows into
// `supabase_migrations.schema_migrations` as `postgres`.
function applyMigrations(root, dbPort) {
    return __awaiter(this, void 0, void 0, function () {
        var dbUrl, args, cwd, r, output, repaired, retry, applied_1, applied;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    dbUrl = "postgresql://supabase_admin:postgres@localhost:".concat(dbPort, "/postgres");
                    args = ["migration", "up", "--include-all", "--db-url", dbUrl];
                    cwd = (0, pathe_1.join)(root, "packages/database");
                    return [4 /*yield*/, (0, execa_1.execa)("supabase", args, {
                            cwd: cwd,
                            reject: false,
                            preferLocal: true
                        })];
                case 1:
                    r = _o.sent();
                    if (!(r.exitCode !== 0)) return [3 /*break*/, 5];
                    output = "".concat((_a = r.stderr) !== null && _a !== void 0 ? _a : "", "\n").concat((_b = r.stdout) !== null && _b !== void 0 ? _b : "");
                    if (!/remote migration versions not found in local/i.test(output)) return [3 /*break*/, 4];
                    return [4 /*yield*/, repairStaleMigrations(root, dbPort)];
                case 2:
                    repaired = _o.sent();
                    if (!(repaired > 0)) return [3 /*break*/, 4];
                    prompts_1.log.warn("repaired ".concat(repaired, " stale migration(s) \u2014 retrying"));
                    return [4 /*yield*/, (0, execa_1.execa)("supabase", args, {
                            cwd: cwd,
                            reject: false,
                            preferLocal: true
                        })];
                case 3:
                    retry = _o.sent();
                    if (retry.exitCode === 0) {
                        applied_1 = /Applying migration/i.test((_c = retry.stdout) !== null && _c !== void 0 ? _c : "");
                        return [2 /*return*/, { applied: applied_1 }];
                    }
                    process.stderr.write((_e = (_d = retry.stderr) === null || _d === void 0 ? void 0 : _d.toString()) !== null && _e !== void 0 ? _e : "");
                    process.stdout.write((_g = (_f = retry.stdout) === null || _f === void 0 ? void 0 : _f.toString()) !== null && _g !== void 0 ? _g : "");
                    throw new Error("supabase ".concat(args.join(" "), " failed after repair (exit ").concat(retry.exitCode, ")"));
                case 4:
                    process.stderr.write((_j = (_h = r.stderr) === null || _h === void 0 ? void 0 : _h.toString()) !== null && _j !== void 0 ? _j : "");
                    process.stdout.write((_l = (_k = r.stdout) === null || _k === void 0 ? void 0 : _k.toString()) !== null && _l !== void 0 ? _l : "");
                    throw new Error("supabase ".concat(args.join(" "), " failed (exit ").concat(r.exitCode, ")"));
                case 5:
                    applied = /Applying migration/i.test((_m = r.stdout) !== null && _m !== void 0 ? _m : "");
                    return [2 /*return*/, { applied: applied }];
            }
        });
    });
}
// Find migration versions in DB that have no corresponding local file and
// remove them from supabase_migrations.schema_migrations.
function repairStaleMigrations(root, dbPort) {
    return __awaiter(this, void 0, void 0, function () {
        var migrationsDir, localVersions, remoteVersions, stale;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    migrationsDir = (0, pathe_1.join)(root, "packages/database/supabase/migrations");
                    localVersions = new Set((0, node_fs_1.readdirSync)(migrationsDir)
                        .filter(function (f) { return f.endsWith(".sql"); })
                        .map(function (f) { return f.split("_")[0]; }));
                    return [4 /*yield*/, withClient(dbPort, function (c) { return __awaiter(_this, void 0, void 0, function () {
                            var res;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, c.query("SELECT version FROM supabase_migrations.schema_migrations ORDER BY version")];
                                    case 1:
                                        res = _a.sent();
                                        return [2 /*return*/, res.rows.map(function (r) { return r.version; })];
                                }
                            });
                        }); }, { user: "supabase_admin", password: "postgres" })];
                case 1:
                    remoteVersions = _a.sent();
                    stale = remoteVersions.filter(function (v) { return !localVersions.has(v); });
                    if (stale.length === 0)
                        return [2 /*return*/, 0];
                    return [4 /*yield*/, withClient(dbPort, function (c) { return __awaiter(_this, void 0, void 0, function () {
                            var _i, stale_1, version;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _i = 0, stale_1 = stale;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < stale_1.length)) return [3 /*break*/, 4];
                                        version = stale_1[_i];
                                        return [4 /*yield*/, c.query("DELETE FROM supabase_migrations.schema_migrations WHERE version = $1", [version])];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }, { user: "supabase_admin", password: "postgres" })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, stale.length];
            }
        });
    });
}
// ---------------------------------------------------------------------------
// Smoke-test user
// ---------------------------------------------------------------------------
var SMOKE_TEST_EMAIL = "test@carbon.ms";
function ensureSmokeTestUser(root, dbPort, apiPort) {
    return __awaiter(this, void 0, void 0, function () {
        var exists, dbUrl, supabaseUrl;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, withClient(dbPort, function (c) { return __awaiter(_this, void 0, void 0, function () {
                        var r;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, c.query("SELECT count(*)::text FROM \"user\" WHERE email = $1", [SMOKE_TEST_EMAIL])];
                                case 1:
                                    r = _b.sent();
                                    return [2 /*return*/, Number((_a = r.rows[0]) === null || _a === void 0 ? void 0 : _a.count) > 0];
                            }
                        });
                    }); })];
                case 1:
                    exists = _a.sent();
                    if (exists)
                        return [2 /*return*/, { seeded: false }];
                    dbUrl = "postgresql://postgres:postgres@localhost:".concat(dbPort, "/postgres");
                    supabaseUrl = "http://localhost:".concat(apiPort);
                    return [4 /*yield*/, (0, execa_1.execa)("pnpm", [
                            "--filter",
                            "@carbon/database",
                            "run",
                            "db:seed:dev",
                            "--",
                            "--email",
                            SMOKE_TEST_EMAIL
                        ], {
                            cwd: root,
                            env: __assign(__assign({}, process.env), { SUPABASE_DB_URL: dbUrl, SUPABASE_URL: supabaseUrl, NODE_TLS_REJECT_UNAUTHORIZED: "0" }),
                            stdio: "pipe"
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { seeded: true }];
            }
        });
    });
}
// Host-side Postgres connection. `pg` avoids a host `psql` install —
// previously a hidden requirement that bit at least one engineer.
function withClient(port_1, fn_1) {
    return __awaiter(this, arguments, void 0, function (port, fn, opts) {
        var client;
        var _a, _b, _c;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    client = new pg_1.default.Client({
                        host: "127.0.0.1",
                        port: port,
                        user: (_a = opts.user) !== null && _a !== void 0 ? _a : "postgres",
                        password: (_b = opts.password) !== null && _b !== void 0 ? _b : "postgres",
                        database: (_c = opts.database) !== null && _c !== void 0 ? _c : "postgres"
                    });
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _d.sent();
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, fn(client)];
                case 3: return [2 /*return*/, _d.sent()];
                case 4: return [4 /*yield*/, client.end()];
                case 5:
                    _d.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function pollBuckets(port, deadline) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(Date.now() < deadline)) return [3 /*break*/, 3];
                    return [4 /*yield*/, storageBucketsExists(port)];
                case 1:
                    if (_a.sent())
                        return [2 /*return*/, true];
                    return [4 /*yield*/, (0, promises_1.setTimeout)(1000)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 0];
                case 3: return [2 /*return*/, false];
            }
        });
    });
}
function storageBucketsExists(port) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, withClient(port, function (c) { return __awaiter(_this, void 0, void 0, function () {
                            var r;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, c.query("SELECT to_regclass('storage.buckets')::text AS regclass")];
                                    case 1:
                                        r = _b.sent();
                                        return [2 /*return*/, ((_a = r.rows[0]) === null || _a === void 0 ? void 0 : _a.regclass) === "storage.buckets"];
                                }
                            });
                        }); })];
                case 1: return [2 /*return*/, _b.sent()];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
