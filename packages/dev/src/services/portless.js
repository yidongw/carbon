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
exports.ensurePortlessInstalled = ensurePortlessInstalled;
exports.startProxyDaemon = startProxyDaemon;
exports.ensureProxyPrivileges = ensureProxyPrivileges;
exports.syncHostsFile = syncHostsFile;
exports.proxyRunsAsRoot = proxyRunsAsRoot;
exports.hostsFileInSync = hostsFileInSync;
exports.waitForProxyReady = waitForProxyReady;
exports.registerAliases = registerAliases;
exports.unregisterAliases = unregisterAliases;
exports.pruneStaleRoutes = pruneStaleRoutes;
exports.branchToPrefix = branchToPrefix;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var promises_1 = require("node:timers/promises");
var prompts_1 = require("@clack/prompts");
var execa_1 = require("execa");
var picocolors_1 = require("picocolors");
var constants_js_1 = require("../constants.js");
// Strip npm_* / PNPM_* so portless doesn't refuse with "should not be run via
// npx or pnpm dlx" when invoked from `pnpm exec tsx`. Pair with
// `extendEnv: false` on the execa call.
function portlessEnv() {
    var out = {};
    for (var _i = 0, _a = Object.entries(process.env); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        if (k.startsWith("PNPM_") || k.startsWith("npm_"))
            continue;
        out[k] = v;
    }
    return out;
}
// `sudo` preserves HOME so portless state lands in the user's ~/.portless
// rather than /var/root/.portless.
function sudoPortless(args) {
    return __spreadArray(["HOME=".concat((0, node_os_1.homedir)()), "portless"], args, true);
}
function ensurePortlessInstalled() {
    return __awaiter(this, void 0, void 0, function () {
        var installed, autoYes, ok, s, r, stderr, stdout, combined, after;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, detectPortlessVersion()];
                case 1:
                    installed = _c.sent();
                    if (installed && cmpSemver(installed, constants_js_1.PORTLESS_MIN_VERSION) >= 0)
                        return [2 /*return*/];
                    if (!installed) {
                        prompts_1.log.warn("portless is not installed globally. Required for app routing (".concat(constants_js_1.PORTLESS_MIN_VERSION, "+)."));
                    }
                    else {
                        prompts_1.log.warn("portless v".concat(installed, " is too old. Need ").concat(constants_js_1.PORTLESS_MIN_VERSION, "+ for monorepo + package.json config."));
                    }
                    autoYes = process.env.CARBON_DEV_YES === "1" || !process.stdin.isTTY;
                    if (!!autoYes) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, prompts_1.confirm)({
                            message: "Install portless@latest globally now?",
                            initialValue: true
                        })];
                case 2:
                    ok = _c.sent();
                    if ((0, prompts_1.isCancel)(ok) || !ok) {
                        throw new Error("Aborted. Install manually: ".concat(picocolors_1.default.cyan("npm install -g portless@latest"), " (or bun/pnpm equivalent)."));
                    }
                    return [3 /*break*/, 4];
                case 3:
                    prompts_1.log.info("auto-installing portless (non-interactive / CARBON_DEV_YES=1)");
                    _c.label = 4;
                case 4:
                    s = (0, prompts_1.spinner)();
                    s.start("installing portless@latest globally (pnpm add -g)");
                    return [4 /*yield*/, (0, execa_1.execa)("pnpm", ["add", "-g", "portless@latest"], {
                            reject: false
                        })];
                case 5:
                    r = _c.sent();
                    if (r.exitCode !== 0) {
                        s.stop("✗ install failed");
                        stderr = (_a = r.stderr) !== null && _a !== void 0 ? _a : "";
                        stdout = (_b = r.stdout) !== null && _b !== void 0 ? _b : "";
                        combined = "".concat(stderr, "\n").concat(stdout);
                        // Fresh dev box: pnpm has no global bin dir. Surface pnpm's setup fix.
                        if (/ERR_PNPM_NO_GLOBAL_BIN_DIR/.test(combined)) {
                            prompts_1.log.error("pnpm has no global bin directory configured.");
                            prompts_1.log.message([
                                "To fix this, run pnpm's one-time setup (creates ~/.local/share/pnpm",
                                "and writes PNPM_HOME to your shell rc), then re-run `crbn up`:",
                                "",
                                "    ".concat(picocolors_1.default.cyan("pnpm setup")),
                                "    ".concat(picocolors_1.default.cyan("source ~/.zshrc   # or open a new shell")),
                                "    ".concat(picocolors_1.default.cyan("crbn up")),
                                "",
                                "Alternative — install portless via npm instead:",
                                "",
                                "    ".concat(picocolors_1.default.cyan("npm install -g portless@latest"))
                            ].join("\n"));
                            throw new Error("portless install aborted: pnpm global bin dir missing");
                        }
                        process.stderr.write(stderr);
                        throw new Error("pnpm add -g portless failed (exit ".concat(r.exitCode, "). Manual fallback: ").concat(picocolors_1.default.cyan("npm install -g portless@latest")));
                    }
                    return [4 /*yield*/, detectPortlessVersion()];
                case 6:
                    after = _c.sent();
                    s.stop("portless v".concat(after !== null && after !== void 0 ? after : "?", " installed"));
                    return [2 /*return*/];
            }
        });
    });
}
function startProxyDaemon(root) {
    (0, execa_1.execa)("portless", ["proxy", "start"], {
        cwd: root,
        detached: true,
        stdio: "ignore",
        preferLocal: true,
        extendEnv: false,
        env: portlessEnv()
    }).unref();
}
// Must match render-env.ts hostnames + the api.carbon.dev OAuth alias.
var PORTLESS_TLD = "dev";
function detectPrivilegeIssues() {
    var issues = [];
    var portFile = "".concat((0, node_os_1.homedir)(), "/.portless/proxy.port");
    var pidFile = "".concat((0, node_os_1.homedir)(), "/.portless/proxy.pid");
    if (!(0, node_fs_1.existsSync)(portFile) || !(0, node_fs_1.existsSync)(pidFile)) {
        issues.push({ kind: "not_running" });
        return issues;
    }
    var pid = Number((0, node_fs_1.readFileSync)(pidFile, "utf8").trim());
    if (!isProcessAlive(pid)) {
        issues.push({ kind: "not_running" });
        return issues;
    }
    var port = Number((0, node_fs_1.readFileSync)(portFile, "utf8").trim());
    if (port && port !== 80 && port !== 443) {
        issues.push({ kind: "wrong_port", port: port });
    }
    return issues;
}
// Treat EPERM as alive — root-owned portless daemon is still serving even
// when we (normal user) can't signal it.
function isProcessAlive(pid) {
    try {
        process.kill(pid, 0);
        return true;
    }
    catch (err) {
        return err.code === "EPERM";
    }
}
function describeIssues(issues) {
    return issues
        .map(function (i) {
        return i.kind === "not_running"
            ? "portless proxy not running"
            : "proxy on :".concat(i.port, " (not :443; URLs would need port suffix)");
    })
        .join("\n  • ");
}
// portless needs sudo to bind :443 and write /etc/hosts. `.dev` is a public
// HSTS-preloaded TLD so we rely on /etc/hosts (no /etc/resolver/<tld> for
// public TLDs).
function ensureProxyPrivileges() {
    return __awaiter(this, void 0, void 0, function () {
        var issues, isWindows, elevateHint, proceed, manual, elevate, start, trust, remaining;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    issues = detectPrivilegeIssues();
                    if (issues.length === 0)
                        return [2 /*return*/];
                    isWindows = process.platform === "win32";
                    prompts_1.log.warn([
                        "portless needs a privileged proxy to serve `*.dev` cleanly:",
                        "",
                        "  \u2022 ".concat(describeIssues(issues)),
                        "",
                        "Without :443 + /etc/hosts entries, browsers hit the public `.dev` TLD",
                        "(NXDOMAIN) or you'd have to type `:<port>` after every URL."
                    ].join("\n"));
                    elevateHint = isWindows
                        ? "Will bind :443, install the local CA, and write hosts entries (requires Administrator terminal)."
                        : "Set it up now? Will run sudo to bind :443, install the local CA, and write /etc/hosts entries.";
                    return [4 /*yield*/, (0, prompts_1.confirm)({
                            message: elevateHint,
                            initialValue: true
                        })];
                case 1:
                    proceed = _a.sent();
                    if ((0, prompts_1.isCancel)(proceed) || !proceed) {
                        manual = isWindows
                            ? "Aborted. Run in an Administrator terminal: `portless proxy stop && portless proxy start --tld dev && portless trust`. Then re-run `crbn up`."
                            : "Aborted. Run manually: `sudo portless proxy stop && sudo portless proxy start --tld dev && sudo portless trust`. Then re-run `crbn up`.";
                        throw new Error(manual);
                    }
                    if (isWindows) {
                        prompts_1.log.info("running privileged commands — ensure this terminal is running as Administrator");
                    }
                    else {
                        prompts_1.log.info("running sudo commands — you'll be prompted for your password");
                    }
                    elevate = function (args) {
                        return isWindows
                            ? (0, execa_1.execa)("portless", args, { stdio: "inherit", reject: false })
                            : (0, execa_1.execa)("sudo", sudoPortless(args), { stdio: "inherit", reject: false });
                    };
                    return [4 /*yield*/, elevate(["proxy", "stop"])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, elevate(["proxy", "start", "--tld", PORTLESS_TLD])];
                case 3:
                    start = _a.sent();
                    if (start.exitCode !== 0) {
                        throw new Error("portless proxy start failed (exit ".concat(start.exitCode, ")"));
                    }
                    return [4 /*yield*/, elevate(["trust"])];
                case 4:
                    trust = _a.sent();
                    if (trust.exitCode !== 0) {
                        prompts_1.log.warn("portless trust failed (exit ".concat(trust.exitCode, "); browsers may show cert warnings until you run it manually."));
                    }
                    remaining = detectPrivilegeIssues();
                    if (remaining.length > 0) {
                        throw new Error("portless setup still incomplete:\n  \u2022 ".concat(describeIssues(remaining)));
                    }
                    prompts_1.log.success("portless proxy on :443");
                    return [2 /*return*/];
            }
        });
    });
}
// Push registered routes into /etc/hosts. Needs elevated privileges; idempotent.
function syncHostsFile() {
    return __awaiter(this, void 0, void 0, function () {
        var isWindows, cmd, args, r, hint;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isWindows = process.platform === "win32";
                    cmd = isWindows ? "portless" : "sudo";
                    args = isWindows ? ["hosts", "sync"] : sudoPortless(["hosts", "sync"]);
                    return [4 /*yield*/, (0, execa_1.execa)(cmd, args, {
                            stdio: "inherit",
                            reject: false
                        })];
                case 1:
                    r = _a.sent();
                    if (r.exitCode !== 0) {
                        hint = isWindows
                            ? "Run this command in an Administrator terminal to fix DNS."
                            : "Run it manually to fix DNS.";
                        throw new Error("".concat(isWindows ? "" : "sudo ", "portless hosts sync failed (exit ").concat(r.exitCode, "). ").concat(hint));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// Root proxy daemon watches routes.json (fs.watch) and writes /etc/hosts
// itself — skip our manual sudo sync.
function proxyRunsAsRoot() {
    var pidFile = "".concat((0, node_os_1.homedir)(), "/.portless/proxy.pid");
    if (!(0, node_fs_1.existsSync)(pidFile))
        return false;
    var pid = Number((0, node_fs_1.readFileSync)(pidFile, "utf8").trim());
    if (!pid)
        return false;
    try {
        var r = (0, execa_1.execaSync)("ps", ["-p", String(pid), "-o", "user="]);
        return r.stdout.trim() === "root";
    }
    catch (_a) {
        return false;
    }
}
// True when every routes.json hostname appears inside /etc/hosts's
// portless-managed block. Lets `crbn up` skip the sudo sync on unchanged runs.
function hostsFileInSync() {
    var routesPath = "".concat((0, node_os_1.homedir)(), "/.portless/routes.json");
    if (!(0, node_fs_1.existsSync)(routesPath))
        return true; // nothing to sync
    var hosts;
    try {
        hosts = JSON.parse((0, node_fs_1.readFileSync)(routesPath, "utf8"));
    }
    catch (_a) {
        return false;
    }
    var desired = new Set(hosts.map(function (h) { return h.hostname; }));
    if (desired.size === 0)
        return true;
    var etcHosts;
    try {
        etcHosts = (0, node_fs_1.readFileSync)("/etc/hosts", "utf8");
    }
    catch (_b) {
        return false;
    }
    // Only check inside portless-managed block; outside is user-controlled.
    var startIdx = etcHosts.indexOf("# portless-start");
    var endIdx = etcHosts.indexOf("# portless-end");
    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx)
        return false;
    var block = etcHosts.slice(startIdx, endIdx);
    var present = new Set();
    for (var _i = 0, _c = block.split("\n"); _i < _c.length; _i++) {
        var line = _c[_i];
        var m = line.match(/^\s*\d+\.\d+\.\d+\.\d+\s+(\S+)/);
        if (m && m[1])
            present.add(m[1]);
    }
    for (var _d = 0, desired_1 = desired; _d < desired_1.length; _d++) {
        var h = desired_1[_d];
        if (!present.has(h))
            return false;
    }
    return true;
}
function waitForProxyReady() {
    return __awaiter(this, arguments, void 0, function (timeoutMs) {
        var tldFile, pidFile, deadline, pid;
        if (timeoutMs === void 0) { timeoutMs = 30000; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tldFile = "".concat((0, node_os_1.homedir)(), "/.portless/proxy.tld");
                    pidFile = "".concat((0, node_os_1.homedir)(), "/.portless/proxy.pid");
                    deadline = Date.now() + timeoutMs;
                    _a.label = 1;
                case 1:
                    if (!(Date.now() < deadline)) return [3 /*break*/, 5];
                    if (!((0, node_fs_1.existsSync)(tldFile) && (0, node_fs_1.existsSync)(pidFile))) return [3 /*break*/, 3];
                    pid = Number((0, node_fs_1.readFileSync)(pidFile, "utf8").trim());
                    if (!isProcessAlive(pid)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, promises_1.setTimeout)(500)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3: return [4 /*yield*/, (0, promises_1.setTimeout)(500)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function registerAliases(root, branchPrefix, ports) {
    return __awaiter(this, void 0, void 0, function () {
        var aliases;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    aliases = aliasMap(branchPrefix, ports);
                    return [4 /*yield*/, Promise.all(aliases.map(function (a) {
                            return (0, execa_1.execa)("portless", ["alias", a.name, String(a.port), "--force"], {
                                cwd: root,
                                reject: false,
                                stdio: "ignore",
                                preferLocal: true,
                                extendEnv: false,
                                env: portlessEnv()
                            });
                        }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, aliases.length];
            }
        });
    });
}
function unregisterAliases(root, branchPrefix) {
    return __awaiter(this, void 0, void 0, function () {
        var names;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    names = aliasMap(branchPrefix, {}).map(function (a) { return a.name; });
                    return [4 /*yield*/, Promise.all(names.map(function (name) {
                            return (0, execa_1.execa)("portless", ["alias", "--remove", name], {
                                cwd: root,
                                reject: false,
                                stdio: "ignore",
                                preferLocal: true,
                                extendEnv: false,
                                env: portlessEnv()
                            });
                        }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Let portless handle its own cleanup — kills orphaned dev servers from
// crashed sessions and removes their stale route entries.
function pruneStaleRoutes() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("portless", ["prune"], {
                        reject: false,
                        stdio: "ignore",
                        extendEnv: false,
                        env: portlessEnv()
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Branch-independent OAuth callback host. Last `crbn up` wins. Keep in sync
// with SUPABASE_AUTH_EXTERNAL_*_REDIRECT_URI in render-env.ts.
var STABLE_OAUTH_ALIAS = "api.carbon";
// Always prefix with the branch name (last `/`-segment, sanitized) so every
// worktree — including main — gets a distinct `<app>.<branch>.dev` host.
// Bare hosts (`erp.dev`, `api.dev`) are forbidden; falls back to `fallback`
// (typically the worktree slug) when branch is missing/HEAD-detached.
// e.g. `feat/boo` → `boo`, `main` → `main`.
function branchToPrefix(branch, fallback) {
    var _a;
    if (!branch || branch === "HEAD")
        return fallback;
    var last = (_a = branch.split("/").pop()) !== null && _a !== void 0 ? _a : "";
    var sanitized = last
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-+/g, "-");
    return sanitized || fallback;
}
function withPrefix(name, prefix) {
    return "".concat(name, ".").concat(prefix);
}
// All portless-routed services: compose services + apps. Every hostname
// follows `<name>.<prefix>.dev` via `portless alias` so we control the
// exact format without relying on portless auto-prefix (which reverses
// the order in linked worktrees).
function aliasMap(branchPrefix, ports) {
    return [
        { name: withPrefix("erp", branchPrefix), port: ports.PORT_ERP },
        { name: withPrefix("mes", branchPrefix), port: ports.PORT_MES },
        { name: withPrefix("api", branchPrefix), port: ports.PORT_API },
        { name: withPrefix("studio", branchPrefix), port: ports.PORT_STUDIO },
        { name: withPrefix("mail", branchPrefix), port: ports.PORT_INBUCKET },
        { name: withPrefix("inngest", branchPrefix), port: ports.PORT_INNGEST },
        { name: STABLE_OAUTH_ALIAS, port: ports.PORT_API }
    ];
}
function detectPortlessVersion() {
    return __awaiter(this, void 0, void 0, function () {
        var r, m;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("portless", ["--version"], {
                        reject: false,
                        extendEnv: false,
                        env: portlessEnv()
                    })];
                case 1:
                    r = _a.sent();
                    if (r.exitCode !== 0)
                        return [2 /*return*/, null];
                    m = r.stdout.match(/(\d+)\.(\d+)\.(\d+)/);
                    return [2 /*return*/, m ? m[0] : null];
            }
        });
    });
}
function cmpSemver(a, b) {
    var _a, _b, _c, _d;
    var pa = a.split(".").map(Number);
    var pb = b.split(".").map(Number);
    for (var i = 0; i < 3; i++) {
        if (((_a = pa[i]) !== null && _a !== void 0 ? _a : 0) !== ((_b = pb[i]) !== null && _b !== void 0 ? _b : 0))
            return ((_c = pa[i]) !== null && _c !== void 0 ? _c : 0) - ((_d = pb[i]) !== null && _d !== void 0 ? _d : 0);
    }
    return 0;
}
