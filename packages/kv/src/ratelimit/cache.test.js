"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var cache_1 = require("./cache");
(0, vitest_1.describe)("Cache", function () {
    (0, vitest_1.beforeEach)(function () {
        vitest_1.vi.useFakeTimers();
    });
    (0, vitest_1.afterEach)(function () {
        vitest_1.vi.useRealTimers();
    });
    (0, vitest_1.describe)("constructor", function () {
        (0, vitest_1.it)("should create cache with empty map by default", function () {
            var cache = new cache_1.Cache();
            (0, vitest_1.expect)(cache.get("key")).toBeUndefined();
        });
        (0, vitest_1.it)("should create cache with provided map", function () {
            var existingMap = new Map();
            existingMap.set("existing", 123);
            var cache = new cache_1.Cache(existingMap);
            (0, vitest_1.expect)(cache.get("existing")).toBe(123);
        });
    });
    (0, vitest_1.describe)("isBlocked()", function () {
        (0, vitest_1.it)("should return not blocked for unknown key", function () {
            var cache = new cache_1.Cache();
            var result = cache.isBlocked("unknown");
            (0, vitest_1.expect)(result.blocked).toBe(false);
            (0, vitest_1.expect)(result.reset).toBe(0);
        });
        (0, vitest_1.it)("should return blocked when reset time is in the future", function () {
            var cache = new cache_1.Cache();
            var futureTime = Date.now() + 10000; // 10 seconds in future
            cache.blockUntil("user:123", futureTime);
            var result = cache.isBlocked("user:123");
            (0, vitest_1.expect)(result.blocked).toBe(true);
            (0, vitest_1.expect)(result.reset).toBe(futureTime);
        });
        (0, vitest_1.it)("should return not blocked when reset time has passed", function () {
            var cache = new cache_1.Cache();
            var pastTime = Date.now() + 5000;
            cache.blockUntil("user:123", pastTime);
            // Advance time past the reset
            vitest_1.vi.advanceTimersByTime(6000);
            var result = cache.isBlocked("user:123");
            (0, vitest_1.expect)(result.blocked).toBe(false);
            (0, vitest_1.expect)(result.reset).toBe(0);
        });
        (0, vitest_1.it)("should clean up expired entries on check", function () {
            var cache = new cache_1.Cache();
            var resetTime = Date.now() + 5000;
            cache.blockUntil("user:123", resetTime);
            // Advance time past the reset
            vitest_1.vi.advanceTimersByTime(6000);
            // First check should clean up
            cache.isBlocked("user:123");
            // Key should now be gone
            (0, vitest_1.expect)(cache.get("user:123")).toBeUndefined();
        });
    });
    (0, vitest_1.describe)("blockUntil()", function () {
        (0, vitest_1.it)("should block a key until specified time", function () {
            var cache = new cache_1.Cache();
            var resetTime = Date.now() + 10000;
            cache.blockUntil("user:123", resetTime);
            (0, vitest_1.expect)(cache.get("user:123")).toBe(resetTime);
        });
        (0, vitest_1.it)("should overwrite existing block time", function () {
            var cache = new cache_1.Cache();
            var firstReset = Date.now() + 5000;
            var secondReset = Date.now() + 10000;
            cache.blockUntil("user:123", firstReset);
            cache.blockUntil("user:123", secondReset);
            (0, vitest_1.expect)(cache.get("user:123")).toBe(secondReset);
        });
    });
    (0, vitest_1.describe)("set() and get()", function () {
        (0, vitest_1.it)("should set and get values", function () {
            var cache = new cache_1.Cache();
            cache.set("key1", 100);
            cache.set("key2", 200);
            (0, vitest_1.expect)(cache.get("key1")).toBe(100);
            (0, vitest_1.expect)(cache.get("key2")).toBe(200);
        });
        (0, vitest_1.it)("should return undefined for non-existent keys", function () {
            var cache = new cache_1.Cache();
            (0, vitest_1.expect)(cache.get("nonexistent")).toBeUndefined();
        });
        (0, vitest_1.it)("should overwrite existing values", function () {
            var cache = new cache_1.Cache();
            cache.set("key", 100);
            cache.set("key", 200);
            (0, vitest_1.expect)(cache.get("key")).toBe(200);
        });
    });
    (0, vitest_1.describe)("incr()", function () {
        (0, vitest_1.it)("should increment from 0 for new keys", function () {
            var cache = new cache_1.Cache();
            var result = cache.incr("counter");
            (0, vitest_1.expect)(result).toBe(1);
            (0, vitest_1.expect)(cache.get("counter")).toBe(1);
        });
        (0, vitest_1.it)("should increment existing values", function () {
            var cache = new cache_1.Cache();
            cache.set("counter", 5);
            (0, vitest_1.expect)(cache.incr("counter")).toBe(6);
            (0, vitest_1.expect)(cache.incr("counter")).toBe(7);
            (0, vitest_1.expect)(cache.incr("counter")).toBe(8);
        });
        (0, vitest_1.it)("should handle multiple counters independently", function () {
            var cache = new cache_1.Cache();
            cache.incr("counter1");
            cache.incr("counter1");
            cache.incr("counter2");
            (0, vitest_1.expect)(cache.get("counter1")).toBe(2);
            (0, vitest_1.expect)(cache.get("counter2")).toBe(1);
        });
    });
});
