"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseClient = void 0;
/**
 * Database client singleton for server-side usage.
 * Similar to Prisma client singleton. from https://www.prisma.io/docs/guides/react-router-7
 * Polluting the global namespace like this is usually discouraged, but it's okay as we're just caching connections during development.
 * In production, this code path is not hit multiple times as ESM modules are only singletons by default.
 */
var client_1 = require("@carbon/database/client");
var kysely_1 = require("kysely");
var init = function () {
    var pool = (0, client_1.getPostgresConnectionPool)(10);
    // We use the PostgresDriver from Kysely here as this code only runs in Node environment
    return (0, client_1.getPostgresClient)(pool, kysely_1.PostgresDriver);
};
var globalForKysely = globalThis;
var database = (_a = globalForKysely.kysely) !== null && _a !== void 0 ? _a : init();
if (process.env.NODE_ENV !== "production")
    globalForKysely.kysely = database;
var getDatabaseClient = function () { return database; };
exports.getDatabaseClient = getDatabaseClient;
