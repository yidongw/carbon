"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuntime = getRuntime;
exports.getPostgresConnectionPool = getPostgresConnectionPool;
exports.getPostgresClient = getPostgresClient;
var kysely_1 = require("kysely");
// Aliased it as pg so can be imported as-is in Node environment
var pg_1 = require("pg");
function getRuntime() {
    if (typeof globalThis.Deno !== "undefined") {
        return "deno";
    }
    if (typeof globalThis.window !== "undefined") {
        return "browser";
    }
    return "node";
}
function getPostgresConnectionPool(connections) {
    var runtime = getRuntime();
    switch (runtime) {
        case "deno": {
            // @ts-expect-error -- Deno global is only available in Deno runtime
            var url = Deno.env.get("SUPABASE_DB_URL");
            var connectionPoolerUrl = url.includes("supabase.co")
                ? url.replace("5432", "6543")
                : url;
            // @ts-ignore Compat
            return new pg_1.Pool(connectionPoolerUrl, connections);
        }
        case "node": {
            var url = process.env.SUPABASE_DB_URL;
            var connectionPoolerUrl = url.includes("supabase.co")
                ? url.replace("5432", "6543")
                : url;
            return new pg_1.Pool({
                connectionString: connectionPoolerUrl,
                max: connections,
            });
        }
        default:
            throw new Error("getPostgresConnectionPool is not supported in non-server environments");
    }
}
function getPostgresClient(pool, driver) {
    var runtime = getRuntime();
    switch (runtime) {
        case "node":
        case "deno": {
            return new kysely_1.Kysely({
                dialect: {
                    createAdapter: function () {
                        return new kysely_1.PostgresAdapter();
                    },
                    createDriver: function () {
                        return new driver({ pool: pool });
                    },
                    createIntrospector: function (db) {
                        return new kysely_1.PostgresIntrospector(db);
                    },
                    createQueryCompiler: function () {
                        return new kysely_1.PostgresQueryCompiler();
                    },
                },
            });
        }
        default:
            throw new Error("getPostgresClient is not supported in non-server environments");
    }
}
