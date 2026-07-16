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
exports.up = up;
var prompts_1 = require("@clack/prompts");
var dotenv_1 = require("dotenv");
var execa_1 = require("execa");
var pathe_1 = require("pathe");
var env_js_1 = require("../env.js");
var git_js_1 = require("../git.js");
var helpers_js_1 = require("../helpers.js");
var prompts_js_1 = require("../prompts.js");
var apps_js_1 = require("../services/apps.js");
var compose_js_1 = require("../services/compose.js");
var migrations_js_1 = require("../services/migrations.js");
var portless_js_1 = require("../services/portless.js");
var ui_js_1 = require("../ui.js");
var worktree_js_1 = require("../worktree.js");
var copy_js_1 = require("./copy.js");
var down_js_1 = require("./down.js");
function up() {
    return __awaiter(this, arguments, void 0, function (opts) {
        var shouldMigrate, shouldRegen, shouldBorrow, appsRequested, root, portless, selectedApps, _a, slug, borrowedEntry, borrowSlug, entry, ctx;
        var _b, _c, _d;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    shouldMigrate = (_b = opts.migrate) !== null && _b !== void 0 ? _b : true;
                    shouldRegen = shouldMigrate && ((_c = opts.regen) !== null && _c !== void 0 ? _c : true);
                    shouldBorrow = opts.borrow === true;
                    appsRequested = (_d = opts.apps) !== null && _d !== void 0 ? _d : true;
                    return [4 /*yield*/, (0, worktree_js_1.getWorktreeRoot)()];
                case 1:
                    root = _e.sent();
                    (0, dotenv_1.config)({ path: (0, pathe_1.join)(root, ".env.local"), override: false });
                    (0, dotenv_1.config)({ path: (0, pathe_1.join)(root, ".env"), override: false });
                    portless = opts.portless !== undefined
                        ? opts.portless
                        : process.env.CARBON_PORTLESS !== "0";
                    (0, prompts_1.intro)("Carbon · dev up");
                    if (!portless) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, portless_js_1.ensurePortlessInstalled)()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, (0, portless_js_1.ensureProxyPrivileges)()];
                case 3:
                    _e.sent();
                    return [3 /*break*/, 5];
                case 4:
                    prompts_1.log.info("portless disabled (CARBON_PORTLESS=0) — using localhost URLs");
                    _e.label = 5;
                case 5:
                    if (!appsRequested) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, prompts_js_1.pickApps)()];
                case 6:
                    _a = _e.sent();
                    return [3 /*break*/, 8];
                case 7:
                    _a = [];
                    _e.label = 8;
                case 8:
                    selectedApps = _a;
                    slug = (0, worktree_js_1.resolveSlug)(root);
                    if (!shouldBorrow) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, prompts_js_1.pickBorrowSlug)(slug)];
                case 9:
                    borrowSlug = _e.sent();
                    entry = (0, worktree_js_1.getSlot)(borrowSlug);
                    if (!entry)
                        throw new Error("No slot found for worktree \"".concat(borrowSlug, "\" in ~/.carbon/dev-ports.json"));
                    borrowedEntry = entry;
                    prompts_1.log.info("borrowing containers from: ".concat(borrowSlug));
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, (0, worktree_js_1.ensureSlugAvailable)(slug, root)];
                case 11:
                    _e.sent();
                    _e.label = 12;
                case 12:
                    (0, worktree_js_1.persistSlug)(root, slug);
                    prompts_1.log.info("worktree: ".concat(slug, "  (project ").concat((0, worktree_js_1.projectName)(slug), ")"));
                    return [4 /*yield*/, refreshStaleCopyFiles(root)];
                case 13:
                    _e.sent();
                    return [4 /*yield*/, ensureDepsInstalled(root)];
                case 14:
                    _e.sent();
                    if (!(selectedApps.length > 0)) return [3 /*break*/, 16];
                    return [4 /*yield*/, compileLocaleCatalogs(root)];
                case 15:
                    _e.sent();
                    _e.label = 16;
                case 16: return [4 /*yield*/, provisionSlot(root, slug, portless, borrowedEntry)];
                case 17:
                    ctx = _e.sent();
                    if (!borrowedEntry) return [3 /*break*/, 19];
                    return [4 /*yield*/, waitForServices(ctx)];
                case 18:
                    _e.sent();
                    return [3 /*break*/, 23];
                case 19: return [4 /*yield*/, pullImages(ctx, { force: opts.pull === true })];
                case 20:
                    _e.sent();
                    return [4 /*yield*/, bootDockerStack(ctx)];
                case 21:
                    _e.sent();
                    return [4 /*yield*/, waitForServices(ctx)];
                case 22:
                    _e.sent();
                    _e.label = 23;
                case 23: return [4 /*yield*/, runDatabaseMigrations(ctx, { shouldMigrate: shouldMigrate, shouldRegen: shouldRegen })];
                case 24:
                    _e.sent();
                    return [4 /*yield*/, seedSmokeTestUser(ctx)];
                case 25:
                    _e.sent();
                    if (!portless) return [3 /*break*/, 28];
                    return [4 /*yield*/, setupPortless(ctx, selectedApps)];
                case 26:
                    _e.sent();
                    return [4 /*yield*/, ensureHostsFile()];
                case 27:
                    _e.sent();
                    _e.label = 28;
                case 28:
                    if (process.env.CARBON_EDITION === "cloud") {
                        (0, apps_js_1.spawnStripeListener)(root);
                        prompts_1.log.info("stripe listener spawned (CARBON_EDITION=cloud)");
                    }
                    (0, prompts_1.box)((0, ui_js_1.summaryLines)(ctx.ports, selectedApps, portless ? ctx.branchPrefix : undefined).join("\n"), "Carbon dev \u2014 ".concat(slug));
                    if (selectedApps.length === 0) {
                        (0, prompts_1.outro)("services up (run `crbn down` to stop)");
                        return [2 /*return*/];
                    }
                    (0, prompts_1.outro)("apps starting (Ctrl+C to stop)");
                    return [4 /*yield*/, runAppsThenTeardown(root, selectedApps, ctx.ports, portless)];
                case 29:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ---------------------------------------------------------------------------
// Phases
// ---------------------------------------------------------------------------
// Auto-heal stale `.env` (and other package.json#crbn.copy entries) from main
// checkout. `crbn checkout <existing-branch>` skips do_post_create → existing
// worktrees drift from main when new env vars land. Mtime-gated, so unchanged
// files are untouched and local edits made *after* main's last change are
// preserved.
function refreshStaleCopyFiles(root) {
    return __awaiter(this, void 0, void 0, function () {
        var refreshed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, copy_js_1.syncStaleCopyFiles)(root)];
                case 1:
                    refreshed = _a.sent();
                    if (refreshed.length > 0) {
                        prompts_1.log.info("refreshed ".concat(refreshed.join(", "), " from main checkout (stale vs main)"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Outside `tasks` so pnpm progress streams directly when install runs.
function ensureDepsInstalled(root) {
    return __awaiter(this, void 0, void 0, function () {
        var ran;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, apps_js_1.installDeps)(root)];
                case 1:
                    ran = _a.sent();
                    if (ran)
                        prompts_1.log.step("pnpm install");
                    else
                        prompts_1.log.info("pnpm install skipped (lockfile in sync)");
                    return [2 /*return*/];
            }
        });
    });
}
// Compile lingui .po catalogs → the .mjs files the app loaders import at runtime
// (apps/*/app/services/lingui.server.ts globs `locales/*/erp.mjs`). `turbo run
// build` produces these via the //#lingui:compile task, but `crbn up` spawns
// `react-router dev` directly and never runs that task — so without this the
// compiled catalogs don't exist in dev and switching the UI language silently
// loads an empty catalog (a no-op). Mirrors the build step.
function compileLocaleCatalogs(root) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("pnpm", ["lingui:compile"], { cwd: root })];
                case 1:
                    _a.sent();
                    prompts_1.log.step("compiled locale catalogs");
                    return [2 /*return*/];
            }
        });
    });
}
function provisionSlot(root, slug, portless, borrowedEntry) {
    return __awaiter(this, void 0, void 0, function () {
        var ctx;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, prompts_1.tasks)([
                        {
                            title: borrowedEntry ? "Configure (borrowed slot)" : "Configure portless",
                            task: function () { return __awaiter(_this, void 0, void 0, function () {
                                var ownSlot, slot, branch, branchPrefix;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, (0, worktree_js_1.resolveSlot)(slug, root)];
                                        case 1:
                                            ownSlot = _a.sent();
                                            // Pin well-known ports in localhost mode so URLs are predictable and
                                            // OAuth redirect URIs can be registered once in Google/Azure console.
                                            if (!portless && !borrowedEntry) {
                                                ownSlot.ports.PORT_API = 54321;
                                                ownSlot.ports.PORT_ERP = 3000;
                                                ownSlot.ports.PORT_MES = 3001;
                                            }
                                            slot = borrowedEntry
                                                ? {
                                                    // Backend ports (DB, API, Studio, Inbucket, Inngest) come from the
                                                    // borrowed stack — apps talk to those running containers.
                                                    // App ports (ERP, MES) come from our own slot — dev servers bind here,
                                                    // so they don't conflict with the borrowed stack's dev servers.
                                                    ports: __assign(__assign({}, borrowedEntry.ports), { PORT_ERP: ownSlot.ports.PORT_ERP, PORT_MES: ownSlot.ports.PORT_MES }),
                                                    redisDb: borrowedEntry.redisDb,
                                                    jwt: borrowedEntry.jwt
                                                }
                                                : ownSlot;
                                            return [4 /*yield*/, (0, git_js_1.currentBranch)(root)];
                                        case 2:
                                            branch = _a.sent();
                                            branchPrefix = (0, portless_js_1.branchToPrefix)(branch, slug);
                                            ctx = __assign({ root: root, slug: slug, branchPrefix: branchPrefix }, slot);
                                            (0, env_js_1.writeEnv)(root, (0, env_js_1.renderEnv)(__assign({ slug: slug, portless: portless, branchPrefix: branchPrefix }, slot)));
                                            (0, env_js_1.syncAppPortlessConfigs)(root);
                                            // Use override: true so freshly written .env.local values replace any
                                            // stale values already in process.env from the initial load at startup.
                                            (0, dotenv_1.config)({ path: (0, pathe_1.join)(root, ".env.local"), override: true });
                                            (0, dotenv_1.config)({ path: (0, pathe_1.join)(root, ".env"), override: false });
                                            return [2 /*return*/, borrowedEntry
                                                    ? "borrowed backend ports, own app ports (ERP :".concat(slot.ports.PORT_ERP, " MES :").concat(slot.ports.PORT_MES, "), redis db ").concat(slot.redisDb)
                                                    : portless
                                                        ? "prefix \"".concat(branchPrefix, "\", redis db ").concat(slot.redisDb)
                                                        : "localhost mode, redis db ".concat(slot.redisDb)];
                                    }
                                });
                            }); }
                        },
                        {
                            title: "Render .env.local & sync symlinks",
                            task: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, (0, apps_js_1.syncEnvSymlinks)(root)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, "env files synced"];
                                    }
                                });
                            }); }
                        },
                        {
                            title: "Boot shared redis",
                            task: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, (0, compose_js_1.bootSharedRedis)(root)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, "shared redis on :".concat(worktree_js_1.SHARED_REDIS_PORT, " (index ").concat(ctx.redisDb, ")")];
                                    }
                                });
                            }); }
                        }
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/, ctx];
            }
        });
    });
}
// Pull images outside `tasks()` so we can use clack's progress bar (one
// tick per `<service> Pulled` event). Spinner subtitle inside `tasks()`
// can't render a bar, only a single line of text.
function pullImages(ctx, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var refs, _a, services, max, bar, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!opts.force) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, compose_js_1.devComposeImageRefs)(ctx.root, ctx.slug)];
                case 1:
                    refs = _b.sent();
                    _a = refs;
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, compose_js_1.allImagesPresentLocally)(refs)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    if (_a) {
                        prompts_1.log.info("docker images already present — skipping compose pull");
                        return [2 /*return*/];
                    }
                    _b.label = 4;
                case 4: return [4 /*yield*/, (0, compose_js_1.listComposeServices)(ctx.root, ctx.slug)];
                case 5:
                    services = _b.sent();
                    max = Math.max(services.length, 1);
                    bar = (0, prompts_1.progress)({ style: "heavy", max: max });
                    bar.start("Pulling docker images");
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, (0, compose_js_1.pullStack)(ctx.root, ctx.slug, function (line) {
                            bar.message(line.slice(0, 80));
                            if (/ Pulled$/.test(line))
                                bar.advance(1);
                        })];
                case 7:
                    _b.sent();
                    bar.stop("images up to date");
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _b.sent();
                    bar.stop("pull failed");
                    throw err_1;
                case 9: return [2 /*return*/];
            }
        });
    });
}
function bootDockerStack(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, prompts_1.tasks)([
                        {
                            title: "Boot docker compose stack",
                            task: function (msg) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            msg("starting 12 services");
                                            return [4 /*yield*/, (0, compose_js_1.bootStack)(ctx.root, ctx.slug)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, "containers up"];
                                    }
                                });
                            }); }
                        }
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Wait for services via clack progress bar:
//   3× TCP ports → +1 postgres ready → +1 storage.buckets = 5 ticks.
// `waitForStorageReady` owns the storage heal path internally.
function waitForServices(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var bar, err_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bar = (0, prompts_1.progress)({ style: "heavy", max: 5 });
                    bar.start("Waiting for services");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, (0, migrations_js_1.waitForTcp)([
                            "tcp:".concat(ctx.ports.PORT_DB),
                            "tcp:".concat(ctx.ports.PORT_API),
                            "tcp:".concat(ctx.ports.PORT_INNGEST)
                        ], { onProgress: function (line) { return bar.advance(1, line.slice(0, 80)); } })];
                case 2:
                    _a.sent();
                    bar.message("waiting for postgres to accept queries");
                    return [4 /*yield*/, (0, migrations_js_1.waitForPostgres)(ctx.ports.PORT_DB)];
                case 3:
                    _a.sent();
                    bar.advance(1, "postgres ready");
                    return [4 /*yield*/, (0, migrations_js_1.waitForStorageReady)(ctx.ports.PORT_DB, {
                            onProgress: function (line) { return bar.message(line.slice(0, 80)); },
                            onHeal: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            bar.message("storage stuck — re-applying init.sql");
                                            return [4 /*yield*/, (0, migrations_js_1.applyBootstrapSql)(ctx.root, ctx.ports.PORT_DB)];
                                        case 1:
                                            _a.sent();
                                            bar.message("restarting storage / gotrue / postgrest");
                                            return [4 /*yield*/, (0, compose_js_1.restartServices)(ctx.root, ctx.slug, [
                                                    "storage",
                                                    "gotrue",
                                                    "postgrest"
                                                ])];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                            onTimeout: function () { return dumpStorageDiagnostics(ctx); }
                        })];
                case 4:
                    _a.sent();
                    bar.advance(1, "storage.buckets ready");
                    bar.stop("all services responding");
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    bar.stop("services not ready");
                    throw err_2;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function runDatabaseMigrations(ctx, cfg) {
    return __awaiter(this, void 0, void 0, function () {
        var migrationsApplied;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    migrationsApplied = false;
                    return [4 /*yield*/, (0, prompts_1.tasks)(__spreadArray([
                            cfg.shouldMigrate
                                ? {
                                    title: "Apply database migrations",
                                    task: function () { return __awaiter(_this, void 0, void 0, function () {
                                        var r;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, (0, migrations_js_1.applyMigrations)(ctx.root, ctx.ports.PORT_DB)];
                                                case 1:
                                                    r = _a.sent();
                                                    migrationsApplied = r.applied;
                                                    return [2 /*return*/, r.applied
                                                            ? "migrations applied"
                                                            : "schema already up to date"];
                                            }
                                        });
                                    }); }
                                }
                                : {
                                    title: "Skip database migrations (--no-migrate)",
                                    task: function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, "skipped"];
                                    }); }); }
                                }
                        ], (cfg.shouldRegen
                            ? [
                                {
                                    title: "Regenerate types & swagger",
                                    task: function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!migrationsApplied)
                                                        return [2 /*return*/, "skipped (no new migrations)"];
                                                    return [4 /*yield*/, (0, execa_1.execa)("pnpm", ["db:types"], { cwd: ctx.root })];
                                                case 1:
                                                    _a.sent();
                                                    return [4 /*yield*/, (0, execa_1.execa)("pnpm", ["generate:swagger"], { cwd: ctx.root })];
                                                case 2:
                                                    _a.sent();
                                                    return [2 /*return*/, "types + swagger refreshed"];
                                            }
                                        });
                                    }); }
                                }
                            ]
                            : []), true))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function seedSmokeTestUser(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, prompts_1.tasks)([
                        {
                            title: "Seed smoke-test user (test@carbon.ms)",
                            task: function () { return __awaiter(_this, void 0, void 0, function () {
                                var r;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, (0, migrations_js_1.ensureSmokeTestUser)(ctx.root, ctx.ports.PORT_DB, ctx.ports.PORT_API)];
                                        case 1:
                                            r = _a.sent();
                                            return [2 /*return*/, r.seeded ? "user created" : "already exists"];
                                    }
                                });
                            }); }
                        }
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function setupPortless(ctx, _selectedApps) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, prompts_1.tasks)([
                        {
                            title: "Prune stale portless routes",
                            task: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, (0, portless_js_1.pruneStaleRoutes)()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, "orphans cleaned"];
                                    }
                                });
                            }); }
                        },
                        {
                            title: "Start portless proxy",
                            task: function (msg) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            (0, portless_js_1.startProxyDaemon)(ctx.root);
                                            msg("waiting for proxy on :443");
                                            return [4 /*yield*/, (0, portless_js_1.waitForProxyReady)()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, "proxy listening"];
                                    }
                                });
                            }); }
                        },
                        {
                            title: "Register service aliases",
                            task: function () { return __awaiter(_this, void 0, void 0, function () {
                                var count;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, (0, portless_js_1.registerAliases)(ctx.root, ctx.branchPrefix, ctx.ports)];
                                        case 1:
                                            count = _a.sent();
                                            return [2 /*return*/, "".concat(count, " aliases registered")];
                                    }
                                });
                            }); }
                        }
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Verify /etc/hosts has all expected entries. Root proxy auto-syncs via
// fs.watch on routes.json, but there's a race between alias registration
// and the watcher firing. Poll briefly, then fall back to sudo sync.
function ensureHostsFile() {
    return __awaiter(this, void 0, void 0, function () {
        var deadline;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(0, portless_js_1.proxyRunsAsRoot)()) return [3 /*break*/, 4];
                    deadline = Date.now() + 3000;
                    _a.label = 1;
                case 1:
                    if (!(Date.now() < deadline)) return [3 /*break*/, 3];
                    if ((0, portless_js_1.hostsFileInSync)()) {
                        prompts_1.log.info("/etc/hosts verified in sync");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, 300); })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3:
                    prompts_1.log.warn("/etc/hosts not in sync after 3s — falling back to manual sync");
                    return [3 /*break*/, 5];
                case 4:
                    if ((0, portless_js_1.hostsFileInSync)()) {
                        prompts_1.log.info("/etc/hosts already in sync — skipping sudo");
                        return [2 /*return*/];
                    }
                    _a.label = 5;
                case 5:
                    prompts_1.log.step("sudo portless hosts sync");
                    return [4 /*yield*/, (0, portless_js_1.syncHostsFile)()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function runAppsThenTeardown(root, selectedApps, ports, portless) {
    return __awaiter(this, void 0, void 0, function () {
        var detach;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, apps_js_1.spawnApps)({ root: root, apps: selectedApps, ports: ports, portless: portless })];
                case 1:
                    _a.sent();
                    detach = (0, helpers_js_1.onShutdown)(function () {
                        process.stderr.write("\nfinishing teardown — please wait\n");
                    });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    // silent: post-SIGINT stdin raw-mode triggers EIO in clack's spinner.
                    return [4 /*yield*/, (0, down_js_1.down)({ silent: true })];
                case 3:
                    // silent: post-SIGINT stdin raw-mode triggers EIO in clack's spinner.
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    detach();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// ---------------------------------------------------------------------------
// Diagnostics
// ---------------------------------------------------------------------------
function dumpStorageDiagnostics(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var containers, out, _i, _a, name_1, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, compose_js_1.listContainers)(ctx.root, ctx.slug)];
                case 1:
                    containers = _f.sent();
                    out = ["", "--- container state ---"];
                    for (_i = 0, _a = ["postgres", "storage"]; _i < _a.length; _i++) {
                        name_1 = _a[_i];
                        out.push(formatContainerLine(name_1, containers));
                    }
                    out.push("", "--- storage logs (last 50) ---");
                    _c = (_b = out).push;
                    return [4 /*yield*/, (0, compose_js_1.tailServiceLogs)(ctx.root, ctx.slug, "storage", 50)];
                case 2:
                    _c.apply(_b, [_f.sent()]);
                    out.push("", "--- postgres logs (last 20) ---");
                    _e = (_d = out).push;
                    return [4 /*yield*/, (0, compose_js_1.tailServiceLogs)(ctx.root, ctx.slug, "postgres", 20)];
                case 3:
                    _e.apply(_d, [_f.sent()]);
                    out.push("");
                    process.stderr.write(out.join("\n") + "\n");
                    return [2 /*return*/];
            }
        });
    });
}
function formatContainerLine(name, containers) {
    var _a;
    var c = containers.find(function (x) { return x.Service === name; });
    if (!c)
        return "".concat(name.padEnd(10), " (not found)");
    return "".concat(name.padEnd(10), " state=").concat(c.State, " health=").concat((_a = c.Health) !== null && _a !== void 0 ? _a : "n/a", "  ").concat(c.Status);
}
