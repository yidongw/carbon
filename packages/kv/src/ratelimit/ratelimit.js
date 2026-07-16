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
exports.Ratelimit = void 0;
var cache_1 = require("./cache");
var duration_1 = require("./duration");
var scripts_1 = require("./scripts");
var DEFAULT_PREFIX = "@carbon/ratelimit";
/**
 * Rate limiter implementation compatible with @upstash/ratelimit API
 * Uses ioredis instead of Upstash REST client
 */
var Ratelimit = /** @class */ (function () {
    function Ratelimit(config) {
        var _a, _b;
        this.redis = config.redis;
        this.limiter = config.limiter;
        this.prefix = (_a = config.prefix) !== null && _a !== void 0 ? _a : DEFAULT_PREFIX;
        this.timeout = (_b = config.timeout) !== null && _b !== void 0 ? _b : 5000;
        var cache;
        if (config.ephemeralCache === true) {
            cache = new cache_1.Cache(new Map());
        }
        else if (config.ephemeralCache instanceof Map) {
            cache = new cache_1.Cache(config.ephemeralCache);
        }
        this.ctx = {
            redis: this.redis,
            prefix: this.prefix,
            cache: cache
        };
    }
    /**
     * Check rate limit for an identifier
     * @param identifier - Unique identifier (e.g., user ID, IP address)
     * @param opts - Optional limit options
     */
    Ratelimit.prototype.limit = function (identifier, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var key, _a, blocked, reset, response, timeoutPromise;
            var _this = this;
            return __generator(this, function (_b) {
                key = this.getKey(identifier);
                // Check ephemeral cache first (use key for consistency with blockUntil)
                if (this.ctx.cache) {
                    _a = this.ctx.cache.isBlocked(key), blocked = _a.blocked, reset = _a.reset;
                    if (blocked) {
                        return [2 /*return*/, {
                                success: false,
                                limit: 0,
                                remaining: 0,
                                reset: reset,
                                pending: Promise.resolve()
                            }];
                    }
                }
                response = this.limiter().limit(this.ctx, key, opts === null || opts === void 0 ? void 0 : opts.rate);
                if (this.timeout > 0) {
                    timeoutPromise = new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve({
                                success: true,
                                limit: 0,
                                remaining: 0,
                                reset: 0,
                                pending: Promise.resolve()
                            });
                        }, _this.timeout);
                    });
                    return [2 /*return*/, Promise.race([response, timeoutPromise])];
                }
                return [2 /*return*/, response];
            });
        });
    };
    /**
     * Block until the rate limit allows the request or timeout is reached
     * @param identifier - Unique identifier
     * @param timeout - Maximum time to wait in ms
     */
    Ratelimit.prototype.blockUntilReady = function (identifier, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            var deadline, res, _loop_1, this_1, state_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (timeout <= 0) {
                            throw new Error("timeout must be positive");
                        }
                        deadline = Date.now() + timeout;
                        _loop_1 = function () {
                            var wait;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, this_1.limit(identifier)];
                                    case 1:
                                        res = _b.sent();
                                        if (res.success) {
                                            return [2 /*return*/, { value: res }];
                                        }
                                        if (res.reset === 0) {
                                            throw new Error("Unexpected reset value of 0");
                                        }
                                        wait = Math.min(res.reset, deadline) - Date.now();
                                        if (wait <= 0 || Date.now() >= deadline) {
                                            return [2 /*return*/, { value: res }];
                                        }
                                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, wait); })];
                                    case 2:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 3];
                        return [5 /*yield**/, _loop_1()];
                    case 2:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get remaining tokens for an identifier without consuming
     * @param identifier - Unique identifier
     */
    Ratelimit.prototype.getRemaining = function (identifier) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                key = this.getKey(identifier);
                return [2 /*return*/, this.limiter().getRemaining(this.ctx, key)];
            });
        });
    };
    /**
     * Reset the rate limit for an identifier
     * @param identifier - Unique identifier
     */
    Ratelimit.prototype.resetUsedTokens = function (identifier) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                key = this.getKey(identifier);
                return [2 /*return*/, this.limiter().resetTokens(this.ctx, key)];
            });
        });
    };
    Ratelimit.prototype.getKey = function (identifier) {
        return "".concat(this.prefix, ":").concat(identifier);
    };
    // ===== Static Algorithm Factory Methods =====
    /**
     * Fixed Window Rate Limiting
     *
     * Each request inside a fixed time window increases a counter.
     * Once the counter reaches the maximum, all further requests are rejected.
     *
     * Pros: Simple, low memory usage
     * Cons: Can allow bursts at window boundaries
     *
     * @param tokens - Maximum requests per window
     * @param window - Window duration (e.g., "10 s", "1 m", "1 h")
     */
    Ratelimit.fixedWindow = function (tokens, window) {
        var windowMs = (0, duration_1.ms)(window);
        return function () { return ({
            limit: function (ctx, key, rate) {
                return __awaiter(this, void 0, void 0, function () {
                    var limit, now, result, current, effectiveLimit, remaining, reset, success;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                limit = rate !== null && rate !== void 0 ? rate : tokens;
                                now = Date.now();
                                return [4 /*yield*/, ctx.redis.eval(scripts_1.fixedWindowScript, 1, key, limit, windowMs, 1)];
                            case 1:
                                result = (_a.sent());
                                current = result[0], effectiveLimit = result[1];
                                remaining = Math.max(0, effectiveLimit - current);
                                reset = now + windowMs - (now % windowMs) + windowMs;
                                success = current <= effectiveLimit;
                                // Update ephemeral cache if blocked
                                if (!success && ctx.cache) {
                                    ctx.cache.blockUntil(key, reset);
                                }
                                return [2 /*return*/, {
                                        success: success,
                                        limit: effectiveLimit,
                                        remaining: remaining,
                                        reset: reset,
                                        pending: Promise.resolve()
                                    }];
                        }
                    });
                });
            },
            getRemaining: function (ctx, key) {
                return __awaiter(this, void 0, void 0, function () {
                    var result, remaining, limit, now, reset;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, ctx.redis.eval(scripts_1.fixedWindowRemainingScript, 1, key, tokens)];
                            case 1:
                                result = (_a.sent());
                                remaining = result[0], limit = result[1];
                                now = Date.now();
                                reset = now + windowMs - (now % windowMs) + windowMs;
                                return [2 /*return*/, { remaining: Math.max(0, remaining), reset: reset, limit: limit }];
                        }
                    });
                });
            },
            resetTokens: function (ctx, key) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, ctx.redis.del(key)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
        }); };
    };
    /**
     * Sliding Window Rate Limiting
     *
     * Combines two fixed windows with a weighted score for smoother rate limiting.
     * Prevents the boundary burst problem of fixed windows.
     *
     * Pros: Better boundary behavior, more accurate rate limiting
     * Cons: Slightly higher memory (2 keys per identifier)
     *
     * @param tokens - Maximum requests per window
     * @param window - Window duration (e.g., "10 s", "1 m", "1 h")
     */
    Ratelimit.slidingWindow = function (tokens, window) {
        var windowMs = (0, duration_1.ms)(window);
        return function () { return ({
            limit: function (ctx, key, rate) {
                return __awaiter(this, void 0, void 0, function () {
                    var limit, now, currentWindow, currentKey, previousKey, result, remaining, effectiveLimit, success, reset;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                limit = rate !== null && rate !== void 0 ? rate : tokens;
                                now = Date.now();
                                currentWindow = Math.floor(now / windowMs);
                                currentKey = "".concat(key, ":").concat(currentWindow);
                                previousKey = "".concat(key, ":").concat(currentWindow - 1);
                                return [4 /*yield*/, ctx.redis.eval(scripts_1.slidingWindowScript, 2, currentKey, previousKey, limit, now, windowMs, 1)];
                            case 1:
                                result = (_a.sent());
                                remaining = result[0], effectiveLimit = result[1];
                                success = remaining >= 0;
                                reset = (currentWindow + 1) * windowMs;
                                // Update ephemeral cache if blocked
                                if (!success && ctx.cache) {
                                    ctx.cache.blockUntil(key, reset);
                                }
                                return [2 /*return*/, {
                                        success: success,
                                        limit: effectiveLimit,
                                        remaining: Math.max(0, remaining),
                                        reset: reset,
                                        pending: Promise.resolve()
                                    }];
                        }
                    });
                });
            },
            getRemaining: function (ctx, key) {
                return __awaiter(this, void 0, void 0, function () {
                    var now, currentWindow, currentKey, previousKey, result, remaining, limit, reset;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                now = Date.now();
                                currentWindow = Math.floor(now / windowMs);
                                currentKey = "".concat(key, ":").concat(currentWindow);
                                previousKey = "".concat(key, ":").concat(currentWindow - 1);
                                return [4 /*yield*/, ctx.redis.eval(scripts_1.slidingWindowRemainingScript, 2, currentKey, previousKey, tokens, now, windowMs)];
                            case 1:
                                result = (_a.sent());
                                remaining = result[0], limit = result[1];
                                reset = (currentWindow + 1) * windowMs;
                                return [2 /*return*/, { remaining: Math.max(0, remaining), reset: reset, limit: limit }];
                        }
                    });
                });
            },
            resetTokens: function (ctx, key) {
                return __awaiter(this, void 0, void 0, function () {
                    var now, currentWindow, currentKey, previousKey;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                now = Date.now();
                                currentWindow = Math.floor(now / windowMs);
                                currentKey = "".concat(key, ":").concat(currentWindow);
                                previousKey = "".concat(key, ":").concat(currentWindow - 1);
                                return [4 /*yield*/, ctx.redis.del(currentKey, previousKey)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
        }); };
    };
    /**
     * Token Bucket Rate Limiting
     *
     * A bucket filled with tokens that refills at a constant rate.
     * Allows bursts up to the bucket size while maintaining an average rate.
     *
     * Pros: Allows controlled bursts, smooth rate limiting
     * Cons: Slightly more complex, requires hash storage
     *
     * @param refillRate - Tokens added per interval
     * @param interval - Refill interval duration (e.g., "1 s", "10 s")
     * @param maxTokens - Maximum tokens in bucket (burst capacity)
     */
    Ratelimit.tokenBucket = function (refillRate, interval, maxTokens) {
        var intervalMs = (0, duration_1.ms)(interval);
        var bucketSize = maxTokens !== null && maxTokens !== void 0 ? maxTokens : refillRate;
        return function () { return ({
            limit: function (ctx, key, rate) {
                return __awaiter(this, void 0, void 0, function () {
                    var limit, now, result, remaining, reset, effectiveLimit, success;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                limit = rate !== null && rate !== void 0 ? rate : bucketSize;
                                now = Date.now();
                                return [4 /*yield*/, ctx.redis.eval(scripts_1.tokenBucketScript, 1, key, limit, intervalMs, refillRate, now, 1)];
                            case 1:
                                result = (_a.sent());
                                remaining = result[0], reset = result[1], effectiveLimit = result[2];
                                success = remaining >= 0;
                                // Update ephemeral cache if blocked
                                if (!success && ctx.cache) {
                                    ctx.cache.blockUntil(key, reset);
                                }
                                return [2 /*return*/, {
                                        success: success,
                                        limit: effectiveLimit,
                                        remaining: Math.max(0, remaining),
                                        reset: reset,
                                        pending: Promise.resolve()
                                    }];
                        }
                    });
                });
            },
            getRemaining: function (ctx, key) {
                return __awaiter(this, void 0, void 0, function () {
                    var now, result, remaining, reset, limit;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                now = Date.now();
                                return [4 /*yield*/, ctx.redis.eval(scripts_1.tokenBucketRemainingScript, 1, key, bucketSize, intervalMs, refillRate, now)];
                            case 1:
                                result = (_a.sent());
                                remaining = result[0], reset = result[1], limit = result[2];
                                return [2 /*return*/, { remaining: Math.max(0, remaining), reset: reset, limit: limit }];
                        }
                    });
                });
            },
            resetTokens: function (ctx, key) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, ctx.redis.del(key)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            }
        }); };
    };
    return Ratelimit;
}());
exports.Ratelimit = Ratelimit;
