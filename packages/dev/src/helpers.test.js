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
var node_fs_1 = require("node:fs");
var node_net_1 = require("node:net");
var node_os_1 = require("node:os");
var pathe_1 = require("pathe");
var vitest_1 = require("vitest");
var helpers_js_1 = require("./helpers.js");
(0, vitest_1.describe)("tryConnect", function () {
    var server;
    var port;
    (0, vitest_1.beforeEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var addr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    server = (0, node_net_1.createServer)();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            return server.listen(0, "127.0.0.1", resolve);
                        })];
                case 1:
                    _a.sent();
                    addr = server.address();
                    if (typeof addr === "object" && addr)
                        port = addr.port;
                    else
                        throw new Error("no port");
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.afterEach)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return server.close(function () { return resolve(); }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns true when the port accepts", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, helpers_js_1.tryConnect)("127.0.0.1", port)];
                case 1:
                    _a.apply(void 0, [_b.sent()]).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("returns false when nothing listens", function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return server.close(function () { return resolve(); }); })];
                case 1:
                    _b.sent();
                    _a = vitest_1.expect;
                    return [4 /*yield*/, (0, helpers_js_1.tryConnect)("127.0.0.1", port, 200)];
                case 2:
                    _a.apply(void 0, [_b.sent()]).toBe(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
(0, vitest_1.describe)("isAtLeastAsNew", function () {
    var dir;
    (0, vitest_1.beforeEach)(function () {
        dir = (0, node_fs_1.mkdtempSync)((0, pathe_1.join)((0, node_os_1.tmpdir)(), "carbon-dev-helpers-"));
    });
    (0, vitest_1.afterEach)(function () {
        (0, node_fs_1.rmSync)(dir, { recursive: true, force: true });
    });
    (0, vitest_1.it)("returns true when a is newer than b", function () {
        var a = (0, pathe_1.join)(dir, "a");
        var b = (0, pathe_1.join)(dir, "b");
        (0, node_fs_1.writeFileSync)(b, "");
        (0, node_fs_1.writeFileSync)(a, "");
        // bump a forward 1s
        (0, node_fs_1.utimesSync)(a, Date.now() / 1000 + 1, Date.now() / 1000 + 1);
        (0, vitest_1.expect)((0, helpers_js_1.isAtLeastAsNew)(a, b)).toBe(true);
    });
    (0, vitest_1.it)("returns true when a equals b mtime", function () {
        var a = (0, pathe_1.join)(dir, "a");
        var b = (0, pathe_1.join)(dir, "b");
        (0, node_fs_1.writeFileSync)(a, "");
        (0, node_fs_1.writeFileSync)(b, "");
        var t = Date.now() / 1000;
        (0, node_fs_1.utimesSync)(a, t, t);
        (0, node_fs_1.utimesSync)(b, t, t);
        (0, vitest_1.expect)((0, helpers_js_1.isAtLeastAsNew)(a, b)).toBe(true);
    });
    (0, vitest_1.it)("returns false when a is older than b", function () {
        var a = (0, pathe_1.join)(dir, "a");
        var b = (0, pathe_1.join)(dir, "b");
        (0, node_fs_1.writeFileSync)(a, "");
        (0, node_fs_1.writeFileSync)(b, "");
        (0, node_fs_1.utimesSync)(a, Date.now() / 1000 - 10, Date.now() / 1000 - 10);
        (0, vitest_1.expect)((0, helpers_js_1.isAtLeastAsNew)(a, b)).toBe(false);
    });
    (0, vitest_1.it)("returns false when either file is missing", function () {
        (0, vitest_1.expect)((0, helpers_js_1.isAtLeastAsNew)((0, pathe_1.join)(dir, "no-a"), (0, pathe_1.join)(dir, "no-b"))).toBe(false);
    });
});
(0, vitest_1.describe)("requireNumberEnv", function () {
    var KEY = "CARBON_TEST_REQUIRE_NUMBER_ENV";
    (0, vitest_1.afterEach)(function () {
        delete process.env[KEY];
    });
    (0, vitest_1.it)("returns the parsed number", function () {
        process.env[KEY] = "54321";
        (0, vitest_1.expect)((0, helpers_js_1.requireNumberEnv)(KEY)).toBe(54321);
    });
    (0, vitest_1.it)("throws when missing", function () {
        (0, vitest_1.expect)(function () { return (0, helpers_js_1.requireNumberEnv)(KEY); }).toThrow(/missing/);
    });
    (0, vitest_1.it)("throws when empty", function () {
        process.env[KEY] = "";
        (0, vitest_1.expect)(function () { return (0, helpers_js_1.requireNumberEnv)(KEY); }).toThrow(/missing/);
    });
    (0, vitest_1.it)("throws on non-numeric", function () {
        process.env[KEY] = "not-a-number";
        (0, vitest_1.expect)(function () { return (0, helpers_js_1.requireNumberEnv)(KEY); }).toThrow(/not a number/);
    });
});
