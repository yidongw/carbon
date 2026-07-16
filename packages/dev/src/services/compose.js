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
exports.bootStack = bootStack;
exports.restartServices = restartServices;
exports.pullStack = pullStack;
exports.devComposeImageRefs = devComposeImageRefs;
exports.allImagesPresentLocally = allImagesPresentLocally;
exports.stopStack = stopStack;
exports.bootSharedRedis = bootSharedRedis;
exports.destroyProjectVolumes = destroyProjectVolumes;
exports.listContainers = listContainers;
exports.listComposeServices = listComposeServices;
exports.tailServiceLogs = tailServiceLogs;
exports.dockerProjectStates = dockerProjectStates;
exports.destroyProject = destroyProject;
exports.listCarbonProjects = listCarbonProjects;
exports.flushDb = flushDb;
var prompts_1 = require("@clack/prompts");
var execa_1 = require("execa");
var constants_js_1 = require("../constants.js");
var helpers_js_1 = require("../helpers.js");
var worktree_js_1 = require("../worktree.js");
// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------
function bootStack(root, slug) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, execStrict("docker", devArgs(slug, "--env-file", ".env.local", "up", "-d"), root)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// `docker compose restart` a subset of services. Used by the storage-stuck
// heal path: after re-applying init.sql we restart storage/gotrue/postgrest so
// they reconnect with the freshly-rotated supabase role passwords.
function restartServices(root, slug, services) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (services.length === 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, execa_1.execa)("docker", devArgs.apply(void 0, __spreadArray([slug, "restart"], services, false)), {
                            cwd: root,
                            reject: false,
                            stdio: "ignore"
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Pull all images before `up -d` so `bootStack` doesn't block silently behind
// a multi-GB download. `--progress=plain` emits parseable per-line status to
// stderr (`<service> Pulling`, `<service> Pulled`); we stream the latest line
// via `onLine` so the caller can feed it into a spinner subtitle.
function pullStack(root, slug, onLine) {
    return __awaiter(this, void 0, void 0, function () {
        var proc, r;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    proc = (0, execa_1.execa)("docker", devArgs(slug, "--env-file", ".env.local", "--progress", "plain", "pull"), { cwd: root, reject: false, all: true });
                    if (proc.all) {
                        (0, helpers_js_1.readLines)(proc.all, function (line) {
                            var trimmed = line.trim();
                            if (trimmed)
                                onLine(trimmed);
                        });
                    }
                    return [4 /*yield*/, proc];
                case 1:
                    r = _c.sent();
                    if (r.exitCode !== 0) {
                        process.stderr.write((_b = (_a = r.all) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "");
                        throw new Error("docker compose pull failed (exit ".concat(r.exitCode, ")"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/** Resolved image refs for the dev compose file (tags as pinned in compose). */
function devComposeImageRefs(root, slug) {
    return __awaiter(this, void 0, void 0, function () {
        var r, refs;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("docker", devArgs(slug, "--env-file", ".env.local", "config", "--images"), { cwd: root, reject: false })];
                case 1:
                    r = _b.sent();
                    if (r.exitCode !== 0)
                        return [2 /*return*/, null];
                    refs = ((_a = r.stdout) !== null && _a !== void 0 ? _a : "")
                        .split("\n")
                        .map(function (s) { return s.trim(); })
                        .filter(Boolean);
                    return [2 /*return*/, refs.length > 0 ? refs : null];
            }
        });
    });
}
/** True when `docker image inspect` succeeds for every ref (parallel). */
function allImagesPresentLocally(refs) {
    return __awaiter(this, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(refs.map(function (ref) {
                        return (0, execa_1.execa)("docker", ["image", "inspect", ref], {
                            stdio: "ignore",
                            reject: false
                        }).then(function (x) { return x.exitCode === 0; });
                    }))];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results.every(Boolean)];
            }
        });
    });
}
function stopStack(root, slug, withVolumes) {
    return __awaiter(this, void 0, void 0, function () {
        var args;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = devArgs(slug, "--env-file", ".env.local", "down");
                    if (withVolumes)
                        args.push("-v", "--remove-orphans");
                    return [4 /*yield*/, (0, execa_1.execa)("docker", args, { cwd: root, stdio: "ignore", reject: false })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// One redis per host; recover from stale `carbon-redis` leftovers.
function bootSharedRedis(root) {
    return __awaiter(this, void 0, void 0, function () {
        var args, r;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    args = ["compose", "-f", constants_js_1.COMPOSE_SHARED_FILE, "up", "-d", "redis"];
                    return [4 /*yield*/, (0, execa_1.execa)("docker", args, { cwd: root, reject: false })];
                case 1:
                    r = _c.sent();
                    if (!(r.exitCode !== 0 && /already in use/i.test((_a = r.stderr) !== null && _a !== void 0 ? _a : ""))) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, execa_1.execa)("docker", ["rm", "-f", "carbon-redis"], {
                            reject: false,
                            stdio: "ignore"
                        })];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, (0, execa_1.execa)("docker", args, { cwd: root, reject: false })];
                case 3:
                    r = _c.sent();
                    _c.label = 4;
                case 4:
                    if (r.exitCode !== 0) {
                        process.stderr.write((_b = r.stderr) !== null && _b !== void 0 ? _b : "");
                        throw new Error("shared redis up failed (exit ".concat(r.exitCode, ")"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function destroyProjectVolumes(cwd, project) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("docker", [
                        "compose",
                        "-f",
                        constants_js_1.COMPOSE_DEV_FILE,
                        "--env-file",
                        ".env.local",
                        "-p",
                        project,
                        "down",
                        "-v",
                        "--remove-orphans"
                    ], { cwd: cwd, stdio: "ignore", reject: false })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ---------------------------------------------------------------------------
// Inspection
// ---------------------------------------------------------------------------
function listContainers(root, slug) {
    return __awaiter(this, void 0, void 0, function () {
        var r, out, _i, _a, line, raw, c;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("docker", devArgs(slug, "ps", "-a", "--format", "json"), { cwd: root, reject: false })];
                case 1:
                    r = _c.sent();
                    if (r.exitCode !== 0 || !((_b = r.stdout) === null || _b === void 0 ? void 0 : _b.trim()))
                        return [2 /*return*/, []];
                    out = [];
                    for (_i = 0, _a = r.stdout.split("\n"); _i < _a.length; _i++) {
                        line = _a[_i];
                        if (!line)
                            continue;
                        raw = void 0;
                        try {
                            raw = JSON.parse(line);
                        }
                        catch (_d) {
                            continue;
                        }
                        c = parseContainer(raw);
                        if (c)
                            out.push(c);
                    }
                    return [2 /*return*/, out];
            }
        });
    });
}
function parseContainer(raw) {
    if (!raw || typeof raw !== "object")
        return null;
    var r = raw;
    if (typeof r.Service !== "string" ||
        typeof r.Name !== "string" ||
        typeof r.State !== "string" ||
        typeof r.Status !== "string") {
        return null;
    }
    return {
        Service: r.Service,
        Name: r.Name,
        State: r.State,
        Status: r.Status,
        Health: typeof r.Health === "string" ? r.Health : null,
        Publishers: parsePublishers(r.Publishers)
    };
}
function parsePublishers(raw) {
    if (!Array.isArray(raw))
        return [];
    var out = [];
    for (var _i = 0, raw_1 = raw; _i < raw_1.length; _i++) {
        var p = raw_1[_i];
        if (!p || typeof p !== "object")
            continue;
        var pp = p.PublishedPort;
        var tp = p.TargetPort;
        if (typeof pp !== "number" || typeof tp !== "number")
            continue;
        out.push({ PublishedPort: pp, TargetPort: tp });
    }
    return out;
}
// Names of services declared in the dev compose file, resolved via
// `docker compose config --services` so we don't drift if services are added.
function listComposeServices(root, slug) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("docker", devArgs(slug, "--env-file", ".env.local", "config", "--services"), { cwd: root, reject: false })];
                case 1:
                    r = _b.sent();
                    if (r.exitCode !== 0)
                        return [2 /*return*/, []];
                    return [2 /*return*/, ((_a = r.stdout) !== null && _a !== void 0 ? _a : "")
                            .split("\n")
                            .map(function (s) { return s.trim(); })
                            .filter(Boolean)];
            }
        });
    });
}
// Tail logs for a single compose service. Returns merged stdout/stderr —
// docker compose writes log content to stderr on some versions. Empty string
// if the call fails; callers use this for best-effort diagnostics.
function tailServiceLogs(root, slug, service, lines) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("docker", devArgs(slug, "logs", "--tail", String(lines), "--no-color", service), { cwd: root, reject: false })];
                case 1:
                    r = _c.sent();
                    return [2 /*return*/, (((_a = r.stdout) !== null && _a !== void 0 ? _a : "") + ((_b = r.stderr) !== null && _b !== void 0 ? _b : "")).trim()];
            }
        });
    });
}
function dockerProjectStates() {
    return __awaiter(this, void 0, void 0, function () {
        var out, r, _i, _a, line, _b, project, state;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    out = new Map();
                    return [4 /*yield*/, (0, execa_1.execa)("docker", [
                            "ps",
                            "-a",
                            "--format",
                            '{{.Label "com.docker.compose.project"}}\t{{.State}}'
                        ], { reject: false })];
                case 1:
                    r = _d.sent();
                    for (_i = 0, _a = ((_c = r.stdout) !== null && _c !== void 0 ? _c : "").split("\n"); _i < _a.length; _i++) {
                        line = _a[_i];
                        _b = line.split("\t"), project = _b[0], state = _b[1];
                        if (!project || !state)
                            continue;
                        if (state === "running")
                            out.set(project, "running");
                        else if (!out.has(project))
                            out.set(project, state);
                    }
                    return [2 /*return*/, out];
            }
        });
    });
}
// Destroy a compose project by force-removing its containers, volumes, and
// networks using raw docker commands. Works even when the compose file or
// worktree directory no longer exists (orphaned projects).
function destroyProject(project) {
    return __awaiter(this, void 0, void 0, function () {
        var ctr, ids, vol, vols, net, nets;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("docker", [
                        "ps",
                        "-a",
                        "-q",
                        "--filter",
                        "label=com.docker.compose.project=".concat(project)
                    ], { reject: false })];
                case 1:
                    ctr = _d.sent();
                    ids = ((_a = ctr.stdout) !== null && _a !== void 0 ? _a : "")
                        .split("\n")
                        .map(function (s) { return s.trim(); })
                        .filter(Boolean);
                    if (!(ids.length > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, execa_1.execa)("docker", __spreadArray(["rm", "-f"], ids, true), {
                            reject: false,
                            stdio: "ignore"
                        })];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3: return [4 /*yield*/, (0, execa_1.execa)("docker", ["volume", "ls", "-q", "--filter", "name=".concat(project, "_")], {
                        reject: false
                    })];
                case 4:
                    vol = _d.sent();
                    vols = ((_b = vol.stdout) !== null && _b !== void 0 ? _b : "")
                        .split("\n")
                        .map(function (s) { return s.trim(); })
                        .filter(Boolean);
                    if (!(vols.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, execa_1.execa)("docker", __spreadArray(["volume", "rm", "-f"], vols, true), {
                            reject: false,
                            stdio: "ignore"
                        })];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6: return [4 /*yield*/, (0, execa_1.execa)("docker", ["network", "ls", "-q", "--filter", "name=".concat(project, "_")], {
                        reject: false
                    })];
                case 7:
                    net = _d.sent();
                    nets = ((_c = net.stdout) !== null && _c !== void 0 ? _c : "")
                        .split("\n")
                        .map(function (s) { return s.trim(); })
                        .filter(Boolean);
                    if (!(nets.length > 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, execa_1.execa)("docker", __spreadArray(["network", "rm"], nets, true), {
                            reject: false,
                            stdio: "ignore"
                        })];
                case 8:
                    _d.sent();
                    _d.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
// List all docker compose project names that start with "carbon-".
function listCarbonProjects() {
    return __awaiter(this, void 0, void 0, function () {
        var r, all, _i, _a, line, name_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("docker", [
                        "ps",
                        "-a",
                        "--format",
                        '{{.Label "com.docker.compose.project"}}',
                        "--filter",
                        "label=com.docker.compose.project"
                    ], { reject: false })];
                case 1:
                    r = _c.sent();
                    all = new Set();
                    for (_i = 0, _a = ((_b = r.stdout) !== null && _b !== void 0 ? _b : "").split("\n"); _i < _a.length; _i++) {
                        line = _a[_i];
                        name_1 = line.trim();
                        if (name_1 && name_1.startsWith("carbon-"))
                            all.add(name_1);
                    }
                    return [2 /*return*/, __spreadArray([], all, true)];
            }
        });
    });
}
// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------
// Wipe one logical DB on shared redis via the container's bundled redis-cli —
// avoids requiring a host `redis-cli` install.
function flushDb(db) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("docker", ["exec", "carbon-redis", "redis-cli", "-n", String(db), "FLUSHDB"], { reject: false, stdio: "ignore" })];
                case 1:
                    r = _a.sent();
                    if (r.exitCode !== 0) {
                        prompts_1.log.warn("redis flush of db ".concat(db, " failed (skipped)"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------
function devArgs(slug) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    return __spreadArray(["compose", "-f", constants_js_1.COMPOSE_DEV_FILE, "-p", (0, worktree_js_1.projectName)(slug)], rest, true);
}
function execStrict(cmd, args, cwd) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)(cmd, args, { cwd: cwd, reject: false, preferLocal: true })];
                case 1:
                    r = _e.sent();
                    if (r.exitCode !== 0) {
                        process.stderr.write((_b = (_a = r.stderr) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "");
                        process.stdout.write((_d = (_c = r.stdout) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : "");
                        throw new Error("".concat(cmd, " ").concat(args.join(" "), " failed (exit ").concat(r.exitCode, ")"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
