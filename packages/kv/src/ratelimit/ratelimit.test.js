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
var vitest_1 = require("vitest");
var ratelimit_1 = require("./ratelimit");
// Create a mock Redis client
var createMockRedis = function () {
    var storage = new Map();
    var hashStorage = new Map();
    return {
        eval: vitest_1.vi.fn(),
        del: vitest_1.vi.fn().mockImplementation(function () {
            var keys = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                keys[_i] = arguments[_i];
            }
            keys.forEach(function (key) {
                storage.delete(key);
                hashStorage.delete(key);
            });
            return Promise.resolve(keys.length);
        }),
        get: vitest_1.vi.fn().mockImplementation(function (key) {
            var _a;
            return Promise.resolve((_a = storage.get(key)) !== null && _a !== void 0 ? _a : null);
        }),
        set: vitest_1.vi.fn().mockImplementation(function (key, value) {
            storage.set(key, value);
            return Promise.resolve("OK");
        }),
        // Helper to access internal storage for testing
        _storage: storage,
        _hashStorage: hashStorage
    };
};
(0, vitest_1.describe)("Ratelimit", function () {
    var mockRedis;
    (0, vitest_1.beforeEach)(function () {
        mockRedis = createMockRedis();
        vitest_1.vi.useFakeTimers();
        vitest_1.vi.setSystemTime(new Date("2024-01-01T00:00:00.000Z"));
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)("constructor", function () {
        (0, vitest_1.it)("should create a ratelimiter with default options", function () {
            var ratelimit = new ratelimit_1.Ratelimit({
                redis: mockRedis,
                limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h")
            });
            (0, vitest_1.expect)(ratelimit).toBeInstanceOf(ratelimit_1.Ratelimit);
        });
        (0, vitest_1.it)("should create a ratelimiter with custom prefix", function () {
            var ratelimit = new ratelimit_1.Ratelimit({
                redis: mockRedis,
                limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h"),
                prefix: "custom-prefix"
            });
            (0, vitest_1.expect)(ratelimit).toBeInstanceOf(ratelimit_1.Ratelimit);
        });
        (0, vitest_1.it)("should create a ratelimiter with ephemeral cache enabled", function () {
            var ratelimit = new ratelimit_1.Ratelimit({
                redis: mockRedis,
                limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h"),
                ephemeralCache: true
            });
            (0, vitest_1.expect)(ratelimit).toBeInstanceOf(ratelimit_1.Ratelimit);
        });
        (0, vitest_1.it)("should create a ratelimiter with custom cache map", function () {
            var customCache = new Map();
            var ratelimit = new ratelimit_1.Ratelimit({
                redis: mockRedis,
                limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h"),
                ephemeralCache: customCache
            });
            (0, vitest_1.expect)(ratelimit).toBeInstanceOf(ratelimit_1.Ratelimit);
        });
    });
    (0, vitest_1.describe)("fixedWindow algorithm", function () {
        (0, vitest_1.it)("should allow requests within limit", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Mock Redis eval to return [1, 10] (1 request used, limit of 10)
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([1, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.fixedWindow(10, "1 m")
                        });
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.success).toBe(true);
                        (0, vitest_1.expect)(result.limit).toBe(10);
                        (0, vitest_1.expect)(result.remaining).toBe(9);
                        (0, vitest_1.expect)(result.reset).toBeGreaterThan(Date.now());
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should block requests when limit exceeded", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Mock Redis eval to return [11, 10] (11 requests used, limit of 10)
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([11, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.fixedWindow(10, "1 m")
                        });
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.success).toBe(false);
                        (0, vitest_1.expect)(result.limit).toBe(10);
                        (0, vitest_1.expect)(result.remaining).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should call Redis eval with correct parameters", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([1, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.fixedWindow(10, "1 m"),
                            prefix: "test"
                        });
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockRedis.eval).toHaveBeenCalledWith(vitest_1.expect.any(String), // Lua script
                        1, // Number of keys
                        "test:user:123", // Key
                        10, // Limit
                        60000, // Window in ms
                        1 // Increment by
                        );
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("slidingWindow algorithm", function () {
        (0, vitest_1.it)("should allow requests within limit", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Mock Redis eval to return [9, 10] (9 remaining, limit of 10)
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([9, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h")
                        });
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.success).toBe(true);
                        (0, vitest_1.expect)(result.limit).toBe(10);
                        (0, vitest_1.expect)(result.remaining).toBe(9);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should block requests when limit exceeded", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Mock Redis eval to return [-1, 10] (blocked, limit of 10)
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([-1, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h")
                        });
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.success).toBe(false);
                        (0, vitest_1.expect)(result.limit).toBe(10);
                        (0, vitest_1.expect)(result.remaining).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should call Redis eval with two keys (current and previous window)", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([9, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h"),
                            prefix: "test"
                        });
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockRedis.eval).toHaveBeenCalledWith(vitest_1.expect.any(String), // Lua script
                        2, // Number of keys (current + previous window)
                        vitest_1.expect.stringMatching(/^test:user:123:\d+$/), // Current window key
                        vitest_1.expect.stringMatching(/^test:user:123:\d+$/), // Previous window key
                        10, // Limit
                        vitest_1.expect.any(Number), // Current timestamp
                        3600000, // Window in ms (1 hour)
                        1 // Increment by
                        );
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("tokenBucket algorithm", function () {
        (0, vitest_1.it)("should allow requests when tokens available", function () { return __awaiter(void 0, void 0, void 0, function () {
            var nextRefill, ratelimit, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nextRefill = Date.now() + 1000;
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([9, nextRefill, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.tokenBucket(1, "1 s", 10)
                        });
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.success).toBe(true);
                        (0, vitest_1.expect)(result.limit).toBe(10);
                        (0, vitest_1.expect)(result.remaining).toBe(9);
                        (0, vitest_1.expect)(result.reset).toBe(nextRefill);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should block requests when bucket is empty", function () { return __awaiter(void 0, void 0, void 0, function () {
            var nextRefill, ratelimit, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nextRefill = Date.now() + 1000;
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([-1, nextRefill, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.tokenBucket(1, "1 s", 10)
                        });
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.success).toBe(false);
                        (0, vitest_1.expect)(result.limit).toBe(10);
                        (0, vitest_1.expect)(result.remaining).toBe(0);
                        (0, vitest_1.expect)(result.reset).toBe(nextRefill);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should use refillRate as maxTokens when not specified", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([4, Date.now() + 1000, 5]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.tokenBucket(5, "10 s"), // No maxTokens specified
                            prefix: "test"
                        });
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 1:
                        _a.sent();
                        // Check that maxTokens (5) was passed to the script
                        (0, vitest_1.expect)(mockRedis.eval).toHaveBeenCalledWith(vitest_1.expect.any(String), 1, "test:user:123", 5, // maxTokens defaults to refillRate
                        10000, // 10 seconds in ms
                        5, // refillRate
                        vitest_1.expect.any(Number), 1);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("ephemeral cache", function () {
        (0, vitest_1.it)("should use cache to block subsequent requests", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit, firstResult, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // First call: blocked (returns [-1, 10] meaning blocked with limit 10)
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([-1, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h"),
                            ephemeralCache: true
                        });
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 1:
                        firstResult = _a.sent();
                        (0, vitest_1.expect)(firstResult.success).toBe(false);
                        // Clear the mock call history but keep returning blocked result
                        vitest_1.vi.clearAllMocks();
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.success).toBe(false);
                        // Cache uses the full key including prefix
                        (0, vitest_1.expect)(mockRedis.eval).not.toHaveBeenCalled(); // Cache should prevent Redis call
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should allow requests after cache expires", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([-1, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h"),
                            ephemeralCache: true
                        });
                        // First request - blocked
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 1:
                        // First request - blocked
                        _a.sent();
                        // Advance time past the window
                        vitest_1.vi.advanceTimersByTime(3600001);
                        // Mock successful response for next call
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([9, 10]);
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 2:
                        result = _a.sent();
                        (0, vitest_1.expect)(mockRedis.eval).toHaveBeenCalled();
                        (0, vitest_1.expect)(result.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("timeout handling", function () {
        (0, vitest_1.it)("should return success on timeout", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit, resultPromise, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Create a promise that never resolves
                        mockRedis.eval = vitest_1.vi.fn().mockImplementation(function () {
                            return new Promise(function () {
                                /* intentionally never resolves */
                            });
                        });
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h"),
                            timeout: 1000
                        });
                        resultPromise = ratelimit.limit("user:123");
                        // Advance time past timeout
                        vitest_1.vi.advanceTimersByTime(1001);
                        return [4 /*yield*/, resultPromise];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.success).toBe(true);
                        (0, vitest_1.expect)(result.limit).toBe(0);
                        (0, vitest_1.expect)(result.remaining).toBe(0);
                        (0, vitest_1.expect)(result.reset).toBe(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("getRemaining()", function () {
        (0, vitest_1.it)("should return remaining tokens for fixedWindow", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([7, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.fixedWindow(10, "1 m")
                        });
                        return [4 /*yield*/, ratelimit.getRemaining("user:123")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.remaining).toBe(7);
                        (0, vitest_1.expect)(result.limit).toBe(10);
                        (0, vitest_1.expect)(result.reset).toBeGreaterThan(Date.now());
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should return remaining tokens for slidingWindow", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([5, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h")
                        });
                        return [4 /*yield*/, ratelimit.getRemaining("user:123")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.remaining).toBe(5);
                        (0, vitest_1.expect)(result.limit).toBe(10);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should return remaining tokens for tokenBucket", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([8, Date.now() + 1000, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.tokenBucket(1, "1 s", 10)
                        });
                        return [4 /*yield*/, ratelimit.getRemaining("user:123")];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.remaining).toBe(8);
                        (0, vitest_1.expect)(result.limit).toBe(10);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("resetUsedTokens()", function () {
        (0, vitest_1.it)("should delete the key for fixedWindow", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.fixedWindow(10, "1 m"),
                            prefix: "test"
                        });
                        return [4 /*yield*/, ratelimit.resetUsedTokens("user:123")];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockRedis.del).toHaveBeenCalledWith("test:user:123");
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should delete both window keys for slidingWindow", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h"),
                            prefix: "test"
                        });
                        return [4 /*yield*/, ratelimit.resetUsedTokens("user:123")];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockRedis.del).toHaveBeenCalledWith(vitest_1.expect.stringMatching(/^test:user:123:\d+$/), vitest_1.expect.stringMatching(/^test:user:123:\d+$/));
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should delete the key for tokenBucket", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.tokenBucket(1, "1 s", 10),
                            prefix: "test"
                        });
                        return [4 /*yield*/, ratelimit.resetUsedTokens("user:123")];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockRedis.del).toHaveBeenCalledWith("test:user:123");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("blockUntilReady()", function () {
        (0, vitest_1.it)("should return immediately if not rate limited", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([9, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h")
                        });
                        return [4 /*yield*/, ratelimit.blockUntilReady("user:123", 5000)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.success).toBe(true);
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should throw error for non-positive timeout", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h")
                        });
                        return [4 /*yield*/, (0, vitest_1.expect)(ratelimit.blockUntilReady("user:123", 0)).rejects.toThrow("timeout must be positive")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, vitest_1.expect)(ratelimit.blockUntilReady("user:123", -1)).rejects.toThrow("timeout must be positive")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should wait and retry when rate limited", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Use real timers for this test since fake timers + async is tricky
                        vitest_1.vi.useRealTimers();
                        // First call: blocked, second call: allowed
                        mockRedis.eval = vitest_1.vi
                            .fn()
                            .mockResolvedValueOnce([-1, 10]) // First: blocked
                            .mockResolvedValueOnce([9, 10]); // Second: allowed
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.slidingWindow(10, "100 ms") // Short window for fast test
                        });
                        return [4 /*yield*/, ratelimit.blockUntilReady("user:123", 500)];
                    case 1:
                        result = _a.sent();
                        (0, vitest_1.expect)(result.success).toBe(true);
                        (0, vitest_1.expect)(mockRedis.eval).toHaveBeenCalledTimes(2);
                        // Restore fake timers for other tests
                        vitest_1.vi.useFakeTimers();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    (0, vitest_1.describe)("analytics option (compatibility)", function () {
        (0, vitest_1.it)("should accept analytics option without error", function () {
            // analytics is a no-op for compatibility
            (0, vitest_1.expect)(function () {
                new ratelimit_1.Ratelimit({
                    redis: mockRedis,
                    limiter: ratelimit_1.Ratelimit.slidingWindow(10, "1 h"),
                    analytics: true
                });
            }).not.toThrow();
        });
    });
    (0, vitest_1.describe)("prefix handling", function () {
        (0, vitest_1.it)("should use default prefix when not specified", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([9, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.fixedWindow(10, "1 m")
                        });
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockRedis.eval).toHaveBeenCalledWith(vitest_1.expect.any(String), 1, "@carbon/ratelimit:user:123", // Default prefix
                        vitest_1.expect.anything(), vitest_1.expect.anything(), vitest_1.expect.anything());
                        return [2 /*return*/];
                }
            });
        }); });
        (0, vitest_1.it)("should use custom prefix when specified", function () { return __awaiter(void 0, void 0, void 0, function () {
            var ratelimit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mockRedis.eval = vitest_1.vi.fn().mockResolvedValue([9, 10]);
                        ratelimit = new ratelimit_1.Ratelimit({
                            redis: mockRedis,
                            limiter: ratelimit_1.Ratelimit.fixedWindow(10, "1 m"),
                            prefix: "myapp:ratelimit"
                        });
                        return [4 /*yield*/, ratelimit.limit("user:123")];
                    case 1:
                        _a.sent();
                        (0, vitest_1.expect)(mockRedis.eval).toHaveBeenCalledWith(vitest_1.expect.any(String), 1, "myapp:ratelimit:user:123", vitest_1.expect.anything(), vitest_1.expect.anything(), vitest_1.expect.anything());
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
