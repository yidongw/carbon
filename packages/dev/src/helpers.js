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
exports.tryConnect = tryConnect;
exports.waitForPort = waitForPort;
exports.readLines = readLines;
exports.isAtLeastAsNew = isAtLeastAsNew;
exports.requireNumberEnv = requireNumberEnv;
exports.onShutdown = onShutdown;
var node_fs_1 = require("node:fs");
var node_net_1 = require("node:net");
var node_readline_1 = require("node:readline");
var promises_1 = require("node:timers/promises");
// ---------------------------------------------------------------------------
// TCP readiness probes
// ---------------------------------------------------------------------------
/** Resolve true when host:port accepts a connection within `timeoutMs`. */
function tryConnect(host, port, timeoutMs) {
    if (timeoutMs === void 0) { timeoutMs = 2000; }
    return new Promise(function (resolve) {
        var socket = node_net_1.default.connect({ host: host, port: port });
        var done = function (ok) {
            socket.removeAllListeners();
            socket.destroy();
            resolve(ok);
        };
        socket.once("connect", function () { return done(true); });
        socket.once("error", function () { return done(false); });
        socket.setTimeout(timeoutMs, function () { return done(false); });
    });
}
/** Poll `tryConnect` until it succeeds or `timeoutMs` elapses. */
function waitForPort(port_1, timeoutMs_1) {
    return __awaiter(this, arguments, void 0, function (port, timeoutMs, host) {
        var deadline;
        if (host === void 0) { host = "127.0.0.1"; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deadline = Date.now() + timeoutMs;
                    _a.label = 1;
                case 1:
                    if (!(Date.now() < deadline)) return [3 /*break*/, 4];
                    return [4 /*yield*/, tryConnect(host, port)];
                case 2:
                    if (_a.sent())
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, promises_1.setTimeout)(500)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 4: throw new Error("timed out waiting for tcp:".concat(port, " after ").concat(timeoutMs, "ms"));
            }
        });
    });
}
// ---------------------------------------------------------------------------
// Streaming line reader
// ---------------------------------------------------------------------------
/**
 * Invoke `onLine` once per line from `stream`. Backed by node's native
 * `readline.createInterface`, which buffers in C++ and avoids the per-chunk
 * `buf += chunk.toString(); split('\n')` allocations we used to do by hand.
 */
function readLines(stream, onLine) {
    var rl = (0, node_readline_1.createInterface)({ input: stream, crlfDelay: Infinity });
    rl.on("line", onLine);
}
// ---------------------------------------------------------------------------
// File mtime compare
// ---------------------------------------------------------------------------
/**
 * True when file `a` is at least as recently modified as `b`. False if either
 * is missing. Used to gate "is X already in sync with Y" decisions.
 */
function isAtLeastAsNew(a, b) {
    if (!(0, node_fs_1.existsSync)(a) || !(0, node_fs_1.existsSync)(b))
        return false;
    try {
        return (0, node_fs_1.statSync)(a).mtimeMs >= (0, node_fs_1.statSync)(b).mtimeMs;
    }
    catch (_a) {
        return false;
    }
}
// ---------------------------------------------------------------------------
// Env var coercion
// ---------------------------------------------------------------------------
/** Read `process.env[name]` as a number. Throws a clear error if missing or NaN. */
function requireNumberEnv(name) {
    var raw = process.env[name];
    if (raw === undefined || raw === "") {
        throw new Error("env var ".concat(name, " is missing"));
    }
    var n = Number(raw);
    if (!Number.isFinite(n)) {
        throw new Error("env var ".concat(name, " is not a number (got \"").concat(raw, "\")"));
    }
    return n;
}
// ---------------------------------------------------------------------------
// Shutdown signal helper
// ---------------------------------------------------------------------------
var SHUTDOWN_SIGNALS = [
    "SIGINT",
    "SIGTERM",
    "SIGHUP",
    "SIGBREAK"
];
/**
 * Register a handler for SIGINT/SIGTERM/SIGHUP/SIGBREAK. Returns a cleanup
 * function that unregisters them all — pair with try/finally.
 */
function onShutdown(handler) {
    for (var _i = 0, SHUTDOWN_SIGNALS_1 = SHUTDOWN_SIGNALS; _i < SHUTDOWN_SIGNALS_1.length; _i++) {
        var s = SHUTDOWN_SIGNALS_1[_i];
        process.on(s, handler);
    }
    return function () {
        for (var _i = 0, SHUTDOWN_SIGNALS_2 = SHUTDOWN_SIGNALS; _i < SHUTDOWN_SIGNALS_2.length; _i++) {
            var s = SHUTDOWN_SIGNALS_2[_i];
            process.off(s, handler);
        }
    };
}
