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
Object.defineProperty(exports, "__esModule", { value: true });
var env_1 = require("@carbon/env");
var ioredis_1 = require("ioredis");
if (!env_1.REDIS_URL) {
    throw new Error("REDIS_URL is not defined");
}
// Capture into a local const so the narrowing survives inside closures.
var redisUrl = env_1.REDIS_URL;
function createRedis() {
    var useTls = redisUrl.startsWith("rediss://") || redisUrl.includes(".upstash.io");
    var client = new ioredis_1.default(redisUrl, __assign(__assign({ maxRetriesPerRequest: 3, enableOfflineQueue: true, enableReadyCheck: true }, (useTls ? { tls: {} } : {})), { reconnectOnError: function (err) {
            var _a;
            var message = (_a = err.message) !== null && _a !== void 0 ? _a : "";
            return (message.includes("Connection is closed") ||
                message.includes("ECONNRESET") ||
                message.includes("ETIMEDOUT"));
        }, retryStrategy: function (times) {
            if (times > 3)
                return null;
            return Math.min(times * 50, 2000);
        } }));
    // Serverless warm instances reuse a global client; Upstash closes idle sockets.
    var drop = function () {
        if (global.__redis === client) {
            global.__redis = undefined;
        }
    };
    client.on("close", drop);
    client.on("end", drop);
    return client;
}
function getRedis() {
    var existing = global.__redis;
    if (!existing || existing.status === "end" || existing.status === "close") {
        var client = createRedis();
        global.__redis = client;
        return client;
    }
    return existing;
}
// Always resolve the live client — a module-level reference can point at a
// connection GoTrue/Upstash closed between serverless invocations.
var redis = new Proxy({}, {
    get: function (_target, prop) {
        var client = getRedis();
        var value = client[prop];
        return typeof value === "function"
            ? value.bind(client)
            : value;
    }
});
exports.default = redis;
