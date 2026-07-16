"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
/**
 * In-memory cache for blocking identifiers that have exceeded their rate limit.
 * This prevents unnecessary Redis calls for already-blocked identifiers.
 */
var Cache = /** @class */ (function () {
    function Cache(cache) {
        this.cache = cache !== null && cache !== void 0 ? cache : new Map();
    }
    /**
     * Check if an identifier is blocked
     */
    Cache.prototype.isBlocked = function (key) {
        var reset = this.cache.get(key);
        if (!reset) {
            return { blocked: false, reset: 0 };
        }
        if (Date.now() >= reset) {
            this.cache.delete(key);
            return { blocked: false, reset: 0 };
        }
        return { blocked: true, reset: reset };
    };
    /**
     * Block an identifier until a specific timestamp
     */
    Cache.prototype.blockUntil = function (key, reset) {
        this.cache.set(key, reset);
    };
    /**
     * Set a value in the cache
     */
    Cache.prototype.set = function (key, value) {
        this.cache.set(key, value);
    };
    /**
     * Get a value from the cache
     */
    Cache.prototype.get = function (key) {
        return this.cache.get(key);
    };
    /**
     * Increment a value in the cache
     */
    Cache.prototype.incr = function (key) {
        var _a;
        var current = (_a = this.cache.get(key)) !== null && _a !== void 0 ? _a : 0;
        var next = current + 1;
        this.cache.set(key, next);
        return next;
    };
    return Cache;
}());
exports.Cache = Cache;
