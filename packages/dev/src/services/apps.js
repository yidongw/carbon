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
exports.spawnApps = spawnApps;
exports.spawnStripeListener = spawnStripeListener;
exports.installDeps = installDeps;
exports.syncEnvSymlinks = syncEnvSymlinks;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var dotenv_1 = require("dotenv");
var execa_1 = require("execa");
var pathe_1 = require("pathe");
var picocolors_1 = require("picocolors");
var helpers_js_1 = require("../helpers.js");
var APP_COLORS = {
    erp: picocolors_1.default.cyan,
    mes: picocolors_1.default.magenta
};
// Drop portless banners (`-- ...`), pnpm script-echo (`> ...`), blanks.
// Vite "Local:", "ready in …", and errors pass through.
var NOISE_PATTERNS = [/^\s*--\s/, /^\s*>\s/, /^\s*$/];
function isNoiseLine(line) {
    // biome-ignore lint/suspicious/noControlCharactersInRegex: ignored using `--suppress`
    var plain = line.replace(/\x1b\[[0-9;]*m/g, "");
    return NOISE_PATTERNS.some(function (re) { return re.test(plain); });
}
// `portless` inherits `crbn`'s `process.env`; a stale shell `SUPABASE_URL`
// (e.g. `http://127.0.0.1:54321`) would otherwise win over `crbn`'s repo-root
// `.env.local`. Merge the same `.env*` stack as ERP Vite (app then repo, last
// wins) so spawned dev servers always see worktree URLs.
function spawnAppEnv(repoRoot, appId) {
    var env = __assign({}, process.env);
    var appRoot = (0, pathe_1.join)(repoRoot, "apps", appId);
    var mergeFile = function (abs) {
        if (!(0, node_fs_1.existsSync)(abs))
            return;
        Object.assign(env, (0, dotenv_1.parse)((0, node_fs_1.readFileSync)(abs, "utf8")));
    };
    mergeFile((0, pathe_1.join)(appRoot, ".env"));
    mergeFile((0, pathe_1.join)(appRoot, ".env.local"));
    mergeFile((0, pathe_1.join)(repoRoot, ".env"));
    mergeFile((0, pathe_1.join)(repoRoot, ".env.local"));
    return env;
}
var APP_PORT_KEYS = {
    erp: "PORT_ERP",
    mes: "PORT_MES"
};
var APP_URL_ENV_KEYS = {
    erp: "ERP_URL",
    mes: "MES_URL"
};
function spawnApps(opts) {
    var root = opts.root, apps = opts.apps, ports = opts.ports, portless = opts.portless;
    // When portless is active, apps talk to Supabase over HTTPS using
    // portless's self-signed CA. Tell Node to trust it.
    var caPath = (0, pathe_1.join)((0, node_os_1.homedir)(), ".portless", "ca.pem");
    var extraCaEnv = portless && (0, node_fs_1.existsSync)(caPath) ? { NODE_EXTRA_CA_CERTS: caPath } : {};
    var shuttingDown = false;
    var children = apps.map(function (id) {
        var _a;
        var color = (_a = APP_COLORS[id]) !== null && _a !== void 0 ? _a : (function (s) { return s; });
        // Spawn apps directly with assigned ports. Hostnames are registered via
        // `portless alias` (in registerAliases) so we control the exact format
        // (`<app>.<prefix>.dev`) without portless auto-prefix mangling.
        var portKey = APP_PORT_KEYS[id];
        var port = portKey ? ports[portKey] : undefined;
        var appEnv = spawnAppEnv(root, id);
        // Each app needs its own VERCEL_URL so auth redirects (magic link,
        // OAuth callback) return to the correct app, not always ERP.
        var urlKey = APP_URL_ENV_KEYS[id];
        var vercelUrl = urlKey ? appEnv[urlKey] : undefined;
        var child = (0, execa_1.execa)("pnpm", __spreadArray(__spreadArray([
            "exec",
            "react-router",
            "dev"
        ], (port !== undefined ? ["--port", String(port)] : []), true), [
            "--host",
            "127.0.0.1"
        ], false), {
            cwd: (0, pathe_1.join)(root, "apps", id),
            env: __assign(__assign(__assign(__assign(__assign({}, appEnv), extraCaEnv), { HOST: "127.0.0.1" }), (port !== undefined ? { PORT: String(port) } : {})), (vercelUrl ? { VERCEL_URL: vercelUrl } : {})),
            reject: false,
            stdin: "ignore",
            detached: true
        });
        var prefix = color(picocolors_1.default.bold("".concat(id.padEnd(3), " | ")));
        var pipe = function (stream, sink) {
            if (!stream)
                return;
            (0, helpers_js_1.readLines)(stream, function (line) {
                // Mute shutdown noise (EPIPE, ELIFECYCLE 143, esbuild "stopped").
                if (shuttingDown || isNoiseLine(line))
                    return;
                sink.write("".concat(prefix).concat(line, "\n"));
            });
        };
        pipe(child.stdout, process.stdout);
        pipe(child.stderr, process.stderr);
        return child;
    });
    var killTimer;
    var shutdown = function (signal) {
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var c = children_1[_i];
            if (c.exitCode !== null || !c.pid)
                continue;
            try {
                process.kill(-c.pid, signal);
            }
            catch (_a) {
                try {
                    c.kill(signal);
                    // biome-ignore lint/suspicious/noEmptyBlockStatements: ignored using `--suppress`
                }
                catch (_b) { }
            }
        }
    };
    var onSignal = function () {
        if (shuttingDown) {
            if (killTimer)
                clearTimeout(killTimer);
            shutdown("SIGKILL");
            return;
        }
        shuttingDown = true;
        process.stderr.write("\nstopping apps…\n");
        shutdown("SIGTERM");
        killTimer = setTimeout(function () { return shutdown("SIGKILL"); }, 3000);
    };
    var detach = (0, helpers_js_1.onShutdown)(onSignal);
    return Promise.all(children)
        .then(function () { return undefined; })
        .catch(function () { return undefined; })
        .finally(function () {
        if (killTimer)
            clearTimeout(killTimer);
        detach();
    });
}
function spawnStripeListener(root) {
    (0, execa_1.execa)("pnpm", ["run", "dev:stripe"], {
        cwd: root,
        detached: true,
        stdio: "ignore"
    }).unref();
}
// Skip when node_modules/.modules.yaml is newer than pnpm-lock.yaml (pnpm's
// post-install marker). Returns true when install actually ran.
function installDeps(root) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (depsInSync(root))
                        return [2 /*return*/, false];
                    return [4 /*yield*/, (0, execa_1.execa)("pnpm", ["install", "--prefer-offline"], {
                            cwd: root,
                            stdio: "inherit",
                            reject: false,
                            extendEnv: true
                        })];
                case 1:
                    r = _a.sent();
                    if (r.exitCode !== 0) {
                        throw new Error("pnpm install failed (exit ".concat(r.exitCode, ")"));
                    }
                    return [2 /*return*/, true];
            }
        });
    });
}
function depsInSync(root) {
    var lockfile = (0, pathe_1.join)(root, "pnpm-lock.yaml");
    var marker = (0, pathe_1.join)(root, "node_modules", ".modules.yaml");
    return (0, helpers_js_1.isAtLeastAsNew)(marker, lockfile);
}
function syncEnvSymlinks(root) {
    return __awaiter(this, void 0, void 0, function () {
        var r;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, execa_1.execa)("tsx", [(0, pathe_1.join)("scripts", "setup-env-files.ts")], {
                        cwd: root,
                        reject: false,
                        preferLocal: true
                    })];
                case 1:
                    r = _c.sent();
                    if (r.exitCode !== 0) {
                        process.stderr.write((_b = (_a = r.stderr) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "");
                        throw new Error("setup-env-files failed (exit ".concat(r.exitCode, ")"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
