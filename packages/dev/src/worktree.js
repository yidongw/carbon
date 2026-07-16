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
exports.SHARED_REDIS_PORT = exports.PORT_NAMES = void 0;
exports.resolveSlug = resolveSlug;
exports.persistSlug = persistSlug;
exports.getWorktreeRoot = getWorktreeRoot;
exports.projectName = projectName;
exports.sameWorktreePath = sameWorktreePath;
exports.ensureSlugAvailable = ensureSlugAvailable;
exports.slugify = slugify;
exports.resolveSlot = resolveSlot;
exports.getSlot = getSlot;
exports.listSlugs = listSlugs;
exports.removeSlot = removeSlot;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_net_1 = require("node:net");
var node_os_1 = require("node:os");
var execa_1 = require("execa");
var pathe_1 = require("pathe");
// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------
exports.PORT_NAMES = [
    "PORT_DB",
    "PORT_API",
    "PORT_STUDIO",
    "PORT_INBUCKET",
    "PORT_INNGEST",
    "PORT_ERP",
    "PORT_MES"
];
exports.SHARED_REDIS_PORT = 6379;
var REDIS_DB_MAX = 16;
var SLUG_FILE = ".carbon-worktree";
var REGISTRY_PATH = (0, pathe_1.join)((0, node_os_1.homedir)(), ".carbon", "dev-ports.json");
// ---------------------------------------------------------------------------
// Worktree identity (slug)
// ---------------------------------------------------------------------------
function resolveSlug(worktreeRoot) {
    var _a;
    var fromEnv = (_a = process.env.CARBON_WORKTREE) === null || _a === void 0 ? void 0 : _a.trim();
    if (fromEnv)
        return slugify(fromEnv);
    var filePath = (0, pathe_1.join)(worktreeRoot, SLUG_FILE);
    if ((0, node_fs_1.existsSync)(filePath)) {
        var fromFile = (0, node_fs_1.readFileSync)(filePath, "utf8").trim();
        if (fromFile)
            return slugify(fromFile);
    }
    return slugify((0, pathe_1.basename)(worktreeRoot));
}
function persistSlug(worktreeRoot, slug) {
    (0, node_fs_1.writeFileSync)((0, pathe_1.join)(worktreeRoot, SLUG_FILE), "".concat(slug, "\n"));
}
function getWorktreeRoot() {
    return __awaiter(this, void 0, void 0, function () {
        var r, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, execa_1.execa)("git", ["rev-parse", "--show-toplevel"])];
                case 1:
                    r = _b.sent();
                    return [2 /*return*/, r.stdout.trim()];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, process.cwd()];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function projectName(slug) {
    return "carbon-".concat(slug);
}
// Resolve symlinks + normalize separators / trailing slashes so two strings
// pointing at the same worktree compare equal (e.g. /tmp/x vs symlinked path).
function canonicalWorktreePath(input) {
    var p = input.trim();
    try {
        p = node_fs_1.realpathSync.native(p);
    }
    catch (_a) {
        // Best-effort: fall through to string normalization.
    }
    return (0, pathe_1.normalize)(p).replace(/\/+$/, "");
}
function sameWorktreePath(a, b) {
    return canonicalWorktreePath(a) === canonicalWorktreePath(b);
}
function ensureSlugAvailable(slug, worktreeRoot) {
    return __awaiter(this, void 0, void 0, function () {
        var project, runningPath, r, out, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    project = projectName(slug);
                    runningPath = null;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, execa_1.execa)("docker", [
                            "ps",
                            "--filter",
                            "label=com.docker.compose.project=".concat(project),
                            "--format",
                            '{{.Label "com.docker.compose.project.working_dir"}}'
                        ], { reject: false })];
                case 2:
                    r = _c.sent();
                    out = r.stdout.trim();
                    if (out)
                        runningPath = (_b = out.split("\n")[0]) !== null && _b !== void 0 ? _b : null;
                    return [3 /*break*/, 4];
                case 3:
                    _a = _c.sent();
                    return [2 /*return*/];
                case 4:
                    if (runningPath && !sameWorktreePath(runningPath, worktreeRoot)) {
                        throw new Error("Slug \"".concat(slug, "\" is already in use by another worktree at:\n  ").concat(runningPath, "\n\nSet CARBON_WORKTREE to a unique slug for this worktree, or stop the other stack."));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function slugify(input) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-+/g, "-");
}
// ---------------------------------------------------------------------------
// Per-worktree slot (ports + redis db + jwt creds)
// ---------------------------------------------------------------------------
function resolveSlot(slug, worktreeRoot) {
    return __awaiter(this, void 0, void 0, function () {
        var registry, existing, allFree, _a, claimedPorts, claimedDbs, ports, redisDb, jwt;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    registry = readRegistry();
                    existing = registry[slug];
                    if (!(existing && sameWorktreePath(existing.worktreeRoot, worktreeRoot))) return [3 /*break*/, 2];
                    return [4 /*yield*/, portsAvailable(Object.values(existing.ports))];
                case 1:
                    allFree = _c.sent();
                    if (allFree) {
                        return [2 /*return*/, {
                                ports: existing.ports,
                                redisDb: existing.redisDb,
                                jwt: existing.jwt
                            }];
                    }
                    _c.label = 2;
                case 2:
                    _a = collectClaims(registry, slug), claimedPorts = _a.claimedPorts, claimedDbs = _a.claimedDbs;
                    return [4 /*yield*/, pickPorts(claimedPorts)];
                case 3:
                    ports = _c.sent();
                    redisDb = pickRedisDb(claimedDbs);
                    jwt = (_b = existing === null || existing === void 0 ? void 0 : existing.jwt) !== null && _b !== void 0 ? _b : generateJwtCreds();
                    registry[slug] = { worktreeRoot: worktreeRoot, ports: ports, redisDb: redisDb, jwt: jwt };
                    writeRegistry(registry);
                    return [2 /*return*/, { ports: ports, redisDb: redisDb, jwt: jwt }];
            }
        });
    });
}
function collectClaims(registry, excludeSlug) {
    var claimedPorts = new Set();
    var claimedDbs = new Set();
    for (var _i = 0, _a = Object.entries(registry); _i < _a.length; _i++) {
        var _b = _a[_i], s = _b[0], entry = _b[1];
        if (s === excludeSlug)
            continue;
        for (var _c = 0, _d = Object.values(entry.ports); _c < _d.length; _c++) {
            var p = _d[_c];
            claimedPorts.add(p);
        }
        claimedDbs.add(entry.redisDb);
    }
    return { claimedPorts: claimedPorts, claimedDbs: claimedDbs };
}
function getSlot(slug) {
    var _a;
    return (_a = readRegistry()[slug]) !== null && _a !== void 0 ? _a : null;
}
function listSlugs() {
    return readRegistry();
}
function removeSlot(slug) {
    var registry = readRegistry();
    if (!(slug in registry))
        return;
    delete registry[slug];
    writeRegistry(registry);
}
// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------
function readRegistry() {
    if (!(0, node_fs_1.existsSync)(REGISTRY_PATH))
        return {};
    var raw;
    try {
        raw = JSON.parse((0, node_fs_1.readFileSync)(REGISTRY_PATH, "utf8"));
    }
    catch (_a) {
        return {};
    }
    return parseRegistry(raw);
}
// Drop entries that don't match the expected shape rather than letting silently
// corrupt JSON poison `crbn up`. Returning {} on outer failure would re-allocate
// fresh slots and break running stacks — drop-bad-entries preserves the good
// ones and only forces re-allocation for the corrupt slugs.
function parseRegistry(raw) {
    if (!raw || typeof raw !== "object")
        return {};
    var out = {};
    for (var _i = 0, _a = Object.entries(raw); _i < _a.length; _i++) {
        var _b = _a[_i], slug = _b[0], value = _b[1];
        var entry = parseRegistryEntry(value);
        if (entry)
            out[slug] = entry;
    }
    return out;
}
function parseRegistryEntry(raw) {
    if (!raw || typeof raw !== "object")
        return null;
    var r = raw;
    if (typeof r.worktreeRoot !== "string")
        return null;
    if (!isPortMap(r.ports))
        return null;
    if (typeof r.redisDb !== "number" || !Number.isInteger(r.redisDb))
        return null;
    if (!isJwtCreds(r.jwt))
        return null;
    return {
        worktreeRoot: r.worktreeRoot,
        ports: r.ports,
        redisDb: r.redisDb,
        jwt: r.jwt
    };
}
function isPortMap(v) {
    if (!v || typeof v !== "object")
        return false;
    var o = v;
    for (var _i = 0, PORT_NAMES_1 = exports.PORT_NAMES; _i < PORT_NAMES_1.length; _i++) {
        var name_1 = PORT_NAMES_1[_i];
        if (typeof o[name_1] !== "number" || !Number.isInteger(o[name_1]))
            return false;
    }
    return true;
}
function isJwtCreds(v) {
    if (!v || typeof v !== "object")
        return false;
    var j = v;
    return (typeof j.secret === "string" &&
        j.secret.length > 0 &&
        typeof j.anonKey === "string" &&
        typeof j.serviceKey === "string");
}
function writeRegistry(registry) {
    (0, node_fs_1.mkdirSync)((0, pathe_1.dirname)(REGISTRY_PATH), { recursive: true });
    (0, node_fs_1.writeFileSync)(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}
function pickRedisDb(taken) {
    for (var i = 0; i < REDIS_DB_MAX; i++) {
        if (!taken.has(i))
            return i;
    }
    throw new Error("Redis DB pool exhausted (max ".concat(REDIS_DB_MAX, "). Free a slot via `crbn remove`."));
}
function isPortAvailable(port) {
    return new Promise(function (resolve) {
        var server = node_net_1.default.createServer();
        server.unref();
        server.once("error", function () { return resolve(false); });
        server.listen(port, "127.0.0.1", function () {
            server.close(function () { return resolve(true); });
        });
    });
}
function portsAvailable(ports) {
    return __awaiter(this, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(ports.map(isPortAvailable))];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results.every(Boolean)];
            }
        });
    });
}
function pickPorts(claimed) {
    return __awaiter(this, void 0, void 0, function () {
        var ports, _i, PORT_NAMES_2, name_2, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    ports = {};
                    _i = 0, PORT_NAMES_2 = exports.PORT_NAMES;
                    _c.label = 1;
                case 1:
                    if (!(_i < PORT_NAMES_2.length)) return [3 /*break*/, 4];
                    name_2 = PORT_NAMES_2[_i];
                    _a = ports;
                    _b = name_2;
                    return [4 /*yield*/, pickFreePort(claimed)];
                case 2:
                    _a[_b] = _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, ports];
            }
        });
    });
}
function pickFreePort(taken) {
    return __awaiter(this, void 0, void 0, function () {
        var attempt, port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attempt = 0;
                    _a.label = 1;
                case 1:
                    if (!(attempt < 100)) return [3 /*break*/, 4];
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var server = node_net_1.default.createServer();
                            server.unref();
                            server.on("error", reject);
                            server.listen(0, "127.0.0.1", function () {
                                var addr = server.address();
                                if (typeof addr === "object" && addr) {
                                    var p_1 = addr.port;
                                    server.close(function () { return resolve(p_1); });
                                }
                                else {
                                    server.close();
                                    reject(new Error("could not determine port"));
                                }
                            });
                        })];
                case 2:
                    port = _a.sent();
                    if (!taken.has(port)) {
                        taken.add(port);
                        return [2 /*return*/, port];
                    }
                    _a.label = 3;
                case 3:
                    attempt++;
                    return [3 /*break*/, 1];
                case 4: throw new Error("Failed to allocate a free port after 100 attempts");
            }
        });
    });
}
// Mint a fresh JWT_SECRET + the matching `anon` and `service_role` HS256 JWTs.
// Mirrors supabase's well-known dev token shape so all downstream services
// (gotrue, postgrest, kong, storage, studio) accept them without further config.
function generateJwtCreds() {
    // 32-byte (256-bit) secret, hex-encoded — matches HS256 key strength.
    var secret = (0, node_crypto_1.randomBytes)(32).toString("hex");
    var iat = Math.floor(Date.now() / 1000);
    var exp = iat + 10 * 365 * 24 * 60 * 60; // 10 years
    var anonKey = signJwt({ iss: "supabase-demo", role: "anon", iat: iat, exp: exp }, secret);
    var serviceKey = signJwt({ iss: "supabase-demo", role: "service_role", iat: iat, exp: exp }, secret);
    return { secret: secret, anonKey: anonKey, serviceKey: serviceKey };
}
function signJwt(payload, secret) {
    var header = { alg: "HS256", typ: "JWT" };
    var h = b64url(JSON.stringify(header));
    var p = b64url(JSON.stringify(payload));
    var data = "".concat(h, ".").concat(p);
    var sig = b64url((0, node_crypto_1.createHmac)("sha256", secret).update(data).digest());
    return "".concat(data, ".").concat(sig);
}
function b64url(input) {
    var buf = typeof input === "string" ? Buffer.from(input) : input;
    return buf
        .toString("base64")
        .replace(/=+$/, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
}
